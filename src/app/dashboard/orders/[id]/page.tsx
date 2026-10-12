import Link from 'next/link'
import { ArrowLeft, Package, Truck, CreditCard, User, MapPin, RefreshCw } from 'lucide-react'
import { ProductMockupWithArt } from '@/components/mockups/ProductMockups'
import { SAMPLE_GRAPHICS } from '@/lib/sampleGraphics'

const ORDER = {
  id: 'PF-1A2B3C',
  status: 'IN_PRODUCTION',
  date: 'Oct 9, 2026 at 10:24 AM',
  customer: { name: 'Tigist Alemu', email: 'tigist@email.com', phone: '+251 91 234 5678' },
  shipping: {
    address: 'Bole Road, Near Megenagna', city: 'Addis Ababa',
    region: 'Addis Ababa', country: 'Ethiopia',
  },
  items: [
    {
      id: '1', title: 'Habesha Roast Unisex Crafter Organic Tee',
      variant: 'M / Black', qty: 2, unitPrice: 780, production: 420, shipping: 80,
      type: 'tshirt' as const,
      color: '#1A1A12',
      artworkUrl: SAMPLE_GRAPHICS[1].previewUrl,
    },
  ],

  payment: {
    method: 'Chapa', ref: 'CHAPA-TXN-ABC123',
    subtotal: 1560, shippingTotal: 160, total: 1720,
    status: 'PAID',
  },
  fulfillment: {
    provider: 'AddisThread Prints',
    providerStatus: 'In Production',
    trackingNumber: null,
    carrier: null,
    estimatedDelivery: 'Oct 13–15, 2026',
  },
  timeline: [
    { time: '10:24 AM', label: 'Order placed', done: true },
    { time: '10:25 AM', label: 'Payment confirmed via Chapa', done: true },
    { time: '10:30 AM', label: 'Sent to AddisThread Prints', done: true },
    { time: null, label: 'In production', done: false },
    { time: null, label: 'Shipped', done: false },
    { time: null, label: 'Delivered', done: false },
  ],
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8 max-w-5xl">
      {/* Back */}
      <Link href="/dashboard/orders"
        className="flex items-center gap-2 text-sm text-pf-muted hover:text-pf-ink mb-6">
        <ArrowLeft size={15} /> Back to orders
      </Link>

      {/* Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-pf-ink">Order {ORDER.id}</h1>
            <span className="status-active">In Production</span>
          </div>
          <p className="text-sm text-pf-muted">Placed on {ORDER.date}</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary gap-2"><RefreshCw size={14} /> Refresh</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-5">

          {/* Items */}
          <div className="pf-card">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-pf-border">
              <Package size={16} className="text-pf-muted" />
              <span className="font-semibold text-pf-ink">Order Items</span>
            </div>
            <div className="p-5 space-y-4">
              {ORDER.items.map(item => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#F2EFE8] border border-[#E5E2DC] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <ProductMockupWithArt
                      type={item.type}
                      color={item.color}
                      artworkUrl={item.artworkUrl}
                      className="w-full h-full drop-shadow-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-pf-ink">{item.title}</div>
                    <div className="text-sm text-pf-muted mt-0.5">{item.variant} · Qty: {item.qty}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-pf-ink">ETB {(item.unitPrice * item.qty).toLocaleString()}</div>
                    <div className="text-xs text-pf-muted mt-0.5">ETB {item.unitPrice.toLocaleString()} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment */}
          <div className="pf-card">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-pf-border">
              <Truck size={16} className="text-pf-muted" />
              <span className="font-semibold text-pf-ink">Fulfillment</span>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-pf-subtle uppercase tracking-wide mb-1">Print Provider</div>
                <div className="text-sm font-medium text-pf-ink">{ORDER.fulfillment.provider}</div>
                <div className="text-sm text-pf-muted">{ORDER.fulfillment.providerStatus}</div>
              </div>
              <div>
                <div className="text-xs text-pf-subtle uppercase tracking-wide mb-1">Est. Delivery</div>
                <div className="text-sm font-medium text-pf-ink">{ORDER.fulfillment.estimatedDelivery}</div>
              </div>
              <div>
                <div className="text-xs text-pf-subtle uppercase tracking-wide mb-1">Tracking</div>
                {ORDER.fulfillment.trackingNumber
                  ? <div className="text-sm font-medium text-pf-ink">{ORDER.fulfillment.trackingNumber}</div>
                  : <div className="text-sm text-pf-subtle italic">Not yet available</div>
                }
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="pf-card p-5">
            <h3 className="font-semibold text-pf-ink mb-5">Order Timeline</h3>
            <div className="relative">
              <div className="absolute left-[11px] top-0 bottom-0 w-px bg-pf-divider" />
              <div className="space-y-4">
                {ORDER.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10
                      ${event.done ? 'border-pf-olive bg-pf-olive' : 'border-pf-border bg-white'}`}>
                      {event.done && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="pt-0.5">
                      <div className={`text-sm font-medium ${event.done ? 'text-pf-ink' : 'text-pf-muted'}`}>
                        {event.label}
                      </div>
                      {event.time && <div className="text-xs text-pf-subtle">{event.time}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="pf-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={15} className="text-pf-muted" />
              <span className="font-semibold text-pf-ink">Customer</span>
            </div>
            <div className="text-sm font-medium text-pf-ink">{ORDER.customer.name}</div>
            <div className="text-sm text-pf-muted mt-0.5">{ORDER.customer.email}</div>
            <div className="text-sm text-pf-muted">{ORDER.customer.phone}</div>
          </div>

          {/* Shipping */}
          <div className="pf-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={15} className="text-pf-muted" />
              <span className="font-semibold text-pf-ink">Shipping Address</span>
            </div>
            <div className="text-sm text-pf-muted space-y-0.5">
              <div>{ORDER.shipping.address}</div>
              <div>{ORDER.shipping.city}</div>
              <div>{ORDER.shipping.region}, {ORDER.shipping.country}</div>
            </div>
          </div>

          {/* Payment */}
          <div className="pf-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={15} className="text-pf-muted" />
              <span className="font-semibold text-pf-ink">Payment</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-pf-muted">Subtotal</span>
                <span>ETB {ORDER.payment.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pf-muted">Shipping</span>
                <span>ETB {ORDER.payment.shippingTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-pf-border pt-2 mt-2">
                <span>Total</span>
                <span>ETB {ORDER.payment.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-pf-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-pf-muted">Method</span>
                <span className="text-xs font-medium">{ORDER.payment.method}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-pf-muted">Ref</span>
                <span className="text-xs font-mono text-pf-subtle">{ORDER.payment.ref}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-pf-muted">Status</span>
                <span className="status-active text-xs">{ORDER.payment.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
