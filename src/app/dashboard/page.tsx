import Link from 'next/link'
import {
  Package, ShoppingCart, TrendingUp, DollarSign,
  ArrowRight, Plus, Clock, CheckCircle2, AlertTriangle
} from 'lucide-react'

const STATS = [
  { label: 'Products', value: '12', icon: Package, delta: '+2 this month' },
  { label: 'Orders (30d)', value: '47', icon: ShoppingCart, delta: '+18% vs last month' },
  { label: 'Revenue (30d)', value: 'ETB 18,440', icon: DollarSign, delta: '+22% vs last month' },
  { label: 'Avg. profit margin', value: '34%', icon: TrendingUp, delta: '' },
]

const RECENT_ORDERS = [
  { id: 'PF-1A2B3C', product: 'Unisex Crafter Tee — M / Black', status: 'IN_PRODUCTION', amount: 'ETB 780', customer: 'Tigist A.', date: '2 hours ago' },
  { id: 'PF-4D5E6F', product: 'Classic Mug 11oz — White', status: 'SHIPPED', amount: 'ETB 340', customer: 'Bereket M.', date: '1 day ago' },
  { id: 'PF-7G8H9I', product: 'Premium Hoodie — L / Navy', status: 'DELIVERED', amount: 'ETB 960', customer: 'Selam T.', date: '3 days ago' },
  { id: 'PF-JKLMNO', product: 'Tote Bag — Standard', status: 'PENDING', amount: 'ETB 420', customer: 'Dawit K.', date: '1 hour ago' },
]

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING:       { label: 'Pending',       className: 'status-pending' },
  IN_PRODUCTION: { label: 'In Production', className: 'status-active' },
  SHIPPED:       { label: 'Shipped',       className: 'status-shipped' },
  DELIVERED:     { label: 'Delivered',     className: 'status-delivered' },
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pf-ink">Dashboard</h1>
          <p className="text-pf-muted text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Link href="/dashboard/catalog" className="btn-primary gap-2">
          <Plus size={16} />
          Add product
        </Link>
      </div>

      {/* Stats grid */}
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
            {s.delta && <div className="text-xs text-pf-sage mt-1">{s.delta}</div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 pf-card">
          <div className="flex items-center justify-between p-5 border-b border-pf-border">
            <h2 className="font-semibold text-pf-ink">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-pf-muted hover:text-pf-ink flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <table className="pf-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map(o => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/dashboard/orders/${o.id}`} className="font-mono text-xs text-pf-muted hover:text-pf-ink">
                      {o.id}
                    </Link>
                  </td>
                  <td className="max-w-[200px]">
                    <div className="text-sm truncate">{o.product}</div>
                    <div className="text-xs text-pf-muted">{o.date}</div>
                  </td>
                  <td className="text-sm">{o.customer}</td>
                  <td>
                    <span className={STATUS_MAP[o.status]?.className}>
                      {STATUS_MAP[o.status]?.label}
                    </span>
                  </td>
                  <td className="font-semibold text-sm">{o.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          {/* Get started */}
          <div className="pf-card p-5">
            <h3 className="font-semibold text-pf-ink mb-4">Get started</h3>
            <div className="space-y-3">
              {[
                { done: true,  label: 'Create your account', href: '#' },
                { done: true,  label: 'Browse the catalog', href: '/dashboard/catalog' },
                { done: false, label: 'Create your first product', href: '/dashboard/products/new' },
                { done: false, label: 'Connect a store', href: '/dashboard/stores' },
                { done: false, label: 'Get your first order', href: '/dashboard/orders' },
              ].map(step => (
                <div key={step.label} className="flex items-center gap-3">
                  {step.done
                    ? <CheckCircle2 size={16} className="text-pf-olive shrink-0" />
                    : <div className="w-4 h-4 rounded-full border-2 border-pf-border shrink-0" />
                  }
                  <Link href={step.href}
                    className={`text-sm ${step.done ? 'text-pf-muted line-through' : 'text-pf-ink hover:underline'}`}>
                    {step.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade nudge */}
          <div className="pf-card p-5 bg-pf-olive text-white">
            <div className="font-semibold mb-1">Upgrade to Pro</div>
            <p className="text-white/70 text-xs leading-relaxed mb-4">
              Get 20% off all production costs and unlock unlimited products.
            </p>
            <Link href="/dashboard/billing" className="inline-flex items-center gap-1.5 bg-white
                                                         text-pf-olive text-sm font-semibold
                                                         px-4 py-2 rounded-pf hover:bg-pf-paper transition-colors">
              Upgrade <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
