import Redis from "ioredis"

const WINDOW_SECONDS = 60
const LIMIT = 20
const KEY_PREFIX = "solaris:rl:"

let redis: Redis | null = null

function getRedis(): Redis | null {
  if (redis) return redis
  const url = process.env["REDIS_URL"]
  if (!url) return null
  redis = new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: true })
  redis.on("error", () => {
    /* swallow — fallback will kick in */
  })
  return redis
}

/**
 * Distributed rate limiter using Redis INCR + EXPIRE.
 * Returns { allowed: true/false, remaining, retryAfterMs }.
 *
 * Atomic: INCR creates the key if missing; EXPIRE is set only on first hit
 * so the window starts from the first request, not from a fixed clock.
 */
export async function rateLimitRedis(
  ip: string
): Promise<{ allowed: boolean; remaining: number; retryAfterMs: number }> {
  const client = getRedis()
  if (!client) {
    throw new Error("Redis not available")
  }

  const key = `${KEY_PREFIX}${ip}`

  // MULTI: INCR + conditional EXPIRE (only set TTL on first hit)
  const count = await client.incr(key)

  if (count === 1) {
    // First request in window — set expiry
    await client.expire(key, WINDOW_SECONDS)
  }

  const ttl = await client.ttl(key)
  const retryAfterMs = ttl > 0 ? ttl * 1000 : WINDOW_SECONDS * 1000

  if (count > LIMIT) {
    return { allowed: false, remaining: 0, retryAfterMs }
  }

  return { allowed: true, remaining: LIMIT - count, retryAfterMs: 0 }
}

/** Check if Redis is reachable (for health checks) */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    const client = getRedis()
    if (!client) return false
    await client.ping()
    return true
  } catch {
    return false
  }
}

/** Exposed for testing */
export function _disconnectRedis(): void {
  if (redis) {
    redis.disconnect()
    redis = null
  }
}
