import { saveQueueSnapshot, loadQueueSnapshot, clearSnapshot } from "./queuePersistence"

type LeadPayload = {
  email: string
  eventId: string
  ipAddress: string
}

let queue: LeadPayload[] = loadQueueSnapshot()

const MAX_QUEUE = 5000

export function enqueueLead(lead: LeadPayload) {

  if (queue.length >= MAX_QUEUE) {
    return false
  }

  queue.push(lead)

  saveQueueSnapshot(queue)

  return true
}

export function dequeueLead(): LeadPayload | null {

  if (queue.length === 0) {
    clearSnapshot()
    return null
  }

  const lead = queue.shift() ?? null

  saveQueueSnapshot(queue)

  return lead
}

export function queueSize() {
  return queue.length
}
