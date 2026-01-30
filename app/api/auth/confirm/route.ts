import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type")
  const isAdmin = searchParams.get("admin") === "true"

  const redirectBase = request.nextUrl.origin
  const successUrl = isAdmin ? "/admin/login" : "/auth/login"
  const errorUrl = "/auth/confirm"

  // If there's a code parameter, we can't handle it server-side without the PKCE verifier
  // Redirect to the client-side confirm page which will try to exchange it
  if (code && !token_hash) {
    const params = new URLSearchParams(searchParams)
    return NextResponse.redirect(`${redirectBase}${errorUrl}?${params.toString()}`)
  }

  // Handle token_hash verification using admin client
  if (token_hash && type) {
    try {
      const adminClient = getAdminClient()

      // For signup/email confirmation with token_hash, we need to verify the OTP
      // The admin client can't directly verify OTPs, but we can use it to
      // check the user's status and update if needed

      // First, try to decode information from the token (if possible)
      // Since we can't verify the token server-side without the regular client,
      // redirect to client-side with the parameters
      const params = new URLSearchParams()
      params.set("token_hash", token_hash)
      params.set("type", type)
      if (isAdmin) params.set("admin", "true")

      return NextResponse.redirect(`${redirectBase}${errorUrl}?${params.toString()}`)
    } catch (error) {
      console.error("[API] Confirm error:", error)
      return NextResponse.redirect(
        `${redirectBase}${errorUrl}?error=verification_failed&message=${encodeURIComponent("Unable to verify email")}`
      )
    }
  }

  // No valid parameters - redirect to error
  return NextResponse.redirect(
    `${redirectBase}${errorUrl}?error=invalid_link&message=${encodeURIComponent("Invalid confirmation link")}`
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, isAdmin } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const adminClient = getAdminClient()

    // Look up the user by email
    const { data: users, error: listError } = await adminClient.auth.admin.listUsers()

    if (listError) {
      console.error("[API] List users error:", listError)
      return NextResponse.json({ error: "Unable to verify user" }, { status: 500 })
    }

    const user = users.users.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is already confirmed
    if (user.email_confirmed_at) {
      // User is already confirmed - if admin signup, promote them
      if (isAdmin) {
        const { error: updateError } = await adminClient
          .from("profiles")
          .update({ role: "admin" })
          .eq("id", user.id)

        if (updateError) {
          console.error("[API] Admin promotion error:", updateError)
        }
      }

      return NextResponse.json({
        success: true,
        message: "Email already confirmed",
        confirmed: true,
      })
    }

    // Manually confirm the user's email using admin client
    const { data: updatedUser, error: updateError } = await adminClient.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    })

    if (updateError) {
      console.error("[API] Update user error:", updateError)
      return NextResponse.json({ error: "Unable to confirm email" }, { status: 500 })
    }

    // If admin signup, promote to admin
    if (isAdmin) {
      const { error: profileError } = await adminClient
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id)

      if (profileError) {
        console.error("[API] Admin promotion error:", profileError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email confirmed successfully",
      confirmed: true,
      userId: updatedUser.user.id,
    })
  } catch (error) {
    console.error("[API] Confirm POST error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    )
  }
}
