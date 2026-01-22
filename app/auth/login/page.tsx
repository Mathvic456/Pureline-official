"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { validateLoginForm } from "@/lib/validation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    const validation = validateLoginForm({ email, password })
    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/account")
    } catch (error: unknown) {
      setFieldErrors({ form: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            APEX
          </Link>
          <h1 className="text-3xl font-light tracking-tight mt-6 mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>

        <div className="mb-8">
          <OAuthButtons />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`h-12 border-0 border-b rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground transition-colors ${fieldErrors.password ? "border-destructive" : ""}`}
            />
            {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
          </div>

          {fieldErrors.form && (
            <p className="text-sm text-destructive text-center">{fieldErrors.form}</p>
          )}

          <Button type="submit" className="w-full h-12 mt-8" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-foreground hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
