"use server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function promoteUserToAdmin(userId: string) {
  try {
    const adminClient = getAdminClient()

    console.log("[v0] Promoting user to admin:", userId)

    const { data, error } = await adminClient
      .from("admin_users")
      .insert([{ id: userId }])
      .select()

    if (error) {
      if (error.code === "23505") {
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
