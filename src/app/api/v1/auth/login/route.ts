import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const adminPassword = process.env["ADMIN_PASSWORD"]

  if (!adminPassword || body.password !== adminPassword) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })

  res.cookies.set("admin_session", adminPassword, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  return res
}
