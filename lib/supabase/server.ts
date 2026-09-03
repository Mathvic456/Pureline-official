// Server stub for Supabase createClient used in server actions/webhooks.
import { createClient as createClientClient } from "./client"

export async function createClient() {
  // Return the same lightweight client
  return createClientClient()
}

export default createClient
