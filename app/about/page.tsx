import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { Award, Users, Heart, Sparkles } from "lucide-react"

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in every project, ensuring exceptional quality and attention to detail."
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We work closely with our clients, listening to their needs and bringing their vision to life."
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Our love for design drives us to create spaces that truly inspire and transform lives."
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "We embrace new ideas and technologies while respecting timeless design principles."
  }
]

const team = [
  {
    name: "Sarah Mitchell",
    role: "Founder & Lead Designer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80"
  },
  {
    name: "James Rodriguez",
    role: "Senior Interior Designer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
  },
  {
    name: "Emily Chen",
    role: "Project Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"
  },
  {
    name: "Michael Johnson",
    role: "Commercial Design Specialist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
  }
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ThemeToggle />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80"
            alt="About us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight animate-fade-up">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto animate-fade-up stagger-1">
            Creating exceptional spaces for over a decade
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">Our Story</h2>
            <div className="space-y-6 text-muted-foreground">
              <p>
                Founded in 2015, Pureline Designs has been transforming spaces and exceeding client 
                expectations for over a decade. What began as a passion for creating beautiful, functional 
                environments has grown into a full-service interior design firm serving residential and 
                commercial clients across the region.
              </p>
              <p>
                Our approach combines timeless design principles with contemporary aesthetics, always 
                tailored to reflect our clients' unique personalities and lifestyles. We believe that 
                great design should be both beautiful and practical, creating spaces that not only look 
                stunning but enhance the way you live and work.
              </p>
              <p>
                With a dedicated team of award-winning designers, project managers, and craftspeople, 
                we handle every aspect of your interior design project from initial concept to final 
                installation, ensuring a seamless and stress-free experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div 
                  key={index} 
                  className="text-center animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-foreground text-background mb-4">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Talented designers dedicated to bringing your vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square relative overflow-hidden mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-serif mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </main>
  )
}