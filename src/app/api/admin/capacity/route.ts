import { NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"

export async function GET() {

  const pool = getPool()

  const result = await pool.query(`
    SELECT
      events.id,
      events.title,
      events.capacity,
      COUNT(leads.id)::int AS leads
    FROM events
    LEFT JOIN leads
      ON leads.event_id = events.id
    GROUP BY events.id
    ORDER BY leads DESC
  `)

  return NextResponse.json(result.rows)
}
