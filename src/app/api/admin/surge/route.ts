/**
 * GET /api/admin/surge
 *
 * Expone el estado de predicción de tráfico (surge predictor).
 * Protegido con requireAdmin.
 *
 * Response:
 * {
 *   level: "NORMAL" | "ELEVATED" | "HIGH" | "SURGE",
 *   currentRate, avgRate, peakRate, gradient, gradientTrend,
 *   prediction15m, surgeWarning, windowMinutes,
 *   buckets: [{ minuteAgo, count, timestamp }],
 *   collectedAt
 * }
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/requireAdmin"
import { getSurgeStatus } from "@/lib/observability/surgePredictor"

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 403 }
    )
  }

  const status = getSurgeStatus()

  return NextResponse.json(status, {
    headers: { "Cache-Control": "no-store" },
  })
}
