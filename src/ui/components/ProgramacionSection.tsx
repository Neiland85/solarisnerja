import { EVENTS } from "@/config/events"
import Image from "next/image"

export default function ProgramacionSection(){

  return(

    <section id="eventos" className="py-24 bg-neutral-50">

      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl text-center mb-4">
          Programación
        </h2>

        <p className="text-center text-neutral-500 mb-16">
          Conciertos, DJ sets y experiencias durante 10 días frente al mar.
        </p>

        <div className="grid md:grid-cols-3 gap-10">

          {EVENTS.map((event)=>(
            
            <div
              key={event.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >

              {event.logo && (
                <Image
                  src={event.logo}
                  alt={event.title}
                  width={600}
                  height={400}
                  className="w-full h-[220px] object-cover"
                />
              )}

              <div className="p-6 space-y-3">

                <p className="text-sm text-neutral-500">
                  {event.date} · {event.time}
                </p>

                <h3 className="text-xl font-semibold">
                  {event.title}
                </h3>

                <p className="text-sm text-neutral-600">
                  {event.description}
                </p>

                <a
                  href={event.ticketUrl}
                  target="_blank"
                  className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-full text-sm hover:bg-neutral-800 transition"
                >
                  Comprar entrada
                </a>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  )

}
