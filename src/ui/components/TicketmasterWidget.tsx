"use client"

import { useEffect, useRef, useState } from "react"
import { trackEvent } from "@/lib/tracking"

type Props = {
  eventId: string
  ticketUrl: string
}

export function TicketmasterWidget({ eventId, ticketUrl }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    trackEvent("ticket_widget_view", { eventId })

    const script = document.createElement("script")
    script.src = "https://widget.ticketmaster.com/widget.js"
    script.async = true

    script.onload = () => {
      setLoaded(true)
    }

    script.onerror = () => {
      setLoaded(false)
    }

    const node = containerRef.current
    node.appendChild(script)

    return () => {
      if (node) node.innerHTML = ""
    }
  }, [eventId])

  return (
    <div className="mt-10 space-y-6">

      {/* Widget container */}
      <div
        ref={containerRef}
        onClick={() => trackEvent("ticket_widget_click", { eventId })}
        className="min-h-[300px] rounded-[var(--sn-radius-xl)]
          border border-[var(--sn-border)]
          bg-[color:var(--sn-surface)]/70
          backdrop-blur p-6"
      >
        {!loaded && (
          <p className="text-sm text-[color:var(--sn-muted)]">
            Cargando venta oficial Ticketmaster…
          </p>
        )}
      </div>

      {/* Fallback link */}
      <div className="text-center">
        <a
          href={ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("ticket_fallback_click", { eventId })}
          className="text-sm text-[color:var(--sn-muted)] underline hover:text-white transition"
        >
          Abrir venta oficial en nueva pestaña
        </a>
      </div>

    </div>
  )
}
