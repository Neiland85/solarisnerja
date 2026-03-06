import Link from "next/link"
import EventCard from "./EventCard"

const events = [
  {
    id: "aperitivo",
    title: "Aperitivo Sessions",
    time: "13:00 · sol alto",
    description:
      "Sesiones cálidas y orgánicas que acompañan el ritmo natural del mediodía.",
  },
  {
    id: "golden",
    title: "Golden Hour Concerts",
    time: "19:00 · atardecer",
    description:
      "Los conciertos principales suceden cuando el sol toca el horizonte.",
  },
  {
    id: "digital",
    title: "Digital Night",
    time: "22:00 · luz artificial",
    description:
      "Electrónica melódica y luz diseñada para prolongar la energía del día.",
  },
]

export default function EventosSection() {
  return (
    <section id="eventos" className="bg-white solaris-parallax-sun relative section-editorial px-6">

      {/* Título centrado editorial (col 4–9 de 12) */}
      <div className="editorial-grid max-w-6xl mx-auto">
        <div className="col-span-12 md:col-span-6 md:col-start-4 text-center">

          <h2 className="editorial-h2">
            eventos
          </h2>

          <p className="mt-6 opacity-70">
            Solaris se desarrolla siguiendo el ritmo natural del día:
            sol, atardecer y noche luminosa.
          </p>

        </div>
      </div>

      {/* Cards en grid editorial */}
      <div className="editorial-grid max-w-6xl mx-auto mt-16">
        {events.map((event) => (
          <div key={event.id} className="col-span-12 md:col-span-4">
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {/* CTA centrado */}
      <div className="max-w-6xl mx-auto mt-20 text-center">
        <Link
          href="/eventos"
          className="border-2 border-black px-12 py-4 text-lg font-medium tracking-wide
            hover:bg-black hover:text-white transition"
        >
          ver programación completa
        </Link>
      </div>

    </section>
  )
}
