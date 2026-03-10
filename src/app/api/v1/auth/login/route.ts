import { NextRequest, NextResponse } from "next/server"
import { createSessionToken } from "@/lib/auth/session"

export async function POST(req: NextRequest){

  const body = await req.json()

  if(body.password !== process.env["ADMIN_PASSWORD"]){

    return NextResponse.json(
      { error:"unauthorized" },
      { status:401 }
    )

  }

  const token = createSessionToken()

  const res = NextResponse.json({ success:true })

  res.cookies.set("admin_session",token,{
    httpOnly:true,
    secure:true,
    sameSite:"lax",
    path:"/",
    maxAge:60*60*8
  })

  return res

}
