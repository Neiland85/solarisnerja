import { NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"
import { problem } from "@/lib/problem"

export async function GET() {
  const instance = "/api/readyz"

  try {
    const pool = getPool()
    await pool.query("SELECT 1")

    return NextResponse.json({
      status: "ready",
      db: "connected"
    })
  } catch {
    return problem({
      type: "https://www.solarisnerja.com/problems/dependency",
      title: "Service Unavailable",
      status: 503,
      detail: "Database not ready",
      instance
    })
  }
}
