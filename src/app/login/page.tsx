'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { login }               = useAuth()
  const router                  = useRouter()
  const searchParams            = useSearchParams()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form     = e.currentTarget
    const email    = (form.elements.namedItem('email')    as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (!result.success) { setError(result.error ?? 'Login failed.'); return }

    const next = searchParams.get('next')

    // Role-based redirect
    const stored = localStorage.getItem('pf_user_v1')
    const role   = stored ? JSON.parse(stored).role : 'merchant'
    if (next) return router.push(next)
    router.push(role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-pf-olive rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl text-pf-ink">PrintFlow</span>
          </Link>

          <h1 className="text-2xl font-bold text-pf-ink mb-1">Welcome back</h1>
          <p className="text-pf-muted text-sm mb-7">Log in to your account</p>

          {/* Demo credentials hint */}
          <div className="bg-pf-paper border border-pf-border rounded-pf p-3 mb-5 text-xs text-pf-muted space-y-1">
            <div className="font-semibold text-pf-ink mb-1">Demo accounts (any password works)</div>
            <div><span className="font-mono bg-white px-1 py-0.5 rounded">merchant@printflow.et</span> → Merchant dashboard</div>
            <div><span className="font-mono bg-white px-1 py-0.5 rounded">admin@printflow.et</span> → Admin panel</div>
            <div>Any other email → Auto-registered as merchant</div>
          </div>

          {/* Google SSO */}
          <button className="btn-secondary w-full justify-center gap-3 mb-5 py-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center mb-5">
            <div className="flex-1 border-t border-pf-border" />
            <span className="px-3 text-xs text-pf-subtle">or</span>
            <div className="flex-1 border-t border-pf-border" />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-pf-sm px-3 py-2">
                {error}
              </div>
            )}
            <div>
              <label className="pf-label" htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" className="pf-input" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="pf-label mb-0" htmlFor="password">Password</label>
                <button type="button" className="text-xs text-pf-muted hover:text-pf-ink">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPwd ? 'text' : 'password'}
                  className="pf-input pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pf-subtle hover:text-pf-ink">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <><Loader2 size={16} className="animate-spin mr-2" />Signing in…</>
                : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-pf-muted mt-6 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-pf-ink font-medium hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>

      {/* Right — visual */}
      <div className="hidden lg:flex w-[460px] bg-pf-olive flex-col justify-center px-12">
        <div className="text-white mb-8">
          <h2 className="text-3xl font-bold mb-3">Ethiopia&apos;s print-on-demand platform</h2>
          <p className="text-white/70 leading-relaxed">
            Create custom products, sell everywhere, and let us handle
            fulfillment — all powered by Ethiopian payment methods.
          </p>
        </div>
        <div className="space-y-3">
          {['Accept Chapa, M-Pesa & Telebirr', 'Ship anywhere in Ethiopia', 'No upfront stock investment', 'Automatic order fulfillment'].map(f => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-green-300 shrink-0" />
              <span className="text-white/80 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
