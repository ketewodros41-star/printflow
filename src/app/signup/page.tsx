'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'

const PLANS = [
  { id: 'FREE', label: 'Free', price: 0 },
  { id: 'PRO', label: 'Pro — ETB 290/mo', price: 290 },
]

export default function SignupPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const { signup }            = useAuth()
  const router                = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form      = e.currentTarget
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value
    const lastName  = (form.elements.namedItem('lastName')  as HTMLInputElement).value
    const email     = (form.elements.namedItem('email')     as HTMLInputElement).value
    const password  = (form.elements.namedItem('password')  as HTMLInputElement).value

    setLoading(true)
    const result = await signup(email, password, firstName, lastName)
    setLoading(false)

    if (!result.success) { setError(result.error ?? 'Signup failed.'); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-pf-olive rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl text-pf-ink">PrintFlow</span>
          </Link>

          <h1 className="text-2xl font-bold text-pf-ink mb-1">Create your account</h1>
          <p className="text-pf-muted text-sm mb-7">Start selling custom products today — it's free</p>

          {/* Google SSO */}
          <button className="btn-secondary w-full justify-center gap-3 mb-5 py-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="relative flex items-center mb-5">
            <div className="flex-1 border-t border-pf-border" />
            <span className="px-3 text-xs text-pf-subtle">or</span>
            <div className="flex-1 border-t border-pf-border" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-pf-sm px-3 py-2">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="pf-label" htmlFor="firstName">First name</label>
                <input id="firstName" name="firstName" type="text" className="pf-input" placeholder="Abebe" />
              </div>
              <div>
                <label className="pf-label" htmlFor="lastName">Last name</label>
                <input id="lastName" name="lastName" type="text" className="pf-input" placeholder="Kebede" />
              </div>
            </div>
            <div>
              <label className="pf-label" htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" className="pf-input" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div>
              <label className="pf-label" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  className="pf-input pr-10"
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pf-subtle hover:text-pf-ink"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Creating account…
                </>
              ) : (
                'Create free account'
              )}
            </button>
          </form>

          <p className="text-xs text-pf-subtle mt-4 text-center leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="underline">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>

          <p className="text-sm text-pf-muted mt-5 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-pf-ink font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="hidden lg:flex w-[460px] bg-pf-olive flex-col justify-center px-12">
        <div className="text-white mb-10">
          <h2 className="text-3xl font-bold mb-3">Start selling in minutes</h2>
          <p className="text-white/70 leading-relaxed">
            No upfront costs, no inventory. Create products, connect your store,
            and start making money.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { step: '1', label: 'Create your account for free' },
            { step: '2', label: 'Browse 500+ blank products' },
            { step: '3', label: 'Add your design & set a price' },
            { step: '4', label: 'Share your store & start selling' },
          ].map(s => (
            <div key={s.step} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center
                              text-white font-bold text-sm shrink-0">
                {s.step}
              </div>
              <span className="text-white/80 text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
