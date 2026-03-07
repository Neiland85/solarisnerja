export default function UbicacionSection() {
  return (
    <section id="ubicacion" className="bg-white solaris-parallax-horizon relative section-editorial px-6">

      {/* Título alineado derecha (col 8–12 de 12) */}
      <div className="editorial-grid max-w-6xl mx-auto">
        <div className="col-span-12 md:col-span-5 md:col-start-8">

          <h2 className="editorial-h2">
            ubicación
          </h2>

          <p className="mt-6 opacity-70">
            Solaris se celebra frente al Mediterráneo, en Nerja.
            Un paisaje donde el horizonte, la luz y el mar forman parte del escenario.
          </p>

        </div>
      </div>

      {/* Mapa + info en grid editorial */}
      <div className="editorial-grid max-w-6xl mx-auto mt-14">

        <div className="col-span-12 md:col-span-7">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <iframe
              title="Mapa de Nerja, Málaga — ubicación de Solaris Nerja"
              className="w-full h-full border-0"
              loading="lazy"
              src="https://maps.google.com/maps?q=Nerja&t=&z=13&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-9 text-sm space-y-4 self-center">

          <p className="opacity-70">
            Nerja · Costa del Sol · Andalucía
          </p>

          <p className="opacity-70">
            Un territorio donde el festival comienza con el sol alto,
            se transforma en atardecer y continúa con luz diseñada.
          </p>

        </div>

      </div>

    </section>
  )
}
