'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, ChevronDown, SlidersHorizontal, ArrowUpRight, TrendingUp, Sparkles, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductMockupWithArt } from '@/components/mockups/ProductMockups'

// ── Realistic Photography Mockups (Unsplash CDN) matching Printify catalog ────
const CATALOG_PHOTOS: Record<string, string> = {
  // Top Picks
  'tank-muscle':         'photo-1503342217505-b0a15ec3261c', // Sleeveless Muscle Tank (Bella+Canvas 6003)
  'tshirt-comfort':      'photo-1521572267360-ee0c2909d518', // Garment-dyed heavyweight tee (Comfort Colors 1717)
  'tshirt-staple':       'photo-1583743814966-8936f5b7be1a', // Black tee model (Adult Staple Tee - distinct model)
  'blanket-plush':       'photo-1580301762395-21ce84d00bc6', // Velveteen plush throw blanket
  'pillow-polyester':    'photo-1586023492125-27b2c045efd7', // Square throw pillow in modern room
  'tshirt-longsleeve':   'photo-1503341455253-b2e723bb3dbb', // White long sleeve model (Ultra Cotton)
  'cap-snapback':        'photo-1588850561407-ed78c282e89b', // Snapback cap
  'jacket-letterman':    'photo-1551028719-00167b16eac5', // Varsity jacket

  // New Arrivals
  'camo-longsleeve':     'photo-1506794778202-cad84cf45f1d', // Outdoor camo long sleeve tee
  'shirt-daybreak':      'photo-1534528741775-53994a69daeb', // Women's long sleeve UV daybreak
  'shirt-oxford':        'photo-1596755094514-f87e34085b2c', // Women's modern oxford shirt

  // Studio core items
  'sweatshirt-crew':     'photo-1556905055-8f358a7a47b2', // Crewneck sweatshirt model
  'jacket-bomber':       'photo-1544441893-675973e31985', // Streetwear bomber jacket
  'hoodie-zip':          'photo-1614252369475-531eba835eb1', // Full zip hoodie
  'hoodie-premium':      'photo-1556905055-8f358a7a47b2', // Pullover hoodie
  'mug-classic':         'photo-1514228742587-6b1558fcca3d', // Ceramic coffee mug
  'mug-black':           'photo-1577937927133-66ef06acdf18', // Matte black ceramic mug
  'tote-standard':       'photo-1584917865442-de89df76afd3', // Eco canvas tote bag
  'poster-matte':        'photo-1579783900882-c0d3dad7b119', // Premium matte gallery poster
}

function getPhotoUrl(id: string, width = 640) {
  const photoId = CATALOG_PHOTOS[id] ?? 'photo-1521572267360-ee0c2909d518'
  return `https://images.unsplash.com/${photoId}?w=${width}&auto=format&fit=crop&q=85`
}

// ── Top Category Tabs matching Printify UI ───────────────────────────────────
const CATEGORIES = [
  { id: 'all',          label: 'For you' },
  { id: 'men',          label: 'Men' },
  { id: 'women',        label: 'Women' },
  { id: 'kids',         label: 'Kids' },
  { id: 'accessories',  label: 'Accessories' },
  { id: 'home',         label: 'Home and Living' },
]

// ── Catalog Products Data ────────────────────────────────────────────────────
interface ProductItem {
  id: string
  name: string
  brand: string
  sku: string
  category: 'men' | 'women' | 'kids' | 'accessories' | 'home'
  baseCost: number
  premiumCost: number
  sizes: number
  colors?: number
  providers: number
  badges: string[]
  photoId: string
  createId: string
}

const TOP_PICKS: ProductItem[] = [
  {
    id: 'tank-muscle',
    name: "Bella + Canvas 6003 Women's Muscle Tank",
    brand: 'Bella + Canvas · 6003',
    sku: 'BC6003',
    category: 'women',
    baseCost: 290,
    premiumCost: 232,
    sizes: 5,
    colors: 6,
    providers: 3,
    badges: ['Bestseller', 'Staff Pick'],
    photoId: 'tank-muscle',
    createId: 'tank-muscle',
  },
  {
    id: 'tshirt-comfort',
    name: 'Comfort Colors 1717 Garment-Dyed Tee',
    brand: 'Comfort Colors · 1717',
    sku: 'CC1717',
    category: 'men',
    baseCost: 340,
    premiumCost: 272,
    sizes: 6,
    colors: 6,
    providers: 4,
    badges: ['Bestseller', 'Top Quality'],
    photoId: 'tshirt-comfort',
    createId: 'tshirt-comfort',
  },
  {
    id: 'tshirt-staple',
    name: 'Adult Staple Tee',
    brand: 'AS Colour · 5001',
    sku: '5001',
    category: 'men',
    baseCost: 320,
    premiumCost: 256,
    sizes: 9,
    colors: 35,
    providers: 5,
    badges: ['Bestseller'],
    photoId: 'tshirt-staple',
    createId: 'tshirt-staple',
  },
  {
    id: 'blanket-plush',
    name: 'Velveteen Plush Blanket',
    brand: 'Generic brand',
    sku: 'BLK001',
    category: 'home',
    baseCost: 420,
    premiumCost: 336,
    sizes: 3,
    providers: 3,
    badges: ['Bestseller', 'Personalization Pick'],
    photoId: 'blanket-plush',
    createId: 'blanket-plush',
  },
  {
    id: 'pillow-polyester',
    name: 'Spun Polyester Square Pillowcase',
    brand: 'Generic brand',
    sku: 'PLW001',
    category: 'home',
    baseCost: 260,
    premiumCost: 208,
    sizes: 7,
    providers: 2,
    badges: ['Bestseller'],
    photoId: 'pillow-polyester',
    createId: 'pillow-polyester',
  },
  {
    id: 'tshirt-longsleeve',
    name: 'Unisex Ultra Cotton Long Sleeve Tee',
    brand: 'Gildan · 2400',
    sku: '2400',
    category: 'men',
    baseCost: 340,
    premiumCost: 272,
    sizes: 8,
    colors: 21,
    providers: 10,
    badges: ['Bestseller'],
    photoId: 'tshirt-longsleeve',
    createId: 'tshirt-longsleeve',
  },
  {
    id: 'cap-snapback',
    name: 'OTTO Cap Flat Bill Snapback',
    brand: 'OTTO Cap · 125-978',
    sku: '125-978',
    category: 'accessories',
    baseCost: 360,
    premiumCost: 288,
    sizes: 1,
    colors: 6,
    providers: 3,
    badges: ['Bestseller', 'Staff Pick'],
    photoId: 'cap-snapback',
    createId: 'cap-snapback',
  },
  {
    id: 'jacket-letterman',
    name: 'AWDIS Heavyweight Letterman Jacket',
    brand: 'Just Hoods by AWDis · JH043',
    sku: 'JH043',
    category: 'men',
    baseCost: 920,
    premiumCost: 736,
    sizes: 5,
    colors: 5,
    providers: 2,
    badges: ['New Blank', 'Trending'],
    photoId: 'jacket-letterman',
    createId: 'jacket-letterman',
  },
  {
    id: 'sweatshirt-crew',
    name: 'Unisex Heavyweight Crewneck Sweatshirt',
    brand: 'Stanley Stella · STSU823',
    sku: 'STSU823',
    category: 'men',
    baseCost: 460,
    premiumCost: 368,
    sizes: 6,
    colors: 7,
    providers: 4,
    badges: ['Bestseller'],
    photoId: 'sweatshirt-crew',
    createId: 'sweatshirt-crew',
  },
  {
    id: 'mug-classic',
    name: 'Glossy Ceramic Mug 11oz, 15oz',
    brand: 'PrintFlow Choice · MUG001',
    sku: 'MUG001',
    category: 'home',
    baseCost: 180,
    premiumCost: 144,
    sizes: 2,
    colors: 2,
    providers: 2,
    badges: ['Bestseller'],
    photoId: 'mug-classic',
    createId: 'mug-classic',
  },
]

const NEW_ARRIVALS: ProductItem[] = [
  {
    id: 'camo-longsleeve',
    name: 'Performance Long Sleeve Tee',
    brand: 'Russell Outdoors™ · RU150LS',
    sku: 'RU150LS',
    category: 'men',
    baseCost: 440,
    premiumCost: 352,
    sizes: 6,
    providers: 2,
    badges: ['New'],
    photoId: 'camo-longsleeve',
    createId: 'camo-longsleeve',
  },
  {
    id: 'shirt-daybreak',
    name: "Women's Long Sleeve UV Daybreak Shirt",
    brand: 'Port Authority · LW960',
    sku: 'LW960',
    category: 'women',
    baseCost: 490,
    premiumCost: 392,
    sizes: 5,
    providers: 2,
    badges: ['New'],
    photoId: 'shirt-daybreak',
    createId: 'shirt-daybreak',
  },
  {
    id: 'shirt-oxford',
    name: "Women's Long Sleeve Modern Oxford Shirt",
    brand: 'Mercer+Mettle™ · MM2003',
    sku: 'MM2003',
    category: 'women',
    baseCost: 475,
    premiumCost: 380,
    sizes: 5,
    providers: 2,
    badges: ['New'],
    photoId: 'shirt-oxford',
    createId: 'shirt-oxford',
  },
  {
    id: 'hoodie-heavyweight',
    name: 'Heavyweight Oversized Streetwear Full-Sleeve Hoodie',
    brand: 'Stanley Stella · STSU850',
    sku: 'STSU850',
    category: 'men',
    baseCost: 610,
    premiumCost: 488,
    sizes: 6,
    providers: 3,
    badges: ['New', 'Streetwear'],
    photoId: 'hoodie-premium',
    createId: 'hoodie-heavyweight',
  },
  {
    id: 'hoodie-gildan',
    name: 'Gildan 18500 Full-Sleeve Fleece Pullover Hoodie',
    brand: 'Gildan · GI18500',
    sku: 'GI18500',
    category: 'men',
    baseCost: 520,
    premiumCost: 416,
    sizes: 6,
    providers: 5,
    badges: ['Bestseller', 'Full Sleeves'],
    photoId: 'hoodie-premium',
    createId: 'hoodie-gildan',
  },
  {
    id: 'shirt-oxford-mens',
    name: "Port Authority Men's Long Sleeve SuperPro Oxford Shirt",
    brand: 'Port Authority · S664',
    sku: 'S664',
    category: 'men',
    baseCost: 510,
    premiumCost: 408,
    sizes: 7,
    providers: 4,
    badges: ['New', 'Long Sleeve'],
    photoId: 'shirt-oxford',
    createId: 'shirt-oxford-mens',
  },
]

const MORE_POPULAR: ProductItem[] = [
  {
    id: 'sweatshirt-crew',
    name: 'Unisex Crewneck Sweatshirt (No Hood)',
    brand: 'Stanley Stella · STSU823',
    sku: 'STSU823',
    category: 'men',
    baseCost: 540,
    premiumCost: 432,
    sizes: 6,
    colors: 9,
    providers: 4,
    badges: ['Trending', 'PrintFlow Choice'],
    photoId: 'sweatshirt-crew',
    createId: 'sweatshirt-crew',
  },
  {
    id: 'jacket-bomber',
    name: 'Classic Streetwear Bomber Jacket',
    brand: 'Urban Edge · JKT001',
    sku: 'JKT001',
    category: 'men',
    baseCost: 890,
    premiumCost: 712,
    sizes: 5,
    colors: 5,
    providers: 2,
    badges: ['Streetwear', 'New'],
    photoId: 'jacket-bomber',
    createId: 'jacket-bomber',
  },
  {
    id: 'hoodie-zip',
    name: 'Heavy Blend Full-Zip Hoodie',
    brand: 'Gildan · GI18600',
    sku: 'GI18600',
    category: 'men',
    baseCost: 620,
    premiumCost: 496,
    sizes: 5,
    colors: 6,
    providers: 2,
    badges: ['Front Zipper'],
    photoId: 'hoodie-zip',
    createId: 'hoodie-zip',
  },
  {
    id: 'hoodie-premium',
    name: 'Unisex Premium Pullover Hoodie',
    brand: 'Stanley Stella · STSU812',
    sku: 'STSU812',
    category: 'men',
    baseCost: 580,
    premiumCost: 464,
    sizes: 6,
    colors: 5,
    providers: 3,
    badges: ['Bestseller'],
    photoId: 'hoodie-premium',
    createId: 'hoodie-premium',
  },
  {
    id: 'tote-standard',
    name: 'Eco Heavy Canvas Tote Bag',
    brand: 'PrintFlow Choice · TOTE001',
    sku: 'TOTE001',
    category: 'accessories',
    baseCost: 220,
    premiumCost: 176,
    sizes: 1,
    colors: 4,
    providers: 3,
    badges: ['Eco Friendly'],
    photoId: 'tote-standard',
    createId: 'tote-standard',
  },
  {
    id: 'poster-matte',
    name: 'Premium Matte Vertical Art Poster',
    brand: 'PrintFlow Choice · POS001',
    sku: 'POS001',
    category: 'home',
    baseCost: 200,
    premiumCost: 160,
    sizes: 4,
    providers: 2,
    badges: ['Top Pick'],
    photoId: 'poster-matte',
    createId: 'poster-matte',
  },
  {
    id: 'mug-classic',
    name: 'Classic Ceramic Mug 11oz',
    brand: 'Generic brand · MUG001',
    sku: 'MUG001',
    category: 'home',
    baseCost: 180,
    premiumCost: 144,
    sizes: 1,
    colors: 3,
    providers: 4,
    badges: ['Bestseller'],
    photoId: 'mug-classic',
    createId: 'mug-classic',
  },
]

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [query,          setQuery]          = useState('')
  const [liked,          setLiked]          = useState<Set<string>>(new Set())
  const [customProducts, setCustomProducts] = useState<any[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pf_custom_products')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomProducts(parsed)
        }
      }
    } catch (e) {
      // ignore
    }
  }, [])

  function toggleLike(id: string) {
    setLiked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filterMatches = (p: ProductItem) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    const matchQ   = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  }

  const filteredTopPicks = TOP_PICKS.filter(filterMatches)
  const filteredNewArrivals = NEW_ARRIVALS.filter(filterMatches)
  const filteredMorePopular = MORE_POPULAR.filter(filterMatches)

  return (
    <div className="flex flex-col h-full bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top Header Navigation matching Printify ─────────────────────────── */}
      <header className="flex items-center justify-between border-b border-[#E8E6E1] px-6 py-2.5 shrink-0 bg-white">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap',
                activeCategory === cat.id
                  ? 'bg-[#EAE7DF] text-[#1A1A12]'
                  : 'text-[#5C5A55] hover:bg-[#F5F4F0] hover:text-[#1A1A12]'
              )}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Currency & Search Action */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#5C5A55]">
            <span>🇪🇹</span>
            <span className="font-semibold text-[#1A1A12]">ET | ETB</span>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                const el = document.getElementById('catalog-search-input')
                el?.focus()
              }}
              className="flex items-center gap-2 bg-[#1A1A12] hover:bg-[#2A2A22] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors">
              <Search size={13} strokeWidth={2.5} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Scrollable Catalog Content ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10">

        {/* Quick Filter Row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D6D3CE]
                               text-[12px] font-medium text-[#5C5A55] hover:border-[#1A1A12] hover:text-[#1A1A12] transition-colors bg-white">
              <SlidersHorizontal size={12} /> Filters &amp; Sorting
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#D6D3CE]
                               text-[12px] font-medium text-[#5C5A55] hover:border-[#1A1A12] transition-colors bg-white">
              Print area <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#D6D3CE]
                               text-[12px] font-medium text-[#5C5A55] hover:border-[#1A1A12] transition-colors bg-white">
              Brands <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#D6D3CE]
                               text-[12px] font-medium text-[#5C5A55] hover:border-[#1A1A12] transition-colors bg-white">
              New Arrivals
            </button>
          </div>

          {/* Search bar input */}
          <div className="relative w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A8E]" />
            <input
              id="catalog-search-input"
              type="text"
              placeholder="Search catalog products..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[#F5F4F0] border border-transparent focus:border-[#1A1A12] focus:bg-white rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none transition-all"
            />
          </div>
        </div>

        {/* ── SECTION: MY DESIGNED PRODUCTS (Loaded from localStorage) ── */}
        {customProducts.length > 0 && (
          <div className="bg-[#FAF9F5] border border-[#E8E4DA] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-[#1C2B0C] text-emerald-300 rounded-lg">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#1A1A12]">My Designed Products</h2>
                  <p className="text-xs text-[#736F68]">Custom products you designed and saved in PrintFlow Studio</p>
                </div>
              </div>
              <Link
                href="/dashboard/products"
                className="text-xs font-semibold text-[#1C2B0C] hover:underline flex items-center gap-1">
                View all in Store Manager
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {customProducts.slice(0, 4).map((prod: any) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-[#E5E2DC] p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F5F3EE] mb-2 flex items-center justify-center">
                    <ProductMockupWithArt
                      type={prod.type || 'tshirt'}
                      color={prod.color || '#FFFFFF'}
                      artworkUrl={prod.artworkUrl}
                      className="w-full h-full p-2 scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-[9px] font-bold bg-[#1C2B0C] text-white px-1.5 py-0.5 rounded shadow-xs">
                        Custom
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#1A1A12] line-clamp-1 group-hover:text-emerald-800 transition-colors">
                      {prod.title}
                    </h4>
                    <div className="text-[10px] text-[#8C8880] flex items-center justify-between">
                      <span>{prod.brand || 'Custom Design'}</span>
                      <span>{prod.updatedAt || 'Recent'}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#F0ECE1] flex items-center gap-2">
                    <Link
                      href={`/create/${prod.type === 'hat' ? 'cap-snapback' : prod.type === 'jacket' ? 'jacket-letterman' : prod.type === 'sweatshirt' ? 'sweatshirt-crew' : prod.type === 'mug' ? 'mug-classic' : 'tshirt-classic'}`}
                      className="flex-1 py-1.5 text-center bg-[#1A1A12] hover:bg-[#2C2C22] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                      <Palette size={11} />
                      Edit in Studio
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 1: TOP PICKS (Exact match to Image 2) ─────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold text-[#1A1A12] tracking-tight">Top picks</h2>
            <Link href="/dashboard/catalog" className="text-[13px] font-semibold text-[#1A1A12] hover:underline">
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredTopPicks.map(product => (
              <div
                key={product.id}
                className="group rounded-2xl overflow-hidden border border-[#E8E6E1] bg-white hover:shadow-md transition-all duration-200 flex flex-col">
                
                {/* Photographic Stage (Tall 3:4 aspect ratio matching Printify) */}
                <Link
                  href={`/dashboard/catalog/${product.createId}`}
                  className="relative aspect-[3/4] overflow-hidden bg-[#ECE9E4] flex items-center justify-center block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPhotoUrl(product.photoId)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); e.stopPropagation(); toggleLike(product.id) }}
                    className={cn(
                      'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-all z-10',
                      liked.has(product.id)
                        ? 'bg-white text-red-500'
                        : 'bg-white/90 hover:bg-white text-[#5C5A55]'
                    )}
                    title="Add to favorites">
                    <Heart size={15} className={liked.has(product.id) ? 'fill-red-500' : ''} />
                  </button>

                  {/* Printify Badges (Bottom left of image) */}
                  <div className="absolute bottom-3 left-3 flex flex-col gap-1 items-start">
                    {product.badges.map(b => (
                      <span
                        key={b}
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs',
                          b === 'Bestseller'
                            ? 'bg-[#FED7AA] text-[#9A3412]'
                            : b === 'Personalization Pick'
                              ? 'bg-[#F3E8FF] text-[#7E22CE]'
                              : 'bg-[#E0F2FE] text-[#0369A1]'
                        )}>
                        {b === 'Personalization Pick' ? '🪄 ' : ''}{b}
                      </span>
                    ))}
                  </div>
                </Link>

                {/* Info & Pricing */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/dashboard/catalog/${product.createId}`}>
                      <h3 className="text-[14px] font-bold text-[#1A1A12] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-0.5">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[#6E6B65] mb-2">{product.brand}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[13px] font-bold text-[#1A1A12]">
                      From ETB {product.baseCost}
                    </div>
                    <div className="text-[11px] font-medium text-[#4A7B3F]">
                      From ETB {product.premiumCost} with PrintFlow Premium
                    </div>
                    <div className="text-[11px] text-[#8C8880] pt-1 border-t border-[#F0ECE1] flex items-center justify-between">
                      <span>{product.sizes} sizes {product.colors ? `· ${product.colors} col ` : ''}· {product.providers} prov</span>
                      <Link
                        href={`/create/${product.createId}`}
                        className="text-[11px] font-bold text-[#1A1A12] hover:underline">
                        Design →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: TOP NEW ARRIVALS (Exact match to Image 3) ──────────── */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Banner Promo Card */}
            <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0369A1]">
                    New
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#1A1A12]">
                    <TrendingUp size={12} className="text-emerald-600" />
                    Trending
                  </span>
                </div>
                <h3 className="text-[24px] font-black text-[#1A1A12] leading-tight">
                  Top New Arrivals
                </h3>
                <p className="text-[13px] text-[#6E6B65] leading-relaxed">
                  Discover what&apos;s converting the best from new selection and get ahead in your niche.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/dashboard/catalog"
                  className="inline-flex items-center gap-2 bg-[#23281E] hover:bg-[#1A1A12] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs">
                  <span>Explore New Arrivals</span>
                </Link>
              </div>
            </div>

            {/* 3 New Arrival Photographic Cards */}
            {filteredNewArrivals.map(product => (
              <div
                key={product.id}
                className="group rounded-2xl overflow-hidden border border-[#E8E6E1] bg-white hover:shadow-md transition-all duration-200 flex flex-col">
                <Link
                  href={`/dashboard/catalog/${product.createId}`}
                  className="relative aspect-[3/4] overflow-hidden bg-[#ECE9E4] block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPhotoUrl(product.photoId)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0369A1] shadow-2xs">
                      New
                    </span>
                  </div>
                </Link>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/dashboard/catalog/${product.createId}`}>
                      <h3 className="text-[14px] font-bold text-[#1A1A12] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-0.5">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[#6E6B65] mb-2">{product.brand}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[13px] font-bold text-[#1A1A12]">
                      From ETB {product.baseCost}
                    </div>
                    <div className="text-[11px] font-medium text-[#4A7B3F]">
                      From ETB {product.premiumCost} with PrintFlow Premium
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: APPAREL & STREETWEAR CORE FAVORITES ────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold text-[#1A1A12] tracking-tight">Apparel &amp; Streetwear Favorites</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredMorePopular.map(product => (
              <div
                key={product.id}
                className="group rounded-2xl overflow-hidden border border-[#E8E6E1] bg-white hover:shadow-md transition-all duration-200 flex flex-col">
                <Link
                  href={`/dashboard/catalog/${product.createId}`}
                  className="relative aspect-[3/4] overflow-hidden bg-[#ECE9E4] block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPhotoUrl(product.photoId)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 flex flex-col gap-1 items-start">
                    {product.badges.map(b => (
                      <span
                        key={b}
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs',
                          b === 'Bestseller'
                            ? 'bg-[#FED7AA] text-[#9A3412]'
                            : b === 'Streetwear'
                              ? 'bg-[#1A1A12] text-white'
                              : 'bg-[#EAE7DF] text-[#1A1A12]'
                        )}>
                        {b}
                      </span>
                    ))}
                  </div>
                </Link>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/dashboard/catalog/${product.createId}`}>
                      <h3 className="text-[14px] font-bold text-[#1A1A12] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-0.5">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[#6E6B65] mb-2">{product.brand}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[13px] font-bold text-[#1A1A12]">
                      From ETB {product.baseCost}
                    </div>
                    <div className="text-[11px] font-medium text-[#4A7B3F]">
                      From ETB {product.premiumCost} with PrintFlow Premium
                    </div>
                    <div className="text-[11px] text-[#8C8880] pt-1 border-t border-[#F0ECE1] flex items-center justify-between">
                      <span>{product.sizes} sizes {product.colors ? `· ${product.colors} col ` : ''}· {product.providers} prov</span>
                      <Link
                        href={`/create/${product.createId}`}
                        className="text-[11px] font-bold text-[#1A1A12] hover:underline">
                        Design →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: DISCOVER MORE (Exact match to Image 3 bottom) ──────── */}
        <div className="pt-4 border-t border-[#E8E6E1]">
          <div className="mb-4">
            <h2 className="text-[20px] font-bold text-[#1A1A12] tracking-tight">Discover more</h2>
            <p className="text-[13px] text-[#6E6B65] mt-0.5">
              Explore unique products that will delight your customers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            {[
              { title: 'Engraving', link: '#' },
              { title: 'Embroidery', link: '#' },
              { title: 'Early Access', link: '#' },
              { title: 'AOP Clothing', link: '#' },
              { title: 'Locally Made in Ethiopia', link: '#' },
            ].map(item => (
              <a
                key={item.title}
                href={item.link}
                className="group border border-[#DCDAD4] hover:border-[#1A1A12] bg-[#FAF9F6] hover:bg-white rounded-xl p-4 flex items-center justify-between transition-all">
                <span className="text-[13px] font-semibold text-[#1A1A12]">{item.title}</span>
                <ArrowUpRight size={15} className="text-[#8C8880] group-hover:text-[#1A1A12] transition-colors" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
