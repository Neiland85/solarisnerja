import { Pool } from "pg"

let pool: Pool | undefined

export function getPool(){

  if (!pool){

    const connectionString = process.env["DATABASE_URL"]

    if (!connectionString){
      throw new Error("DATABASE_URL not configured")
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 5
    })

  }

  return pool
}
