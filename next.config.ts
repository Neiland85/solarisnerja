import type { NextConfig } from "next"

// Static security headers (CSP is handled by middleware for per-request nonce)
const getSecurityHeaders = () => {
  return [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    },
  ]
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: [],
  },
  async headers() {
    return [
      // Security headers for everything
      {
        source: "/(.*)",
        headers: getSecurityHeaders(),
      },

      // Cache HTML pages at the edge with short TTL
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
          },
        ],
      },
      {
        source: "/eventos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
          },
        ],
      },

      // Never cache APIs
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },

      // Cache Next.js static assets aggressively
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ]
  },
}

export default nextConfig
