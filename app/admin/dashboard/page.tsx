"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          supabase.from("products").select("id", { count: "exact" }),
          supabase.from("orders").select("id, total_amount, status", { count: "exact" }),
        ])

        const totalProducts = productsRes.count || 0
        const orders = ordersRes.data || []
        const totalOrders = ordersRes.count || 0
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
        const pendingOrders = orders.filter((order) => order.status === "pending").length

        setStats({
          totalProducts,
          totalOrders,
          totalRevenue,
          pendingOrders,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard</p>
      </div>

      {loading ? (
        <p>Loading statistics...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
              <CardDescription>Products in catalog</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
              <CardDescription>All time orders</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${(stats.totalRevenue / 100).toFixed(2)}</p>
              <CardDescription>From all orders</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
              <CardDescription>Awaiting completion</CardDescription>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
