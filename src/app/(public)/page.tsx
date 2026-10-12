import Link from 'next/link'
import { ArrowRight, Star, Package, Truck, Zap, CheckCircle2, ChevronRight } from 'lucide-react'

const STATS = [
  { label: 'Products in catalog', value: '500+' },
  { label: 'Print providers', value: '12' },
  { label: 'Merchants active', value: '2,400+' },
  { label: 'Orders fulfilled', value: '18K+' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose a product',
    desc: 'Browse 500+ blank products — T-shirts, mugs, posters and more from verified Ethiopian print providers.',
  },
  {
    step: '02',
    title: 'Add your design',
    desc: 'Upload your artwork or create it in our editor. See a realistic mockup instantly on every product.',
  },
  {
    step: '03',
    title: 'Set your price',
    desc: 'We show your production and shipping costs. Set any retail price — your profit is calculated live.',
  },
  {
    step: '04',
    title: 'We handle fulfillment',
    desc: 'When a shopper buys, we automatically route the order. The provider prints, packs and ships it for you.',
  },
]

const FEATURES = [
  {
    icon: Package,
    title: 'No inventory risk',
    desc: 'Products are made on demand. You never buy stock upfront or deal with unsold items.',
  },
  {
    icon: Truck,
    title: 'Fast local shipping',
    desc: 'Partnered with print providers across Addis Ababa and major Ethiopian cities for quick delivery.',
  },
  {
    icon: Zap,
    title: 'Ethiopian payments',
    desc: 'Accept payments via Chapa, Safaricom M-Pesa and Telebirr — payment methods your customers already use.',
  },
  {
    icon: Star,
    title: 'Quality guaranteed',
    desc: 'All print providers are vetted and rated. We step in whenever an order goes wrong.',
  },
]

const CATEGORIES = [
  { label: "T-Shirts", count: 48, emoji: "👕" },
  { label: "Hoodies", count: 22, emoji: "🧥" },
  { label: "Mugs", count: 15, emoji: "☕" },
  { label: "Posters", count: 30, emoji: "🖼️" },
  { label: "Phone Cases", count: 40, emoji: "📱" },
  { label: "Bags", count: 18, emoji: "👜" },
]

export default function LandingPage() {
  return (
    <div className="bg-pf-cream">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-pf-olive text-white text-xs font-semibold mb-6">
              <Star size={12} fill="currentColor" />
              Ethiopia's first print-on-demand platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-pf-ink leading-none tracking-tighter mb-5">
              Design.<br />
              Sell.<br />
              <span className="text-pf-sage">Ship.</span>
            </h1>

            <p className="text-lg text-pf-muted leading-relaxed mb-8 max-w-md">
              Create custom products with your designs, sell them in your online store,
              and have them printed and shipped automatically — without holding any stock.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/signup" className="btn-primary text-base px-7 py-3 gap-2">
                Start for free
                <ArrowRight size={16} />
              </Link>
              <Link href="/catalog" className="btn-secondary text-base px-7 py-3">
                Browse catalog
              </Link>
            </div>

            <p className="text-sm text-pf-subtle mt-4">
              No credit card required · Free plan available
            </p>
          </div>

          {/* Hero product cards */}
          <div className="relative lg:block hidden">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 — featured product */}
              <div className="pf-card overflow-hidden col-span-2">
                <div className="aspect-[16/7] bg-gradient-to-br from-pf-paper to-pf-divider
                                flex items-center justify-center relative">
                  <div className="w-32 h-32 bg-pf-divider rounded-full flex items-center justify-center">
                    <span className="text-5xl">👕</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="star-badge">★ Top rated</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-pf-olive text-white text-xs font-bold
                                  px-2 py-1 rounded-sm">
                    PrintFlow Choice
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-pf-ink">Unisex Organic Crafter Tee</div>
                  <div className="text-pf-muted text-sm mt-0.5">5 sizes · 7 colors</div>
                  <div className="mt-2 font-bold text-pf-ink">From ETB 420</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="pf-card overflow-hidden">
                <div className="aspect-square bg-pf-paper flex items-center justify-center">
                  <span className="text-4xl">☕</span>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-pf-ink">Classic Mug 11oz</div>
                  <div className="text-sm text-pf-muted mt-1">From ETB 280</div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="pf-card overflow-hidden">
                <div className="aspect-square bg-pf-paper flex items-center justify-center">
                  <span className="text-4xl">🧥</span>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-pf-ink">Premium Hoodie</div>
                  <div className="text-sm text-pf-muted mt-1">From ETB 840</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {STATS.map(s => (
            <div key={s.label} className="pf-card p-5 text-center">
              <div className="text-2xl font-extrabold text-pf-ink">{s.value}</div>
              <div className="text-sm text-pf-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="bg-pf-paper py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-pf-ink tracking-tight">How it works</h2>
            <p className="text-pf-muted mt-3 text-lg">From design to delivery in four steps</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(s => (
              <div key={s.step} className="pf-card p-6">
                <div className="text-3xl font-black text-pf-divider mb-4">{s.step}</div>
                <h3 className="font-semibold text-pf-ink mb-2">{s.title}</h3>
                <p className="text-sm text-pf-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category grid ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-pf-ink">Explore PrintFlow's best</h2>
            <p className="text-pf-muted mt-2">Most popular product categories in our catalog</p>
          </div>
          <Link href="/catalog" className="btn-secondary text-sm gap-1.5">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(c => (
            <Link
              key={c.label}
              href={`/catalog?category=${c.label.toLowerCase()}`}
              className="pf-card-hover p-5 flex flex-col items-center text-center gap-3"
            >
              <span className="text-3xl">{c.emoji}</span>
              <div>
                <div className="text-sm font-semibold text-pf-ink">{c.label}</div>
                <div className="text-xs text-pf-muted mt-0.5">{c.count} products</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="bg-pf-paper py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-pf-ink tracking-tight">
              Everything you need to sell
            </h2>
            <p className="text-pf-muted mt-3 text-lg max-w-xl mx-auto">
              PrintFlow handles printing, packing and shipping.
              You focus on designs and marketing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="pf-card p-7 flex items-start gap-5">
                <div className="w-12 h-12 rounded-pf bg-pf-divider flex items-center justify-center shrink-0">
                  <f.icon size={22} className="text-pf-olive" />
                </div>
                <div>
                  <h3 className="font-semibold text-pf-ink text-lg mb-1.5">{f.title}</h3>
                  <p className="text-pf-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment methods ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="pf-card p-10 text-center">
          <h2 className="text-3xl font-extrabold text-pf-ink mb-3">
            Payments built for Ethiopia
          </h2>
          <p className="text-pf-muted mb-8 max-w-lg mx-auto">
            Accept payments through the platforms your customers already trust and use every day.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 px-6 py-4 rounded-pf border border-pf-border bg-pf-paper">
              <div className="w-8 h-8 rounded-full bg-pf-chapa flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-pf-ink text-sm">Chapa</div>
                <div className="text-xs text-pf-muted">Cards & mobile</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 rounded-pf border border-pf-border bg-pf-paper">
              <div className="w-8 h-8 rounded-full bg-pf-mpesa flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-pf-ink text-sm">M-Pesa</div>
                <div className="text-xs text-pf-muted">Safaricom</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 rounded-pf border border-pf-border bg-pf-paper">
              <div className="w-8 h-8 rounded-full bg-pf-telebirr flex items-center justify-center">
                <span className="text-white font-bold text-xs">T</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-pf-ink text-sm">Telebirr</div>
                <div className="text-xs text-pf-muted">Ethio Telecom</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-pf-olive py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Ready to start selling?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join thousands of Ethiopian merchants already using PrintFlow.
            Free to start — no credit card required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-pf-olive font-semibold
                         text-base px-8 py-3.5 rounded-pf hover:bg-pf-paper transition-colors"
            >
              Create free account <ArrowRight size={18} />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-white/60 text-sm">
            {['Free plan available', 'No stock needed', 'Ship anywhere in Ethiopia'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
