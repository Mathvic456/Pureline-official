import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import ClientShell from "@/components/ClientShell"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Pureline Designs | Premium Interior Design Services | Renovation | Space Planning",
  description: "Transform your space with Pureline Designs. We create sophisticated, timeless interiors that reflect your personal style and elevate your lifestyle.",
  keywords: ["interior design", "luxury interiors", "home design", "commercial design", "interior decorator", "residential design"],
  authors: [{ name: "Pureline Designs" }],
  openGraph: {
    title: "Pureline Designs | Premium Interior Design Services",
    description: "Transform your space with premium interior design services",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ClientShell>
            {children}
          </ClientShell>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
