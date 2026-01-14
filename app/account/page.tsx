"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Order } from "@/lib/products"
import { getUserProfile, getUserAddresses } from "@/app/actions/user-profile"
import { ProfileEditor } from "@/components/user/profile-editor"
import { AddressManager } from "@/components/user/address-manager"

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders")
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

      const profileData = await getUserProfile()
      setProfile(profileData)

      const addressesData = await getUserAddresses()
      setAddresses(addressesData)

      const { data: ordersData } = await supabase
        .from("orders")
        .select(
          `
          id,
          user_id,
          order_number,
          total_amount,
          status,
          stripe_payment_id,
          created_at,
          updated_at,
          order_items (*)
        `,
        )
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false })

      setOrders(ordersData || [])
      setLoading(false)
    }

    fetchData()
  }, [supabase, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Loading account...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {["orders", "profile", "addresses"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Order History</h2>

            {orders.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No orders yet</CardTitle>
                  <CardDescription>Start shopping to see your orders here</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/search" className="text-primary hover:underline">
                    Continue shopping
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order {order.order_number}</CardTitle>
                          <CardDescription>{new Date(order.created_at).toLocaleDateString()}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-lg font-semibold">Total: ${(order.total_amount / 100).toFixed(2)}</div>
                      {order.items && order.items.length > 0 && (
                        <div className="border-t border-border pt-4">
                          <h4 className="font-semibold mb-2">Items:</h4>
                          <ul className="space-y-2">
                            {order.items.map((item) => (
                              <li key={item.id} className="text-sm text-muted-foreground">
                                Quantity: {item.quantity} × ${(item.price / 100).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && <ProfileEditor initialProfile={profile} onUpdate={() => setProfile} />}

        {/* Addresses Tab */}
        {activeTab === "addresses" && <AddressManager addresses={addresses} onUpdate={() => setAddresses} />}
      </div>
    </main>
  )
}
