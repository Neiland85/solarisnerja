/**
 * Sentry Error Tracking — Stub module
 *
 * Provides a safe interface for error capturing that works whether
 * @sentry/nextjs is installed or not.
 *
 * Before production deploy:
 *   pnpm add @sentry/nextjs
 *   Then replace this stub with the full Sentry initialization.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

/**
 * Initialize Sentry. No-op until @sentry/nextjs is installed.
 */
export function initSentry(): void {
  if (!process.env["SENTRY_DSN"]) return
  // Will be replaced with actual Sentry.init() after installing @sentry/nextjs
  console.info("[sentry] DSN configured but @sentry/nextjs not yet installed")
}

/**
 * Capture an error with optional context.
 * Falls back to console.error until Sentry is installed.
 */
export function captureError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  console.error("[error]", error, context ?? "")
}
