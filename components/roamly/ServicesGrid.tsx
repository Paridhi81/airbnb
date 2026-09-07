'use client'

import { Heart, Star } from 'lucide-react'
import { SERVICES } from '@/lib/content'
import { formatMoney } from '@/lib/format'

interface ServicesGridProps {
  onComingSoon: (label: string) => void
}

const ServicesGrid = ({ onComingSoon }: ServicesGridProps) => (
  <div>
    <section className="py-5">
      <h1 className="text-[25px] font-semibold tracking-[-.7px]">Services from top-rated pros</h1>
      <p className="mt-1 text-sm text-[#717171]">Chefs, photographers, and concierges who come to you</p>
    </section>
    <section className="grid grid-cols-1 gap-x-5 gap-y-9 pb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SERVICES.map((svc) => (
        <article
          key={svc.id}
          onClick={() => onComingSoon('Booking services')}
          className="group cursor-pointer"
        >
          <div className="relative aspect-[1.02/1] overflow-hidden rounded-2xl bg-[#f1f1f1]">
            <img
              src={svc.image}
              alt={svc.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-sm">
              {svc.category}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onComingSoon('Wishlist for services')
              }}
              className="absolute right-3 top-3 rounded-full p-1 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.7)] transition hover:scale-110"
              aria-label="Save service"
            >
              <Heart size={25} fill="rgba(0,0,0,.25)" color="white" strokeWidth={1.8} />
            </button>
          </div>
          <div className="px-1 pt-3">
            <div className="flex items-start justify-between gap-2">
              <h2 className="line-clamp-2 text-[15px] font-semibold">{svc.title}</h2>
              <span className="flex shrink-0 items-center gap-1 text-sm">
                <Star size={13} fill="#222" /> {svc.rating.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#717171]">{svc.provider} · {svc.location}</p>
            <p className="mt-2 text-sm">
              <strong>{formatMoney(svc.price)}</strong> per service{' '}
              <span className="text-[#717171]">· {svc.reviews} reviews</span>
            </p>
          </div>
        </article>
      ))}
    </section>
  </div>
)

export default ServicesGrid
