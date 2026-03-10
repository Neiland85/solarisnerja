import { NextResponse } from "next/server"
import { getPool } from "@/adapters/db/pool"

export async function GET(){

  const pool = getPool()

  const db = await pool.query("SELECT 1")

  return NextResponse.json({
    status: "ok",
    database: db.rowCount === 1 ? "connected" : "error",
    timestamp: new Date().toISOString()
  })
}
