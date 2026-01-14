"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [currency, setCurrency] = useState<"USD" | "GBP" | "NGN">("USD")
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)

      if (data?.user) {
        const { count } = await supabase.from("cart_items").select("*", { count: "exact" }).eq("user_id", data.user.id)
        setCartCount(count || 0)
      }
    }

    const savedCurrency = localStorage.getItem("currency") as "USD" | "GBP" | "NGN" | null
    if (savedCurrency) {
      setCurrency(savedCurrency)
    }

    checkUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  const handleCurrencyChange = (newCurrency: "USD" | "GBP" | "NGN") => {
    setCurrency(newCurrency)
    localStorage.setItem("currency", newCurrency)
  }

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-foreground">
            APEX
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="hover:text-muted-foreground transition">
              Home
            </Link>
            <Link href="/search" className="hover:text-muted-foreground transition">
              Search
            </Link>
            <Link href="/categories" className="hover:text-muted-foreground transition">
              Categories
            </Link>

            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value as "USD" | "GBP" | "NGN")}
              className="px-3 py-1 border border-border rounded bg-background text-foreground cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="NGN">NGN (₦)</option>
            </select>

            {user ? (
              <>
                <Link href="/account" className="flex items-center gap-2 hover:text-muted-foreground transition">
                  <User size={20} />
                  Account
                </Link>
                <Link href="/cart" className="relative hover:text-muted-foreground transition">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut size={18} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/cart" className="relative hover:text-muted-foreground transition">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Button asChild size="sm">
                  <Link href="/auth/login">Login</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative hover:text-muted-foreground transition">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border flex flex-col gap-4 pt-4">
            <Link href="/" className="hover:text-muted-foreground transition">
              Home
            </Link>
            <Link href="/search" className="hover:text-muted-foreground transition">
              Search
            </Link>
            <Link href="/categories" className="hover:text-muted-foreground transition">
              Categories
            </Link>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value as "USD" | "GBP" | "NGN")}
              className="px-3 py-1 border border-border rounded bg-background text-foreground cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="NGN">NGN (₦)</option>
            </select>
            {user ? (
              <>
                <Link href="/account" className="hover:text-muted-foreground transition">
                  Account
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
