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
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
