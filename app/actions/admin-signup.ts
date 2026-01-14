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

    // Sign up user with regular auth (requires email confirmation)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/confirm?admin=true`,
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
