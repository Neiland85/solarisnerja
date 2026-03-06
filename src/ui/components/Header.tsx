"use client"

import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white text-black w-full flex items-center justify-between px-8 py-6">

      {/* LOGO */}
      <Link href="/">
        <Image
          src="/solaris_logo.png"
          alt="Solaris Nerja"
          width={120}
          height={60}
          priority
        />
      </Link>

      {/* NAV */}
      <nav className="flex gap-10 text-sm font-medium">

        <Link href="/eventos">
          Eventos
        </Link>

        <Link href="/mercado">
          Mercado
        </Link>

        <Link href="/#ubicacion">
          Ubicación
        </Link>

      </nav>

    </header>
  )
}
