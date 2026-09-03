"use client"

import { useState } from "react"
import { MobileNav } from "@/components/mobile-nav"

export default function CartPage() {
  const [message, setMessage] = useState("")

  return (
    <main className="min-h-screen bg-background text-foreground">

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-serif mb-6">Inquiries</h1>
        <p className="text-muted-foreground mb-6">This frontend-only site does not support a shopping cart. If you'd like to inquire about a project or request a consultation, please use the form below.</p>

        <form onSubmit={(e) => { e.preventDefault(); setMessage("Thank you — we'll get back to you soon.") }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Full name</label>
            <input required className="mt-1 block w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Email</label>
            <input type="email" required className="mt-1 block w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Message</label>
            <textarea required className="mt-1 block w-full h-36" />
          </div>
          <div>
            <button className="px-4 py-2 bg-foreground text-background">Send Inquiry</button>
          </div>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-secondary rounded">{message}</div>
        )}
      </div>

      <MobileNav />
      <div className="h-16 lg:hidden" />
    </main>
  )
}
