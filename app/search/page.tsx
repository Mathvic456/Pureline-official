"use client"

import React from "react"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { MobileNav } from "@/components/mobile-nav"
import { getAllProjects, type Project } from "@/lib/projects"
import { Search, X, ArrowRight } from "lucide-react"

interface ProductImage {
  id: string
  image_url: string
  display_order: number
}

interface Product {
  id: string
  name: string
  description: string
  category_id: string
  product_images?: ProductImage[]
  categories?: { name: string }
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [currency, setCurrency] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      const data = getAllProjects()
      setProjects(data)
      setLoading(false)
    }

    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }

    fetchData()

    return () => {}
  }, [])

  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredProducts([])
      setSearching(false)
      return
    }

    setSearching(true)
    const filtered = projects.filter(
      (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.description?.toLowerCase().includes(query.toLowerCase()) || p.category?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredProjects(filtered)
    setSearching(false)
  }, [projects])

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))
    }
  }

  const clearRecentSearch = (searchTerm: string) => {
    const updated = recentSearches.filter(s => s !== searchTerm)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const popularCategories = ["New Arrivals", "Best Sellers", "Featured", "Sale"]

  return (
    <main className="min-h-screen bg-background text-foreground">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-5xl font-serif mb-8">Search</h1>
          
          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full h-14 pl-12 pr-12 border border-border bg-background text-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </form>
        </div>

        {/* Search Results */}
        {searchQuery ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">
                {searching ? "Searching..." : `${filteredProjects.length} result${filteredProjects.length !== 1 ? "s" : ""}`}
              </h2>
              {filteredProjects.length > 0 && (
                <Link 
                  href={`/portfolio?search=${encodeURIComponent(searchQuery)}`}
                  className="text-sm flex items-center gap-1 hover:opacity-60 transition-opacity"
                >
                  View all
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredProjects.slice(0, 9).map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-secondary">
                      <Image
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{p.category || "Interior"}</p>
                      <h3 className="font-medium group-hover:opacity-60 transition-opacity line-clamp-1">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.year || ""}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : !searching && (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No products found for "{searchQuery}"</p>
                <Link
                  href="/categories"
                  className="inline-block px-8 py-4 bg-primary text-primary-foreground text-sm tracking-wider uppercase"
                >
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Recent Searches</h2>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <div key={search} className="flex items-center gap-2 px-4 py-2 bg-secondary">
                      <button
                        onClick={() => setSearchQuery(search)}
                        className="text-sm hover:opacity-60 transition-opacity"
                      >
                        {search}
                      </button>
                      <button
                        onClick={() => clearRecentSearch(search)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Categories */}
            <div>
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Popular Categories</h2>
              <div className="flex flex-wrap gap-2">
                {popularCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/categories?category=${category.toLowerCase().replace(" ", "-")}`}
                    className="px-4 py-2 border border-border text-sm hover:bg-secondary transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Products */}
            {!loading && projects.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">Trending Now</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {projects.slice(0, 6).map((p) => (
                    <Link key={p.id} href={`/projects/${p.id}`} className="group">
                      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-secondary">
                        <Image src={p.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{p.category || "Interior"}</p>
                        <h3 className="font-medium group-hover:opacity-60 transition-opacity line-clamp-1">{p.name}</h3>
                        <p className="text-sm text-muted-foreground">{p.year || ""}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <MobileNav />
      <div className="h-16 lg:hidden" />
    </main>
  )
}
