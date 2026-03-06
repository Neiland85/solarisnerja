"use client"

export default function MercadoSection() {
  return (
    <section className="bg-white relative py-28 px-6">

      {/* textura arena muy sutil */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(210,180,140,0.07), transparent 70%)"
        }}
      />

      <div className="relative max-w-6xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
          Mercado
        </h2>

        <p className="max-w-xl text-base opacity-70 mb-14">
          Un espacio donde diseño, gastronomía y cultura local se encuentran.
          Un paseo entre creadores mediterráneos, sabores del territorio y objetos con intención.
        </p>

        <div className="grid md:grid-cols-3 gap-12 text-sm">

          <div>
            <h3 className="font-medium mb-2">Gastro Boulevard</h3>
            <p className="opacity-70">
              Cocina mediterránea ligera, ingredientes locales y propuestas
              pensadas para acompañar el ritmo del día.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Diseño & Artesanía</h3>
            <p className="opacity-70">
              Creadores independientes, piezas únicas y diseño contemporáneo
              con raíz mediterránea.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Espacio Social</h3>
            <p className="opacity-70">
              Conversación, sombra, vino frío y tiempo para descubrir
              el festival sin prisa.
            </p>
          </div>

        </div>

      </div>

    </section>
  )
}
