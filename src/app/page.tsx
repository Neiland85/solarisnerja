import { Reveal } from "@/ui/components/Reveal"
import { ButtonGhost, ButtonPrimary, Card } from "@/ui/components/UI"
import { EventCard } from "@/ui/components/EventCard"
import { EVENTS } from "@/config/events"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[color:var(--sn-bg)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--sn-bg)] via-[#14141a] to-[color:var(--sn-bg)]" />
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[color:var(--sn-sunset)]/18 blur-[180px]" />
      <div className="absolute top-40 right-[-200px] w-[520px] h-[520px] rounded-full bg-[color:var(--sn-neon)]/12 blur-[170px]" />
      <div className="sn-grain" />

      <header className="relative z-10 px-6 pt-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="font-semibold tracking-tight">SolarisNerja</div>
          <nav className="text-sm text-[color:var(--sn-muted)] hidden md:flex gap-6">
            <a href="#eventos" className="hover:text-white transition">Eventos</a>
            <a href="#mercado" className="hover:text-white transition">Mercado</a>
            <a href="#ubicacion" className="hover:text-white transition">Ubicación</a>
          </nav>
        </div>
      </header>

      <section className="relative z-10 px-6 pt-20 pb-16 max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Solaris Nerja
            </h1>

            <p className="mt-6 text-lg md:text-xl text-[color:var(--sn-muted)] max-w-2xl leading-relaxed">
              Electrónica, mercadillo creativo y atardecer frente al mar.
              Un formato cuidado para fines de semana.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <ButtonPrimary href="/eventos">Ver eventos</ButtonPrimary>
              <ButtonGhost href="#mercado">Explorar mercado</ButtonGhost>
            </div>

            <p className="mt-8 text-sm text-[color:var(--sn-muted)]">
              Edición limitada · Playa · Música · Mercado
            </p>
          </div>
        </Reveal>
      </section>

      <section id="eventos" className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Eventos
          </h2>
          <p className="mt-4 text-[color:var(--sn-muted)] max-w-2xl">
            Selección de experiencias para tarde, noche y mercado creativo.
          </p>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {EVENTS.slice(0, 6).map((e, idx) => (
            <Reveal key={e.id} delayMs={idx * 80}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="mercado" className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Mercado creativo
          </h2>
          <p className="mt-4 text-[color:var(--sn-muted)] max-w-2xl">
            Stands seleccionados: diseño, vinilos, arte y piezas locales. Curación real.
          </p>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <Reveal>
            <Card>
              <div className="text-xl font-semibold">Stands seleccionados</div>
              <div className="mt-3 text-sm text-[color:var(--sn-muted)]">
                Pocos, buenos, con identidad. Calidad &gt; cantidad.
              </div>
            </Card>
          </Reveal>

          <Reveal delayMs={140}>
            <Card>
              <div className="text-xl font-semibold">Gastro & descanso</div>
              <div className="mt-3 text-sm text-[color:var(--sn-muted)]">
                Zona para estar, no solo pasar. Formato fin de semana.
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <section id="ubicacion" className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Nerja, a pie de playa
          </h2>
          <p className="mt-4 text-[color:var(--sn-muted)] max-w-2xl">
            Ubicación exacta y horarios se publicarán junto a la programación.
          </p>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-10 rounded-[var(--sn-radius-xl)] border border-[var(--sn-border)]
            bg-[color:var(--sn-surface)]/60 backdrop-blur p-6">
            <div className="text-sm text-[color:var(--sn-muted)]">Info</div>
            <div className="mt-2 text-lg">
              Accesos claros · Señalización · Formato cuidado
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="relative z-10 px-6 py-14 max-w-6xl mx-auto">
        <div className="text-sm text-[color:var(--sn-muted)]">
          © {new Date().getFullYear()} SolarisNerja · Venta oficial Ticketmaster
        </div>
      </footer>
    </main>
  )
}
