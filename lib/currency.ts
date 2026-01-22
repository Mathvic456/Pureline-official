export type Currency = "USD" | "GBP" | "EUR"

export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
}

export function formatPrice(amount: number, currency: Currency): string {
  const symbol = currencySymbols[currency]
  return `${symbol}${(amount / 100).toFixed(2)}`
}

export function getCurrencyFromStorage(): Currency {
  if (typeof window === "undefined") return "USD"
  const stored = localStorage.getItem("currency")
  if (stored === "NGN") {
    localStorage.setItem("currency", "USD")
    return "USD"
  }
  return (stored as Currency) || "USD"
}

export function getPriceForCurrency(product: any, currency: Currency): number {
  if (!product) return 0
  const key = `price_${currency.toLowerCase()}` as keyof typeof product
  return product[key] || product.price || 0
}
