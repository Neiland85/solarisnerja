import { NextRequest, NextResponse } from "next/server"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"
import createSchema from "@/contracts/schemas/event.create.json"
import { createEvent } from "@/domain/events/create-event"
import { findAllEvents, saveEvent } from "@/adapters/db/event-repository"
import { requireAdmin } from "@/lib/auth/requireAdmin"
import { problem } from "@/lib/problem"
import { log } from "@/lib/logger"

type CreateInput = {
  title: string
  description: string
  highlight: string
  ticketUrl: string
}

const ajv = new Ajv2020()
addFormats(ajv)
const validateCreate = ajv.compile<CreateInput>(createSchema)

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {
    const events = await findAllEvents()

    return NextResponse.json({ data: events }, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    log("error", "events_list_error", { requestId, error: errMsg })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance: "/api/v1/events",
    })
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  const instance = "/api/v1/events"
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {
    const body: unknown = await req.json()

    if (!validateCreate(body)) {
      log("warn", "event_validation_failed", { requestId, errors: validateCreate.errors })
      return problem({
        type: "https://www.solarisnerja.com/problems/validation",
        title: "Validation error",
        status: 400,
        detail: "Invalid payload",
        instance,
      })
    }

    const event = createEvent({
      title: body.title,
      description: body.description,
      highlight: body.highlight,
      ticketUrl: body.ticketUrl,
    })

    await saveEvent(event)

    log("info", "event_created", { requestId, eventId: event.id })

    return NextResponse.json({ data: event }, { status: 201 })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    log("error", "event_create_error", { requestId, error: errMsg })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance,
    })
  }
}
