const LIMIT = 20
const WINDOW_MS = 60_000

type Entry = {
  count: number
  expires: number
}

const store = new Map<string, Entry>()

export function rateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || entry.expires < now) {
    store.set(ip, { count: 1, expires: now + WINDOW_MS })
    return true
  }

  if (entry.count >= LIMIT) {
    return false
  }

  entry.count++
  return true
}

// 🔹 Solo para tests
export function __resetRateLimitStore() {
  store.clear()
}
