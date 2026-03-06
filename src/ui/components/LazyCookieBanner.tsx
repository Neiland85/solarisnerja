"use client"

import dynamic from "next/dynamic"

const CookieBanner = dynamic(
  () => import("@/ui/components/CookieBanner").then((m) => m.CookieBanner),
  { ssr: false }
)

export default function LazyCookieBanner() {
  return <CookieBanner />
}
