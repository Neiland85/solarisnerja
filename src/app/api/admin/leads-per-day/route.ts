import { NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"

export async function GET() {
  const pool = getPool()

  const result = await pool.query(`
    SELECT
      DATE(created_at) as day,
      COUNT(*)::int as leads
    FROM leads
    WHERE created_at > NOW() - INTERVAL '7 days'
    GROUP BY day
    ORDER BY day ASC
  `)

  return NextResponse.json(result.rows)
}
