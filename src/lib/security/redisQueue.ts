import Redis from "ioredis"
import type { Lead } from "@/domain/leads/create-lead"

const QUEUE_KEY = "solaris:lead_queue"

let redis: Redis | null = null

function getRedis(): Redis {
  if (!redis) {
    const url = process.env["REDIS_URL"]
    if (!url) {
      throw new Error("REDIS_URL not configured")
    }
    redis = new Redis(url)
  }
  return redis
}

export async function enqueueLeadRedis(lead: Lead) {
  await getRedis().lpush(QUEUE_KEY, JSON.stringify(lead))
}

export async function dequeueLeadRedis(): Promise<Lead | null> {
  const item = await getRedis().rpop(QUEUE_KEY)
  if (!item) {
    return null
  }
  return JSON.parse(item) as Lead
}

export async function queueLength() {
  return getRedis().llen(QUEUE_KEY)
}
