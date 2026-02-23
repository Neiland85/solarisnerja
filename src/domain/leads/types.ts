export type LeadId = string

export interface Lead {
  id: LeadId
  email: string
  eventId: string
  createdAt: Date
}
