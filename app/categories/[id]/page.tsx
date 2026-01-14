"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product, Category } from "@/lib/categories"
import { useRouter, useParams } from "next/navigation"
import { getCurrencyFromStorage, type Currency, getPriceForCurrency } from "@/lib/currency"
import { ProductCard } from "@/components/product-card"

interface ProductImage {
  id: string
  image_url: string
  display_order: number
}

interface ProductWithImages extends Product {
  product_images?: ProductImage[]
}

export default function CategoryPage() {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<ProductWithImages[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState<Currency>("USD")
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  useEffect(() => {
    const fetchData = async () => {
      const { data: categoryData } = await supabase.from("categories").select("*").eq("id", categoryId).single()

      const { data: productsData } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false })

      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
      setCurrency(getCurrencyFromStorage())

      setCategory(categoryData)
      setProducts((productsData as ProductWithImages[]) || [])
      setLoading(false)
    }

    fetchData()

    const handleStorageChange = () => {
      setCurrency(getCurrencyFromStorage())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [supabase, categoryId])

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id)
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        quantity: 1,
      })
    }

    router.push("/cart")
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Category not found</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          {category.image_url && (
            <div className="w-full h-64 bg-muted rounded-lg overflow-hidden mb-6">
              <img
                src={category.image_url || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && <p className="text-muted-foreground text-lg">{category.description}</p>}
        </div>

        {products.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No products in this category</CardTitle>
              <CardDescription>Check back soon</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const price = getPriceForCurrency(product, currency)

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  price={price}
                  onAddToCart={handleAddToCart}
                />
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
