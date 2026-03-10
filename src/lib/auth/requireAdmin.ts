import { NextRequest } from "next/server"

export function requireAdmin(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value
  const adminPassword = process.env["ADMIN_PASSWORD"]

  if (!session || !adminPassword || session !== adminPassword) {
    throw new Error("unauthorized")
  }
}
