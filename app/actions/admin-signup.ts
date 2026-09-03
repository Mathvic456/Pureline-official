"use server"

export async function signupAsAdmin() {
  throw new Error("Admin signup is disabled in frontend-only mode")
}
