import { NextRequest, NextResponse } from "next/server"
import { startQueueDaemon } from "@/lib/security/queueDaemon"
import { enqueueLead } from "@/lib/security/burstQueue"
import { createLead } from "@/domain/leads/create-lead"
import { _getClientIp } from "@/lib/ip"

startQueueDaemon()

export async function POST(req:NextRequest){

  const body = await req.json()

  const ip = _getClientIp(req)

  const lead = createLead({
    email: body.email,
    eventId: body.eventId,
    ipAddress: ip,
    consentGiven:true
  })

  enqueueLead(lead)

  return NextResponse.json({ success:true })

}

// Test compatibility exports
export { _getClientIp, _isValidIp } from "@/lib/ip"


// re-export helpers for unit tests
export { _getClientIp, _isValidIp } from "@/lib/ip"

