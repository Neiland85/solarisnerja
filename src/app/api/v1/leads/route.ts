import { NextRequest, NextResponse } from "next/server"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"

import schema from "@/contracts/schemas/lead.create.json"
import { createLead } from "@/domain/leads/create-lead"
import { Lead } from "../../../../domain/leads/types"

type LeadInput = {
  email: string
  eventId: string
}

const ajv = new Ajv2020()
addFormats(ajv)
const validate = ajv.compile<LeadInput>(schema)

export async function POST(req: NextRequest) {
  const body: unknown = await req.json()

  if (!validate(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const lead = createLead(body)
  await saveLead(lead)

  return NextResponse.json({ success: true })
}
async function saveLead(lead: Lead): Promise<void> {
  try {
    const response = await fetch("/api/v1/leads/storage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead),
    })

    if (!response.ok) {
      throw new Error(`Failed to save lead: ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error saving lead:", error)
    throw error
  }
}

