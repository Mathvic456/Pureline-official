"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Admin login attempt for:", email)

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      console.log("[v0] Sign in successful, verifying admin status...")

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { data: userData, error: userError } = await supabase.auth.getUser()
      console.log("[v0] User data retrieved:", userData?.user?.id, "error:", userError)

      if (userError || !userData?.user) {
        throw new Error("Failed to get user information")
      }

      const userId = userData.user.id
      console.log("[v0] Checking admin status for user:", userId)

      const { data: adminUser, error: queryError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", userId)
        .single()

      console.log("[v0] Admin query result - data:", adminUser, "error:", queryError?.message)

      if (queryError) {
        console.log("[v0] Admin query error code:", queryError.code)
        // Only throw if it's not PGRST116 (no rows returned)
        if (queryError.code !== "PGRST116") {
          throw new Error(`Admin verification failed: ${queryError.message}`)
        }
        throw new Error("This account does not have admin privileges")
      }

      if (!adminUser) {
        throw new Error("This account does not have admin privileges")
      }

      console.log("[v0] Admin verification passed, redirecting to dashboard")
      router.push("/admin/dashboard")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      console.log("[v0] Login error:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Sign in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-2">Don't have an admin account yet?</p>
                <Button asChild variant="outline" className="w-full text-xs bg-transparent">
                  <Link href="/admin/signup">Create Admin Account</Link>
                </Button>
              </div>

              <div className="bg-muted p-3 rounded">
                <p className="text-xs text-muted-foreground">
                  <strong>First time?</strong> You can sign up for an admin account and confirm your email to get
                  started.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
