"use client"

export default function UbicacionSection() {
  return (
    <section className="bg-white relative py-28 px-6">

      {/* reflejo solar sutil */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,150,80,0.07), transparent 65%)"
        }}
      />

      <div className="relative max-w-6xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
          Ubicación
        </h2>

        <p className="max-w-xl text-base opacity-70 mb-14">
          Solaris se celebra frente al Mediterráneo, en Nerja.
          Un paisaje donde el horizonte, la luz y el mar forman parte del escenario.
        </p>

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div className="aspect-[4/3] w-full overflow-hidden">
            <iframe
              className="w-full h-full border-0"
              loading="lazy"
              src="https://maps.google.com/maps?q=Nerja&t=&z=13&ie=UTF8&iwloc=&output=embed"
            />
          </div>

          <div className="text-sm space-y-4">

            <p className="opacity-70">
              Nerja · Costa del Sol · Andalucía
            </p>

            <p className="opacity-70">
              Un territorio donde el festival comienza con el sol alto,
              se transforma en atardecer y continúa con luz diseñada.
            </p>

          </div>

        </div>

      </div>

    </section>
  )
}
