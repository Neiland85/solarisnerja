import { NextRequest, NextResponse } from "next/server"
import { createLead } from "@/domain/leads/create-lead"
import { enqueueLead } from "@/lib/security/burstQueue"
import { processLeadQueue } from "@/lib/security/leadWorker"
import { _getClientIp, _isValidIp } from "@/lib/ip"
import { log } from "@/lib/logger"
import { verifyCsrf } from "@/lib/security/verifyCsrf"
import { hashIp } from "@/lib/security/hashIp"

export { _getClientIp, _isValidIp }

export async function POST(req: NextRequest) {

  try {

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

    enqueueLead(lead)

    processLeadQueue()

    return NextResponse.json({ success: true })

  } catch (error) {

    log("error", "lead_api_error", { error })

    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    )

  }

}
