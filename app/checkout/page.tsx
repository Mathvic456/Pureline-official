"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"

export default function CheckoutPage() {
  const [status, setStatus] = useState("")

  return (
    <main className="min-h-screen bg-background text-foreground">

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-serif mb-6">Book a Consultation</h1>
        <p className="text-muted-foreground mb-6">Payments and checkout are disabled in frontend-only mode. Fill in the form below and we'll contact you to arrange a consultation and pricing.</p>

        <form onSubmit={(e) => { e.preventDefault(); setStatus("Request submitted — we'll be in touch.") }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Full name</label>
            <input required className="mt-1 block w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Email</label>
            <input type="email" required className="mt-1 block w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Preferred date</label>
            <input type="date" className="mt-1 block w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Notes</label>
            <textarea className="mt-1 block w-full h-36" />
          </div>
          <div>
            <button className="px-4 py-2 bg-foreground text-background">Request Consultation</button>
          </div>
        </form>

        {status && (
          <div className="mt-6 p-4 bg-secondary rounded">{status}</div>
        )}
      </div>

    </main>
  )
}
