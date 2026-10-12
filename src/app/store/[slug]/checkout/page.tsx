'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductMockupWithArt } from '@/components/mockups/ProductMockups'
import { SAMPLE_GRAPHICS } from '@/lib/sampleGraphics'

type PaymentMethod = 'CHAPA' | 'MPESA' | 'TELEBIRR'

const ORDER_ITEMS = [
  {
    title: 'Habesha Roast Signature Tee · M / Black',
    qty: 2,
    price: 780,
    type: 'tshirt' as const,
    color: '#1A1A12',
    artworkUrl: SAMPLE_GRAPHICS[1].previewUrl,
  },
  {
    title: 'Highland Explorer Ceramic Mug · White',
    qty: 1,
    price: 340,
    type: 'mug' as const,
    color: '#FFFFFF',
    artworkUrl: SAMPLE_GRAPHICS[0].previewUrl,
  },
]

const PAYMENT_METHODS: {
  id: PaymentMethod
  label: string
  desc: string
  logo: string
  color: string
}[] = [
  {
    id: 'CHAPA',
    label: 'Chapa',
    desc: 'Pay with Visa, Mastercard, or any Ethiopian bank card',
    logo: 'C',
    color: 'bg-pf-chapa',
  },
  {
    id: 'TELEBIRR',
    label: 'Telebirr',
    desc: 'Pay with your Ethio Telecom mobile money wallet',
    logo: 'T',
    color: 'bg-pf-telebirr',
  },
  {
    id: 'MPESA',
    label: 'M-Pesa',
    desc: 'Pay with Safaricom M-Pesa mobile money',
    logo: 'M',
    color: 'bg-pf-mpesa',
  },
]

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CHAPA')
  const [step, setStep] = useState<'info' | 'payment'>('info')
  const [loading, setLoading] = useState(false)

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping  = 120
  const total     = subtotal + shipping

  const handlePay = async () => {
    setLoading(true)
    // In production, POST to /api/payments/{method} and redirect to checkout URL
    await new Promise(r => setTimeout(r, 1500))
    window.location.href = `/store/${params.slug}/success?method=${paymentMethod}&ref=PF-TEST-${Date.now()}`
  }

  return (
    <div className="min-h-screen bg-pf-cream">
      {/* Header */}
      <div className="bg-white border-b border-pf-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/store/${params.slug}`} className="font-bold text-pf-ink text-lg">
            Addis Style Hub
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span className={cn(step === 'info' ? 'font-semibold text-pf-ink' : 'text-pf-muted')}>
              1. Information
            </span>
            <ChevronRight size={14} className="text-pf-border" />
            <span className={cn(step === 'payment' ? 'font-semibold text-pf-ink' : 'text-pf-muted')}>
              2. Payment
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-5 gap-8">

          {/* Left: form */}
          <div className="md:col-span-3">
            {step === 'info' ? (
              <div>
                <h2 className="text-xl font-bold text-pf-ink mb-6">Contact &amp; Shipping</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="pf-label">First name</label>
                      <input className="pf-input" placeholder="Abebe" />
                    </div>
                    <div>
                      <label className="pf-label">Last name</label>
                      <input className="pf-input" placeholder="Kebede" />
                    </div>
                  </div>
                  <div>
                    <label className="pf-label">Email</label>
                    <input type="email" className="pf-input" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="pf-label">Phone number</label>
                    <input type="tel" className="pf-input" placeholder="+251 91 234 5678" />
                  </div>
                  <div>
                    <label className="pf-label">Address</label>
                    <input className="pf-input" placeholder="Bole Road, Near Megenagna" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="pf-label">City</label>
                      <input className="pf-input" placeholder="Addis Ababa" />
                    </div>
                    <div>
                      <label className="pf-label">Region</label>
                      <select className="pf-input">
                        <option>Addis Ababa</option>
                        <option>Oromia</option>
                        <option>Amhara</option>
                        <option>Tigray</option>
                        <option>SNNPR</option>
                        <option>Sidama</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setStep('payment')}
                  className="btn-primary w-full justify-center py-3.5 text-base mt-6"
                >
                  Continue to payment
                </button>
              </div>
            ) : (
              <div>
                <button onClick={() => setStep('info')}
                  className="text-sm text-pf-muted hover:text-pf-ink mb-6 flex items-center gap-1">
                  ← Back to information
                </button>
                <h2 className="text-xl font-bold text-pf-ink mb-6">Payment Method</h2>

                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map(pm => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-pf border-2 transition-all text-left',
                        paymentMethod === pm.id
                          ? 'border-pf-ink bg-white shadow-pf-card'
                          : 'border-pf-border bg-white hover:border-pf-ink/40'
                      )}
                    >
                      <div className={cn('w-10 h-10 rounded-pf flex items-center justify-center shrink-0 text-white font-bold', pm.color)}>
                        {pm.logo}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-pf-ink">{pm.label}</div>
                        <div className="text-sm text-pf-muted mt-0.5">{pm.desc}</div>
                      </div>
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                        paymentMethod === pm.id ? 'border-pf-ink' : 'border-pf-border'
                      )}>
                        {paymentMethod === pm.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-pf-ink" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Phone input for M-Pesa / Telebirr */}
                {(paymentMethod === 'MPESA' || paymentMethod === 'TELEBIRR') && (
                  <div className="mb-6 p-4 bg-pf-paper rounded-pf border border-pf-border">
                    <label className="pf-label">
                      {paymentMethod === 'MPESA' ? 'Safaricom M-Pesa' : 'Telebirr'} phone number
                    </label>
                    <input
                      type="tel"
                      className="pf-input"
                      placeholder="+251 91 234 5678"
                    />
                    <p className="text-xs text-pf-muted mt-2">
                      You will receive an STK push notification to confirm payment.
                    </p>
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3.5 text-base"
                >
                  {loading
                    ? 'Processing…'
                    : `Pay ETB ${total.toLocaleString()} with ${PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}`
                  }
                </button>

                <div className="flex items-center justify-center gap-3 mt-4 text-xs text-pf-subtle">
                  <span>🔒 Secure payment</span>
                  <span>·</span>
                  <span>Encrypted &amp; safe</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: order summary */}
          <div className="md:col-span-2">
            <div className="pf-card p-5 sticky top-6">
              <h3 className="font-semibold text-pf-ink mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {ORDER_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F2EFE8] rounded-lg border border-[#E5E2DC] p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                      <ProductMockupWithArt
                        type={item.type}
                        color={item.color}
                        artworkUrl={item.artworkUrl}
                        className="w-full h-full drop-shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-pf-ink truncate">{item.title}</div>
                      <div className="text-xs text-pf-muted">Qty: {item.qty}</div>
                    </div>
                    <div className="text-sm font-semibold shrink-0">
                      ETB {(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-pf-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-pf-muted">Subtotal</span>
                  <span>ETB {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pf-muted">Shipping</span>
                  <span>ETB {shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-pf-ink pt-2 border-t border-pf-border">
                  <span>Total</span>
                  <span>ETB {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
