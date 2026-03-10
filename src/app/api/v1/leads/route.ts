import { NextRequest, NextResponse } from "next/server"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"

import schema from "@/contracts/schemas/lead.create.json"
import { enqueueLead } from "@/lib/security/burstQueue"
import { processLeadQueue } from "@/lib/security/leadWorker"
import { rateLimit } from "@/lib/rate-limit"
import { problem } from "@/lib/problem"
import { log } from "@/lib/logger"
import { isIP } from "node:net"

type LeadInput = {
  email: string
  eventId: string
  company?: string
}

const ajv = new Ajv2020()
addFormats(ajv)
const validate = ajv.compile<LeadInput>(schema)

export function _isValidIp(value: string): boolean {
  return isIP(value) !== 0
}

export function _getClientIp(req: NextRequest): string {

  const realIp = req.headers.get("x-real-ip")?.trim()

  if (realIp && _isValidIp(realIp)) {
    return realIp
  }

  const forwardedFor = req.headers.get("x-forwarded-for")

  const firstForwarded = forwardedFor?.split(",")[0]?.trim()

  if (firstForwarded && _isValidIp(firstForwarded)) {
    return firstForwarded
  }

  return "unknown"
}

export async function POST(req: NextRequest) {

  const instance = "/api/v1/leads"

  const requestId =
    req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {

    const ip = _getClientIp(req)

    log("info", "lead_request_received", { requestId, ip })

    const body: unknown = await req.json()

    if (!validate(body)) {
      log("warn", "validation_failed", { requestId })
      return problem({
        type: "https://www.solarisnerja.com/problems/validation",
        title: "Validation error",
        status: 400,
        detail: "Invalid payload",
        instance,
      })
    }

    if (body.company && body.company.trim().length > 0) {
      log("warn", "honeypot_triggered", { requestId })
      return NextResponse.json({ success: true })
    }

    if (!rateLimit(ip)) {
      log("warn", "rate_limit_triggered", { requestId, ip })
      return problem({
        type: "https://www.solarisnerja.com/problems/rate-limit",
        title: "Too Many Requests",
        status: 429,
        detail: "Demasiadas solicitudes.",
        instance,
      })
    }

    const queued = enqueueLead({
      email: body.email,
      eventId: body.eventId,
      ipAddress: ip,
    })

    if (!queued) {

      log("error", "burst_queue_full", { requestId })

      return NextResponse.json(
        { error: "server overloaded" },
        { status: 503 }
      )
    }

    processLeadQueue()

    return NextResponse.json({ success: true })

  } catch (error: unknown) {

    const errMsg =
      error instanceof Error ? error.message : String(error)

    log("error", "internal_error", { requestId, error: errMsg })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance,
    })
  }
}
