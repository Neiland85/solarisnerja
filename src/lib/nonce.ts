/**
 * CSP Nonce Management
 *
 * Generates and manages Content Security Policy nonces for inline scripts and styles.
 * This prevents the need for 'unsafe-inline' in CSP while allowing dynamic inline content.
 *
 * The nonce is generated per request in the middleware and injected into response headers.
 */

import { headers } from "next/headers"
import { randomFillSync } from "crypto"

/**
 * Generates a cryptographically secure nonce
 * @returns A base64-encoded random string suitable for CSP nonces
 */
export function generateNonce(): string {
  const random = new Uint8Array(16)
  if (typeof window === "undefined") {
    // Server-side: use Node.js crypto
    randomFillSync(random)
  } else {
    // Client-side: use Web Crypto API
    crypto.getRandomValues(random)
  }
  return Buffer.from(random).toString("base64")
}

/**
 * Retrieves the CSP nonce from the response headers
 * Used in Server Components to inject the nonce into script tags
 *
 * @returns The nonce string, or undefined if not present
 */
export async function getNonce(): Promise<string | undefined> {
  try {
    const headersList = await headers()
    return headersList.get("x-nonce")?.toString()
  } catch {
    // In case headers is not available (e.g., during build time)
    return undefined
  }
}
