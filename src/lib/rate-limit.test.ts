import { describe, it, expect, beforeEach } from "vitest"
import { rateLimit, _resetStore } from "./rate-limit"

describe("rateLimit", () => {
  beforeEach(() => {
    _resetStore()
  })

  it("allows requests until limit is reached", () => {
    const ip = "1.2.3.4"
    for (let i = 0; i < 20; i++) {
      expect(rateLimit(ip)).toBe(true)
    }
    expect(rateLimit(ip)).toBe(false)
  })

  it("tracks IPs independently", () => {
    const ipA = "10.0.0.1"
    const ipB = "10.0.0.2"

    for (let i = 0; i < 20; i++) {
      rateLimit(ipA)
    }

    expect(rateLimit(ipA)).toBe(false)
    expect(rateLimit(ipB)).toBe(true)
  })
})
