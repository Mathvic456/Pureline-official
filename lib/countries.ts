export interface CountryData {
  name: string
  code: string
  dialCode: string
  phoneLength: number | [number, number] // exact or range [min, max]
  postalCodeFormat?: string
  postalCodePlaceholder?: string
}

export const countries: CountryData[] = [
  { name: "United States", code: "US", dialCode: "+1", phoneLength: 10, postalCodeFormat: "^\\d{5}(-\\d{4})?$", postalCodePlaceholder: "12345" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", phoneLength: 10, postalCodeFormat: "^[A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}$", postalCodePlaceholder: "SW1A 1AA" },
  { name: "Canada", code: "CA", dialCode: "+1", phoneLength: 10, postalCodeFormat: "^[A-Z]\\d[A-Z] ?\\d[A-Z]\\d$", postalCodePlaceholder: "K1A 0B1" },
  { name: "Australia", code: "AU", dialCode: "+61", phoneLength: 9, postalCodeFormat: "^\\d{4}$", postalCodePlaceholder: "2000" },
  { name: "Germany", code: "DE", dialCode: "+49", phoneLength: [10, 11], postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "10115" },
  { name: "France", code: "FR", dialCode: "+33", phoneLength: 9, postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "75001" },
  { name: "Italy", code: "IT", dialCode: "+39", phoneLength: [9, 10], postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "00100" },
  { name: "Spain", code: "ES", dialCode: "+34", phoneLength: 9, postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "28001" },
  { name: "Netherlands", code: "NL", dialCode: "+31", phoneLength: 9, postalCodeFormat: "^\\d{4} ?[A-Z]{2}$", postalCodePlaceholder: "1012 AB" },
  { name: "Belgium", code: "BE", dialCode: "+32", phoneLength: 9, postalCodeFormat: "^\\d{4}$", postalCodePlaceholder: "1000" },
  { name: "Switzerland", code: "CH", dialCode: "+41", phoneLength: 9, postalCodeFormat: "^\\d{4}$", postalCodePlaceholder: "8001" },
  { name: "Austria", code: "AT", dialCode: "+43", phoneLength: [10, 11], postalCodeFormat: "^\\d{4}$", postalCodePlaceholder: "1010" },
  { name: "Sweden", code: "SE", dialCode: "+46", phoneLength: 9, postalCodeFormat: "^\\d{3} ?\\d{2}$", postalCodePlaceholder: "111 22" },
  { name: "Norway", code: "NO", dialCode: "+47", phoneLength: 8, postalCodeFormat: "^\\d{4}$", postalCodePlaceholder: "0150" },
  { name: "Denmark", code: "DK", dialCode: "+45", phoneLength: 8, postalCodeFormat: "^\\d{4}$", postalCodePlaceholder: "1000" },
  { name: "Finland", code: "FI", dialCode: "+358", phoneLength: [9, 10], postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "00100" },
  { name: "Ireland", code: "IE", dialCode: "+353", phoneLength: 9, postalCodeFormat: "^[A-Z]\\d{2} ?[A-Z\\d]{4}$", postalCodePlaceholder: "D02 AF30" },
  { name: "Portugal", code: "PT", dialCode: "+351", phoneLength: 9, postalCodeFormat: "^\\d{4}-\\d{3}$", postalCodePlaceholder: "1000-001" },
  { name: "Poland", code: "PL", dialCode: "+48", phoneLength: 9, postalCodeFormat: "^\\d{2}-\\d{3}$", postalCodePlaceholder: "00-001" },
  { name: "Czech Republic", code: "CZ", dialCode: "+420", phoneLength: 9, postalCodeFormat: "^\\d{3} ?\\d{2}$", postalCodePlaceholder: "100 00" },
  { name: "Greece", code: "GR", dialCode: "+30", phoneLength: 10, postalCodeFormat: "^\\d{3} ?\\d{2}$", postalCodePlaceholder: "104 31" },
  { name: "Japan", code: "JP", dialCode: "+81", phoneLength: 10, postalCodeFormat: "^\\d{3}-\\d{4}$", postalCodePlaceholder: "100-0001" },
  { name: "South Korea", code: "KR", dialCode: "+82", phoneLength: [9, 10], postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "03051" },
  { name: "China", code: "CN", dialCode: "+86", phoneLength: 11, postalCodeFormat: "^\\d{6}$", postalCodePlaceholder: "100000" },
  { name: "India", code: "IN", dialCode: "+91", phoneLength: 10, postalCodeFormat: "^\\d{6}$", postalCodePlaceholder: "110001" },
  { name: "Singapore", code: "SG", dialCode: "+65", phoneLength: 8, postalCodeFormat: "^\\d{6}$", postalCodePlaceholder: "018956" },
  { name: "Hong Kong", code: "HK", dialCode: "+852", phoneLength: 8 },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", phoneLength: 9 },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", phoneLength: 9, postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "11564" },
  { name: "Israel", code: "IL", dialCode: "+972", phoneLength: 9, postalCodeFormat: "^\\d{7}$", postalCodePlaceholder: "1234567" },
  { name: "South Africa", code: "ZA", dialCode: "+27", phoneLength: 9, postalCodeFormat: "^\\d{4}$", postalCodePlaceholder: "0001" },
  { name: "Nigeria", code: "NG", dialCode: "+234", phoneLength: 10, postalCodeFormat: "^\\d{6}$", postalCodePlaceholder: "100001" },
  { name: "Kenya", code: "KE", dialCode: "+254", phoneLength: 9, postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "00100" },
  { name: "Egypt", code: "EG", dialCode: "+20", phoneLength: 10, postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "11511" },
  { name: "Brazil", code: "BR", dialCode: "+55", phoneLength: [10, 11], postalCodeFormat: "^\\d{5}-\\d{3}$", postalCodePlaceholder: "01310-100" },
  { name: "Mexico", code: "MX", dialCode: "+52", phoneLength: 10, postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "06600" },
  { name: "Argentina", code: "AR", dialCode: "+54", phoneLength: 10, postalCodeFormat: "^[A-Z]\\d{4}[A-Z]{3}$", postalCodePlaceholder: "C1425ABC" },
  { name: "Chile", code: "CL", dialCode: "+56", phoneLength: 9, postalCodeFormat: "^\\d{7}$", postalCodePlaceholder: "8320000" },
  { name: "Colombia", code: "CO", dialCode: "+57", phoneLength: 10, postalCodeFormat: "^\\d{6}$", postalCodePlaceholder: "110111" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", phoneLength: 9, postalCodeFormat: "^\\d{4}$", postalCodePlaceholder: "1010" },
  { name: "Philippines", code: "PH", dialCode: "+63", phoneLength: 10, postalCodeFormat: "^\\d{4}$", postalCodePlaceholder: "1000" },
  { name: "Thailand", code: "TH", dialCode: "+66", phoneLength: 9, postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "10100" },
  { name: "Malaysia", code: "MY", dialCode: "+60", phoneLength: [9, 10], postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "50000" },
  { name: "Indonesia", code: "ID", dialCode: "+62", phoneLength: [10, 12], postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "10110" },
  { name: "Vietnam", code: "VN", dialCode: "+84", phoneLength: 9, postalCodeFormat: "^\\d{6}$", postalCodePlaceholder: "100000" },
  { name: "Turkey", code: "TR", dialCode: "+90", phoneLength: 10, postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "34000" },
  { name: "Russia", code: "RU", dialCode: "+7", phoneLength: 10, postalCodeFormat: "^\\d{6}$", postalCodePlaceholder: "101000" },
  { name: "Ukraine", code: "UA", dialCode: "+380", phoneLength: 9, postalCodeFormat: "^\\d{5}$", postalCodePlaceholder: "01001" },
  { name: "Romania", code: "RO", dialCode: "+40", phoneLength: 9, postalCodeFormat: "^\\d{6}$", postalCodePlaceholder: "010011" },
  { name: "Hungary", code: "HU", dialCode: "+36", phoneLength: 9, postalCodeFormat: "^\\d{4}$", postalCodePlaceholder: "1011" },
]

export function getCountryByCode(code: string): CountryData | undefined {
  return countries.find(c => c.code === code)
}

export function getCountryByName(name: string): CountryData | undefined {
  return countries.find(c => c.name.toLowerCase() === name.toLowerCase())
}

export function validatePhoneForCountry(phone: string, countryCode: string): string | null {
  const country = getCountryByCode(countryCode)
  if (!country) return null
  
  // Remove all non-digit characters for length check
  const digitsOnly = phone.replace(/\D/g, "")
  
  if (Array.isArray(country.phoneLength)) {
    const [min, max] = country.phoneLength
    if (digitsOnly.length < min) {
      return `Phone number must be at least ${min} digits for ${country.name}`
    }
    if (digitsOnly.length > max) {
      return `Phone number must be at most ${max} digits for ${country.name}`
    }
  } else {
    if (digitsOnly.length !== country.phoneLength) {
      return `Phone number must be ${country.phoneLength} digits for ${country.name}`
    }
  }
  
  return null
}

export function formatPhoneWithCountryCode(phone: string, dialCode: string): string {
  const digitsOnly = phone.replace(/\D/g, "")
  return `${dialCode}${digitsOnly}`
}
