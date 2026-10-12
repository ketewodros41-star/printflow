'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Edit2, Eye, Copy, Trash2, Package, ShoppingCart, TrendingUp, ExternalLink } from 'lucide-react'
import { ProductMockupWithArt } from '@/components/mockups/ProductMockups'
import { SAMPLE_GRAPHICS } from '@/lib/sampleGraphics'
import { cn } from '@/lib/utils'

interface ProductDetailInfo {
  id: string
  title: string
  type: 'tshirt' | 'mug' | 'hoodie' | 'poster'
  color: string
  artworkUrl: string
  status: 'PUBLISHED' | 'DRAFT' | 'PAUSED'
  description: string
  store: string
  createdAt: string
  orders: number
  revenue: string
  variants: { size: string; color: string; sku: string; price: number; stock: string }[]
  printAreas: string[]
  availableColors: { name: string; hex: string }[]
}

const PRODUCTS_DATABASE: Record<string, ProductDetailInfo> = {
  'tshirt-classic': {
    id: 'tshirt-classic',
    title: 'Habesha Coffee Roasters Organic Tee',
    type: 'tshirt',
    color: '#FFFFFF',
    artworkUrl: SAMPLE_GRAPHICS[1].previewUrl,
    status: 'PUBLISHED',
    description: 'Stanley Stella Unisex Crafter Organic Tee printed with eco water-based inks in Addis Ababa.',
    store: 'Addis Designs Hub',
    createdAt: 'Oct 7, 2026',
    orders: 24,
    revenue: 'ETB 18,720',
    variants: [
      { size: 'S', color: 'White', sku: 'ST-HCR-S-WHT', price: 780, stock: '∞' },
      { size: 'M', color: 'White', sku: 'ST-HCR-M-WHT', price: 780, stock: '∞' },
      { size: 'L', color: 'White', sku: 'ST-HCR-L-WHT', price: 780, stock: '∞' },
      { size: 'XL', color: 'White', sku: 'ST-HCR-XL-WHT', price: 780, stock: '∞' },
      { size: 'M', color: 'Black', sku: 'ST-HCR-M-BLK', price: 780, stock: '∞' },
      { size: 'L', color: 'Black', sku: 'ST-HCR-L-BLK', price: 780, stock: '∞' },
    ],
    printAreas: ['Front Chest (12" × 16")', 'Back Panel (12" × 16")'],
    availableColors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Olive', hex: '#4A5E35' },
    ],
  },
  'mug-classic': {
    id: 'mug-classic',
    title: 'Highland Ceramic Roast Mug',
    type: 'mug',
    color: '#FFFFFF',
    artworkUrl: SAMPLE_GRAPHICS[0].previewUrl,
    status: 'PUBLISHED',
    description: 'PrintFlow Choice 11oz Ceramic Mug with durable high-gloss sublimation wrap.',
    store: 'Addis Designs Hub',
    createdAt: 'Sep 28, 2026',
    orders: 16,
    revenue: 'ETB 5,440',
    variants: [
      { size: '11 oz', color: 'White', sku: 'MG-WHT-11', price: 340, stock: '∞' },
      { size: '15 oz', color: 'White', sku: 'MG-WHT-15', price: 380, stock: '∞' },
    ],
    printAreas: ['Front (3.5" × 3.5")', 'Wrap (8.5" × 3.5")'],
    availableColors: [
      { name: 'Glossy White', hex: '#FFFFFF' },
      { name: 'Glossy Black', hex: '#1A1A12' },
    ],
  },
}

const STATUS: Record<string, string> = {
  PUBLISHED: 'status-active',
  DRAFT: 'status-pending',
  PAUSED: 'badge-neutral',
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const p = PRODUCTS_DATABASE[id] || PRODUCTS_DATABASE['tshirt-classic']
  const [selectedColor, setSelectedColor] = useState(p.color)
  const [activeView, setActiveView] = useState<'front' | 'back' | 'wrap'>('front')

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard/products" className="text-xs font-semibold text-[#8C8880] hover:text-[#1A1A12] flex items-center gap-1 transition-colors">
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <span className="text-[#D5D2CA]">/</span>
        <span className="text-xs font-bold text-[#1A1A12]">{p.title}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E2DC]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#1A1A12] tracking-tight">{p.title}</h1>
            <span className={STATUS[p.status]}>{p.status.toLowerCase()}</span>
          </div>
          <p className="text-xs text-[#8C8880] mt-1">Created {p.createdAt} · Connected to {p.store}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/create/${p.id}`}
            className="px-4 py-2 rounded-xl bg-[#1A1A12] text-white hover:bg-[#2A2A22] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm">
            <Edit2 size={14} /> Edit in 3D Studio
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Stats & Variants */}
        <div className="lg:col-span-7 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Orders', value: String(p.orders), icon: ShoppingCart },
              { label: 'Revenue', value: p.revenue, icon: TrendingUp },
              { label: 'Variants', value: String(p.variants.length), icon: Package },
            ].map(s => (
              <div key={s.label} className="bg-white p-4 rounded-2xl border border-[#E5E2DC] shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon size={15} className="text-[#6E6B65]" />
                  <span className="text-xs font-semibold text-[#8C8880]">{s.label}</span>
                </div>
                <div className="text-xl font-extrabold text-[#1A1A12]">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Variants table */}
          <div className="bg-white rounded-2xl border border-[#E5E2DC] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E2DC]">
              <h2 className="font-bold text-sm text-[#1A1A12]">Active Product Variants</h2>
              <Link href={`/create/${p.id}`} className="text-xs font-bold text-blue-600 hover:underline">
                Manage variants in studio →
              </Link>
            </div>
            <table className="pf-table w-full">
              <thead>
                <tr className="border-b border-[#E5E2DC] text-left text-xs font-bold text-[#8C8880] uppercase">
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Color</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2DC]">
                {p.variants.map(v => (
                  <tr key={v.sku} className="hover:bg-[#FAF9F6] text-xs">
                    <td className="py-3 px-4 font-mono text-[#8C8880]">{v.sku}</td>
                    <td className="py-3 px-4 font-semibold text-[#1A1A12]">{v.size}</td>
                    <td className="py-3 px-4 text-[#5C5A55]">{v.color}</td>
                    <td className="py-3 px-4 font-bold text-[#1A1A12]">ETB {v.price}</td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">{v.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Description */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E2DC] shadow-sm">
            <h3 className="font-bold text-sm text-[#1A1A12] mb-2">Description</h3>
            <p className="text-xs text-[#5C5A55] leading-relaxed">{p.description}</p>
          </div>
        </div>

        {/* Right Photorealistic Mockup Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5E2DC] p-6 shadow-sm flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C8880]">Live Mockup</span>
              {/* View toggle */}
              <div className="flex bg-[#F2EFE8] p-1 rounded-xl gap-1">
                <button
                  onClick={() => setActiveView('front')}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                    activeView === 'front' ? 'bg-white text-[#1A1A12] shadow-sm' : 'text-[#6E6B65]'
                  )}>
                  Front
                </button>
                {p.type === 'tshirt' && (
                  <button
                    onClick={() => setActiveView('back')}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                      activeView === 'back' ? 'bg-white text-[#1A1A12] shadow-sm' : 'text-[#6E6B65]'
                    )}>
                    Back
                  </button>
                )}
                {p.type === 'mug' && (
                  <button
                    onClick={() => setActiveView('wrap')}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                      activeView === 'wrap' ? 'bg-white text-[#1A1A12] shadow-sm' : 'text-[#6E6B65]'
                    )}>
                    Wrap
                  </button>
                )}
              </div>
            </div>

            {/* Stage */}
            <div className="w-full aspect-[5/5.5] bg-[#F8F7F4] rounded-2xl border border-[#E5E2DC] p-4 flex items-center justify-center relative overflow-hidden">
              <ProductMockupWithArt
                type={p.type}
                color={selectedColor}
                view={activeView}
                artworkUrl={p.artworkUrl}
                className="w-full h-full max-h-[380px] drop-shadow-lg"
              />
            </div>

            {/* Color swatches */}
            <div className="w-full mt-4 pt-4 border-t border-[#E5E2DC] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A1A12]">Preview Garment Color:</span>
              <div className="flex gap-2">
                {p.availableColors.map(c => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(c.hex)}
                    className={cn(
                      'w-6 h-6 rounded-full border-2 transition-all p-0.5',
                      selectedColor === c.hex ? 'border-[#1A1A12] scale-125 shadow-sm' : 'border-[#D5D2CA]'
                    )}>
                    <span className="block w-full h-full rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full mt-4">
              <Link
                href={`/create/${p.id}`}
                className="w-full py-3 rounded-xl bg-[#FAF9F6] border border-[#D5D2CA] text-xs font-bold text-[#1A1A12] hover:bg-white hover:border-[#1A1A12] transition-colors flex items-center justify-center gap-1.5">
                <Edit2 size={13} /> Open in Printflow 3D Studio
              </Link>
            </div>
          </div>

          {/* Print specs */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E2DC] shadow-sm space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#8C8880]">Calibrated Print Areas</h3>
            <ul className="text-xs text-[#5C5A55] space-y-1">
              {p.printAreas.map(pa => (
                <li key={pa} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>{pa}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

