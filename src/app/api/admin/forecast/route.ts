import { NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"

export async function GET() {

  const pool = getPool()

  const result = await pool.query(`
    SELECT
      events.id,
      events.title,
      events.capacity,
      COUNT(leads.id)::int as leads,
      MIN(leads.created_at) as first_lead
    FROM events
    LEFT JOIN leads ON leads.event_id = events.id
    GROUP BY events.id
    ORDER BY leads DESC
  `)

  const now = Date.now()

  const forecast = result.rows.map((e) => {

    const leads = Number(e.leads ?? 0)
    const capacity = Number(e.capacity ?? 5000)

    if (!e.first_lead || leads === 0) {
      return {
        ...e,
        predicted: 0,
        fillPercent: 0
      }
    }

    const firstLead = new Date(e.first_lead).getTime()

    const daysRunning =
      Math.max((now - firstLead) / (1000 * 60 * 60 * 24), 1)

    const leadsPerDay = leads / daysRunning

    const festivalDays = 30

    const predicted = Math.round(leadsPerDay * festivalDays)

    const fillPercent = Math.min(
      Math.round((predicted / capacity) * 100),
      100
    )

    return {
      ...e,
      predicted,
      fillPercent
    }
  })

  return NextResponse.json(forecast)
}
