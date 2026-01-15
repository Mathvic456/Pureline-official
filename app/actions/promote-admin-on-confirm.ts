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

    const { data, error } = await adminClient
      .from("admin_users")
      .upsert([{ id: userId }], { onConflict: "id" })
      .select()

    console.log("[v0] Upsert response - data:", data, "error:", error)

    if (error) {
      console.log("[v0] Error promoting to admin:", error.message)
      return { success: false, error: error.message }
    }

    const { data: verifyData, error: verifyError } = await adminClient
      .from("admin_users")
      .select("id")
      .eq("id", userId)
      .single()

    console.log("[v0] Verification - data:", verifyData, "error:", verifyError)

    if (verifyError || !verifyData) {
      console.log("[v0] Verification failed:", verifyError?.message)
      return { success: false, error: "Failed to verify admin promotion" }
    }

    console.log("[v0] PROMOTE SUCCESS - Admin user verified:", verifyData.id)
    return { success: true, message: "User promoted to admin" }
  } catch (error) {
    console.error("[v0] PROMOTE EXCEPTION:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}
