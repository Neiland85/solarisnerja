/**
 * Sentry Error Tracking — Shared utilities
 *
 * Initialization happens in sentry.server.config.ts / sentry.client.config.ts / sentry.edge.config.ts
 * This module provides convenience wrappers for use in application code.
 */

import * as Sentry from "@sentry/nextjs"

/**
 * Capture an error with optional context.
 */
export function captureError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  Sentry.captureException(error, { extra: context })
}

/**
 * Capture a message with optional level and context.
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: Record<string, unknown>
): void {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  })
}
