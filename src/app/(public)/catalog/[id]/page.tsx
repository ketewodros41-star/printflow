'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, Truck, Package, CheckCircle2, ArrowRight, Info, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TShirtMockup, MugMockup, HoodieMockup, ToteMockup, HatMockup
} from '@/components/mockups/ProductMockups'

interface ProductDetailData {
  id: string
  title: string
  brand: string
  sku: string
  method: string
  methodNote: string
  methodFeatures: string[]
  basePrice: number
  premiumPrice: number
  isChoice: boolean
  rating: number
  reviewCount: number
  type: 'tshirt' | 'mug' | 'hoodie' | 'tote' | 'hat'
  colors: { name: string; hex: string }[]
  sizes: string[]
  printAreas: string[]
  about: string[]
  keyFeatures: { title: string; desc: string }[]
  shippingFrom: string
  avgProductionDays: number
  avgShippingDays: number
}

const PRODUCTS_DB: Record<string, ProductDetailData> = {
  'tshirt-classic': {
    id: 'tshirt-classic',
    title: 'Unisex Crafter Organic Mid-Light T-Shirt',
    brand: 'Stanley Stella',
    sku: 'STTU755',
    method: 'DTG (Direct-to-Garment)',
    methodNote: 'Best for ultra high-detail prints with soft, breathable integrated fabric feel.',
    methodFeatures: ['Soft print finish', 'Wash-durable', 'Eco-certified inks'],
    basePrice: 320,
    premiumPrice: 256,
    isChoice: true,
    rating: 4.9,
    reviewCount: 1248,
    type: 'tshirt',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Olive', hex: '#4A5E35' },
      { name: 'Red', hex: '#C62828' },
      { name: 'Sage', hex: '#8FAF7A' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    printAreas: ['Front', 'Back', 'Sleeve left', 'Sleeve right'],
    about: [
      '100% organic combed ringspun cotton',
      'Fabric weight: 4.6 oz./yd.² (155 g/m²)',
      'Regular modern retail fit',
      'Set-in sleeves with natural drape',
      '1×1 rib knit crew collar',
      'Self-fabric neck tape on inside back',
    ],
    keyFeatures: [
      { title: 'OCS and GOTS-certified organic', desc: 'Sustainably farmed and certified organic cotton without toxic chemicals.' },
      { title: 'Twin-needle reinforced hems', desc: 'Durable reinforced double-needle topstitching on cuffs and bottom hem.' },
      { title: '1×1 Ribbed collar', desc: 'Retains shape wash after wash.' },
    ],
    shippingFrom: 'Addis Ababa, Ethiopia',
    avgProductionDays: 2,
    avgShippingDays: 3,
  },
  'mug-classic': {
    id: 'mug-classic',
    title: 'Classic Glossy Ceramic Mug 11oz',
    brand: 'PrintFlow Basics',
    sku: 'MUG001',
    method: 'Sublimation Wrap',
    methodNote: 'Vibrant, photographic glossy finish baked permanently into the glaze.',
    methodFeatures: ['Dishwasher safe', 'Microwave safe', 'Glossy ceramic shine'],
    basePrice: 180,
    premiumPrice: 144,
    isChoice: true,
    rating: 4.9,
    reviewCount: 890,
    type: 'mug',
    colors: [
      { name: 'Glossy White', hex: '#FFFFFF' },
      { name: 'Glossy Black', hex: '#1A1A12' },
    ],
    sizes: ['11oz', '15oz'],
    printAreas: ['Front', 'Panoramic Wrap', 'Handle left', 'Handle right'],
    about: [
      'High-grade AAA ceramic',
      'High-gloss ceramic coating for crisp photographic prints',
      'Microwave and dishwasher safe',
      'Comfortable rounded C-handle',
    ],
    keyFeatures: [
      { title: 'Vibrant sublimation glaze', desc: 'Colors remain vibrant and scratch-resistant after hundreds of washes.' },
      { title: 'Ergonomic handle', desc: 'Comfortable grip and balanced weight distribution.' },
    ],
    shippingFrom: 'Addis Ababa, Ethiopia',
    avgProductionDays: 1,
    avgShippingDays: 3,
  },
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const prod = PRODUCTS_DB[params.id] ?? PRODUCTS_DB['tshirt-classic']
  const [selectedColor, setSelectedColor] = useState(prod.colors[0].hex)
  const [selectedView, setSelectedView]   = useState('front')

  function renderMockup() {
    switch (prod.type) {
      case 'tshirt':
        return <TShirtMockup color={selectedColor} view={selectedView} className="w-full h-full max-h-[460px]" showPrintArea={false} />
      case 'mug':
        return <MugMockup color={selectedColor} view={selectedView} className="w-full h-full max-h-[460px]" showPrintArea={false} />
      case 'hoodie':
        return <HoodieMockup color={selectedColor} view={selectedView} className="w-full h-full max-h-[460px]" showPrintArea={false} />
      case 'tote':
        return <ToteMockup color={selectedColor} view={selectedView} className="w-full h-full max-h-[460px]" showPrintArea={false} />
      case 'hat':
        return <HatMockup color={selectedColor} className="w-full h-full max-h-[460px]" showPrintArea={false} />
      default:
        return <TShirtMockup color={selectedColor} view={selectedView} className="w-full h-full max-h-[460px]" showPrintArea={false} />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-[#736F68] flex items-center gap-2">
        <Link href="/" className="hover:text-[#1A1A12]">Catalog</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-[#1A1A12]">{prod.brand}</Link>
        <span>/</span>
        <span className="text-[#1A1A12] font-semibold">{prod.title}</span>
      </nav>

      <div className="grid lg:grid-cols-12 gap-12 items-start">

        {/* Left: Photorealistic Product Stage + Multi-View Thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-[#F5F3EE] rounded-3xl border border-[#E5E2DC] p-8 flex items-center justify-center relative overflow-hidden shadow-sm">
            {renderMockup()}

            {/* Quick Badge */}
            {prod.isChoice && (
              <div className="absolute top-4 left-4 bg-[#1C2B0C] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                PrintFlow Choice
              </div>
            )}
          </div>

          {/* Angle / View Thumbnails */}
          <div className="flex items-center gap-3">
            {[
              { id: 'front', label: 'Front View' },
              { id: 'back', label: 'Back View' },
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedView(v.id)}
                className={cn(
                  'w-24 h-24 rounded-2xl bg-[#F5F3EE] border-2 p-2 transition-all flex flex-col items-center justify-center',
                  selectedView === v.id
                    ? 'border-[#1A1A12] shadow-md ring-2 ring-[#1A1A12]'
                    : 'border-[#E5E2DC] hover:border-[#8C8880]'
                )}>
                <div className="w-14 h-14 flex items-center justify-center pointer-events-none">
                  {prod.type === 'tshirt' ? (
                    <TShirtMockup color={selectedColor} view={v.id} className="w-full h-full" showPrintArea={false} />
                  ) : (
                    <MugMockup color={selectedColor} view={v.id === 'back' ? 'wrap' : 'front'} className="w-full h-full" showPrintArea={false} />
                  )}
                </div>
                <span className="text-[10px] font-bold text-[#1A1A12] mt-1">{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Specifications & CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8C8880] mb-1">
              <span>{prod.brand} · {prod.sku}</span>
              <span className="text-amber-500 font-bold">★ {prod.rating} ({prod.reviewCount} reviews)</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1A1A12] tracking-tight">{prod.title}</h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-[#1A1A12]">From ETB {prod.basePrice}</span>
              <span className="text-xs text-emerald-600 font-semibold">ETB {prod.premiumPrice} with Pro</span>
            </div>
          </div>

          {/* Color Switcher */}
          <div className="space-y-2.5 pt-4 border-t border-[#E5E2DC]">
            <div className="flex justify-between text-xs font-bold text-[#1A1A12]">
              <span>Colors ({prod.colors.length})</span>
              <span className="text-[#6E6B65] font-semibold">{prod.colors.find(c => c.hex === selectedColor)?.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {prod.colors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.hex)}
                  title={c.name}
                  className={cn(
                    'w-8 h-8 rounded-xl border-2 transition-all',
                    selectedColor === c.hex ? 'border-[#1A1A12] scale-125 shadow-md' : 'border-[#E5E2DC] hover:border-[#8C8880]'
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#1A1A12] block">Available Sizes</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {prod.sizes.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-xl border border-[#E5E2DC] text-xs font-bold text-[#1A1A12] bg-[#FAF9F6]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Primary CTA: Start Designing in Full Mockup Editor */}
          <div className="space-y-3 pt-3">
            <Link
              href={`/create/${prod.id}`}
              className="btn-primary w-full justify-center text-sm py-3.5 gap-2 shadow-lg">
              <span>Start Designing This Product</span>
              <ArrowRight size={16} />
            </Link>
            <div className="flex items-center justify-center gap-2 text-xs text-[#8C8880]">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Fulfilled locally with verified print quality guarantee</span>
            </div>
          </div>

          {/* Print method summary */}
          <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-2xl p-4 space-y-2 text-xs">
            <span className="font-bold text-[#1A1A12] block">{prod.method}</span>
            <p className="text-[#6E6B65]">{prod.methodNote}</p>
            <div className="flex gap-2 flex-wrap pt-1">
              {prod.methodFeatures.map(f => (
                <span key={f} className="bg-white border border-[#E5E2DC] px-2 py-0.5 rounded text-[11px] font-semibold text-[#1A1A12]">
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* About & Specifications */}
      <div className="pt-8 border-t border-[#E5E2DC] grid md:grid-cols-2 gap-10">
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#1A1A12]">About the blank</h2>
          <ul className="space-y-1.5 text-xs text-[#5C5A55]">
            {prod.about.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#1A1A12]">Key features</h2>
          <div className="space-y-3">
            {prod.keyFeatures.map((f, i) => (
              <div key={i} className="text-xs">
                <span className="font-bold text-[#1A1A12]">{f.title}: </span>
                <span className="text-[#5C5A55]">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
