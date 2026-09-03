"use server"

export async function promoteUserToAdmin() {
  throw new Error("Admin promotion is disabled in frontend-only mode")
}
