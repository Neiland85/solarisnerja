import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">

      <Image
        src="/hero.jpg"
        alt="Solaris Nerja Festival"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <div className="relative z-10 text-center text-white space-y-8 px-6">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
          Solaris Nerja
        </h1>

        <p className="text-lg opacity-90 max-w-xl mx-auto">
          Festival cultural en Málaga · Junio 2026
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="#eventos"
            className="bg-black text-white px-6 py-3 text-sm tracking-wide"
          >
            Comprar entradas
          </a>

          <a
            href="#programacion"
            className="border border-white px-6 py-3 text-sm tracking-wide"
          >
            Ver programación
          </a>
        </div>
      </div>

    </section>
  )
}
