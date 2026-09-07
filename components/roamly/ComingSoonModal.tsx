'use client'

import { Sparkles } from 'lucide-react'
import Overlay from './Overlay'

interface ComingSoonModalProps {
  label: string
  onClose: () => void
}

const ComingSoonModal = ({ label, onClose }: ComingSoonModalProps) => (
  <Overlay onClose={onClose} title={label}>
    <div className="py-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf1ee] text-[#ff385c]">
        <Sparkles size={29} />
      </div>
      <h3 className="mt-5 text-xl font-semibold">{label} is coming soon</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#717171]">
        We’re polishing this part of the Roamly experience. For now, you can explore stays, reserve a home with our
        mocked checkout, or switch to host mode.
      </p>
      <button onClick={onClose} className="mt-6 rounded-xl bg-[#222222] px-6 py-3 text-sm font-bold text-white">
        Got it
      </button>
    </div>
  </Overlay>
)

export default ComingSoonModal
