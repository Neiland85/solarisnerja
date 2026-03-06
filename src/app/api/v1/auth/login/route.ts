import { NextRequest, NextResponse } from "next/server"
import { log } from "@/lib/logger"
import { problem } from "@/lib/problem"

export async function POST(req: NextRequest) {
  const instance = "/api/v1/auth/login"
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()

  try {
    const body = (await req.json()) as { password?: string }

    const adminPassword = process.env["ADMIN_PASSWORD"]
    if (!adminPassword) {
      log("error", "admin_password_not_configured", { requestId })
      return problem({
        type: "https://www.solarisnerja.com/problems/internal",
        title: "Internal Server Error",
        status: 500,
        detail: "Auth not configured",
        instance,
      })
    }

    if (!body.password || body.password !== adminPassword) {
      log("warn", "login_failed", { requestId })
      return problem({
        type: "https://www.solarisnerja.com/problems/unauthorized",
        title: "Unauthorized",
        status: 401,
        detail: "Invalid password",
        instance,
      })
    }

    log("info", "login_success", { requestId })

    const response = NextResponse.json({ success: true })
    response.cookies.set("admin", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    })

    return response
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    log("error", "login_error", { requestId, error: errMsg })

    return problem({
      type: "https://www.solarisnerja.com/problems/internal",
      title: "Internal Server Error",
      status: 500,
      detail: "Unexpected error",
      instance,
    })
  }
}
