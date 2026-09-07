'use client'

import { CircleUserRound, Globe2, Menu } from 'lucide-react'
import Logo from './Logo'
import SearchBar from './SearchBar'
import { HEADER_NAV } from '@/lib/data'

interface HeaderProps {
  query: string
  setQuery: (value: string) => void
  activeCategory: string
  setActiveCategory: (value: string) => void
  setShowSearchPanel: (value: boolean) => void
  onLogoClick: () => void
  onHost: () => void
  onMenu: () => void
  onComingSoon: (label: string) => void
}

const Header = ({
  query,
  setQuery,
  activeCategory,
  setActiveCategory,
  setShowSearchPanel,
  onLogoClick,
  onHost,
  onMenu,
  onComingSoon,
}: HeaderProps) => (
  <header className="sticky top-0 z-30 border-b border-[#ebebeb] bg-white/95 backdrop-blur">
    <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
      <Logo onClick={onLogoClick} />
      <nav className="hidden items-center gap-8 md:flex">
        {HEADER_NAV.map(({ label, icon: Icon }, index) => {
          const isActive = index === 0 && activeCategory === 'All stays'
          return (
            <button
              key={label}
              onClick={() => (index === 0 ? setActiveCategory('All stays') : onComingSoon(label))}
              className={`flex items-center gap-2 border-b-[3px] py-6 text-[15px] font-semibold ${
                isActive ? 'border-[#222222] text-[#222222]' : 'border-transparent text-[#717171]'
              }`}
            >
              <Icon size={22} strokeWidth={1.6} />
              {label}
            </button>
          )
        })}
      </nav>
      <div className="flex items-center gap-2.5 text-sm font-semibold">
        <button
          onClick={onHost}
          className="hidden rounded-full px-4 py-3 transition hover:bg-[#f7f7f7] lg:block"
        >
          Roamly your home
        </button>
        <button
          onClick={() => onComingSoon('Language and currency')}
          className="hidden rounded-full p-3 hover:bg-[#f7f7f7] sm:block"
          aria-label="Language and currency"
        >
          <Globe2 size={19} />
        </button>
        <button
          onClick={onMenu}
          className="flex items-center gap-2 rounded-full border border-[#dddddd] p-2.5 pl-3 shadow-sm transition hover:shadow-md"
          aria-label="Account menu"
        >
          <Menu size={18} />
          <CircleUserRound size={25} strokeWidth={1.5} />
        </button>
      </div>
    </div>
    <div className="mx-auto max-w-[880px] px-5 pb-5 md:hidden">
      <SearchBar compact query={query} setQuery={setQuery} setShowSearchPanel={setShowSearchPanel} />
    </div>
    <div className="mx-auto hidden max-w-[850px] px-5 pb-5 md:block">
      <SearchBar query={query} setQuery={setQuery} setShowSearchPanel={setShowSearchPanel} />
    </div>
  </header>
)

export default Header
