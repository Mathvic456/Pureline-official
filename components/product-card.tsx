"use client"

import type React from "react"

import Link from "next/link"
import type { Product } from "@/lib/categories"
import { useRouter } from "next/navigation"

interface ProductImage {
  id: string
  image_url: string
  display_order: number
}

interface ProductCardProps {
  product: Product & { product_images?: ProductImage[] }
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const firstImage = (product.product_images || []).sort((a, b) => a.display_order - b.display_order)[0]
  const handleCardClick = () => router.push(`/projects/${product.id}`)

  return (
    <div onClick={handleCardClick} className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
      {firstImage && (
        <div className="w-full h-48 bg-muted overflow-hidden">
          <img src={firstImage.image_url || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition" />
        </div>
      )}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>
        <div>
          <Link href={`/projects/${product.id}`} className="inline-block px-4 py-2 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity">View Project</Link>
        </div>
      </div>
    </div>
  )
}
