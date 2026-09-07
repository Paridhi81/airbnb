'use client'

import type { Listing } from '@/lib/types'
import { formatMoney } from '@/lib/format'

interface MapPanelProps {
  listings: Listing[]
  onOpen: (listing: Listing) => void
}

const MapPanel = ({ listings, onOpen }: MapPanelProps) => (
  <aside className="hidden min-h-[650px] overflow-hidden rounded-2xl bg-[#dce9df] lg:sticky lg:top-36 lg:block">
    <div className="relative h-full bg-[radial-gradient(circle_at_35%_30%,#f5e6c8_0_15%,transparent_16%),linear-gradient(130deg,#dce9df,#c4d9d0)]">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(35deg,transparent_48%,#8eb3a2_49%,transparent_51%),linear-gradient(120deg,transparent_48%,#8eb3a2_49%,transparent_51%)] [background-size:90px_90px]" />
      {listings.slice(0, 6).map((listing, index) => (
        <button
          key={listing.id}
          onClick={() => onOpen(listing)}
          className="absolute rounded-full border-2 border-white bg-[#222222] px-3 py-2 text-xs font-bold text-white shadow-xl transition hover:scale-110"
          style={{ left: `${18 + (index * 13) % 68}%`, top: `${18 + (index * 17) % 66}%` }}
        >
          {formatMoney(listing.price)}
        </button>
      ))}
      <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 px-4 py-3 text-sm font-semibold shadow-lg">
        Explore the map <span className="ml-2 text-[#717171]">{listings.length} stays</span>
      </div>
    </div>
  </aside>
)

export default MapPanel
