"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

const GalleryGrid = dynamic(() => import("./GalleryGrid"), { ssr: false })

export default function LazyGallery() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(el)

    // fallback por si el observer falla
    const timeout = setTimeout(() => setVisible(true), 3000)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div ref={ref}>
      {visible ? (
        <GalleryGrid />
      ) : (
        <section className="section-editorial px-6 bg-white">
          <div className="max-w-6xl mx-auto text-center py-24 opacity-60">
            cargando galería…
          </div>
        </section>
      )}
    </div>
  )
}
