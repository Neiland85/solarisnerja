import { NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"

export async function GET() {
  const pool = getPool()

  const start = Date.now()

  try {
    await pool.query("SELECT 1")

    const latency = Date.now() - start

    return NextResponse.json({
      status: "healthy",
      dbLatencyMs: latency,
      timestamp: new Date().toISOString()
    })

  } catch (error) {

    return NextResponse.json({
      status: "degraded",
      dbLatencyMs: null,
      timestamp: new Date().toISOString()
    })
  }
}
