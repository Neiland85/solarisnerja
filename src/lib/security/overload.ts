type Bucket = {
  count: number
  reset: number
}

const buckets = new Map<string, Bucket>()

const WINDOW = 60 * 1000
const LIMIT = 120

export function overloadGuard(key: string) {

  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket) {
    buckets.set(key, { count: 1, reset: now + WINDOW })
    return true
  }

  if (now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + WINDOW })
    return true
  }

  if (bucket.count >= LIMIT) {
    return false
  }

  bucket.count++
  return true
}
