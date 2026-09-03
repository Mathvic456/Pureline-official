// Admin stub for Supabase admin client used in server actions.
import { createClient as createClientClient } from "./client"

export function getAdminClient() {
  // Provide same safe client for admin flows; storage methods are no-ops
  return createClientClient()
}

export { getAdminClient }
