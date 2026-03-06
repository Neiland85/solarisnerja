export default function MercadoSection() {
  return (
    <section id="mercado" className="bg-white solaris-parallax-sand relative section-editorial px-6">

      {/* Título alineado izquierda (col 1–5 de 12) */}
      <div className="editorial-grid max-w-6xl mx-auto">
        <div className="col-span-12 md:col-span-5">

          <h2 className="editorial-h2">
            mercado
          </h2>

          <p className="mt-6 opacity-70">
            Un espacio donde diseño, gastronomía y cultura local se encuentran.
            Un paseo entre creadores mediterráneos, sabores del territorio y objetos con intención.
          </p>

        </div>
      </div>

      {/* Contenido en grid editorial */}
      <div className="editorial-grid max-w-6xl mx-auto mt-14">

        <div className="col-span-12 md:col-span-4 text-sm">
          <h3 className="font-medium mb-2">Gastro Boulevard</h3>
          <p className="opacity-70">
            Cocina mediterránea ligera, ingredientes locales y propuestas
            pensadas para acompañar el ritmo del día.
          </p>
        </div>

        <div className="col-span-12 md:col-span-4 text-sm">
          <h3 className="font-medium mb-2">Diseño & Artesanía</h3>
          <p className="opacity-70">
            Creadores independientes, piezas únicas y diseño contemporáneo
            con raíz mediterránea.
          </p>
        </div>

        <div className="col-span-12 md:col-span-4 text-sm">
          <h3 className="font-medium mb-2">Espacio Social</h3>
          <p className="opacity-70">
            Conversación, sombra, vino frío y tiempo para descubrir
            el festival sin prisa.
          </p>
        </div>

      </div>

    </section>
  )
}
