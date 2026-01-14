"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function promoteUserToAdmin(userId: string) {
  try {
    const supabase = await createClient(cookies())

    console.log("[v0] Promoting user to admin:", userId)

    // Use service role key (admin access) to insert into admin_users table
    const { data, error } = await supabase
      .from("admin_users")
      .insert([{ id: userId }])
      .select()

    if (error) {
      if (error.code === "23505") {
        // Duplicate key error - user already an admin
        console.log("[v0] User already admin")
        return { success: true, message: "User already admin" }
      }
      console.log("[v0] Error promoting to admin:", error)
      return { error: error.message }
    }

    console.log("[v0] User promoted to admin successfully")
    return { success: true, message: "User promoted to admin" }
  } catch (error) {
    console.error("[v0] Promote admin error:", error)
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}
