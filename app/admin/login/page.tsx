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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      await new Promise((resolve) => setTimeout(resolve, 500))

      // Verify admin status
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        const { data: adminUser, error: queryError } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle()

        if (queryError) {
          console.log("[v0] Admin query error:", queryError)
          throw new Error("Failed to verify admin status")
        }

        if (!adminUser) {
          throw new Error("This account does not have admin privileges")
        }

        router.push("/admin/dashboard")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Login failed")
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
