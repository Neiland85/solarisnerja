declare global {
  interface Window {
    gtag?: (command: string, name: string, payload?: Record<string, unknown>) => void
    fbq?: (command: string, name: string, payload?: Record<string, unknown>) => void
  }
}

export function trackEvent(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return

  // GA4
  if ((window as any).gtag) {
    ;(window as any).gtag("event", name, payload)
  }

  // Meta Pixel
  if ((window as any).fbq) {
    ;(window as any).fbq("trackCustom", name, payload)
  }

  console.log("Tracking:", name, payload)
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
