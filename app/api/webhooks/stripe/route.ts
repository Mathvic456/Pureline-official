// Stripe webhooks are disabled in frontend-only mode.
export async function POST() {
  return new Response(JSON.stringify({ received: false, message: "Webhooks disabled in frontend-only mode" }), { status: 200 })
}
