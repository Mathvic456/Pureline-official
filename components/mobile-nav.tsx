"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Grid3X3, User, ShoppingBag } from "lucide-react"
import { useState } from "react"

export function MobileNav() {
  const pathname = usePathname()
  const [cartCount] = useState(0)

  const isActive = (path: string) => pathname === path

  // Don't show on admin pages or auth pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
      <div className="flex justify-around items-center h-16">
        <Link 
          href="/" 
          className={`flex flex-col items-center gap-1 p-2 transition-opacity ${
            isActive("/") ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
        >
          <Home size={20} />
          <span className="text-[10px] uppercase tracking-wider">Home</span>
        </Link>

        <Link 
          href="/search" 
          className={`flex flex-col items-center gap-1 p-2 transition-opacity ${
            isActive("/search") ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
        >
          <Search size={20} />
          <span className="text-[10px] uppercase tracking-wider">Search</span>
        </Link>

        <Link 
          href="/portfolio" 
          className={`flex flex-col items-center gap-1 p-2 transition-opacity ${
            isActive("/portfolio") ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
        >
          <Grid3X3 size={20} />
          <span className="text-[10px] uppercase tracking-wider">Portfolio</span>
        </Link>

        <Link 
          href="/cart" 
          className={`flex flex-col items-center gap-1 p-2 transition-opacity relative ${
            isActive("/cart") ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
        >
          <ShoppingBag size={20} />
          <span className="text-[10px] uppercase tracking-wider">Inquiries</span>
        </Link>

        <Link 
          href="/account" 
          className={`flex flex-col items-center gap-1 p-2 transition-opacity ${
            isActive("/account") ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
        >
          <User size={20} />
          <span className="text-[10px] uppercase tracking-wider">Account</span>
        </Link>
      </div>
    </nav>
  )
}
