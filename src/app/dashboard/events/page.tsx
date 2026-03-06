import Link from "next/link"
import { findAllEvents } from "@/adapters/db/event-repository"

export const dynamic = "force-dynamic"

export default async function EventsListPage() {
  const events = await findAllEvents()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="editorial-h2">eventos</h1>
        <Link
          href="/dashboard/events/new"
          className="border-2 border-black px-6 py-2 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition"
        >
          nuevo evento
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-[var(--sn-muted)] tracking-wide">
          No hay eventos. Crea el primero.
        </p>
      ) : (
        <div className="border border-[rgba(0,0,0,0.08)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.08)] bg-[var(--sn-surface)]">
                <th className="text-left px-4 py-3 font-medium tracking-wide">título</th>
                <th className="text-left px-4 py-3 font-medium tracking-wide">highlight</th>
                <th className="text-center px-4 py-3 font-medium tracking-wide">activo</th>
                <th className="text-right px-4 py-3 font-medium tracking-wide">acción</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-[rgba(0,0,0,0.04)]">
                  <td className="px-4 py-3 tracking-wide">{event.title}</td>
                  <td className="px-4 py-3 tracking-wide text-[var(--sn-muted)]">{event.highlight}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${event.active ? "bg-green-500" : "bg-red-400"}`} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/events/edit/${event.id}`}
                      className="text-sm tracking-wide hover:opacity-60 transition underline"
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
