'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import MerchantSidebar from '@/components/layout/MerchantSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login?next=/dashboard')
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pf-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 bg-pf-olive rounded-md flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <p className="text-sm text-pf-muted">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-pf-cream overflow-hidden">
      <MerchantSidebar storeName={user.storeName} storeSlug={user.storeSlug} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
