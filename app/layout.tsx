import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Roamly — find stays worth remembering',
  description: 'A photo-forward stay marketplace inspired by Airbnb.',
}

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body>{children}</body>
  </html>
)

export default RootLayout
