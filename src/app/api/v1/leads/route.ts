import { NextRequest, NextResponse } from "next/server"
import { createLead } from "@/domain/leads/create-lead"
import { enqueueLead } from "@/lib/security/burstQueue"
import { processLeadQueue } from "@/lib/security/leadWorker"
import { _getClientIp, _isValidIp } from "@/lib/ip"
import { log } from "@/lib/logger"

export { _getClientIp, _isValidIp }

export async function POST(req: NextRequest) {

  try {

    const body = await req.json()

    if (!body?.email || !body?.eventId) {
      return NextResponse.json(
        { error: "invalid payload" },
        { status: 400 }
      )
    }

    const ip = _getClientIp(req)

    const lead = createLead({
      email: body.email,
      eventId: body.eventId,
      ipAddress: ip,
      consentGiven: true
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
