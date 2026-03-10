import { getPool } from "@/adapters/db/pool"
import { dequeueLead } from "./burstQueue"

let running = false

export async function processLeadQueue() {

  if (running) return

  running = true

  try {

    const lead = dequeueLead()

    if (!lead) {
      running = false
      return
    }

    const pool = getPool()

    await pool.query(
      `
      INSERT INTO leads (id, email, event_id, ip_address, consent_given, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, true, now())
      ON CONFLICT (email, event_id) DO NOTHING
      `,
      [lead.email, lead.eventId, lead.ipAddress]
    )

  } catch (err) {

    console.error("lead worker error", err)

  } finally {

    running = false

  }
}
