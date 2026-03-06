import Link from "next/link"
import { findAllEvents } from "@/adapters/db/event-repository"

export const dynamic = "force-dynamic"

export default async function EventsListPage() {
  const events = await findAllEvents()
  const activeCount = events.filter((e) => e.active).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="editorial-label mb-2">gestión</p>
          <h1 className="editorial-h2">eventos</h1>
        </div>
        <Link
          href="/dashboard/events/new"
          className="border-2 border-black px-6 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition"
        >
          + nuevo evento
        </Link>
      </div>

      {events.length > 0 && (
        <div className="flex gap-6 text-sm tracking-wide">
          <span className="text-[var(--sn-muted)]">
            {events.length} {events.length === 1 ? "evento" : "eventos"}
          </span>
          <span className="text-[var(--sn-muted)]">
            {activeCount} {activeCount === 1 ? "activo" : "activos"}
          </span>
        </div>
      )}

      {events.length === 0 ? (
        <div className="bg-white rounded-sm border border-dashed border-[var(--sn-border-2)] p-16 text-center">
          <p className="editorial-label mb-4">sin eventos</p>
          <p className="text-sm text-[var(--sn-muted)] tracking-wide mb-6">
            Aún no hay eventos creados. Empieza creando el primero.
          </p>
          <Link
            href="/dashboard/events/new"
            className="inline-block border-2 border-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition"
          >
            crear primer evento
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-[var(--sn-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--sn-border)] bg-[var(--sn-surface)]">
                <th className="text-left px-5 py-4 font-medium tracking-wide text-[var(--sn-muted)]">título</th>
                <th className="text-left px-5 py-4 font-medium tracking-wide text-[var(--sn-muted)]">highlight</th>
                <th className="text-center px-5 py-4 font-medium tracking-wide text-[var(--sn-muted)]">estado</th>
                <th className="text-right px-5 py-4 font-medium tracking-wide text-[var(--sn-muted)]">acción</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-[var(--sn-border)] last:border-b-0 hover:bg-[var(--sn-surface)] transition-colors"
                >
                  <td className="px-5 py-4 tracking-wide font-medium">{event.title}</td>
                  <td className="px-5 py-4 tracking-wide text-[var(--sn-muted)]">{event.highlight}</td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs tracking-wide ${
                        event.active
                          ? "bg-green-50 text-green-700"
                          : "bg-[var(--sn-surface-2)] text-[var(--sn-muted)]"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${event.active ? "bg-green-500" : "bg-[var(--sn-muted)]"}`} />
                      {event.active ? "activo" : "inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/events/edit/${event.id}`}
                      className="text-sm tracking-wide text-[var(--sn-muted)] hover:text-[var(--sn-text)] transition"
                    >
                      editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
