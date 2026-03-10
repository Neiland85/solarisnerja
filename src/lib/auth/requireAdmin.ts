import { NextRequest } from "next/server"

export function requireAdmin(req: NextRequest) {

  const cookie = req.cookies.get("admin_session")?.value

  if (!cookie) {
    return false
  }

  const adminPassword = process.env["ADMIN_PASSWORD"]

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD not configured")
    return false
  }

  if (cookie !== adminPassword) {
    return false
  }

  return true
}
