import Link from "next/link"
import type { Event } from "@/config/events"

export function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/eventos/${event.id}`}
      className="group block border border-[var(--sn-border-2)] p-6 md:p-8
        hover:bg-[var(--sn-surface)] transition-colors duration-200"
    >
      <div className="text-xs font-medium tracking-widest uppercase text-[var(--sn-muted)]">
        {event.highlight}
      </div>

      <h3 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight leading-tight">
        {event.title}
      </h3>

      <p className="mt-3 text-sm text-[var(--sn-muted)] leading-relaxed">
        {event.description}
      </p>

      <div className="mt-6 text-xs font-medium tracking-widest uppercase
        group-hover:underline underline-offset-4 transition-all">
        Ver detalles
      </div>
    </Link>
  )
}
