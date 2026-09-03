"use client"

import { useState } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProjectInquiryPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [projectRef, setProjectRef] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Fallback: open user's email client with prefilled message
    const subject = encodeURIComponent(`Project Inquiry: ${projectRef || "General"}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    window.location.href = `mailto:hello@luxedesign.example?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">

      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <h1 className="text-4xl lg:text-5xl font-serif text-center mb-4">Project Inquiry</h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto">
            Ask about a project, request a consultation, or check on an ongoing assignment.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {sent ? (
          <div className="text-center p-8 bg-secondary rounded">
            <h3 className="text-xl font-medium mb-2">Inquiry opened in your email client</h3>
            <p className="text-muted-foreground">Please complete the email to send your inquiry, or contact us directly at hello@luxedesign.example</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
            </div>

            <div>
              <Label htmlFor="projectRef">Project Reference (optional)</Label>
              <Input id="projectRef" value={projectRef} onChange={(e) => setProjectRef(e.target.value)} className="mt-2" />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-border rounded mt-2 min-h-[120px] bg-background text-foreground"
              />
            </div>

            <div className="flex items-center justify-between">
              <Button type="submit" className="px-8">Send Inquiry</Button>
              <a href="/contact" className="text-sm text-muted-foreground underline">Or use our contact page</a>
            </div>
          </form>
        )}
      </div>

      <MobileNav />
      <div className="h-16 lg:hidden" />
    </main>
  )
}
