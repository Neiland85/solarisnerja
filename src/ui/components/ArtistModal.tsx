"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import Image from "next/image"

/**
 * ArtistModal — Festival-style bottom-sheet (mobile) / centered card (desktop).
 *
 * Mobile UX (< 640px):
 *   - Full-width bottom-sheet with rounded top corners
 *   - Drag-handle pill at top — drag ≥80px down to close
 *   - Safe-area padding (env(safe-area-inset-bottom))
 *   - Large touch targets (min 48px)
 *   - max-height: 85dvh, overflow-y: auto
 *
 * Desktop (≥ 640px):
 *   - Centered card, max-w-lg, same transitions as before
 *
 * Transitions (CSS-only):
 *   1. Backdrop fade + blur
 *   2. Sheet slides from bottom (translateY 100% → 0 on mobile, 40px → 0 desktop)
 *   3. Content staggered fade-in
 *   4. CTA pulse on arrival
 *   5. Exit reverses all
 *
 * A11y: focus-trap, ESC closes, click-outside closes, aria-modal,
 *       prefers-reduced-motion kills all motion.
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
const DRAG_CLOSE_THRESHOLD = 80

export default function ArtistModal({ open, onClose, artist }: ArtistModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  /* ── Drag-to-close state (touch only, no heavy libs) ── */
  const dragState = useRef({ startY: 0, currentY: 0, dragging: false })
  const [dragOffset, setDragOffset] = useState(0)

  /* ── Mount / animate-in / animate-out ── */
  useEffect(() => {
    if (open && artist) {
      const mountFrame = requestAnimationFrame(() => {
        setMounted(true)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true))
        })
      })
      return () => cancelAnimationFrame(mountFrame)
    } else if (!open && mounted) {
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

  /* ── ESC key ── */
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

  /* ── Touch drag handlers (mobile bottom-sheet) ── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    dragState.current = { startY: touch.clientY, currentY: touch.clientY, dragging: true }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragState.current.dragging) return
    const touch = e.touches[0]
    if (!touch) return
    dragState.current.currentY = touch.clientY
    const dy = Math.max(0, touch.clientY - dragState.current.startY)
    setDragOffset(dy)
  }, [])

  const handleTouchEnd = useCallback(() => {
    const dy = dragState.current.currentY - dragState.current.startY
    dragState.current.dragging = false
    if (dy >= DRAG_CLOSE_THRESHOLD) {
      onClose()
    }
    setDragOffset(0)
  }, [onClose])

  if (!mounted || !artist) return null

  const hasRealUrl = artist.ticketUrl && artist.ticketUrl !== "#"

  /* ── Stagger helper ── */
  const stagger = (n: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: `opacity ${STAGGER_BASE_MS}ms ease, transform ${STAGGER_BASE_MS}ms ease`,
    transitionDelay: visible ? `${SLIDE_MS + n * STAGGER_BASE_MS}ms` : "0ms",
  })

  /* ── Sheet transform (accounts for drag offset) ── */
  // Mobile: slides from 100% (fully off-screen). Desktop: from 40px.
  // --artist-sheet-hidden is set via CSS media query in globals.css.
  const sheetTransform = visible
    ? `translateY(${dragOffset}px)`
    : "var(--artist-sheet-hidden, translateY(100%))"

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Información de ${artist.title}`}
      className="artist-modal-overlay fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(8px)" : "blur(0px)",
        WebkitBackdropFilter: visible ? "blur(8px)" : "blur(0px)",
        transition: dragOffset > 0
          ? "none"
          : `background-color ${BACKDROP_MS}ms ease, backdrop-filter ${BACKDROP_MS}ms ease, -webkit-backdrop-filter ${BACKDROP_MS}ms ease`,
      }}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      {/* ── Sheet ── */}
      <div
        ref={sheetRef}
        className="artist-modal-sheet relative bg-[var(--sn-bg)] w-full sm:mx-4 sm:max-w-lg overflow-y-auto overscroll-contain"
        style={{
          fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
          borderTop: "3px solid var(--sn-solar, #FF3300)",
          opacity: visible ? 1 : 0,
          transform: sheetTransform,
          transition: dragOffset > 0
            ? "none"
            : `opacity ${SLIDE_MS}ms cubic-bezier(.16,1,.3,1), transform ${SLIDE_MS}ms cubic-bezier(.16,1,.3,1)`,
          maxHeight: "85dvh",
          borderRadius: "16px 16px 0 0",
          paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Drag handle (mobile) ── */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
          <div
            className="rounded-full"
            style={{
              width: 36,
              height: 4,
              backgroundColor: "rgba(0,0,0,0.15)",
            }}
          />
        </div>

        {/* ── Content wrapper ── */}
        <div className="px-6 pt-4 pb-2 sm:p-8 space-y-5">
          {/* Close button — min 48px touch target */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 min-w-[48px] min-h-[48px] flex items-center justify-center text-lg hover:opacity-60 transition-opacity"
            style={{ color: "var(--sn-text, #0a0a0a)" }}
          >
            ✕
          </button>

          {/* Logo / artist image — optimized with next/image */}
          {artist.logo && (
            <div
              className="relative w-full overflow-hidden rounded"
              style={{
                aspectRatio: "16/9",
                ...stagger(0),
              }}
            >
              <Image
                src={artist.logo}
                alt={artist.title}
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
                priority={false}
              />
            </div>
          )}

          {/* Header: time + highlight */}
          <div className="space-y-1" style={stagger(artist.logo ? 1 : 0)}>
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

          {/* Artist name */}
          <h2
            className="text-2xl sm:text-2xl font-bold tracking-tight"
            style={{
              color: "var(--sn-text, #0a0a0a)",
              ...stagger(artist.logo ? 2 : 1),
            }}
          >
            {artist.title}
          </h2>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--sn-muted, #717171)",
              ...stagger(artist.logo ? 3 : 2),
            }}
          >
            {artist.description}
          </p>

          {/* Horizon divider */}
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--sn-solar, #FF3300), var(--sn-deep-blue, #4141C6), transparent)",
              ...stagger(artist.logo ? 4 : 3),
            }}
          />

          {/* CTA — large touch target (min 48px), full width on mobile */}
          <div style={stagger(artist.logo ? 5 : 4)}>
            {hasRealUrl ? (
              <a
                href={artist.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="artist-modal-cta block w-full text-center py-4 text-sm font-bold tracking-widest uppercase transition-colors"
                style={{
                  backgroundColor: "var(--sn-solar, #FF3300)",
                  color: "#fff",
                  minHeight: 48,
                  lineHeight: "48px",
                  paddingTop: 0,
                  paddingBottom: 0,
                  animation: visible
                    ? `artistModalPulse 500ms ${SLIDE_MS + (artist.logo ? 5 : 4) * STAGGER_BASE_MS + 100}ms ease both`
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
                className="block w-full text-center py-4 text-sm font-bold tracking-widest uppercase border-2 transition-colors"
                style={{
                  borderColor: "var(--sn-text, #0a0a0a)",
                  color: "var(--sn-text, #0a0a0a)",
                  minHeight: 48,
                }}
              >
                Más información
              </a>
            )}
          </div>

          {/* Micro brand */}
          <p
            className="text-center text-xs tracking-widest uppercase"
            style={{
              color: "rgba(0,0,0,0.15)",
              ...stagger(artist.logo ? 6 : 5),
            }}
          >
            Solaris Nerja
          </p>
        </div>
      </div>
    </div>
  )
}
