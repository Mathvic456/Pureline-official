"use client"

import { Truck, RotateCcw, Package, Clock, Globe } from "lucide-react"

export default function OurProcessPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <h1 className="text-4xl lg:text-5xl font-serif text-center mb-4">Our Process</h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto">
            From concept to completion — a thoughtful, transparent design process.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground">
              <Truck size={24} />
            </div>
            <h2 className="text-2xl font-serif">Consultation & Discovery</h2>
          </div>
          <p className="text-muted-foreground">
            We begin with an in-depth consultation to understand your lifestyle, space, and goals. This phase
            includes site measurements, inspiration gathering, and budget alignment.
          </p>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground">
              <Package size={24} />
            </div>
            <h2 className="text-2xl font-serif">Design & Concept</h2>
          </div>
          <p className="text-muted-foreground">
            We craft tailored design concepts, mood boards, and detailed plans. You'll receive renderings and
            material palettes to visualize the final space.
          </p>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground">
              <Clock size={24} />
            </div>
            <h2 className="text-2xl font-serif">Procurement & Installation</h2>
          </div>
          <p className="text-muted-foreground">
            We source premium furnishings and coordinate installation with trusted contractors to ensure a
            seamless transformation of your space.
          </p>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground">
              <RotateCcw size={24} />
            </div>
            <h2 className="text-2xl font-serif">Warranty & Support</h2>
          </div>
          <p className="text-muted-foreground">
            We stand by our work. Post-installation support and warranty information are provided for all projects.
          </p>
        </section>

        <div className="text-center p-8 bg-secondary mt-8">
          <h2 className="text-xl font-serif mb-2">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">Contact our team to schedule a design consultation.</p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            Contact Us
          </a>
        </div>
      </div>

    </main>
  )
}
