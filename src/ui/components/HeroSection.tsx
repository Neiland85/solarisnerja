"use client"

import Link from "next/link"

/* ── Solaris Nerja Logo ──
   Sol estático + 3 ondas horizontales con animación sine lenta.
   SVG inline = 0 network requests, GPU-composited via transform. */

function SolarisLogo({ size = 80 }: { size?: number }) {
  const w = size
  const h = size * 0.75
  const cx = w / 2
  const sunR = w * 0.15
  const sunCy = h * 0.3

  /* Wave paths — 3 líneas sinusoidales debajo del sol */
  const waveY0 = h * 0.58
  const waveGap = h * 0.12
  const amp = w * 0.06
  const wl = w * 0.25 // quarter-wavelength

  function wavePath(y: number): string {
    return [
      `M ${-w * 0.3} ${y}`,
      `C ${-w * 0.3 + wl} ${y - amp}, ${wl * 2 - w * 0.3} ${y + amp}, ${w * 0.2} ${y}`,
      `C ${w * 0.2 + wl} ${y - amp}, ${w * 0.2 + wl * 2} ${y + amp}, ${w * 0.7} ${y}`,
      `C ${w * 0.7 + wl} ${y - amp}, ${w * 0.7 + wl * 2} ${y + amp}, ${w * 1.2} ${y}`,
      `C ${w * 1.2 + wl} ${y - amp}, ${w * 1.2 + wl * 2} ${y + amp}, ${w * 1.7} ${y}`,
    ].join(" ")
  }

  return (
    <div className="mb-10" aria-hidden="true">
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
        role="img"
        aria-label="Solaris Nerja logo"
      >
        {/* Clip para contener las ondas dentro del viewBox */}
        <defs>
          <clipPath id="sn-wave-clip">
            <rect x="0" y={waveY0 - amp - 2} width={w} height={h - waveY0 + amp + 4} />
          </clipPath>
        </defs>

        {/* Sol — estático */}
        <circle cx={cx} cy={sunCy} r={sunR} fill="currentColor" />

        {/* Ondas — animadas con CSS */}
        <g clipPath="url(#sn-wave-clip)">
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={wavePath(waveY0 + i * waveGap)}
              stroke="currentColor"
              strokeWidth={1.4}
              strokeLinecap="round"
              className="sn-wave"
              style={{
                animationDelay: `${i * -2}s`,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="bg-white text-black min-h-[92vh] flex flex-col items-center justify-center text-center px-6">
      {/* Logo animado */}
      <SolarisLogo size={80} />

      <h1 className="text-[clamp(64px,10vw,140px)] font-black leading-[0.9] tracking-tight">
        SOLARIS
      </h1>
      <h1 className="text-[clamp(64px,10vw,140px)] font-black leading-[0.9] tracking-tight">
        NERJA
      </h1>

      <p className="mt-8 text-lg md:text-xl max-w-lg opacity-70">
        Electronic music by the sea
      </p>

      <div className="mt-14">
        <Link
          href="/eventos"
          className="inline-flex items-center justify-center border-2 border-black px-12 py-4
            text-lg font-semibold tracking-wide transition hover:bg-black hover:text-white"
        >
          TICKETS
        </Link>
      </div>

      <div className="mt-20 text-xs tracking-[0.35em] uppercase opacity-60">
        Costa del Sol · Summer 2026
      </div>
    </section>
  )
}
