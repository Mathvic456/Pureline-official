import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { CategoriesCarousel } from "@/components/categories-carousel"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data } = await supabase.from("products").select("*, product_images(image_url)").limit(6)
  return data || []
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Theme Toggle */}
      <div className="fixed bottom-8 right-8 z-40">
        <ThemeToggle />
      </div>

      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video autoPlay muted loop className="w-full h-full object-cover" poster="/premium-background.jpg">
            <source
              src="https://videos.pexels.com/video-files/4534313/4534313-uhd_2560_1440_24fps.mp4"
              type="video/mp4"
            />
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white text-balance">
            Discover Excellence
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto text-balance">
            Curated products that combine premium quality with timeless design
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <Link href="/search" className="flex items-center gap-2">
                Explore Now
                <ArrowRight size={20} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/categories">View Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">Shop by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Explore our carefully curated collections
            </p>
          </div>
          <CategoriesCarousel />
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Hand-picked selections from our premium collection
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const firstImage = product.product_images?.[0]?.image_url || "/placeholder.svg"
              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group cursor-pointer">
                  <div className="relative h-80 bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={firstImage || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold group-hover:text-muted-foreground transition">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold">
                        ${product.price_usd ? (product.price_usd / 100).toFixed(2) : "0.00"}
                      </span>
                      <span className="text-primary">View</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">About APEX</h2>
              <p className="text-lg text-muted-foreground text-balance">
                We believe that exceptional design and quality craftsmanship should be accessible to everyone. Our
                mission is to curate and deliver the finest products that elevate your lifestyle.
              </p>
              <p className="text-lg text-muted-foreground text-balance">
                Every product in our collection is carefully selected for its quality, design, and durability. We
                partner with trusted artisans and manufacturers who share our commitment to excellence.
              </p>
              <Button asChild size="lg">
                <Link href="/search">Start Shopping</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary rounded-lg p-8 space-y-4">
                <h3 className="text-2xl font-bold">Premium</h3>
                <p className="text-muted-foreground">Hand-selected products of exceptional quality</p>
              </div>
              <div className="bg-secondary rounded-lg p-8 space-y-4">
                <h3 className="text-2xl font-bold">Global</h3>
                <p className="text-muted-foreground">Curated from artisans and makers worldwide</p>
              </div>
              <div className="bg-secondary rounded-lg p-8 space-y-4">
                <h3 className="text-2xl font-bold">Secure</h3>
                <p className="text-muted-foreground">Safe checkout with Stripe payment processing</p>
              </div>
              <div className="bg-secondary rounded-lg p-8 space-y-4">
                <h3 className="text-2xl font-bold">Support</h3>
                <p className="text-muted-foreground">Dedicated customer service & support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">What We Offer</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Experience a new standard of online shopping
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Curated Selection</h3>
              <p className="text-muted-foreground">
                Our team meticulously selects each product to ensure it meets our high standards for quality and design.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Multi-Currency</h3>
              <p className="text-muted-foreground">
                Shop in your preferred currency with support for USD, GBP, and EUR. Real-time currency conversion
                available.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Secure Payment</h3>
              <p className="text-muted-foreground">
                Industry-leading security with Stripe payment processing. Your data is always safe and protected.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Category Discovery</h3>
              <p className="text-muted-foreground">
                Browse by carefully organized categories to find exactly what you're looking for.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">User Accounts</h3>
              <p className="text-muted-foreground">
                Create an account to track orders, manage your cart, and enjoy a personalized shopping experience.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Premium Support</h3>
              <p className="text-muted-foreground">
                Our dedicated support team is here to help with any questions or concerns about your purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 text-lg">APEX</h4>
              <p className="text-sm text-muted-foreground">Premium ecommerce for discerning customers.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-sm">Shop</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/search" className="hover:text-foreground transition">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-foreground transition">
                    Categories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-sm">Account</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-foreground transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-foreground transition">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-sm">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 APEX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
