import { NextRequest, NextResponse } from "next/server"
import { createLead } from "@/domain/leads/create-lead"
import { enqueueLead } from "@/lib/security/queueFacade"
import { processLeadQueue } from "@/lib/security/leadWorker"
import { _getClientIp, _isValidIp } from "@/lib/ip"
import { log } from "@/lib/logger"
import { verifyCsrf } from "@/lib/security/verifyCsrf"
import { hashIp } from "@/lib/security/hashIp"
import { rateLimit } from "@/lib/rate-limit"
import * as Sentry from "@sentry/nextjs"
import { checkIdempotencyKey, isValidIdempotencyKey } from "@/lib/security/idempotency"

export { _getClientIp, _isValidIp }

export async function POST(req: NextRequest) {

  try {

    // Idempotency-Key: evitar procesamiento duplicado en retries del cliente
    const idempotencyKey = req.headers.get("idempotency-key")
    if (idempotencyKey) {
      if (!isValidIdempotencyKey(idempotencyKey)) {
        return NextResponse.json(
          { error: "invalid idempotency key format (UUID v4 expected)" },
          { status: 400 }
        )
      }
      if (checkIdempotencyKey(idempotencyKey)) {
        return NextResponse.json({ success: true, deduplicated: true })
      }
    }

    const rawIpForRl = _getClientIp(req)
    const allowed = await rateLimit(rawIpForRl)
    if (!allowed) {
      return NextResponse.json(
        { error: "too many requests" },
        { status: 429 }
      )
    }

    if (!verifyCsrf(req)) {
      return NextResponse.json(
        { error: "invalid csrf token" },
        { status: 403 }
      )
    }

    const body = await req.json()

    if (!body?.email || !body?.eventId) {
      return NextResponse.json(
        { error: "invalid payload" },
        { status: 400 }
      )
    }

    if (typeof body.consentGiven !== "boolean" || !body.consentGiven) {
      return NextResponse.json(
        { error: "consent is required" },
        { status: 400 }
      )
    }

    const rawIp = _getClientIp(req)

    const lead = createLead({
      email: body.email,
      eventId: body.eventId,
      ipAddress: hashIp(rawIp),
      consentGiven: body.consentGiven,
      name: body.name,
      surname: body.surname,
      phone: body.phone,
      profession: body.profession,
      source: body.source,
    })

    await enqueueLead(lead)

    processLeadQueue()

    return NextResponse.json({ success: true })

  } catch (error) {

    log("error", "lead_api_error", { error })
    Sentry.captureException(error, { tags: { route: "/api/v1/leads" } })

    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    )

  }

}
