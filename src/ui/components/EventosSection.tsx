"use client"

import EventCard from "./EventCard"

const events = [
  {
    id: "aperitivo",
    title: "Aperitivo Sessions",
    time: "13:00 · Sol alto",
    description:
      "Sesiones cálidas y orgánicas que acompañan el ritmo natural del mediodía.",
  },
  {
    id: "golden",
    title: "Golden Hour Concerts",
    time: "19:00 · Atardecer",
    description:
      "Los conciertos principales suceden cuando el sol toca el horizonte.",
  },
  {
    id: "digital",
    title: "Digital Night",
    time: "22:00 · Luz artificial",
    description:
      "Electrónica melódica y luz diseñada para prolongar la energía del día.",
  },
]

export default function EventosSection() {
  return (
    <section className="bg-white relative py-28 px-6">

      {/* textura solar muy sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 70% 10%, rgba(255,145,60,0.05), transparent 60%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
          Eventos
        </h2>

        <p className="max-w-xl text-base opacity-70 mb-16">
          Solaris se desarrolla siguiendo el ritmo natural del día:
          sol, atardecer y noche luminosa.
        </p>

        <div className="grid md:grid-cols-3 gap-14">

          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}

        </div>

        <div className="mt-20 flex justify-center">
          <a
            href="/eventos"
            className="border-2 border-black px-12 py-4 text-lg font-semibold hover:bg-black hover:text-white transition"
          >
            Ver programación completa
          </a>
        </div>

      </div>

    </section>
  )
}
