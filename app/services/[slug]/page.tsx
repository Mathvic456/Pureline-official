import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { getServiceBySlug, services } from "@/lib/services"

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const IconComponent = service.icon

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ThemeToggle />

      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <Image src={service.image} alt={service.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-white/80 mb-8 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to services
          </Link>
          <div className="flex items-center gap-4 text-white/80 mb-5">
            <IconComponent className="w-9 h-9" />
            <span className="text-sm uppercase tracking-[0.2em]">Our services</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight">{service.title}</h1>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-16">
          <div>
            <p className="text-xl md:text-2xl leading-relaxed mb-10">{service.description}</p>
            <h2 className="text-2xl font-serif mb-6">What we can create with you</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 border-t border-border pt-4 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="bg-muted/40 p-8 h-fit">
            <h2 className="text-2xl font-serif mb-4">Ready to begin?</h2>
            <p className="text-muted-foreground mb-8">Tell us about your space, priorities, and the feeling you want to create.</p>
            <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity">
              Book a consultation <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </aside>
        </div>
      </section>

    </main>
  )
}