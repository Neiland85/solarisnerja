import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"
import { corsGuard, corsHeaders } from "@/lib/security/cors"

export async function GET(req: NextRequest) {

  const blocked = corsGuard(req)
  if (blocked) return blocked

  const origin = req.headers.get("origin") || ""

  try {

    const pool = getPool()

    const start = Date.now()

    const db = await pool.query("SELECT 1")

    const latency = Date.now() - start

    return NextResponse.json(
      {
        status: "ok",
        database: db.rowCount === 1 ? "connected" : "error",
        dbLatency: latency,
        timestamp: new Date().toISOString()
      },
      {
        headers: corsHeaders(origin)
      }
    )

  } catch {

    return NextResponse.json(
      {
        status: "error",
        database: "unreachable",
        timestamp: new Date().toISOString()
      },
      {
        status: 500,
        headers: corsHeaders(origin)
      }
    )

  }

}
