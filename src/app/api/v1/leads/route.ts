import { NextRequest, NextResponse } from "next/server"
import schema from "@/contracts/schemas/lead.create.json"
import { createLead } from "@/domain/leads/create-lead"
import { enqueueLead } from "@/lib/security/burstQueue"
import { overloadGuard } from "@/lib/security/overload"
import { rateLimit } from "@/lib/rate-limit"
import { problem } from "@/lib/problem"
import { log } from "@/lib/logger"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"

const ajv = new Ajv2020()
addFormats(ajv)
const validate = ajv.compile(schema)

export async function POST(req: NextRequest) {

  const requestId = crypto.randomUUID()

  try {

    const ip =
      req.headers.get("x-real-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      "unknown"

    const body = await req.json()

    if (!validate(body)) {
      return problem({
        type: "https://www.solarisnerja.com/problems/validation",
        title: "Validation error",
        status: 400,
        detail: "Invalid payload",
        instance: "/api/v1/leads"
      })
    }

    if (!rateLimit(ip)) {
      return problem({
        type: "https://www.solarisnerja.com/problems/rate-limit",
        title: "Too Many Requests",
        status: 429,
        detail: "Rate limit exceeded",
        instance: "/api/v1/leads"
      })
    }

    if (!overloadGuard(ip)) {
      return NextResponse.json(
        { error: "server overloaded" },
        { status: 503 }
      )
    }

    const lead = createLead({
      email: body.email,
      eventId: body.eventId,
      ipAddress: ip,
      consentGiven: true
    })

    enqueueLead(lead)

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
      instance: "/api/v1/leads"
    })
  }
}

// --------------------------------------------------
// test helpers (exposed only for unit tests)
// --------------------------------------------------

export { _isValidIp, _getClientIp } from "@/lib/ip"

