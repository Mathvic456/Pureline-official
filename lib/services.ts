import { Award, Home, Lightbulb, Users, type LucideIcon } from "lucide-react"

export interface Service {
  slug: string
  title: string
  description: string
  features: string[]
  image: string
  icon: LucideIcon
}

export const services: Service[] = [
  {
    slug: "residential-design",
    title: "Residential Design",
    description: "Transform your home into a personalized sanctuary that reflects your unique style and meets your family's needs. From single rooms to whole-house renovations, we create spaces that enhance your daily living experience.",
    features: [
      "Living rooms and family spaces",
      "Bedroom and bathroom design",
      "Kitchen design and renovation",
      "Home office and study areas"
    ],
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=85",
    icon: Home
  },
  {
    slug: "commercial-spaces",
    title: "Commercial Spaces",
    description: "Create inspiring work environments that enhance productivity, reflect your brand identity, and leave a lasting impression on clients and employees alike.",
    features: [
      "Office design and fit-outs",
      "Retail space planning",
      "Restaurant and hospitality",
      "Co-working environments"
    ],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85",
    icon: Users
  },
  {
    slug: "luxury-interiors",
    title: "Luxury Interiors",
    description: "Exclusive high-end interior design for discerning clients seeking exceptional elegance. We source rare materials and create bespoke pieces that define luxury living.",
    features: [
      "Custom furniture design",
      "Art curation and placement",
      "Luxury materials sourcing",
      "Bespoke lighting design"
    ],
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85",
    icon: Award
  },
  {
    slug: "design-consultation",
    title: "Design Consultation",
    description: "Expert advice and guidance to help you make informed decisions about your interior design project. Perfect for DIY enthusiasts or those seeking professional direction.",
    features: [
      "Space planning and layout",
      "Color scheme selection",
      "Furniture and material advice",
      "Budget optimization"
    ],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85",
    icon: Lightbulb
  }
]

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug)
}