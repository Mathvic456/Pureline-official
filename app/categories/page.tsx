"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category } from "@/lib/categories"
import Link from "next/link"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*").order("name")
      setCategories(data || [])
      setLoading(false)
    }

    fetchCategories()
  }, [supabase])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-12">Categories</h1>

        {loading ? (
          <div className="text-center py-12">Loading categories...</div>
        ) : categories.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No categories available</CardTitle>
              <CardDescription>Check back soon</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                  {category.image_url && (
                    <div className="w-full h-48 bg-muted overflow-hidden">
                      <img
                        src={category.image_url || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
