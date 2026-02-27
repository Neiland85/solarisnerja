import { Pool } from "pg"

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env["DATABASE_URL"]

    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined")
    }

    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000
    })
  }

  return pool
}
