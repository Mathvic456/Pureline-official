import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get("token_hash")
  const type = requestUrl.searchParams.get("type")
  const code = requestUrl.searchParams.get("code")
  const isAdmin = requestUrl.searchParams.get("admin") === "true"
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")
  
  const baseUrl = requestUrl.origin
  
  // Handle errors from Supabase
  if (error) {
    const errorUrl = new URL(`${baseUrl}/auth/confirm-result`, baseUrl)
    errorUrl.searchParams.set("status", "error")
    errorUrl.searchParams.set("message", error_description || error)
    if (isAdmin) errorUrl.searchParams.set("admin", "true")
    return NextResponse.redirect(errorUrl)
  }
  
  try {
    const supabaseAdmin = getAdminClient()
    
    // Handle token_hash flow (OTP verification)
    if (token_hash && type) {
      // Use admin API to verify the token
      const { data, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
        token_hash,
        type: type as "signup" | "email" | "magiclink",
      })
      
      if (verifyError) {
        // Check if user is already confirmed
        if (verifyError.message.includes("expired") || verifyError.message.includes("invalid")) {
          const errorUrl = new URL(`${baseUrl}/auth/confirm-result`, baseUrl)
          errorUrl.searchParams.set("status", "expired")
          errorUrl.searchParams.set("message", "This link has expired or already been used.")
          if (isAdmin) errorUrl.searchParams.set("admin", "true")
          return NextResponse.redirect(errorUrl)
        }
        
        const errorUrl = new URL(`${baseUrl}/auth/confirm-result`, baseUrl)
        errorUrl.searchParams.set("status", "error")
        errorUrl.searchParams.set("message", verifyError.message)
        if (isAdmin) errorUrl.searchParams.set("admin", "true")
        return NextResponse.redirect(errorUrl)
      }
      
      // Success - promote to admin if needed
      if (data.user && isAdmin) {
        await supabaseAdmin
          .from("admin_users")
          .upsert({ user_id: data.user.id }, { onConflict: "user_id" })
      }
      
      const successUrl = new URL(`${baseUrl}/auth/confirm-result`, baseUrl)
      successUrl.searchParams.set("status", "success")
      if (isAdmin) successUrl.searchParams.set("admin", "true")
      return NextResponse.redirect(successUrl)
    }
    
    // Handle PKCE code flow - exchange server-side
    if (code) {
      // For PKCE, we can't exchange the code without the verifier
      // So we'll try to verify the user differently
      // First, let's see if we can get user info from the code
      
      // Unfortunately, without the code_verifier, we cannot exchange the code
      // The best we can do is redirect to a page that explains this
      // and offers manual confirmation
      
      const manualUrl = new URL(`${baseUrl}/auth/confirm-result`, baseUrl)
      manualUrl.searchParams.set("status", "manual")
      manualUrl.searchParams.set("code", code)
      if (isAdmin) manualUrl.searchParams.set("admin", "true")
      return NextResponse.redirect(manualUrl)
    }
    
    // No valid parameters
    const errorUrl = new URL(`${baseUrl}/auth/confirm-result`, baseUrl)
    errorUrl.searchParams.set("status", "invalid")
    errorUrl.searchParams.set("message", "Invalid confirmation link")
    if (isAdmin) errorUrl.searchParams.set("admin", "true")
    return NextResponse.redirect(errorUrl)
    
  } catch (err) {
    const errorUrl = new URL(`${baseUrl}/auth/confirm-result`, baseUrl)
    errorUrl.searchParams.set("status", "error")
    errorUrl.searchParams.set("message", err instanceof Error ? err.message : "An error occurred")
    if (isAdmin) errorUrl.searchParams.set("admin", "true")
    return NextResponse.redirect(errorUrl)
  }
}
