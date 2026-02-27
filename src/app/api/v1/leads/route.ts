import { NextRequest, NextResponse } from "next/server"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"

import schema from "@/contracts/schemas/lead.create.json"
import { createLead } from "@/domain/leads/create-lead"
import { saveLead } from "@/adapters/db/lead-repository"
import { rateLimit } from "@/lib/rate-limit"
import { problem } from "@/lib/problem"
import { log } from "@/lib/logger"

type LeadInput = {
  email: string
  eventId: string
  company?: string
}

const ajv = new Ajv2020()
addFormats(ajv)
const validate = ajv.compile<LeadInput>(schema)

const ipv4Regex =
  /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/
const ipv6Regex =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/

/** Exposed for testing */
export function _isValidIp(value: string): boolean {
  return ipv4Regex.test(value) || ipv6Regex.test(value)
}

/** Exposed for testing */
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
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {
    // Prefer x-real-ip (Vercel) when valid, otherwise parse first x-forwarded-for IP.
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

    // Honeypot check before rate limiting to prevent bots from consuming resources
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

    const lead = createLead(body)
    await saveLead(lead)

    log("info", "lead_saved", { requestId, eventId: lead.eventId })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    const errStack = error instanceof Error ? error.stack : undefined
    log("error", "internal_error", { requestId, error: errMsg, stack: errStack })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance,
    })
  }
}
