'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, SlidersHorizontal, ChevronDown, ChevronRight, Star, Package,
  ArrowRight, Sparkles, Palette, Shirt, Flame, Layers, Sun, Shield,
  Crown, Coffee, ShoppingBag, Home, Check, X, RotateCcw, Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TShirtMockup, TankMockup, MugMockup, HoodieMockup, ToteMockup, HatMockup, PosterMockup, PhoneMockup,
  SweatshirtMockup, JacketMockup, ZipHoodieMockup, BlanketMockup, PillowMockup, LongSleeveMockup, ProductMockupWithArt
} from '@/components/mockups/ProductMockups'

// ── Top Level Departments matching Printify ───────────────────────────────────
const DEPARTMENTS = [
  { id: 'all',          label: 'All Products' },
  { id: 'men',          label: "Men's Clothing" },
  { id: 'women',        label: "Women's Clothing" },
  { id: 'accessories',  label: 'Accessories' },
  { id: 'home',         label: 'Home & Living' },
]

// ── Clothing & Merch Categories matching Printify ─────────────────────────────
const CLOTHING_CATEGORIES = [
  { id: 'all',          label: 'All Items',           group: 'all',         icon: Sparkles },
  { id: 'all-clothing', label: 'All Clothing',        group: 'clothing',    icon: Shirt },
  { id: 'T-Shirts',     label: 'T-Shirts',            group: 'clothing',    icon: Shirt,      sublabel: 'Short Sleeve' },
  { id: 'Long Sleeves', label: 'Long Sleeves',        group: 'clothing',    icon: Shirt,      sublabel: 'Full Sleeve' },
  { id: 'Hoodies',      label: 'Hoodies',             group: 'clothing',    icon: Flame,      sublabel: 'Pullovers & Zips' },
  { id: 'Sweatshirts',  label: 'Sweatshirts',         group: 'clothing',    icon: Layers,     sublabel: 'Crewneck Fleece' },
  { id: 'Tank Tops',    label: 'Tank Tops',           group: 'clothing',    icon: Sun,        sublabel: 'Sleeveless & Muscle' },
  { id: 'Jackets',      label: 'Jackets',             group: 'clothing',    icon: Shield,     sublabel: 'Varsity & Bomber' },
  { id: 'Hats',         label: 'Hats & Caps',         group: 'accessories', icon: Crown,      sublabel: 'Snapbacks & Dad' },
  { id: 'Bags',         label: 'Bags & Totes',        group: 'accessories', icon: ShoppingBag,sublabel: 'Eco Canvas' },
  { id: 'Mugs',         label: 'Mugs & Drinkware',    group: 'home',        icon: Coffee,     sublabel: 'Ceramic 11oz/15oz' },
  { id: 'Home & Living',label: 'Home & Living',       group: 'home',        icon: Home,       sublabel: 'Posters, Blankets, Pillows' },
]

export interface CatalogProduct {
  id: string
  productId: string
  title: string
  brand: string
  sku: string
  price: number
  pricePremium: number
  sizes: number
  colors: number
  colorHexes: string[]
  providers: number
  isChoice?: boolean
  isBestseller?: boolean
  isNew?: boolean
  rating: number
  department: 'men' | 'women' | 'unisex' | 'accessories' | 'home'
  category: 'T-Shirts' | 'Long Sleeves' | 'Tank Tops' | 'Sweatshirts' | 'Jackets' | 'Hoodies' | 'Hats' | 'Mugs' | 'Bags' | 'Home & Living'
  type: 'tshirt' | 'longsleeve' | 'tank' | 'sweatshirt' | 'jacket' | 'hoodie' | 'hoodie-zip' | 'mug' | 'tote' | 'hat' | 'poster' | 'blanket' | 'pillow' | 'phone' | 'polo'
  defaultColor: string
  fabricBadge?: string
}

const PRODUCTS: CatalogProduct[] = [
  // ── POLO & SHORT SLEEVE AOP ──
  {
    id: 'polo-sublimation',
    productId: 'polo-sublimation',
    title: "All-Over Print Men's Short-Sleeve Polo Shirt",
    brand: 'PrintFlow Choice', sku: 'POLO-AOP-01',
    price: 480, pricePremium: 384,
    sizes: 6, colors: 8,
    colorHexes: ['#FFFFFF', '#1A1A12', '#1B2A4A', '#C8C5C0', '#C62828', '#2E4A2E', '#4A5E35', '#8FAF7A'],
    providers: 3,
    isChoice: true, isNew: true, rating: 4.95,
    department: 'men',
    category: 'T-Shirts',
    type: 'polo',
    defaultColor: '#FFFFFF',
    fabricBadge: 'Cut & Sew Poly-Pique',
  },
  // ── SHORT SLEEVE T-SHIRTS ──
  {
    id: 'tshirt-classic',
    productId: 'tshirt-classic',
    title: 'Unisex Crafter Organic Mid-Light T-Shirt',
    brand: 'Stanley Stella', sku: 'STTU755',
    price: 320, pricePremium: 256,
    sizes: 6, colors: 7,
    colorHexes: ['#FFFFFF', '#1A1A12', '#1B2A4A', '#4A5E35', '#C62828', '#8FAF7A', '#C8C5C0'],
    providers: 3,
    isChoice: true, rating: 4.9,
    department: 'unisex',
    category: 'T-Shirts',
    type: 'tshirt',
    defaultColor: '#FFFFFF',
    fabricBadge: '100% Organic Cotton',
  },
  {
    id: 'tshirt-comfort',
    productId: 'tshirt-comfort',
    title: 'Comfort Colors 1717 Garment-Dyed Heavyweight Tee',
    brand: 'Comfort Colors', sku: 'CC1717',
    price: 340, pricePremium: 272,
    sizes: 6, colors: 6,
    colorHexes: ['#373435', '#FFFFFF', '#7799B5', '#8DB8A7', '#B86851', '#F0E2A8'],
    providers: 4,
    isChoice: true, isBestseller: true, rating: 4.9,
    department: 'men',
    category: 'T-Shirts',
    type: 'tshirt',
    defaultColor: '#FFFFFF',
    fabricBadge: 'Garment-Dyed Ring Spun',
  },
  {
    id: 'tshirt-staple',
    productId: 'tshirt-staple',
    title: 'Adult Staple Tee',
    brand: 'AS Colour', sku: '5001',
    price: 320, pricePremium: 256,
    sizes: 9, colors: 6,
    colorHexes: ['#FFFFFF', '#1A1A12', '#1B2A4A', '#373435', '#2E4A2E', '#B86851'],
    providers: 5,
    isChoice: true, isBestseller: true, rating: 4.9,
    department: 'men',
    category: 'T-Shirts',
    type: 'tshirt',
    defaultColor: '#FFFFFF',
    fabricBadge: '100% Combed Cotton',
  },
  {
    id: 'tshirt-premium',
    productId: 'tshirt-premium',
    title: 'Unisex Premium Cotton Heavy Tee',
    brand: 'Gildan', sku: 'G64000',
    price: 280, pricePremium: 224,
    sizes: 6, colors: 5,
    colorHexes: ['#FFFFFF', '#1A1A12', '#C8C5C0', '#2E4A2E', '#1B2A4A'],
    providers: 5,
    isChoice: false, isBestseller: true, rating: 4.8,
    department: 'men',
    category: 'T-Shirts',
    type: 'tshirt',
    defaultColor: '#1A1A12',
    fabricBadge: 'Heavy Cotton Softstyle',
  },

  // ── FULL SLEEVE SHIRTS & TEES ──
  {
    id: 'tshirt-longsleeve',
    productId: 'tshirt-longsleeve',
    title: 'Unisex Ultra Cotton Long Sleeve Tee',
    brand: 'Gildan', sku: '2400',
    price: 340, pricePremium: 272,
    sizes: 8, colors: 5,
    colorHexes: ['#FFFFFF', '#1A1A12', '#1B2A4A', '#C8C5C0', '#C62828'],
    providers: 10,
    isChoice: false, isBestseller: true, rating: 4.8,
    department: 'unisex',
    category: 'Long Sleeves',
    type: 'longsleeve',
    defaultColor: '#FFFFFF',
    fabricBadge: 'Full Sleeve Combed Cotton',
  },
  {
    id: 'camo-longsleeve',
    productId: 'camo-longsleeve',
    title: 'Performance Long Sleeve Camo Tee',
    brand: 'Russell Outdoors™', sku: 'RU150LS',
    price: 440, pricePremium: 352,
    sizes: 6, colors: 3,
    colorHexes: ['#4A5240', '#1A1A12', '#4A5E35'],
    providers: 4,
    isChoice: false, isNew: true, rating: 4.8,
    department: 'men',
    category: 'Long Sleeves',
    type: 'longsleeve',
    defaultColor: '#4A5240',
    fabricBadge: 'Dri-Power Full Sleeve',
  },
  {
    id: 'shirt-oxford',
    productId: 'shirt-oxford',
    title: "Women's Long Sleeve Modern Oxford Shirt",
    brand: 'Mercer+Mettle™', sku: 'MM2003',
    price: 475, pricePremium: 380,
    sizes: 5, colors: 3,
    colorHexes: ['#1B2A4A', '#FFFFFF', '#C8C5C0'],
    providers: 3,
    isChoice: true, isNew: true, rating: 4.9,
    department: 'women',
    category: 'Long Sleeves',
    type: 'longsleeve',
    defaultColor: '#FFFFFF',
    fabricBadge: 'Stretch Poplin Full Sleeve',
  },
  {
    id: 'shirt-oxford-mens',
    productId: 'shirt-oxford-mens',
    title: "Port Authority Men's Long Sleeve SuperPro Oxford Shirt",
    brand: 'Port Authority', sku: 'S664',
    price: 510, pricePremium: 408,
    sizes: 7, colors: 3,
    colorHexes: ['#1B2A4A', '#FFFFFF', '#7799B5'],
    providers: 4,
    isChoice: false, isNew: true, rating: 4.8,
    department: 'men',
    category: 'Long Sleeves',
    type: 'longsleeve',
    defaultColor: '#1B2A4A',
    fabricBadge: 'Wrinkle-Resistant Oxford',
  },
  {
    id: 'shirt-daybreak',
    productId: 'shirt-daybreak',
    title: "Women's Long Sleeve UV Daybreak Shirt",
    brand: 'Port Authority', sku: 'LW960',
    price: 490, pricePremium: 392,
    sizes: 5, colors: 3,
    colorHexes: ['#7799B5', '#FFFFFF', '#B86851'],
    providers: 3,
    isChoice: false, isNew: true, rating: 4.7,
    department: 'women',
    category: 'Long Sleeves',
    type: 'longsleeve',
    defaultColor: '#7799B5',
    fabricBadge: 'UPF 30+ Performance',
  },

  // ── HOODIES (FULL SLEEVE FLEECE) ──
  {
    id: 'hoodie-heavyweight',
    productId: 'hoodie-heavyweight',
    title: 'Heavyweight Oversized Streetwear Full-Sleeve Hoodie',
    brand: 'Stanley Stella', sku: 'STSU850',
    price: 610, pricePremium: 488,
    sizes: 6, colors: 4,
    colorHexes: ['#1A1A12', '#B86851', '#8FAF7A', '#FAF9F6'],
    providers: 3,
    isChoice: true, isNew: true, rating: 4.9,
    department: 'unisex',
    category: 'Hoodies',
    type: 'hoodie',
    defaultColor: '#1A1A12',
    fabricBadge: '500 GSM Heavyweight Terry',
  },
  {
    id: 'hoodie-premium',
    productId: 'hoodie-premium',
    title: 'Unisex Premium Pullover Full-Sleeve Hoodie',
    brand: 'Stanley Stella', sku: 'STSU812',
    price: 580, pricePremium: 464,
    sizes: 5, colors: 5,
    colorHexes: ['#1A1A12', '#9A9A8E', '#1B2A4A', '#4A5E35', '#D1C7BD'],
    providers: 2,
    isChoice: false, isNew: true, rating: 4.7,
    department: 'unisex',
    category: 'Hoodies',
    type: 'hoodie',
    defaultColor: '#1A1A12',
    fabricBadge: '350 GSM Organic Fleece',
  },
  {
    id: 'hoodie-gildan',
    productId: 'hoodie-gildan',
    title: 'Gildan 18500 Full-Sleeve Fleece Pullover Hoodie',
    brand: 'Gildan', sku: 'GI18500',
    price: 520, pricePremium: 416,
    sizes: 6, colors: 5,
    colorHexes: ['#1A1A12', '#1B2A4A', '#C8C5C0', '#FFFFFF', '#C62828'],
    providers: 5,
    isChoice: false, isBestseller: true, rating: 4.8,
    department: 'unisex',
    category: 'Hoodies',
    type: 'hoodie',
    defaultColor: '#1A1A12',
    fabricBadge: 'Air Jet Yarn Pill-Resistant',
  },
  {
    id: 'hoodie-french-terry',
    productId: 'hoodie-french-terry',
    title: 'French Terry Vintage Washed Full-Sleeve Hoodie',
    brand: 'Independent Trading Co.', sku: 'IND4000',
    price: 590, pricePremium: 472,
    sizes: 5, colors: 3,
    colorHexes: ['#232326', '#263447', '#4A543E'],
    providers: 2,
    isChoice: false, isNew: true, rating: 4.8,
    department: 'unisex',
    category: 'Hoodies',
    type: 'hoodie',
    defaultColor: '#232326',
    fabricBadge: 'Pigment-Dyed Vintage Wash',
  },
  {
    id: 'hoodie-zip',
    productId: 'hoodie-zip',
    title: 'Unisex Heavyweight Full-Zip Hoodie',
    brand: 'Gildan', sku: 'GI18600',
    price: 620, pricePremium: 496,
    sizes: 5, colors: 5,
    colorHexes: ['#1A1A12', '#1B2A4A', '#4A4A48', '#2E4A2E', '#581825'],
    providers: 3,
    isChoice: false, rating: 4.7,
    department: 'unisex',
    category: 'Hoodies',
    type: 'hoodie-zip',
    defaultColor: '#1A1A12',
    fabricBadge: 'YKK Metal Zip Full Sleeve',
  },

  // ── SWEATSHIRTS & FLEECE ──
  {
    id: 'sweatshirt-crew',
    productId: 'sweatshirt-crew',
    title: 'Unisex Heavyweight Crewneck Sweatshirt',
    brand: 'Stanley Stella', sku: 'STSU823',
    price: 460, pricePremium: 368,
    sizes: 6, colors: 7,
    colorHexes: ['#9A9A8E', '#1A1A12', '#1B2A4A', '#2E4A2E', '#581825', '#FFFFFF', '#D1C7BD'],
    providers: 4,
    isChoice: true, isBestseller: true, rating: 4.9,
    department: 'unisex',
    category: 'Sweatshirts',
    type: 'sweatshirt',
    defaultColor: '#9A9A8E',
    fabricBadge: 'V-Notch Crewneck Fleece',
  },

  // ── TANK TOPS ──
  {
    id: 'tank-muscle',
    productId: 'tank-muscle',
    title: "Bella + Canvas 6003 Women's Muscle Tank",
    brand: 'Bella + Canvas', sku: 'BC6003',
    price: 290, pricePremium: 232,
    sizes: 5, colors: 6,
    colorHexes: ['#FFFFFF', '#1A1A12', '#C8C5C0', '#4A4A48', '#B87B7B', '#4A5240'],
    providers: 3,
    isChoice: true, isNew: true, rating: 4.9,
    department: 'women',
    category: 'Tank Tops',
    type: 'tank',
    defaultColor: '#FFFFFF',
    fabricBadge: 'Low-Cut Armhole Jersey',
  },

  // ── JACKETS ──
  {
    id: 'jacket-letterman',
    productId: 'jacket-letterman',
    title: 'AWDIS JH043 Heavyweight Letterman Jacket',
    brand: 'Just Hoods by AWDis', sku: 'JH043',
    price: 920, pricePremium: 736,
    sizes: 5, colors: 5,
    colorHexes: ['#2C2E33', '#19253B', '#4E1822', '#181A1D', '#263826'],
    providers: 2,
    isChoice: false, isNew: true, rating: 4.8,
    department: 'unisex',
    category: 'Jackets',
    type: 'jacket',
    defaultColor: '#2C2E33',
    fabricBadge: 'Contrast Wool/Fleece Knit',
  },
  {
    id: 'jacket-bomber',
    productId: 'jacket-bomber',
    title: 'Streetwear Urban Bomber Jacket',
    brand: 'PrintFlow Choice', sku: 'JKT001',
    price: 780, pricePremium: 624,
    sizes: 5, colors: 5,
    colorHexes: ['#3B4A34', '#181A1E', '#1B2A4A', '#4E1822', '#3E424B'],
    providers: 2,
    isChoice: true, isNew: true, rating: 4.8,
    department: 'unisex',
    category: 'Jackets',
    type: 'jacket',
    defaultColor: '#3B4A34',
    fabricBadge: 'Water-Repellent Satin Shell',
  },

  // ── HATS & HEADWEAR ──
  {
    id: 'cap-snapback',
    productId: 'cap-snapback',
    title: 'OTTO Cap 125-978 Wool Blend Flat Bill Snapback',
    brand: 'OTTO Cap', sku: '125-978',
    price: 360, pricePremium: 288,
    sizes: 1, colors: 6,
    colorHexes: ['#1A1A12', '#8C8A84', '#1B2A4A', '#C62828', '#244585', '#FFFFFF'],
    providers: 3,
    isChoice: true, isBestseller: true, rating: 4.9,
    department: 'accessories',
    category: 'Hats',
    type: 'hat',
    defaultColor: '#1A1A12',
    fabricBadge: '6-Panel High Crown Wool',
  },
  {
    id: 'hat-dad',
    productId: 'hat-dad',
    title: 'Classic 6-Panel Cotton Dad Hat',
    brand: 'PrintFlow Choice', sku: 'HAT001',
    price: 300, pricePremium: 240,
    sizes: 1, colors: 4,
    colorHexes: ['#C4A882', '#1A1A12', '#FFFFFF', '#1B2A4A'],
    providers: 1,
    isChoice: false, rating: 4.7,
    department: 'accessories',
    category: 'Hats',
    type: 'hat',
    defaultColor: '#C4A882',
    fabricBadge: '100% Chino Twill Unstructured',
  },

  // ── BAGS & TOTES ──
  {
    id: 'tote-standard',
    productId: 'tote-standard',
    title: 'Eco Heavy Canvas Shopping Tote Bag',
    brand: 'PrintFlow Choice', sku: 'TOTE001',
    price: 220, pricePremium: 176,
    sizes: 1, colors: 4,
    colorHexes: ['#C8BC9A', '#1A1A12', '#1B2A4A', '#C62828'],
    providers: 2,
    isChoice: true, rating: 4.8,
    department: 'accessories',
    category: 'Bags',
    type: 'tote',
    defaultColor: '#C8BC9A',
    fabricBadge: '12oz 100% Cotton Canvas',
  },

  // ── MUGS & DRINKWARE ──
  {
    id: 'mug-classic',
    productId: 'mug-classic',
    title: 'Classic Ceramic Mug 11oz, 15oz',
    brand: 'PrintFlow Choice', sku: 'MUG001',
    price: 180, pricePremium: 144,
    sizes: 2, colors: 2,
    colorHexes: ['#FFFFFF', '#1A1A12'],
    providers: 2,
    isChoice: true, rating: 4.9,
    department: 'home',
    category: 'Mugs',
    type: 'mug',
    defaultColor: '#FFFFFF',
    fabricBadge: 'High-Gloss Ceramic Sublimation',
  },

  // ── HOME & LIVING ──
  {
    id: 'blanket-plush',
    productId: 'blanket-plush',
    title: 'Velveteen Plush Fleece Blanket 50" × 60"',
    brand: 'Generic brand', sku: 'BLK001',
    price: 420, pricePremium: 336,
    sizes: 3, colors: 1,
    colorHexes: ['#FDFBF7'],
    providers: 3,
    isChoice: true, isBestseller: true, rating: 4.9,
    department: 'home',
    category: 'Home & Living',
    type: 'blanket',
    defaultColor: '#FDFBF7',
    fabricBadge: 'Ultra-Soft Velveteen Plush',
  },
  {
    id: 'pillow-polyester',
    productId: 'pillow-polyester',
    title: 'Spun Polyester Square Pillowcase 18" × 18"',
    brand: 'Generic brand', sku: 'PLW001',
    price: 260, pricePremium: 208,
    sizes: 4, colors: 1,
    colorHexes: ['#FFFFFF'],
    providers: 2,
    isChoice: false, isBestseller: true, rating: 4.8,
    department: 'home',
    category: 'Home & Living',
    type: 'pillow',
    defaultColor: '#FFFFFF',
    fabricBadge: 'Concealed Zipper Spun Poly',
  },
  {
    id: 'poster-matte',
    productId: 'poster-matte',
    title: 'Premium Matte Vertical Art Poster 18" × 24"',
    brand: 'PrintFlow Choice', sku: 'POS001',
    price: 200, pricePremium: 160,
    sizes: 3, colors: 1,
    colorHexes: ['#FFFFFF'],
    providers: 2,
    isChoice: true, rating: 4.9,
    department: 'home',
    category: 'Home & Living',
    type: 'poster',
    defaultColor: '#FFFFFF',
    fabricBadge: 'Archival Museum Grade Paper',
  },
]

function renderMockupThumb(type: CatalogProduct['type'], color: string) {
  switch (type) {
    case 'tshirt':
      return <TShirtMockup color={color} view="front" className="w-full h-full max-h-48" showPrintArea={false} />
    case 'longsleeve':
      return <LongSleeveMockup color={color} view="front" className="w-full h-full max-h-48" showPrintArea={false} />
    case 'tank':
      return <TankMockup color={color} view="front" className="w-full h-full max-h-48" showPrintArea={false} />
    case 'sweatshirt':
      return <SweatshirtMockup color={color} view="front" className="w-full h-full max-h-48" showPrintArea={false} />
    case 'jacket':
      return <JacketMockup color={color} view="front" className="w-full h-full max-h-48" showPrintArea={false} />
    case 'mug':
      return <MugMockup color={color} view="front" className="w-full h-full max-h-48" showPrintArea={false} />
    case 'hoodie':
      return <HoodieMockup color={color} view="front" className="w-full h-full max-h-48" showPrintArea={false} />
    case 'hoodie-zip':
      return <ZipHoodieMockup color={color} view="front" className="w-full h-full max-h-48" showPrintArea={false} />
    case 'tote':
      return <ToteMockup color={color} view="front" className="w-full h-full max-h-48" showPrintArea={false} />
    case 'hat':
      return <HatMockup color={color} className="w-full h-full max-h-48" showPrintArea={false} />
    case 'poster':
      return <PosterMockup color={color} className="w-full h-full max-h-48" showPrintArea={false} />
    case 'blanket':
      return <BlanketMockup color={color} className="w-full h-full max-h-48" showPrintArea={false} />
    case 'pillow':
      return <PillowMockup color={color} className="w-full h-full max-h-48" showPrintArea={false} />
    case 'phone':
      return <PhoneMockup color={color} className="w-full h-full max-h-48" showPrintArea={false} />
    default:
      return <TShirtMockup color={color} view="front" className="w-full h-full max-h-48" showPrintArea={false} />
  }
}

interface SavedCustomProduct {
  id: string
  title: string
  type: CatalogProduct['type']
  color: string
  artworkUrl?: string
  brand?: string
  variants?: number
  updatedAt?: string
}

export default function CatalogPage() {
  const [activeDepartment, setActiveDepartment] = useState('all')
  const [activeCategory,   setActiveCategory]   = useState('all')
  const [searchQuery,      setSearchQuery]      = useState('')
  const [sortBy,           setSortBy]           = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular')
  const [onlyChoice,       setOnlyChoice]       = useState(false)
  const [onlyBestseller,   setOnlyBestseller]   = useState(false)
  const [customProducts,   setCustomProducts]   = useState<SavedCustomProduct[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pf_custom_products')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomProducts(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Dynamic category counts calculated from dataset
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: PRODUCTS.length,
      'all-clothing': PRODUCTS.filter(p => ['T-Shirts', 'Long Sleeves', 'Hoodies', 'Sweatshirts', 'Tank Tops', 'Jackets'].includes(p.category)).length,
    }
    for (const p of PRODUCTS) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [])

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      // 1. Department Filter
      if (activeDepartment !== 'all') {
        if (activeDepartment === 'men') {
          if (p.department !== 'men' && p.department !== 'unisex') return false
        } else if (activeDepartment === 'women') {
          if (p.department !== 'women' && p.department !== 'unisex') return false
        } else if (activeDepartment === 'accessories') {
          if (p.department !== 'accessories') return false
        } else if (activeDepartment === 'home') {
          if (p.department !== 'home') return false
        }
      }

      // 2. Clothing / Merchandise Category Filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'all-clothing') {
          const isClothing = ['T-Shirts', 'Long Sleeves', 'Hoodies', 'Sweatshirts', 'Tank Tops', 'Jackets'].includes(p.category)
          if (!isClothing) return false
        } else {
          if (p.category !== activeCategory) return false
        }
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches = p.title.toLowerCase().includes(q) ||
                        p.brand.toLowerCase().includes(q) ||
                        p.sku.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q) ||
                        (p.fabricBadge && p.fabricBadge.toLowerCase().includes(q))
        if (!matches) return false
      }

      // 4. Quality Badges
      if (onlyChoice && !p.isChoice) return false
      if (onlyBestseller && !p.isBestseller) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return (b.isChoice ? 2 : 0) + (b.isBestseller ? 1 : 0) - ((a.isChoice ? 2 : 0) + (a.isBestseller ? 1 : 0))
    })
  }, [activeDepartment, activeCategory, searchQuery, onlyChoice, onlyBestseller, sortBy])

  const resetAllFilters = () => {
    setActiveDepartment('all')
    setActiveCategory('all')
    setSearchQuery('')
    setOnlyChoice(false)
    setOnlyBestseller(false)
    setSortBy('popular')
  }

  const hasActiveFilters = activeDepartment !== 'all' || activeCategory !== 'all' || searchQuery !== '' || onlyChoice || onlyBestseller

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">

      {/* ── Breadcrumb & Top Stat Bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <nav className="text-[#736F68] flex items-center gap-2">
          <Link href="/" className="hover:text-[#1A1A12] font-medium">Home</Link>
          <span>/</span>
          <span className="text-[#1A1A12] font-bold">Catalog</span>
          {activeDepartment !== 'all' && (
            <>
              <span>/</span>
              <span className="text-[#1A1A12] font-semibold capitalize">
                {DEPARTMENTS.find(d => d.id === activeDepartment)?.label}
              </span>
            </>
          )}
          {activeCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="text-[#575C46] font-bold">
                {CLOTHING_CATEGORIES.find(c => c.id === activeCategory)?.label}
              </span>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3 text-xs text-[#6E6B65]">
          <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Check size={12} /> Addis Ababa Local Fulfillment
          </span>
          <span className="font-semibold text-[#1A1A12]">
            {PRODUCTS.length} Blank Models Ready
          </span>
        </div>
      </div>

      {/* ── Top Level Department Navigation Bar (Printify Style) ─────────────── */}
      <div className="border-b border-[#E5E2DC] pb-1 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {DEPARTMENTS.map(dept => {
          const isActive = activeDepartment === dept.id
          return (
            <button
              key={dept.id}
              onClick={() => {
                setActiveDepartment(dept.id)
                // When switching away from clothing departments to accessories or home, reset to all
                if ((dept.id === 'accessories' || dept.id === 'home') && ['T-Shirts', 'Long Sleeves', 'Hoodies', 'Sweatshirts', 'Tank Tops', 'Jackets'].includes(activeCategory)) {
                  setActiveCategory('all')
                }
              }}
              className={cn(
                'px-4 py-2.5 text-xs font-bold transition-all relative whitespace-nowrap rounded-t-xl',
                isActive
                  ? 'text-[#1A1A12] border-b-2 border-[#1A1A12] bg-[#FAF9F5]'
                  : 'text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#FAF9F5]/60'
              )}>
              {dept.label}
            </button>
          )
        })}
      </div>

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl overflow-hidden p-7 md:p-9 text-white shadow-md"
        style={{ background: 'linear-gradient(135deg, #1C2B0C 0%, #2F4514 60%, #52672A 100%)' }}>
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-bold text-emerald-300">
            <Sparkles size={12} />
            <span>PRINTIFY-GRADE APPAREL &amp; BLANKS CATALOG</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Raw Garments &amp; Blank Merchandise
          </h1>
          <p className="text-white/80 text-xs md:text-sm leading-relaxed">
            Short sleeve tees, full-sleeve hoodies, combed cotton long sleeves, letterman jackets, and blanks fulfilled locally in Addis Ababa with direct-to-garment (DTG) precision.
          </p>
        </div>
      </div>

      {/* ── My Designed Products Section (Loaded from localStorage) ────────── */}
      {customProducts.length > 0 && (
        <div className="bg-[#FAF9F5] border border-[#E8E4DA] rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#1C2B0C] text-emerald-300 rounded-lg">
                <Sparkles size={16} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#1A1A12]">My Designed Products</h2>
                <p className="text-[11px] text-[#736F68]">Custom products you designed and saved in PrintFlow Studio</p>
              </div>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs font-semibold text-[#1C2B0C] hover:underline flex items-center gap-1">
              View all in Store Manager
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {customProducts.slice(0, 4).map(prod => (
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
                    href={`/create/${prod.type === 'hat' ? 'cap-snapback' : prod.type === 'jacket' ? 'jacket-letterman' : prod.type === 'sweatshirt' ? 'sweatshirt-crew' : prod.type === 'mug' ? 'mug-classic' : prod.type === 'longsleeve' ? 'tshirt-longsleeve' : prod.type === 'hoodie' ? 'hoodie-heavyweight' : 'tshirt-classic'}`}
                    className="flex-1 py-1.5 text-center bg-[#1A1A12] hover:bg-[#2C2C22] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                    <Palette size={11} />
                    Edit Design
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Catalog Content: Sidebar + Products Grid ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-7 items-start">

        {/* ── Left Sidebar Navigation (Printify Clothing & Merch Categories) ─── */}
        <aside className="lg:col-span-1 bg-white border border-[#E5E2DC] rounded-3xl p-5 space-y-6 shadow-xs sticky top-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
            <div className="flex items-center gap-2 text-[#1A1A12] font-extrabold text-sm">
              <SlidersHorizontal size={15} />
              <span>Catalog Navigation</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors">
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* 1. CLOTHING SUB-NAVIGATION */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8880] block px-1">
              Clothing Types
            </span>
            <div className="space-y-1">
              {CLOTHING_CATEGORIES.filter(c => c.group === 'clothing' || c.id === 'all').map(cat => {
                const Icon = cat.icon
                const isSelected = activeCategory === cat.id
                const count = categoryCounts[cat.id] ?? 0
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left',
                      isSelected
                        ? 'bg-[#1A1A12] text-white shadow-xs'
                        : 'text-[#4A4742] hover:bg-[#F5F4F0] hover:text-[#1A1A12]'
                    )}>
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon size={14} className={isSelected ? 'text-white' : 'text-[#8C8880]'} />
                      <span className="truncate">{cat.label}</span>
                    </div>
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0',
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#EFECE6] text-[#6E6B65]'
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. ACCESSORIES SUB-NAVIGATION */}
          <div className="space-y-2.5 pt-3 border-t border-[#F0ECE1]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8880] block px-1">
              Accessories
            </span>
            <div className="space-y-1">
              {CLOTHING_CATEGORIES.filter(c => c.group === 'accessories').map(cat => {
                const Icon = cat.icon
                const isSelected = activeCategory === cat.id
                const count = categoryCounts[cat.id] ?? 0
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left',
                      isSelected
                        ? 'bg-[#1A1A12] text-white shadow-xs'
                        : 'text-[#4A4742] hover:bg-[#F5F4F0] hover:text-[#1A1A12]'
                    )}>
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon size={14} className={isSelected ? 'text-white' : 'text-[#8C8880]'} />
                      <span className="truncate">{cat.label}</span>
                    </div>
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0',
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#EFECE6] text-[#6E6B65]'
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. HOME & LIVING SUB-NAVIGATION */}
          <div className="space-y-2.5 pt-3 border-t border-[#F0ECE1]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8880] block px-1">
              Home &amp; Living
            </span>
            <div className="space-y-1">
              {CLOTHING_CATEGORIES.filter(c => c.group === 'home').map(cat => {
                const Icon = cat.icon
                const isSelected = activeCategory === cat.id
                const count = categoryCounts[cat.id] ?? 0
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left',
                      isSelected
                        ? 'bg-[#1A1A12] text-white shadow-xs'
                        : 'text-[#4A4742] hover:bg-[#F5F4F0] hover:text-[#1A1A12]'
                    )}>
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon size={14} className={isSelected ? 'text-white' : 'text-[#8C8880]'} />
                      <span className="truncate">{cat.label}</span>
                    </div>
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0',
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#EFECE6] text-[#6E6B65]'
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. QUALITY & PROVIDER TOGGLES */}
          <div className="space-y-2.5 pt-3 border-t border-[#F0ECE1]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8880] block px-1">
              Quality Filters
            </span>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF9F5] cursor-pointer">
                <span className="font-semibold text-[#1A1A12] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1C2B0C]" />
                  PrintFlow Choice
                </span>
                <input
                  type="checkbox"
                  checked={onlyChoice}
                  onChange={e => setOnlyChoice(e.target.checked)}
                  className="rounded border-[#D5D2CA] text-[#1A1A12] focus:ring-0"
                />
              </label>
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF9F5] cursor-pointer">
                <span className="font-semibold text-[#1A1A12] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Bestsellers Only
                </span>
                <input
                  type="checkbox"
                  checked={onlyBestseller}
                  onChange={e => setOnlyBestseller(e.target.checked)}
                  className="rounded border-[#D5D2CA] text-[#1A1A12] focus:ring-0"
                />
              </label>
            </div>
          </div>
        </aside>

        {/* ── Right Content Area: Search, Pills & Grid ───────────────────────── */}
        <div className="lg:col-span-3 space-y-5">

          {/* Search, Sort and Horizontal Quick Pills Bar */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search input with clear button */}
              <div className="relative flex-1 min-w-[240px]">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8880]" />
                <input
                  type="text"
                  placeholder="Search blanks (t-shirts, long sleeves, hoodies, mugs)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E5E2DC] focus:border-[#1A1A12] rounded-xl pl-9 pr-8 py-2.5 text-xs outline-none shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8880] hover:text-[#1A1A12]">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#8C8880] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-white border border-[#E5E2DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A12] outline-none shadow-xs cursor-pointer">
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Quick Horizontal Clothing Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CLOTHING_CATEGORIES.map(cat => {
                const isSelected = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-2xs',
                      isSelected
                        ? 'bg-[#1A1A12] text-white shadow-xs'
                        : 'bg-white border border-[#E5E2DC] text-[#6E6B65] hover:border-[#1A1A12] hover:text-[#1A1A12]'
                    )}>
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Filter Bar & Results Count */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-[#F0ECE1]">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-[#1A1A12]">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'blank' : 'blanks'}
              </span>

              {/* Active Filter Badges */}
              {activeCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAE8E3] text-[#1A1A12] font-semibold text-[11px]">
                  <span>{CLOTHING_CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
                  <button onClick={() => setActiveCategory('all')} className="hover:text-rose-600">
                    <X size={11} />
                  </button>
                </span>
              )}

              {activeDepartment !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAE8E3] text-[#1A1A12] font-semibold text-[11px]">
                  <span>{DEPARTMENTS.find(d => d.id === activeDepartment)?.label}</span>
                  <button onClick={() => setActiveDepartment('all')} className="hover:text-rose-600">
                    <X size={11} />
                  </button>
                </span>
              )}

              {onlyChoice && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E2ECCF] text-[#1C2B0C] font-semibold text-[11px]">
                  <span>PrintFlow Choice</span>
                  <button onClick={() => setOnlyChoice(false)} className="hover:text-rose-600">
                    <X size={11} />
                  </button>
                </span>
              )}

              {onlyBestseller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold text-[11px]">
                  <span>Bestsellers</span>
                  <button onClick={() => setOnlyBestseller(false)} className="hover:text-rose-600">
                    <X size={11} />
                  </button>
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-semibold text-[#8C8880] hover:text-[#1A1A12] underline">
                Clear all filters
              </button>
            )}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-[#E5E2DC] hover:border-[#1A1A12] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">

                {/* Product Image Stage (Realistic Raw Vector Mockup) */}
                <div className="relative h-60 bg-[#F5F3EE] p-4 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                    {renderMockupThumb(product.type, product.defaultColor)}
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {product.isChoice && (
                      <span className="text-[10px] font-bold bg-[#1C2B0C] text-white px-2 py-0.5 rounded-md shadow-xs">
                        PrintFlow Choice
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md shadow-xs">
                        Bestseller
                      </span>
                    )}
                    {product.isNew && (
                      <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                        New Blank
                      </span>
                    )}
                  </div>

                  {/* Quick Design Hover CTA */}
                  <Link
                    href={`/create/${product.productId}`}
                    className="absolute inset-x-4 bottom-3 bg-[#1A1A12] text-white py-2.5 rounded-xl text-xs font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg flex items-center justify-center gap-1.5">
                    <span>Start Designing</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Product Info & Specifications */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8C8880] mb-1">
                      <span>{product.brand} · {product.sku}</span>
                      <span className="text-amber-500 font-bold flex items-center gap-0.5">
                        <Star size={11} fill="currentColor" /> {product.rating}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-[#1A1A12] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/create/${product.productId}`}>
                        {product.title}
                      </Link>
                    </h3>

                    {/* Fabric / Spec Pill */}
                    {product.fabricBadge && (
                      <div className="mt-1.5">
                        <span className="text-[10px] font-semibold text-[#6E6B65] bg-[#F5F4F0] px-2 py-0.5 rounded-md inline-block">
                          {product.fabricBadge}
                        </span>
                      </div>
                    )}

                    {/* Color Swatches Preview */}
                    <div className="mt-2.5 flex items-center gap-1">
                      {product.colorHexes.slice(0, 5).map((hex, idx) => (
                        <span
                          key={idx}
                          style={{ backgroundColor: hex }}
                          className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                          title={hex}
                        />
                      ))}
                      {product.colorHexes.length > 5 && (
                        <span className="text-[10px] text-[#8C8880] font-semibold ml-1">
                          +{product.colorHexes.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Customize Button */}
                  <div className="pt-2.5 border-t border-[#E5E2DC] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#8C8880]">Base cost</div>
                      <div className="text-xs font-extrabold text-[#1A1A12]">
                        ETB {product.price}
                      </div>
                    </div>

                    <Link
                      href={`/create/${product.productId}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#E5E2DC] hover:border-[#1A1A12] bg-[#FAF9F6] hover:bg-[#1A1A12] text-[#1A1A12] hover:text-white transition-all shadow-2xs">
                      Customize
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E2DC] p-8 space-y-3">
              <Package size={40} className="mx-auto text-[#8C8880]" />
              <h3 className="font-bold text-base text-[#1A1A12]">No products found</h3>
              <p className="text-xs text-[#736F68] max-w-sm mx-auto">
                No blanks match the selected filters or search query. Try clearing the filters to view all available products.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-[#1A1A12] text-white text-xs font-bold rounded-xl hover:bg-[#2C2C22] transition-colors">
                View All Blanks
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}
