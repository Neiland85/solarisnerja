import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],
  environment: process.env["NODE_ENV"] ?? "development",

  // Performance: sample 10% on client (lower to reduce bandwidth)
  tracesSampleRate: process.env["NODE_ENV"] === "production" ? 0.1 : 1.0,

  // Replay: capture 0% of sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration(),
  ],

  // Only send errors in production
  beforeSend(event) {
    if (process.env["NODE_ENV"] !== "production") return null
    return event
  },
})
