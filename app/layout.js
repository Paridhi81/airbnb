import './globals.css'

export const metadata = {
  title: 'Roamly — find stays worth remembering',
  description: 'A photo-forward stay marketplace inspired by Airbnb.'
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout