"use client"

import { useState, useRef, useCallback, useEffect } from "react"

const LOGO_VIDEOS = [
  "/logo3d/logo_dsolaris_3d_lento-sutil.mp4",
  "/logo3d/logo_dsolaris_3d_oficial.mp4",
  "/logo3d/logo_dsolaris_3d_misiles-flores.mp4",
  "/logo3d/logo_dsolaris_3d_oficial_aurora_boreal.mp4",
  "/logo3d/logo_dsolaris_3d_tosfinal.mp4",
  "/logo3d/logo_solaris-3d-resfriado-potente.mp4",
]

export default function Logo3DInteractive() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  const cycleVideo = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    const next = (currentIndex + 1) % LOGO_VIDEOS.length
    setCurrentIndex(next)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [currentIndex, isTransitioning])

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    function draw() {
      if (!video || !canvas || !ctx) return

      if (!video.paused && !video.ended && video.videoWidth > 0) {
        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight

        ctx.drawImage(video, 0, 0)
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const d = frame.data

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i] as number, g = d[i + 1] as number, b = d[i + 2] as number
          const minChannel = Math.min(r, g, b)
          if (minChannel > 200) {
            const alpha = Math.max(0, (240 - minChannel) / 40)
            d[i + 3] = Math.round(alpha * 255)
          }
        }

        ctx.putImageData(frame, 0, 0)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    const onPlay = () => { rafRef.current = requestAnimationFrame(draw) }
    video.addEventListener("playing", onPlay)
    if (!video.paused) onPlay()

    return () => {
      video.removeEventListener("playing", onPlay)
      cancelAnimationFrame(rafRef.current)
    }
  }, [currentIndex])

  return (
    <button
      onClick={cycleVideo}
      className="group relative w-24 h-24 md:w-28 md:h-28 cursor-pointer focus:outline-none"
      aria-label="Cambiar animación del logo 3D"
      type="button"
    >
      <video
        ref={videoRef}
        key={LOGO_VIDEOS[currentIndex]}
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
      >
        <source src={LOGO_VIDEOS[currentIndex]} type="video/mp4" />
      </video>

      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      />

      <span className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/20 group-hover:scale-110 transition-all duration-500" />
    </button>
  )
}
