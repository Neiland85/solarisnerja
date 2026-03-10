import { NextRequest, NextResponse } from "next/server"
import { createLead } from "@/domain/leads/create-lead"
import { enqueueLead } from "@/lib/security/burstQueue"
import { _getClientIp } from "@/lib/ip"
import { problem } from "@/lib/problem"
import { log } from "@/lib/logger"

export { _getClientIp }

export async function POST(req: NextRequest) {

  const requestId = crypto.randomUUID()

  try {

    const body = await req.json()

    if (!body?.email || !body?.eventId) {
      return problem({
        type: "https://www.solarisnerja.com/problems/validation",
        title: "Validation error",
        status: 400,
        detail: "email and eventId required",
        instance: "/api/v1/leads"
      })
    }

    const ip = _getClientIp(req)

    const lead = createLead({
      email: String(body.email),
      eventId: String(body.eventId),
      ipAddress: ip,
      consentGiven: true
    })

    enqueueLead(lead)

    return NextResponse.json({ success: true })

  } catch (error) {

    const errMsg =
      error instanceof Error ? error.message : String(error)

    log("error","internal_error",{ requestId,error:errMsg })

    return problem({
      type:"https://www.solarisnerja.com/problems/internal",
      title:"Internal Server Error",
      status:500,
      detail:"Unexpected error",
      instance:"/api/v1/leads"
    })

  }

}
