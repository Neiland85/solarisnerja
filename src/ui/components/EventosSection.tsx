import { findAllEvents } from "@/adapters/db/event-repository"
import { EVENTS } from "@/config/events"
import EventosGrid from "@/ui/components/EventosGrid"
import type { EventGridItem } from "@/ui/components/EventosGrid"

export const dynamic = "force-dynamic"

type EventRow = {
  id: string
  title: string
  highlight: string
  ticketUrl: string
  description?: string | null
  logo?: string | null
  event_date?: string | null
  time?: string | null
}

function configToEventRows(): EventRow[] {
  return EVENTS.map((e) => ({
    id: e.id,
    title: e.title,
    highlight: e.highlight,
    ticketUrl: e.ticketUrl,
    description: e.description,
    logo: e.logo ?? null,
    event_date: e.date ?? null,
    time: e.time ?? null,
  }))
}

function toGridItems(rows: EventRow[]): EventGridItem[] {
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    highlight: r.highlight,
    ticketUrl: r.ticketUrl,
    description: r.description ?? "",
    logo: r.logo ?? null,
    eventDate: r.event_date ?? null,
    time: r.time ?? null,
  }))
}

export default async function EventosSection() {

  let events: EventRow[] = []

  try {
    events = (await findAllEvents()) as EventRow[]
  } catch (err) {
    console.error("[EventosSection] DB unavailable, using config fallback:", err instanceof Error ? err.message : err)
    events = configToEventRows()
  }

  if (events.length === 0) {
    events = configToEventRows()
  }

  const gridItems = toGridItems(events)

  return (
    <section id="programacion" className="solaris-horizon-texture py-24 px-6">

      <div className="max-w-6xl mx-auto space-y-16">

        <h2 className="editorial-h2 text-center">
          Programación
        </h2>

        <EventosGrid events={gridItems} />

      </div>

    </section>
  )
}
