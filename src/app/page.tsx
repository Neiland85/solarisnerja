import Header from "@/ui/components/Header"
import HeroSection from "@/ui/components/HeroSection"
import LineupSection from "@/ui/components/LineupSection"
import EventosSection from "@/ui/components/EventosSection"
import MercadoSection from "@/ui/components/MercadoSection"
import UbicacionSection from "@/ui/components/UbicacionSection"
import Footer from "@/ui/components/Footer"

export default function Page() {
  return (
    <main>

      <Header />

      <HeroSection />

      <div className="section-divider" />
      <LineupSection />

      <div className="section-divider" />
      <EventosSection />

      <div className="section-divider" />
      <MercadoSection />

      <div className="section-divider" />
      <UbicacionSection />

      <Footer />

    </main>
  )
}
