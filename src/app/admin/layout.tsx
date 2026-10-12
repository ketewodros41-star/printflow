'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace('/login?next=/admin')
      else if (user.role !== 'admin') router.replace('/dashboard')
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pf-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <p className="text-sm text-white/50">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F0EDE7] overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
