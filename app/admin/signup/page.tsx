"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signupAsAdmin } from "@/app/actions/admin-signup"
import { validateSignupForm } from "@/lib/validation"

export default function AdminSignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    const validation = validateSignupForm({
      email,
      password,
      confirmPassword: repeatPassword,
    })

    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      return
    }

    setIsLoading(true)

    try {
      const result = await signupAsAdmin(email, password)

      if (result.error) {
        setFieldErrors({ form: result.error })
      } else {
        setShowSuccess(true)
      }
    } catch (err) {
      setFieldErrors({ form: err instanceof Error ? err.message : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light tracking-tight mb-2">Check your email</h1>
            <p className="text-muted-foreground">
              We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground text-center mb-6">
              Click the link in your email to activate your admin account. After confirmation, you can log in to the
              dashboard.
            </p>
            <Button asChild variant="outline" className="w-full h-12 bg-transparent">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            APEX
          </Link>
          <h1 className="text-3xl font-light tracking-tight mt-6 mb-2">Create Admin Account</h1>
          <p className="text-muted-foreground text-sm">Set up your admin credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={`h-12 border-0 border-b rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground transition-colors ${fieldErrors.email ? "border-destructive" : ""}`}
            />
            {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={`h-12 border-0 border-b rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground transition-colors ${fieldErrors.password ? "border-destructive" : ""}`}
            />
            {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="repeat-password" className="text-xs uppercase tracking-wider text-muted-foreground">
              Confirm Password
            </Label>
            <Input
              id="repeat-password"
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={`h-12 border-0 border-b rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground transition-colors ${fieldErrors.confirmPassword ? "border-destructive" : ""}`}
            />
            {fieldErrors.confirmPassword && <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>}
          </div>

          {fieldErrors.form && <p className="text-sm text-destructive text-center">{fieldErrors.form}</p>}

          <Button type="submit" className="w-full h-12 mt-8" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an admin account?{" "}
            <Link href="/admin/login" className="text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
