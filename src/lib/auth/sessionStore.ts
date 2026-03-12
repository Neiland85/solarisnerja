import { randomUUID } from "node:crypto"
import type { Role } from "./rbac"

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

function purgeExpired(): void {
  const now = Date.now()
  for (const [token, session] of sessions) {
    if (now >= session.expiresAt) {
      sessions.delete(token)
    }
  }
}

export function createSession(
  opts: { role?: Role; userId?: string } = {}
): Session {
  purgeExpired()

  // Evict oldest if at capacity
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
  const session = sessions.get(token)
  if (!session || Date.now() >= session.expiresAt) return null
  return session.role
}

export function destroySession(token: string | undefined): void {
  if (token) sessions.delete(token)
}

/** Visible for testing only */
export function _clearAllSessions(): void {
  sessions.clear()
}
