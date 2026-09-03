"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, Phone, Mail } from "lucide-react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()
  const lastY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const scrollDelta = y - lastY.current

      if (y <= 20) {
        setIsVisible(true)
        setIsScrolled(false)
      } else if (scrollDelta > 4) {
        setIsVisible(false)
        setIsScrolled(true)
      } else if (scrollDelta < -4) {
        setIsVisible(true)
        setIsScrolled(true)
      }

      lastY.current = y
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isHomePage = pathname === "/"

  return (
    <header className={`sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Top Bar */}
      {/* <div className="bg-foreground text-background py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+234 81653994444567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Purelinedesignss@gmail.com</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Navigation */}
      <nav className={`transition-colors duration-300 ${isScrolled || !isHomePage ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="font-serif text-2xl font-bold">
                Pureline Designs
              </div>
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/"
                className={`text-sm tracking-wider uppercase transition-colors hover:opacity-70 ${
                  pathname === "/" ? "border-b-2 border-foreground pb-1" : ""
                }`}
              >
                Home
              </Link>
              <Link 
                href="/about"
                className={`text-sm tracking-wider uppercase transition-colors hover:opacity-70 ${
                  pathname === "/about" ? "border-b-2 border-foreground pb-1" : ""
                }`}
              >
                About
              </Link>
              <Link 
                href="/services"
                className={`text-sm tracking-wider uppercase transition-colors hover:opacity-70 ${
                  pathname === "/services" ? "border-b-2 border-foreground pb-1" : ""
                }`}
              >
                Services
              </Link>
              <Link 
                href="/portfolio"
                className={`text-sm tracking-wider uppercase transition-colors hover:opacity-70 ${
                  pathname === "/portfolio" ? "border-b-2 border-foreground pb-1" : ""
                }`}
              >
                Portfolio
              </Link>
              <Link 
                href="/contact"
                className={`text-sm tracking-wider uppercase transition-colors hover:opacity-70 ${
                  pathname === "/contact" ? "border-b-2 border-foreground pb-1" : ""
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Contact Button & Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/contact"
                className="hidden sm:inline-block px-6 py-2 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
              >
                Get Quote
              </Link>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-4 space-y-4">
                <Link 
                  href="/"
                  className={`block text-sm tracking-wider uppercase py-2 transition-colors hover:opacity-70 ${
                    pathname === "/" ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/about"
                  className={`block text-sm tracking-wider uppercase py-2 transition-colors hover:opacity-70 ${
                    pathname === "/about" ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/services"
                  className={`block text-sm tracking-wider uppercase py-2 transition-colors hover:opacity-70 ${
                    pathname === "/services" ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link 
                  href="/portfolio"
                  className={`block text-sm tracking-wider uppercase py-2 transition-colors hover:opacity-70 ${
                    pathname === "/portfolio" ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Portfolio
                </Link>
                <Link 
                  href="/contact"
                  className={`block text-sm tracking-wider uppercase py-2 transition-colors hover:opacity-70 ${
                    pathname === "/contact" ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-4 border-t border-border">
                  <Link 
                    href="/contact"
                    className="block w-full text-center px-6 py-3 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}