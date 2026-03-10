type LeadPayload = {
  email: string
  eventId: string
  ipAddress: string
}

const queue: LeadPayload[] = []

const MAX_QUEUE = 5000

export function enqueueLead(lead: LeadPayload) {

  if (queue.length >= MAX_QUEUE) {
    return false
  }

  queue.push(lead)
  return true
}

export function dequeueLead(): LeadPayload | null {

  if (queue.length === 0) {
    return null
  }

  return queue.shift() ?? null
}

export function queueSize() {
  return queue.length
}
