import Header from "@/ui/components/Header"
import HeroSection from "@/ui/components/HeroSection"
import ProgramTicker from "@/ui/components/ProgramTicker"
import SolarisInfoSection from "@/ui/components/SolarisInfoSection"
import LineupSection from "@/ui/components/LineupSection"
import EventosSection from "@/ui/components/EventosSection"
import ImageCarousel from "@/ui/components/ImageCarousel"
import MercadoSection from "@/ui/components/MercadoSection"
import GalleryGrid from "@/ui/components/GalleryGrid"
import UbicacionSection from "@/ui/components/UbicacionSection"
import Footer from "@/ui/components/Footer"

export default function Page() {
  return (
    <main>

      <Header />

      <HeroSection />

      <ProgramTicker />

      <div className="section-divider" />
      <SolarisInfoSection />

      <div className="section-divider" />
      <LineupSection />

      <div className="section-divider" />
      <EventosSection />

      <ImageCarousel />

      <div className="section-divider" />
      <MercadoSection />

      <div className="section-divider" />
      <GalleryGrid />

      <div className="section-divider" />
      <UbicacionSection />

      <Footer />

    </main>
  )
}
