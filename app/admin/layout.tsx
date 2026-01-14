"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAdmin = async () => {
      if (pathname === "/admin/login" || pathname === "/admin/unauthorized" || pathname === "/admin/signup") {
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        router.push("/admin/login")
        return
      }

      const { data: adminUser, error: queryError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle()

      if (queryError) {
        console.log("[v0] Admin check error:", queryError)
        router.push("/admin/unauthorized")
        return
      }

      if (!adminUser) {
        router.push("/admin/unauthorized")
        return
      }

      setUser(data.user)
      setIsAdmin(true)
      setLoading(false)
    }

    checkAdmin()
  }, [supabase, router, pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (pathname === "/admin/login" || pathname === "/admin/unauthorized" || pathname === "/admin/signup") {
    return children
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>
  }

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/payments", label: "Payments" },
  ]

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:block w-64 border-r border-border bg-secondary p-6`}>
        <h1 className="text-2xl font-bold mb-8">APEX Admin</h1>
        <nav className="space-y-2">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded transition ${
                pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border pt-4">
          <Button variant="ghost" className="w-full justify-start flex items-center gap-2" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-border p-4 flex justify-between items-center md:hidden bg-secondary">
          <h1 className="text-xl font-bold">APEX Admin</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  )
}
