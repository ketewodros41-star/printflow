import Link from 'next/link'
import { Check, Zap, ArrowRight } from 'lucide-react'

const PLANS = [
  {
    id: 'FREE', name: 'Free', price: 0, period: '',
    desc: 'Perfect for getting started',
    features: [
      'Up to 5 products',
      '1 connected store',
      'Standard production pricing',
      'All payment methods (Chapa, M-Pesa, Telebirr)',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Get started free',
    href: '/signup',
    popular: false,
  },
  {
    id: 'PRO', name: 'Pro', price: 290, period: '/month',
    desc: 'For growing merchants',
    features: [
      'Unlimited products',
      '3 connected stores',
      '20% off all production costs',
      'All payment methods + lower fees',
      'Advanced analytics & reports',
      'Priority support',
      'Custom packaging branding',
      'API access',
    ],
    cta: 'Start Pro free trial',
    href: '/signup?plan=pro',
    popular: true,
  },
  {
    id: 'BUSINESS', name: 'Business', price: 890, period: '/month',
    desc: 'For high-volume operations',
    features: [
      'Everything in Pro',
      'Unlimited stores',
      '30% off all production costs',
      'Dedicated account manager',
      'White-label storefront',
      '5 team member seats',
      'Custom API integrations',
      'SLA guarantee',
    ],
    cta: 'Contact sales',
    href: '/contact',
    popular: false,
  },
]

const FAQS = [
  {
    q: 'How does pricing work?',
    a: 'You pay nothing upfront. When a shopper orders, you pay the production cost + shipping. Your profit is the retail price minus those costs. We deduct your plan fee monthly.',
  },
  {
    q: 'Which payment methods can my customers use?',
    a: 'All plans support Chapa (cards + bank transfer), Safaricom M-Pesa, and Telebirr. This covers virtually every Ethiopian customer.',
  },
  {
    q: 'Do I need a print provider contract?',
    a: 'No. We handle all relationships with print providers. You just design, set a price, and sell.',
  },
  {
    q: 'Can I use my own online store?',
    a: 'Yes. Connect Shopify, WooCommerce, Etsy, or other platforms. Or use our free hosted store.',
  },
  {
    q: 'What happens if an order goes wrong?',
    a: 'We guarantee the order. If a provider makes a mistake, we reprint and reship at no cost to you.',
  },
]

export default function PricingPage() {
  return (
    <div className="bg-pf-cream">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-5xl font-extrabold text-pf-ink tracking-tighter mb-4">
          Simple, honest pricing
        </h1>
        <p className="text-xl text-pf-muted max-w-xl mx-auto">
          Start for free. Upgrade when you grow. No hidden fees —
          you only pay when you sell.
        </p>
      </section>

      {/* Plan cards */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.id}
              className={`pf-card p-7 flex flex-col relative
                ${plan.popular ? 'border-pf-olive ring-1 ring-pf-olive/20' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge-olive gap-1.5"><Zap size={11} /> Most popular</span>
                </div>
              )}

              <div className="mb-6">
                <div className="text-lg font-bold text-pf-ink">{plan.name}</div>
                <div className="text-xs text-pf-muted mt-0.5 mb-3">{plan.desc}</div>
                <div className="flex items-end gap-1">
                  {plan.price === 0
                    ? <span className="text-4xl font-extrabold text-pf-ink">Free</span>
                    : <>
                        <span className="text-4xl font-extrabold text-pf-ink">
                          ETB {plan.price.toLocaleString()}
                        </span>
                        <span className="text-pf-muted mb-1">{plan.period}</span>
                      </>
                  }
                </div>
              </div>

              <div className="space-y-3 flex-1 mb-7">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check size={14} className="text-pf-olive mt-0.5 shrink-0" />
                    <span className="text-sm text-pf-muted">{f}</span>
                  </div>
                ))}
              </div>

              <Link href={plan.href}
                className={plan.popular ? 'btn-primary justify-center' : 'btn-secondary justify-center'}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison note */}
      <section className="bg-pf-paper py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-pf-ink mb-3">Production costs are separate</h2>
          <p className="text-pf-muted">
            Your plan fee covers platform access. Production and shipping costs are charged per order
            — you set your own retail price and keep the difference. Pro and Business plans give
            you a discount on production costs so your margins grow with your volume.
          </p>
          <div className="grid grid-cols-3 gap-5 mt-8">
            {[
              { label: 'Free plan', ex: 'Tee: ETB 420 production', profit: '~ETB 260 profit at ETB 780 price' },
              { label: 'Pro plan', ex: 'Tee: ETB 336 production (20% off)', profit: '~ETB 344 profit at ETB 780 price' },
              { label: 'Business', ex: 'Tee: ETB 294 production (30% off)', profit: '~ETB 386 profit at ETB 780 price' },
            ].map(e => (
              <div key={e.label} className="pf-card p-4 text-left">
                <div className="font-semibold text-pf-ink text-sm mb-1">{e.label}</div>
                <div className="text-xs text-pf-muted">{e.ex}</div>
                <div className="text-xs text-pf-olive font-medium mt-1">{e.profit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold text-pf-ink text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {FAQS.map(faq => (
            <div key={faq.q} className="pf-card p-5">
              <div className="font-semibold text-pf-ink mb-2">{faq.q}</div>
              <p className="text-sm text-pf-muted leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-pf-olive py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-3">Start selling today</h2>
        <p className="text-white/70 mb-7">No credit card required for the free plan.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-pf-olive
                                          font-semibold px-8 py-3.5 rounded-pf hover:bg-pf-paper transition-colors">
          Create free account <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
