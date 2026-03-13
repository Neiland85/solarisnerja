"use client"

import { useEffect, useRef, useCallback, useState } from "react"

/**
 * ArtistModal — Full-screen overlay with artist info + ticket CTA.
 *
 * Transitions (CSS-only, no JS animation libraries):
 *   1. Backdrop fades in with blur    (opacity 0→1, backdrop-filter 0→8px)
 *   2. Card slides up from bottom     (translateY 40px→0)
 *   3. Content sections fade in       (staggered opacity 0→1, translateY 12px→0)
 *   4. CTA pulses once on arrival     (scale 1→1.02→1)
 *   5. Close reverses: card slides down, backdrop fades out
 *
 * A11y: focus-trap, ESC closes, click-outside closes, aria-modal,
 *       prefers-reduced-motion disables all animations.
 * Brand: --font-space-mono, --sn-solar, --sn-deep-blue.
 */

export type ArtistModalProps = {
  open: boolean
  onClose: () => void
  artist: {
    id: string
    title: string
    description: string
    highlight: string
    ticketUrl: string
    time?: string
    logo?: string
  } | null
}

/* ── Durations (ms) ── */
const BACKDROP_MS = 300
const SLIDE_MS = 400
const STAGGER_BASE_MS = 120
const EXIT_MS = 280

export default function ArtistModal({ open, onClose, artist }: ArtistModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Controls whether the DOM is mounted (stays true during exit animation)
  const [mounted, setMounted] = useState(false)
  // Controls the "visible" CSS state (triggers transitions)
  const [visible, setVisible] = useState(false)

  /* ── Mount / animate-in / animate-out logic ── */
  useEffect(() => {
    if (open && artist) {
      const mountFrame = requestAnimationFrame(() => {
        setMounted(true)
        // rAF ensures the DOM is painted before we flip visible → triggers CSS transition
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true))
        })
      })

      return () => cancelAnimationFrame(mountFrame)
    } else if (!open && mounted) {
      // Exit: flip visible off, then unmount after transition
      const hideFrame = requestAnimationFrame(() => setVisible(false))
      const t = setTimeout(() => setMounted(false), EXIT_MS)

      return () => {
        cancelAnimationFrame(hideFrame)
        clearTimeout(t)
      }
    }
  }, [open, artist, mounted])

  /* ── Focus management ── */
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => closeRef.current?.focus(), SLIDE_MS)
    document.body.style.overflow = "hidden"
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ""
    }
  }, [visible])

  /* ── ESC key handler ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose()
      }
      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]!
        const last = focusable[focusable.length - 1]!
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose],
  )

  /* ── Click outside ── */
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose],
  )

  if (!mounted || !artist) return null

  const hasRealUrl = artist.ticketUrl && artist.ticketUrl !== "#"

  /* ── Stagger helper: returns inline transition-delay for nth content block ── */
  const stagger = (n: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: `opacity ${STAGGER_BASE_MS}ms ease, transform ${STAGGER_BASE_MS}ms ease`,
    transitionDelay: visible ? `${SLIDE_MS + n * STAGGER_BASE_MS}ms` : "0ms",
  })

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Información de ${artist.title}`}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(8px)" : "blur(0px)",
        WebkitBackdropFilter: visible ? "blur(8px)" : "blur(0px)",
        transition: `background-color ${BACKDROP_MS}ms ease, backdrop-filter ${BACKDROP_MS}ms ease, -webkit-backdrop-filter ${BACKDROP_MS}ms ease`,
      }}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      {/* ── Card — slides from bottom ── */}
      <div
        className="relative bg-white mx-4 mb-0 sm:mb-0 w-full max-w-lg p-8 space-y-6"
        style={{
          fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
          borderTop: "3px solid var(--sn-solar, #FF3300)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: `opacity ${SLIDE_MS}ms cubic-bezier(.16,1,.3,1), transform ${SLIDE_MS}ms cubic-bezier(.16,1,.3,1)`,
        }}
      >
        {/* Close button — fades with card */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-lg hover:opacity-60 transition-opacity"
          style={{ color: "var(--sn-text, #0a0a0a)" }}
        >
          ✕
        </button>

        {/* Header: time + highlight — stagger 0 */}
        <div className="space-y-1" style={stagger(0)}>
          {artist.time && (
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--sn-deep-blue, #4141C6)" }}
            >
              {artist.time}
            </p>
          )}
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--sn-muted, #717171)" }}
          >
            {artist.highlight}
          </p>
        </div>

        {/* Artist name — stagger 1 */}
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{
            color: "var(--sn-text, #0a0a0a)",
            ...stagger(1),
          }}
        >
          {artist.title}
        </h2>

        {/* Description — stagger 2 */}
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "var(--sn-muted, #717171)",
            ...stagger(2),
          }}
        >
          {artist.description}
        </p>

        {/* Horizon divider — stagger 3 */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--sn-solar, #FF3300), var(--sn-deep-blue, #4141C6), transparent)",
            ...stagger(3),
          }}
        />

        {/* CTA — stagger 4, with arrival pulse */}
        <div style={stagger(4)}>
          {hasRealUrl ? (
            <a
              href={artist.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="artist-modal-cta block w-full text-center py-3 text-sm font-bold tracking-widest uppercase transition-colors"
              style={{
                backgroundColor: "var(--sn-solar, #FF3300)",
                color: "#fff",
                animation: visible
                  ? `artistModalPulse 500ms ${SLIDE_MS + 4 * STAGGER_BASE_MS + 100}ms ease both`
                  : "none",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--sn-deep-blue, #4141C6)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--sn-solar, #FF3300)"
              }}
            >
              Comprar entradas
            </a>
          ) : (
            <a
              href={`/eventos/${artist.id}`}
              className="block w-full text-center py-3 text-sm font-bold tracking-widest uppercase border-2 transition-colors"
              style={{
                borderColor: "var(--sn-text, #0a0a0a)",
                color: "var(--sn-text, #0a0a0a)",
              }}
            >
              Más información
            </a>
          )}
        </div>

        {/* Micro brand — stagger 5 */}
        <p
          className="text-center text-xs tracking-widest uppercase"
          style={{
            color: "rgba(0,0,0,0.15)",
            ...stagger(5),
          }}
        >
          Solaris Nerja
        </p>
      </div>
    </div>
  )
}
