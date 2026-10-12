import Link from 'next/link'
import { CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react'

export default function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { ref?: string; method?: string }
}) {
  const orderRef = searchParams.ref ?? 'PF-XXXXXXXX'
  const method   = searchParams.method ?? 'Chapa'

  return (
    <div className="min-h-screen bg-pf-cream flex flex-col">
      <div className="bg-white border-b border-pf-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <span className="font-bold text-pf-ink">Addis Style Hub</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-pf-mint rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-pf-olive" />
          </div>

          <h1 className="text-3xl font-extrabold text-pf-ink mb-2">Order confirmed!</h1>
          <p className="text-pf-muted mb-6">
            Thank you for your purchase. We've received your order and it's being processed.
          </p>

          {/* Order details */}
          <div className="pf-card p-5 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-pf-subtle uppercase tracking-wide mb-1">Order number</div>
                <div className="font-mono font-semibold text-pf-ink">{orderRef}</div>
              </div>
              <div>
                <div className="text-xs text-pf-subtle uppercase tracking-wide mb-1">Payment method</div>
                <div className="font-semibold text-pf-ink">{method}</div>
              </div>
              <div>
                <div className="text-xs text-pf-subtle uppercase tracking-wide mb-1">Estimated delivery</div>
                <div className="font-semibold text-pf-ink">Oct 13–15, 2026</div>
              </div>
              <div>
                <div className="text-xs text-pf-subtle uppercase tracking-wide mb-1">Status</div>
                <span className="status-active text-xs">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-8">
            {[
              { icon: CheckCircle2, label: 'Order placed & payment confirmed', done: true },
              { icon: Package,      label: 'Sent to print provider', done: true },
              { icon: Package,      label: 'In production',           done: false },
              { icon: Truck,        label: 'Shipped',                 done: false },
              { icon: CheckCircle2, label: 'Delivered',               done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <step.icon
                  size={16}
                  className={step.done ? 'text-pf-olive' : 'text-pf-border'}
                />
                <span className={`text-sm ${step.done ? 'text-pf-ink' : 'text-pf-muted'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-sm text-pf-muted mb-6">
            You'll receive a confirmation email with tracking details once your order ships.
          </p>

          <div className="flex gap-3">
            <Link href={`/store/${params.slug}`} className="btn-secondary flex-1 justify-center">
              Continue shopping
            </Link>
            <Link href="#" className="btn-primary flex-1 justify-center gap-1.5">
              Track order <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
