import { NextRequest } from "next/server"
import { validateSession } from "@/lib/auth/sessionStore"

export function requireAdmin(req: NextRequest): boolean {
  const token = req.cookies.get("admin_session")?.value
  return validateSession(token)
}
