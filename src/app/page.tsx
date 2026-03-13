export const dynamic = 'force-dynamic';
import Image from "next/image"
import HeroVideo from "@/ui/components/HeroVideo"
import EventosSection from "@/ui/components/EventosSection"
import CarouselSection from "@/ui/components/CarouselSection"
import LocationSection from "@/ui/components/LocationSection"
import PromoFormSection from "@/ui/components/PromoFormSection"

export default function HomePage(){

  return (

    <main>

      <HeroVideo />

      <EventosSection />

      <CarouselSection />

      <LocationSection />

      <PromoFormSection />

      <div className="flex flex-col items-center py-10 bg-[#0A0E1A]">
        <Image
          src="/logo-solaris.png"
          alt="Solaris Nerja"
          width={120}
          height={120}
          sizes="120px"
          className="opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
        <div className="site-credit">
          <span>Website Code by Clarity Structures Digital S.L.</span>
        </div>
      </div>

    </main>

  )

}
