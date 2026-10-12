import Link from 'next/link'
import { Plus, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'

const STORES = [
  {
    id: '1', name: 'Addis Style Hub', type: 'SHOPIFY',
    url: 'addis-style.myshopify.com',
    isConnected: true, products: 12, orders: 47,
    logo: '🛍️',
  },
  {
    id: '2', name: 'PrintFlow Hosted Store', type: 'HOSTED',
    url: 'addis-style.printflow.et',
    isConnected: true, products: 8, orders: 12,
    logo: '🏪',
  },
]

const CHANNELS = [
  { type: 'SHOPIFY',     label: 'Shopify',       logo: '🟢', desc: "World's leading ecommerce platform" },
  { type: 'ETSY',        label: 'Etsy',          logo: '🛍️', desc: 'Marketplace for handmade & custom products' },
  { type: 'WOOCOMMERCE', label: 'WooCommerce',   logo: '🔷', desc: 'Open-source WordPress ecommerce' },
  { type: 'AMAZON',      label: 'Amazon',        logo: '📦', desc: "World's largest marketplace" },
  { type: 'TIKTOK',      label: 'TikTok Shop',   logo: '🎵', desc: 'Social commerce for younger buyers' },
  { type: 'MANUAL',      label: 'Manual orders', logo: '✏️', desc: 'Create orders manually for testing' },
]

export default function StoresPage() {
  return (
    <div className="p-8">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pf-ink">Stores</h1>
          <p className="text-pf-muted text-sm mt-1">Connect your sales channels</p>
        </div>
        <Link href="/dashboard/stores/connect" className="btn-primary gap-2">
          <Plus size={16} /> Connect store
        </Link>
      </div>

      {/* Connected stores */}
      {STORES.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-pf-ink mb-4">Connected stores</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {STORES.map(store => (
              <div key={store.id} className="pf-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{store.logo}</div>
                    <div>
                      <div className="font-semibold text-pf-ink">{store.name}</div>
                      <div className="text-xs text-pf-muted flex items-center gap-1 mt-0.5">
                        {store.url}
                        <ExternalLink size={10} />
                      </div>
                    </div>
                  </div>
                  {store.isConnected
                    ? <div className="flex items-center gap-1 text-xs text-pf-olive font-medium">
                        <CheckCircle2 size={13} /> Connected
                      </div>
                    : <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
                        <AlertCircle size={13} /> Disconnected
                      </div>
                  }
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-pf-ink">{store.products}</span>
                    <span className="text-pf-muted ml-1">products</span>
                  </div>
                  <div>
                    <span className="font-semibold text-pf-ink">{store.orders}</span>
                    <span className="text-pf-muted ml-1">orders</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="btn-secondary text-xs px-3 py-1.5">Manage</button>
                  <button className="btn-ghost text-xs px-3 py-1.5">Disconnect</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available channels */}
      <div>
        <h2 className="text-lg font-semibold text-pf-ink mb-4">Available sales channels</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHANNELS.map(ch => (
            <div key={ch.type} className="pf-card-hover p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{ch.logo}</div>
                <div className="font-semibold text-pf-ink">{ch.label}</div>
              </div>
              <p className="text-sm text-pf-muted mb-4">{ch.desc}</p>
              <Link href="/dashboard/stores/connect" className="btn-secondary text-xs px-3 py-1.5">
                Connect
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
