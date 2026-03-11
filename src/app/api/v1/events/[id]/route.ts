import { NextRequest, NextResponse } from "next/server"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"
import updateSchema from "@/contracts/schemas/event.update.json"
import { applyEventUpdate, type EventUpdate } from "@/domain/events/update-event"
import { findEventById, updateEvent, deleteEvent } from "@/adapters/db/event-repository"
import { requireAdmin } from "@/lib/auth/requireAdmin"
import { problem } from "@/lib/problem"
import { log } from "@/lib/logger"

const ajv = new Ajv2020()
addFormats(ajv)
const validateUpdate = ajv.compile<EventUpdate>(updateSchema)

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const instance = `/api/v1/events/${id}`
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {
    const event = await findEventById(id)

    if (!event) {
      return problem({
        type: "https://www.solarisnerja.com/problems/not-found",
        title: "Not Found",
        status: 404,
        detail: `Event ${id} not found`,
        instance,
      })
    }

    return NextResponse.json({ data: event })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    log("error", "event_get_error", { requestId, error: errMsg })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance,
    })
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  const { id } = await context.params
  const instance = `/api/v1/events/${id}`
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {
    const body: unknown = await req.json()

    if (!validateUpdate(body)) {
      log("warn", "event_update_validation_failed", { requestId, errors: validateUpdate.errors })
      return problem({
        type: "https://www.solarisnerja.com/problems/validation",
        title: "Validation error",
        status: 400,
        detail: "Invalid payload",
        instance,
      })
    }

    const existing = await findEventById(id)
    if (!existing) {
      return problem({
        type: "https://www.solarisnerja.com/problems/not-found",
        title: "Not Found",
        status: 404,
        detail: `Event ${id} not found`,
        instance,
      })
    }

    const updated = applyEventUpdate(existing, body)
    await updateEvent(updated)

    log("info", "event_updated", { requestId, eventId: id })

    return NextResponse.json({ data: updated })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    log("error", "event_update_error", { requestId, error: errMsg })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance,
    })
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  const { id } = await context.params
  const instance = `/api/v1/events/${id}`
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {
    const deleted = await deleteEvent(id)

    if (!deleted) {
      return problem({
        type: "https://www.solarisnerja.com/problems/not-found",
        title: "Not Found",
        status: 404,
        detail: `Event ${id} not found`,
        instance,
      })
    }

    log("info", "event_deleted", { requestId, eventId: id })

    return new NextResponse(null, { status: 204 })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    log("error", "event_delete_error", { requestId, error: errMsg })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance,
    })
  }
}
