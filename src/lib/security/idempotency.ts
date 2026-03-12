/**
 * Idempotency-Key guard — previene procesamiento duplicado de peticiones.
 *
 * Almacena claves en memoria con TTL. En producción con REDIS_URL,
 * debería migrarse a Redis SETNX para soporte multi-instancia.
 *
 * Uso: const dup = checkIdempotencyKey(key) → { isDuplicate, key }
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const TTL_MS = 5 * 60 * 1000 // 5 min
const MAX_KEYS = 10_000

const seen = new Map<string, number>()

function cleanup() {
  const now = Date.now()
  for (const [key, ts] of seen) {
    if (now - ts > TTL_MS) seen.delete(key)
  }
}

export function isValidIdempotencyKey(key: string): boolean {
  return UUID_RE.test(key)
}

/**
 * Retorna true si la key ya fue procesada (duplicado).
 * Si es nueva, la registra y retorna false.
 */
export function checkIdempotencyKey(key: string): boolean {
  if (seen.size > MAX_KEYS) cleanup()
  if (seen.has(key)) return true
  seen.set(key, Date.now())
  return false
}

/** Para tests */
export function _resetIdempotencyStore(): void {
  seen.clear()
}
