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
}
