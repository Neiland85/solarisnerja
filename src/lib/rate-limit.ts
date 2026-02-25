type Entry = {
  count: number
  timestamp: number
}

const WINDOW = 60 * 1000 // 1 min
const LIMIT = 20
const CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 min
const MAX_STORE_SIZE = 10_000

const store = new Map<string, Entry>()

// Periodic cleanup to prevent memory leak
if (typeof globalThis !== "undefined") {
  const interval = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now - entry.timestamp > WINDOW) {
        store.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)

  // Allow process to exit cleanly
  if (typeof interval === "object" && "unref" in interval) {
    interval.unref()
  }
}

export function rateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry) {
    // Evict oldest if store is too large (safety valve)
    if (store.size >= MAX_STORE_SIZE) {
      const firstKey = store.keys().next().value
      if (firstKey !== undefined) {
        store.delete(firstKey)
      }
    }

    store.set(ip, { count: 1, timestamp: now })
    return true
  }

  if (now - entry.timestamp > WINDOW) {
    store.set(ip, { count: 1, timestamp: now })
    return true
  }

  if (entry.count >= LIMIT) {
    return false
  }

  entry.count++
  return true
}

/** Exposed for testing */
export function _resetStore() {
  store.clear()
}
