'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  Printer, CreditCard, Settings, BarChart3,
  FileText, Shield, AlertTriangle, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'

const MENU = [
  { href: '/admin',           icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users',     icon: Users,           label: 'Users' },
  { href: '/admin/products',  icon: Package,         label: 'Products' },
  { href: '/admin/orders',    icon: ShoppingCart,    label: 'Orders' },
  { href: '/admin/providers', icon: Printer,         label: 'Providers' },
  { href: '/admin/payments',  icon: CreditCard,      label: 'Payments' },
  { href: '/admin/analytics', icon: BarChart3,       label: 'Analytics' },
  { href: '/admin/support',   icon: AlertTriangle,   label: 'Support' },
  { href: '/admin/content',   icon: FileText,        label: 'Content' },
  { href: '/admin/settings',  icon: Settings,        label: 'Settings' },
  { href: '/admin/audit',     icon: Shield,          label: 'Audit Logs' },
]

export default function AdminSidebar() {
  const pathname       = usePathname()
  const router         = useRouter()
  const { user, logout } = useAuth()

  const initials = (user?.name ?? 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 overflow-y-auto
                      bg-pf-ink border-r border-pf-ink/60 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <div>
            <span className="font-bold text-sm text-white">PrintFlow</span>
            <span className="block text-[10px] text-white/50 leading-none">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {MENU.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-pf-sm text-sm font-medium transition-colors',
                active ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}>
              <item.icon size={16} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Admin profile + logout */}
      <div className="px-3 py-3 border-t border-white/10 space-y-1">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-pf-sage flex items-center justify-center text-xs font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-white truncate">{user?.name ?? 'Admin'}</div>
            <div className="text-[10px] text-white/50 truncate">{user?.email ?? ''}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-pf-sm text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors">
          <LogOut size={14} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
