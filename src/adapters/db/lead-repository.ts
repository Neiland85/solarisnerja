import { getPool } from "./pool"

type LeadInput = {
  id: string
  email: string
  eventId: string
  ipAddress: string
  consentGiven: boolean
  createdAt: Date
}

export async function saveLead(lead: LeadInput){

  const pool = getPool()

  await pool.query(
    `INSERT INTO leads (id,email,event_id,ip_address,consent_given,created_at)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (email,event_id) DO NOTHING`,
    [
      lead.id,
      lead.email,
      lead.eventId,
      lead.ipAddress,
      lead.consentGiven,
      lead.createdAt
    ]
  )

}

export async function findLeads(limit=100){

  const pool = getPool()

  const result = await pool.query(
    `SELECT id,email,event_id,ip_address,created_at
     FROM leads
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  )

  return result.rows
}
