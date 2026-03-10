import { NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"

export async function GET() {

  const pool = getPool()

  try {

    const start = Date.now()

    await pool.query("SELECT 1")

    const latency = Date.now() - start

    return NextResponse.json({
      status: "ok",
      dbLatency: latency
    })

  } catch (_error) {

    return NextResponse.json({
      status: "error",
      dbLatency: null
    })

  }

}
