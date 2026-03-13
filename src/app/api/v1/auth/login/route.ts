import { NextRequest, NextResponse } from "next/server"
import { timingSafeEqual } from "node:crypto"
import { _getClientIp } from "@/lib/ip"
import { createSessionAsync } from "@/lib/auth/sessionStore"
import { audit } from "@/lib/observability/auditLog"

const LOGIN_WINDOW_MS = 60_000
const MAX_ATTEMPTS = 5
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  const ip = _getClientIp(req)
  const now = Date.now()

  const entry = loginAttempts.get(ip)
  if (entry && now < entry.resetAt && entry.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "too many attempts, try again later" },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const password = (body as Record<string, unknown>)?.["password"]
  if (typeof password !== "string" || password.length === 0 || password.length > 256) {
    return NextResponse.json({ error: "invalid credentials format" }, { status: 400 })
  }

  const adminPassword = process.env["ADMIN_PASSWORD"]

  const input = password
  const passwordMatch =
    adminPassword &&
    input.length === adminPassword.length &&
    timingSafeEqual(Buffer.from(input), Buffer.from(adminPassword))

  if (!passwordMatch) {
    const current = loginAttempts.get(ip)
    if (!current || now >= current.resetAt) {
      loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS })
    } else {
      current.count++
    }
    audit({ action: "admin.login_failed", ip, details: { reason: "bad_password" } })
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  loginAttempts.delete(ip)

  const session = await createSessionAsync()
  audit({ action: "admin.login", ip, actor: "admin" })
  const response = NextResponse.json({ success: true })

  response.cookies.set("admin_session", session.token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  return response
}
