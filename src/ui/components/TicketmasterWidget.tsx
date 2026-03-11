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
        className="min-h-75 rounded-(--sn-radius-xl)
          border border-(--sn-border)
          bg-(--sn-surface)/70
          backdrop-blur p-6"
      >
        {!loaded && (
          <p className="text-sm text-(--sn-muted)">
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
          className="text-sm text-(--sn-muted) underline hover:text-white transition"
        >
          Abrir venta oficial en nueva pestaña
        </a>
      </div>
    </div>
  )
}
