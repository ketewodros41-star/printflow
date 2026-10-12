import Link from 'next/link'
import { ProductMockupWithArt } from '@/components/mockups/ProductMockups'
import { SAMPLE_GRAPHICS } from '@/lib/sampleGraphics'

const STORE = {
  slug: 'addis-style-hub',
  name: 'Addis Style Hub',
  tagline: 'Premium custom apparel & home goods for the modern Ethiopian',
  logo: '✦',
  products: [
    {
      id: '1',
      title: 'Habesha Roast Signature Tee',
      price: 780,
      type: 'tshirt' as const,
      color: '#FFFFFF',
      artworkUrl: SAMPLE_GRAPHICS[1].previewUrl,
      colors: 5,
      sizes: 4,
    },
    {
      id: '2',
      title: 'Highland Explorer Ceramic Mug',
      price: 340,
      type: 'mug' as const,
      color: '#FFFFFF',
      artworkUrl: SAMPLE_GRAPHICS[0].previewUrl,
      colors: 2,
      sizes: 1,
    },
    {
      id: '3',
      title: 'Overdrive Streetwear Hoodie',
      price: 1200,
      type: 'hoodie' as const,
      color: '#1A1A12',
      artworkUrl: SAMPLE_GRAPHICS[5].previewUrl,
      colors: 4,
      sizes: 5,
    },
    {
      id: '4',
      title: 'Lion of Judah Fine Art Print',
      price: 490,
      type: 'poster' as const,
      color: '#FFFFFF',
      artworkUrl: SAMPLE_GRAPHICS[3].previewUrl,
      colors: 1,
      sizes: 3,
    },
  ],
}

export default function StorefrontPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Store header */}
      <header className="bg-white border-b border-[#E5E2DC]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#1A1A12] text-white flex items-center justify-center font-bold text-sm">
              {STORE.logo}
            </span>
            <div>
              <div className="font-extrabold text-[#1A1A12] tracking-tight">{STORE.name}</div>
              <div className="text-xs text-[#8C8880]">{STORE.tagline}</div>
            </div>
          </div>
          <Link
            href={`/store/${params.slug}/cart`}
            className="px-4 py-2 rounded-xl bg-white border border-[#D5D2CA] text-xs font-bold text-[#1A1A12] hover:bg-[#FAF9F6] transition-colors shadow-sm">
            Cart (0)
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E5E2DC]">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#8C8880] uppercase">Official Collection</span>
            <h1 className="text-3xl font-extrabold text-[#1A1A12] tracking-tight mt-1">{STORE.name}</h1>
          </div>
          <p className="text-sm text-[#5C5A55] max-w-md">
            All garments printed on demand with premium eco-certified textiles in Addis Ababa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORE.products.map(p => (
            <Link key={p.id} href={`/store/${params.slug}/products/${p.id}`} className="group">
              <div className="bg-white rounded-2xl border border-[#E5E2DC] overflow-hidden hover:shadow-lg hover:border-[#1A1A12] transition-all duration-300 flex flex-col h-full">
                <div className="aspect-[5/6] bg-[#F2EFE8] flex items-center justify-center p-4 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                  <ProductMockupWithArt
                    type={p.type}
                    color={p.color}
                    view="front"
                    artworkUrl={p.artworkUrl}
                    className="w-full h-full drop-shadow-md"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-bold text-[#1A1A12] text-sm group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h2>
                    <p className="text-xs text-[#8C8880] mt-1">
                      {p.colors} colors · {p.sizes} sizes
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#F0EDE6] flex items-center justify-between">
                    <span className="text-xs text-[#8C8880]">Price</span>
                    <span className="font-extrabold text-sm text-[#1A1A12]">
                      ETB {p.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

