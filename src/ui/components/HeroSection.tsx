"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const slides = [
  "/hero/hero-01.webp",
  "/hero/hero-02.webp",
  "/hero/hero-03.webp",
  "/hero/hero-04.webp",
]

export default function HeroSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[85vh] overflow-hidden">

      {slides.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Solaris Nerja"
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

    </section>
  )
}
