import crypto from "crypto"

export type Lead = {
  id: string
  email: string
  eventId: string
  ipAddress: string
  consentGiven: boolean
  createdAt: Date
}

type CreateLeadInput = {
  email: string
  eventId: string
  ipAddress: string
  consentGiven: boolean
}

export function createLead(input: CreateLeadInput): Lead {

  const email = input.email.trim().toLowerCase()

  return {
    id: crypto.randomUUID(),
    email,
    eventId: input.eventId,
    ipAddress: input.ipAddress,
    consentGiven: input.consentGiven,
    createdAt: new Date()
  }

}
