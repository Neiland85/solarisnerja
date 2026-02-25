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

export async function POST(req: NextRequest) {
  const instance = "/api/v1/leads"
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown"

    log("info", "lead_request_received", { requestId, ip })

    if (!rateLimit(ip)) {
      log("warn", "rate_limit_triggered", { requestId, ip })
      return problem({
        type: "https://www.solarisnerja.com/problems/rate-limit",
        title: "Too Many Requests",
        status: 429,
        detail: "Demasiadas solicitudes.",
        instance
      })
    }

    const body: unknown = await req.json()

    if (!validate(body)) {
      log("warn", "validation_failed", { requestId })
      return problem({
        type: "https://www.solarisnerja.com/problems/validation",
        title: "Validation error",
        status: 400,
        detail: "Invalid payload",
        instance
      })
    }

    if (body.company && body.company.trim().length > 0) {
      log("warn", "honeypot_triggered", { requestId })
      return NextResponse.json({ success: true })
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
      instance
    })
  }
}
