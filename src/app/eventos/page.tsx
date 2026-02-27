import { EVENTS } from "@/config/events"
import { Reveal } from "@/ui/components/Reveal"
import { EventCard } from "@/ui/components/EventCard"

export default function EventosPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[color:var(--sn-bg)]" />
      <div className="sn-grain" />

      <section className="relative z-10 px-6 pt-16 pb-16 max-w-6xl mx-auto">
        <Reveal>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Eventos</h1>
          <p className="mt-4 text-[color:var(--sn-muted)] max-w-2xl">
            Electrónica, mercado creativo y playa. Formato fin de semana, edición limitada.
          </p>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {EVENTS.map((e, idx) => (
            <Reveal key={e.id} delayMs={idx * 80}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}
