"use client"

import dynamic from "next/dynamic"

const SolarOrb = dynamic(() => import("@/ui/components/SolarOrb"), {
  ssr: false,
})

export default function LazySolarOrb() {
  return <SolarOrb />
}
