'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Package, ShoppingCart,
  Settings, ChevronRight, Bell, Wallet, HelpCircle,
  Paintbrush, Users, LogOut, Shield, ChevronLeft, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'

const NAV = [
  { href: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/catalog',  icon: BookOpen,        label: 'Catalog' },
  { href: '/dashboard/products', icon: Package,         label: 'My products' },
  { href: '/dashboard/orders',   icon: ShoppingCart,    label: 'Orders' },
  { href: '/dashboard/settings', icon: Settings,        label: 'Settings' },
]

const PINNED = [
  { href: '/dashboard/branding', icon: Paintbrush, label: 'Branding' },
  { href: '/dashboard/stores',   icon: Users,       label: 'Sellers Club' },
]

interface Props { storeName?: string; storeSlug?: string }

export default function MerchantSidebar({ storeName, storeSlug }: Props) {
  const pathname       = usePathname()
  const router         = useRouter()
  const { user, logout } = useAuth()

  const displayName = user?.storeName ?? storeName ?? 'My new store'
  const displayEmail = user?.email ?? 'ktewodros41@gmail.com'

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-[205px] shrink-0 h-screen sticky top-0 overflow-y-auto
                      bg-[#FAF9F6] border-r border-[#E8E6E1] flex flex-col justify-between"
           style={{ fontFamily: 'Inter, sans-serif' }}>

      <div>
        {/* Brand header with Printify collapse toggle */}
        <div className="px-4 pt-5 pb-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-[20px] font-black tracking-tight text-[#1A1A12]">
              Printify
            </span>
          </Link>
          <button
            className="w-6 h-6 rounded-md bg-[#EFECE6] hover:bg-[#E5E2DC] flex items-center justify-center text-[#5C5A55] transition-colors"
            title="Collapse sidebar">
            <ChevronLeft size={14} />
          </button>
        </div>

        {/* Store selector card */}
        <div className="px-3 pt-1 pb-3">
          <button className="w-full flex items-center justify-between gap-1.5
                             bg-white border border-[#DCDAD4] shadow-2xs rounded-xl px-3 py-2.5
                             hover:border-[#1A1A12] transition-colors group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-5 h-5 bg-[#F5F4F0] rounded-md flex items-center justify-center shrink-0">
                <Package size={12} className="text-[#1A1A12]" />
              </div>
              <span className="text-[13px] font-semibold text-[#1A1A12] truncate">{displayName}</span>
            </div>
            <ChevronRight size={13} className="text-[#9A9A8E] group-hover:text-[#1A1A12] shrink-0" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-2 space-y-0.5">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-[#EAE7DF] text-[#1A1A12] font-semibold shadow-2xs'
                  : 'text-[#5C5A55] hover:bg-[#F2EFE8] hover:text-[#1A1A12]'
              )}>
              <item.icon size={16} className={cn("shrink-0", isActive(item.href) ? "text-[#1A1A12]" : "text-[#75736E]")} />
              {item.label}
            </Link>
          ))}

          {/* Pinned section */}
          <div className="pt-4 pb-1">
            <div className="px-3 text-[11px] font-bold text-[#9A9A8E] uppercase tracking-wider mb-1.5">
              Pinned
            </div>
            {PINNED.map(item => (
              <Link key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-[#EAE7DF] text-[#1A1A12] font-semibold'
                    : 'text-[#5C5A55] hover:bg-[#F2EFE8] hover:text-[#1A1A12]'
                )}>
                <item.icon size={15} className="shrink-0 text-[#75736E]" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Account & Help section at bottom */}
      <div className="border-t border-[#E8E6E1] px-3 py-3 space-y-2 bg-[#FAF9F6]">
        <div>
          <div className="text-[10px] font-bold text-[#9A9A8E] uppercase tracking-wider mb-2 px-1">
            Account
          </div>
          {/* Upgrade button */}
          <button className="w-full flex items-center justify-center gap-1.5 bg-white border border-[#DCDAD4] text-[#1A1A12]
                             rounded-full px-3 py-1.5 text-[12px] font-bold shadow-2xs
                             hover:border-[#1A1A12] hover:bg-[#F5F4F0] transition-colors">
            <Shield size={12} className="text-[#1A1A12]" />
            Upgrade
          </button>
        </div>

        <div className="space-y-0.5 text-[12px]">
          <Link href="/dashboard/settings"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[#5C5A55] hover:bg-[#F2EFE8] hover:text-[#1A1A12] transition-colors relative">
            <Bell size={14} className="text-[#75736E]" />
            <span>Notifications</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-auto" />
          </Link>
          <Link href="/dashboard/billing"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[#5C5A55] hover:bg-[#F2EFE8] hover:text-[#1A1A12] transition-colors">
            <Wallet size={14} className="text-[#75736E]" />
            <span>Wallet</span>
            <ChevronRight size={11} className="ml-auto text-[#9A9A8E]" />
          </Link>
          <Link href="/dashboard/settings"
            className="flex flex-col gap-0.5 px-2 py-1.5 rounded-lg text-[#5C5A55] hover:bg-[#F2EFE8] hover:text-[#1A1A12] transition-colors">
            <div className="flex items-center gap-2.5">
              <HelpCircle size={14} className="text-[#75736E]" />
              <span className="font-medium text-[#1A1A12]">Account &amp; Help</span>
            </div>
            <span className="text-[11px] text-[#9A9A8E] pl-6 truncate">{displayEmail}</span>
          </Link>
        </div>

        {/* Floating Chat Icon Simulation */}
        <div className="pt-1 flex items-center justify-between">
          <button
            onClick={() => { logout(); router.push('/login') }}
            className="text-[11px] text-[#8C8880] hover:text-red-600 flex items-center gap-1 transition-colors px-1"
            title="Log out">
            <LogOut size={12} /> Sign out
          </button>
          <div className="w-8 h-8 rounded-full bg-[#2B3024] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
               title="Printify Support">
            <MessageSquare size={14} />
          </div>
        </div>
      </div>
    </aside>
  )
}
