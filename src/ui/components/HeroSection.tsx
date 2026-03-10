import HeroBackground from "./HeroBackground.client"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">

      <HeroBackground />

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
            className="group relative inline-flex items-center justify-center bg-white text-black px-14 py-5 text-lg font-bold tracking-widest uppercase hover:bg-yellow-300 hover:text-black hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <span className="mr-3 text-2xl">🎫</span>
            comprar entradas
          </Link>

          <Link
            href="/#lineup"
            className="inline-flex items-center justify-center border-2 border-white/80 px-10 py-5 text-base font-medium tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            ver line-up
          </Link>
        </div>
      </div>
    </section>
  )
}
