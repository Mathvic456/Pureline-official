export type Currency = "USD" | "GBP" | "NGN"

export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  GBP: "£",
  NGN: "₦",
}

export function formatPrice(amount: number, currency: Currency): string {
  const symbol = currencySymbols[currency]
  if (currency === "NGN") {
    return `${symbol}${(amount / 100).toLocaleString()}`
  }
  return `${symbol}${(amount / 100).toFixed(2)}`
}

export function getCurrencyFromStorage(): Currency {
  if (typeof window === "undefined") return "USD"
  const stored = localStorage.getItem("currency")
  return (stored as Currency) || "USD"
}

export function getPriceForCurrency(product: any, currency: Currency): number {
  if (!product) return 0
  const key = `price_${currency.toLowerCase()}` as keyof typeof product
  return product[key] || product.price || 0
}
