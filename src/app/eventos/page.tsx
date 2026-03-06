import type { Metadata } from "next"
import { EVENTS } from "@/config/events"
import { Reveal } from "@/ui/components/Reveal"
import EventCard from "@/ui/components/EventCard"

export const metadata: Metadata = {
  title: "Eventos — SolarisNerja",
  description:
    "Programa completo de eventos: música, mercado creativo y experiencias frente al mar.",
}

export default function EventosPage() {
  return (
    <main className="min-h-screen">

      {/* ── Title ── */}
      <section className="px-6 md:px-12 pt-16 md:pt-24 pb-12 max-w-7xl mx-auto">
        <Reveal>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Eventos</h1>
          <p className="mt-4 text-[var(--sn-muted)] max-w-lg">
            Electrónica, mercado creativo y playa. Formato fin de semana, edición limitada.
          </p>
        </Reveal>
      </section>

      <div className="border-t border-[var(--sn-border)]" />

      {/* ── Grid ── */}
      <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-px bg-[var(--sn-border-2)]">
          {EVENTS.map((e, idx) => (
            <Reveal key={e.id} delayMs={idx * 60}>
              <div className="bg-[var(--sn-bg)] p-6 md:p-8">
                <EventCard event={{
                  id: e.id,
                  title: e.title,
                  time: e.highlight,
                  description: e.description,
                }} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

    </main>
  )
}
