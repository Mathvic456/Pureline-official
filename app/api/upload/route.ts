import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Upload API is disabled in frontend-only mode" }, { status: 501 })
}
