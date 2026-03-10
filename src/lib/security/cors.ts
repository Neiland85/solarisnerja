import { NextRequest, NextResponse } from "next/server"

const ALLOWED_ORIGINS = new Set([
  "https://solarisnerja.com",
  "https://www.solarisnerja.com",
  "http://localhost:3000"
])

export function corsGuard(req: NextRequest) {

  const origin = req.headers.get("origin")

  if (!origin) {
    return new NextResponse(null,{status:403})
  }

  if (!ALLOWED_ORIGINS.has(origin)) {
    return new NextResponse(null,{status:403})
  }

  return null
}

export function corsHeaders(origin:string){

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-request-id"
  }

}
