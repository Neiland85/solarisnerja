import Redis from "ioredis"
import type { Lead } from "@/domain/leads/create-lead"

const redis = new Redis(process.env.REDIS_URL as string)

const QUEUE_KEY = "solaris:lead_queue"

export async function enqueueLeadRedis(lead: Lead) {

  await redis.lpush(
    QUEUE_KEY,
    JSON.stringify(lead)
  )

}

export async function dequeueLeadRedis(): Promise<Lead | null> {

  const item = await redis.rpop(QUEUE_KEY)

  if (!item) return null

  return JSON.parse(item) as Lead

}

export async function queueLength(): Promise<number> {

  return redis.llen(QUEUE_KEY)

}
