import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ALLOWED_ORIGINS = new Set([
  "https://www.solarisnerja.com",
  "https://solarisnerja.com",
])

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false
  if (process.env.NODE_ENV === "development") return true
  return ALLOWED_ORIGINS.has(origin)
}

function isAdminAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get("admin_session")?.value
  if (!token) return false
  // Validate token format (UUID v4) — actual session lookup happens in route handlers
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)
}

export function proxy(req: NextRequest) {
  const requestId = crypto.randomUUID()
  const origin = req.headers.get("origin")
  const { pathname } = req.nextUrl

  // --- Dashboard pages: redirect to login if not authenticated ---
  if (pathname.startsWith("/dashboard")) {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // --- Admin API: return 403 if not authenticated ---
  if (pathname.startsWith("/api/admin/")) {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 })
    }
  }

  // --- CORS preflight ---
  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
    if (!isAllowedOrigin(origin) || !origin) {
      return new NextResponse(null, { status: 403 })
    }

    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PATCH, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, x-request-id",
        "Access-Control-Max-Age": "86400",
        "Access-Control-Allow-Origin": origin,
        "x-request-id": requestId,
      },
    })
  }

  // --- Default: pass through with request ID and CORS header ---
  const response = NextResponse.next()
  response.headers.set("x-request-id", requestId)

  if (pathname.startsWith("/api/") && origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
