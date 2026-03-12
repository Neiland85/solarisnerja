"use client"

import { useState, useCallback, useRef, useEffect } from "react"

type Props = {
  artistName: string
  href: string
  colorIndex?: number
}

const LABEL_COLORS = [
  { bg: "#e63946", border: "#c1121f" },
  { bg: "#ff6b00", border: "#cc5500" },
  { bg: "#2ec4b6", border: "#1fa898" },
  { bg: "#7b2d8e", border: "#5a1f68" },
  { bg: "#e85d75", border: "#c94058" },
  { bg: "#f4a261", border: "#e08c3b" },
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
  if (longest <= 5) return 11
  if (longest <= 8) return 9
  if (longest <= 12) return 7.5
  return 6.5
}

export default function VinylButton({ artistName, href, colorIndex = 0 }: Props) {
  const idx = colorIndex % LABEL_COLORS.length
  const color = {
    bg: LABEL_COLORS[idx]?.bg ?? "#e63946",
    border: LABEL_COLORS[idx]?.border ?? "#c1121f",
  }
  const lines = splitName(artistName)
  const fSize = calcFontSize(lines)
  const uid = artistName.replace(/\s+/g, "").toLowerCase()

  const [popped, setPopped] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (popped) return
      setPopped(true)
      timer.current = setTimeout(() => {
        window.open(href, "_blank", "noopener,noreferrer")
      }, 600)
    },
    [href, popped]
  )

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Comprar entradas — ${artistName}`}
      className="inline-block relative cursor-pointer bg-transparent border-none p-0"
      style={{ width: 170, height: 170 }}
    >
      <style>{`
        /* ── Spin continuo ── */
        @keyframes vinyl-spin-${uid} {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .vinyl-disc-${uid} {
          animation: vinyl-spin-${uid} 4s linear infinite;
          transform-origin: 85px 85px;
        }
        .vinyl-disc-${uid}:hover {
          animation-duration: 1.5s;
        }

        /* ── Anime pop: la galleta se hincha y rebota ── */
        @keyframes anime-pop-${uid} {
          0%   { transform: scale(1); }
          15%  { transform: scale(1.75); }
          30%  { transform: scale(1.55); }
          45%  { transform: scale(1.85); }
          60%  { transform: scale(1.6); }
          75%  { transform: scale(2.1); }
          85%  { transform: scale(1.9); }
          100% { transform: scale(2.2); }
        }

        /* ── Flash de brillo anime ── */
        @keyframes anime-flash-${uid} {
          0%   { opacity: 0; }
          20%  { opacity: 0.7; }
          50%  { opacity: 0; }
          70%  { opacity: 0.5; }
          100% { opacity: 0; }
        }

        /* ── Texto del artista escala con la galleta ── */
        @keyframes anime-text-pop-${uid} {
          0%   { font-size: ${fSize}px; }
          50%  { font-size: ${fSize * 1.3}px; }
          100% { font-size: ${fSize * 1.2}px; }
        }

        .label-${uid} {
          transform-origin: 85px 85px;
          transform: scale(1);
        }
        .popped .label-${uid} {
          animation: anime-pop-${uid} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .flash-${uid} {
          opacity: 0;
          transform-origin: 85px 85px;
        }
        .popped .flash-${uid} {
          animation: anime-flash-${uid} 0.5s ease-out forwards;
        }

        /* ── ENTRADAS parpadeante en el surco ── */
        @keyframes blink-${uid} {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        .blink-text-${uid} {
          animation: blink-${uid} 1.2s ease-in-out infinite;
        }

        /* ── Disco se desvanece tras el pop ── */
        .disc-body-${uid} {
          opacity: 1;
          transition: opacity 0.3s ease 0.3s;
        }
        .popped .disc-body-${uid} {
          opacity: 0.15;
        }
      `}</style>

      <svg
        width="170"
        height="170"
        viewBox="0 0 170 170"
        xmlns="http://www.w3.org/2000/svg"
        className={`vinyl-disc-${uid}${popped ? " popped" : ""}`}
        style={{
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
          animationPlayState: popped ? "paused" : undefined,
        }}
      >
        <defs>
          <radialGradient id={`sheen-${uid}`}>
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <path
            id={`arc-${uid}`}
            d="M 85,85 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
          />
          {/* Surco intermedio para texto ENTRADAS parpadeante */}
          <path
            id={`groove-${uid}`}
            d="M 85,85 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0"
          />
          <radialGradient id={`pop-flash-${uid}`}>
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="60%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Cuerpo del disco (se atenúa tras pop) ── */}
        <g className={`disc-body-${uid}`}>
          <circle cx="85" cy="85" r="83" fill="#f0ebe3" stroke="#ddd5c9" strokeWidth="1" />
          <circle cx="85" cy="85" r="75" fill="none" stroke="#e2dbd0" strokeWidth="0.6" />
          <circle cx="85" cy="85" r="69" fill="none" stroke="#ded6ca" strokeWidth="0.4" />
          <circle cx="85" cy="85" r="63" fill="none" stroke="#e2dbd0" strokeWidth="0.6" />
          <circle cx="85" cy="85" r="57" fill="none" stroke="#ded6ca" strokeWidth="0.4" />
          <circle cx="85" cy="85" r="51" fill="none" stroke="#e2dbd0" strokeWidth="0.6" />
          <circle cx="85" cy="85" r="45" fill="none" stroke="#ded6ca" strokeWidth="0.4" />
          <ellipse
            cx="65" cy="58" rx="38" ry="26"
            fill={`url(#sheen-${uid})`}
            transform="rotate(-30 65 58)"
          />
          <text
            fill="#b8ad9e"
            fontFamily="system-ui, sans-serif"
            fontSize="7"
            letterSpacing="3.5"
          >
            <textPath href={`#arc-${uid}`} startOffset="8%">
              COMPRAR ENTRADAS
            </textPath>
          </text>

          {/* ── ENTRADAS parpadeante en surco intermedio ── */}
          <text
            className={`blink-text-${uid}`}
            fill={color.bg}
            fontFamily="system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="800"
            letterSpacing="4"
          >
            <textPath href={`#groove-${uid}`} startOffset="62%">
              ENTRADAS
            </textPath>
          </text>
        </g>

        {/* ── Galleta central (anime pop al click) ── */}
        <g className={`label-${uid}`}>
          <circle cx="85" cy="85" r="32" fill={color.bg} />
          <circle cx="85" cy="85" r="30" fill="none" stroke={color.border} strokeWidth="0.6" />

          {lines.map((line, i) => {
            const totalHeight = lines.length * (fSize + 2)
            const startY = 85 - totalHeight / 2 + fSize / 2 + i * (fSize + 2) - 2
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
              >
                {line}
              </text>
            )
          })}

          <text
            x="85"
            y={85 + 14}
            textAnchor="middle"
            fill="rgba(255,255,255,0.75)"
            fontFamily="system-ui, sans-serif"
            fontSize="5.5"
            letterSpacing="0.5"
          >
            SOLARIS NERJA
          </text>

          <circle cx="85" cy="85" r="4.5" fill="#f0ebe3" />
          <circle cx="85" cy="85" r="3.5" fill="#e8e1d6" />
        </g>

        {/* ── Flash de brillo anime ── */}
        <circle
          cx="85" cy="85" r="36"
          fill={`url(#pop-flash-${uid})`}
          className={`flash-${uid}`}
        />
      </svg>
    </button>
  )
}
