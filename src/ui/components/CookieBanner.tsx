"use client"

import { useState, useCallback } from "react"
import Link from "next/link"

const COOKIE_KEY = "sn_cookie_consent"

function hasConsent(): boolean {
  if (typeof document === "undefined") return true
  const v = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_KEY}=`))
    ?.split("=")[1]
  return v === "accepted" || v === "rejected"
}

function setConsent(value: "accepted" | "rejected") {
  const maxAge = 180 * 24 * 60 * 60
  document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`
}

export function CookieBanner() {
  // Initialize state directly from cookie — no useEffect needed
  const [dismissed, setDismissed] = useState(hasConsent)

  const handleAccept = useCallback(() => {
    setConsent("accepted")
    setDismissed(true)
  }, [])

  const handleReject = useCallback(() => {
    setConsent("rejected")
    setDismissed(true)
  }, [])

  if (dismissed) return null

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto rounded-[var(--sn-radius-xl)] border border-[var(--sn-border)] bg-[color:var(--sn-surface)]/95 backdrop-blur-lg p-5 md:p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-[color:var(--sn-muted)] leading-relaxed">
              Usamos cookies propias y de terceros (Google Analytics, Facebook Pixel)
              para mejorar tu experiencia y analizar el tráfico.
              Puedes aceptar, rechazar o consultar nuestra{" "}
              <Link
                href="/privacidad"
                className="underline hover:text-white transition"
              >
                política de privacidad
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm rounded-lg border border-[var(--sn-border)] text-[color:var(--sn-muted)] hover:text-white hover:border-white/30 transition"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm rounded-lg bg-white text-black font-medium hover:bg-white/90 transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
