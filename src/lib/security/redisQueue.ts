import Redis from "ioredis"
import type { Lead } from "@/domain/leads/create-lead"

if(!process.env.REDIS_URL){
  throw new Error("REDIS_URL not configured")
}

const redis = new Redis(process.env.REDIS_URL)

const QUEUE_KEY = "solaris:lead_queue"

export async function enqueueLeadRedis(lead:Lead){
  await redis.lpush(QUEUE_KEY, JSON.stringify(lead))
}

export async function dequeueLeadRedis():Promise<Lead | null>{

  const item = await redis.rpop(QUEUE_KEY)

  if(!item){
    return null
  }

  return JSON.parse(item) as Lead

}

export async function queueLength(){
  return redis.llen(QUEUE_KEY)
}
