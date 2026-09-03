import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { services } from "@/lib/services"

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ThemeToggle />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80"
            alt="Interior design services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight animate-fade-up">
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto animate-fade-up stagger-1">
            Comprehensive interior design solutions tailored to your vision
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, index) => {
              const IconComponent = service.icon
              const isEven = index % 2 === 0
              
              return (
                <div key={service.slug} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  
                  <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                    <IconComponent className="w-12 h-12 mb-4" />
                    <h2 className="text-3xl md:text-4xl font-serif mb-4">{service.title}</h2>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-foreground mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center px-8 py-4 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
                    >
                      Explore service <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Let's Bring Your Vision to Life</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Schedule a consultation to discuss your interior design needs
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-4 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            Contact Us Today
          </Link>
        </div>
      </section>

    </main>
  )
}