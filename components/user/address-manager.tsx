"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addUserAddress, deleteUserAddress, updateUserAddress } from "@/app/actions/user-profile"
import { countries, type CountryData, getCountryByName } from "@/lib/countries"
import { CountryFlagSelector } from "@/components/country-flag-selector"

export function AddressManager({ addresses, onUpdate }: { addresses: any[]; onUpdate?: (addresses: any[]) => void }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)

  const [formData, setFormData] = useState({
    streetAddress: "",
    city: "",
    postalCode: "",
    isDefault: false,
  })

  // Update postal code when country changes
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode)
    setSelectedCountry(country || null)
    // Set postal code placeholder as the default value
    if (country?.postalCodePlaceholder) {
      setFormData(prev => ({ ...prev, postalCode: country.postalCodePlaceholder || "" }))
    }
  }

  const resetForm = () => {
    setFormData({
      streetAddress: "",
      city: "",
      postalCode: "",
      isDefault: false,
    })
    setSelectedCountry(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!selectedCountry) {
      setMessage({ type: "error", text: "Please select a country" })
      return
    }

    setIsLoading(true)

    try {
      if (editingId) {
        await updateUserAddress(
          editingId,
          formData.streetAddress,
          formData.city,
          selectedCountry.name,
          formData.postalCode,
          formData.isDefault,
        )
        setMessage({ type: "success", text: "Address updated successfully!" })
      } else {
        await addUserAddress(
          formData.streetAddress,
          formData.city,
          selectedCountry.name,
          formData.postalCode,
          formData.isDefault,
        )
        setMessage({ type: "success", text: "Address added successfully!" })
      }
      onUpdate?.(addresses)
      resetForm()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save address",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    setIsLoading(true)
    try {
      await deleteUserAddress(id)
      setMessage({ type: "success", text: "Address deleted successfully!" })
      onUpdate?.()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to delete address",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{address.street_address}</CardTitle>
                  <CardDescription>
                    {address.city}, {address.country} {address.postal_code}
                  </CardDescription>
                </div>
                {address.is_default && (
                  <span className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => {
                    // Find the country by name and set it
                    const country = getCountryByName(address.country)
                    setSelectedCountry(country || null)
                    setFormData({
                      streetAddress: address.street_address,
                      city: address.city,
                      postalCode: address.postal_code || country?.postalCodePlaceholder || "",
                      isDefault: address.is_default,
                    })
                    setEditingId(address.id)
                    setShowForm(true)
                  }}
                >
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(address.id)} disabled={isLoading}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Address" : "Add New Address"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <div className="flex items-center h-10 border border-input rounded-md overflow-hidden">
                  <CountryFlagSelector
                    countries={countries}
                    selectedCountry={selectedCountry}
                    onSelect={handleCountryChange}
                    required
                  />
                  <span className="flex-1 px-3 text-sm">
                    {selectedCountry?.name || "Select a country"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    readOnly
                    disabled
                    className="bg-muted"
                    placeholder={selectedCountry?.postalCodePlaceholder || "Select country first"}
                  />
                  <p className="text-xs text-muted-foreground">Auto-filled based on country</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isDefault" className="font-normal">
                  Set as default address
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Address"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!showForm && <Button onClick={() => setShowForm(true)}>Add New Address</Button>}
    </div>
  )
}
