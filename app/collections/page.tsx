"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      setProducts(productsData || [])
      setLoading(false)
    }

    fetchData()
  }, [supabase])

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

    window.location.href = "/cart"
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-12">All Collections</h1>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No products available</CardTitle>
              <CardDescription>Check back soon for new collections</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {product.imageUrl && (
                  <div className="w-full h-48 bg-muted overflow-hidden">
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                )}
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">${(product.price / 100).toFixed(2)}</span>
                    <Button size="sm" onClick={() => handleAddToCart(product.id)} className="flex items-center gap-2">
                      <ShoppingCart size={16} />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
