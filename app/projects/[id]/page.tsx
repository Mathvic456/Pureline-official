"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getProjectById, getRelatedProjects, type Project } from "@/lib/projects"

export default function ProjectDetailPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [related, setRelated] = useState<Project[]>([])
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const p = getProjectById(id)
    setProject(p)
    setRelated(getRelatedProjects(p?.category, p?.id))
  }, [id])

  if (!project) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-serif mb-4">Project not found</h1>
          <p className="text-muted-foreground mb-8">The project you are looking for doesn't exist.</p>
          <Link href="/portfolio" className="inline-block px-8 py-4 bg-primary text-primary-foreground text-sm tracking-wider uppercase">View Portfolio</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="grid grid-cols-2 gap-2">
            {project.images?.map((image, index) => (
              <div key={image} className={`aspect-square bg-secondary overflow-hidden relative ${index === 0 ? "col-span-2 aspect-[4/3]" : ""}`}>
                <Image src={image} alt={`${project.name} - image ${index + 1}`} fill className="object-cover" loading={index === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{project.category || "Interior Design"}</p>
            <h1 className="text-3xl lg:text-4xl font-serif mb-4">{project.name}</h1>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-sm font-medium tracking-wider uppercase">Project Details</h3>
              <p className="text-sm">Year: {project.year || "—"}</p>
              <p className="text-sm">Location: {project.location || "—"}</p>
              <p className="text-sm">Project budget: {project.budget}</p>
            </div>

            <div className="pt-6">
              <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity">Inquire About This Project</Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-serif mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/projects/${r.id}`} className="group">
                  <div className="aspect-square relative overflow-hidden bg-card">
                    <Image src={r.images?.[0] || "/placeholder.svg"} alt={r.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium">{r.name}</h3>
                    <p className="text-sm text-muted-foreground">{r.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

    </main>
  )
}
