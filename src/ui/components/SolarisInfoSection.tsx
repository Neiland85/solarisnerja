import Link from "next/link"

const experiences = [
  { icon: "🎶", text: "Conciertos en Nerja frente al mar" },
  { icon: "🌅", text: "Tardes de DJ sets y golden hour" },
  { icon: "🍤", text: "Gastronomía mediterránea y producto local Km0" },
  { icon: "🛍", text: "Market creativo y diseño independiente" },
  { icon: "✨", text: "Arte digital y experiencias nocturnas" },
]

export default function SolarisInfoSection() {
  return (
    <section id="que-es" className="bg-white solaris-parallax-sand relative section-editorial px-6">
      <div className="editorial-grid max-w-6xl mx-auto">

        {/* H1 + intro — left editorial (col 1–7) */}
        <div className="col-span-12 md:col-span-7 md:col-start-1">

          <p className="editorial-label mb-6">18 — 28 junio 2026 · el playazo, nerja</p>

          <h1 className="editorial-h1 mb-8">
            ¿qué es solaris nerja?
          </h1>

          <p className="text-lg leading-relaxed opacity-80 mb-6">
            Solaris Nerja es un festival cultural y musical en la Costa del Sol
            que se celebra del 18 al 28 de junio de 2026 en El Playazo, Nerja.
          </p>

          <p className="text-base leading-relaxed opacity-70">
            Durante 10 días, más de 20.000 m² frente al mar se convierten en
            un espacio donde puedes disfrutar de:
          </p>

        </div>

        {/* Experiences list — right offset (col 2–8) */}
        <div className="col-span-12 md:col-span-7 md:col-start-2 mt-12">

          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.text} className="flex items-start gap-4">
                <span className="text-xl mt-0.5" aria-hidden="true">{exp.icon}</span>
                <p className="text-base tracking-wide leading-relaxed">{exp.text}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Tagline — centered (col 3–10) */}
        <div className="col-span-12 md:col-span-8 md:col-start-3 mt-20 text-center">

          <p className="editorial-h2 leading-snug">
            Un festival en Málaga que no se visita.
          </p>
          <p className="editorial-h2 leading-snug mt-2 opacity-60">
            Se habita.
          </p>

        </div>

        {/* CTAs — grandes y llamativos */}
        <div className="col-span-12 mt-16 flex flex-col sm:flex-row items-center justify-center gap-5">

          <Link
            href="https://www.ticketmaster.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center bg-black text-white
              px-14 py-5 text-base font-bold tracking-widest uppercase
              hover:bg-yellow-400 hover:text-black hover:scale-105
              transition-all duration-300 shadow-lg"
          >
            <span className="mr-3 text-xl">🎫</span>
            comprar entradas
          </Link>

          <Link
            href="/#lineup"
            className="inline-flex items-center justify-center border-2 border-black
              px-10 py-5 text-sm font-medium tracking-widest uppercase
              hover:bg-black hover:text-white transition-all duration-300"
          >
            ver line-up
          </Link>

        </div>

      </div>
    </section>
  )
}
