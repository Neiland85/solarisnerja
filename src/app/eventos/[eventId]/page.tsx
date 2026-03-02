import { notFound } from "next/navigation"
import { getEvent } from "@/config/events"
import { Reveal } from "@/ui/components/Reveal"
import { Card } from "@/ui/components/UI"
import { TicketmasterWidget } from "@/ui/components/TicketmasterWidget"

type Props = {
  params: Promise<{
    eventId: string
  }>
}

export default async function EventDetailPage({ params }: Props) {
  const { eventId } = await params
  const event = getEvent(eventId)

  if (!event) {
    return notFound()
  }

  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[color:var(--sn-bg)]" />
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[color:var(--sn-sunset)]/14 blur-[180px]" />
      <div className="sn-grain" />

      {/* Content */}
      <section className="relative z-10 px-6 pt-16 pb-24 max-w-5xl mx-auto">

        <Reveal>
          <div className="text-sm text-[color:var(--sn-muted)]">
            {event.tagline}
          </div>

          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
            {event.title}
          </h1>

          <p className="mt-6 text-[color:var(--sn-muted)] max-w-2xl leading-relaxed">
            {event.description}
          </p>
        </Reveal>

        {/* Ticketmaster Widget */}
        <Reveal delayMs={150}>
          <TicketmasterWidget
            eventId={event.id}
            ticketUrl={event.ticketUrl}
          />
        </Reveal>

        {/* Extra info */}
        <div className="mt-14">
          <Reveal delayMs={200}>
            <Card>
              <div className="text-sm text-[color:var(--sn-muted)]">
                Información
              </div>

              <div className="mt-2 text-lg">
                Venta oficial gestionada por Ticketmaster.
                Las entradas y condiciones se rigen por la plataforma oficial.
              </div>
            </Card>
          </Reveal>
        </div>

      </section>
    </main>
  )
}
