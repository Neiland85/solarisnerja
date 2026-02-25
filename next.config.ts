import type { NextConfig } from "next"

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.ticketmaster.com https://www.googletagmanager.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://www.google-analytics.com https://www.facebook.com",
      "frame-src https://widget.ticketmaster.com",
      "object-src 'none'",
      "base-uri 'self'"
    ].join("; ")
  }
]

// Cache policy (Edge-first)
// - HTML pages: cache at CDN with SWR
// - API: no-store
// - Next static assets: long cache immutable
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      // Security headers for everything
      {
        source: "/(.*)",
        headers: securityHeaders
      },

      // Cache HTML pages (home + eventos) at the edge
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" }
        ]
      },
      {
        source: "/eventos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" }
        ]
      },

      // Never cache APIs
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" }
        ]
      },

      // Cache Next.js static assets aggressively
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      }
    ]
  }
}

export default nextConfig
