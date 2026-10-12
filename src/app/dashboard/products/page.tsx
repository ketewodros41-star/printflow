'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, MoreHorizontal, Eye, Edit, Copy, Trash2, Package } from 'lucide-react'
import { ProductMockupWithArt } from '@/components/mockups/ProductMockups'
import { SAMPLE_GRAPHICS } from '@/lib/sampleGraphics'

interface ProductRow {
  id: string
  title: string
  status: 'PUBLISHED' | 'DRAFT' | 'PAUSED'
  type: 'tshirt' | 'mug' | 'hoodie' | 'poster'
  color: string
  artworkUrl?: string
  brand?: string
  variants: number
  orders: number
  store: string | null
  updatedAt: string
}

const DEFAULT_PRODUCTS: ProductRow[] = [
  {
    id: 'tshirt-classic',
    title: 'Habesha Coffee Roasters Tee',
    status: 'PUBLISHED',
    type: 'tshirt',
    color: '#FFFFFF',
    artworkUrl: SAMPLE_GRAPHICS[1].previewUrl,
    brand: 'Stanley Stella',
    variants: 12,
    orders: 24,
    store: 'Addis Designs Hub',
    updatedAt: '2 days ago',
  },
  {
    id: 'mug-classic',
    title: 'Highland Ceramic Roast Mug',
    status: 'PUBLISHED',
    type: 'mug',
    color: '#FFFFFF',
    artworkUrl: SAMPLE_GRAPHICS[0].previewUrl,
    brand: 'PrintFlow Choice',
    variants: 4,
    orders: 16,
    store: 'Addis Designs Hub',
    updatedAt: '1 week ago',
  },
  {
    id: 'hoodie-premium',
    title: 'Overdrive Streetwear Hoodie',
    status: 'DRAFT',
    type: 'hoodie',
    color: '#1A1A12',
    artworkUrl: SAMPLE_GRAPHICS[5].previewUrl,
    brand: 'Stanley Stella',
    variants: 6,
    orders: 0,
    store: null,
    updatedAt: '3 days ago',
  },
  {
    id: 'poster-matte',
    title: 'Wild Explorer Gallery Print',
    status: 'PAUSED',
    type: 'poster',
    color: '#FFFFFF',
    artworkUrl: SAMPLE_GRAPHICS[3].previewUrl,
    brand: 'Museum Art Paper',
    variants: 3,
    orders: 5,
    store: 'Addis Designs Hub',
    updatedAt: '2 weeks ago',
  },
]

const STATUS: Record<string, string> = {
  PUBLISHED: 'status-active',
  DRAFT:     'status-pending',
  PAUSED:    'badge-neutral',
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>(DEFAULT_PRODUCTS)
  const [filter, setFilter] = useState<'All' | 'Published' | 'Draft' | 'Paused'>('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pf_custom_products')
      if (stored) {
        const parsed: ProductRow[] = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom products at top
          setProducts([...parsed, ...DEFAULT_PRODUCTS])
        }
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const filtered = products.filter(p => {
    if (filter !== 'All' && p.status !== filter.toUpperCase()) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pf-ink">My Products</h1>
          <p className="text-pf-muted text-sm mt-1">{products.length} customized items in catalog</p>
        </div>
        <Link href="/dashboard/catalog" className="btn-primary gap-2">
          <Plus size={16} /> Add product
        </Link>
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pf-subtle" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pf-input pl-10"
            placeholder="Search products…"
          />
        </div>
        {(['All', 'Published', 'Draft', 'Paused'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              filter === f ? 'bg-[#1A1A12] text-white shadow-sm' : 'border border-pf-border text-pf-muted hover:border-pf-ink bg-white'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Products table */}
      <div className="pf-card overflow-hidden shadow-sm border border-[#E5E2DC] rounded-2xl bg-white">
        <table className="pf-table w-full">
          <thead>
            <tr className="border-b border-[#E5E2DC] text-left text-xs font-bold text-[#8C8880] uppercase tracking-wider">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Variants</th>
              <th className="py-3 px-4">Orders</th>
              <th className="py-3 px-4">Store</th>
              <th className="py-3 px-4">Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E2DC]">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-[#FAF9F6] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F2EFE8] border border-[#E5E2DC] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <ProductMockupWithArt
                        type={p.type}
                        color={p.color}
                        artworkUrl={p.artworkUrl}
                        className="w-full h-full drop-shadow-sm"
                      />
                    </div>
                    <div>
                      <Link href={`/create/${p.id}`}
                        className="font-bold text-[#1A1A12] hover:text-blue-600 transition-colors text-sm block">
                        {p.title}
                      </Link>
                      <span className="text-xs text-[#8C8880]">{p.brand || 'Stanley Stella'} · PrintFlow</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={STATUS[p.status]}>
                    {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs font-semibold text-[#5C5A55]">{p.variants} variants</td>
                <td className="py-3.5 px-4 text-xs font-bold text-[#1A1A12]">{p.orders}</td>
                <td className="py-3.5 px-4 text-xs text-[#5C5A55]">{p.store ?? '—'}</td>
                <td className="py-3.5 px-4 text-xs text-[#8C8880]">{p.updatedAt}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/create/${p.id}`}
                      className="px-3 py-1.5 rounded-lg border border-[#E5E2DC] hover:border-[#1A1A12] text-xs font-bold text-[#1A1A12] bg-white transition-colors">
                      Edit in 3D
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

