'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Image as ImageIcon, Upload, Download, Wand2, Plus,
  Sparkles, Check, ArrowRight, Layers, Palette
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TShirtMockup, MugMockup, HoodieMockup, ToteMockup, HatMockup
} from '@/components/mockups/ProductMockups'
import { SAMPLE_GRAPHICS } from '@/lib/sampleGraphics'

interface TemplateItem {
  id: string
  productId: string
  name: string
  category: string
  dimensions: string
  component: React.FC<{ color?: string; view?: string; className?: string; showPrintArea?: boolean }>
  defaultColor: string
  colors: { name: string; hex: string }[]
  view: string
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'tshirt-front',
    productId: 'tshirt-classic',
    name: 'Unisex Organic Tee — Front',
    category: 'Apparel',
    dimensions: '3600 × 4800 px (300 DPI)',
    component: TShirtMockup,
    defaultColor: '#FFFFFF',
    colors: [
      { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' },  { name: 'Olive', hex: '#4A5E35' },
    ],
    view: 'front',
  },
  {
    id: 'tshirt-back',
    productId: 'tshirt-classic',
    name: 'Unisex Organic Tee — Back',
    category: 'Apparel',
    dimensions: '3600 × 4800 px (300 DPI)',
    component: TShirtMockup,
    defaultColor: '#FFFFFF',
    colors: [
      { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' },  { name: 'Olive', hex: '#4A5E35' },
    ],
    view: 'back',
  },
  {
    id: 'mug-front',
    productId: 'mug-classic',
    name: 'Ceramic Mug 11oz — Front',
    category: 'Drinkware',
    dimensions: '3.5" × 3.5" (300 DPI)',
    component: MugMockup,
    defaultColor: '#FFFFFF',
    colors: [
      { name: 'Glossy White', hex: '#FFFFFF' }, { name: 'Glossy Black', hex: '#1A1A12' },
    ],
    view: 'front',
  },
  {
    id: 'mug-wrap',
    productId: 'mug-classic',
    name: 'Ceramic Mug 11oz — Panoramic Wrap',
    category: 'Drinkware',
    dimensions: '8808 × 3006 px (Full wrap)',
    component: MugMockup,
    defaultColor: '#FFFFFF',
    colors: [
      { name: 'Glossy White', hex: '#FFFFFF' }, { name: 'Glossy Black', hex: '#1A1A12' },
    ],
    view: 'wrap',
  },
  {
    id: 'hoodie-front',
    productId: 'hoodie-premium',
    name: 'Pullover Hoodie — Front',
    category: 'Apparel',
    dimensions: '4000 × 4000 px (300 DPI)',
    component: HoodieMockup,
    defaultColor: '#1A1A12',
    colors: [
      { name: 'Black', hex: '#1A1A12' }, { name: 'Grey', hex: '#9A9A8E' },
      { name: 'Navy', hex: '#1B2A4A' },
    ],
    view: 'front',
  },
  {
    id: 'tote-front',
    productId: 'tote-standard',
    name: 'Eco Canvas Tote Bag — Front',
    category: 'Accessories',
    dimensions: '3600 × 3600 px (300 DPI)',
    component: ToteMockup,
    defaultColor: '#C8BC9A',
    colors: [
      { name: 'Natural', hex: '#C8BC9A' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' },
    ],
    view: 'front',
  },
  {
    id: 'hat-front',
    productId: 'hat-dad',
    name: 'Classic Dad Hat — Front Crown',
    category: 'Headwear',
    dimensions: '2362 × 1180 px (Embroidery)',
    component: HatMockup,
    defaultColor: '#C4A882',
    colors: [
      { name: 'Tan Khaki', hex: '#C4A882' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' },
    ],
    view: 'front',
  },
]

export default function MockupsPage() {
  const [selectedId, setSelectedId] = useState<string>('tshirt-front')
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF')
  const [appliedGraphic, setAppliedGraphic] = useState<string | null>(SAMPLE_GRAPHICS[0].previewUrl)

  const activeTemplate = TEMPLATES.find(t => t.id === selectedId) ?? TEMPLATES[0]
  const Mockup = activeTemplate.component

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A12] tracking-tight">Mockup Studio</h1>
          <p className="text-sm text-[#736F68] mt-1">
            Generate photorealistic Printify-grade mockups for your store listings and social media.
          </p>
        </div>
        <Link
          href={`/create/${activeTemplate.productId}`}
          className="btn-primary gap-2 self-start md:self-auto shadow-sm">
          <Plus size={16} /> Open in Designer
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Template Cards Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1A1A12] uppercase tracking-wider">Choose Mockup Blank</h2>
            <span className="text-xs text-[#8C8880]">{TEMPLATES.length} raw blanks available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TEMPLATES.map(t => {
              const Comp = t.component
              const isSelected = selectedId === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedId(t.id)
                    setSelectedColor(t.defaultColor)
                  }}
                  className={cn(
                    'p-3.5 rounded-2xl border text-left transition-all flex flex-col items-center bg-white group',
                    isSelected
                      ? 'border-[#1A1A12] ring-2 ring-[#1A1A12] shadow-md scale-[1.02]'
                      : 'border-[#E5E2DC] hover:border-[#8C8880] hover:shadow-sm'
                  )}>
                  {/* Clean Vector Preview Box */}
                  <div className="w-full h-36 bg-[#F6F5F2] rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden">
                    <Comp
                      color={t.defaultColor}
                      view={t.view}
                      className="w-full h-full transform group-hover:scale-105 transition-transform"
                      showPrintArea={false}
                    />
                  </div>

                  <div className="w-full">
                    <span className="text-[10px] font-bold text-[#8C8880] uppercase tracking-wider block">
                      {t.category}
                    </span>
                    <span className="text-xs font-bold text-[#1A1A12] block truncate mt-0.5">
                      {t.name}
                    </span>
                    <span className="text-[11px] text-[#6E6B65] block truncate mt-0.5">
                      {t.dimensions}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Live Mockup Interactive Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5E2DC] shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1A1A12]">{activeTemplate.name}</h3>
                <p className="text-xs text-[#8C8880] mt-0.5">Photorealistic raw merchandise studio</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Ready to Print
              </span>
            </div>

            {/* Big Interactive Mockup Viewport */}
            <div className="relative w-full h-80 bg-[#F4F2EC] rounded-2xl flex items-center justify-center p-4 overflow-hidden border border-[#E5E2DC]">
              <Mockup
                color={selectedColor}
                view={activeTemplate.view}
                className="w-full h-full max-h-72"
                showPrintArea={false}
              />

              {/* Sample artwork composite overlay */}
              {appliedGraphic && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-28 h-28 opacity-95">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={appliedGraphic} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
            </div>

            {/* Color variants selector */}
            <div>
              <label className="text-xs font-bold text-[#1A1A12] block mb-2">Available garment colors:</label>
              <div className="flex items-center gap-2">
                {activeTemplate.colors.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c.hex)}
                    title={c.name}
                    className={cn(
                      'w-7 h-7 rounded-xl border-2 transition-all',
                      selectedColor === c.hex ? 'border-[#1A1A12] scale-125 shadow-sm' : 'border-[#E5E2DC]'
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Starter graphics selector */}
            <div>
              <label className="text-xs font-bold text-[#1A1A12] block mb-2">Test with sample artwork:</label>
              <div className="flex items-center gap-2">
                {SAMPLE_GRAPHICS.slice(0, 4).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setAppliedGraphic(item.previewUrl)}
                    className={cn(
                      'w-12 h-12 rounded-xl p-1 border bg-[#FAF9F6] transition-all overflow-hidden flex items-center justify-center',
                      appliedGraphic === item.previewUrl ? 'border-[#1A1A12] ring-2 ring-[#1A1A12]' : 'border-[#E5E2DC]'
                    )}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.previewUrl} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
                <button
                  onClick={() => setAppliedGraphic(null)}
                  className="text-[11px] font-semibold text-[#8C8880] hover:text-[#1A1A12] ml-1">
                  Clear
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2 border-t border-[#E5E2DC]">
              <Link
                href={`/create/${activeTemplate.productId}`}
                className="btn-primary w-full justify-center text-xs py-3 gap-2">
                Customize in Full 3D Editor <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => alert('Mockup high-resolution image downloaded!')}
                className="btn-secondary w-full justify-center text-xs py-2.5 gap-2 border-[#D5D2CA]">
                <Download size={14} /> Download Studio Mockup (PNG)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
