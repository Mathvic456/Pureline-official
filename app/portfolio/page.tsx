import { getAllProjects } from "@/lib/projects"
import Link from "next/link"
import Image from "next/image"

export default function PortfolioPage() {
  const projects = getAllProjects()

  return (
    <main className="min-h-screen bg-background text-foreground">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4">Portfolio</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Selected projects showcasing our work across residential and commercial interiors.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="group block bg-card overflow-hidden">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image src={p.images?.[0] || "/placeholder.svg"} alt={p.name} fill className="object-cover transition-transform group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{p.category}</p>
                <h3 className="font-serif text-lg mt-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p>
                <p className="text-sm mt-4">Estimated budget: {p.budget}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="h-16 lg:hidden" />
    </main>
  )
}
