import { NextResponse } from "next/server"
import { queueLength } from "@/lib/security/redisQueue"

export async function GET() {

  const length = await queueLength()

  return NextResponse.json({
    queue: length
  })

}
