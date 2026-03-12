import { randomUUID } from "node:crypto"
import type { Role } from "./rbac"
import { createSignedToken } from "./signedSession"

export interface Session {
  token: string
  role: Role
  userId?: string
  createdAt: number
  expiresAt: number
}

const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours
const MAX_SESSIONS = 100

const sessions = new Map<string, Session>()

/** Set of revoked signed tokens (for logout invalidation) */
const revokedTokens = new Set<string>()

function purgeExpired(): void {
  const now = Date.now()
  for (const [token, session] of sessions) {
    if (now >= session.expiresAt) {
      sessions.delete(token)
    }
  }
}

/**
 * Crea sesión. Si SESSION_SECRET está disponible, genera token firmado
 * verificable en edge. Si no, usa UUID (fallback dev).
 */
export async function createSessionAsync(
  opts: { role?: Role; userId?: string } = {}
): Promise<Session> {
  purgeExpired()

  if (sessions.size >= MAX_SESSIONS) {
    const oldest = [...sessions.entries()].sort(
      (a, b) => a[1].createdAt - b[1].createdAt
    )[0]
    if (oldest) sessions.delete(oldest[0])
  }

  const now = Date.now()
  const role = opts.role ?? "admin"

  let token: string
  if (process.env["SESSION_SECRET"]) {
    token = await createSignedToken({ role, userId: opts.userId })
  } else {
    token = randomUUID()
  }

  const session: Session = {
    token,
    role,
    userId: opts.userId,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  }

  sessions.set(session.token, session)
  return session
}

/**
 * Sync version — always UUID. Kept for backward compatibility in tests.
 */
export function createSession(
  opts: { role?: Role; userId?: string } = {}
): Session {
  purgeExpired()

  if (sessions.size >= MAX_SESSIONS) {
    const oldest = [...sessions.entries()].sort(
      (a, b) => a[1].createdAt - b[1].createdAt
    )[0]
    if (oldest) sessions.delete(oldest[0])
  }

  const now = Date.now()
  const session: Session = {
    token: randomUUID(),
    role: opts.role ?? "admin",
    userId: opts.userId,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  }

  sessions.set(session.token, session)
  return session
}

export function validateSession(token: string | undefined): boolean {
  if (!token) return false
  if (revokedTokens.has(token)) return false

  purgeExpired()

  const session = sessions.get(token)
  if (!session) return false

  if (Date.now() >= session.expiresAt) {
    sessions.delete(token)
    return false
  }

  return true
}

export function getSessionRole(token: string | undefined): Role | null {
  if (!token) return null
  if (revokedTokens.has(token)) return null
  const session = sessions.get(token)
  if (!session || Date.now() >= session.expiresAt) return null
  return session.role
}

export function destroySession(token: string | undefined): void {
  if (!token) return
  sessions.delete(token)
  // Also revoke signed tokens so proxy rejects them
  revokedTokens.add(token)
}

export function isRevoked(token: string): boolean {
  return revokedTokens.has(token)
}

/** Visible for testing only */
export function _clearAllSessions(): void {
  sessions.clear()
  revokedTokens.clear()
}
