import { Search, MapPin, Star, Package, Clock } from 'lucide-react'

const PROVIDERS = [
  {
    id: '1', name: 'AddisThread Prints', location: 'Bole, Addis Ababa',
    rating: 4.9, products: 48, avgProdDays: 1.4, status: 'ACTIVE',
    methods: ['DTG', 'Screen Print'],
  },
  {
    id: '2', name: 'Habesha Print Co.', location: 'Piassa, Addis Ababa',
    rating: 4.7, products: 32, avgProdDays: 2.1, status: 'ACTIVE',
    methods: ['Embroidery', 'DTG'],
  },
  {
    id: '3', name: 'Merkato Custom', location: 'Merkato, Addis Ababa',
    rating: 4.5, products: 20, avgProdDays: 2.8, status: 'PENDING',
    methods: ['Screen Print'],
  },
  {
    id: '4', name: 'Bahir Dar Prints', location: 'Bahir Dar, Amhara',
    rating: 4.3, products: 15, avgProdDays: 3.2, status: 'ACTIVE',
    methods: ['DTG'],
  },
]

export default function AdminProvidersPage() {
  return (
    <div className="p-8">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pf-ink">Print Providers</h1>
          <p className="text-pf-muted text-sm mt-1">{PROVIDERS.length} providers</p>
        </div>
        <button className="btn-primary gap-2">+ Onboard provider</button>
      </div>

      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pf-subtle" />
        <input className="pf-input pl-10 max-w-sm" placeholder="Search providers…" />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {PROVIDERS.map(p => (
          <div key={p.id} className="pf-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-pf-ink">{p.name}</div>
                <div className="flex items-center gap-1 text-xs text-pf-muted mt-0.5">
                  <MapPin size={11} /> {p.location}
                </div>
              </div>
              <span className={p.status === 'ACTIVE' ? 'status-active' : 'badge bg-amber-50 text-amber-700 border-amber-100'}>
                {p.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className="font-semibold">{p.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-pf-muted">
                <Package size={12} /> {p.products} products
              </div>
              <div className="flex items-center gap-1 text-pf-muted">
                <Clock size={12} /> {p.avgProdDays} day avg.
              </div>
            </div>

            <div className="flex gap-1.5 flex-wrap mb-4">
              {p.methods.map(m => (
                <span key={m} className="badge-neutral text-xs">{m}</span>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="btn-secondary text-xs px-3 py-1.5">View details</button>
              {p.status === 'PENDING' && (
                <button className="btn-primary text-xs px-3 py-1.5">Approve</button>
              )}
              {p.status === 'ACTIVE' && (
                <button className="btn-ghost text-xs px-3 py-1.5 text-red-500 hover:bg-red-50">
                  Suspend
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
