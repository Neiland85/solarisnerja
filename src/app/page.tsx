import Link from "next/link"
import Header from "@/ui/components/Header"
import HeroSection from "@/ui/components/HeroSection"
import EventosSection from "@/ui/components/EventosSection"
import MercadoSection from "@/ui/components/MercadoSection"
import UbicacionSection from "@/ui/components/UbicacionSection"

export default function Home() {
  return (
    <main>

      <Header />

      <HeroSection />

      <EventosSection />

      <MercadoSection />

      <UbicacionSection />

      {/* ── Footer ── */}
      <footer className="bg-white px-6 md:px-12 py-12 max-w-6xl mx-auto
        flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-xs text-[var(--sn-muted)]">
          © {new Date().getFullYear()} Solaris Nerja
        </div>
        <div className="flex gap-6 text-xs text-[var(--sn-muted)]">
          <Link href="/privacidad" className="hover:text-[var(--sn-text)] transition-colors">
            Privacidad
          </Link>
          <a href="https://www.ticketmaster.es/" target="_blank" rel="noopener noreferrer"
            className="hover:text-[var(--sn-text)] transition-colors">
            Ticketmaster
          </a>
        </div>
      </footer>

    </main>
  )
}
