'use client'

interface LogoProps {
  onClick?: () => void
}

const Logo = ({ onClick }: LogoProps) => (
  <button onClick={onClick} className="flex items-center gap-2.5" aria-label="Roamly home">
    <span className="relative flex h-9 w-9 items-center justify-center text-[#ff385c]">
      <span className="absolute rotate-45 rounded-[13px] border-[3px] border-[#ff385c] h-7 w-5" />
      <span className="absolute -rotate-45 rounded-[13px] border-[3px] border-[#ff385c] h-7 w-5" />
      <span className="absolute bottom-1.5 h-2 w-2 rounded-full bg-[#ff385c]" />
    </span>
    <span className="text-[26px] font-bold tracking-[-1.5px] text-[#ff385c]">roamly</span>
  </button>
)

export default Logo
