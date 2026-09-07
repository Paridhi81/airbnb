'use client'

import { Clock, Heart, Star } from 'lucide-react'
import { EXPERIENCES } from '@/lib/content'
import { formatMoney } from '@/lib/format'

interface ExperiencesGridProps {
  onComingSoon: (label: string) => void
}

const ExperiencesGrid = ({ onComingSoon }: ExperiencesGridProps) => (
  <div>
    <section className="py-5">
      <h1 className="text-[25px] font-semibold tracking-[-.7px]">Experiences hosted by locals</h1>
      <p className="mt-1 text-sm text-[#717171]">Small-group activities you can’t book anywhere else</p>
    </section>
    <section className="grid grid-cols-1 gap-x-5 gap-y-9 pb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {EXPERIENCES.map((exp) => (
        <article
          key={exp.id}
          onClick={() => onComingSoon('Booking experiences')}
          className="group cursor-pointer"
        >
          <div className="relative aspect-[1.02/1] overflow-hidden rounded-2xl bg-[#f1f1f1]">
            <img
              src={exp.image}
              alt={exp.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-sm">
              {exp.category}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onComingSoon('Wishlist for experiences')
              }}
              className="absolute right-3 top-3 rounded-full p-1 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.7)] transition hover:scale-110"
              aria-label="Save experience"
            >
              <Heart size={25} fill="rgba(0,0,0,.25)" color="white" strokeWidth={1.8} />
            </button>
          </div>
          <div className="px-1 pt-3">
            <div className="flex items-start justify-between gap-2">
              <h2 className="line-clamp-2 text-[15px] font-semibold">{exp.title}</h2>
              <span className="flex shrink-0 items-center gap-1 text-sm">
                <Star size={13} fill="#222" /> {exp.rating.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#717171]">{exp.location} · Hosted by {exp.host}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-[#717171]">
              <Clock size={13} /> {exp.duration}
            </p>
            <p className="mt-2 text-sm">
              <strong>{formatMoney(exp.price)}</strong> per guest{' '}
              <span className="text-[#717171]">· {exp.reviews} reviews</span>
            </p>
          </div>
        </article>
      ))}
    </section>
  </div>
)

export default ExperiencesGrid
