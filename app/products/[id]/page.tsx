"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/categories"
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { formatPrice, getCurrencyFromStorage, type Currency, getPriceForCurrency } from "@/lib/currency"

interface ProductImage {
  id: string
  image_url: string
  display_order: number
}

interface ProductWithImages extends Product {
  product_images?: ProductImage[]
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<ProductWithImages | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState<Currency>("USD")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const supabase = createClient()

  useEffect(() => {
    const fetchProduct = async () => {
      const { data: productData } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("id", productId)
        .single()

      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
      setCurrency(getCurrencyFromStorage())

      setProduct((productData as ProductWithImages) || null)
      setLoading(false)
    }

    fetchProduct()

    const handleStorageChange = () => {
      setCurrency(getCurrencyFromStorage())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [supabase, productId])

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!product) return

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single()

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        quantity,
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

  if (!product) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Product not found</CardTitle>
              <CardDescription>The product you're looking for doesn't exist</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    )
  }

  const images = (product.product_images || []).sort((a, b) => a.display_order - b.display_order)
  const price = getPriceForCurrency(product, currency)
  const currentImage = images[selectedImageIndex]

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 flex items-center gap-2">
          <ChevronLeft size={20} />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {currentImage && (
              <div className="w-full h-96 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={currentImage.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {images.length > 1 && (
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevImage}
                  className="flex-shrink-0 bg-transparent"
                >
                  <ChevronLeft size={20} />
                </Button>

                {/* Thumbnail Grid */}
                <div className="flex gap-2 overflow-x-auto flex-1 py-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition ${
                        idx === selectedImageIndex ? "border-foreground" : "border-border hover:border-foreground/50"
                      }`}
                    >
                      <img
                        src={img.image_url || "/placeholder.svg"}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextImage}
                  className="flex-shrink-0 bg-transparent"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{product.description}</p>
            </div>

            {/* Price */}
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">Price</p>
              <p className="text-4xl font-bold">{formatPrice(price, currency)}</p>
            </div>

            {/* Quantity Selector */}
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-3">Quantity</p>
              <div className="flex items-center gap-4 w-fit border border-border rounded-lg p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-lg hover:bg-muted rounded"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 text-lg hover:bg-muted rounded">
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full flex items-center justify-center gap-2 py-6 text-lg"
            >
              <ShoppingCart size={24} />
              Add to Cart
            </Button>

            {/* Product Info */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">SKU</p>
                  <p className="font-mono text-xs">{product.id.slice(0, 12)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Images</p>
                  <p className="font-semibold">{images.length} available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
