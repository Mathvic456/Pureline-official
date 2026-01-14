"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function signupAsAdmin(email: string, password: string) {
  try {
    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" }
    }

    const supabase = await createClient(cookies())

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000"

    console.log("[v0] Admin signup - Site URL:", siteUrl)
    console.log("[v0] Admin signup - NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL)
    console.log("[v0] Admin signup - VERCEL_URL:", process.env.VERCEL_URL)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/confirm?admin=true`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (!data.user) {
      return { error: "Failed to create user" }
    }

    return { success: true, userId: data.user.id }
  } catch (error) {
    console.error("[v0] Admin signup error:", error)
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}
