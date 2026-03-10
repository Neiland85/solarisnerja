import { isIP } from "node:net"
import type { NextRequest } from "next/server"

export function _isValidIp(value: string): boolean {
  return isIP(value) !== 0
}

export function _getClientIp(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip")?.trim()

  if (realIp && _isValidIp(realIp)) {
    return realIp
  }

  const forwardedFor = req.headers.get("x-forwarded-for")
  const first = forwardedFor?.split(",")[0]?.trim()

  if (first && _isValidIp(first)) {
    return first
  }

  return "unknown"
}
