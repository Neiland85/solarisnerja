import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env["SENTRY_DSN"],
  environment: process.env["NODE_ENV"] ?? "development",

  // Performance: sample 20% of transactions in production
  tracesSampleRate: process.env["NODE_ENV"] === "production" ? 0.2 : 1.0,

  // Only send errors in production
  beforeSend(event) {
    if (process.env["NODE_ENV"] !== "production") return null
    return event
  },
})
