import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'PrintFlow — Ethiopian Print-on-Demand', template: '%s | PrintFlow' },
  description: 'Design. Sell. Ship. Ethiopia\'s first print-on-demand platform.',
  keywords: ['print on demand', 'custom t-shirts', 'Ethiopia', 'Addis Ababa', 'Chapa', 'Telebirr'],
  openGraph: {
    title: 'PrintFlow',
    description: 'Ethiopia\'s first print-on-demand platform.',
    url: 'https://printflow.et',
    siteName: 'PrintFlow',
    locale: 'en_ET',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Anton&family=Bebas+Neue&family=Caveat:wght@700&family=Courier+Prime:wght@700&family=Dancing+Script:wght@700&family=Fredoka+One&family=Lobster&family=Merriweather:wght@700&family=Montserrat:wght@700;900&family=Oswald:wght@500;700&family=Pacifico&family=Permanent+Marker&family=Playfair+Display:wght@700;900&family=Raleway:wght@800&family=Righteous&family=Roboto+Condensed:wght@700&family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
