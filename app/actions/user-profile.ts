"use server"

// All user/profile actions disabled in frontend-only mode.
export async function saveUserProfile() {
  throw new Error("User profile actions are disabled in frontend-only mode")
}

export async function getUserProfile() {
  throw new Error("User profile actions are disabled in frontend-only mode")
}

export async function addUserAddress() {
  throw new Error("User profile actions are disabled in frontend-only mode")
}

export async function getUserAddresses() {
  throw new Error("User profile actions are disabled in frontend-only mode")
}

export async function updateUserAddress() {
  throw new Error("User profile actions are disabled in frontend-only mode")
}

export async function deleteUserAddress() {
  throw new Error("User profile actions are disabled in frontend-only mode")
}
