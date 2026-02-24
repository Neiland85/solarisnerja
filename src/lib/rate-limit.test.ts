import { describe, it, expect, beforeEach } from "vitest"
import { rateLimit, __resetRateLimitStore } from "./rate-limit"

describe("rateLimit", () => {

  beforeEach(() => {
    __resetRateLimitStore()
  })

  it("limits after threshold", () => {
    const ip = "1.2.3.4"

    for (let i = 0; i < 20; i++) {
      expect(rateLimit(ip)).toBe(true)
    }

    expect(rateLimit(ip)).toBe(false)
  })
})
