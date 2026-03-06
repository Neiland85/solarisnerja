import Link from "next/link"
import Header from "@/ui/components/Header"
import HeroSection from "@/ui/components/HeroSection"
import { Reveal } from "@/ui/components/Reveal"
import { EventCard } from "@/ui/components/EventCard"
import { StickyCTA } from "@/ui/components/StickyCTA"
import { EVENTS } from "@/config/events"

export default function Home() {
  return (
    <main className="min-h-screen">

      <Header />

      <HeroSection />

      {/* ── Divider ── */}
      <div className="border-t border-[var(--sn-border)]" />

      {/* ── Eventos Grid ── */}
      <section id="eventos" className="px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto">
        <Reveal>
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Eventos
              </h2>
              <p className="mt-4 text-[var(--sn-muted)] max-w-lg">
                Selección de experiencias para tarde, noche y mercado creativo.
              </p>
            </div>
            <Link
              href="/eventos"
              className="hidden md:block text-xs font-medium tracking-widest uppercase
                hover:underline underline-offset-4"
            >
              Ver todos
            </Link>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--sn-border-2)]">
          {EVENTS.slice(0, 4).map((e, idx) => (
            <Reveal key={e.id} delayMs={idx * 60}>
              <div className="bg-[var(--sn-bg)]">
                <EventCard event={e} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-[var(--sn-border)]" />

      {/* ── Mercado ── */}
      <section id="mercado" className="px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Mercado Creativo
          </h2>
          <p className="mt-4 text-[var(--sn-muted)] max-w-lg">
            Stands seleccionados: diseño, vinilos, arte y piezas locales.
          </p>
        </Reveal>

        <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-px bg-[var(--sn-border-2)]">
          <Reveal>
            <div className="bg-[var(--sn-bg)] p-6 md:p-10">
              <h3 className="text-xl md:text-2xl font-bold">Curación real</h3>
              <p className="mt-3 text-sm text-[var(--sn-muted)] leading-relaxed">
                Pocos stands, buenos, con identidad. Calidad sobre cantidad.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="bg-[var(--sn-bg)] p-6 md:p-10">
              <h3 className="text-xl md:text-2xl font-bold">Gastro & descanso</h3>
              <p className="mt-3 text-sm text-[var(--sn-muted)] leading-relaxed">
                Zona para estar, no solo pasar. Formato fin de semana.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-[var(--sn-border)]" />

      {/* ── Info ── */}
      <section id="info" className="px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Nerja
          </h2>
          <p className="mt-4 text-[var(--sn-muted)] max-w-lg">
            Ubicación exacta y horarios se publicarán junto a la programación.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <div className="text-xs font-medium tracking-widest uppercase text-[var(--sn-muted)] mb-2">Ubicación</div>
              <div className="text-lg font-semibold">Nerja, Málaga</div>
              <div className="text-sm text-[var(--sn-muted)]">Costa del Sol oriental</div>
            </div>
            <div>
              <div className="text-xs font-medium tracking-widest uppercase text-[var(--sn-muted)] mb-2">Formato</div>
              <div className="text-lg font-semibold">Fin de semana</div>
              <div className="text-sm text-[var(--sn-muted)]">Tarde, noche y mercado</div>
            </div>
            <div>
              <div className="text-xs font-medium tracking-widest uppercase text-[var(--sn-muted)] mb-2">Entradas</div>
              <div className="text-lg font-semibold">Ticketmaster</div>
              <div className="text-sm text-[var(--sn-muted)]">Venta oficial exclusiva</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-[var(--sn-border)]" />

      {/* ── Footer ── */}
      <footer className="px-6 md:px-12 py-12 max-w-7xl mx-auto
        flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-xs text-[var(--sn-muted)]">
          © {new Date().getFullYear()} Solaris Nerja
        </div>
        <div className="flex gap-6 text-xs text-[var(--sn-muted)]">
          <Link href="/privacidad" className="hover:text-[var(--sn-text)] transition-colors">
            Privacidad
          </Link>
          <a href="https://www.ticketmaster.es/" target="_blank" rel="noopener noreferrer"
            className="hover:text-[var(--sn-text)] transition-colors">
            Ticketmaster
          </a>
        </div>
      </footer>

      {/* ── Sticky CTA mobile ── */}
      <StickyCTA href="/eventos" />
    </main>
  )
}
