import MetaPixel from "@/ui/components/MetaPixel"
import "./globals.css"

export const metadata = {
  title: "Solaris Nerja",
  description: "Festival cultural y musical en la Costa del Sol"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>

        <MetaPixel />

        {children}

      </body>
    </html>
  )
}
