import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ArrowRight, Palette, Home as HomeIcon, Lightbulb, Award, Users, CheckCircle } from "lucide-react"
import Image from "next/image"
import { getAllProjects } from "@/lib/projects"
import { TypingHeading } from "@/components/typing-heading"

// Mock data for services and portfolio
const services = [
  {
    id: 1,
    title: "Residential Design",
    description: "Transform your home into a personalized sanctuary with our residential interior design services.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    icon: HomeIcon
  },
  {
    id: 2,
    title: "Commercial Spaces",
    description: "Create inspiring work environments that enhance productivity and reflect your brand identity.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    icon: Users
  },
  {
    id: 3,
    title: "Luxury Interiors",
    description: "Exclusive high-end interior design for discerning clients seeking exceptional elegance.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    icon: Award
  },
  {
    id: 4,
    title: "Design Consultation",
    description: "Expert advice and guidance to help you make informed decisions about your interior design project.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    icon: Lightbulb
  }
]

const portfolioProjects = getAllProjects()

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80"
            alt="Luxurious interior design"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
          <p className="text-sm tracking-[0.3em] uppercase text-white/80 animate-fade-down">
            Premium Interior Design Services | Renovation | Space Planning
          </p>
          <TypingHeading
            text="Transform Your Space Into Something Extraordinary"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-tight animate-fade-up text-balance"
          />
          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto animate-fade-up stagger-1">
            Creating sophisticated, timeless interiors that reflect your personal style and elevate your lifestyle
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-up stagger-2">
            <Link 
              href="/services"
              className="px-8 py-4 bg-white text-black text-sm tracking-wider uppercase hover:bg-white/90 transition-colors"
            >
              Our Services
            </Link>
            <Link 
              href="/portfolio"
              className="px-8 py-4 border border-white text-white text-sm tracking-wider uppercase hover:bg-white/10 transition-colors"
            >
              View Portfolio
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div> */}
      </section>

      {/* Our Services */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Comprehensive interior design solutions tailored to your unique vision and lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div 
                  key={service.id}
                  className="group relative overflow-hidden bg-card rounded-none animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4">
                      <IconComponent className="w-8 h-8 text-white/80" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <Link 
                      href="/contact" 
                      className="inline-flex items-center text-sm tracking-wider uppercase hover:opacity-70 transition-opacity"
                    >
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A showcase of our recent interior design projects that reflect our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {portfolioProjects.map((project, index) => (
              <Link 
                key={project.id}
                href={`/projects/${project.id}`}
                className="group relative overflow-hidden bg-card animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={project.images[0]}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center text-white">
                      <h3 className="text-lg font-serif mb-1">{project.name}</h3>
                      <p className="text-sm tracking-wider uppercase">{project.category}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/portfolio"
              className="inline-flex items-center px-8 py-4 border border-foreground text-foreground text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              View All Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">Why Choose Pureline Designs</h2>
              <p className="text-muted-foreground mb-8">
                With years of experience and a passion for creating extraordinary spaces, we bring your vision to life with meticulous attention to detail and uncompromising quality.
              </p>
              
              <div className="space-y-6">
                {[
                  "Personalized design approach tailored to your lifestyle",
                  "Award-winning team of interior design professionals",
                  "Full-service project management from concept to completion",
                  "Sustainable and eco-conscious design practices"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-foreground mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link 
                  href="/about"
                  className="inline-flex items-center px-8 py-4 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
                >
                  Learn More About Us <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"
                  alt="Luxurious living room interior"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 lg:py-32 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">Ready to Transform Your Space?</h2>
          <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
            Let's discuss your interior design project and create something extraordinary together. Contact us today for a consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact"
              className="px-8 py-4 bg-background text-foreground text-sm tracking-wider uppercase hover:bg-background/90 transition-colors"
            >
              Get Started Today
            </Link>
            <Link 
              href="/portfolio"
              className="px-8 py-4 border border-background text-background text-sm tracking-wider uppercase hover:bg-background/10 transition-colors"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      
    </main>
  )
}