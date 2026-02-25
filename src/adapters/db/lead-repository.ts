import { getPool } from "./pool"
import { Lead } from "@/domain/leads/types"

export async function saveLead(lead: Lead) {
  const pool = getPool()

  await pool.query(
    `
    INSERT INTO leads (id, email, event_id, created_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email, event_id) DO NOTHING
    `,
    [lead.id, lead.email, lead.eventId, lead.createdAt]
  )
}
