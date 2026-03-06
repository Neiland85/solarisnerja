import { Lead } from "./types"

export function createLead(input: {
  email: string
  eventId: string
  ipAddress: string
  consentGiven: boolean
}): Lead {
  return {
    id: crypto.randomUUID(),
    email: input.email.toLowerCase(),
    eventId: input.eventId,
    ipAddress: input.ipAddress,
    consentGiven: input.consentGiven,
    createdAt: new Date()
  }
}
