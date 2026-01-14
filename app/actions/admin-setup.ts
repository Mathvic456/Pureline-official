"use server"

import { getAdminClient } from "@/lib/supabase/admin"

export async function createAdminUser(email: string, password: string) {
  try {
    // Validate input
    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" }
    }

    const adminClient = getAdminClient()

    // Create user with admin API (no email confirmation required)
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email so they can log in immediately
    })

    if (error) {
      return { error: error.message }
    }

    if (!data.user) {
      return { error: "Failed to create user" }
    }

    // Add to admin_users table
    const { error: adminError } = await adminClient.from("admin_users").insert([
      {
        id: data.user.id,
      },
    ])

    if (adminError) {
      return { error: `Failed to promote to admin: ${adminError.message}` }
    }

    return { success: true, userId: data.user.id }
  } catch (error) {
    console.error("Admin setup error:", error)
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}
