"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import type { CartItem, Product } from "@/lib/products"
import { createCheckoutSession } from "@/app/actions/checkout"
import { formatPrice, type Currency, getCurrencyFromStorage, getPriceForCurrency } from "@/lib/currency"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUserAddresses, addUserAddress } from "@/app/actions/user-profile"

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<(CartItem & { product?: Product })[]>([])
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [email, setEmail] = useState("")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [error, setError] = useState<string | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    streetAddress: "",
    city: "",
    country: "",
    postalCode: "",
  })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        router.push("/auth/login")
        return
      }

      setUser(data.user)
      setEmail(data.user.email || "")
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

      const userAddresses = await getUserAddresses()
      setAddresses(userAddresses)
      const defaultAddress = userAddresses.find((a) => a.is_default)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id)
      }

      setLoading(false)
    }

    fetchData()

    const handleStorageChange = () => {
      setCurrency(getCurrencyFromStorage())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [supabase, router])

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = getPriceForCurrency(item.products || {}, currency) || 0
    return sum + price * item.quantity
  }, 0)

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await addUserAddress(newAddress.streetAddress, newAddress.city, newAddress.country, newAddress.postalCode, true)
      const updatedAddresses = await getUserAddresses()
      setAddresses(updatedAddresses)
      setNewAddress({ streetAddress: "", city: "", country: "", postalCode: "" })
      setShowAddressForm(false)

      const newDefault = updatedAddresses.find((a) => a.is_default)
      if (newDefault) {
        setSelectedAddressId(newDefault.id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add address")
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user || cartItems.length === 0) {
      setError("Cart is empty or user not authenticated")
      return
    }

    if (!email) {
      setError("Please enter a valid email address")
      return
    }

    if (!selectedAddressId) {
      setError("Please select or add a delivery address")
      return
    }

    setProcessing(true)

    try {
      const result = await createCheckoutSession(cartItems, email, user.id, currency)

      if (!result.success) {
        setError(result.error || "Checkout failed. Please try again.")
        setProcessing(false)
        return
      }

      if (result.sessionUrl) {
        window.location.href = result.sessionUrl
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      console.error("Checkout error:", err)
      setError(errorMessage)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Loading checkout...</p>
        </div>
      </main>
    )
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Your cart is empty</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/cart")}>Back to Cart</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-12">Checkout</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => {
                  const price = getPriceForCurrency(item.products || {}, currency) || 0
                  return (
                    <div key={item.id} className="flex justify-between pb-4 border-b border-border">
                      <div>
                        <p className="font-semibold">{item.products?.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(price * item.quantity, currency)}</p>
                    </div>
                  )
                })}
                <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount, currency)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Address Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 && (
                  <div className="space-y-2">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className="flex items-start gap-3 p-4 border border-border rounded cursor-pointer hover:bg-accent"
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{address.street_address}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.country} {address.postal_code}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {showAddressForm ? (
                  <form onSubmit={handleAddAddress} className="space-y-4 p-4 border border-border rounded">
                    <div className="grid gap-2">
                      <Label htmlFor="newStreet">Street Address</Label>
                      <Input
                        id="newStreet"
                        value={newAddress.streetAddress}
                        onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="newCity">City</Label>
                        <Input
                          id="newCity"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="newCountry">Country</Label>
                        <Input
                          id="newCountry"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPostal">Postal Code</Label>
                      <Input
                        id="newPostal"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">
                        Add Address
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowAddressForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button variant="outline" onClick={() => setShowAddressForm(true)}>
                    Add New Address
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Billing Info */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Button */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">{formatPrice(totalAmount, currency)}</div>
                <Button onClick={handleCheckout} className="w-full" disabled={processing || !selectedAddressId}>
                  {processing ? "Processing..." : "Proceed to Payment"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
