// Minimal middleware helpers for Supabase-related code paths.
export async function updateSession() {
  // No-op for frontend-only mode
  return null
}

export default { updateSession }
