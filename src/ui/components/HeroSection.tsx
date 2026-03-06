"use client"

import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="bg-white min-h-[80vh] flex items-center justify-center">

      <Link
        href="/eventos"
        className="border-2 border-black px-12 py-4 text-lg font-semibold
          hover:bg-black hover:text-white transition"
      >
        TICKETS
      </Link>

    </section>
  )
}
