import type { Metadata } from "next"
import { Inter } from "next/font/google"
import LazyCookieBanner from "@/ui/components/LazyCookieBanner"
import LazySolarOrb from "@/ui/components/LazySolarOrb"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SolarisNerja — Electrónica, mercadillo y atardecer frente al mar",
  description:
    "Eventos de música electrónica, mercado creativo y experiencias frente al mar en Nerja. Edición limitada.",
  metadataBase: new URL("https://www.solarisnerja.com"),
  openGraph: {
    title: "SolarisNerja",
    description: "Electrónica, mercadillo creativo y atardecer frente al mar.",
    type: "website",
    locale: "es_ES",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-editorial antialiased`}>
        <LazySolarOrb />
        {children}
        <LazyCookieBanner />
      </body>
    </html>
  )
}
