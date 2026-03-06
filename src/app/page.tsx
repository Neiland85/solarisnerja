import Hero from "@/ui/components/Hero"
import ProgramTicker from "@/ui/components/ProgramTicker"
import EventosSection from "@/ui/components/EventosSection"
import GalleryGrid from "@/ui/components/GalleryGrid"
import SolarisInfoSection from "@/ui/components/SolarisInfoSection"

export default function Page() {
  return (
    <>
      <Hero />

      {/* Program timeline */}
      <ProgramTicker />

      {/* Featured events */}
      <EventosSection />

      {/* Photo gallery */}
      <GalleryGrid />

      {/* Festival information */}
      <SolarisInfoSection />
    </>
  )
}
