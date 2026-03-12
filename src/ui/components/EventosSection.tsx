import { findAllEvents } from "@/adapters/db/event-repository"
import EventCardFestival from "@/ui/components/EventCardFestival"

export const dynamic = "force-dynamic"

type EventRow = {
  id: string
  title: string
  highlight: string
  ticketUrl: string
  logo?: string | null
  event_date?: string | null
}

export default async function EventosSection() {

  let events: EventRow[] = []
  let dbError = false

  try {
    events = (await findAllEvents()) as EventRow[]
  } catch (err) {
    dbError = true
    console.error("[EventosSection] DB fetch failed:", err instanceof Error ? err.message : err)
  }

  return (
    <section id="programacion" className="solaris-vinyl-texture py-24 px-6">

      <div className="max-w-6xl mx-auto space-y-16">

        <h2 className="editorial-h2 text-center">
          Programación
        </h2>

        {dbError ? (
          <p className="text-center text-neutral-500 py-12">
            La programación se actualizará próximamente.
          </p>
        ) : events.length === 0 ? (
          <p className="text-center text-neutral-500 py-12">
            No hay eventos programados en este momento.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">

            {events.map((event, index) => (
              <EventCardFestival
                key={event.id}
                id={event.id}
                title={event.title}
                highlight={event.highlight}
                ticketUrl={event.ticketUrl}
                logo={event.logo ?? undefined}
                eventDate={event.event_date ?? undefined}
                colorIndex={index}
              />
            ))}

          </div>
        )}

      </div>

    </section>
  )
}
