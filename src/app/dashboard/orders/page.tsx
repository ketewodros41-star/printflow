import Link from 'next/link'
import { Search, Filter, ChevronDown } from 'lucide-react'

const ORDERS = [
  { id: 'PF-1A2B3C', customer: 'Tigist Alemu', product: 'Unisex Crafter Tee — M / Black',  status: 'IN_PRODUCTION', amount: 'ETB 780',  date: '09 Oct 2026', payment: 'Chapa' },
  { id: 'PF-4D5E6F', customer: 'Bereket Mekonnen', product: 'Classic Mug 11oz — White',   status: 'SHIPPED',        amount: 'ETB 340',  date: '08 Oct 2026', payment: 'Telebirr' },
  { id: 'PF-7G8H9I', customer: 'Selam Tadesse',  product: 'Premium Hoodie — L / Navy',    status: 'DELIVERED',      amount: 'ETB 960',  date: '06 Oct 2026', payment: 'M-Pesa' },
  { id: 'PF-JKLMNO', customer: 'Dawit Kebede',   product: 'Tote Bag — Standard',          status: 'PENDING',        amount: 'ETB 420',  date: '09 Oct 2026', payment: 'Chapa' },
  { id: 'PF-PQRSTU', customer: 'Hiwot Girma',    product: 'Abstract Poster — A3',         status: 'PAID',           amount: 'ETB 290',  date: '08 Oct 2026', payment: 'Chapa' },
]

const STATUS: Record<string, { label: string; cls: string }> = {
  PENDING:       { label: 'Pending',       cls: 'status-pending' },
  PAID:          { label: 'Paid',          cls: 'badge bg-blue-50 text-blue-700 border-blue-100' },
  IN_PRODUCTION: { label: 'In Production', cls: 'status-active' },
  SHIPPED:       { label: 'Shipped',       cls: 'status-shipped' },
  DELIVERED:     { label: 'Delivered',     cls: 'status-delivered' },
  CANCELLED:     { label: 'Cancelled',     cls: 'status-error' },
}

export default function OrdersPage() {
  return (
    <div className="p-8">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pf-ink">Orders</h1>
          <p className="text-pf-muted text-sm mt-1">{ORDERS.length} total orders</p>
        </div>
        <button className="btn-secondary gap-2">
          <Filter size={15} /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pf-subtle" />
          <input className="pf-input pl-10" placeholder="Search by order ID, customer…" />
        </div>
        <button className="btn-secondary text-sm gap-1">Status <ChevronDown size={13} /></button>
        <button className="btn-secondary text-sm gap-1">Date range <ChevronDown size={13} /></button>
        <button className="btn-secondary text-sm gap-1">Payment <ChevronDown size={13} /></button>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {['All', 'Pending', 'In Production', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
          <button key={s}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${s === 'All' ? 'bg-pf-ink text-white' : 'border border-pf-border bg-white text-pf-muted hover:border-pf-ink'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="pf-card overflow-hidden">
        <table className="pf-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map(o => (
              <tr key={o.id}>
                <td>
                  <Link href={`/dashboard/orders/${o.id}`}
                    className="font-mono text-xs text-pf-olive font-semibold hover:underline">
                    {o.id}
                  </Link>
                </td>
                <td className="text-sm">{o.customer}</td>
                <td className="text-sm text-pf-muted max-w-[220px]">
                  <div className="truncate">{o.product}</div>
                </td>
                <td>
                  <span className={STATUS[o.status]?.cls}>{STATUS[o.status]?.label}</span>
                </td>
                <td>
                  <span className="text-xs font-medium text-pf-muted">{o.payment}</span>
                </td>
                <td className="font-semibold text-sm">{o.amount}</td>
                <td className="text-sm text-pf-subtle">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
