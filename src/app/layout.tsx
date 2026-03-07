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
    "Descubre Solaris Nerja: festival cultural y musical en El Playazo, Costa del Sol. Conciertos, gastronomía, market creativo y experiencias frente al mar del 18 al 28 de junio.",
  metadataBase: new URL("https://www.solarisnerja.com"),
  openGraph: {
    title: "Solaris Nerja — Festival cultural en Málaga",
    description:
      "10 días de conciertos, gastronomía mediterránea, market creativo y experiencias frente al mar. El Playazo, Nerja. 18–28 junio 2026.",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Solaris Nerja — Festival cultural en Málaga, junio 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solaris Nerja — Festival cultural en Málaga",
    description:
      "Conciertos, gastronomía, market creativo y experiencias frente al mar. El Playazo, Nerja. 18–28 junio 2026.",
    images: ["/og-image.jpg"],
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
