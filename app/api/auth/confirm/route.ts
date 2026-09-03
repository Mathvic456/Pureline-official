import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  // Email confirmation is disabled in frontend-only mode. Redirect to home.
  const redirectBase = request.nextUrl.origin
  return NextResponse.redirect(`${redirectBase}/`)
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Auth endpoints are disabled in frontend-only mode" }, { status: 501 })
}
