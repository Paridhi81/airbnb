'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Map, Search, SlidersHorizontal } from 'lucide-react'

import Header from '@/components/roamly/Header'
import CategoryRow from '@/components/roamly/CategoryRow'
import ListingCard from '@/components/roamly/ListingCard'
import ListingDetail from '@/components/roamly/ListingDetail'
import SearchPanel from '@/components/roamly/SearchPanel'
import FilterPanel from '@/components/roamly/FilterPanel'
import TripsModal from '@/components/roamly/TripsModal'
import HostModal from '@/components/roamly/HostModal'
import CheckoutModal from '@/components/roamly/CheckoutModal'
import MenuModal from '@/components/roamly/MenuModal'
import ComingSoonModal from '@/components/roamly/ComingSoonModal'
import MapPanel from '@/components/roamly/MapPanel'
import Toast from '@/components/roamly/Toast'

import type { Booking, HostBundle, HostForm, Listing } from '@/lib/types'
import { nightsBetween, normalizeListing } from '@/lib/format'
import { CURATED_IMAGES, FALLBACK_LISTINGS, enrichListing } from '@/lib/data'
import { DEFAULT_FILTERS, countActiveFilters, listingMatches, type Filters } from '@/lib/filters'

const DEMO_GUEST_ID = 'guest-demo'
const DEMO_GUEST_NAME = 'Alex Morgan'
const DEMO_HOST_ID = 'host-demo'

const createEmptyHostForm = (): HostForm => ({
  title: '',
  location: '',
  price: '',
  type: 'Home',
  guests: 2,
  bedrooms: 1,
  description: '',
  image: CURATED_IMAGES[0],
})

const App = () => {
  const [listings, setListings] = useState<Listing[]>(FALLBACK_LISTINGS)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [query, setQuery] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<string>('All stays')
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS })
  const [guests, setGuests] = useState<number>(0)

  const [showSearchPanel, setShowSearchPanel] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showTrips, setShowTrips] = useState(false)
  const [showHost, setShowHost] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [comingSoon, setComingSoon] = useState<string>('')

  const [selected, setSelected] = useState<Listing | null>(null)
  const [liked, setLiked] = useState<string[]>([])
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [detailGuests, setDetailGuests] = useState<number>(1)
  const [toast, setToast] = useState<string>('')

  const [hostListings, setHostListings] = useState<Listing[]>([])
  const [hostBookings, setHostBookings] = useState<Booking[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [hostForm, setHostForm] = useState<HostForm>(createEmptyHostForm())

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  useEffect(() => {
    fetch('/api/listings')
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Listing[]) => {
        if (data?.length) setListings(data.map((item) => enrichListing(normalizeListing(item))))
      })
      .catch(() => notify('Showing our handpicked stays for now'))

    fetch(`/api/bookings?guestId=${DEMO_GUEST_ID}`)
      .then((response) => (response.ok ? response.json() : []))
      .then((data: Booking[]) => setBookings((data || []).map((item) => normalizeListing(item))))
      .catch(() => undefined)
  }, [])

  const filteredListings = useMemo(
    () =>
      listings.filter((listing) => {
        const text = `${listing.title} ${listing.location}`.toLowerCase()
        const matchesQuery = !query || text.includes(query.toLowerCase())
        const matchesCategory =
          activeCategory === 'All stays' ||
          activeCategory === 'Trending' ||
          activeCategory === 'OMG!' ||
          listing.type === activeCategory ||
          listing.badge === activeCategory ||
          listing.amenities.includes(activeCategory)
        return matchesQuery && matchesCategory && listingMatches(listing, filters)
      }),
    [listings, query, filters, activeCategory]
  )

  const activeFilterCount = countActiveFilters(filters)

  const selectedNights = nightsBetween(startDate, endDate)
  const selectedTotal = selected ? Math.round(selectedNights * selected.price * 1.14) : 0

  const openListing = (listing: Listing) => {
    setSelected(listing)
    setStartDate('')
    setEndDate('')
    setDetailGuests(1)
  }

  const toggleLike = (id: string) =>
    setLiked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  const showComingSoon = (label: string) => {
    setShowMenu(false)
    setComingSoon(label)
  }

  const reserve = () => {
    if (!selected) return
    if (!selectedNights) {
      notify('Choose a check-in and check-out date')
      return
    }
    if (detailGuests > selected.guests) {
      notify(`This stay hosts up to ${selected.guests} guests`)
      return
    }
    setShowCheckout(true)
  }

  const confirmBooking = async () => {
    if (!selected) return
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: selected.id,
          startDate,
          endDate,
          guests: detailGuests,
          guestId: DEMO_GUEST_ID,
          guestName: DEMO_GUEST_NAME,
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        notify(data?.error || 'Those dates are unavailable')
        return
      }
      const localFallback: Booking = {
        id: `local-${Date.now()}`,
        listingId: selected.id,
        listingTitle: selected.title,
        listingImage: selected.images?.[0],
        location: selected.location,
        guestId: DEMO_GUEST_ID,
        guestName: DEMO_GUEST_NAME,
        startDate,
        endDate,
        guests: detailGuests,
        nights: selectedNights,
        subtotal: selectedNights * selected.price,
        total: selectedTotal,
        status: 'CONFIRMED',
      }
      const booking: Booking = data ? normalizeListing(data) : localFallback
      setBookings((current) => [booking, ...current])
      setShowCheckout(false)
      setSelected(null)
      setShowTrips(true)
      notify('Your stay is confirmed — enjoy the escape ✨')
    } catch {
      notify('Could not complete the reservation just yet')
    }
  }

  const loadHost = async () => {
    try {
      const response = await fetch(`/api/host/listings?hostId=${DEMO_HOST_ID}`)
      const data = (await response.json()) as HostBundle
      setHostListings((data?.listings || []).map((item) => enrichListing(normalizeListing(item))))
      setHostBookings((data?.bookings || []).map((item) => normalizeListing(item)))
    } catch {
      setHostListings([])
      setHostBookings([])
    }
  }

  const openHost = () => {
    setShowHost(true)
    void loadHost()
  }

  const submitHost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      ...hostForm,
      price: Number(hostForm.price),
      guests: Number(hostForm.guests) || 2,
      bedrooms: Number(hostForm.bedrooms) || 1,
      host: 'You',
      hostId: DEMO_HOST_ID,
      region: hostForm.location,
      images: [hostForm.image || CURATED_IMAGES[0]],
    }
    const response = await fetch(editingId ? `/api/listings/${editingId}` : '/api/listings', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (response.ok) {
      notify(editingId ? 'Listing updated' : 'Listing published')
      setEditingId(null)
      setHostForm(createEmptyHostForm())
      void loadHost()
      fetch('/api/listings')
        .then((r) => (r.ok ? r.json() : []))
        .then((data: Listing[]) => data?.length && setListings(data.map((item) => enrichListing(normalizeListing(item)))))
        .catch(() => undefined)
    } else {
      notify('Please add a title, location, and nightly price')
    }
  }

  const deleteHostListing = async (id: string) => {
    const response = await fetch(`/api/listings/${id}`, { method: 'DELETE' })
    if (response.ok) {
      notify('Listing removed')
      void loadHost()
      setListings((current) => current.filter((listing) => listing.id !== id))
    }
  }

  const editHostListing = (listing: Listing) => {
    setEditingId(listing.id)
    setHostForm({
      title: listing.title || '',
      location: listing.location || '',
      price: listing.price || '',
      type: listing.type || 'Home',
      guests: listing.guests || 2,
      bedrooms: listing.bedrooms || 1,
      description: listing.description || '',
      image: listing.images?.[0] || CURATED_IMAGES[0],
    })
  }

  const closeHost = () => {
    setShowHost(false)
    setEditingId(null)
  }

  return (
    <main className="min-h-screen bg-white text-[#222222]">
      <Header
        query={query}
        setQuery={setQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        setShowSearchPanel={setShowSearchPanel}
        onLogoClick={() => {
          setQuery('')
          setActiveCategory('All stays')
          setShowTrips(false)
          setShowHost(false)
        }}
        onHost={openHost}
        onMenu={() => setShowMenu(true)}
        onComingSoon={showComingSoon}
      />

      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <CategoryRow activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        <section className="flex items-center justify-between py-5">
          <div>
            <h1 className="text-[25px] font-semibold tracking-[-.7px]">Stays that feel like a getaway</h1>
            <p className="mt-1 text-sm text-[#717171]">Curated homes for your next long weekend</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className={`flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                activeFilterCount > 0
                  ? 'border-[#222222] bg-[#f7f7f7]'
                  : 'border-[#dddddd] hover:border-[#222222]'
              }`}
            >
              <SlidersHorizontal size={16} /> Filters
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-[#222222] px-2 py-0.5 text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowMap((value) => !value)}
              className={`hidden items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold sm:flex ${
                showMap ? 'border-[#222222] bg-[#f7f7f7]' : 'border-[#dddddd]'
              }`}
            >
              <Map size={16} /> {showMap ? 'Hide map' : 'Show map'}
            </button>
          </div>
        </section>

        <div className={showMap ? 'grid gap-6 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_560px]' : ''}>
          <section className={`grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 ${showMap ? 'lg:grid-cols-2' : 'lg:grid-cols-3 xl:grid-cols-4'}`}>
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                liked={liked.includes(listing.id)}
                onLike={() => toggleLike(listing.id)}
                onOpen={() => openListing(listing)}
              />
            ))}
            {!filteredListings.length && (
              <div className="col-span-full rounded-2xl border border-dashed border-[#dddddd] py-20 text-center">
                <Search className="mx-auto text-[#717171]" />
                <h2 className="mt-4 text-xl font-semibold">No stays found</h2>
                <p className="mt-2 text-sm text-[#717171]">Try a different location or loosen your filters.</p>
                <button
                  onClick={() => {
                    setQuery('')
                    setFilters({ ...DEFAULT_FILTERS })
                    setActiveCategory('All stays')
                  }}
                  className="mt-5 rounded-lg bg-[#222222] px-5 py-3 text-sm font-semibold text-white"
                >
                  Clear search
                </button>
              </div>
            )}
          </section>
          {showMap && <MapPanel listings={filteredListings} onOpen={openListing} />}
        </div>
      </div>

      {showSearchPanel && (
        <SearchPanel
          query={query}
          setQuery={setQuery}
          guests={guests}
          setGuests={setGuests}
          onClose={() => setShowSearchPanel(false)}
          onSearch={() => setShowSearchPanel(false)}
        />
      )}
      {showFilters && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          matchCount={filteredListings.length}
          onClose={() => setShowFilters(false)}
        />
      )}
      {selected && (
        <ListingDetail
          listing={selected}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          guests={detailGuests}
          setGuests={setDetailGuests}
          nights={selectedNights}
          total={selectedTotal}
          liked={liked.includes(selected.id)}
          onLike={() => toggleLike(selected.id)}
          onClose={() => setSelected(null)}
          onReserve={reserve}
          onMessage={() => showComingSoon('Messaging with hosts')}
        />
      )}
      {showTrips && <TripsModal bookings={bookings} onClose={() => setShowTrips(false)} />}
      {showHost && (
        <HostModal
          listings={hostListings}
          bookings={hostBookings}
          form={hostForm}
          setForm={setHostForm}
          editingId={editingId}
          onClose={closeHost}
          onSubmit={submitHost}
          onEdit={editHostListing}
          onDelete={deleteHostListing}
          onComingSoon={showComingSoon}
        />
      )}
      {showCheckout && selected && (
        <CheckoutModal
          listing={selected}
          nights={selectedNights}
          total={selectedTotal}
          startDate={startDate}
          onClose={() => setShowCheckout(false)}
          onConfirm={confirmBooking}
        />
      )}
      {showMenu && (
        <MenuModal
          onClose={() => setShowMenu(false)}
          onTrips={() => {
            setShowMenu(false)
            setShowTrips(true)
          }}
          onHost={() => {
            setShowMenu(false)
            openHost()
          }}
          onComingSoon={showComingSoon}
        />
      )}
      {comingSoon && <ComingSoonModal label={comingSoon} onClose={() => setComingSoon('')} />}
      <Toast message={toast} />
    </main>
  )
}

export default App
