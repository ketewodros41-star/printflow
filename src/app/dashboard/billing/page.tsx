import Link from 'next/link'
import { Check, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'FREE', name: 'Free', price: 0, period: '',
    desc: 'For getting started',
    features: [
      'Up to 5 products',
      '1 connected store',
      'Standard production pricing',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Current plan',
    current: true,
  },
  {
    id: 'PRO', name: 'Pro', price: 290, period: '/month',
    desc: 'For growing merchants',
    features: [
      'Unlimited products',
      '3 connected stores',
      '20% off production costs',
      'Advanced analytics',
      'Priority support',
      'Custom branding on packaging',
      'API access',
    ],
    cta: 'Upgrade to Pro',
    current: false,
    popular: true,
  },
  {
    id: 'BUSINESS', name: 'Business', price: 890, period: '/month',
    desc: 'For high-volume sellers',
    features: [
      'Everything in Pro',
      'Unlimited stores',
      '30% off production costs',
      'Dedicated account manager',
      'White-label storefront',
      'Team members (5 seats)',
      'Custom integrations',
    ],
    cta: 'Upgrade to Business',
    current: false,
  },
]

export default function BillingPage() {
  return (
    <div className="p-8">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-pf-ink">Billing &amp; Plans</h1>
        <p className="text-pf-muted text-sm mt-1">Manage your subscription and payment methods</p>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {PLANS.map(plan => (
          <div key={plan.id}
            className={`pf-card p-6 relative ${plan.popular ? 'border-pf-olive ring-1 ring-pf-olive/20' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge-olive gap-1.5"><Zap size={11} /> Most popular</span>
              </div>
            )}
            <div className="mb-5">
              <div className="font-bold text-pf-ink text-lg">{plan.name}</div>
              <div className="text-pf-muted text-xs mb-3">{plan.desc}</div>
              <div className="flex items-end gap-1">
                {plan.price === 0
                  ? <span className="text-3xl font-extrabold text-pf-ink">Free</span>
                  : <>
                    <span className="text-2xl font-extrabold text-pf-ink">ETB {plan.price}</span>
                    <span className="text-pf-muted text-sm mb-1">{plan.period}</span>
                  </>
                }
              </div>
            </div>
            <div className="space-y-2.5 mb-6">
              {plan.features.map(f => (
                <div key={f} className="flex items-start gap-2.5">
                  <Check size={14} className="text-pf-olive mt-0.5 shrink-0" />
                  <span className="text-sm text-pf-muted">{f}</span>
                </div>
              ))}
            </div>
            <button
              disabled={plan.current}
              className={plan.current ? 'btn-secondary w-full justify-center opacity-60 cursor-default' : 'btn-primary w-full justify-center'}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Payment methods */}
      <div className="pf-card p-6 mb-6">
        <h2 className="font-semibold text-pf-ink mb-4">Payment Methods</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-pf border border-pf-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-pf-chapa flex items-center justify-center text-white text-xs font-bold">C</div>
              <div>
                <div className="text-sm font-medium text-pf-ink">Chapa</div>
                <div className="text-xs text-pf-muted">Active payment method</div>
              </div>
            </div>
            <span className="status-active text-xs">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-pf border border-pf-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-pf-telebirr flex items-center justify-center text-white text-xs font-bold">T</div>
              <div>
                <div className="text-sm font-medium text-pf-ink">Telebirr</div>
                <div className="text-xs text-pf-muted">+251 91 234 5678</div>
              </div>
            </div>
            <span className="status-active text-xs">Active</span>
          </div>
        </div>
        <button className="btn-secondary mt-4 text-sm">+ Add payment method</button>
      </div>

      {/* Invoice history */}
      <div className="pf-card overflow-hidden">
        <div className="px-5 py-4 border-b border-pf-border">
          <h2 className="font-semibold text-pf-ink">Invoice History</h2>
        </div>
        <table className="pf-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[
              { inv: 'INV-2026-10', date: 'Oct 1, 2026', amount: 'ETB 290', status: 'Paid' },
              { inv: 'INV-2026-09', date: 'Sep 1, 2026', amount: 'ETB 290', status: 'Paid' },
            ].map(inv => (
              <tr key={inv.inv}>
                <td className="font-mono text-xs">{inv.inv}</td>
                <td className="text-sm">{inv.date}</td>
                <td className="font-semibold text-sm">{inv.amount}</td>
                <td><span className="status-active text-xs">{inv.status}</span></td>
                <td><button className="text-xs text-pf-muted hover:text-pf-ink underline">Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
