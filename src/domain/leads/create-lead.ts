import { Lead } from "./types"

export function createLead(input: {
  email: string
  eventId: string
}): Lead {
  return {
    id: crypto.randomUUID(),
    email: input.email.toLowerCase(),
    eventId: input.eventId,
    createdAt: new Date()
  }
}
