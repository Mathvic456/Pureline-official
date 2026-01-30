"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
  const router = useRouter()
  const [status, setStatus] = useState<ConfirmStatus>("verifying")
  const [errorMessage, setErrorMessage] = useState("")
  const [countdown, setCountdown] = useState(5)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const isAdminSignup = searchParams.get("admin") === "true"
  const supabase = createClient()
  const hasVerified = useRef(false)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const redirectUrl = isAdminSignup ? "/admin/login" : "/auth/login"
  
  // Debug logger
  const addDebug = useCallback((msg: string) => {
    console.log("[v0] Email Confirm:", msg)
    setDebugInfo(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${msg}`])
  }, [])

  // Helper function to save pending profile from localStorage
  const savePendingProfileData = useCallback(async () => {
    try {
      const pendingProfileStr = localStorage.getItem("pendingUserProfile")
      if (!pendingProfileStr) {
        addDebug("No pending profile in localStorage")
        return
      }
      
      const pendingProfile = JSON.parse(pendingProfileStr)
      addDebug(`Saving profile for: ${pendingProfile.firstName} ${pendingProfile.lastName}`)
      
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
        addDebug("Profile saved and localStorage cleared")
      } else {
        addDebug(`Profile save failed: ${result.message}`)
      }
    } catch (err) {
      addDebug(`Profile save error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }, [addDebug])

  // Helper to promote admin user
  const promoteAdmin = useCallback(async (userId: string) => {
    if (!isAdminSignup) return
    try {
      addDebug(`Promoting user ${userId} to admin`)
      const result = await promoteUserToAdmin(userId)
      addDebug(`Admin promotion result: ${JSON.stringify(result)}`)
    } catch (err) {
      addDebug(`Admin promotion error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }, [isAdminSignup, addDebug])

  // Start countdown and redirect
  const startRedirectCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
    
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current)
          }
          router.push(redirectUrl)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [redirectUrl, router])

  useEffect(() => {
    // Cleanup interval on unmount
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Prevent double execution
    if (hasVerified.current) return
    hasVerified.current = true

    const verifyEmail = async () => {
      try {
        addDebug("Starting email verification...")
        addDebug(`URL: ${window.location.href}`)
        
        // Get all URL parameters
        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type")
        const code = searchParams.get("code")
        const error_code = searchParams.get("error_code")
        const error_description = searchParams.get("error_description")
        
        addDebug(`Params - token_hash: ${token_hash ? 'present' : 'none'}, type: ${type}, code: ${code ? 'present' : 'none'}`)
        
        // Check for error in URL (from Supabase redirect)
        if (error_code || error_description) {
          addDebug(`URL Error - code: ${error_code}, desc: ${error_description}`)
          setStatus("error")
          setErrorMessage(error_description || `Error code: ${error_code}`)
          return
        }

        // First check if user already has a valid session (email already confirmed)
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession()
        addDebug(`Existing session check - has session: ${!!existingSession}, error: ${sessionError?.message || 'none'}`)

        if (existingSession?.user?.email_confirmed_at) {
          addDebug(`User already confirmed at: ${existingSession.user.email_confirmed_at}`)
          await savePendingProfileData()
          await promoteAdmin(existingSession.user.id)
          setStatus("already-confirmed")
          startRedirectCountdown()
          return
        }

        // Handle PKCE flow with code parameter
        if (code) {
          addDebug("Handling PKCE flow with code parameter")
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            addDebug(`Code exchange error: ${error.message}`)
            
            // Check if user might already be confirmed
            const { data: { session: retrySession } } = await supabase.auth.getSession()
            if (retrySession?.user?.email_confirmed_at) {
              addDebug("User was already confirmed despite code error")
              await savePendingProfileData()
              await promoteAdmin(retrySession.user.id)
              setStatus("already-confirmed")
              startRedirectCountdown()
              return
            }
            
            setStatus("error")
            setErrorMessage(getReadableError(error.message))
            return
          }
          
          if (data.session?.user) {
            addDebug(`PKCE success - user: ${data.session.user.id}`)
            await savePendingProfileData()
            await promoteAdmin(data.session.user.id)
            setStatus("success")
            startRedirectCountdown()
            return
          }
        }

        // Handle token_hash flow (OTP verification)
        if (token_hash) {
          addDebug("Handling token_hash OTP flow")
          
          const otpType = type === "signup" ? "signup" : type === "email" ? "email" : "signup"
          addDebug(`Verifying OTP with type: ${otpType}`)
          
          const { data, error } = await supabase.auth.verifyOtp({
            type: otpType as "signup" | "email",
            token_hash,
          })

          if (error) {
            addDebug(`OTP verification error: ${error.message}`)
            
            // Check if the error indicates the token was already used
            const { data: { session: retrySession } } = await supabase.auth.getSession()
            
            if (retrySession?.user?.email_confirmed_at) {
              addDebug("User confirmed despite OTP error (likely already used token)")
              await savePendingProfileData()
              await promoteAdmin(retrySession.user.id)
              setStatus("already-confirmed")
              startRedirectCountdown()
              return
            }
            
            setStatus("error")
            setErrorMessage(getReadableError(error.message))
            return
          }

          if (data.user) {
            addDebug(`OTP success - user: ${data.user.id}`)
            await savePendingProfileData()
            await promoteAdmin(data.user.id)
            setStatus("success")
            startRedirectCountdown()
            return
          }
        }

        // Check URL hash for implicit flow tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const hashError = hashParams.get("error")
        const hashErrorDesc = hashParams.get("error_description")
        
        addDebug(`Hash params - access_token: ${accessToken ? 'present' : 'none'}, error: ${hashError || 'none'}`)
        
        if (hashError) {
          setStatus("error")
          setErrorMessage(hashErrorDesc || hashError)
          return
        }
        
        if (accessToken) {
          addDebug("Handling implicit flow with access_token in hash")
          // The session should be automatically set by Supabase
          const { data: { session: hashSession } } = await supabase.auth.getSession()
          
          if (hashSession?.user) {
            addDebug(`Hash session found - user: ${hashSession.user.id}`)
            await savePendingProfileData()
            await promoteAdmin(hashSession.user.id)
            setStatus("success")
            startRedirectCountdown()
            return
          }
        }
        
        // No valid parameters found
        addDebug("No valid confirmation parameters found")
        setStatus("invalid-link")
        setErrorMessage("This confirmation link is missing required parameters. Please check your email for the correct link or request a new one.")
        
      } catch (error) {
        addDebug(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred during verification")
      }
    }

    verifyEmail()
  }, [searchParams, supabase, isAdminSignup, addDebug, savePendingProfileData, promoteAdmin, startRedirectCountdown])
  
  // Helper to convert Supabase errors to user-friendly messages
  const getReadableError = (message: string): string => {
    const errorMap: Record<string, string> = {
      "Token has expired or is invalid": "This confirmation link has expired. Please sign up again to receive a new link.",
      "Invalid token": "This confirmation link is invalid. Please check your email for the correct link.",
      "User already registered": "This email address is already registered. Try signing in instead.",
      "Email link is invalid or has expired": "This link has expired or has already been used. If you already confirmed, try signing in.",
      "otp_expired": "This confirmation link has expired. Please sign up again.",
      "access_denied": "Access was denied. Please try signing up again.",
    }
    
    for (const [key, value] of Object.entries(errorMap)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value
      }
    }
    
    return message
  }

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
