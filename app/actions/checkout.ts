"use server"

export async function createCheckoutSession() {
  throw new Error("Checkout is disabled in frontend-only mode")
}
