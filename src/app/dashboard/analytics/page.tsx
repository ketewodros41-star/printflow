import { TrendingUp, ShoppingCart, DollarSign, Users } from 'lucide-react'

const STATS = [
  { label: 'Total Revenue', value: 'ETB 48,320', delta: '+22%', icon: DollarSign, up: true },
  { label: 'Orders', value: '183', delta: '+18%', icon: ShoppingCart, up: true },
  { label: 'Avg Order Value', value: 'ETB 264', delta: '+4%', icon: TrendingUp, up: true },
  { label: 'Repeat Customers', value: '34%', delta: '-2%', icon: Users, up: false },
]

const TOP_PRODUCTS = [
  { name: 'Custom Logo Tee', orders: 74, revenue: 'ETB 18,720', pct: 78 },
  { name: 'Mountain Mug', orders: 42, revenue: 'ETB 7,980', pct: 44 },
  { name: 'Abstract Hoodie', orders: 31, revenue: 'ETB 11,780', pct: 33 },
  { name: 'Motivational Poster', orders: 18, revenue: 'ETB 3,240', pct: 19 },
  { name: 'Premium Hoodie', orders: 18, revenue: 'ETB 6,600', pct: 19 },
]

// Simple bar chart using divs
const MONTHLY = [
  { month: 'Apr', value: 4200 },
  { month: 'May', value: 5800 },
  { month: 'Jun', value: 4900 },
  { month: 'Jul', value: 7200 },
  { month: 'Aug', value: 8100 },
  { month: 'Sep', value: 9400 },
  { month: 'Oct', value: 8720 },
]

export default function AnalyticsPage() {
  const maxVal = Math.max(...MONTHLY.map(m => m.value))

  return (
    <div className="p-8">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-pf-ink">Analytics</h1>
        <p className="text-pf-muted text-sm mt-1">Performance overview for the last 30 days.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="pf-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-pf-muted">{s.label}</span>
              <div className="w-8 h-8 rounded-pf bg-pf-divider flex items-center justify-center">
                <s.icon size={16} className="text-pf-olive" />
              </div>
            </div>
            <div className="text-2xl font-bold text-pf-ink">{s.value}</div>
            <div className={`text-xs mt-1 ${s.up ? 'text-pf-sage' : 'text-red-500'}`}>{s.delta} vs last period</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-3 pf-card p-6">
          <h2 className="font-semibold text-pf-ink mb-6">Monthly Revenue (ETB)</h2>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] text-pf-muted font-medium">
                  {(m.value / 1000).toFixed(1)}k
                </div>
                <div className="w-full rounded-t bg-pf-olive/80 hover:bg-pf-olive transition-colors cursor-pointer"
                  style={{ height: `${(m.value / maxVal) * 160}px` }} />
                <div className="text-[10px] text-pf-subtle">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="lg:col-span-2 pf-card p-6">
          <h2 className="font-semibold text-pf-ink mb-5">Top Products</h2>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-pf-ink truncate flex-1 pr-2">
                    <span className="text-pf-muted mr-1.5">#{i + 1}</span>{p.name}
                  </span>
                  <span className="text-xs font-semibold text-pf-ink shrink-0">{p.revenue}</span>
                </div>
                <div className="h-1.5 bg-pf-divider rounded-full overflow-hidden">
                  <div className="h-full bg-pf-olive rounded-full transition-all"
                    style={{ width: `${p.pct}%` }} />
                </div>
                <div className="text-[10px] text-pf-subtle mt-1">{p.orders} orders</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
