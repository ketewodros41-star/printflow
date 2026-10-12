'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type UserRole = 'merchant' | 'admin' | 'shopper'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  storeName?: string
  storeSlug?: string
  plan?: 'FREE' | 'PRO' | 'BUSINESS'
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (patch: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Demo accounts — use these to test different roles
const DEMO_USERS: Record<string, AuthUser> = {
  'admin@printflow.et': {
    id: 'admin-1',
    name: 'Fikir Admin',
    email: 'admin@printflow.et',
    role: 'admin',
  },
  'merchant@printflow.et': {
    id: 'merchant-1',
    name: 'Abebe Kebede',
    email: 'merchant@printflow.et',
    role: 'merchant',
    storeName: 'Addis Designs',
    storeSlug: 'addis-designs',
    plan: 'PRO',
  },
  'shopper@printflow.et': {
    id: 'shopper-1',
    name: 'Tigist Alemu',
    email: 'shopper@printflow.et',
    role: 'shopper',
  },
}

const STORAGE_KEY = 'pf_user_v1'
const COOKIE_KEY  = 'pf_session'

function cookieSet(value: string) {
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(value)}; path=/; max-age=86400`
}
function cookieClear() {
  document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser
        setUser(parsed)
        cookieSet(JSON.stringify({ role: parsed.role, id: parsed.id }))
      }
    } catch { /* ignore corrupt storage */ }
    setLoading(false)
  }, [])

  const persist = useCallback((u: AuthUser) => {
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    cookieSet(JSON.stringify({ role: u.role, id: u.id }))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) return { success: false, error: 'Enter your email and password.' }
    await new Promise(r => setTimeout(r, 700))

    const key  = email.toLowerCase().trim()
    const demo = DEMO_USERS[key]

    const resolved: AuthUser = demo ?? {
      id:        `u-${Date.now()}`,
      name:      key.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email:     key,
      role:      key.includes('admin') ? 'admin' : 'merchant',
      storeName: `${key.split('@')[0]}'s Store`,
      storeSlug: key.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      plan:      'FREE',
    }

    persist(resolved)
    return { success: true }
  }, [persist])

  const signup = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    if (!email || !password) return { success: false, error: 'Fill in all required fields.' }
    if (password.length < 8)   return { success: false, error: 'Password must be at least 8 characters.' }
    await new Promise(r => setTimeout(r, 700))

    const u: AuthUser = {
      id:        `u-${Date.now()}`,
      name:      `${firstName} ${lastName}`.trim() || email.split('@')[0],
      email:     email.toLowerCase().trim(),
      role:      'merchant',
      storeName: firstName ? `${firstName}'s Store` : 'My Store',
      storeSlug: (firstName || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36),
      plan:      'FREE',
    }

    persist(u)
    return { success: true }
  }, [persist])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    cookieClear()
  }, [])

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
