"use server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function promoteUserToAdmin(userId: string) {
  try {
    console.log("[v0] PROMOTE START - userId:", userId)

    if (!userId) {
      console.log("[v0] ERROR: No userId provided")
      return { success: false, error: "No user ID provided" }
    }

    const adminClient = getAdminClient()
    console.log("[v0] Admin client created")

    const { data: authUser, error: authError } = await adminClient.auth.admin.getUserById(userId)
    console.log("[v0] Auth user check - exists:", !!authUser, "error:", authError?.message)

    if (!authUser) {
      console.log("[v0] ERROR: User does not exist in auth")
      return { success: false, error: "User not found in authentication" }
    }

    console.log("[v0] Attempting to insert into admin_users with id:", userId)

    const { data, error } = await adminClient
      .from("admin_users")
      .insert([{ id: userId }])
      .select()

    console.log("[v0] Insert response - data:", data, "error:", error)

    if (error) {
      console.log("[v0] Error promoting to admin - code:", error.code, "message:", error.message)
      if (error.code === "23505") {
        console.log("[v0] User already exists in admin_users, verifying...")
        const { data: existing } = await adminClient.from("admin_users").select("id").eq("id", userId).single()
        console.log("[v0] Existing admin user:", existing)
        return { success: true, message: "User already admin" }
      }
      return { success: false, error: error.message }
    }

    console.log("[v0] PROMOTE SUCCESS - data:", data)
    return { success: true, message: "User promoted to admin" }
  } catch (error) {
    console.error("[v0] PROMOTE EXCEPTION:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}
