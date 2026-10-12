'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/catalog',   label: 'Catalog' },
  { href: '/pricing',   label: 'Pricing' },
]

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-pf-cream border-b border-pf-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pf-olive rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl text-pf-ink tracking-tight">PrintFlow</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className="px-4 py-2 text-sm font-medium text-pf-muted hover:text-pf-ink transition-colors rounded-pf-sm hover:bg-pf-divider">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="btn-ghost text-sm">
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm">Log in</Link>
                <Link href="/signup" className="btn-primary text-sm">Start for free</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-pf-sm hover:bg-pf-divider"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-pf-border bg-pf-cream px-4 pb-4 pt-2 space-y-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="block px-3 py-2.5 text-sm font-medium text-pf-muted hover:text-pf-ink rounded-pf-sm hover:bg-pf-divider"
              onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-pf-border">
            {user ? (
              <>
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-secondary justify-center">
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="btn-secondary justify-center text-red-600">Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary justify-center">Log in</Link>
                <Link href="/signup" className="btn-primary justify-center">Start for free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
