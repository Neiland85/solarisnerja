import { getPool } from "@/adapters/db/pool"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const pool = getPool()

  const eventsResult = await pool.query(`
    SELECT COUNT(*) as total FROM events
  `)

  const activeResult = await pool.query(`
    SELECT COUNT(*) as total FROM events WHERE active = true
  `)

  const leadsResult = await pool.query(`
    SELECT COUNT(*) as total FROM leads
  `)

  const topEventResult = await pool.query(`
    SELECT
      events.title,
      COUNT(leads.id) as leads
    FROM events
    LEFT JOIN leads ON events.id = leads.event_id
    GROUP BY events.title
    ORDER BY leads DESC
    LIMIT 1
  `)

  const totalEvents = eventsResult.rows[0]?.total ?? 0
  const activeEvents = activeResult.rows[0]?.total ?? 0
  const totalLeads = leadsResult.rows[0]?.total ?? 0
  const topEvent = topEventResult.rows[0]

  return (
    <div className="space-y-10">

      <div>
        <p className="editorial-label mb-3">panel de gestión</p>
        <h1 className="editorial-h2">solaris nerja</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white border border-[var(--sn-border)] rounded-sm p-6">
          <p className="editorial-label mb-2">eventos totales</p>
          <p className="text-3xl font-semibold">{totalEvents}</p>
        </div>

        <div className="bg-white border border-[var(--sn-border)] rounded-sm p-6">
          <p className="editorial-label mb-2">eventos activos</p>
          <p className="text-3xl font-semibold">{activeEvents}</p>
        </div>

        <div className="bg-white border border-[var(--sn-border)] rounded-sm p-6">
          <p className="editorial-label mb-2">leads totales</p>
          <p className="text-3xl font-semibold">{totalLeads}</p>
        </div>

      </div>

      {topEvent && (
        <div className="bg-white border border-[var(--sn-border)] rounded-sm p-6">
          <p className="editorial-label mb-3">evento con más interés</p>

          <div className="flex items-center justify-between">
            <span className="tracking-wide font-medium">
              {topEvent.title}
            </span>

            <span className="text-sm text-[var(--sn-muted)]">
              {topEvent.leads} leads
            </span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        <a
          href="/dashboard/events"
          className="bg-white border border-[var(--sn-border)] rounded-sm p-8 hover:border-black transition"
        >
          <p className="editorial-label mb-2">gestionar</p>
          <p className="text-lg font-medium tracking-wide">
            eventos
          </p>
        </a>

        <a
          href="/dashboard/leads"
          className="bg-white border border-[var(--sn-border)] rounded-sm p-8 hover:border-black transition"
        >
          <p className="editorial-label mb-2">ver</p>
          <p className="text-lg font-medium tracking-wide">
            leads
          </p>
        </a>

      </div>

    </div>
  )
}
