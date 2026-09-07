'use client'

import { CalendarDays, HousePlus, KeyRound, MessageCircle, ShieldCheck } from 'lucide-react'
import Overlay from './Overlay'

interface MenuModalProps {
  onClose: () => void
  onTrips: () => void
  onHost: () => void
  onComingSoon: (label: string) => void
}

const MenuModal = ({ onClose, onTrips, onHost, onComingSoon }: MenuModalProps) => (
  <Overlay onClose={onClose} title="Account">
    <div className="overflow-hidden rounded-2xl border border-[#eeeeee]">
      <div className="flex items-center gap-3 bg-[#f7f7f7] p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5c5b8] font-semibold">AM</div>
        <div>
          <p className="font-semibold">Alex Morgan</p>
          <p className="text-sm text-[#717171]">Guest mode · Demo account</p>
        </div>
      </div>
      <button
        onClick={onTrips}
        className="flex w-full items-center gap-3 border-b border-[#eeeeee] px-4 py-4 text-left text-sm font-semibold hover:bg-[#f7f7f7]"
      >
        <CalendarDays size={18} /> My trips
      </button>
      <button
        onClick={() => onComingSoon('Messaging with hosts')}
        className="flex w-full items-center gap-3 border-b border-[#eeeeee] px-4 py-4 text-left text-sm font-semibold hover:bg-[#f7f7f7]"
      >
        <MessageCircle size={18} /> Messages
        <span className="ml-auto rounded-full bg-[#fdf1ee] px-2 py-1 text-[10px]">Coming soon</span>
      </button>
      <button
        onClick={() => onComingSoon('Identity verification')}
        className="flex w-full items-center gap-3 border-b border-[#eeeeee] px-4 py-4 text-left text-sm font-semibold hover:bg-[#f7f7f7]"
      >
        <ShieldCheck size={18} /> Verify identity
        <span className="ml-auto rounded-full bg-[#fdf1ee] px-2 py-1 text-[10px]">Coming soon</span>
      </button>
      <button
        onClick={onHost}
        className="flex w-full items-center gap-3 border-b border-[#eeeeee] px-4 py-4 text-left text-sm font-semibold hover:bg-[#f7f7f7]"
      >
        <HousePlus size={18} /> Switch to host mode
      </button>
      <button
        onClick={() => onComingSoon('Log in and sign up')}
        className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-semibold hover:bg-[#f7f7f7]"
      >
        <KeyRound size={18} /> Log in or sign up
      </button>
    </div>
  </Overlay>
)

export default MenuModal
