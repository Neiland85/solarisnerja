import { NextRequest, NextResponse } from "next/server"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"

import schema from "@/contracts/schemas/lead.create.json"
import { createLead } from "@/domain/leads/create-lead"
import { saveLead } from "@/adapters/db/lead-repository"
import { rateLimit } from "@/lib/rate-limit"
import { overloadGuard } from "@/lib/security/overload"
import { problem } from "@/lib/problem"
import { log } from "@/lib/logger"

import { _getClientIp, _isValidIp } from "@/lib/ip"

/*
Re-export for tests
*/
export { _getClientIp, _isValidIp }

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

    const ip = _getClientIp(req)

    if (!overloadGuard(ip)) {
      return NextResponse.json(
        { error: "server overloaded" },
        { status: 503 }
      )
    }

    const body: unknown = await req.json()

    if (!validate(body)) {
      return problem({
        type: "https://www.solarisnerja.com/problems/validation",
        title: "Validation error",
        status: 400,
        detail: "Invalid payload",
        instance
      })
    }

    if ((body as LeadInput).company?.trim()) {
      return NextResponse.json({ success: true })
    }

    if (!rateLimit(ip)) {
      return problem({
        type: "https://www.solarisnerja.com/problems/rate-limit",
        title: "Too Many Requests",
        status: 429,
        detail: "Demasiadas solicitudes.",
        instance
      })
    }

    const lead = createLead({
      email: (body as LeadInput).email,
      eventId: (body as LeadInput).eventId,
      ipAddress: ip,
      consentGiven: true
    })

    await saveLead(lead)

    log("info", "lead_saved", { requestId, eventId: lead.eventId })

    return NextResponse.json({ success: true })

  } catch (error) {

    const errMsg = error instanceof Error ? error.message : String(error)

    log("error", "internal_error", { requestId, error: errMsg })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance
    })
  }
}
