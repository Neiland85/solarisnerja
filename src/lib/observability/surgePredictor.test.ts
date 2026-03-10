/**
 * Tests para M3: Traffic Surge Predictor
 */

import { describe, it, expect, beforeEach } from "vitest"
import {
  recordLead,
  getSurgeStatus,
  resetSurgePredictor,
  _injectBucket,
} from "./surgePredictor"

describe("surgePredictor", () => {
  beforeEach(() => {
    resetSurgePredictor()
  })

  describe("recordLead()", () => {
    it("increments current bucket count", () => {
      recordLead()
      recordLead()
      recordLead()

      const status = getSurgeStatus()
      expect(status.currentRate).toBe(3)
    })

    it("starts with zero state", () => {
      const status = getSurgeStatus()
      expect(status.currentRate).toBe(0)
      expect(status.level).toBe("NORMAL")
    })
  })

  describe("getSurgeStatus()", () => {
    it("returns NORMAL for low traffic", () => {
      for (let i = 0; i < 5; i++) recordLead()

      const status = getSurgeStatus()
      expect(status.level).toBe("NORMAL")
      expect(status.currentRate).toBe(5)
    })

    it("returns ELEVATED for moderate traffic (20-49/min)", () => {
      _injectBucket(0, 25)

      const status = getSurgeStatus()
      expect(status.level).toBe("ELEVATED")
      expect(status.currentRate).toBe(25)
    })

    it("returns HIGH for heavy traffic (50-99/min)", () => {
      _injectBucket(0, 75)

      const status = getSurgeStatus()
      expect(status.level).toBe("HIGH")
      expect(status.currentRate).toBe(75)
    })

    it("returns SURGE for extreme traffic (100+/min)", () => {
      _injectBucket(0, 150)

      const status = getSurgeStatus()
      expect(status.level).toBe("SURGE")
      expect(status.currentRate).toBe(150)
    })

    it("calculates peak rate across window", () => {
      _injectBucket(0, 10)
      _injectBucket(1, 50)
      _injectBucket(2, 30)

      const status = getSurgeStatus()
      expect(status.peakRate).toBe(50)
    })

    it("calculates average rate from active buckets", () => {
      _injectBucket(0, 10)
      _injectBucket(1, 20)
      _injectBucket(2, 30)

      const status = getSurgeStatus()
      expect(status.avgRate).toBe(20)
    })

    it("includes collectedAt timestamp", () => {
      const status = getSurgeStatus()
      expect(status.collectedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })

    it("includes bucket snapshots in reverse order (newest first)", () => {
      _injectBucket(0, 10)
      _injectBucket(1, 20)
      _injectBucket(2, 30)

      const status = getSurgeStatus()
      expect(status.buckets[0]!.minuteAgo).toBe(0)
      expect(status.buckets[0]!.count).toBe(10)
      expect(status.buckets[1]!.minuteAgo).toBe(1)
      expect(status.buckets[1]!.count).toBe(20)
    })
  })

  describe("gradient detection", () => {
    it("detects rising gradient", () => {
      // Crecimiento: 10 → 20 → 40
      _injectBucket(2, 10)
      _injectBucket(1, 20)
      _injectBucket(0, 40)

      const status = getSurgeStatus()
      expect(status.gradient).toBeGreaterThan(0)
      expect(status.gradientTrend).toBe("rising")
    })

    it("detects falling gradient", () => {
      // Decrecimiento: 40 → 20 → 10
      _injectBucket(2, 40)
      _injectBucket(1, 20)
      _injectBucket(0, 10)

      const status = getSurgeStatus()
      expect(status.gradient).toBeLessThan(0)
      expect(status.gradientTrend).toBe("falling")
    })

    it("detects stable gradient", () => {
      // Estable: 20 → 21 → 20
      _injectBucket(2, 20)
      _injectBucket(1, 21)
      _injectBucket(0, 20)

      const status = getSurgeStatus()
      expect(status.gradientTrend).toBe("stable")
    })

    it("handles zero to positive transition", () => {
      _injectBucket(2, 0)
      _injectBucket(1, 0)
      _injectBucket(0, 10)

      const status = getSurgeStatus()
      // Gradient de 0→10 = 100% (positive)
      expect(status.gradient).toBeGreaterThan(0)
    })
  })

  describe("surge warning", () => {
    it("triggers warning on sustained >50% growth", () => {
      // 10 → 20 → 40 (100% growth each step)
      _injectBucket(2, 10)
      _injectBucket(1, 20)
      _injectBucket(0, 40)

      const status = getSurgeStatus()
      expect(status.surgeWarning).toBe(true)
    })

    it("does NOT trigger warning on moderate growth", () => {
      // 10 → 12 → 14 (20% then ~17%)
      _injectBucket(2, 10)
      _injectBucket(1, 12)
      _injectBucket(0, 14)

      const status = getSurgeStatus()
      expect(status.surgeWarning).toBe(false)
    })

    it("does NOT trigger warning on decline", () => {
      _injectBucket(2, 40)
      _injectBucket(1, 20)
      _injectBucket(0, 10)

      const status = getSurgeStatus()
      expect(status.surgeWarning).toBe(false)
    })

    it("does NOT trigger on all-zero buckets", () => {
      _injectBucket(2, 0)
      _injectBucket(1, 0)
      _injectBucket(0, 0)

      const status = getSurgeStatus()
      expect(status.surgeWarning).toBe(false)
    })
  })

  describe("prediction15m", () => {
    it("predicts higher rate when gradient is positive", () => {
      _injectBucket(2, 10)
      _injectBucket(1, 20)
      _injectBucket(0, 40)

      const status = getSurgeStatus()
      expect(status.prediction15m).toBeGreaterThan(40)
    })

    it("returns current rate when gradient is zero or negative", () => {
      _injectBucket(2, 40)
      _injectBucket(1, 20)
      _injectBucket(0, 10)

      const status = getSurgeStatus()
      expect(status.prediction15m).toBeLessThanOrEqual(10)
    })

    it("caps prediction at 10000", () => {
      // Extreme growth: 1 → 100 → 10000
      _injectBucket(2, 1)
      _injectBucket(1, 100)
      _injectBucket(0, 10000)

      const status = getSurgeStatus()
      expect(status.prediction15m).toBeLessThanOrEqual(10000)
    })
  })

  describe("window management", () => {
    it("limits to 30 buckets max", () => {
      for (let i = 0; i < 35; i++) {
        _injectBucket(i, i + 1)
      }

      const status = getSurgeStatus()
      expect(status.windowMinutes).toBeLessThanOrEqual(30)
    })

    it("starts with 1 bucket on first access", () => {
      const status = getSurgeStatus()
      expect(status.windowMinutes).toBeGreaterThanOrEqual(1)
    })
  })

  describe("resetSurgePredictor()", () => {
    it("clears all state", () => {
      for (let i = 0; i < 50; i++) recordLead()

      resetSurgePredictor()

      const status = getSurgeStatus()
      expect(status.currentRate).toBe(0)
      expect(status.level).toBe("NORMAL")
      expect(status.peakRate).toBe(0)
    })
  })

  describe("festival scenario simulation", () => {
    it("simulates Solaris Nerja lineup drop traffic pattern", () => {
      // Simula: 5 min calm → ramp up → surge → plateau
      // Minuto 29-25: tráfico normal (5-8/min)
      _injectBucket(9, 5)
      _injectBucket(8, 6)
      _injectBucket(7, 7)
      _injectBucket(6, 8)
      _injectBucket(5, 8)

      // Minuto 24-22: ramp up (anuncio en RRSS)
      _injectBucket(4, 15)
      _injectBucket(3, 35)

      // Minuto 21-20: surge (viral) — each step >50% growth
      _injectBucket(2, 50)
      _injectBucket(1, 100)
      _injectBucket(0, 200)

      const status = getSurgeStatus()

      // Debe detectar SURGE
      expect(status.level).toBe("SURGE")
      expect(status.currentRate).toBe(200)
      expect(status.peakRate).toBe(200)

      // Debe tener surge warning (>50% crecimiento en cada step: 50→100→200)
      expect(status.surgeWarning).toBe(true)

      // Gradient debe ser positivo
      expect(status.gradient).toBeGreaterThan(0)
      expect(status.gradientTrend).toBe("rising")

      // Predicción debe ser alta
      expect(status.prediction15m).toBeGreaterThan(200)
    })
  })
})
