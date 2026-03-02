import Link from "next/link"
import type { Event } from "@/config/events"
import { Card } from "@/ui/components/UI"

export function EventCard({ event }: { event: Event }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-sm text-[color:var(--sn-muted)]">{event.tagline}</div>
        <span className="text-xs px-3 py-1 rounded-full border border-[var(--sn-border)] text-[color:var(--sn-muted)]">
          {event.highlight}
        </span>
      </div>

      <div className="mt-3 text-xl font-semibold">{event.title}</div>

      <p className="mt-3 text-sm text-[color:var(--sn-muted)] leading-relaxed">
        {event.description}
      </p>

      <div className="mt-5 flex gap-3">
        <Link
          href={`/eventos/${event.id}`}
          className="text-sm font-semibold text-white hover:text-[color:var(--sn-sand)] transition"
        >
          Ver detalles →
        </Link>
      </div>
    </Card>
  )
}
