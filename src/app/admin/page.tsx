import { Users, Package, ShoppingCart, Printer, TrendingUp, AlertTriangle } from 'lucide-react'

const STATS = [
  { label: 'Total merchants',   value: '2,418', delta: '+84 this week',  icon: Users,       good: true },
  { label: 'Active products',   value: '14,209', delta: '+312 this week', icon: Package,     good: true },
  { label: 'Orders (7d)',       value: '1,847',  delta: '+18% vs prev.',  icon: ShoppingCart, good: true },
  { label: 'Revenue (7d)',      value: 'ETB 2.1M', delta: '+22%',         icon: TrendingUp,  good: true },
  { label: 'Active providers',  value: '12',     delta: '2 pending',      icon: Printer,     good: false },
  { label: 'Open support',      value: '23',     delta: '5 urgent',       icon: AlertTriangle, good: false },
]

const RECENT_ORDERS = [
  { id: 'PF-1A2B3C', merchant: 'Addis Style Hub', customer: 'Tigist A.', status: 'IN_PRODUCTION', amount: 'ETB 780' },
  { id: 'PF-4D5E6F', merchant: 'Habesha Prints',  customer: 'Bereket M.', status: 'SHIPPED',      amount: 'ETB 340' },
  { id: 'PF-7G8H9I', merchant: 'EthioTees',        customer: 'Selam T.',  status: 'DELIVERED',     amount: 'ETB 960' },
  { id: 'PF-JKLMNO', merchant: 'Bole Fashion',    customer: 'Dawit K.',  status: 'PENDING',       amount: 'ETB 420' },
]

const STATUS_MAP: Record<string, string> = {
  PENDING:       'status-pending',
  IN_PRODUCTION: 'status-active',
  SHIPPED:       'status-shipped',
  DELIVERED:     'status-delivered',
}

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-pf-ink">Platform Overview</h1>
        <p className="text-pf-muted text-sm mt-1">Real-time health of PrintFlow</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="pf-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-pf-muted">{s.label}</span>
              <s.icon size={16} className={s.good ? 'text-pf-olive' : 'text-amber-500'} />
            </div>
            <div className="text-2xl font-bold text-pf-ink">{s.value}</div>
            <div className={`text-xs mt-1 ${s.good ? 'text-pf-sage' : 'text-amber-600'}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="pf-card overflow-hidden">
        <div className="px-5 py-4 border-b border-pf-border flex items-center justify-between">
          <h2 className="font-semibold text-pf-ink">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-pf-muted hover:text-pf-ink">View all →</a>
        </div>
        <table className="pf-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Merchant</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map(o => (
              <tr key={o.id}>
                <td className="font-mono text-xs">{o.id}</td>
                <td className="text-sm">{o.merchant}</td>
                <td className="text-sm text-pf-muted">{o.customer}</td>
                <td><span className={STATUS_MAP[o.status]}>{o.status.replace('_', ' ')}</span></td>
                <td className="font-semibold text-sm">{o.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
