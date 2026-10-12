import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const CHANNELS = [
  { type: 'SHOPIFY', label: 'Shopify', logo: '🟢', primary: true,
    desc: 'Connect your Shopify store to automatically sync products and receive orders.' },
  { type: 'ETSY', label: 'Etsy', logo: '🛍️',
    desc: 'List your custom products on Etsy and have orders fulfilled automatically.' },
  { type: 'WOOCOMMERCE', label: 'WooCommerce', logo: '🔷',
    desc: 'Install our WooCommerce plugin and connect your WordPress store.' },
  { type: 'HOSTED', label: 'PrintFlow Hosted Store', logo: '🏪', primary: true,
    desc: 'Create a free hosted store on printflow.et — no external platform needed.' },
  { type: 'MANUAL', label: 'Manual / Test orders', logo: '✏️',
    desc: 'Create manual orders to test fulfillment without a connected store.' },
]

export default function ConnectStorePage() {
  return (
    <div className="p-8 max-w-3xl">
      <Link href="/dashboard/stores"
        className="flex items-center gap-2 text-sm text-pf-muted hover:text-pf-ink mb-6">
        <ArrowLeft size={15} /> Back to stores
      </Link>

      <div className="page-header">
        <h1 className="text-2xl font-bold text-pf-ink">Connect a sales channel</h1>
        <p className="text-pf-muted text-sm mt-1">
          Choose where you want to sell your products. You can connect multiple stores.
        </p>
      </div>

      <div className="space-y-3">
        {CHANNELS.map(ch => (
          <div key={ch.type} className={`pf-card p-5 flex items-center justify-between gap-4
            ${ch.primary ? 'border-pf-olive/30 bg-pf-mint/10' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="text-3xl">{ch.logo}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-pf-ink">{ch.label}</span>
                  {ch.primary && <span className="badge-olive text-xs">Recommended</span>}
                </div>
                <p className="text-sm text-pf-muted mt-0.5">{ch.desc}</p>
              </div>
            </div>
            <button className="btn-primary shrink-0 text-sm px-5 py-2">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
