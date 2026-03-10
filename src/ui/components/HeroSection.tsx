"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

const images = [
  "/hero/hero-01.webp",
  "/hero/hero-02.webp",
  "/hero/hero-03.webp",
  "/hero/hero-04.webp",
]

const INTERVAL = 5000

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length)
  }, [])

  useEffect(() => {
    const id = setInterval(advance, INTERVAL)
    return () => clearInterval(id)
  }, [advance])

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background images with crossfade */}
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`Solaris Nerja — imagen ${i + 1}`}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1500 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white space-y-10 px-6">
        <div className="space-y-4">
          <p className="text-sm tracking-[0.4em] uppercase text-white/70">
            18 — 28 junio 2026 · nerja, málaga
          </p>
          <p className="editorial-label text-white/80 text-lg">
            mediterranean light culture
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="https://www.ticketmaster.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center bg-white text-black px-14 py-5 text-lg font-bold tracking-widest uppercase hover:bg-yellow-300 hover:text-black hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <span className="mr-3 text-2xl">🎫</span>
            comprar entradas
          </Link>

          <Link
            href="/#lineup"
            className="inline-flex items-center justify-center border-2 border-white/80 px-10 py-5 text-base font-medium tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            ver line-up
          </Link>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Imagen ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === current ? "bg-white w-8" : "bg-white/40 w-2"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
