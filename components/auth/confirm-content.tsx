"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { promoteUserToAdmin } from "@/app/actions/promote-admin-on-confirm"
import { saveUserProfile } from "@/app/actions/user-profile"

type ConfirmStatus = 
  | "verifying" 
  | "success" 
  | "already-confirmed" 
  | "error" 
  | "invalid-link"

export function ConfirmContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<ConfirmStatus>("verifying")
  const [errorMessage, setErrorMessage] = useState("")
  const [countdown, setCountdown] = useState(3)
  const isAdminSignup = searchParams.get("admin") === "true"
  const supabase = createClient()

  const redirectUrl = isAdminSignup ? "/admin/login" : "/auth/login"

  // Helper function to save pending profile from localStorage
  const savePendingProfileData = async () => {
    try {
      const pendingProfileStr = localStorage.getItem("pendingUserProfile")
      if (!pendingProfileStr) return
      
      const pendingProfile = JSON.parse(pendingProfileStr)
      
      const result = await saveUserProfile(
        pendingProfile.firstName,
        pendingProfile.lastName,
        pendingProfile.phoneNumber,
        pendingProfile.streetAddress,
        pendingProfile.city,
        pendingProfile.country,
        pendingProfile.postalCode
      )
      
      if (result.success) {
        localStorage.removeItem("pendingUserProfile")
      }
    } catch (err) {
      // Silently fail - profile can be updated later in account settings
    }
  }

  // Helper to promote admin user
  const promoteAdmin = async (userId: string) => {
    if (!isAdminSignup) return
    try {
      await promoteUserToAdmin(userId)
    } catch (err) {
      // Non-critical - admin can be promoted manually if needed
    }
  }

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // First check if user already has a valid session (email already confirmed)
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user?.email_confirmed_at) {
          // User is already confirmed - save profile and redirect
          await savePendingProfileData()
          await promoteAdmin(session.user.id)
          setStatus("already-confirmed")
          startRedirectCountdown()
          return
        }

        // Get confirmation parameters from URL
        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type")

        // If no token provided, check if there's a code in the URL hash (PKCE flow)
        if (!token_hash) {
          // Check URL hash for PKCE code
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get("access_token")
          
          if (accessToken) {
            // PKCE flow - token is in the hash
            const { data: { session: newSession }, error } = await supabase.auth.getSession()
            
            if (newSession?.user) {
              await savePendingProfileData()
              await promoteAdmin(newSession.user.id)
              setStatus("success")
              startRedirectCountdown()
              return
            }
          }
          
          setStatus("invalid-link")
          setErrorMessage("No confirmation token found in the link")
          return
        }

        if (type !== "email" && type !== "signup" && type !== "magiclink") {
          setStatus("invalid-link")
          setErrorMessage("Invalid confirmation link type")
          return
        }

        // Attempt to verify the OTP
        const { data, error } = await supabase.auth.verifyOtp({
          type: type === "signup" ? "signup" : "email",
          token_hash,
        })

        if (error) {
          // Check if the error indicates the token was already used
          if (error.message.includes("expired") || error.message.includes("invalid")) {
            // Token expired or invalid - check if user can still login (already confirmed)
            const { data: { session: existingSession } } = await supabase.auth.getSession()
            
            if (existingSession?.user?.email_confirmed_at) {
              await savePendingProfileData()
              await promoteAdmin(existingSession.user.id)
              setStatus("already-confirmed")
              startRedirectCountdown()
              return
            }
          }
          
          setStatus("error")
          setErrorMessage(error.message || "Failed to confirm email")
          return
        }

        // Verification successful
        if (data.user) {
          await savePendingProfileData()
          await promoteAdmin(data.user.id)
        }

        setStatus("success")
        startRedirectCountdown()
      } catch (error) {
        setStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      }
    }

    const startRedirectCountdown = () => {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            window.location.href = redirectUrl
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    verifyEmail()
  }, [searchParams, supabase, isAdminSignup, redirectUrl])

  // Loading state
  if (status === "verifying") {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-muted border-t-foreground" />
          </div>
          <h1 className="text-2xl font-light tracking-tight mb-2">Verifying your email</h1>
          <p className="text-muted-foreground text-sm">Please wait while we confirm your account...</p>
        </div>
      </div>
    )
  }

  // Success state - freshly confirmed
  if (status === "success") {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight mb-2">Email Confirmed</h1>
          <p className="text-muted-foreground text-sm mb-6">
            {isAdminSignup 
              ? "Your admin account is ready. You can now sign in to the dashboard."
              : "Your account is now active. You can now sign in to start shopping."}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Redirecting to login in {countdown} seconds...
          </p>
          <Button asChild className="w-full h-12">
            <Link href={redirectUrl}>
              {isAdminSignup ? "Go to Admin Login" : "Go to Login"}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Already confirmed state
  if (status === "already-confirmed") {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <svg
                className="h-8 w-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight mb-2">Already Confirmed</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Your email has already been verified. You can sign in with your credentials.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Redirecting to login in {countdown} seconds...
          </p>
          <Button asChild className="w-full h-12">
            <Link href={redirectUrl}>
              {isAdminSignup ? "Go to Admin Login" : "Go to Login"}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Invalid link state
  if (status === "invalid-link") {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <svg
                className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight mb-2">Invalid Link</h1>
          <p className="text-muted-foreground text-sm mb-6">
            This confirmation link appears to be invalid or incomplete.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full h-12">
              <Link href={redirectUrl}>Try Signing In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-12 bg-transparent">
              <Link href={isAdminSignup ? "/admin/signup" : "/auth/sign-up"}>
                Sign Up Again
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-light tracking-tight mb-2">Confirmation Failed</h1>
        <p className="text-muted-foreground text-sm mb-2">
          {errorMessage || "Unable to confirm your email address"}
        </p>
        <p className="text-muted-foreground text-sm mb-6">
          The link may have expired or already been used. Try signing in - if your email was confirmed, you should be able to log in.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full h-12">
            <Link href={redirectUrl}>Try Signing In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-12 bg-transparent">
            <Link href={isAdminSignup ? "/admin/signup" : "/auth/sign-up"}>
              Sign Up Again
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
