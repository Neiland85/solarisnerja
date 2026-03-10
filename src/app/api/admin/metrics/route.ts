import { NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"

export async function GET() {
  const pool = getPool()

  const leadsTotal = await pool.query(`
    SELECT COUNT(*)::int as total FROM leads
  `)

  const events = await pool.query(`
    SELECT
      events.id,
      events.title,
      events.capacity,
      COUNT(leads.id)::int as leads
    FROM events
    LEFT JOIN leads ON events.id = leads.event_id
    GROUP BY events.id
    ORDER BY leads DESC
  `)

  return NextResponse.json({
    leadsTotal: leadsTotal.rows[0]?.total ?? 0,
    events: events.rows
  })
}
