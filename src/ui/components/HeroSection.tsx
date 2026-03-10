import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">

      <Image
        src="/hero/hero-01.webp"
        alt="Solaris Nerja"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <div className="relative z-10 text-center text-white space-y-10 px-6">
        <div className="space-y-4">
          <p className="text-sm tracking-[0.4em] uppercase text-white/70">
            18 — 28 junio 2026 · nerja, málaga
          </p>

          <p className="editorial-label text-white/80 text-lg">
            mediterranean light culture
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="https://www.ticketmaster.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-14 py-5 text-lg font-bold tracking-widest uppercase"
          >
            comprar entradas
          </Link>
        </div>
      </div>
    </section>
  )
}
