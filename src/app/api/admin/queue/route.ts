import { NextRequest, NextResponse } from "next/server"
import { queueLength } from "@/lib/security/redisQueue"
import { requireAdmin } from "@/lib/auth/requireAdmin"

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  const length = await queueLength()

  return NextResponse.json({
    queue: length
  })

}
