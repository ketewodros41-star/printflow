'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, Minus, Plus, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductMockupWithArt } from '@/components/mockups/ProductMockups'
import { SAMPLE_GRAPHICS } from '@/lib/sampleGraphics'

interface StoreProductDef {
  id: string
  title: string
  subtitle: string
  price: number
  type: 'tshirt' | 'mug' | 'hoodie' | 'poster'
  artworkUrl: string
  views: string[]
  colors: { name: string; hex: string }[]
  sizes: string[]
  description: string
  materialSpecs: string[]
}

const STORE_PRODUCTS: Record<string, StoreProductDef> = {
  '1': {
    id: '1',
    title: 'Habesha Roast Signature Tee',
    subtitle: 'Stanley Stella · Unisex Crafter Organic Tee',
    price: 780,
    type: 'tshirt',
    artworkUrl: SAMPLE_GRAPHICS[1].previewUrl,
    views: ['Front', 'Back'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Olive', hex: '#4A5E35' },
      { name: 'Sage', hex: '#8FAF7A' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    description: 'A tribute to the birthplace of Arabica coffee. Tailored from 100% certified organic ring-spun combed cotton with a comfortable medium fit, set-in sleeves, and durable double-needle topstitching.',
    materialSpecs: ['100% Organic Cotton (180 g/m²)', 'Knit ribbed crew neck collar', 'OEKO-TEX® certified water-based inks', 'Pre-shrunk fabric'],
  },
  '2': {
    id: '2',
    title: 'Highland Explorer Ceramic Mug',
    subtitle: 'PrintFlow Choice · 11oz High-Gloss Ceramic',
    price: 340,
    type: 'mug',
    artworkUrl: SAMPLE_GRAPHICS[0].previewUrl,
    views: ['Front', 'Wrap', 'Handle Left'],
    colors: [
      { name: 'Glossy White', hex: '#FFFFFF' },
      { name: 'Glossy Black', hex: '#1A1A12' },
    ],
    sizes: ['11 oz', '15 oz'],
    description: 'Wake up to the Addis highlands. Made from grade-A ceramic with premium sublimation print that delivers vivid colors with a scratch-resistant glossy finish.',
    materialSpecs: ['Dishwasher and microwave safe', 'Ergonomic comfort C-handle', 'Lead and BPA-free ceramic', 'Vivid wrap-around print'],
  },
  '3': {
    id: '3',
    title: 'Overdrive Streetwear Hoodie',
    subtitle: 'Stanley Stella · Unisex Premium Pullover Hoodie',
    price: 1200,
    type: 'hoodie',
    artworkUrl: SAMPLE_GRAPHICS[5].previewUrl,
    views: ['Front', 'Back'],
    colors: [
      { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Heather Grey', hex: '#9A9A8E' },
      { name: 'Olive', hex: '#4A5E35' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description: 'Heavyweight streetwear essential featuring double-layered hood, round braided drawstrings with closed metal aglets, and front kangaroo pocket.',
    materialSpecs: ['85% Organic Cotton, 15% Recycled Polyester (350 g/m²)', 'Double layered hood', '1x1 rib at sleeve cuff and bottom hem', 'Brushed interior fleece'],
  },
  '4': {
    id: '4',
    title: 'Lion of Judah Fine Art Print',
    subtitle: 'Gallery Quality Archival Matte Poster',
    price: 490,
    type: 'poster',
    artworkUrl: SAMPLE_GRAPHICS[3].previewUrl,
    views: ['Front'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: ['A3 (30×42 cm)', 'A2 (42×59 cm)', 'A1 (59×84 cm)'],
    description: 'Museum-quality poster made on thick, long-lasting matte (uncoated) archival paper with high-pigment archival inks.',
    materialSpecs: ['250 g/m² / 110 lb museum-grade paper', 'Archival acid-free paper', 'Giclée high dynamic range printing', 'Ships in reinforced protective tube'],
  },
}

export default function StoreProductPage({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const product = STORE_PRODUCTS[params.id] || STORE_PRODUCTS['1']
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0])
  const [activeView, setActiveView] = useState(product.views[0])
  const [qty, setQty] = useState(1)

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Store nav */}
      <header className="bg-white border-b border-[#E5E2DC]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/store/${params.slug}`}
            className="flex items-center gap-2 text-xs font-bold text-[#1A1A12] hover:text-blue-600 transition-colors">
            ← Back to Addis Style Hub
          </Link>
          <Link
            href={`/store/${params.slug}/cart`}
            className="px-4 py-2 rounded-xl bg-white border border-[#D5D2CA] text-xs font-bold text-[#1A1A12] hover:bg-[#FAF9F6] transition-colors shadow-sm flex items-center gap-1.5">
            <ShoppingBag size={14} />
            <span>Cart ({qty})</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-12 gap-10">

          {/* Left: Photorealistic Product Mockup & View Switcher */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-3xl border border-[#E5E2DC] p-8 aspect-[5/5.5] flex items-center justify-center relative shadow-sm overflow-hidden">
              <ProductMockupWithArt
                type={product.type}
                color={selectedColor.hex}
                view={activeView}
                artworkUrl={product.artworkUrl}
                className="w-full h-full max-h-[520px] drop-shadow-xl"
              />

              {/* View Pills Switcher */}
              {product.views.length > 1 && (
                <div className="absolute bottom-5 inset-x-0 flex justify-center gap-2 pointer-events-auto">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D5D2CA] shadow-md flex gap-1.5">
                    {product.views.map(v => (
                      <button
                        key={v}
                        onClick={() => setActiveView(v)}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-bold transition-all',
                          activeView === v
                            ? 'bg-[#1A1A12] text-white shadow-sm'
                            : 'text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#F2EFE8]'
                        )}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quality assurances banner */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-[#E5E2DC] text-center text-xs">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span className="font-bold text-[#1A1A12]">100% Quality Guarantee</span>
                <span className="text-[11px] text-[#8C8880]">Certified DTG Inks</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck size={18} className="text-blue-600" />
                <span className="font-bold text-[#1A1A12]">2-3 Day Delivery</span>
                <span className="text-[11px] text-[#8C8880]">Addis & Regional</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw size={18} className="text-amber-600" />
                <span className="font-bold text-[#1A1A12]">Free Replacement</span>
                <span className="text-[11px] text-[#8C8880]">For print defects</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Card */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#8C8880]">
                  {product.subtitle}
                </span>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1A1A12] mt-1 tracking-tight">
                  {product.title}
                </h1>
                <div className="text-2xl font-extrabold text-[#1A1A12] mt-3">
                  ETB {(product.price * qty).toLocaleString()}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="pt-4 border-t border-[#E5E2DC]">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-bold text-[#1A1A12]">Color:</span>
                  <span className="text-xs font-semibold text-[#6E6B65]">{selectedColor.name}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => (
                    <button
                      key={c.name}
                      title={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all p-0.5',
                        selectedColor.name === c.name
                          ? 'border-[#1A1A12] scale-110 shadow-sm'
                          : 'border-[#D5D2CA] hover:border-[#8C8880]'
                      )}>
                      <span className="block w-full h-full rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="pt-4 border-t border-[#E5E2DC]">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-bold text-[#1A1A12]">Size:</span>
                  <span className="text-xs font-semibold text-[#6E6B65]">{selectedSize}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={cn(
                        'px-4 py-2 border rounded-xl text-xs font-bold transition-all',
                        selectedSize === s
                          ? 'border-[#1A1A12] bg-[#1A1A12] text-white shadow-sm'
                          : 'border-[#D5D2CA] bg-white text-[#5C5A55] hover:border-[#1A1A12]'
                      )}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="pt-4 border-t border-[#E5E2DC]">
                <span className="text-xs font-bold text-[#1A1A12] block mb-2.5">Quantity</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#D5D2CA] bg-white rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#F2EFE8] text-[#1A1A12] transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-extrabold w-10 text-center">{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#F2EFE8] text-[#1A1A12] transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <div className="pt-2">
                <Link
                  href={`/store/${params.slug}/cart`}
                  className="w-full py-4 rounded-2xl bg-[#1A1A12] text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#2A2A22] transition-all shadow-md">
                  <ShoppingBag size={18} />
                  <span>Add to cart — ETB {(product.price * qty).toLocaleString()}</span>
                </Link>
              </div>

              {/* Description & Materials */}
              <div className="pt-6 border-t border-[#E5E2DC] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A12]">Product Details</h3>
                <p className="text-xs text-[#5C5A55] leading-relaxed">{product.description}</p>
                <ul className="text-xs text-[#5C5A55] space-y-1.5 mt-2">
                  {product.materialSpecs.map(m => (
                    <li key={m} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

