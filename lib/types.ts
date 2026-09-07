// Shared TypeScript types for the Roamly marketplace clone.

export type ListingType = 'Home' | 'Apartment' | 'Villa' | 'Cabin' | string

export interface Listing {
  id: string
  title: string
  location: string
  region?: string
  country?: string
  price: number
  rating: number
  reviews: number
  type: ListingType
  guests: number
  bedrooms: number
  beds: number
  baths: number
  host?: string
  hostId?: string
  hostInitials?: string
  hostColor?: string
  badge?: string
  description?: string
  amenities: string[]
  images: string[]
}

export interface Booking {
  id: string
  listingId: string
  listingTitle: string
  listingImage?: string
  location?: string
  guestId: string
  guestName?: string
  startDate: string
  endDate: string
  guests: number
  nights: number
  subtotal: number
  total: number
  status: string
}

export interface HostForm {
  title: string
  location: string
  price: string | number
  type: string
  guests: string | number
  bedrooms: string | number
  description: string
  image: string
}

export interface HostBundle {
  listings: Listing[]
  bookings: Booking[]
}

export interface ReservationPayload {
  listingId: string
  startDate: string
  endDate: string
  guests: number
  guestId: string
  guestName?: string
}
