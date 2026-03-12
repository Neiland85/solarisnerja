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

  const events = (await findAllEvents()) as EventRow[]

  return (
    <section id="programacion" className="solaris-vinyl-texture py-24 px-6">

      <div className="max-w-6xl mx-auto space-y-16">

        <h2 className="editorial-h2 text-center">
          Programación
        </h2>

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

      </div>

    </section>
  )
}
