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
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
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
