import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["react"],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
}

// Only wrap with Sentry if DSN is configured
const hasSentry = !!(
  process.env["SENTRY_DSN"] || process.env["NEXT_PUBLIC_SENTRY_DSN"]
)

export default hasSentry
  ? withSentryConfig(nextConfig, {
      // Upload source maps for better stack traces
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },
      // Suppress noisy logs during build
      silent: !process.env["CI"],
      // Tunnel Sentry events through the app to avoid ad-blockers
      tunnelRoute: "/monitoring",
    })
  : nextConfig
