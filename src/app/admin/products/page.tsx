import { Search } from 'lucide-react'

const PRODUCTS = [
  { id: '1', title: 'Custom Logo Tee', merchant: 'Addis Style Hub', status: 'PUBLISHED', orders: 24, revenue: 'ETB 18,720' },
  { id: '2', title: 'Mountain Mug',    merchant: 'EthioTees',         status: 'PUBLISHED', orders: 8,  revenue: 'ETB 2,720' },
  { id: '3', title: 'Abstract Hoodie', merchant: 'Bole Fashion',     status: 'DRAFT',     orders: 0,  revenue: 'ETB 0' },
]

const S: Record<string, string> = {
  PUBLISHED: 'status-active',
  DRAFT:     'status-pending',
  PAUSED:    'badge-neutral',
}

export default function AdminProductsPage() {
  return (
    <div className="p-8">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-pf-ink">All Products</h1>
        <p className="text-pf-muted text-sm mt-1">Across all merchants</p>
      </div>

      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pf-subtle" />
        <input className="pf-input pl-10 max-w-sm" placeholder="Search products…" />
      </div>

      <div className="pf-card overflow-hidden">
        <table className="pf-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Merchant</th>
              <th>Status</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map(p => (
              <tr key={p.id}>
                <td className="font-medium text-sm">{p.title}</td>
                <td className="text-sm text-pf-muted">{p.merchant}</td>
                <td><span className={S[p.status]}>{p.status}</span></td>
                <td className="text-sm">{p.orders}</td>
                <td className="font-semibold text-sm">{p.revenue}</td>
                <td>
                  <button className="text-xs text-pf-muted hover:text-pf-ink underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
