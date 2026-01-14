"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { promoteUserToAdmin } from "@/app/actions/promote-admin-on-confirm"

export function ConfirmContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [countdown, setCountdown] = useState(2)
  const [redirectUrl, setRedirectUrl] = useState("/auth/login")
  const isAdminSignup = searchParams.get("admin") === "true"
  const supabase = createClient()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user?.email_confirmed_at) {
          console.log("[v0] User already has confirmed email, showing success")

          if (isAdminSignup && session.user.id) {
            const result = await promoteUserToAdmin(session.user.id)
            if (result.success) {
              console.log("[v0] User promoted to admin")
              setRedirectUrl("/admin/login")
            } else {
              console.log("[v0] Admin promotion failed:", result.error)
            }
          }

          setStatus("success")
          startRedirectCountdown()
          return
        }

        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type")
        const email = searchParams.get("email")

        if (!token_hash || type !== "email") {
          console.log("[v0] Missing token_hash or invalid type")
          setStatus("error")
          setErrorMessage("Invalid confirmation link")
          return
        }

        console.log("[v0] Attempting to verify OTP with email:", email)

        const { error } = await supabase.auth.verifyOtp({
          type: "email",
          token_hash,
          email: email || "",
        })

        if (error) {
          console.log("[v0] OTP verification failed:", error.message)

          const {
            data: { session: newSession },
          } = await supabase.auth.getSession()

          if (newSession?.user?.email_confirmed_at) {
            console.log("[v0] User now has confirmed email after OTP attempt, showing success")

            if (isAdminSignup && newSession.user.id) {
              const result = await promoteUserToAdmin(newSession.user.id)
              if (result.success) {
                console.log("[v0] User promoted to admin")
                setRedirectUrl("/admin/login")
              } else {
                console.log("[v0] Admin promotion failed:", result.error)
              }
            }

            setStatus("success")
            startRedirectCountdown()
            return
          }

          console.log("[v0] User still not confirmed, showing error")
          setStatus("error")
          setErrorMessage(error.message || "Failed to confirm email")
          return
        }

        console.log("[v0] OTP verification successful")

        if (isAdminSignup) {
          const { data: userData } = await supabase.auth.getUser()
          if (userData.user?.id) {
            const result = await promoteUserToAdmin(userData.user.id)
            if (result.success) {
              console.log("[v0] User promoted to admin")
              setRedirectUrl("/admin/login")
            } else {
              console.log("[v0] Admin promotion failed:", result.error)
            }
          }
        }

        setStatus("success")
        startRedirectCountdown()
      } catch (error) {
        console.log("[v0] Unexpected error during verification:", error)
        setStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "An error occurred")
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

  if (status === "loading") {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Confirming email...</CardTitle>
              <CardDescription>Please wait while we verify your email address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-destructive">Confirmation Failed</CardTitle>
              <CardDescription>Unable to confirm your email address</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              <p className="text-sm text-muted-foreground">
                The link may have expired. Please try signing up again or contact support.
              </p>
              <Button asChild className="w-full">
                <Link href={isAdminSignup ? "/admin/signup" : "/auth/sign-up"}>Back to Sign Up</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Email Confirmed</CardTitle>
            <CardDescription>Your email has been successfully verified</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {isAdminSignup ? "Your admin account is ready!" : "Your account is now active."} Redirecting in{" "}
              {countdown} seconds...
            </p>
            <Button asChild className="w-full">
              <Link href={redirectUrl}>{isAdminSignup ? "Go to Admin Login" : "Go to Login"}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
