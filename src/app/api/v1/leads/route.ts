import { NextRequest, NextResponse } from "next/server"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"

import schema from "@/contracts/schemas/lead.create.json"
import { createLead } from "@/domain/leads/create-lead"
import { saveLead } from "@/adapters/db/lead-repository"
import { getPool } from "@/adapters/db/pool"
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

/* ============================= */
/* GET LEADS FOR DASHBOARD      */
/* ============================= */

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {
    const pool = getPool()

    const result = await pool.query(`
      SELECT 
        leads.id,
        leads.email,
        leads.event_id,
        leads.ip_address,
        leads.created_at,
        events.title AS event_title
      FROM leads
      JOIN events ON events.id = leads.event_id
      ORDER BY leads.created_at DESC
      LIMIT 500
    `)

    return NextResponse.json({ data: result.rows })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)

    log("error", "leads_list_error", { requestId, error: errMsg })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance: "/api/v1/leads",
    })
  }
}

/* ============================= */
/* CREATE LEAD (PUBLIC FORM)    */
/* ============================= */

const ipv4Regex =
  /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/
const ipv6Regex =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1)$/

function isValidIp(value: string): boolean {
  return ipv4Regex.test(value) || ipv6Regex.test(value)
}

function getClientIp(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip")?.trim()
  if (realIp && isValidIp(realIp)) return realIp

  const forwardedFor = req.headers.get("x-forwarded-for")
  const first = forwardedFor?.split(",")[0]?.trim()

  if (first && isValidIp(first)) return first

  return "unknown"
}

export async function POST(req: NextRequest) {
  const instance = "/api/v1/leads"
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {
    const ip = getClientIp(req)

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

    if (body.company && body.company.trim().length > 0) {
      log("warn", "honeypot_triggered", { requestId })
      return NextResponse.json({ success: true })
    }

    if (!rateLimit(ip)) {
      return problem({
        type: "https://www.solarisnerja.com/problems/rate-limit",
        title: "Too Many Requests",
        status: 429,
        detail: "Demasiadas solicitudes.",
        instance,
      })
    }

    const lead = createLead({
      email: body.email,
      eventId: body.eventId,
      ipAddress: ip,
      consentGiven: true,
    })

    await saveLead(lead)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)

    log("error", "internal_error", { requestId, error: errMsg })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance,
    })
  }
}

export function _isValidIp(value: string): boolean {
  const ipv4Regex =
    /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1)$/

  return ipv4Regex.test(value) || ipv6Regex.test(value)
}

export function _getClientIp(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip")?.trim()
  if (realIp && _isValidIp(realIp)) return realIp

  const forwardedFor = req.headers.get("x-forwarded-for")
  const first = forwardedFor?.split(",")[0]?.trim()

  if (first && _isValidIp(first)) return first

  return "unknown"
}
