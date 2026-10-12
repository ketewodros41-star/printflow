import Link from 'next/link'
import { Search, Filter } from 'lucide-react'

const ORDERS = [
  { id: 'PF-1A2B3C', merchant: 'Addis Style Hub',  customer: 'Tigist A.',  product: 'Crafter Tee M/Black', status: 'IN_PRODUCTION', amount: 'ETB 780',  payment: 'Chapa',    provider: 'AddisThread' },
  { id: 'PF-4D5E6F', merchant: 'Habesha Prints',   customer: 'Bereket M.', product: 'Classic Mug White',  status: 'SHIPPED',       amount: 'ETB 340',  payment: 'Telebirr', provider: 'AddisThread' },
  { id: 'PF-7G8H9I', merchant: 'EthioTees',         customer: 'Selam T.',  product: 'Premium Hoodie L',   status: 'DELIVERED',     amount: 'ETB 960',  payment: 'M-Pesa',   provider: 'Habesha Print' },
  { id: 'PF-JKLMNO', merchant: 'Bole Fashion',     customer: 'Dawit K.',   product: 'Tote Bag Standard',  status: 'PENDING',       amount: 'ETB 420',  payment: 'Chapa',    provider: '—' },
  { id: 'PF-PQRSTU', merchant: 'Addis Style Hub',  customer: 'Hiwot G.',   product: 'Abstract Poster A3', status: 'FAILED',        amount: 'ETB 290',  payment: 'Chapa',    provider: '—' },
]

const S: Record<string, string> = {
  PENDING:       'status-pending',
  IN_PRODUCTION: 'status-active',
  SHIPPED:       'status-shipped',
  DELIVERED:     'status-delivered',
  FAILED:        'status-error',
}

export default function AdminOrdersPage() {
  return (
    <div className="p-8">
      <div className="page-header flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pf-ink">All Orders</h1>
        <button className="btn-secondary gap-2 text-sm"><Filter size={14} /> Export CSV</button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pf-subtle" />
          <input className="pf-input pl-10" placeholder="Search order ID, merchant, customer…" />
        </div>
      </div>

      <div className="pf-card overflow-hidden">
        <table className="pf-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Merchant</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Provider</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map(o => (
              <tr key={o.id}>
                <td className="font-mono text-xs font-semibold text-pf-olive">{o.id}</td>
                <td className="text-sm">{o.merchant}</td>
                <td className="text-sm text-pf-muted">{o.customer}</td>
                <td className="text-sm text-pf-muted max-w-[160px]">
                  <div className="truncate">{o.product}</div>
                </td>
                <td><span className={S[o.status]}>{o.status.replace('_', ' ')}</span></td>
                <td className="text-xs text-pf-muted">{o.payment}</td>
                <td className="text-xs text-pf-muted">{o.provider}</td>
                <td className="font-semibold text-sm">{o.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
