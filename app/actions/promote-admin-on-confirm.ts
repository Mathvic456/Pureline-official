"use server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function promoteUserToAdmin(userId: string) {
  try {
    console.log("[v0] PROMOTE START - userId:", userId)

    if (!userId) {
      console.log("[v0] ERROR: No userId provided")
      return { error: "No user ID provided" }
    }

    const adminClient = getAdminClient()
    console.log("[v0] Admin client created")

    console.log("[v0] Attempting to insert into admin_users with id:", userId)

    const { data, error } = await adminClient
      .from("admin_users")
      .insert([{ id: userId }])
      .select()

    console.log("[v0] Insert response - data:", data, "error:", error)

    if (error) {
      if (error.code === "23505") {
        console.log("[v0] User already admin (duplicate key)")
        return { success: true, message: "User already admin" }
      }
      console.log("[v0] Error promoting to admin - code:", error.code, "message:", error.message)
      return { error: error.message }
    }

    console.log("[v0] PROMOTE SUCCESS - data:", data)
    return { success: true, message: "User promoted to admin" }
  } catch (error) {
    console.error("[v0] PROMOTE EXCEPTION:", error)
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}
