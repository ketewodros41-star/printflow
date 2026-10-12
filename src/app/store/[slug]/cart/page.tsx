'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { ProductMockupWithArt } from '@/components/mockups/ProductMockups'
import { SAMPLE_GRAPHICS } from '@/lib/sampleGraphics'

const CART_ITEMS = [
  {
    id: '1',
    title: 'Habesha Roast Signature Tee',
    variant: 'M / Black',
    qty: 2,
    price: 780,
    type: 'tshirt' as const,
    color: '#1A1A12',
    artworkUrl: SAMPLE_GRAPHICS[1].previewUrl,
  },
  {
    id: '2',
    title: 'Highland Explorer Ceramic Mug',
    variant: 'White / 11 oz',
    qty: 1,
    price: 340,
    type: 'mug' as const,
    color: '#FFFFFF',
    artworkUrl: SAMPLE_GRAPHICS[0].previewUrl,
  },
]


export default function CartPage({ params }: { params: { slug: string } }) {
  const [items, setItems] = useState(CART_ITEMS)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shipping  = 120
  const total     = subtotal + shipping

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <div className="min-h-screen bg-pf-cream">
      <div className="bg-white border-b border-pf-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href={`/store/${params.slug}`} className="font-bold text-pf-ink">← Addis Style Hub</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-pf-ink mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-pf-divider mb-4" />
            <h3 className="font-semibold text-pf-ink mb-2">Your cart is empty</h3>
            <Link href={`/store/${params.slug}`} className="btn-primary mt-4">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Items */}
            <div className="md:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="pf-card p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F2EFE8] rounded-xl border border-[#E5E2DC] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <ProductMockupWithArt
                      type={item.type}
                      color={item.color}
                      artworkUrl={item.artworkUrl}
                      className="w-full h-full drop-shadow-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-pf-ink">{item.title}</div>
                    <div className="text-sm text-pf-muted">{item.variant}</div>
                    <div className="font-bold text-pf-ink mt-1">ETB {item.price.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)}
                      className="w-7 h-7 rounded border border-pf-border flex items-center justify-center hover:bg-pf-paper">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}
                      className="w-7 h-7 rounded border border-pf-border flex items-center justify-center hover:bg-pf-paper">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="p-1.5 hover:bg-red-50 rounded text-pf-muted hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div>
              <div className="pf-card p-5">
                <h2 className="font-semibold text-pf-ink mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-pf-muted">Subtotal</span>
                    <span>ETB {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pf-muted">Shipping</span>
                    <span>ETB {shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-pf-ink border-t border-pf-border pt-3 mt-3">
                    <span>Total</span>
                    <span>ETB {total.toLocaleString()}</span>
                  </div>
                </div>
                <Link href={`/store/${params.slug}/checkout`}
                  className="btn-primary w-full justify-center mt-5 py-3 text-base">
                  Proceed to checkout
                </Link>
                <Link href={`/store/${params.slug}`}
                  className="btn-ghost w-full justify-center mt-2 text-sm">
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
