import HeroSection from "@/ui/components/HeroSection"
import ProgramTicker from "@/ui/components/ProgramTicker"
import EventosSection from "@/ui/components/EventosSection"
import LazyGallery from "@/ui/components/LazyGallery"
import SolarisInfoSection from "@/ui/components/SolarisInfoSection"

export default function Page() {
  return (
    <>
      <HeroSection />
      <ProgramTicker />
      <EventosSection />
      <LazyGallery />
      <SolarisInfoSection />
    </>
  )
}
