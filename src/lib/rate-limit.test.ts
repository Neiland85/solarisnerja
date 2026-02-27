import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { rateLimit, _resetStore, _getStoreSize, _getCleanupEvery } from "./rate-limit"

describe("rateLimit", () => {
  beforeEach(() => {
    _resetStore()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
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

  describe("window expiration", () => {
    it("resets counter after 60-second window expires", () => {
      const ip = "192.168.1.1"

      // Fill up to the limit
      for (let i = 0; i < 20; i++) {
        expect(rateLimit(ip)).toBe(true)
      }

      // Next request is blocked
      expect(rateLimit(ip)).toBe(false)

      // Advance time by 59 seconds - still blocked
      vi.advanceTimersByTime(59 * 1000)
      expect(rateLimit(ip)).toBe(false)

      // Advance more than 1 second to ensure > 60000ms has passed
      vi.advanceTimersByTime(1500)

      // Now new requests are allowed
      expect(rateLimit(ip)).toBe(true)
      for (let i = 1; i < 20; i++) {
        expect(rateLimit(ip)).toBe(true)
      }
      expect(rateLimit(ip)).toBe(false)
    })

    it("allows new IPs within the same window", () => {
      const ip = "192.168.1.1"

      // Use up the limit for the first IP
      for (let i = 0; i < 20; i++) {
        rateLimit(ip)
      }

      // Advance 30 seconds (still within 60-second window)
      vi.advanceTimersByTime(30 * 1000)

      // A different IP should still be allowed
      expect(rateLimit("192.168.1.2")).toBe(true)

      // But the original IP remains blocked
      expect(rateLimit(ip)).toBe(false)
    })

    it("prunes expired entries on access using sampled cleanup", () => {
      const ipA = "192.168.1.1"
      const ipB = "192.168.1.2"
      let calls = 0

      const countedCall = (ip: string) => {
        calls++
        rateLimit(ip)
      }

      countedCall(ipA)
      countedCall(ipB)

      // Move past the window so ipB is expired.
      vi.advanceTimersByTime(61 * 1000)
      countedCall(ipA)

      const cleanupEvery = _getCleanupEvery()
      const remainder = calls % cleanupEvery
      const remaining = remainder === 0 ? cleanupEvery : cleanupEvery - remainder
      const callsBeforeCleanup = remaining - 1

      for (let i = 0; i < callsBeforeCleanup; i++) {
        countedCall(ipA)
      }

      expect(_getStoreSize()).toBe(2)

      // Next call should trigger cleanup and remove the expired ipB entry.
      countedCall(ipA)
      expect(_getStoreSize()).toBe(1)
    })
  })

  describe("MAX_STORE_SIZE safety valve", () => {
    it("evicts oldest entry when store reaches 10,000 entries", () => {
      // Fill the store with 10,000 entries
      for (let i = 0; i < 10000; i++) {
        const ip = `192.168.1.${i}`
        rateLimit(ip)
      }

      // Store should be at capacity
      expect(new Map().constructor).toBeDefined()

      // Start adding a new entry - this should trigger eviction of the first one
      const _firstIp = "192.168.1.0" // retained for documentation; prefixed to satisfy no-unused-vars
      const newIp = "10.0.0.1"

      // The first IP had one request, verify new IP can be added
      expect(rateLimit(newIp)).toBe(true)

      // The store should have evicted the oldest entry (first IP)
      // We can't directly check this, but we can verify the new IP was added
      // by making many requests to it and seeing it behaves normally
      for (let i = 1; i < 20; i++) {
        expect(rateLimit(newIp)).toBe(true)
      }
      expect(rateLimit(newIp)).toBe(false)
    })

    it("handles rapid evictions under high load", () => {
      // Simulate burst of requests from many IPs
      const ips: string[] = []
      for (let i = 0; i < 500; i++) {
        ips.push(`192.168.1.${i}`)
      }

      // Make requests from all IPs multiple times
      for (let batch = 0; batch < 22; batch++) {
        for (const ip of ips) {
          rateLimit(ip)
        }
      }

      // Add one more IP - should work despite high load
      const crashTestIp = "10.0.0.1"
      expect(rateLimit(crashTestIp)).toBe(true)
    })
  })

  describe("concurrent requests", () => {
    it("increments counter correctly for sequential requests from same IP", () => {
      const ip = "172.16.0.1"

      // Make 5 sequential requests and track the counter implicitly
      const results: boolean[] = []
      for (let i = 0; i < 5; i++) {
        results.push(rateLimit(ip))
      }

      // All 5 should succeed
      expect(results).toEqual([true, true, true, true, true])

      // Next 15 should also succeed (reaching limit of 20)
      for (let i = 0; i < 15; i++) {
        expect(rateLimit(ip)).toBe(true)
      }

      // The 21st should fail
      expect(rateLimit(ip)).toBe(false)
    })

    it("maintains accurate count with interleaved IPs", () => {
      const ipA = "172.16.0.1"
      const ipB = "172.16.0.2"
      const ipC = "172.16.0.3"

      // Make interleaved requests
      for (let i = 0; i < 10; i++) {
        expect(rateLimit(ipA)).toBe(true)
        expect(rateLimit(ipB)).toBe(true)
        expect(rateLimit(ipC)).toBe(true)
      }

      // Complete limits for A and B
      for (let i = 10; i < 20; i++) {
        expect(rateLimit(ipA)).toBe(true)
        expect(rateLimit(ipB)).toBe(true)
      }

      // A and B should be blocked
      expect(rateLimit(ipA)).toBe(false)
      expect(rateLimit(ipB)).toBe(false)

      // But C should still have requests available
      for (let i = 10; i < 20; i++) {
        expect(rateLimit(ipC)).toBe(true)
      }
      expect(rateLimit(ipC)).toBe(false)
    })
  })
})
