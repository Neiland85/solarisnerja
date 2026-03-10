import { NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"

const DEFAULT_CONVERSION = 0.22

export async function GET() {

  const pool = getPool()

  const events = await pool.query(`
    SELECT 
      events.id,
      events.title,
      events.capacity,
      COUNT(leads.id)::int as leads
    FROM events
    LEFT JOIN leads ON leads.event_id = events.id
    GROUP BY events.id
  `)

  const forecast = events.rows.map(e => {

    const predicted = Math.round(e.leads * DEFAULT_CONVERSION)
    const occupancy = e.capacity
      ? (predicted / e.capacity) * 100
      : 0

    return {
      id: e.id,
      title: e.title,
      leads: e.leads,
      predictedAttendance: predicted,
      capacity: e.capacity,
      occupancy: Number(occupancy.toFixed(1))
    }

  })

  return NextResponse.json(forecast)

}
