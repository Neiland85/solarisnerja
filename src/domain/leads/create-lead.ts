import { randomUUID } from "crypto"

export type Lead = {
  id: string
  email: string
  eventId: string
  ipAddress: string
  consentGiven: boolean
  createdAt: string
}

export function createLead(input:{
  email:string
  eventId:string
  ipAddress:string
  consentGiven:boolean
}):Lead{

  return {
    id: randomUUID(),
    email: input.email,
    eventId: input.eventId,
    ipAddress: input.ipAddress,
    consentGiven: input.consentGiven,
    createdAt: new Date().toISOString()
  }

}
