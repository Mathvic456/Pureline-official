"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import type { Product } from "@/lib/products"
import { useRouter } from "next/navigation"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrencyFromStorage, type Currency, getPriceForCurrency } from "@/lib/currency"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"

interface ProductImage {
  id: string
  image_url: string
  display_order: number
}

interface ProductWithImages extends Product {
  category_id?: string
  price_usd?: number
  price_gbp?: number
  price_ngn?: number
  product_images?: ProductImage[]
}

interface Category {
  id: string
  name: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<ProductWithImages[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithImages[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState<Currency>("USD")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: 0, max: 1000 })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
      setCurrency(getCurrencyFromStorage())

      const { data: categoriesData } = await supabase.from("categories").select("id, name").order("name")
      setCategories((categoriesData || []) as Category[])

      const { data: productsData } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .order("created_at", { ascending: false })

      setProducts((productsData as ProductWithImages[]) || [])
      setFilteredProducts((productsData as ProductWithImages[]) || [])

      // Calculate price range
      if (productsData && productsData.length > 0) {
        const prices = productsData
          .map((p) => p.price_usd || 0)
          .filter((p) => p > 0)
          .sort((a, b) => a - b)
        const minPrice = prices[0] || 0
        const maxPrice = prices[prices.length - 1] || 1000
        setPriceRange({ min: minPrice, max: maxPrice })
        setSelectedPriceRange({ min: minPrice, max: maxPrice })
      }
      setLoading(false)
    }

    fetchData()

    const handleStorageChange = () => {
      setCurrency(getCurrencyFromStorage())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [supabase])

  useEffect(() => {
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category_id || ""))
    }

    // Filter by price
    filtered = filtered.filter((product) => {
      const price = product.price_usd || 0
      return price >= selectedPriceRange.min && price <= selectedPriceRange.max
    })

    setFilteredProducts(filtered)
  }, [searchQuery, products, selectedCategories, selectedPriceRange])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories((prev) => (checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)))
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    setSelectedPriceRange({ min, max })
  }

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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Search Products</h1>
          <Input
            type="text"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProductFilters
                categories={categories}
                priceRange={priceRange}
                selectedCategories={selectedCategories}
                selectedPriceRange={selectedPriceRange}
                currency={currency}
                onCategoryChange={handleCategoryChange}
                onPriceRangeChange={handlePriceRangeChange}
              />
            </div>

            {/* Products grid */}
            <div className="lg:col-span-3">
              {filteredProducts.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No products found</CardTitle>
                    <CardDescription>
                      {searchQuery ? "Try adjusting your search terms or filters" : "No products available yet"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
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
          </div>
        )}
      </div>
    </main>
  )
}
