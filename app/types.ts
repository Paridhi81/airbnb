export type Listing = {
  id: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  type: string
  guests: number
  bedrooms: number
  beds: number
  baths: number
  host?: string
  hostId?: string
  description?: string
  amenities: string[]
  images: string[]
}

export type Booking = {
  id: string
  listingId: string
  listingTitle: string
  listingImage?: string
  location?: string
  guestId: string
  startDate: string
  endDate: string
  guests: number
  nights: number
  subtotal: number
  total: number
  status: string
}