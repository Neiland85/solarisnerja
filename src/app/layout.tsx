import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { CookieBanner } from "@/ui/components/CookieBanner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
