"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { CartItem, Product } from "@/lib/products"
import { Trash2, Minus, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { formatPrice, type Currency, getCurrencyFromStorage, getPriceForCurrency } from "@/lib/currency"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<(CartItem & { product?: Product })[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState<Currency>("USD")
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchCart = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        router.push("/auth/login")
        return
      }

      setUser(data.user)
      setCurrency(getCurrencyFromStorage())

      const { data: items } = await supabase
        .from("cart_items")
        .select(
          `
          id,
          user_id,
          product_id,
          quantity,
          created_at,
          updated_at,
          products:product_id (*)
        `,
        )
        .eq("user_id", data.user.id)

      setCartItems(items || [])
      setLoading(false)
    }

    fetchCart()

    const handleStorageChange = () => {
      setCurrency(getCurrencyFromStorage())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [supabase, router])

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await supabase.from("cart_items").delete().eq("id", cartItemId)
    } else {
      await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", cartItemId)
    }

    const updated = cartItems
      .map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
      .filter((item) => item.quantity > 0)
    setCartItems(updated)
  }

  const handleRemoveItem = async (cartItemId: string) => {
    await supabase.from("cart_items").delete().eq("id", cartItemId)
    setCartItems(cartItems.filter((item) => item.id !== cartItemId))
  }

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = getPriceForCurrency(item.products || {}, currency) || 0
    return sum + price * item.quantity
  }, 0)

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Loading cart...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-12">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your cart is empty</CardTitle>
              <CardDescription>Start shopping to add items to your cart</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/search">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const price = getPriceForCurrency(item.products || {}, currency) || 0
                return (
                  <div
                    key={item.id}
                    className="border border-border rounded-lg p-6 flex gap-6 hover:shadow-lg transition"
                  >
                    {item.products?.imageUrl && (
                      <div className="w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.products.imageUrl || "/placeholder.svg"}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.products?.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{formatPrice(price, currency)} each</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border border-border rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatPrice(price * item.quantity, currency)}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(totalAmount, currency)}</span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
