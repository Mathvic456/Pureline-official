"use server"

export async function uploadProductImage() {
  throw new Error("Upload image action is disabled in frontend-only mode")
}
