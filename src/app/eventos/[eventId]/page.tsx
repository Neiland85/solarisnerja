import Link from "next/link"
import { notFound } from "next/navigation"
import { getEvent } from "@/config/events"
import { Reveal } from "@/ui/components/Reveal"
import { ButtonPrimary } from "@/ui/components/UI"
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
    <main className="min-h-screen">

      {/* ── Header ── */}
      <header className="px-6 md:px-12 pt-8 pb-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-sm font-bold tracking-widest uppercase">
          Solaris Nerja
        </Link>
        <nav className="hidden md:flex gap-8 text-xs font-medium tracking-widest uppercase text-[var(--sn-muted)]">
          <Link href="/" className="hover:text-[var(--sn-text)] transition-colors">Inicio</Link>
          <Link href="/eventos" className="hover:text-[var(--sn-text)] transition-colors">Eventos</Link>
        </nav>
      </header>

      <div className="border-t border-[var(--sn-border)]" />

      {/* ── Event Detail ── */}
      <section className="px-6 md:px-12 pt-16 md:pt-24 pb-16 max-w-4xl mx-auto">
        <Reveal>
          <Link
            href="/eventos"
            className="text-xs font-medium tracking-widest uppercase text-[var(--sn-muted)]
              hover:text-[var(--sn-text)] transition-colors"
          >
            ← Eventos
          </Link>

          <div className="mt-8 text-xs font-medium tracking-widest uppercase text-[var(--sn-muted)]">
            {event.highlight}
          </div>

          <h1 className="mt-4 text-5xl md:text-7xl font-bold tracking-tight">
            {event.title}
          </h1>

          <p className="mt-6 text-lg text-[var(--sn-muted)] max-w-2xl leading-relaxed">
            {event.description}
          </p>

          <div className="mt-10">
            <ButtonPrimary href={event.ticketUrl}>Comprar Tickets</ButtonPrimary>
          </div>
        </Reveal>
      </section>

      <div className="border-t border-[var(--sn-border)]" />

      {/* ── Ticketmaster Widget ── */}
      <section className="px-6 md:px-12 py-16 max-w-4xl mx-auto">
        <Reveal delayMs={150}>
          <TicketmasterWidget
            eventId={event.id}
            ticketUrl={event.ticketUrl}
          />
        </Reveal>
      </section>

      <div className="border-t border-[var(--sn-border)]" />

      {/* ── Info ── */}
      <section className="px-6 md:px-12 py-16 max-w-4xl mx-auto">
        <Reveal delayMs={200}>
          <div className="text-xs font-medium tracking-widest uppercase text-[var(--sn-muted)] mb-3">
            Información
          </div>
          <p className="text-[var(--sn-muted)] leading-relaxed">
            Venta oficial gestionada por Ticketmaster.
            Las entradas y condiciones se rigen por la plataforma oficial.
          </p>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <div className="border-t border-[var(--sn-border)]" />
      <footer className="px-6 md:px-12 py-12 max-w-7xl mx-auto text-xs text-[var(--sn-muted)]">
        <Link href="/eventos" className="hover:text-[var(--sn-text)] transition-colors">
          ← Volver a eventos
        </Link>
      </footer>
    </main>
  )
}
