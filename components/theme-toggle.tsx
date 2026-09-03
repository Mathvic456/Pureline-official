"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleThemeChange = () => {
    setIsSwitching(true)
    document.documentElement.classList.add("theme-transition")
    setTheme(theme === "light" ? "dark" : "light")

    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
      setIsSwitching(false)
    }, 700)
  }

  return (
    <button
      onClick={handleThemeChange}
      className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 w-10 h-10 flex items-center justify-center border border-border bg-background/90 backdrop-blur hover:bg-secondary transition-colors"
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon size={18} className={isSwitching ? "animate-theme-switch" : ""} />
      ) : (
        <Sun size={18} className={isSwitching ? "animate-theme-switch" : ""} />
      )}
    </button>
  )
}
