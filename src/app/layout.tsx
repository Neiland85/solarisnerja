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
  title: "Qué es Solaris Nerja | Festival cultural en Málaga junio 2026",
  description:
    "Descubre Solaris Nerja: festival cultural y musical en El Playazo, Costa del Sol.",
  metadataBase: new URL("https://www.solarisnerja.com"),

  icons: {
    icon: "/logo-solaris.svg",
    shortcut: "/logo-solaris.svg",
    apple: "/logo-solaris.svg",
  },

  openGraph: {
    title: "Solaris Nerja — Festival cultural en Málaga",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
