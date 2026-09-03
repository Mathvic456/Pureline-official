"use server"

export async function setupAdmin() {
  throw new Error("Admin setup is disabled in frontend-only mode")
}

export async function createAdminUser() {
  throw new Error("Admin setup is disabled in frontend-only mode")
}
