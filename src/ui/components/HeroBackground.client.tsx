"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const images = [
  "/hero/hero-01.webp",
  "/hero/hero-02.webp",
  "/hero/hero-03.webp",
  "/hero/hero-04.webp",
]

export default function HeroBackground() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 5000)

    return () => clearInterval(id)
  }, [])

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`Solaris Nerja — imagen ${i + 1}`}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1500 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  )
}
