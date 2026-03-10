import { NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"

export async function GET() {
  const pool = getPool()

  const lastHour = await pool.query(`
    SELECT COUNT(*)::int as total
    FROM leads
    WHERE created_at > NOW() - INTERVAL '1 hour'
  `)

  const lastDay = await pool.query(`
    SELECT COUNT(*)::int as total
    FROM leads
    WHERE created_at > NOW() - INTERVAL '24 hours'
  `)

  return NextResponse.json({
    lastHour: lastHour.rows[0]?.total ?? 0,
    last24h: lastDay.rows[0]?.total ?? 0
  })
}
