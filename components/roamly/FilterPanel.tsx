'use client'

import { Home } from 'lucide-react'
import Overlay from './Overlay'
import { formatMoney } from '@/lib/format'

interface FilterPanelProps {
  maxPrice: number
  setMaxPrice: (value: number) => void
  onClose: () => void
}

const PROPERTY_TYPES = ['Home', 'Apartment', 'Villa', 'Cabin'] as const
const AMENITIES = ['Wifi', 'Pool', 'Kitchen', 'Free parking', 'Mountain view'] as const

const FilterPanel = ({ maxPrice, setMaxPrice, onClose }: FilterPanelProps) => (
  <Overlay onClose={onClose} title="Filters">
    <div className="space-y-7">
      <div>
        <p className="font-semibold">Price range</p>
        <p className="mt-1 text-sm text-[#717171]">Nightly prices before taxes</p>
        <input
          type="range"
          min="1500"
          max="12000"
          step="500"
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="mt-6 w-full accent-[#ff385c]"
        />
        <div className="mt-3 flex justify-between text-sm">
          <span>₹1,500</span>
          <strong>Up to {formatMoney(maxPrice)}</strong>
        </div>
      </div>
      <div className="border-t border-[#eeeeee] pt-6">
        <p className="font-semibold">Property type</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              className="rounded-xl border border-[#dddddd] px-3 py-4 text-left text-sm hover:border-[#222222]"
            >
              <Home size={20} className="mb-3" />
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-[#eeeeee] pt-6">
        <p className="font-semibold">Amenities</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {AMENITIES.map((amenity) => (
            <span key={amenity} className="rounded-full border border-[#dddddd] px-3 py-2 text-sm">
              {amenity}
            </span>
          ))}
        </div>
      </div>
      <button onClick={onClose} className="w-full rounded-xl bg-[#222222] py-3.5 font-bold text-white">
        Show stays
      </button>
    </div>
  </Overlay>
)

export default FilterPanel
