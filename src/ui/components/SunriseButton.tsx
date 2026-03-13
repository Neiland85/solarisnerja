"use client"

import { useState, useCallback, useRef, useEffect } from "react"

export type SunriseButtonProps = {
  artistName: string
  href: string
  colorIndex?: number
}

/**
 * Palette: warm Mediterranean tones — each event gets its own horizon.
 * Gradient goes from sun core (bright) to horizon glow (diffuse).
 */
const HORIZON_COLORS = [
  { sun: "#f59e0b", glow: "#fbbf24", horizon: "#dc8a18" },   // amber
  { sun: "#ef4444", glow: "#f87171", horizon: "#c2352e" },   // coral
  { sun: "#f97316", glow: "#fb923c", horizon: "#d4660f" },   // naranja
  { sun: "#a855f7", glow: "#c084fc", horizon: "#7e3fbd" },   // atardecer
  { sun: "#ec4899", glow: "#f472b6", horizon: "#c13584" },   // magenta
  { sun: "#06b6d4", glow: "#22d3ee", horizon: "#0891b2" },   // mediterráneo
]

function splitName(name: string): string[] {
  const upper = name.toUpperCase()
  const words = upper.split(/\s+/)
  if (words.length === 1 && upper.length > 10) {
    const mid = Math.ceil(upper.length / 2)
    return [upper.slice(0, mid), upper.slice(mid)]
  }
  if (words.length <= 2) return words
  return [
    words.slice(0, Math.ceil(words.length / 2)).join(" "),
    words.slice(Math.ceil(words.length / 2)).join(" "),
  ]
}

function calcFontSize(lines: string[]): number {
  const longest = Math.max(...lines.map((l) => l.length))
  if (longest <= 5) return 13
  if (longest <= 8) return 11
  if (longest <= 12) return 9
  return 7.5
}

export default function SunriseButton({
  artistName,
  href,
  colorIndex = 0,
}: SunriseButtonProps) {
  const idx = colorIndex % HORIZON_COLORS.length
  const palette = HORIZON_COLORS[idx] ?? HORIZON_COLORS[0]!
  const lines = splitName(artistName)
  const fSize = calcFontSize(lines)
  const uid = `sr-${artistName.replace(/\s+/g, "").toLowerCase()}`

  const [burst, setBurst] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (burst) return
      setBurst(true)
      timer.current = setTimeout(() => {
        window.open(href, "_blank", "noopener,noreferrer")
      }, 700)
    },
    [href, burst],
  )

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Comprar entradas — ${artistName}`}
      className="inline-block relative cursor-pointer bg-transparent border-none p-0 group"
      style={{ width: 170, height: 170 }}
    >
      <style>{`
        /* ── Breathing glow — el sol respira ── */
        @keyframes ${uid}-breathe {
          0%, 100% { r: 52; opacity: 0.25; }
          50%      { r: 58; opacity: 0.45; }
        }
        .${uid}-glow {
          animation: ${uid}-breathe 3.5s ease-in-out infinite;
        }
        button:hover .${uid}-glow {
          animation-duration: 2s;
        }

        /* ── Hover: sun lifts toward the sky ── */
        .${uid}-sun-group {
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        button:hover .${uid}-sun-group {
          transform: translateY(-4px);
        }

        /* ── Sunrise burst: rays expand on click ── */
        @keyframes ${uid}-burst {
          0%   { transform: scale(1); opacity: 1; }
          40%  { transform: scale(1.6); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .${uid}-burst-ring {
          opacity: 0;
          transform-origin: 85px 72px;
        }
        .${uid}-active .${uid}-burst-ring {
          animation: ${uid}-burst 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* ── Rays rotate slowly ── */
        @keyframes ${uid}-rays-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .${uid}-rays {
          transform-origin: 85px 72px;
          animation: ${uid}-rays-spin 25s linear infinite;
          opacity: 0.15;
          transition: opacity 0.4s ease;
        }
        button:hover .${uid}-rays {
          opacity: 0.3;
        }

        /* ── Horizon shimmer ── */
        @keyframes ${uid}-shimmer {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 0.8; }
        }
        .${uid}-horizon-line {
          animation: ${uid}-shimmer 4s ease-in-out infinite;
        }

        /* ── "ENTRADAS" pulse ── */
        @keyframes ${uid}-pulse {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1; }
        }
        .${uid}-entradas {
          animation: ${uid}-pulse 2s ease-in-out infinite;
        }

        /* ── Post-burst: body fades to let label shine ── */
        .${uid}-body {
          transition: opacity 0.3s ease 0.35s;
        }
        .${uid}-active .${uid}-body {
          opacity: 0.2;
        }
      `}</style>

      <svg
        width="170"
        height="170"
        viewBox="0 0 170 170"
        xmlns="http://www.w3.org/2000/svg"
        className={burst ? `${uid}-active` : ""}
        style={{ filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.06))" }}
      >
        <defs>
          {/* Sun radial gradient */}
          <radialGradient id={`${uid}-sun-grad`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.sun} stopOpacity="1" />
            <stop offset="70%" stopColor={palette.glow} stopOpacity="0.85" />
            <stop offset="100%" stopColor={palette.horizon} stopOpacity="0.6" />
          </radialGradient>

          {/* Glow gradient */}
          <radialGradient id={`${uid}-glow-grad`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.glow} stopOpacity="0.5" />
            <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
          </radialGradient>

          {/* Horizon gradient (sea/sky) */}
          <linearGradient id={`${uid}-horizon-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.glow} stopOpacity="0.08" />
            <stop offset="40%" stopColor={palette.sun} stopOpacity="0.04" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Burst ring gradient */}
          <radialGradient id={`${uid}-burst-grad`} cx="50%" cy="42%" r="50%">
            <stop offset="0%" stopColor={palette.sun} stopOpacity="0.6" />
            <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
          </radialGradient>

          {/* Text arc around sun */}
          <path
            id={`${uid}-arc`}
            d="M 85,72 m -56,0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0"
          />

          {/* Clip for sea reflection */}
          <clipPath id={`${uid}-sea-clip`}>
            <rect x="0" y="100" width="170" height="70" />
          </clipPath>
        </defs>

        {/* ── Background: warm sky gradient ── */}
        <rect x="0" y="0" width="170" height="170" rx="12" fill="#fefcf8" />
        <rect x="0" y="0" width="170" height="170" rx="12" fill={`url(#${uid}-horizon-grad)`} />

        <g className={`${uid}-body`}>
          {/* ── Subtle sun rays (slow rotation) ── */}
          <g className={`${uid}-rays`}>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180
              const x1 = 85 + Math.cos(angle) * 42
              const y1 = 72 + Math.sin(angle) * 42
              const x2 = 85 + Math.cos(angle) * 68
              const y2 = 72 + Math.sin(angle) * 68
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={palette.sun}
                  strokeWidth={i % 2 === 0 ? 1.5 : 0.8}
                  strokeLinecap="round"
                />
              )
            })}
          </g>

          {/* ── Horizon line ── */}
          <line
            x1="12" y1="100" x2="158" y2="100"
            stroke={palette.horizon}
            strokeWidth="1"
            className={`${uid}-horizon-line`}
          />

          {/* ── Sea reflection (subtle mirrored glow below horizon) ── */}
          <g clipPath={`url(#${uid}-sea-clip)`} opacity="0.12">
            <ellipse cx="85" cy="100" rx="50" ry="25" fill={palette.glow} />
          </g>

          {/* ── ENTRADAS text along horizon ── */}
          <text
            x="85" y="118"
            textAnchor="middle"
            fill={palette.horizon}
            fontFamily="system-ui, sans-serif"
            fontSize="7.5"
            fontWeight="700"
            letterSpacing="4"
            className={`${uid}-entradas`}
          >
            ENTRADAS
          </text>

          {/* ── "COMPRAR ENTRADAS" arc text ── */}
          <text
            fill={palette.horizon}
            fontFamily="system-ui, sans-serif"
            fontSize="6"
            letterSpacing="3"
            opacity="0.4"
          >
            <textPath href={`#${uid}-arc`} startOffset="15%">
              COMPRAR ENTRADAS
            </textPath>
          </text>
        </g>

        {/* ── Sun disc group (lifts on hover) ── */}
        <g className={`${uid}-sun-group`}>
          {/* Breathing glow */}
          <circle
            cx="85" cy="72" r="55"
            fill={`url(#${uid}-glow-grad)`}
            className={`${uid}-glow`}
          />

          {/* Sun body */}
          <circle
            cx="85" cy="72" r="35"
            fill={`url(#${uid}-sun-grad)`}
          />

          {/* Inner rim */}
          <circle
            cx="85" cy="72" r="33"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.5"
          />

          {/* Artist name */}
          {lines.map((line, i) => {
            const totalH = lines.length * (fSize + 2)
            const startY = 72 - totalH / 2 + fSize / 2 + i * (fSize + 2)
            return (
              <text
                key={i}
                x="85"
                y={startY}
                textAnchor="middle"
                fill="white"
                fontFamily="system-ui, sans-serif"
                fontSize={fSize}
                fontWeight="700"
                letterSpacing="0.8"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
              >
                {line}
              </text>
            )
          })}

          {/* SOLARIS NERJA label */}
          <text
            x="85"
            y={72 + 16}
            textAnchor="middle"
            fill="rgba(255,255,255,0.7)"
            fontFamily="system-ui, sans-serif"
            fontSize="5"
            letterSpacing="2"
          >
            SOLARIS NERJA
          </text>
        </g>

        {/* ── Burst ring (visible only on click) ── */}
        <circle
          cx="85" cy="72" r="35"
          fill="none"
          stroke={palette.sun}
          strokeWidth="2"
          className={`${uid}-burst-ring`}
        />
        <circle
          cx="85" cy="72" r="50"
          fill={`url(#${uid}-burst-grad)`}
          className={`${uid}-burst-ring`}
        />
      </svg>
    </button>
  )
}
