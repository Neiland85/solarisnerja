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

/**
 * Generate a cryptographically secure nonce for CSP
 * Base64-encoded 16-byte random value
 */
function generateNonce(): string {
  const random = new Uint8Array(16)
  crypto.getRandomValues(random)
  return Buffer.from(random).toString("base64")
}

export function middleware(req: NextRequest) {
  const requestId = crypto.randomUUID()
  const nonce = generateNonce()
  const origin = req.headers.get("origin")

  // Handle CORS preflight
  if (req.method === "OPTIONS" && req.nextUrl.pathname.startsWith("/api/")) {
    if (!isAllowedOrigin(origin) || !origin) {
      return new NextResponse(null, { status: 403 })
    }

    const headers: Record<string, string> = {
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-request-id",
      "Access-Control-Max-Age": "86400",
      "x-request-id": requestId,
      "Access-Control-Allow-Origin": origin,
    }

    return new NextResponse(null, {
      status: 204,
      headers,
    })
  }

  const response = NextResponse.next()

  response.headers.set("x-request-id", requestId)

  // CORS headers for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    if (origin && isAllowedOrigin(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
    }
  }

  // Generate Content-Security-Policy with nonce
  // This removes 'unsafe-inline' and 'unsafe-eval' for improved security
  const cspValue = [
    "default-src 'self'",
    // Script-src: Removed 'unsafe-inline' and 'unsafe-eval'
    // Third-party scripts are loaded from their official domains
    // Nonce is added for any required inline scripts
    `script-src 'self' 'nonce-${nonce}' https://widget.ticketmaster.com https://www.googletagmanager.com https://connect.facebook.net`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://www.google-analytics.com https://www.facebook.com",
    "frame-src https://widget.ticketmaster.com",
    "object-src 'none'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join("; ")

  response.headers.set("Content-Security-Policy", cspValue)

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
