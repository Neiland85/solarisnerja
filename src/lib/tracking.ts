declare global {
  interface Window {
    gtag?: (command: string, name: string, payload?: Record<string, unknown>) => void
    fbq?: (command: string, name: string, payload?: Record<string, unknown>) => void
  }
}

export function trackEvent(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return

  // GA4
  if (window.gtag) {
    window.gtag("event", name, payload)
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq("trackCustom", name, payload)
  }

  if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
    console.log("Tracking:", name, payload)
  }
}
