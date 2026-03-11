"use client"

import { EVENTS } from "@/config/events"
import Image from "next/image"
import { useState } from "react"

/* ── Logos de promotores que flotan y rotan 360° ── */
const FLOATING_LOGOS = [
  { src: "/events/TROPICALIA POST - 2.png", alt: "Tropicalia", size: 70 },
  { src: "/events/techno flamenco.png", alt: "Techno Flamenco", size: 65 },
  { src: "/solaris_logo.png", alt: "Solaris Nerja", size: 60 },
]

/* ── Fotos ambientales de fondo ── */
const AMBIENT_PHOTOS = ["/gallery/escenario noche.webp", "/gallery/sidonie publico.webp"]

export default function ProgramacionSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <section id="eventos" className="relative overflow-hidden py-28">
      {/* ══ KEYFRAMES ══ */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @keyframes float-y {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-18px); }
        }
        @keyframes float-x {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(14px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.12; filter: blur(60px); }
          50%      { opacity: 0.22; filter: blur(80px); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes orbit {
          0%   { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        @keyframes drift-diagonal {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25%      { transform: translate(20px, -15px) rotate(90deg); }
          50%      { transform: translate(-10px, -30px) rotate(180deg); }
          75%      { transform: translate(-25px, -10px) rotate(270deg); }
        }
        .card-enter {
          animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .shimmer-border {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>

      {/* ══ GRADIENT BACKGROUND ══ */}
      <div className="absolute inset-0 bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950" />

      {/* ══ AMBIENT PHOTO OVERLAYS ══ */}
      {AMBIENT_PHOTOS.map((photo, i) => (
        <div
          key={photo}
          className="absolute pointer-events-none"
          style={{
            top: i === 0 ? "-5%" : "auto",
            bottom: i === 1 ? "-5%" : "auto",
            left: i === 0 ? "-8%" : "auto",
            right: i === 1 ? "-8%" : "auto",
            width: "45%",
            height: "55%",
            opacity: 0.07,
            animation: `float-${i === 0 ? "y" : "x"} ${8 + i * 3}s ease-in-out infinite`,
          }}
        >
          <Image
            src={photo}
            alt=""
            fill
            className="object-cover rounded-3xl"
            style={{ filter: "blur(2px) saturate(0.3)" }}
            sizes="45vw"
          />
        </div>
      ))}

      {/* ══ PULSING GLOW ORBS ══ */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500 pointer-events-none"
        style={{ animation: "pulse-glow 6s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-rose-500 pointer-events-none"
        style={{ animation: "pulse-glow 8s ease-in-out infinite 2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-blue-500 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ animation: "pulse-glow 7s ease-in-out infinite 1s" }}
      />

      {/* ══ FLOATING LOGOS — 360° ROTATION ══ */}
      {FLOATING_LOGOS.map((logo, i) => {
        const positions = [
          { top: "8%", right: "6%" },
          { bottom: "12%", left: "4%" },
          { top: "45%", right: "3%" },
        ]
        const durations = [18, 22, 25]
        const delays = [0, 3, 6]
        const animations = ["spin-slow", "spin-reverse", "drift-diagonal"]

        return (
          <div
            key={logo.alt}
            className="absolute pointer-events-none z-10"
            style={{
              ...positions[i],
              animation: `float-y ${6 + i * 2}s ease-in-out infinite ${delays[i]}s`,
            }}
          >
            <div
              style={{
                width: logo.size,
                height: logo.size,
                animation: `${animations[i]} ${durations[i]}s linear infinite`,
                opacity: 0.15,
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.size}
                height={logo.size}
                className="rounded-full object-contain"
                style={{
                  filter: "brightness(1.5) drop-shadow(0 0 20px rgba(255,255,255,0.2))",
                }}
              />
            </div>
          </div>
        )
      })}

      {/* ══ EXTRA ORBITAL LOGOS (more subtle, smaller) ══ */}
      {FLOATING_LOGOS.map((logo, i) => {
        const positions = [
          { top: "65%", left: "10%" },
          { top: "15%", left: "45%" },
          { bottom: "8%", right: "20%" },
        ]

        return (
          <div
            key={`orbit-${logo.alt}`}
            className="absolute pointer-events-none z-10"
            style={{ ...positions[i] }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                animation: `orbit ${15 + i * 5}s linear infinite ${i * 2}s`,
                opacity: 0.1,
              }}
            >
              <Image
                src={logo.src}
                alt=""
                width={40}
                height={40}
                className="rounded-full object-contain"
                style={{ filter: "brightness(2) grayscale(0.5)" }}
              />
            </div>
          </div>
        )
      })}

      {/* ══ CONTENT ══ */}
      <div className="relative z-20 max-w-6xl mx-auto px-6">
        {/* ── Header ── */}
        <div className="text-center mb-20">
          <p className="text-amber-400 uppercase tracking-[0.3em] text-sm mb-4 font-medium">
            18 — 28 Junio 2025
          </p>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Programación
          </h2>
          <div className="mt-6 mx-auto w-24 h-0.5 shimmer-border rounded-full" />
          <p className="mt-6 text-neutral-400 text-lg max-w-lg mx-auto">
            Conciertos, DJ sets y experiencias durante 10 días frente al mar.
          </p>
        </div>

        {/* ── Event Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENTS.map((event, index) => (
            <div
              key={event.id}
              className="card-enter group relative"
              style={{ animationDelay: `${index * 0.12}s` }}
              onMouseEnter={() => setHoveredCard(event.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glow behind card on hover */}
              <div
                className="absolute -inset-2 rounded-2xl transition-opacity duration-500 pointer-events-none"
                style={{
                  opacity: hoveredCard === event.id ? 1 : 0,
                  background:
                    "radial-gradient(ellipse at center, rgba(251,191,36,0.15), transparent 70%)",
                }}
              />

              <div
                className="relative rounded-2xl overflow-hidden transition-all duration-500 ease-out"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transform:
                    hoveredCard === event.id
                      ? "translateY(-8px) scale(1.02)"
                      : "translateY(0) scale(1)",
                  boxShadow:
                    hoveredCard === event.id
                      ? "0 25px 60px -12px rgba(0,0,0,0.5), 0 0 40px rgba(251,191,36,0.1)"
                      : "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                {/* ── Card Image / Logo placeholder ── */}
                {event.logo ? (
                  <div className="relative h-50 overflow-hidden">
                    <Image
                      src={event.logo}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-900/80 to-transparent" />
                  </div>
                ) : (
                  <div className="relative h-50 overflow-hidden">
                    {/* Gradient placeholder with floating mini logo */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg,
                          hsl(${index * 50 + 200}, 40%, 15%),
                          hsl(${index * 50 + 240}, 50%, 8%))`,
                      }}
                    />
                    {/* Decorative grid lines */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />
                    {/* Floating event number */}
                    <div className="absolute top-4 right-4 text-white/10 text-7xl font-black">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-900/80 to-transparent" />
                  </div>
                )}

                {/* ── Card Content ── */}
                <div className="relative p-6 space-y-4">
                  {/* Date badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))",
                        color: "#fbbf24",
                        border: "1px solid rgba(251,191,36,0.2)",
                      }}
                    >
                      {event.date ? `${event.date} · ${event.time}` : event.time}
                    </span>
                    <span className="text-neutral-500 text-xs uppercase tracking-wider">
                      {event.highlight}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors duration-300">
                    {event.title}
                  </h3>

                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {event.description}
                  </p>

                  {/* CTA button with shimmer */}
                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                    style={{
                      background:
                        hoveredCard === event.id
                          ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                          : "rgba(255,255,255,0.08)",
                      color: hoveredCard === event.id ? "#000" : "#fff",
                      border:
                        hoveredCard === event.id
                          ? "1px solid transparent"
                          : "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    Comprar entrada
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom ambient strip with photos ── */}
        <div className="mt-20 flex gap-4 overflow-hidden rounded-2xl h-30 opacity-40">
          {[
            "/gallery/escenario noche 2.webp",
            "/gallery/escenario dia.webp",
            "/gallery/escenario noche 3.webp",
            "/gallery/escenario dia 2.webp",
          ].map((src) => (
            <div key={src} className="relative flex-1 min-w-0">
              <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
