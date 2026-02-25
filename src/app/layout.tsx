import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolarisNerja — Electr\u00f3nica, mercadillo y atardecer frente al mar",
  description:
    "Eventos de m\u00fasica electr\u00f3nica, mercado creativo y experiencias frente al mar en Nerja. Edici\u00f3n limitada.",
  metadataBase: new URL("https://www.solarisnerja.com"),
  openGraph: {
    title: "SolarisNerja",
    description: "Electr\u00f3nica, mercadillo creativo y atardecer frente al mar.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
