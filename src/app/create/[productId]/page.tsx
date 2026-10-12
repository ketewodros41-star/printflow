'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  Upload, Sparkles, Type, Shapes, BookTemplate,
  ChevronDown, Trash2, Info, Undo2, Redo2, X, ArrowLeft,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  ZoomIn, ZoomOut, Move, Maximize2, RotateCw, Eye, EyeOff,
  Copy, Lock, Unlock, Download, Check, Layers as LayersIcon,
  Search, Sliders, SlidersHorizontal, Palette, RefreshCw, FlipHorizontal,
  Table2, AlertTriangle, ShieldCheck, Grid, Minus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCKUP_MAP, TShirtMockup, MockupProps } from '@/components/mockups/ProductMockups'
import {
  RealisticTShirtFlatLay,
  RealisticModelTorsoMockup,
  RealisticSweatshirtFlatLay,
  RealisticCapMockup,
  RealisticVarsityJacket,
  RealisticMugMockup,
  RealisticProductPreview,
  renderLayersInSvg,
  PrintMethod,
} from '@/components/mockups/RealisticFlatLay'
import { SAMPLE_GRAPHICS, GraphicItem } from '@/lib/sampleGraphics'
import { SAMPLE_TEMPLATES, DesignTemplate } from '@/lib/sampleTemplates'

const PRINTIFY_FONTS = [
  { name: 'Impact', family: 'Impact, sans-serif' },
  { name: 'Oswald', family: 'Oswald, sans-serif' },
  { name: 'Bebas Neue', family: '"Bebas Neue", sans-serif' },
  { name: 'Inter', family: 'Inter, sans-serif' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif' },
  { name: 'Roboto Condensed', family: '"Roboto Condensed", sans-serif' },
  { name: 'Playfair Display', family: '"Playfair Display", serif' },
  { name: 'Merriweather', family: 'Merriweather, serif' },
  { name: 'Abril Fatface', family: '"Abril Fatface", serif' },
  { name: 'Pacifico', family: 'Pacifico, cursive' },
  { name: 'Lobster', family: 'Lobster, cursive' },
  { name: 'Dancing Script', family: '"Dancing Script", cursive' },
  { name: 'Caveat', family: 'Caveat, cursive' },
  { name: 'Permanent Marker', family: '"Permanent Marker", cursive' },
  { name: 'Righteous', family: 'Righteous, cursive' },
  { name: 'Fredoka One', family: '"Fredoka One", cursive' },
  { name: 'Anton', family: 'Anton, sans-serif' },
  { name: 'Raleway', family: 'Raleway, sans-serif' },
  { name: 'Courier Prime', family: '"Courier Prime", monospace' },
  { name: 'VT323', family: 'VT323, monospace' },
]

// ── Types ─────────────────────────────────────────────────────────────────────
interface Layer {
  id: string
  type: 'image' | 'text'
  src?: string
  text?: string
  view: string // Which product view this layer belongs to (e.g. 'Front', 'Back')
  x: number; y: number
  width: number; height: number
  rotation: number
  fontSize?: number
  fontFamily?: string
  color?: string
  bold?: boolean; italic?: boolean
  align?: 'left' | 'center' | 'right'
  flipX?: boolean
  visible: boolean
  locked?: boolean
  opacity?: number
  // Physical manufacturing & print technique
  printMethod?: PrintMethod
  // Advanced typography & resolution
  arc?: number           // -180 to 180 degrees
  letterSpacing?: number // -2 to 12 px
  naturalWidth?: number
  naturalHeight?: number
}

type HandleId = 'move' | 'rotate' | 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

interface DragState {
  handle: HandleId
  layerId: string
  mx0: number; my0: number
  lx0: number; ly0: number
  lw0: number; lh0: number
  lr0: number
}

const RESIZE_HANDLES: { id: HandleId; xFrac: number; yFrac: number; cursor: string }[] = [
  { id: 'nw', xFrac: 0,   yFrac: 0,   cursor: 'nw-resize' },
  { id: 'n',  xFrac: 0.5, yFrac: 0,   cursor: 'n-resize' },
  { id: 'ne', xFrac: 1,   yFrac: 0,   cursor: 'ne-resize' },
  { id: 'e',  xFrac: 1,   yFrac: 0.5, cursor: 'e-resize' },
  { id: 'se', xFrac: 1,   yFrac: 1,   cursor: 'se-resize' },
  { id: 's',  xFrac: 0.5, yFrac: 1,   cursor: 's-resize' },
  { id: 'sw', xFrac: 0,   yFrac: 1,   cursor: 'sw-resize' },
  { id: 'w',  xFrac: 0,   yFrac: 0.5, cursor: 'w-resize' },
]

// ── Product catalog ───────────────────────────────────────────────────────────
const PRODUCT_INFO: Record<string, {
  name: string; brand: string; sku: string
  type: 'tshirt' | 'longsleeve' | 'tank' | 'sweatshirt' | 'hoodie' | 'hoodie-zip' | 'jacket' | 'mug' | 'tote' | 'poster' | 'blanket' | 'pillow' | 'phone' | 'hat' | 'polo'
  isAOP?: boolean
  printAreaSize: string; costRange: string; baseCost: number; retailPrice: number
  printAreas: string[]
  colors: { name: string; hex: string; isHeather?: boolean }[]
}> = {
  'polo-sublimation': {
    name: "All-Over Print Men's Short-Sleeve Polo Shirt",
    brand: 'PrintFlow Choice',
    sku: 'POLO-AOP-01',
    type: 'polo',
    isAOP: true,
    printAreaSize: 'Cut & Sew (All 7 Panels)',
    costRange: 'ETB 450–600',
    baseCost: 480,
    retailPrice: 850,
    printAreas: [
      'Front side',
      'Back side',
      'Right sleeve',
      'Left sleeve',
      'Collar',
      'Undercollar',
      'Placket',
      'All areas (view only)',
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Heather Grey', hex: '#C8C5C0' },
      { name: 'Red', hex: '#C62828' },
      { name: 'Forest Green', hex: '#2E4A2E' },
      { name: 'Olive', hex: '#4A5E35' },
      { name: 'Sage', hex: '#8FAF7A' },
      { name: 'Pepper', hex: '#373435' },
      { name: 'Chambray', hex: '#7799B5' },
      { name: 'Seafoam', hex: '#8DB8A7' },
      { name: 'Terracotta', hex: '#B86851' },
    ],
  },
  'tshirt-classic': {
    name: 'Unisex Crafter Organic Tee', brand: 'Stanley Stella', sku: 'STTU755',
    type: 'tshirt', printAreaSize: '12" × 16" (3600 × 4800 px)', costRange: 'ETB 280–380',
    baseCost: 320, retailPrice: 650,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Back collar', 'Sleeve left', 'Sleeve right'],
    colors: [
      { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' },  { name: 'Olive', hex: '#4A5E35' },
      { name: 'Red',  hex: '#C62828' },  { name: 'Sage',  hex: '#8FAF7A' },
      { name: 'Heather Grey', hex: '#C8C5C0' },
    ],
  },
  'tshirt-premium': {
    name: 'Unisex Premium Cotton Tee', brand: 'Gildan', sku: 'G64000',
    type: 'tshirt', printAreaSize: '12" × 16" (4500 × 5400 px)', costRange: 'ETB 240–300',
    baseCost: 280, retailPrice: 550,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Back collar', 'Sleeve left', 'Sleeve right'],
    colors: [
      { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Ash Grey', hex: '#C8C5C0' }, { name: 'Forest Green', hex: '#2E4A2E' },
      { name: 'Royal Navy', hex: '#1B2A4A' },
    ],
  },
  'tshirt-comfort': {
    name: 'Comfort Colors 1717 Garment-Dyed Heavyweight Tee', brand: 'Comfort Colors', sku: 'CC1717',
    type: 'tshirt', printAreaSize: '12" × 16" (3600 × 4800 px)', costRange: 'ETB 310–390',
    baseCost: 340, retailPrice: 680,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Back collar'],
    colors: [
      { name: 'Pepper', hex: '#373435' }, { name: 'White', hex: '#FFFFFF' },
      { name: 'Chambray', hex: '#7799B5' }, { name: 'Seafoam', hex: '#8DB8A7' },
      { name: 'Terracotta', hex: '#B86851' }, { name: 'Butter', hex: '#F0E2A8' },
    ],
  },
  'tank-muscle': {
    name: "Bella + Canvas 6003 Women's Muscle Tank", brand: 'Bella + Canvas', sku: 'BC6003',
    type: 'tank', printAreaSize: '10" × 14" (3000 × 4200 px)', costRange: 'ETB 260–340',
    baseCost: 290, retailPrice: 580,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back'],
    colors: [
      { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Heather Grey', hex: '#C8C5C0' }, { name: 'Dark Grey Heather', hex: '#4A4A48' },
      { name: 'Mauve', hex: '#B87B7B' }, { name: 'Military Green', hex: '#4A5240' },
    ],
  },
  'sweatshirt-crew': {
    name: 'Unisex Heavyweight Crewneck Sweatshirt', brand: 'Stanley Stella', sku: 'STSU823',
    type: 'sweatshirt', printAreaSize: '12" × 16" (3600 × 4800 px)', costRange: 'ETB 420–500',
    baseCost: 460, retailPrice: 790,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Back collar', 'Sleeve left', 'Sleeve right'],
    colors: [
      { name: 'Heather Grey', hex: '#9A9A8E' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' }, { name: 'Forest Green', hex: '#2E4A2E' },
      { name: 'Burgundy', hex: '#581825' }, { name: 'White', hex: '#FFFFFF' },
      { name: 'Sand', hex: '#D1C7BD' },
    ],
  },
  'hoodie-premium': {
    name: 'Unisex Premium Pullover Full-Sleeve Hoodie', brand: 'Stanley Stella', sku: 'STSU812',
    type: 'hoodie', printAreaSize: '12" × 12" (4000 × 4000 px)', costRange: 'ETB 520–640',
    baseCost: 580, retailPrice: 980,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Back collar'],
    colors: [
      { name: 'Black', hex: '#1A1A12' }, { name: 'Heather Grey', hex: '#9A9A8E' },
      { name: 'Navy',  hex: '#1B2A4A' }, { name: 'Olive', hex: '#4A5E35' },
      { name: 'Sand',  hex: '#D1C7BD' },
    ],
  },
  'hoodie-heavyweight': {
    name: 'Heavyweight Oversized Streetwear Full-Sleeve Hoodie', brand: 'Stanley Stella', sku: 'STSU850',
    type: 'hoodie', printAreaSize: '12" × 12" (4000 × 4000 px)', costRange: 'ETB 560–680',
    baseCost: 610, retailPrice: 1050,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back'],
    colors: [
      { name: 'Vintage Black', hex: '#1A1A12' }, { name: 'Earthy Clay', hex: '#B86851' },
      { name: 'Sage Green', hex: '#8FAF7A' }, { name: 'Bone White', hex: '#FAF9F6' },
    ],
  },
  'hoodie-gildan': {
    name: 'Gildan 18500 Full-Sleeve Fleece Pullover Hoodie', brand: 'Gildan', sku: 'GI18500',
    type: 'hoodie', printAreaSize: '12" × 12" (4000 × 4000 px)', costRange: 'ETB 480–580',
    baseCost: 520, retailPrice: 890,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back'],
    colors: [
      { name: 'Black', hex: '#1A1A12' }, { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Sport Grey', hex: '#C8C5C0' }, { name: 'White', hex: '#FFFFFF' },
      { name: 'Red', hex: '#C62828' },
    ],
  },
  'hoodie-french-terry': {
    name: 'French Terry Vintage Washed Full-Sleeve Hoodie', brand: 'Independent Trading Co.', sku: 'IND4000',
    type: 'hoodie', printAreaSize: '12" × 12" (4000 × 4000 px)', costRange: 'ETB 540–660',
    baseCost: 590, retailPrice: 1020,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back'],
    colors: [
      { name: 'Pigment Black', hex: '#232326' }, { name: 'Washed Navy', hex: '#263447' },
      { name: 'Washed Olive', hex: '#4A543E' },
    ],
  },
  'hoodie-zip': {
    name: 'Unisex Heavyweight Full-Zip Hoodie', brand: 'Gildan', sku: 'GI18600',
    type: 'hoodie-zip', printAreaSize: 'Left Chest: 4" × 4" / Back: 12" × 16"', costRange: 'ETB 580–680',
    baseCost: 620, retailPrice: 1050,
    printAreas: ['Left chest', 'Right chest', 'Back'],
    colors: [
      { name: 'Black', hex: '#1A1A12' }, { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Dark Heather', hex: '#4A4A48' }, { name: 'Forest Green', hex: '#2E4A2E' },
      { name: 'Maroon', hex: '#581825' },
    ],
  },
  'jacket-bomber': {
    name: 'Streetwear Urban Bomber Jacket', brand: 'PrintFlow Choice', sku: 'JKT001',
    type: 'jacket', printAreaSize: 'Left Chest: 4" × 4" / Back: 12" × 16"', costRange: 'ETB 720–850',
    baseCost: 780, retailPrice: 1350,
    printAreas: ['Left chest', 'Right chest', 'Back'],
    colors: [
      { name: 'Olive Green', hex: '#3B4A34' }, { name: 'Midnight Black', hex: '#181A1E' },
      { name: 'Navy Blue', hex: '#1B2A4A' }, { name: 'Burgundy Wine', hex: '#4E1822' },
      { name: 'Gunmetal Grey', hex: '#3E424B' },
    ],
  },
  'mug-classic': {
    name: 'Classic Ceramic Mug 11oz', brand: 'PrintFlow Choice', sku: 'MUG001',
    type: 'mug', printAreaSize: '3.5" × 3.5" (Wrap: 8.5" × 3.5")', costRange: 'ETB 160–200',
    baseCost: 180, retailPrice: 380,
    printAreas: ['Front', 'Wrap', 'Handle left', 'Handle right'],
    colors: [
      { name: 'Glossy White', hex: '#FFFFFF' }, { name: 'Glossy Black', hex: '#1A1A12' },
    ],
  },
  'mug-black': {
    name: 'Black Ceramic Mug 11oz, 15oz', brand: 'PrintFlow Choice', sku: 'MUG002',
    type: 'mug', printAreaSize: '8.5" × 3.5" (8808 × 3006 px)', costRange: 'ETB 170–220',
    baseCost: 190, retailPrice: 400,
    printAreas: ['Front', 'Wrap', 'Handle left', 'Handle right'],
    colors: [
      { name: 'Glossy Black', hex: '#1A1A12' }, { name: 'Glossy White', hex: '#FFFFFF' },
    ],
  },
  'tote-standard': {
    name: 'Eco Heavy Canvas Tote Bag', brand: 'PrintFlow Choice', sku: 'TOTE001',
    type: 'tote', printAreaSize: '10" × 12" (3600 × 3600 px)', costRange: 'ETB 200–260',
    baseCost: 220, retailPrice: 480,
    printAreas: ['Front', 'Back'],
    colors: [
      { name: 'Natural Canvas', hex: '#C8BC9A' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' }, { name: 'Crimson', hex: '#C62828' },
    ],
  },
  'hat-dad': {
    name: 'Classic Cotton Dad Hat', brand: 'PrintFlow Choice', sku: 'HAT001',
    type: 'hat', printAreaSize: '4" × 2" (2362 × 1180 px)', costRange: 'ETB 280–340',
    baseCost: 300, retailPrice: 580,
    printAreas: ['Front'],
    colors: [
      { name: 'Tan Khaki', hex: '#C4A882' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'White', hex: '#FFFFFF' }, { name: 'Navy', hex: '#1B2A4A' },
    ],
  },
  'cap-snapback': {
    name: 'OTTO Cap 125-978 Wool Blend Flat Bill Snapback', brand: 'OTTO Cap', sku: '125-978',
    type: 'hat', printAreaSize: '4" × 2" (2362 × 1180 px)', costRange: 'ETB 340–420',
    baseCost: 360, retailPrice: 690,
    printAreas: ['Front', 'Back side', 'Right side', 'Left side'],
    colors: [
      { name: 'Black', hex: '#1A1A12' },
      { name: 'Heather Grey', hex: '#8C8A84' },
      { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Red', hex: '#C62828' },
      { name: 'Royal', hex: '#244585' },
      { name: 'White', hex: '#FFFFFF' },
    ],
  },
  'jacket-letterman': {
    name: 'AWDIS JH043 Heavyweight Letterman Jacket', brand: 'Just Hoods by AWDis', sku: 'JH043',
    type: 'jacket', printAreaSize: 'Left Chest: 4" × 4" / Back: 12" × 16"', costRange: 'ETB 850–1100',
    baseCost: 920, retailPrice: 1650,
    printAreas: ['Left chest', 'Right chest', 'Back', 'Right sleeve', 'Left sleeve'],
    colors: [
      { name: 'Charcoal / Heather', hex: '#2C2E33' },
      { name: 'Oxford Navy / White', hex: '#19253B' },
      { name: 'Burgundy / Heather', hex: '#4E1822' },
      { name: 'Jet Black / White', hex: '#181A1D' },
      { name: 'Forest Green / White', hex: '#263826' },
    ],
  },
  'tshirt-staple': {
    name: 'Adult Staple Tee', brand: 'AS Colour', sku: '5001',
    type: 'tshirt', printAreaSize: '12" × 16" (3600 × 4800 px)', costRange: 'ETB 290–370',
    baseCost: 320, retailPrice: 650,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Back collar', 'Sleeve left', 'Sleeve right'],
    colors: [
      { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Navy', hex: '#1B2A4A' }, { name: 'Coal', hex: '#373435' },
      { name: 'Forest', hex: '#2E4A2E' }, { name: 'Clay', hex: '#B86851' },
    ],
  },
  'tshirt-longsleeve': {
    name: 'Unisex Ultra Cotton Long Sleeve Tee', brand: 'Gildan', sku: '2400',
    type: 'longsleeve', printAreaSize: '12" × 16" (3600 × 4800 px)', costRange: 'ETB 310–390',
    baseCost: 340, retailPrice: 680,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Sleeve left', 'Sleeve right'],
    colors: [
      { name: 'White', hex: '#FFFFFF', isHeather: false },
      { name: 'Ash', hex: '#DEDEDB', isHeather: true },
      { name: 'Sport Grey', hex: '#C8C5C0', isHeather: true },
      { name: 'Dark Heather', hex: '#4A4A48', isHeather: true },
      { name: 'Black', hex: '#1A1A12', isHeather: false },
      { name: 'Red', hex: '#C62828', isHeather: false },
      { name: 'Safety Green', hex: '#D6ED17', isHeather: false },
      { name: 'Navy', hex: '#1B2A4A', isHeather: false },
      { name: 'Forest Green', hex: '#1B4332', isHeather: false },
      { name: 'Maroon', hex: '#5C1D24', isHeather: false },
      { name: 'Royal', hex: '#1D4ED8', isHeather: false },
      { name: 'Sand', hex: '#D4C5B3', isHeather: false },
      { name: 'Military Green', hex: '#4B5320', isHeather: false },
      { name: 'Orange', hex: '#EA580C', isHeather: false },
      { name: 'Carolina Blue', hex: '#7BAED1', isHeather: false },
    ],
  },
  'camo-longsleeve': {
    name: 'Performance Long Sleeve Camo Tee', brand: 'Russell Outdoors™', sku: 'RU150LS',
    type: 'longsleeve', printAreaSize: '12" × 16" (3600 × 4800 px)', costRange: 'ETB 440–540',
    baseCost: 440, retailPrice: 790,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Sleeve left', 'Sleeve right'],
    colors: [
      { name: 'Woodland Camo', hex: '#4A5240' }, { name: 'Black', hex: '#1A1A12' },
      { name: 'Olive', hex: '#4A5E35' },
    ],
  },
  'shirt-daybreak': {
    name: "Women's Long Sleeve UV Daybreak Shirt", brand: 'Port Authority', sku: 'LW960',
    type: 'longsleeve', printAreaSize: '10" × 14" (3000 × 4200 px)', costRange: 'ETB 490–590',
    baseCost: 490, retailPrice: 850,
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back'],
    colors: [
      { name: 'Sky Blue', hex: '#7799B5' }, { name: 'White', hex: '#FFFFFF' },
      { name: 'Soft Coral', hex: '#B86851' },
    ],
  },
  'shirt-oxford': {
    name: "Women's Long Sleeve Modern Oxford Shirt", brand: 'Mercer+Mettle™', sku: 'MM2003',
    type: 'longsleeve', printAreaSize: 'Left Chest: 4" × 4" / Back: 10" × 12"', costRange: 'ETB 475–580',
    baseCost: 475, retailPrice: 820,
    printAreas: ['Left chest', 'Right chest', 'Back'],
    colors: [
      { name: 'Oxford Blue', hex: '#1B2A4A' }, { name: 'White', hex: '#FFFFFF' },
      { name: 'Light French Grey', hex: '#C8C5C0' },
    ],
  },
  'shirt-oxford-mens': {
    name: "Port Authority Men's Long Sleeve SuperPro Oxford Shirt", brand: 'Port Authority', sku: 'S664',
    type: 'longsleeve', printAreaSize: 'Left Chest: 4" × 4" / Back: 10" × 12"', costRange: 'ETB 490–600',
    baseCost: 510, retailPrice: 880,
    printAreas: ['Left chest', 'Right chest', 'Back'],
    colors: [
      { name: 'Classic Navy', hex: '#1B2A4A' }, { name: 'Oxford White', hex: '#FFFFFF' },
      { name: 'Light Blue', hex: '#7799B5' },
    ],
  },
  'poster-matte': {
    name: 'Premium Matte Vertical Poster', brand: 'PrintFlow Choice', sku: 'POS001',
    type: 'poster', printAreaSize: '18" × 24" (5400 × 7200 px)', costRange: 'ETB 180–260',
    baseCost: 200, retailPrice: 450,
    printAreas: ['Front'],
    colors: [
      { name: 'White Archival', hex: '#FFFFFF' },
    ],
  },
  'blanket-plush': {
    name: 'Velveteen Plush Blanket 50" × 60"', brand: 'Generic brand', sku: 'BLK001',
    type: 'blanket', printAreaSize: '50" × 60" (7500 × 9000 px)', costRange: 'ETB 380–480',
    baseCost: 420, retailPrice: 890,
    printAreas: ['Front'],
    colors: [
      { name: 'Off White Fleece', hex: '#FDFBF7' },
    ],
  },
  'pillow-polyester': {
    name: 'Spun Polyester Square Pillowcase 18" × 18"', brand: 'Generic brand', sku: 'PLW001',
    type: 'pillow', printAreaSize: '18" × 18" (4500 × 4500 px)', costRange: 'ETB 230–290',
    baseCost: 260, retailPrice: 550,
    printAreas: ['Front', 'Back'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
    ],
  },
}

// ── Calibrated Print Area Boxes (Canvas px on a 500 × 560 stage) ──────────────
const PRINT_AREA_SPECS: Record<string, Record<string, { left: number; top: number; w: number; h: number; label: string }>> = {
  polo: {
    'Front side':              { left: 145, top: 85,  w: 210, h: 375, label: 'Front Panel · Cut & Sew' },
    'Back side':               { left: 145, top: 85,  w: 210, h: 375, label: 'Back Panel · Cut & Sew' },
    'Right sleeve':            { left: 95,  top: 105, w: 310, h: 185, label: 'Right Sleeve Panel' },
    'Left sleeve':             { left: 95,  top: 105, w: 310, h: 185, label: 'Left Sleeve Panel' },
    'Collar':                  { left: 65,  top: 105, w: 370, h: 80,  label: 'Collar Band Panel' },
    'Undercollar':             { left: 65,  top: 105, w: 370, h: 80,  label: 'Undercollar Panel' },
    'Placket':                 { left: 145, top: 95,  w: 110, h: 260, label: 'Placket Button Strip' },
    'All areas (view only)':    { left: 20,  top: 20,  w: 960, h: 480, label: 'All 7 Panels (Macro View)' },
  },
  tshirt: {
    'Center chest': { left: 156, top: 145, w: 188, h: 240, label: 'Center Chest · 12" × 16"' },
    'Left chest':   { left: 275, top: 152, w: 74,  h: 74,  label: 'Left Chest (Pocket) · 4" × 4"' },
    'Right chest':  { left: 151, top: 152, w: 74,  h: 74,  label: 'Right Chest · 4" × 4"' },
    'Front':        { left: 156, top: 145, w: 188, h: 240, label: 'Front Chest · 12" × 16"' },
    'Back':         { left: 156, top: 125, w: 188, h: 260, label: 'Back Panel · 12" × 16"' },
    'Back collar':  { left: 215, top: 96,  w: 70,  h: 70,  label: 'Back Collar · 3.5" × 3.5"' },
    'Sleeve left':  { left: 175, top: 120, w: 150, h: 160, label: 'Left Sleeve · 4" × 4"' },
    'Sleeve right': { left: 175, top: 120, w: 150, h: 160, label: 'Right Sleeve · 4" × 4"' },
  },
  longsleeve: {
    'Center chest': { left: 156, top: 145, w: 188, h: 240, label: 'Center Chest · 12" × 16"' },
    'Left chest':   { left: 275, top: 152, w: 74,  h: 74,  label: 'Left Chest (Pocket) · 4" × 4"' },
    'Right chest':  { left: 151, top: 152, w: 74,  h: 74,  label: 'Right Chest · 4" × 4"' },
    'Front':        { left: 156, top: 145, w: 188, h: 240, label: 'Front Chest · 12" × 16"' },
    'Back':         { left: 156, top: 125, w: 188, h: 260, label: 'Back Panel · 12" × 16"' },
    'Sleeve left':  { left: 175, top: 120, w: 150, h: 160, label: 'Left Sleeve · 4" × 4"' },
    'Sleeve right': { left: 175, top: 120, w: 150, h: 160, label: 'Right Sleeve · 4" × 4"' },
  },
  tank: {
    'Center chest': { left: 160, top: 145, w: 180, h: 240, label: 'Center Chest · 10" × 14"' },
    'Left chest':   { left: 260, top: 152, w: 70,  h: 70,  label: 'Left Chest (Pocket) · 4" × 4"' },
    'Right chest':  { left: 170, top: 152, w: 70,  h: 70,  label: 'Right Chest · 4" × 4"' },
    'Front':        { left: 160, top: 145, w: 180, h: 240, label: 'Front Chest · 10" × 14"' },
    'Back':         { left: 160, top: 130, w: 180, h: 260, label: 'Back Panel · 10" × 14"' },
  },
  sweatshirt: {
    'Center chest': { left: 156, top: 140, w: 188, h: 250, label: 'Center Chest · 12" × 16"' },
    'Left chest':   { left: 275, top: 150, w: 74,  h: 74,  label: 'Left Chest (Pocket) · 4" × 4"' },
    'Right chest':  { left: 151, top: 150, w: 74,  h: 74,  label: 'Right Chest · 4" × 4"' },
    'Front':        { left: 156, top: 140, w: 188, h: 250, label: 'Front Chest · 12" × 16"' },
    'Back':         { left: 156, top: 125, w: 188, h: 260, label: 'Back Panel · 12" × 16"' },
    'Back collar':  { left: 215, top: 96,  w: 70,  h: 70,  label: 'Back Collar · 3.5" × 3.5"' },
    'Sleeve left':  { left: 175, top: 120, w: 150, h: 160, label: 'Left Sleeve · 4" × 4"' },
    'Sleeve right': { left: 175, top: 120, w: 150, h: 160, label: 'Right Sleeve · 4" × 4"' },
  },
  hoodie: {
    'Center chest': { left: 156, top: 165, w: 188, h: 160, label: 'Center Chest · 12" × 10"' },
    'Left chest':   { left: 275, top: 160, w: 70,  h: 70,  label: 'Left Chest (Pocket) · 4" × 4"' },
    'Right chest':  { left: 155, top: 160, w: 70,  h: 70,  label: 'Right Chest · 4" × 4"' },
    'Front':        { left: 156, top: 165, w: 188, h: 160, label: 'Front Chest · 12" × 10"' },
    'Back':         { left: 156, top: 130, w: 188, h: 280, label: 'Back Panel · 12" × 16"' },
    'Back collar':  { left: 215, top: 100, w: 70,  h: 70,  label: 'Back Collar · 3.5" × 3.5"' },
  },
  'hoodie-zip': {
    'Left chest':   { left: 272, top: 155, w: 76,  h: 76,  label: 'Left Chest · 4" × 4"' },
    'Right chest':  { left: 152, top: 155, w: 76,  h: 76,  label: 'Right Chest · 4" × 4"' },
    'Front':        { left: 272, top: 155, w: 76,  h: 76,  label: 'Left Chest · 4" × 4"' },
    'Back':         { left: 156, top: 130, w: 188, h: 280, label: 'Back Panel · 12" × 16"' },
  },
  jacket: {
    'Left chest':   { left: 272, top: 152, w: 80,  h: 80,  label: 'Left Chest (Badge) · 4" × 4"' },
    'Right chest':  { left: 148, top: 152, w: 80,  h: 80,  label: 'Right Chest · 4" × 4"' },
    'Front':        { left: 272, top: 152, w: 80,  h: 80,  label: 'Left Chest · 4" × 4"' },
    'Back':         { left: 156, top: 135, w: 188, h: 260, label: 'Back Panel · 12" × 16"' },
  },
  mug: {
    'Front':        { left: 145, top: 145, w: 170, h: 210, label: 'Front Center · 3.5" × 3.5"' },
    'Wrap':         { left: 105, top: 145, w: 290, h: 210, label: 'Panoramic Wrap · 8.5" × 3.5"' },
    'Handle left':  { left: 145, top: 145, w: 170, h: 210, label: 'Left Handle · 3.5" × 3.5"' },
    'Handle right': { left: 145, top: 145, w: 170, h: 210, label: 'Right Handle · 3.5" × 3.5"' },
  },
  tote: {
    'Front':        { left: 130, top: 235, w: 240, h: 250, label: 'Front · 10" × 12"' },
    'Back':         { left: 130, top: 235, w: 240, h: 250, label: 'Back · 10" × 12"' },
  },
  hat: {
    'Front':        { left: 195, top: 155, w: 110, h: 80,  label: 'Front Crown · 4" × 2"' },
    'Back side':    { left: 195, top: 165, w: 110, h: 70,  label: 'Back Arch · 3.5" × 2"' },
    'Right side':   { left: 195, top: 165, w: 90,  h: 70,  label: 'Right Side · 3" × 2"' },
    'Left side':    { left: 195, top: 165, w: 90,  h: 70,  label: 'Left Side · 3" × 2"' },
  },
  poster: {
    'Front':        { left: 120, top: 90,  w: 260, h: 380, label: 'Full Bleed Front · 18" × 24"' },
  },
  blanket: {
    'Front':        { left: 100, top: 60,  w: 300, h: 440, label: 'Full Fleece Surface · 50" × 60"' },
  },
  pillow: {
    'Front':        { left: 120, top: 120, w: 260, h: 260, label: 'Square Front · 18" × 18"' },
    'Back':         { left: 120, top: 120, w: 260, h: 260, label: 'Square Back · 18" × 18"' },
  },
}

const FONTS = [
  'Inter', 'Montserrat', 'Oswald', 'Bebas Neue', 'Playfair Display',
  'Impact', 'Pacifico', 'Roboto', 'Courier New', 'Georgia'
]

const TEXT_COLORS = [
  '#000000', '#FFFFFF', '#1C2B0C', '#C62828', '#1B2A4A',
  '#F59E0B', '#8B5CF6', '#EC4899', '#E6C875', '#4A5E35'
]

// ── Photorealistic Mockup Scenes matching Image 1, 2, 3, 4, 5 (Printify Standards) ─────
interface MockupScene {
  id: string
  label: string
  photoId?: string
  viewType?: 'flat-front' | 'flat-back' | 'model' | 'photo'
  printBox: { left: number; top: number; width: number; height: number }
  isChart?: boolean
}

const PRODUCT_MOCKUP_SCENES: Record<string, MockupScene[]> = {
  tshirt: [
    { id: 'front',       label: 'Front',       viewType: 'flat-front', printBox: { left: 30, top: 23, width: 40, height: 48 } },
    { id: 'back',        label: 'Back',        viewType: 'flat-back',  printBox: { left: 30, top: 21, width: 40, height: 50 } },
    { id: 'on-person',   label: 'On Person',   viewType: 'model', photoId: '/mockups/model-female-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'on-person-2', label: 'On Person 2', viewType: 'model', photoId: '/mockups/model-male-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'size-chart',  label: 'Size Chart',  isChart: true, photoId: '', printBox: { left: 30, top: 30, width: 40, height: 40 } },
  ],
  longsleeve: [
    { id: 'front',        label: 'Front',          viewType: 'flat-front', printBox: { left: 30, top: 23, width: 40, height: 48 } },
    { id: 'back',         label: 'Back',           viewType: 'flat-back',  printBox: { left: 30, top: 21, width: 40, height: 50 } },
    { id: 'collar',       label: 'Collar Closeup', viewType: 'flat-front', printBox: { left: 24, top: 12, width: 52, height: 60 } },
    { id: 'person-left',  label: 'Person Left',    viewType: 'model', photoId: '/mockups/model-longsleeve-male.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'person-right', label: 'Person Right',   viewType: 'model', photoId: '/mockups/model-longsleeve-female.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'size-chart',   label: 'Size Chart',     isChart: true, photoId: '', printBox: { left: 30, top: 30, width: 40, height: 40 } },
  ],
  tank: [
    { id: 'front',       label: 'Front Flat-Lay', viewType: 'flat-front', printBox: { left: 32, top: 24, width: 36, height: 46 } },
    { id: 'back',        label: 'Back Flat-Lay',  viewType: 'flat-back',  printBox: { left: 32, top: 22, width: 36, height: 48 } },
    { id: 'on-person',   label: 'On Person',      viewType: 'model', photoId: '/mockups/model-female-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'size-chart',  label: 'Size Chart',     isChart: true, photoId: '', printBox: { left: 30, top: 30, width: 40, height: 40 } },
  ],
  sweatshirt: [
    { id: 'front',       label: 'Front',       viewType: 'flat-front', printBox: { left: 30, top: 23, width: 40, height: 48 } },
    { id: 'back',        label: 'Back',        viewType: 'flat-back',  printBox: { left: 30, top: 21, width: 40, height: 50 } },
    { id: 'on-person',   label: 'On Person 1', viewType: 'model', photoId: '/mockups/model-female-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'on-person-2', label: 'On Person 2', viewType: 'model', photoId: '/mockups/model-male-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'flat-lay',    label: 'Flat Lay',    viewType: 'flat-front', printBox: { left: 30, top: 23, width: 40, height: 48 } },
    { id: 'size-chart',  label: 'Size Chart',  isChart: true, photoId: '', printBox: { left: 30, top: 30, width: 40, height: 40 } },
  ],
  hat: [
    { id: 'front',          label: 'Front',          viewType: 'flat-front', printBox: { left: 32, top: 26, width: 36, height: 26 } },
    { id: 'back',           label: 'Back',           viewType: 'flat-back',  printBox: { left: 32, top: 26, width: 36, height: 26 } },
    { id: 'front-side',     label: 'Front Side',     viewType: 'flat-front', printBox: { left: 32, top: 26, width: 36, height: 26 } },
    { id: 'back-side',      label: 'Back Side',      viewType: 'flat-back',  printBox: { left: 32, top: 26, width: 36, height: 26 } },
    { id: 'on-person',      label: 'Person 1 Front', viewType: 'model', photoId: '/mockups/model-female-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'on-person-back', label: 'Person 1 Back',  viewType: 'model', photoId: '/mockups/model-female-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'on-person-2',    label: 'Person 2 Front', viewType: 'model', photoId: '/mockups/model-male-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
  ],
  jacket: [
    { id: 'front',       label: 'Front',          viewType: 'flat-front', printBox: { left: 30, top: 23, width: 40, height: 48 } },
    { id: 'back',        label: 'Back',           viewType: 'flat-back',  printBox: { left: 30, top: 21, width: 40, height: 50 } },
    { id: 'left-chest',  label: 'Left Chest',     viewType: 'flat-front', printBox: { left: 50, top: 28, width: 25, height: 25 } },
    { id: 'on-person',   label: 'Streetwear Model', viewType: 'model', photoId: '/mockups/model-male-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'size-chart',  label: 'Size Chart',     isChart: true, photoId: '', printBox: { left: 30, top: 30, width: 40, height: 40 } },
  ],
  polo: [
    { id: 'front',      label: 'Front Studio', viewType: 'flat-front', printBox: { left: 30, top: 24, width: 40, height: 48 } },
    { id: 'back',       label: 'Back Studio',  viewType: 'flat-back',  printBox: { left: 30, top: 20, width: 40, height: 52 } },
    { id: 'size-chart', label: 'Size Chart',   isChart: true, photoId: '', printBox: { left: 30, top: 30, width: 40, height: 40 } },
  ],
  mug: [
    { id: 'front',        label: 'Front Studio',   viewType: 'flat-front', printBox: { left: 30, top: 30, width: 40, height: 40 } },
    { id: 'handle-left',  label: 'Handle Left',    viewType: 'flat-front', printBox: { left: 30, top: 30, width: 40, height: 40 } },
    { id: 'handle-right', label: 'Handle Right',   viewType: 'flat-front', printBox: { left: 30, top: 30, width: 40, height: 40 } },
    { id: 'wrap',         label: 'Panoramic Wrap', viewType: 'flat-front', printBox: { left: 20, top: 30, width: 60, height: 40 } },
    { id: 'tabletop',     label: 'Tabletop Studio',viewType: 'flat-front', printBox: { left: 30, top: 30, width: 40, height: 40 } },
  ],
  tote: [
    { id: 'front',     label: 'Canvas Flat', viewType: 'flat-front', printBox: { left: 30, top: 35, width: 40, height: 42 } },
    { id: 'back',      label: 'Back Flat',   viewType: 'flat-back',  printBox: { left: 30, top: 35, width: 40, height: 42 } },
    { id: 'lifestyle', label: 'Lifestyle',   viewType: 'model', photoId: '/mockups/model-female-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
  ],
  hoodie: [
    { id: 'front',      label: 'Front Pullover', viewType: 'flat-front', printBox: { left: 30, top: 28, width: 40, height: 40 } },
    { id: 'back',       label: 'Back',           viewType: 'flat-back',  printBox: { left: 30, top: 25, width: 40, height: 45 } },
    { id: 'on-person',  label: 'On Model',       viewType: 'model', photoId: '/mockups/model-male-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'size-chart', label: 'Size Chart',     isChart: true, photoId: '', printBox: { left: 30, top: 30, width: 40, height: 40 } },
  ],
  'hoodie-zip': [
    { id: 'front',      label: 'Front Full-Zip', viewType: 'flat-front', printBox: { left: 50, top: 28, width: 25, height: 25 } },
    { id: 'back',       label: 'Back',           viewType: 'flat-back',  printBox: { left: 30, top: 25, width: 40, height: 45 } },
    { id: 'on-person',  label: 'On Model',       viewType: 'model', photoId: '/mockups/model-male-torso-clean.jpg', printBox: { left: 34, top: 28, width: 32, height: 40 } },
    { id: 'size-chart', label: 'Size Chart',     isChart: true, photoId: '', printBox: { left: 30, top: 30, width: 40, height: 40 } },
  ],
  poster: [
    { id: 'front',      label: 'Front Studio',   viewType: 'flat-front', printBox: { left: 15, top: 12, width: 70, height: 76 } },
    { id: 'size-chart', label: 'Size Chart',     isChart: true, photoId: '', printBox: { left: 30, top: 30, width: 40, height: 40 } },
  ],
  blanket: [
    { id: 'front',      label: 'Plush Flat-Lay', viewType: 'flat-front', printBox: { left: 10, top: 8, width: 80, height: 84 } },
  ],
  pillow: [
    { id: 'front',      label: 'Front Studio',   viewType: 'flat-front', printBox: { left: 20, top: 20, width: 60, height: 60 } },
    { id: 'back',       label: 'Back Studio',    viewType: 'flat-back',  printBox: { left: 20, top: 20, width: 60, height: 60 } },
  ],
}

export default function ProductCreatorPage() {
  const { productId = 'tshirt-classic' } = useParams<{ productId: string }>()
  const router = useRouter()

  const info = PRODUCT_INFO[productId] ?? PRODUCT_INFO['tshirt-classic']
  const MockupComponent = MOCKUP_MAP[info.type] ?? TShirtMockup
  const mockupScenes = PRODUCT_MOCKUP_SCENES[info.type] ?? PRODUCT_MOCKUP_SCENES['tshirt']

  // State
  const [layers,          setLayers]          = useState<Layer[]>([])
  const [selectedId,      setSelectedId]      = useState<string | null>(null)
  const [activePrintArea, setActivePrintArea] = useState(info.isAOP ? 'All areas (view only)' : info.printAreas[0])
  const [productColor,    setProductColor]    = useState(info.colors[0].hex)
  const [selectedSize,    setSelectedSize]    = useState('L')
  const [activeTab,       setActiveTab]       = useState<'edit' | 'preview'>('edit')
  const [activeTool,      setActiveTool]      = useState<string>('upload')
  const [previewScene,    setPreviewScene]    = useState<string>(mockupScenes[0].id)
  const [mockupColorMode, setMockupColorMode] = useState<'rgb' | 'cmyk'>('rgb')
  const [zoom,            setZoom]            = useState(100)
  const [showInfo,        setShowInfo]        = useState(false)
  const [addText,         setAddText]         = useState('')
  const [saved,           setSaved]           = useState(false)
  const [aiPrompt,        setAiPrompt]        = useState('')
  const [isGeneratingAi,  setIsGeneratingAi]  = useState(false)
  const [editingTextId,   setEditingTextId]   = useState<string | null>(null)
  const [isExporting,     setIsExporting]     = useState(false)
  const [showVariantMatrix, setShowVariantMatrix] = useState(false)
  const [variantModalTab, setVariantModalTab]     = useState<'matrix' | 'sizing'>('matrix')
  const [sizeUnit,        setSizeUnit]            = useState<'in' | 'cm'>('in')
  const [variantMarkupPct, setVariantMarkupPct]   = useState(50)
  const [snapGuide,       setSnapGuide]       = useState<{ x: number | null; y: number | null }>({ x: null, y: null })
  const [graphicCategory, setGraphicCategory] = useState<string>('All')
  const [graphicSearch,   setGraphicSearch]   = useState<string>('')
  const [templateCategory, setTemplateCategory] = useState<string>('All')
  const [templateSearch,   setTemplateSearch]   = useState<string>('')
  const [showColorPopover, setShowColorPopover] = useState<boolean>(false)
  const [activePrintMethod, setActivePrintMethod] = useState<PrintMethod>('dtg')
  const [previewPrintMethod, setPreviewPrintMethod] = useState<'auto' | PrintMethod>('auto')

  // Printify-Style In-Sidebar Variant Selection (Matching Image 2)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>({
    '#FFFFFF': ['S', 'M', 'L', 'XL', '2XL'],
    '#DEDEDB': ['S', 'M', 'L', 'XL'],
    '#C8C5C0': ['S', 'M', 'L', 'XL', '2XL'],
    '#4A4A48': ['M', 'L', 'XL'],
    '#1A1A12': ['M', 'L', 'XL'],
    '#C62828': ['M', 'L'],
  })
  const [expandedColor, setExpandedColor] = useState<string | null>(null)
  const [sidebarEditTab, setSidebarEditTab] = useState<'variants' | 'inspector'>('variants')
  const [variantSubTab, setVariantSubTab] = useState<'color' | 'size'>('color')

  useEffect(() => {
    if (selectedId) {
      setSidebarEditTab('inspector')
    }
  }, [selectedId])

  // History stack for Undo / Redo
  const [history, setHistory] = useState<Layer[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const isHistoryAction = useRef(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const fileRef   = useRef<HTMLInputElement>(null)
  const dragRef   = useRef<DragState | null>(null)
  const zoomRef   = useRef(zoom)
  useEffect(() => { zoomRef.current = zoom }, [zoom])

  // Get calibrated print box for current product and active view
  const currentProductAreas = PRINT_AREA_SPECS[info.type] ?? PRINT_AREA_SPECS['tshirt']
  const printBox = currentProductAreas[activePrintArea] ?? Object.values(currentProductAreas)[0]

  // Map print area name to mockup view prop
  const normArea = activePrintArea.toLowerCase()
  const isSleeve = normArea.includes('sleeve')
  const mockupView = normArea.includes('all')
    ? 'all'
    : normArea.includes('under')
      ? 'undercollar'
      : normArea.includes('collar')
        ? 'collar'
        : normArea.includes('placket')
          ? 'placket'
          : normArea.includes('back')
            ? 'back'
            : isSleeve && normArea.includes('left')
              ? 'sleeve_left'
              : isSleeve && normArea.includes('right')
                ? 'sleeve_right'
                : normArea.includes('wrap')
                  ? 'wrap'
                  : 'front'

  const selected = layers.find(l => l.id === selectedId) ?? null

  // Filter layers for the current active view (or show all in flat preview)
  const currentViewLayers = layers.filter(l => l.view === activePrintArea && l.visible)

  // ── History & Undo/Redo System ──────────────────────────────────────────────
  const pushHistory = useCallback((nextLayers: Layer[]) => {
    if (isHistoryAction.current) {
      isHistoryAction.current = false
      return
    }
    setHistory(prev => {
      const upToCurrent = prev.slice(0, historyIndex + 1)
      return [...upToCurrent, nextLayers].slice(-35) // Keep last 35 states
    })
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isHistoryAction.current = true
      const target = history[historyIndex - 1]
      setHistoryIndex(prev => prev - 1)
      setLayers(target)
    }
  }, [historyIndex, history])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isHistoryAction.current = true
      const target = history[historyIndex + 1]
      setHistoryIndex(prev => prev + 1)
      setLayers(target)
    }
  }, [historyIndex, history])

  // Keyboard shortcut listener
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault()
          handleRedo()
        } else {
          e.preventDefault()
          handleUndo()
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleUndo, handleRedo])

  // ── Layer Management ────────────────────────────────────────────────────────
  const addLayer = useCallback((partial: Omit<Layer, 'id' | 'visible' | 'view'>) => {
    const id = `l-${Date.now()}`
    const newLayers: Layer[] = [...layers, {
      printMethod: partial.printMethod || activePrintMethod || 'dtg',
      ...partial,
      id,
      view: activePrintArea,
      visible: true
    }]
    setLayers(newLayers)
    pushHistory(newLayers)
    setSelectedId(id)
  }, [activePrintArea, activePrintMethod, layers, pushHistory])

  const updateLayer = useCallback((id: string, patch: Partial<Layer>) => {
    setLayers(p => p.map(l => l.id === id ? { ...l, ...patch } : l))
  }, [])

  const deleteLayer = useCallback((id: string) => {
    const next = layers.filter(l => l.id !== id)
    setLayers(next)
    pushHistory(next)
    setSelectedId(null)
  }, [layers, pushHistory])

  const duplicateLayer = useCallback((layer: Layer) => {
    const id = `l-${Date.now()}`
    const next: Layer[] = [...layers, {
      ...layer,
      id,
      x: layer.x + 16,
      y: layer.y + 16,
    }]
    setLayers(next)
    pushHistory(next)
    setSelectedId(id)
  }, [layers, pushHistory])

  const reorderLayer = useCallback((id: string, direction: 'front' | 'back') => {
    const idx = layers.findIndex(l => l.id === id)
    if (idx === -1) return
    const item = layers[idx]
    const remaining = layers.filter(l => l.id !== id)
    const next = direction === 'front' ? [...remaining, item] : [item, ...remaining]
    setLayers(next)
    pushHistory(next)
  }, [layers, pushHistory])

  // Alignment helpers with magnetic center snap & POD chest placement presets
  const alignLayer = useCallback((mode: 'centerX' | 'centerY' | 'fit' | 'leftChest' | 'rightChest' | 'centerChest' | 'top' | 'bottom' | 'left' | 'right') => {
    if (!selected) return
    let patch: Partial<Layer> = {}
    if (mode === 'centerX') {
      const x = Math.round(printBox.left + (printBox.w - selected.width) / 2)
      patch = { x }
    } else if (mode === 'centerY') {
      const y = Math.round(printBox.top + (printBox.h - selected.height) / 2)
      patch = { y }
    } else if (mode === 'top') {
      patch = { y: printBox.top }
    } else if (mode === 'bottom') {
      patch = { y: Math.round(printBox.top + printBox.h - selected.height) }
    } else if (mode === 'left') {
      patch = { x: printBox.left }
    } else if (mode === 'right') {
      patch = { x: Math.round(printBox.left + printBox.w - selected.width) }
    } else if (mode === 'fit') {
      const pad = 24
      const targetW = printBox.w - pad * 2
      const targetH = printBox.h - pad * 2
      const scale = Math.min(targetW / selected.width, targetH / selected.height)
      const w = Math.round(selected.width * scale)
      const h = Math.round(selected.height * scale)
      const x = Math.round(printBox.left + (printBox.w - w) / 2)
      const y = Math.round(printBox.top + (printBox.h - h) / 2)
      patch = { x, y, width: w, height: h }
    } else if (mode === 'leftChest') {
      const box = currentProductAreas['Left chest'] || { left: 275, top: 152, w: 74, h: 74 }
      const sz = Math.min(box.w - 10, Math.max(52, Math.round(selected.width * 0.70)))
      patch = {
        x: Math.round(box.left + (box.w - sz) / 2),
        y: Math.round(box.top + (box.h - sz) / 2),
        width: sz,
        height: sz,
      }
    } else if (mode === 'rightChest') {
      const box = currentProductAreas['Right chest'] || { left: 151, top: 152, w: 74, h: 74 }
      const sz = Math.min(box.w - 10, Math.max(52, Math.round(selected.width * 0.70)))
      patch = {
        x: Math.round(box.left + (box.w - sz) / 2),
        y: Math.round(box.top + (box.h - sz) / 2),
        width: sz,
        height: sz,
      }
    } else if (mode === 'centerChest') {
      const box = currentProductAreas['Center chest'] || { left: 156, top: 145, w: 188, h: 240 }
      const sz = Math.min(box.w - 24, 140)
      patch = {
        x: Math.round(box.left + (box.w - sz) / 2),
        y: Math.round(box.top + (box.h - sz) / 2),
        width: sz,
        height: sz,
      }
    }
    const next = layers.map(l => l.id === selected.id ? { ...l, ...patch } : l)
    setLayers(next)
    pushHistory(next)
  }, [selected, printBox, currentProductAreas, layers, pushHistory])

  // Quick addition of sample graphic
  const handleAddSampleGraphic = (item: GraphicItem) => {
    const w = Math.round(printBox.w * 0.72)
    const h = w
    const x = Math.round(printBox.left + (printBox.w - w) / 2)
    const y = Math.round(printBox.top + (printBox.h - h) / 2)

    addLayer({
      type: 'image',
      src: item.previewUrl,
      x, y,
      width: w,
      height: h,
      rotation: 0,
      opacity: 0.98,
      naturalWidth: 2400,
      naturalHeight: 2400,
      printMethod: item.defaultPrintMethod || activePrintMethod || 'dtg',
    })
  }

  // Quick application of complete multi-layered design template (Printify-parity)
  const handleApplyTemplate = (tpl: DesignTemplate) => {
    const newLayers: Layer[] = tpl.layers.map((tl, idx) => ({
      id: `l-${Date.now()}-${idx}`,
      type: tl.type,
      text: tl.text,
      src: tl.src,
      view: activePrintArea,
      x: Math.round(printBox.left + tl.relX * printBox.w),
      y: Math.round(printBox.top + tl.relY * printBox.h),
      width: Math.round(tl.relWidth * printBox.w),
      height: Math.round(tl.relHeight * printBox.h),
      rotation: tl.rotation || 0,
      fontSize: tl.fontSize,
      fontFamily: tl.fontFamily,
      color: tl.color,
      bold: tl.bold,
      italic: tl.italic,
      align: tl.align,
      arc: tl.arc,
      letterSpacing: tl.letterSpacing,
      printMethod: tl.printMethod || activePrintMethod || 'dtg',
      visible: true,
    }))
    const remaining = layers.filter(l => l.view !== activePrintArea)
    const next = [...remaining, ...newLayers]
    setLayers(next)
    pushHistory(next)
    if (newLayers.length > 0) setSelectedId(newLayers[0].id)
  }

  // ── Drag / Resize / Rotate Handlers with Magnetic Snapping ──────────────────
  function startDrag(e: React.MouseEvent, layerId: string, handle: HandleId) {
    e.preventDefault()
    e.stopPropagation()
    const layer = layers.find(l => l.id === layerId)
    if (!layer || layer.locked) return
    dragRef.current = {
      handle, layerId,
      mx0: e.clientX, my0: e.clientY,
      lx0: layer.x,     ly0: layer.y,
      lw0: layer.width,  lh0: layer.height,
      lr0: layer.rotation,
    }
  }

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const d = dragRef.current
      if (!d) return
      const scale = zoomRef.current / 100
      const dx = (e.clientX - d.mx0) / scale
      const dy = (e.clientY - d.my0) / scale

      if (d.handle === 'move') {
        let newX = Math.round(d.lx0 + dx)
        let newY = Math.round(d.ly0 + dy)

        // Magnetic Smart Alignment to Print Area Centers
        const layerCenterX = newX + d.lw0 / 2
        const layerCenterY = newY + d.lh0 / 2
        const boxCenterX = printBox.left + printBox.w / 2
        const boxCenterY = printBox.top + printBox.h / 2

        let snapX: number | null = null
        let snapY: number | null = null

        // Snap X (threshold: 6px)
        if (Math.abs(layerCenterX - boxCenterX) <= 7) {
          newX = Math.round(boxCenterX - d.lw0 / 2)
          snapX = boxCenterX
        }
        // Snap Y (threshold: 6px)
        if (Math.abs(layerCenterY - boxCenterY) <= 7) {
          newY = Math.round(boxCenterY - d.lh0 / 2)
          snapY = boxCenterY
        }

        setSnapGuide({ x: snapX, y: snapY })
        updateLayer(d.layerId, { x: newX, y: newY })
      } else if (d.handle === 'rotate') {
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const cx = rect.left + (d.lx0 + d.lw0 / 2) * scale
        const cy = rect.top  + (d.ly0 + d.lh0 / 2) * scale
        const startAngle = Math.atan2(d.my0 - cy, d.mx0 - cx)
        const currAngle  = Math.atan2(e.clientY - cy, e.clientX - cx)
        let deg = Math.round(d.lr0 + (currAngle - startAngle) * (180 / Math.PI))
        // Snap to 0, 90, 180, 270 if within 4 degrees
        for (const targetDeg of [0, 90, 180, 270, 360, -90, -180]) {
          if (Math.abs(deg - targetDeg) <= 4) { deg = targetDeg; break }
        }
        updateLayer(d.layerId, { rotation: deg })
      } else {
        let x = d.lx0, y = d.ly0, w = d.lw0, h = d.lh0
        if (d.handle.includes('w')) { x = d.lx0 + dx; w = Math.max(30, d.lw0 - dx) }
        if (d.handle.includes('e')) { w = Math.max(30, d.lw0 + dx) }
        if (d.handle.includes('n')) { y = d.ly0 + dy; h = Math.max(30, d.lh0 - dy) }
        if (d.handle.includes('s')) { h = Math.max(30, d.lh0 + dy) }
        updateLayer(d.layerId, { x: Math.round(x), y: Math.round(y), width: Math.round(w), height: Math.round(h) })
      }
    }
    function onUp() {
      if (dragRef.current) {
        setSnapGuide({ x: null, y: null })
        dragRef.current = null
        pushHistory(layers)
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',  onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',  onUp)
    }
  }, [layers, printBox, pushHistory, updateLayer])

  // ── File Upload with Natural Resolution Extraction ─────────────────────────
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const src = ev.target?.result as string
      const img = new Image()
      img.onload = () => {
        const w = Math.round(printBox.w * 0.70)
        const aspect = img.naturalHeight / (img.naturalWidth || 1)
        const h = Math.round(w * aspect)
        const x = Math.round(printBox.left + (printBox.w - w) / 2)
        const y = Math.round(printBox.top + (printBox.h - h) / 2)
        addLayer({
          type: 'image',
          src,
          x, y,
          width: w, height: h,
          rotation: 0,
          opacity: 0.98,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        })
      }
      img.src = src
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ── AI Art Generation ───────────────────────────────────────────────────────
  function handleGenerateAi() {
    if (!aiPrompt.trim()) return
    setIsGeneratingAi(true)
    setTimeout(() => {
      setIsGeneratingAi(false)
      // Pick or create tailored vector artwork for the prompt
      const item = SAMPLE_GRAPHICS[Math.floor(Math.random() * SAMPLE_GRAPHICS.length)]
      handleAddSampleGraphic(item)
      setAiPrompt('')
    }, 900)
  }

  // ── Save & Download ─────────────────────────────────────────────────────────
  function handleSave() {
    setSaved(true)
    try {
      const firstImg = currentViewLayers.find(l => l.type === 'image')?.src
      const customProduct = {
        id: `pf-${Date.now()}`,
        title: `${info.name} (Custom Design)`,
        status: 'PUBLISHED' as const,
        type: info.type,
        color: productColor,
        artworkUrl: firstImg || SAMPLE_GRAPHICS[1].previewUrl,
        brand: info.brand,
        variants: info.colors.length,
        orders: 0,
        store: 'Addis Designs Hub',
        updatedAt: 'Just now',
      }
      const existing = localStorage.getItem('pf_custom_products')
      const list = existing ? JSON.parse(existing) : []
      list.unshift(customProduct)
      localStorage.setItem('pf_custom_products', JSON.stringify(list))
    } catch (err) {
      console.error('Failed to save product:', err)
    }

    setTimeout(() => {
      setSaved(false)
      router.push('/dashboard/products')
    }, 1000)
  }

  const handleDownloadMockup = async () => {
    setIsExporting(true)
    try {
      const svgEl = canvasRef.current?.querySelector('svg') || document.querySelector('svg[viewBox="0 0 500 560"]')
      if (!svgEl) {
        alert('Mockup stage is not loaded yet.')
        setIsExporting(false)
        return
      }

      // Clone SVG and remove dashed guide lines from the export
      const clonedSvg = svgEl.cloneNode(true) as SVGElement
      const guide = clonedSvg.querySelector('#print-area-guide')
      if (guide) guide.remove()

      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(clonedSvg)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const blobUrl = URL.createObjectURL(svgBlob)

      const baseImg = new Image()
      await new Promise<void>((resolve, reject) => {
        baseImg.onload = () => resolve()
        baseImg.onerror = reject
        baseImg.src = blobUrl
      })

      const scale = 2.4 // 1200 x 1344 high definition
      const canvas = document.createElement('canvas')
      canvas.width = 500 * scale
      canvas.height = 560 * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(blobUrl)
        setIsExporting(false)
        return
      }

      // Clean background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw SVG product base
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(blobUrl)

      // Draw active design layers
      for (const layer of currentViewLayers) {
        if (!layer.visible) continue
        ctx.save()
        const cx = (layer.x + layer.width / 2) * scale
        const cy = (layer.y + layer.height / 2) * scale
        ctx.translate(cx, cy)
        ctx.rotate((layer.rotation * Math.PI) / 180)
        if (layer.flipX) ctx.scale(-1, 1)
        if (layer.opacity != null) ctx.globalAlpha = layer.opacity

        const lw = layer.width * scale
        const lh = layer.height * scale

        if (layer.type === 'image' && layer.src) {
          await new Promise<void>((res) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
              ctx.drawImage(img, -lw / 2, -lh / 2, lw, lh)
              res()
            }
            img.onerror = () => res()
            img.src = layer.src!
          })
        } else if (layer.type === 'text' && layer.text) {
          const fs = (layer.fontSize || 32) * scale
          ctx.font = `${layer.italic ? 'italic ' : ''}${layer.bold ? 'bold ' : ''}${fs}px ${layer.fontFamily || 'Inter, sans-serif'}`
          ctx.fillStyle = layer.color || '#1A1A12'
          ctx.textAlign = (layer.align || 'center') as CanvasTextAlign
          ctx.textBaseline = 'middle'
          const xOff = layer.align === 'left' ? -lw / 2 : layer.align === 'right' ? lw / 2 : 0
          ctx.fillText(layer.text, xOff, 0)
        }
        ctx.restore()
      }

      // Download PNG
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          setIsExporting(false)
          return
        }
        const a = document.createElement('a')
        a.download = `printflow-${info.sku}-${activePrintArea.toLowerCase().replace(/\s+/g, '-')}-mockup.png`
        a.href = URL.createObjectURL(pngBlob)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(a.href)
        setIsExporting(false)
      }, 'image/png')
    } catch (e) {
      console.error('Export error:', e)
      setIsExporting(false)
    }
  }

  // Dynamic multi-location print location calculation
  const activeViews = Array.from(new Set(layers.filter(l => l.visible).map(l => l.view)))
  const hasFront = activeViews.some(v => v.toLowerCase().includes('front'))
  const hasBack = activeViews.some(v => v.toLowerCase().includes('back'))
  const hasSleeve = activeViews.some(v => v.toLowerCase().includes('sleeve'))

  const backSurcharge = hasBack ? 120 : 0
  const sleeveSurcharge = hasSleeve ? 80 : 0
  const totalProductionCost = info.baseCost + backSurcharge + sleeveSurcharge
  const suggestedRetail = info.retailPrice + (hasBack ? 150 : 0) + (hasSleeve ? 100 : 0)
  const profit = suggestedRetail - totalProductionCost
  const marginPct = Math.round((profit / suggestedRetail) * 100)

  // ── Left toolbar definitions ────────────────────────────────────────────────
  const TOOLS = [
    { id: 'upload',    icon: Upload,       label: 'Upload' },
    { id: 'templates', icon: BookTemplate, label: 'Templates' },
    { id: 'graphics',  icon: Shapes,       label: 'Graphics' },
    { id: 'text',      icon: Type,         label: 'Add text' },
    { id: 'ai',        icon: Sparkles,     label: 'AI Create' },
    { id: 'layers',    icon: LayersIcon,   label: 'Layers' },
  ]

  return (
    <div className="h-screen flex flex-col bg-[#F6F5F2] overflow-hidden select-none"
      style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* ── Top Bar (Printify Professional Header) ──────────────────────────── */}
      <header className="h-14 bg-white border-b border-[#E5E2DC] flex items-center justify-between px-5 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/catalog"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#5C5A55] hover:text-[#1A1A12] transition-colors">
            <ArrowLeft size={16} />
            <span>Catalog</span>
          </Link>
          <div className="h-4 w-px bg-[#E5E2DC]" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-[#1A1A12] leading-none">{info.name}</h1>
              <span className="text-[10px] font-semibold bg-[#F0EDE6] text-[#5C5A55] px-2 py-0.5 rounded">
                {info.sku}
              </span>
            </div>
            <p className="text-[11px] text-[#8C8880] mt-0.5">{info.brand} · PrintFlow Choice</p>
          </div>
        </div>

        {/* Center: Mode Switcher [Edit] / [Preview] matching Image 1 */}
        <div className="flex items-center gap-1 bg-[#EFECE6] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('edit')}
            className={cn(
              'px-5 py-1.5 rounded-lg text-xs font-bold transition-all',
              activeTab === 'edit'
                ? 'bg-white text-[#1A1A12] shadow-xs'
                : 'text-[#6E6B65] hover:text-[#1A1A12]'
            )}>
            Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={cn(
              'px-5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
              activeTab === 'preview'
                ? 'bg-[#3F4832] text-white shadow-xs'
                : 'text-[#6E6B65] hover:text-[#1A1A12]'
            )}>
            <span>Preview</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Undo / Redo */}
          <div className="flex items-center gap-1 bg-[#F5F4F0] p-1 rounded-xl border border-[#E5E2DC]">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg text-[#5C5A55] hover:text-[#1A1A12] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Undo (Ctrl+Z)">
              <Undo2 size={14} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg text-[#5C5A55] hover:text-[#1A1A12] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Redo (Ctrl+Y)">
              <Redo2 size={14} />
            </button>
          </div>

          {/* Variants & Sizing Modal Trigger */}
          <button
            onClick={() => setShowVariantMatrix(true)}
            className="px-3 py-1.5 rounded-xl border border-[#D5D2CA] text-xs font-bold text-[#1A1A12] bg-white hover:bg-[#FAF9F6] transition-colors flex items-center gap-1.5 shadow-xs">
            <Table2 size={14} />
            <span>Variants & Sizing</span>
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-lg text-[#6E6B65] hover:bg-[#F0EDE6] hover:text-[#1A1A12] transition-colors"
            title="Product Specifications">
            <Info size={16} />
          </button>

          {activeTab === 'preview' && (
            <button
              onClick={handleDownloadMockup}
              disabled={isExporting}
              className="btn-secondary text-xs py-1.5 px-3.5 gap-1.5 border-[#D5D2CA] disabled:opacity-50">
              <Download size={14} className={isExporting ? 'animate-bounce' : ''} />
              <span>{isExporting ? 'Exporting 300 DPI…' : 'Download Mockup'}</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={layers.length === 0}
            className={cn(
              'px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
              layers.length === 0
                ? 'bg-[#E5E2DC] text-[#9E9B95] cursor-not-allowed'
                : saved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1A1A12] text-white hover:bg-[#2A2A22] shadow-sm'
            )}>
            {saved ? <Check size={14} strokeWidth={2.5} /> : null}
            {saved ? 'Saved to Products' : 'Save product'}
          </button>
        </div>
      </header>

      {/* ── Main Work Area ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── Leftmost Narrow Icon Nav (Printify-Style) ─────────────────────── */}
        <div className="w-[72px] bg-white border-r border-[#E5E2DC] flex flex-col items-center py-3 gap-1 shrink-0 z-20">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {TOOLS.map(t => {
            const isActive = activeTool === t.id && activeTab === 'edit'
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTool(t.id)
                  if (activeTab === 'preview') setActiveTab('edit')
                }}
                className={cn(
                  'flex flex-col items-center justify-center gap-1.5 w-14 h-14 rounded-xl transition-all',
                  isActive
                    ? 'bg-[#1A1A12] text-white shadow-sm'
                    : 'text-[#6E6B65] hover:bg-[#F5F4F0] hover:text-[#1A1A12]'
                )}>
                <t.icon size={20} strokeWidth={isActive ? 2 : 1.7} />
                <span className="text-[10px] font-semibold leading-none">{t.label}</span>
              </button>
            )
          })}

          <div className="flex-1" />

          {/* Quick zoom level indicator */}
          <div className="text-[10px] font-bold text-[#8C8880] pb-2">{zoom}%</div>
        </div>

        {/* ── Left Secondary Drawer (Printify Tool Flyout) ──────────────────── */}
        {activeTab === 'edit' && (
          <aside className="w-[310px] bg-white border-r border-[#E5E2DC] flex flex-col shrink-0 z-10 overflow-y-auto">
            {/* 1. Upload Tool */}
            {activeTool === 'upload' && (
              <div className="p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A12]">Upload Design</h3>
                  <p className="text-xs text-[#8C8880] mt-0.5">High-resolution PNG, SVG, or JPG (300 DPI)</p>
                </div>

                {/* Dropzone */}
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-[#D5D2CA] hover:border-[#1A1A12] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#FAF9F6] hover:bg-[#F5F4F0]">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-[#E5E2DC] mx-auto flex items-center justify-center mb-3 text-[#1A1A12]">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs font-bold text-[#1A1A12]">Click to upload from device</p>
                  <p className="text-[11px] text-[#8C8880] mt-1">Supports transparent PNG, SVG up to 50MB</p>
                </div>

                {/* Starter Artwork Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#1A1A12]">Instant starter artwork</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">1-Click Apply</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SAMPLE_GRAPHICS.slice(0, 4).map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleAddSampleGraphic(item)}
                        className="group border border-[#E5E2DC] hover:border-[#1A1A12] rounded-xl p-2.5 text-left bg-white hover:shadow-sm transition-all flex flex-col items-center">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center bg-[#FAF9F6] group-hover:scale-105 transition-transform p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.previewUrl} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[11px] font-semibold text-[#1A1A12] text-center mt-2 truncate w-full">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 1B. Templates Library (Printify Pre-Made Compositions) */}
            {activeTool === 'templates' && (() => {
              const categories = ['All', 'Vintage', 'Streetwear', 'Athletics', 'Coffee & Culture', 'Minimal', 'Sewed & Chenille']
              const filteredTemplates = SAMPLE_TEMPLATES.filter(tpl => {
                const matchesCat = templateCategory === 'All' || tpl.category.toLowerCase() === templateCategory.toLowerCase()
                const matchesSearch = !templateSearch.trim() ||
                  tpl.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                  tpl.category.toLowerCase().includes(templateSearch.toLowerCase()) ||
                  tpl.description.toLowerCase().includes(templateSearch.toLowerCase())
                const matchesPlaceholder = tpl.placeholder === 'both' ||
                  (activePrintArea.toLowerCase().includes('back') ? tpl.placeholder === 'back' : tpl.placeholder === 'front')
                return matchesCat && matchesSearch && matchesPlaceholder
              })

              return (
                <div className="p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A12]">Design Templates</h3>
                      <p className="text-[11px] text-[#8C8880] mt-0.5">Ready-made layouts for {activePrintArea}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                      1-Click Apply
                    </span>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#8C8880] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={templateSearch}
                      onChange={e => setTemplateSearch(e.target.value)}
                      placeholder="Search templates (vintage, tour, script)..."
                      className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg focus:outline-none focus:border-[#1A1A12] text-[#1A1A12] placeholder-[#A8A49C]"
                    />
                    {templateSearch && (
                      <button
                        onClick={() => setTemplateSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8880] hover:text-[#1A1A12]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                    {categories.map(cat => {
                      const active = templateCategory === cat
                      return (
                        <button
                          key={cat}
                          onClick={() => setTemplateCategory(cat)}
                          className={cn(
                            'px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer',
                            active
                              ? 'bg-[#1A1A12] text-white shadow-xs'
                              : 'bg-[#F2EFE9] text-[#636059] hover:bg-[#E8E4DC] hover:text-[#1A1A12]'
                          )}
                        >
                          {cat}
                        </button>
                      )
                    })}
                  </div>

                  {/* Template Cards */}
                  {filteredTemplates.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#8C8880]">
                      No templates found for "{templateSearch}".
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                      {filteredTemplates.map(tpl => (
                        <div
                          key={tpl.id}
                          className="border border-[#E5E2DC] hover:border-[#1A1A12] rounded-xl p-3 bg-white hover:shadow-md transition-all flex flex-col gap-2.5"
                        >
                          <div className="w-full h-32 rounded-lg overflow-hidden flex items-center justify-center bg-[#FAF9F6] p-1 border border-[#EBE8E3]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={tpl.thumbnailSvg} alt={tpl.name} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#1A1A12] truncate">{tpl.name}</span>
                              <span className="text-[9px] font-semibold text-[#575C46] bg-[#575C46]/10 px-1.5 py-0.5 rounded">
                                {tpl.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#78756E] mt-0.5 line-clamp-2">{tpl.description}</p>
                          </div>
                          <button
                            onClick={() => handleApplyTemplate(tpl)}
                            className="w-full py-1.5 bg-[#1A1A12] hover:bg-[#2A2A22] text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Sparkles size={12} className="text-amber-400" />
                            <span>Apply to {activePrintArea}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* 2. Graphics Library */}
            {activeTool === 'graphics' && (() => {
              const categories = ['All', 'Sewed & Chenille', 'Streetwear', 'Outdoor', 'Retro', 'Culture', 'Athletics', 'Japanese', 'Minimal', 'Coffee']
              const filteredGraphics = SAMPLE_GRAPHICS.filter(item => {
                const matchesCat =
                  graphicCategory === 'All' ||
                  (graphicCategory === 'Sewed & Chenille' && item.category === 'sewed') ||
                  item.category.toLowerCase() === graphicCategory.toLowerCase()
                const matchesSearch = !graphicSearch.trim() ||
                  item.name.toLowerCase().includes(graphicSearch.toLowerCase()) ||
                  item.category.toLowerCase().includes(graphicSearch.toLowerCase())
                return matchesCat && matchesSearch
              })

              return (
                <div className="p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A12]">Vector Graphics Library</h3>
                      <p className="text-[11px] text-[#8C8880] mt-0.5">{SAMPLE_GRAPHICS.length} Print-ready vector designs</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                      100% Vector
                    </span>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#8C8880] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={graphicSearch}
                      onChange={e => setGraphicSearch(e.target.value)}
                      placeholder="Search templates (retro, skull, coffee)..."
                      className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg focus:outline-none focus:border-[#1A1A12] text-[#1A1A12] placeholder-[#A8A49C]"
                    />
                    {graphicSearch && (
                      <button
                        onClick={() => setGraphicSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8880] hover:text-[#1A1A12]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                    {categories.map(cat => {
                      const active = graphicCategory === cat
                      return (
                        <button
                          key={cat}
                          onClick={() => setGraphicCategory(cat)}
                          className={cn(
                            'px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer',
                            active
                              ? 'bg-[#1A1A12] text-white shadow-xs'
                              : 'bg-[#F2EFE9] text-[#636059] hover:bg-[#E8E4DC] hover:text-[#1A1A12]'
                          )}
                        >
                          {cat}
                        </button>
                      )
                    })}
                  </div>

                  {/* Graphics Grid (Clean 3-column layout) */}
                  {filteredGraphics.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#8C8880]">
                      No graphics found for "{graphicSearch}".
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
                      {filteredGraphics.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleAddSampleGraphic(item)}
                          className="group border border-[#E5E2DC] hover:border-[#1A1A12] rounded-xl p-1.5 text-left bg-white hover:shadow-md transition-all flex flex-col items-center cursor-pointer"
                        >
                          <div className="w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center bg-[#FAF9F6] group-hover:scale-105 transition-transform p-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.previewUrl} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <span className="text-[10px] font-bold text-[#1A1A12] text-center mt-1.5 line-clamp-1 w-full">
                            {item.name}
                          </span>
                          <span className="text-[8px] font-semibold text-[#8C8880] uppercase tracking-wider mt-0.5 truncate w-full text-center">
                            {item.defaultPrintMethod === 'embroidery' ? '🧵 Sewed' : item.defaultPrintMethod === 'chenille' ? '🧶 Chenille' : item.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* 3. Text Tool */}
            {activeTool === 'text' && (
              <div className="p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A12]">Typography & Text</h3>
                  <p className="text-xs text-[#8C8880] mt-0.5">Add custom text with Google Fonts</p>
                </div>

                {/* Text Print / Stitching Technique */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1A1A12]">Text Finish Style</span>
                    <span className="text-[10px] font-bold text-[#575C46] uppercase">
                      {activePrintMethod === 'chenille' ? 'Chenille / Fuzzy' :
                       activePrintMethod === 'embroidery' ? 'Sewed / Stitched' : activePrintMethod}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'chenille', label: 'Chenille / Fuzzy', icon: '🧶' },
                      { id: 'embroidery', label: 'Sewed / Stitched', icon: '🧵' },
                      { id: 'dtg', label: 'DTG Print', icon: '🎨' },
                      { id: 'screen', label: 'Screen Print', icon: '🖨️' },
                      { id: 'vinyl', label: 'Vinyl Cut', icon: '✂️' },
                      { id: 'vintage', label: 'Discharge', icon: '🌾' },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setActivePrintMethod(m.id as PrintMethod)}
                        className={cn(
                          'py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all text-left',
                          activePrintMethod === m.id
                            ? 'bg-[#575C46] text-white border-[#575C46] shadow-2xs'
                            : 'bg-white hover:bg-[#FAF9F6] border-[#D5D2CA] text-[#1A1A12]'
                        )}
                      >
                        <span className="text-xs">{m.icon}</span>
                        <span className="truncate">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Add Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const text = 'NEW DAY'
                      const w = 210; const h = 64
                      addLayer({
                        type: 'text', text,
                        x: Math.round(printBox.left + (printBox.w - w) / 2),
                        y: Math.round(printBox.top + (printBox.h - h) / 2),
                        width: w, height: h,
                        rotation: 0, fontSize: 44, fontFamily: 'Impact',
                        bold: true, color: '#141414', align: 'center',
                        printMethod: 'chenille'
                      })
                    }}
                    className="w-full border-2 border-[#1A1A12] bg-[#FAF9F6] hover:bg-[#F2EFE9] rounded-xl py-3 px-4 text-left font-black text-sm text-[#1A1A12] transition-all flex items-center justify-between shadow-2xs cursor-pointer">
                    <span>+ Add "NEW DAY" Puffy Chenille (Image 1)</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#1A1A12] text-white">Yarn Loop 🧶</span>
                  </button>
                  <button
                    onClick={() => {
                      const text = 'STITCHED SCRIPT'
                      const w = 190; const h = 50
                      addLayer({
                        type: 'text', text,
                        x: Math.round(printBox.left + (printBox.w - w) / 2),
                        y: Math.round(printBox.top + (printBox.h - h) / 2),
                        width: w, height: h,
                        rotation: 0, fontSize: 32, fontFamily: 'Oswald',
                        bold: true, color: '#000000', align: 'center',
                        printMethod: 'embroidery'
                      })
                    }}
                    className="w-full border border-[#D5D2CA] hover:border-[#1A1A12] rounded-xl py-2.5 px-4 text-left font-bold text-xs text-[#1A1A12] hover:bg-[#FAF9F6] transition-all flex items-center justify-between cursor-pointer">
                    <span>+ Add Sewed / Stitched Heading</span>
                    <span className="text-[10px] font-bold text-[#575C46]">Thread 🧵</span>
                  </button>
                  <button
                    onClick={() => {
                      const text = 'YOUR TITLE'
                      const w = 180; const h = 48
                      addLayer({
                        type: 'text', text,
                        x: Math.round(printBox.left + (printBox.w - w) / 2),
                        y: Math.round(printBox.top + (printBox.h - h) / 2),
                        width: w, height: h,
                        rotation: 0, fontSize: 32, fontFamily: 'Oswald',
                        bold: true, color: '#000000', align: 'center'
                      })
                    }}
                    className="w-full border border-[#D5D2CA] hover:border-[#1A1A12] rounded-xl py-2.5 px-4 text-left font-extrabold text-xs text-[#1A1A12] hover:bg-[#FAF9F6] transition-all">
                    + Add Standard Bold Heading
                  </button>
                  <button
                    onClick={() => {
                      const text = 'Addis Ababa Studio'
                      const w = 160; const h = 36
                      addLayer({
                        type: 'text', text,
                        x: Math.round(printBox.left + (printBox.w - w) / 2),
                        y: Math.round(printBox.top + (printBox.h - h) / 2),
                        width: w, height: h,
                        rotation: 0, fontSize: 20, fontFamily: 'Inter',
                        bold: false, color: '#1A1A12', align: 'center'
                      })
                    }}
                    className="w-full border border-[#D5D2CA] hover:border-[#1A1A12] rounded-xl py-2.5 px-4 text-left font-medium text-xs text-[#5C5A55] hover:bg-[#FAF9F6] transition-all">
                    + Add Subheading
                  </button>
                </div>

                {/* Custom Input */}
                <div className="space-y-3 pt-2 border-t border-[#E5E2DC]">
                  <label className="text-xs font-bold text-[#1A1A12] block">Custom text string</label>
                  <input
                    type="text"
                    value={addText}
                    onChange={e => setAddText(e.target.value)}
                    placeholder="Type text here…"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && addText.trim()) {
                        addLayer({
                          type: 'text', text: addText.trim(),
                          x: Math.round(printBox.left + (printBox.w - 180) / 2),
                          y: Math.round(printBox.top + (printBox.h - 40) / 2),
                          width: 180, height: 40, rotation: 0, fontSize: 26,
                          fontFamily: 'Inter', color: '#000000', align: 'center'
                        })
                        setAddText('')
                      }
                    }}
                    className="w-full border border-[#D5D2CA] focus:border-[#1A1A12] rounded-xl px-3.5 py-2 text-xs outline-none bg-[#FAF9F6]"
                  />
                  <button
                    onClick={() => {
                      if (addText.trim()) {
                        addLayer({
                          type: 'text', text: addText.trim(),
                          x: Math.round(printBox.left + (printBox.w - 180) / 2),
                          y: Math.round(printBox.top + (printBox.h - 40) / 2),
                          width: 180, height: 40, rotation: 0, fontSize: 26,
                          fontFamily: 'Inter', color: '#000000', align: 'center'
                        })
                        setAddText('')
                      }
                    }}
                    className="btn-primary w-full text-xs py-2.5">
                    Add Text to Shirt
                  </button>
                </div>
              </div>
            )}

            {/* 4. AI Generator Tool */}
            {activeTool === 'ai' && (
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A12] flex items-center gap-1.5">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>AI Design Generator</span>
                  </h3>
                  <p className="text-xs text-[#8C8880] mt-0.5">Generate print-ready vector concepts</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1A1A12] block">Describe your design</label>
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="e.g. Vintage sunset mountain badge with Addis Ababa typography in retro gold…"
                    className="w-full border border-[#D5D2CA] focus:border-[#1A1A12] rounded-xl p-3 text-xs outline-none bg-[#FAF9F6] resize-none"
                  />
                </div>

                {/* Preset Chips */}
                <div>
                  <span className="text-[11px] font-semibold text-[#8C8880] block mb-2">Prompt ideas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Vintage Ethiopian Coffee Roasters',
                      'Cyberpunk Neon Addis Lion',
                      'Minimalist Line Art Botanical',
                      'Retro 80s Sunset Surf',
                    ].map(idea => (
                      <button
                        key={idea}
                        onClick={() => setAiPrompt(idea)}
                        className="text-[10px] font-medium bg-[#F0EDE6] hover:bg-[#E5E2DC] text-[#1A1A12] px-2.5 py-1 rounded-full transition-colors">
                        {idea}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateAi}
                  disabled={isGeneratingAi || !aiPrompt.trim()}
                  className="btn-primary w-full text-xs py-2.5 gap-2 justify-center">
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Generating Vector…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Generate & Place</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 5. Layers Tool */}
            {activeTool === 'layers' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A12]">Layers ({currentViewLayers.length})</h3>
                    <p className="text-xs text-[#8C8880] mt-0.5">{activePrintArea} design view</p>
                  </div>
                </div>

                {currentViewLayers.length === 0 ? (
                  <div className="text-center py-12 text-[#8C8880] border border-dashed border-[#E5E2DC] rounded-2xl p-4">
                    <p className="text-xs font-semibold">No design layers added yet.</p>
                    <p className="text-[11px] mt-1">Upload an image or pick a starter graphic.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {[...currentViewLayers].reverse().map((l, i) => (
                      <div
                        key={l.id}
                        onClick={() => setSelectedId(l.id)}
                        className={cn(
                          'flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer border transition-all',
                          selectedId === l.id
                            ? 'bg-[#FAF9F6] border-[#1A1A12] shadow-sm'
                            : 'border-[#E5E2DC] hover:border-[#D5D2CA] bg-white'
                        )}>
                        <div className="w-9 h-9 rounded-lg bg-[#F0EDE6] flex items-center justify-center shrink-0 overflow-hidden">
                          {l.type === 'image' && l.src ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={l.src} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <Type size={16} className="text-[#1A1A12]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#1A1A12] truncate">
                            {l.type === 'text' ? (l.text || 'Text') : `Graphic #${currentViewLayers.length - i}`}
                          </p>
                          <p className="text-[10px] text-[#8C8880]">{Math.round(l.width)} × {Math.round(l.height)} px</p>
                        </div>
                        <div className="flex items-center gap-1 text-[#8C8880]">
                          <button
                            onClick={e => { e.stopPropagation(); updateLayer(l.id, { locked: !l.locked }) }}
                            className="p-1 hover:text-[#1A1A12]">
                            {l.locked ? <Lock size={13} className="text-amber-500" /> : <Unlock size={13} />}
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); deleteLayer(l.id) }}
                            className="p-1 hover:text-red-500">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        )}

        {/* ── Center Stage (The Printify Raw Mockup Canvas) ─────────────────── */}
        <main className="flex-1 flex flex-col bg-[#F3F1EC] relative overflow-hidden"
          onClick={() => setSelectedId(null)}>

          {/* Top Info Banner (Collapsible) */}
          {showInfo && (
            <div className="absolute top-4 left-4 z-30 bg-white border border-[#E5E2DC] shadow-xl rounded-2xl p-4 w-80 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1A1A12]">Print Specifications</span>
                <button onClick={() => setShowInfo(false)} className="text-[#8C8880] hover:text-[#1A1A12]">
                  <X size={14} />
                </button>
              </div>
              <div className="text-xs space-y-1.5 text-[#5C5A55]">
                <div className="flex justify-between"><span>Print area</span><span className="font-bold text-[#1A1A12]">{info.printAreaSize}</span></div>
                <div className="flex justify-between"><span>Print technique</span><span className="font-bold text-[#1A1A12]">Direct-to-Garment (DTG)</span></div>
                <div className="flex justify-between"><span>Resolution</span><span className="font-bold text-[#1A1A12]">300 DPI high-definition</span></div>
                <div className="flex justify-between"><span>Fulfillment time</span><span className="font-bold text-[#1A1A12]">2–4 business days</span></div>
              </div>
            </div>
          )}

          {/* ── Mode 1: EDIT MODE ────────────────────────────────────────────── */}
          {activeTab === 'edit' && (
            <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
              <div
                style={{
                  transform: `scale(${zoom / 100})`,
                  transition: 'transform 0.12s ease-out'
                }}
                className="flex items-center justify-center">

                {/* Studio Canvas Stage */}
                <div
                  ref={canvasRef}
                  className="relative rounded-2xl overflow-visible transition-all duration-200"
                  style={{
                    width: activePrintArea.toLowerCase().includes('all') ? 780 : 500,
                    height: activePrintArea.toLowerCase().includes('all') ? 405 : 560
                  }}
                  onClick={() => setSelectedId(null)}>

                  {/* ── Photorealistic Raw Product Vector Mockup ── */}
                  <div className={cn(
                    'absolute inset-0',
                    activePrintArea.toLowerCase().includes('all') ? 'pointer-events-auto' : 'pointer-events-none'
                  )}>
                    <MockupComponent
                      color={productColor}
                      view={mockupView}
                      className="w-full h-full"
                      showPrintArea={false}
                      onSelectArea={(area) => {
                        setActivePrintArea(area)
                        setSelectedId(null)
                      }}
                    />
                  </div>

                  {/* ── Calibrated Print Area Guide (Hidden on All Areas Overview) ── */}
                  {!activePrintArea.toLowerCase().includes('all') && (
                  <div
                    className="absolute pointer-events-none transition-all duration-200"
                    style={{
                      left: printBox.left,
                      top: printBox.top,
                      width: printBox.w,
                      height: printBox.h,
                      border: '1.5px dashed rgba(59, 130, 246, 0.75)',
                      borderRadius: 4,
                      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.40)',
                    }}>
                    {/* Top-right subtle size badge */}
                    <div className="absolute -top-6 left-0 text-[10px] font-semibold text-blue-600 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm">
                      {printBox.label}
                    </div>

                    {/* Inner Safe Margin Zone (0.5" / 14px inset) */}
                    <div
                      className="absolute inset-[14px] border border-dashed border-amber-400/80 rounded pointer-events-none"
                      title="Safe Print Area: Keep critical text inside this zone">
                      <div className="absolute -bottom-4 right-1 text-[9px] font-bold text-amber-700 bg-amber-50/95 px-1.5 py-0.2 rounded border border-amber-200 shadow-xs">
                        Safe area
                      </div>
                    </div>

                    {/* Center empty state watermark */}
                    {currentViewLayers.length === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-3 text-center">
                        <div className="text-[11px] font-bold text-blue-600 bg-white/95 px-3 py-1 rounded-full shadow-sm border border-blue-100">
                          {activePrintArea} print area
                        </div>
                        {activePrintArea.toLowerCase().includes('back') && (
                          <div className="mt-2 text-[10px] font-semibold text-[#5C5A55] bg-white/95 px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs max-w-[220px] leading-snug">
                            Back of shirt — Click Add text, Templates, or Graphics to design the back.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  )}

                  {/* ── Magnetic Alignment Snap Guides (Cyan Crosshairs) ── */}
                  {snapGuide.x != null && (
                    <div
                      className="absolute pointer-events-none z-30"
                      style={{
                        left: snapGuide.x,
                        top: printBox.top - 15,
                        height: printBox.h + 30,
                        width: 1,
                        borderLeft: '1.5px dashed #06B6D4',
                        filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.9))',
                      }}>
                      <span className="absolute -top-5 left-1 text-[9px] font-extrabold text-cyan-700 bg-cyan-50 px-1 py-0.5 rounded shadow-sm border border-cyan-200">
                        Center X
                      </span>
                    </div>
                  )}
                  {snapGuide.y != null && (
                    <div
                      className="absolute pointer-events-none z-30"
                      style={{
                        top: snapGuide.y,
                        left: printBox.left - 15,
                        width: printBox.w + 30,
                        height: 1,
                        borderTop: '1.5px dashed #06B6D4',
                        filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.9))',
                      }}>
                      <span className="absolute -left-6 -top-4 text-[9px] font-extrabold text-cyan-700 bg-cyan-50 px-1 py-0.5 rounded shadow-sm border border-cyan-200">
                        Center Y
                      </span>
                    </div>
                  )}

                  {/* ── Design Layers on Product ── */}
                  {currentViewLayers.map(layer => {
                    const isSelected = selectedId === layer.id
                    return (
                      <div
                        key={layer.id}
                        style={{
                          position: 'absolute',
                          left: layer.x,
                          top: layer.y,
                          width: layer.width,
                          height: layer.height,
                          transform: `rotate(${layer.rotation}deg) ${layer.flipX ? 'scaleX(-1)' : ''}`,
                          transformOrigin: 'center center',
                          cursor: layer.locked ? 'default' : (isSelected ? 'move' : 'pointer'),
                          opacity: layer.opacity ?? 1,
                          userSelect: 'none',
                        }}
                        onClick={e => { e.stopPropagation(); setSelectedId(layer.id) }}
                        onMouseDown={e => {
                          if (layer.locked) return
                          e.stopPropagation()
                          setSelectedId(layer.id)
                          startDrag(e, layer.id, 'move')
                        }}
                      >
                        {/* Layer Visual Content */}
                        {layer.type === 'image' && layer.src && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={layer.src}
                            draggable={false}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              display: 'block',
                              pointerEvents: 'none',
                            }}
                            alt=""
                          />
                        )}

                        {layer.type === 'text' && (
                          editingTextId === layer.id ? (
                            <input
                              autoFocus
                              value={layer.text ?? ''}
                              onChange={e => updateLayer(layer.id, { text: e.target.value })}
                              onBlur={() => setEditingTextId(null)}
                              onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingTextId(null) }}
                              onMouseDown={e => e.stopPropagation()}
                              style={{
                                fontSize: layer.fontSize ?? 28,
                                fontFamily: layer.fontFamily ?? 'Inter',
                                color: layer.color ?? '#000000',
                                fontWeight: layer.bold ? 'bold' : 'normal',
                                fontStyle: layer.italic ? 'italic' : 'normal',
                                textAlign: layer.align ?? 'center',
                                background: 'rgba(255,255,255,0.85)',
                                border: '1.5px solid #1A1A12',
                                borderRadius: 4,
                                outline: 'none',
                                width: '100%',
                                padding: '2px 4px',
                              }}
                            />
                          ) : layer.arc && layer.arc !== 0 ? (
                            /* Curved text SVG renderer */
                            <svg
                              style={{
                                width: '100%',
                                height: '100%',
                                overflow: 'visible',
                                pointerEvents: 'none',
                              }}
                              viewBox={`0 0 ${layer.width} ${layer.height}`}>
                              <defs>
                                <path
                                  id={`arc-path-${layer.id}`}
                                  d={
                                    layer.arc > 0
                                      ? `M 0,${layer.height * 0.70} Q ${layer.width / 2},${layer.height * 0.70 - (layer.arc / 180) * (layer.height * 0.65)} ${layer.width},${layer.height * 0.70}`
                                      : `M 0,${layer.height * 0.30} Q ${layer.width / 2},${layer.height * 0.30 - (layer.arc / 180) * (layer.height * 0.65)} ${layer.width},${layer.height * 0.30}`
                                  }
                                  fill="none"
                                />
                              </defs>
                              <text
                                fill={layer.color ?? '#000000'}
                                fontSize={layer.fontSize ?? 28}
                                fontFamily={layer.fontFamily ?? 'Inter'}
                                fontWeight={layer.bold ? 'bold' : 'normal'}
                                fontStyle={layer.italic ? 'italic' : 'normal'}
                                letterSpacing={layer.letterSpacing ?? 0}
                              >
                                <textPath
                                  href={`#arc-path-${layer.id}`}
                                  startOffset="50%"
                                  textAnchor="middle"
                                >
                                  {layer.text}
                                </textPath>
                              </text>
                            </svg>
                          ) : (
                            <div
                              onDoubleClick={e => { e.stopPropagation(); setEditingTextId(layer.id) }}
                              style={{
                                fontSize: layer.fontSize ?? 28,
                                fontFamily: layer.fontFamily ?? 'Inter',
                                color: layer.color ?? '#000000',
                                fontWeight: layer.bold ? 'bold' : 'normal',
                                fontStyle: layer.italic ? 'italic' : 'normal',
                                textAlign: layer.align ?? 'center',
                                letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : undefined,
                                whiteSpace: 'nowrap',
                                lineHeight: 1.1,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: layer.align === 'left' ? 'flex-start' : layer.align === 'right' ? 'flex-end' : 'center',
                              }}>
                              {layer.text}
                            </div>
                          )
                        )}

                        {/* ── Selection Handles & Printify Quick Actions ── */}
                        {isSelected && !layer.locked && (
                          <>
                            {/* Selection border */}
                            <div style={{
                              position: 'absolute', inset: 0,
                              border: '1.5px solid #2563EB',
                              borderRadius: 2,
                              pointerEvents: 'none',
                            }} />

                            {/* Rotate stem line */}
                            <div style={{
                              position: 'absolute', left: '50%', top: 0,
                              width: 1, height: 26, background: '#2563EB',
                              transform: 'translate(-50%, -100%)', pointerEvents: 'none',
                            }} />

                            {/* ── Printify Floating Typography Toolbar (Docked Above Text Layer) ── */}
                            {layer.type === 'text' && (
                              <div
                                onMouseDown={e => e.stopPropagation()}
                                style={{
                                  position: 'absolute',
                                  left: '50%',
                                  top: -82,
                                  transform: 'translateX(-50%)',
                                }}
                                className="bg-[#1A1A12] text-white rounded-2xl shadow-2xl p-1.5 flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap z-40 border border-white/20 select-none backdrop-blur-md"
                              >
                                {/* 1. Font Family Picker with live typography */}
                                <select
                                  value={layer.fontFamily || 'Inter'}
                                  onChange={e => updateLayer(layer.id, { fontFamily: e.target.value })}
                                  className="bg-[#2A2A22] text-white text-[11px] font-bold px-2 py-1 rounded-lg border border-white/20 focus:outline-none cursor-pointer max-w-[105px] truncate"
                                  title="Font Family"
                                >
                                  {PRINTIFY_FONTS.map(f => (
                                    <option key={f.name} value={f.name} style={{ fontFamily: f.family }}>
                                      {f.name}
                                    </option>
                                  ))}
                                </select>

                                {/* 2. Font Size Stepper */}
                                <div className="flex items-center bg-[#2A2A22] rounded-lg border border-white/20 px-1 py-0.5">
                                  <button
                                    onClick={() => updateLayer(layer.id, { fontSize: Math.max(10, (layer.fontSize || 28) - 2) })}
                                    className="px-1 text-white/70 hover:text-white font-bold"
                                    title="Decrease size"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    value={layer.fontSize || 28}
                                    onChange={e => updateLayer(layer.id, { fontSize: Math.max(8, parseInt(e.target.value) || 28) })}
                                    className="w-8 text-center bg-transparent text-[11px] font-bold text-white focus:outline-none"
                                  />
                                  <button
                                    onClick={() => updateLayer(layer.id, { fontSize: Math.min(180, (layer.fontSize || 28) + 2) })}
                                    className="px-1 text-white/70 hover:text-white font-bold"
                                    title="Increase size"
                                  >
                                    +
                                  </button>
                                </div>

                                {/* 3. Bold & Italic Toggles */}
                                <button
                                  onClick={() => updateLayer(layer.id, { bold: !layer.bold })}
                                  className={cn('w-6 h-6 rounded flex items-center justify-center font-bold text-xs transition-colors', layer.bold ? 'bg-amber-400 text-black' : 'hover:bg-white/20 text-white')}
                                  title="Toggle Bold"
                                >
                                  B
                                </button>
                                <button
                                  onClick={() => updateLayer(layer.id, { italic: !layer.italic })}
                                  className={cn('w-6 h-6 rounded flex items-center justify-center italic font-serif text-xs transition-colors', layer.italic ? 'bg-amber-400 text-black' : 'hover:bg-white/20 text-white')}
                                  title="Toggle Italic"
                                >
                                  I
                                </button>

                                {/* 4. Alignment */}
                                <div className="flex items-center gap-0.5 bg-[#2A2A22] p-0.5 rounded-lg border border-white/20">
                                  <button onClick={() => updateLayer(layer.id, { align: 'left' })} className={cn('p-1 rounded', layer.align === 'left' ? 'text-amber-400' : 'text-white/60 hover:text-white')}>
                                    <AlignLeft size={12} />
                                  </button>
                                  <button onClick={() => updateLayer(layer.id, { align: 'center' })} className={cn('p-1 rounded', !layer.align || layer.align === 'center' ? 'text-amber-400' : 'text-white/60 hover:text-white')}>
                                    <AlignCenter size={12} />
                                  </button>
                                  <button onClick={() => updateLayer(layer.id, { align: 'right' })} className={cn('p-1 rounded', layer.align === 'right' ? 'text-amber-400' : 'text-white/60 hover:text-white')}>
                                    <AlignRight size={12} />
                                  </button>
                                </div>

                                {/* 5. Color Swatch & Native Color Picker */}
                                <div className="relative flex items-center">
                                  <input
                                    type="color"
                                    value={layer.color || '#000000'}
                                    onChange={e => updateLayer(layer.id, { color: e.target.value })}
                                    className="w-6 h-6 rounded-full cursor-pointer border border-white/40 p-0 bg-transparent"
                                    title="Choose text color"
                                  />
                                </div>

                                {/* 6. Arc / Curvature Slider */}
                                <div className="flex items-center gap-1 bg-[#2A2A22] px-2 py-0.5 rounded-lg border border-white/20 text-[10px]">
                                  <span className="text-white/70">⌒</span>
                                  <input
                                    type="range"
                                    min="-90"
                                    max="90"
                                    step="5"
                                    value={layer.arc || 0}
                                    onChange={e => updateLayer(layer.id, { arc: parseInt(e.target.value) })}
                                    className="w-14 accent-amber-400 h-1.5 cursor-pointer"
                                    title="Text curvature"
                                  />
                                  <span className="font-mono text-amber-400 text-[10px] w-6 text-right">{layer.arc || 0}°</span>
                                </div>

                                {/* 7. Letter Spacing Slider */}
                                <div className="flex items-center gap-1 bg-[#2A2A22] px-2 py-0.5 rounded-lg border border-white/20 text-[10px]">
                                  <span className="text-white/70">A↔A</span>
                                  <input
                                    type="range"
                                    min="-2"
                                    max="12"
                                    step="1"
                                    value={layer.letterSpacing || 0}
                                    onChange={e => updateLayer(layer.id, { letterSpacing: parseInt(e.target.value) })}
                                    className="w-12 accent-amber-400 h-1.5 cursor-pointer"
                                    title="Letter spacing"
                                  />
                                  <span className="font-mono text-amber-400 text-[10px] w-5 text-right">{layer.letterSpacing || 0}</span>
                                </div>

                                {/* 8. Print Finish dropdown */}
                                <select
                                  value={layer.printMethod || 'dtg'}
                                  onChange={e => updateLayer(layer.id, { printMethod: e.target.value as PrintMethod })}
                                  className="bg-[#2A2A22] text-amber-300 text-[10px] font-bold px-1.5 py-1 rounded border border-white/20 focus:outline-none cursor-pointer"
                                  title="Print Technique"
                                >
                                  <option value="dtg">🎨 DTG</option>
                                  <option value="embroidery">🧵 Sewed</option>
                                  <option value="chenille">🧶 Chenille</option>
                                  <option value="screen">🖨️ Screen</option>
                                  <option value="vintage">🌾 Vintage</option>
                                  <option value="vinyl">✂️ Vinyl</option>
                                </select>
                              </div>
                            )}

                            {/* Rotate handle */}
                            <div
                              title="Rotate artwork"
                              onMouseDown={e => { e.stopPropagation(); startDrag(e, layer.id, 'rotate') }}
                              style={{
                                position: 'absolute', left: '50%', top: -36,
                                width: 18, height: 18, borderRadius: '50%',
                                background: 'white', border: '2px solid #2563EB',
                                transform: 'translateX(-50%)',
                                cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                              }}>
                              <RotateCw size={10} strokeWidth={2.5} color="#2563EB" />
                            </div>

                            {/* 8 Resize Handles */}
                            {RESIZE_HANDLES.map(h => (
                              <div
                                key={h.id}
                                onMouseDown={e => { e.stopPropagation(); startDrag(e, layer.id, h.id) }}
                                style={{
                                  position: 'absolute',
                                  left: `${h.xFrac * 100}%`,
                                  top:  `${h.yFrac * 100}%`,
                                  width: 10, height: 10,
                                  background: 'white',
                                  border: '2px solid #2563EB',
                                  borderRadius: 2,
                                  transform: 'translate(-50%, -50%)',
                                  cursor: h.cursor,
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                                }}
                              />
                            ))}

                            {/* Floating Quick Action Toolbar (Center, Fit, Duplicate, Delete) */}
                            <div
                              onMouseDown={e => e.stopPropagation()}
                              className="absolute -bottom-11 left-1/2 -translate-x-1/2 bg-[#1A1A12] text-white rounded-xl shadow-xl px-2.5 py-1 flex items-center gap-1.5 text-[11px] font-semibold whitespace-nowrap z-30">
                              <button
                                onClick={() => alignLayer('centerX')}
                                className="px-2 py-1 rounded hover:bg-white/20 transition-colors"
                                title="Center horizontally">
                                Center H
                              </button>
                              <button
                                onClick={() => alignLayer('centerY')}
                                className="px-2 py-1 rounded hover:bg-white/20 transition-colors"
                                title="Center vertically">
                                Center V
                              </button>
                              <button
                                onClick={() => alignLayer('fit')}
                                className="px-2 py-1 rounded hover:bg-white/20 transition-colors"
                                title="Fit to print area">
                                Fit Area
                              </button>
                              {['tshirt', 'sweatshirt', 'jacket', 'hoodie', 'hoodie-zip'].includes(info.type) && (
                                <>
                                  <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
                                  <button
                                    onClick={() => alignLayer('leftChest')}
                                    className="px-2 py-1 rounded bg-blue-600/30 text-blue-200 hover:bg-blue-600/50 transition-colors"
                                    title="Left Chest (Pocket placement)">
                                    L. Chest
                                  </button>
                                  <button
                                    onClick={() => alignLayer('centerChest')}
                                    className="px-2 py-1 rounded bg-purple-600/30 text-purple-200 hover:bg-purple-600/50 transition-colors"
                                    title="Center Chest placement">
                                    C. Chest
                                  </button>
                                </>
                              )}
                              <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
                              <button
                                onClick={() => updateLayer(layer.id, { flipX: !layer.flipX })}
                                className="p-1 rounded hover:bg-white/20 transition-colors"
                                title="Flip horizontal">
                                <FlipHorizontal size={13} />
                              </button>
                              <button
                                onClick={() => duplicateLayer(layer)}
                                className="p-1 rounded hover:bg-white/20 transition-colors"
                                title="Duplicate layer">
                                <Copy size={13} />
                              </button>
                              <button
                                onClick={() => deleteLayer(layer.id)}
                                className="p-1 rounded hover:bg-red-500 text-red-400 hover:text-white transition-colors"
                                title="Delete layer">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Mode 2: PREVIEW MODE (Photorealistic Presentation matching Images 1 & 3) ── */}
          {activeTab === 'preview' && (() => {
            const currentScene = mockupScenes.find(s => s.id === previewScene) ?? mockupScenes[0]

            return (
              <div className="flex-1 flex flex-col items-center justify-between p-4 overflow-y-auto bg-white select-none">
                {/* Main Close-View Stage (Fills ~85% of Viewport, Isolated on Clean White) */}
                <div className="w-full flex-1 flex items-center justify-center min-h-[460px] max-h-[620px] p-2">
                  {currentScene.isChart ? (
                    /* Technical Size Chart View */
                    <div className="w-full max-w-[540px] bg-white rounded-2xl border border-[#E5E2DC] shadow-sm flex flex-col justify-center items-center p-8 text-center">
                      <h3 className="text-base font-bold text-[#1A1A12] mb-1">{info.name} Size Chart</h3>
                      <p className="text-xs text-[#8C8880] mb-6">Accurate garment specifications (Inches)</p>
                      <div className="w-full border border-[#E5E2DC] rounded-xl overflow-hidden text-xs shadow-xs">
                        <div className="bg-[#FAF9F6] grid grid-cols-4 p-3 font-bold text-[#1A1A12] border-b border-[#E5E2DC]">
                          <span>Size</span><span>Chest</span><span>Length</span><span>Sleeve</span>
                        </div>
                        {[
                          { s: 'S', c: '38"', l: '28"', sl: '8.25"' },
                          { s: 'M', c: '41"', l: '29"', sl: '8.50"' },
                          { s: 'L', c: '44"', l: '30"', sl: '8.75"' },
                          { s: 'XL', c: '48"', l: '31"', sl: '9.00"' },
                          { s: '2XL', c: '52"', l: '32"', sl: '9.25"' },
                        ].map(row => (
                          <div key={row.s} className="grid grid-cols-4 p-3 text-[#5C5A55] border-b border-[#F0ECE1] last:border-b-0 hover:bg-[#FCFBF9]">
                            <span className="font-bold text-[#1A1A12]">{row.s}</span>
                            <span>{row.c}</span>
                            <span>{row.l}</span>
                            <span>{row.sl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Photorealistic Studio Vector & Photographic Mockup Stage */
                    <RealisticProductPreview
                      productType={info.type}
                      productId={productId}
                      view={currentScene.id === 'back' || currentScene.id === 'back-side' ? 'back' : 'front'}
                      sceneId={currentScene.id}
                      color={productColor}
                      colorMode={mockupColorMode}
                      layers={layers}
                      printBox={printBox}
                      printMethod={previewPrintMethod === 'auto' ? undefined : previewPrintMethod}
                      photoId={currentScene.photoId}
                      className="w-full h-full max-w-[560px] max-h-[580px]"
                    />
                  )}
                </div>

                {/* Bottom Bar in Preview Mode (Matching Image 3) */}
                <div className="w-full flex items-center justify-between pt-2 px-6 border-t border-[#F0ECE1] shrink-0 gap-3">
                  <button
                    onClick={handleDownloadMockup}
                    disabled={isExporting}
                    className="flex items-center gap-2 text-xs font-semibold text-[#1A1A12] hover:text-[#575C46] transition-colors py-2 px-3 rounded-lg hover:bg-[#F5F4F0] shrink-0">
                    <Download size={15} />
                    <span>Download mockup</span>
                  </button>

                  {/* Inline Color Quick Selector */}
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-[500px] py-1 px-2.5 bg-[#FAF9F6] rounded-xl border border-[#E5E2DC] shadow-2xs">
                    <span className="text-[10px] font-bold text-[#6E6B65] uppercase tracking-wider mr-1 shrink-0">Color:</span>
                    {info.colors.map(c => {
                      const isActive = productColor.toUpperCase() === c.hex.toUpperCase()
                      return (
                        <button
                          key={c.hex}
                          onClick={() => setProductColor(c.hex)}
                          title={`${c.name}${c.isHeather ? ' (Heather)' : ''}`}
                          className={cn(
                            'w-5 h-5 rounded-full border transition-all flex items-center justify-center shrink-0',
                            isActive
                              ? 'border-[#575C46] ring-2 ring-[#575C46] scale-110 shadow-2xs z-10'
                              : 'border-[#D5D2CA] hover:scale-110'
                          )}
                          style={{
                            backgroundColor: c.hex,
                            backgroundImage: c.isHeather
                              ? `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 1px, transparent 1px)`
                              : undefined,
                            backgroundSize: c.isHeather ? '3px 3px' : undefined
                          }}>
                          {isActive && (
                            <Check size={10} className={cn(c.hex === '#FFFFFF' || c.hex === '#DEDEDB' ? 'text-black' : 'text-white')} strokeWidth={3} />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#8C8880] shrink-0">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Printify Close-View Verified · 300 DPI</span>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* ── View Switcher Pills (Printify Bottom Floating Nav matching Image 2) ── */}
          {activeTab === 'edit' && (
            <div className="shrink-0 flex items-center justify-between px-6 pb-4 pt-1 z-10">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5 bg-white border border-[#E5E2DC] shadow-sm rounded-xl px-2.5 py-1">
                <button
                  onClick={() => setZoom(z => Math.max(30, z - 10))}
                  className="p-1 hover:text-[#1A1A12] text-[#6E6B65]">
                  <ZoomOut size={14} />
                </button>
                <span className="text-xs font-bold text-[#1A1A12] min-w-[36px] text-center">{zoom}%</span>
                <button
                  onClick={() => setZoom(z => Math.min(180, z + 10))}
                  className="p-1 hover:text-[#1A1A12] text-[#6E6B65]">
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={() => setZoom(100)}
                  className="text-[10px] font-semibold text-[#8C8880] hover:text-[#1A1A12] px-1">
                  Reset
                </button>
              </div>

              {/* Center Multi-Pill Switcher (Exact Match to Printify Image 2) */}
              {info.isAOP ? (
                <div className="flex items-center bg-white border border-[#E5E2DC] shadow-sm rounded-xl p-1 gap-1 overflow-x-auto max-w-[780px]">
                  {info.printAreas.map(area => {
                    const isActive = activePrintArea.toLowerCase() === area.toLowerCase()
                    const hasLayers = layers.some(l => l.view.toLowerCase() === area.toLowerCase() && l.visible)
                    return (
                      <button
                        key={area}
                        onClick={() => {
                          setActivePrintArea(area)
                          setSelectedId(null)
                        }}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 shrink-0',
                          isActive
                            ? 'bg-[#575C46] text-white shadow-xs'
                            : 'text-[#6E6B65] hover:text-[#1A1A12] bg-white hover:bg-[#F5F4F0]'
                        )}>
                        <span>{area}</span>
                        {hasLayers && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex items-center bg-white border border-[#E5E2DC] shadow-sm rounded-xl p-1 gap-1">
                  <button
                    onClick={() => {
                      setActivePrintArea(info.printAreas[0])
                      setSelectedId(null)
                    }}
                    className={cn(
                      'px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
                      activePrintArea === info.printAreas[0]
                        ? 'bg-[#575C46] text-white shadow-xs'
                        : 'text-[#6E6B65] hover:text-[#1A1A12] bg-white'
                    )}>
                    <span>Front side</span>
                    {layers.some(l => (l.view === info.printAreas[0] || l.view.includes('Front') || l.view.includes('Center') || l.view.includes('Chest')) && l.visible) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setActivePrintArea('Back')
                      setSelectedId(null)
                    }}
                    className={cn(
                      'px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
                      activePrintArea === 'Back'
                        ? 'bg-[#575C46] text-white shadow-xs'
                        : 'text-[#6E6B65] hover:text-[#1A1A12] bg-white'
                    )}>
                    <span>Back side</span>
                    {layers.some(l => (l.view === 'Back' || l.view.includes('Back')) && l.visible) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                  {info.printAreas.length > 2 && (
                    <div className="relative group">
                      <button
                        className="px-3 py-2 rounded-lg text-xs font-semibold text-[#6E6B65] hover:text-[#1A1A12] flex items-center gap-1 hover:bg-[#F5F4F0]">
                        <span>More ({info.printAreas.length - 2})</span>
                        <ChevronDown size={12} />
                      </button>
                      <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex flex-col bg-white border border-[#E5E2DC] rounded-xl shadow-lg p-1 min-w-[140px] z-30">
                        {info.printAreas.slice(2).map(area => (
                          <button
                            key={area}
                            onClick={() => {
                              setActivePrintArea(area)
                              setSelectedId(null)
                            }}
                            className={cn(
                              'px-3 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors',
                              activePrintArea === area ? 'bg-[#575C46] text-white' : 'text-[#1A1A12] hover:bg-[#F5F4F0]'
                            )}>
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resolution & Print Quality Badge */}
              <div className="flex items-center gap-1.5 bg-white border border-[#E5E2DC] shadow-sm rounded-xl px-3 py-1.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-[#1A1A12]">300 DPI</span>
                <span className="text-[11px] text-[#8C8880]">· High Quality</span>
              </div>
            </div>
          )}
        </main>

        {/* ── Right Panel (Printify Mockup View in Preview / Inspector in Edit) ── */}
        <aside className="w-[330px] bg-white border-l border-[#E5E2DC] flex flex-col shrink-0 z-20 overflow-y-auto">
          {activeTab === 'preview' ? (
            /* ── PREVIEW MODE: MOCKUP VIEW SIDEBAR (Matching Image 3) ── */
            <div className="p-5 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                {/* 1. Mockup view Heading & 4 Live-Artwork Thumbnails */}
                <div>
                  <h2 className="text-[16px] font-bold text-[#1A1A12] leading-tight mb-3">
                    Mockup view
                  </h2>

                  <div className="grid grid-cols-4 gap-2">
                    {mockupScenes.map(scene => (
                      <button
                        key={scene.id}
                        onClick={() => setPreviewScene(scene.id)}
                        className={cn(
                          'rounded-xl border p-1 bg-white hover:bg-[#FAF9F6] transition-all text-center group flex flex-col items-center',
                          previewScene === scene.id
                            ? 'border-[#575C46] ring-2 ring-[#575C46] shadow-xs'
                            : 'border-[#E5E2DC] hover:border-[#9A9A8E]'
                        )}>
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white mb-1.5 flex items-center justify-center border border-[#EBE8E3]">
                          {scene.isChart ? (
                            <div className="text-[9px] text-[#8C8880] font-bold text-center leading-tight">
                              <span>SIZE<br/>CHART</span>
                            </div>
                          ) : (
                            <RealisticProductPreview
                              productType={info.type}
                              productId={productId}
                              view={scene.id === 'back' || scene.id === 'back-side' ? 'back' : 'front'}
                              sceneId={scene.id}
                              color={productColor}
                              colorMode={mockupColorMode}
                              layers={layers}
                              printBox={printBox}
                              printMethod={previewPrintMethod === 'auto' ? undefined : previewPrintMethod}
                              photoId={scene.photoId}
                              className="w-full h-full scale-[1.15]"
                            />
                          )}
                        </div>
                        <span className="block text-[10px] font-semibold text-[#1A1A12] truncate w-full leading-tight">
                          {scene.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1B. Garment Colors Swatch Picker (Printify Standard - Prominently Displayed at Top) */}
                <div className="pt-3 border-t border-[#EFECE6] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1A12]">Garment Colors</span>
                    <span className="text-[11px] font-semibold text-[#575C46] bg-[#575C46]/10 px-2 py-0.5 rounded-full">
                      {info.colors.find(c => c.hex.toUpperCase() === productColor.toUpperCase())?.name || 'Selected'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {info.colors.map(c => {
                      const isActive = productColor.toUpperCase() === c.hex.toUpperCase()
                      return (
                        <button
                          key={c.hex}
                          onClick={() => setProductColor(c.hex)}
                          title={`${c.name}${c.isHeather ? ' (Heather)' : ''}`}
                          className={cn(
                            'w-7 h-7 rounded-full border-2 transition-all relative flex items-center justify-center shrink-0 shadow-2xs',
                            isActive
                              ? 'border-[#575C46] ring-2 ring-[#575C46] scale-110 shadow-xs z-10'
                              : 'border-[#E5E2DC] hover:scale-105 hover:border-[#9C988F]'
                          )}
                          style={{
                            backgroundColor: c.hex,
                            backgroundImage: c.isHeather
                              ? `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)`
                              : undefined,
                            backgroundSize: c.isHeather ? '3px 3px' : undefined
                          }}>
                          {isActive && (
                            <Check size={12} className={cn(c.hex === '#FFFFFF' || c.hex === '#DEDEDB' ? 'text-black' : 'text-white')} strokeWidth={3} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 1C. Application Finish Preview (Physical Finish Controls) */}
                <div className="pt-3 border-t border-[#EFECE6] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1A12]">Application Finish</span>
                    <span className="text-[10px] font-bold text-[#575C46] bg-[#575C46]/10 px-2 py-0.5 rounded-full uppercase">
                      {previewPrintMethod === 'auto' ? 'Per-Layer' :
                       previewPrintMethod === 'chenille' ? 'Chenille' :
                       previewPrintMethod === 'embroidery' ? 'Sewed' : previewPrintMethod.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78756E] leading-normal">
                    Interactive physical preview: 3D sewed thread relief, chenille loop yarn, embedded DTG, or screen print.
                  </p>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    {[
                      { id: 'auto', label: 'Per-Layer' },
                      { id: 'chenille', label: 'Chenille/Fuzzy' },
                      { id: 'embroidery', label: 'Sewed/Thread' },
                      { id: 'dtg', label: 'DTG Cotton' },
                      { id: 'screen', label: 'Screen Print' },
                      { id: 'dtf', label: 'Direct-to-Film' },
                      { id: 'vintage', label: 'Discharge' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setPreviewPrintMethod(item.id as any)}
                        className={cn(
                          'py-1.5 px-1 rounded-lg font-semibold border text-center transition-all truncate',
                          previewPrintMethod === item.id
                            ? 'bg-[#575C46] text-white border-[#575C46] shadow-2xs'
                            : 'bg-white hover:bg-[#FAF9F6] border-[#D5D2CA] text-[#1A1A12]'
                        )}
                        title={item.label}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Preview product size & scaling (Image 3) */}
                <div className="pt-3 border-t border-[#EFECE6] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1A1A12]">Preview product size:</span>
                    <span className="font-bold text-[#1A1A12] bg-[#F5F4F0] px-2.5 py-0.5 rounded border border-[#E5E2DC]">{selectedSize}</span>
                  </div>
                  <p className="text-[11px] text-[#78756E] leading-normal">
                    Design is scaled down on smaller sizes.
                  </p>
                  <button
                    onClick={() => setShowVariantMatrix(true)}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-[#D5D2CA] text-[#1A1A12] bg-white hover:bg-[#FAF9F6] transition-colors flex items-center justify-center gap-2 shadow-2xs">
                    <SlidersHorizontal size={13} />
                    <span>Design scaling</span>
                  </button>
                </div>

                {/* 3. Mockup color mode (Image 3) */}
                <div className="pt-3 border-t border-[#EFECE6] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1A12]">Mockup color mode</span>
                    <span className="text-[11px] font-semibold text-[#575C46] flex items-center gap-0.5 cursor-pointer hover:underline">
                      Learn more ↗
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#1A1A12]">
                    <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F9F8F5] cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="mockupColorMode"
                        checked={mockupColorMode === 'cmyk'}
                        onChange={() => setMockupColorMode('cmyk')}
                        className="text-[#575C46] focus:ring-[#575C46]"
                      />
                      <span>Realistic (CMYK)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F9F8F5] cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="mockupColorMode"
                        checked={mockupColorMode === 'rgb'}
                        onChange={() => setMockupColorMode('rgb')}
                        className="text-[#575C46] focus:ring-[#575C46]"
                      />
                      <div className="flex items-center gap-1.5">
                        <span>Bright/colourful (RGB)</span>
                        <span className="text-[10px] font-bold text-white bg-[#575C46] px-1.5 py-0.2 rounded-full">Default</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── EDIT MODE: PRINTIFY COLOR/SIZE VARIANTS & LAYER INSPECTOR (Matching Image 2) ── */
            <div className="p-4 space-y-4">
              {/* Optional Top Tab Switcher when a Layer is Selected */}
              {selected && (
                <div className="flex items-center gap-1 bg-[#F5F4F0] p-1 rounded-xl text-xs font-bold border border-[#E5E2DC]">
                  <button
                    onClick={() => setSidebarEditTab('variants')}
                    className={cn(
                      'flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5',
                      sidebarEditTab === 'variants'
                        ? 'bg-white text-[#1A1A12] shadow-2xs'
                        : 'text-[#6E6B65] hover:text-[#1A1A12]'
                    )}>
                    <Palette size={13} />
                    <span>Variants ({Object.values(selectedVariants).reduce((a, s) => a + s.length, 0)})</span>
                  </button>
                  <button
                    onClick={() => setSidebarEditTab('inspector')}
                    className={cn(
                      'flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5',
                      sidebarEditTab === 'inspector'
                        ? 'bg-white text-[#1A1A12] shadow-2xs'
                        : 'text-[#6E6B65] hover:text-[#1A1A12]'
                    )}>
                    <LayersIcon size={13} />
                    <span>Layer Properties</span>
                  </button>
                </div>
              )}

              {/* ── PRINTIFY VARIANT MANAGER (Exact match to Image 2) ── */}
              {(!selected || sidebarEditTab === 'variants') && (() => {
                const totalVariants = Object.values(selectedVariants).reduce((acc, s) => acc + s.length, 0)
                const allSelected = info.colors.every(c => (selectedVariants[c.hex]?.length || 0) > 0)
                const someSelected = !allSelected && Object.values(selectedVariants).some(s => s.length > 0)

                return (
                  <div className="space-y-3.5">
                    {/* Top Tabs: Color | Size */}
                    <div className="flex border-b border-[#E5E2DC] gap-6 text-[14px]">
                      <button
                        onClick={() => setVariantSubTab('color')}
                        className={cn(
                          'pb-2.5 font-bold transition-all relative',
                          variantSubTab === 'color'
                            ? 'text-[#1A1A12] border-b-2 border-[#1A1A12]'
                            : 'text-[#8C8880] hover:text-[#1A1A12]'
                        )}>
                        Color
                      </button>
                      <button
                        onClick={() => setVariantSubTab('size')}
                        className={cn(
                          'pb-2.5 font-bold transition-all relative',
                          variantSubTab === 'size'
                            ? 'text-[#1A1A12] border-b-2 border-[#1A1A12]'
                            : 'text-[#8C8880] hover:text-[#1A1A12]'
                        )}>
                        Size
                      </button>
                    </div>

                    {/* Subtitle Advice (Exact text from Image 2) */}
                    <p className="text-[12px] text-[#78756E] leading-tight">
                      Optimal listings have between 5-15 variants
                    </p>

                    {/* Master Checkbox Row (Exact match to Image 2) */}
                    <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E2DC] space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <button
                            type="button"
                            onClick={() => {
                              if (allSelected) {
                                setSelectedVariants({ [productColor]: ['S', 'M', 'L', 'XL', '2XL'] })
                              } else {
                                const next: Record<string, string[]> = {}
                                info.colors.forEach(c => {
                                  next[c.hex] = ['S', 'M', 'L', 'XL', '2XL']
                                })
                                setSelectedVariants(next)
                              }
                            }}
                            className={cn(
                              'w-4 h-4 rounded flex items-center justify-center transition-colors',
                              allSelected
                                ? 'bg-[#575C46] text-white'
                                : someSelected
                                ? 'bg-[#575C46] text-white'
                                : 'border border-[#9C988F] bg-white'
                            )}>
                            {allSelected ? (
                              <Check size={11} strokeWidth={3} />
                            ) : someSelected ? (
                              <Minus size={11} strokeWidth={3} />
                            ) : null}
                          </button>
                          <span className="text-[13px] font-bold text-[#1A1A12]">
                            Select all (max 100)
                          </span>
                        </label>
                        <button
                          onClick={() => setShowVariantMatrix(true)}
                          className="text-[12px] font-bold text-[#1A1A12] hover:underline">
                          See details
                        </button>
                      </div>
                      <div className="pl-6.5 text-[11px] font-medium text-[#78756E]">
                        {totalVariants} variants selected
                      </div>
                    </div>

                    {/* Color Variant List (Exact match to Image 2 with textured swatches) */}
                    {variantSubTab === 'color' ? (
                      <div className="border border-[#E5E2DC] rounded-xl overflow-hidden divide-y divide-[#E5E2DC] bg-white">
                        {info.colors.map(c => {
                          const isColorChecked = (selectedVariants[c.hex]?.length || 0) > 0
                          const isExpanded = expandedColor === c.hex
                          const isCurrentActive = productColor === c.hex

                          return (
                            <div key={c.hex} className={cn('transition-colors', isCurrentActive ? 'bg-[#F9F8F5]' : '')}>
                              <div className="flex items-center justify-between p-3 hover:bg-[#FAF9F6]">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {/* Checkbox */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedVariants(prev => {
                                        const next = { ...prev }
                                        if (next[c.hex] && next[c.hex].length > 0) {
                                          delete next[c.hex]
                                        } else {
                                          next[c.hex] = ['S', 'M', 'L', 'XL', '2XL']
                                        }
                                        return next
                                      })
                                    }}
                                    className={cn(
                                      'w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0',
                                      isColorChecked
                                        ? 'bg-[#575C46] text-white'
                                        : 'border border-[#9C988F] bg-white hover:border-[#1A1A12]'
                                    )}>
                                    {isColorChecked && <Check size={11} strokeWidth={3} />}
                                  </button>

                                  {/* Interactive Row: changes canvas active color */}
                                  <div
                                    onClick={() => setProductColor(c.hex)}
                                    className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer">
                                    {/* Circular Swatch (With authentic heather texture for heather tones) */}
                                    {c.isHeather ? (
                                      <div
                                        className="w-5 h-5 rounded-full border border-[#D5D2CA] shrink-0 relative overflow-hidden shadow-2xs"
                                        style={{
                                          backgroundColor: c.hex,
                                          backgroundImage: 'radial-gradient(rgba(0,0,0,0.22) 1px, transparent 0), radial-gradient(rgba(255,255,255,0.28) 1px, transparent 0)',
                                          backgroundSize: '3px 3px',
                                          backgroundPosition: '0 0, 1.5px 1.5px',
                                        }}
                                      />
                                    ) : (
                                      <div
                                        className="w-5 h-5 rounded-full border border-[#D5D2CA] shrink-0 shadow-2xs"
                                        style={{ backgroundColor: c.hex }}
                                      />
                                    )}

                                    <span className={cn(
                                      'text-[13px] truncate',
                                      isCurrentActive ? 'font-bold text-[#1A1A12]' : 'font-medium text-[#1A1A12]'
                                    )}>
                                      {c.name}
                                    </span>
                                    {isCurrentActive && (
                                      <span className="text-[10px] font-bold text-[#575C46] bg-[#575C46]/10 px-1.5 py-0.2 rounded-full shrink-0">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Expand Chevron */}
                                <button
                                  type="button"
                                  onClick={() => setExpandedColor(isExpanded ? null : c.hex)}
                                  className="p-1 text-[#8C8880] hover:text-[#1A1A12] transition-transform">
                                  <ChevronDown size={14} className={cn('transition-transform', isExpanded ? 'rotate-180' : '')} />
                                </button>
                              </div>

                              {/* Expanded Size Selection Matrix */}
                              {isExpanded && (
                                <div className="p-3 bg-[#FAF9F6] border-t border-[#E5E2DC] space-y-2">
                                  <span className="text-[11px] font-bold text-[#78756E] uppercase tracking-wider block">
                                    Available Sizes for {c.name}:
                                  </span>
                                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                                    {['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map(sz => {
                                      const isSzChecked = selectedVariants[c.hex]?.includes(sz)
                                      return (
                                        <button
                                          key={sz}
                                          type="button"
                                          onClick={() => {
                                            setSelectedVariants(prev => {
                                              const cur = prev[c.hex] || []
                                              const updated = cur.includes(sz)
                                                ? cur.filter(s => s !== sz)
                                                : [...cur, sz]
                                              return { ...prev, [c.hex]: updated }
                                            })
                                          }}
                                          className={cn(
                                            'py-1.5 px-2 rounded-lg font-bold border transition-all text-center',
                                            isSzChecked
                                              ? 'bg-[#575C46] text-white border-[#575C46] shadow-2xs'
                                              : 'bg-white text-[#6E6B65] border-[#D5D2CA] hover:border-[#1A1A12]'
                                          )}>
                                          {sz}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      /* Size Breakdown Tab */
                      <div className="border border-[#E5E2DC] rounded-xl overflow-hidden divide-y divide-[#E5E2DC] bg-white">
                        {['S', 'M', 'L', 'XL', '2XL', '3XL'].map(sz => {
                          const colorCount = Object.values(selectedVariants).filter(sizes => sizes.includes(sz)).length
                          return (
                            <div key={sz} className="p-3 flex items-center justify-between hover:bg-[#FAF9F6]">
                              <div className="flex items-center gap-2.5">
                                <span className="font-bold text-[13px] text-[#1A1A12] w-10">{sz}</span>
                                <span className="text-xs text-[#78756E]">{colorCount} colors enabled</span>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                In Stock
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* 3. Selected Layer Inspector */}
              {selected && sidebarEditTab === 'inspector' && (() => {
                const physicalWidth = info.type === 'mug' ? 3.5 : info.type === 'hat' ? 4 : info.type === 'tote' ? 10 : 12
                const layerInches = (selected.width / printBox.w) * physicalWidth
                const calculatedDpi = selected.naturalWidth ? Math.round(selected.naturalWidth / Math.max(0.1, layerInches)) : 300
                const dpiHealth = calculatedDpi >= 280 ? 'optimal' : calculatedDpi >= 180 ? 'good' : calculatedDpi >= 120 ? 'fair' : 'poor'

                return (
                  <div className="pt-4 border-t border-[#E5E2DC] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#1A1A12] uppercase tracking-wider">Layer Properties</h3>
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {selected.type === 'text' ? 'Vector Text' : 'Image Graphic'}
                      </span>
                    </div>

                    {/* DPI Health Gauge for Image Layers */}
                    {selected.type === 'image' && (
                      <div className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#E5E2DC] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#6E6B65]">Resolution Quality</span>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                            dpiHealth === 'optimal' || dpiHealth === 'good' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            dpiHealth === 'fair' ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-red-50 text-red-700 border border-red-200"
                          )}>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              dpiHealth === 'optimal' || dpiHealth === 'good' ? "bg-emerald-500" :
                              dpiHealth === 'fair' ? "bg-amber-500" : "bg-red-500"
                            )} />
                            {calculatedDpi} DPI · {dpiHealth === 'optimal' ? 'High Quality' : dpiHealth === 'good' ? 'Good' : dpiHealth === 'fair' ? 'Fair' : 'Low Quality'}
                          </span>
                        </div>

                        {/* DPI Meter Bar */}
                        <div className="w-full bg-[#E5E2DC] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-300",
                              dpiHealth === 'optimal' || dpiHealth === 'good' ? "bg-emerald-500" :
                              dpiHealth === 'fair' ? "bg-amber-500" : "bg-red-500"
                            )}
                            style={{ width: `${Math.min(100, (calculatedDpi / 300) * 100)}%` }}
                          />
                        </div>

                        {selected.naturalWidth && (
                          <div className="flex items-center justify-between text-[10px] text-[#8C8880]">
                            <span>Original size:</span>
                            <span className="font-semibold text-[#1A1A12]">{selected.naturalWidth} × {selected.naturalHeight} px</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Application Style (Physical Print & Embroidery Technique) */}
                    <div className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#E5E2DC] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#1A1A12] uppercase tracking-wider">Application Style</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#575C46]/10 text-[#575C46] border border-[#575C46]/20">
                          {selected.printMethod === 'chenille' ? 'Chenille / Fuzzy' :
                           selected.printMethod === 'embroidery' ? 'Sewed / Stitched' :
                           selected.printMethod === 'screen' ? 'Screen Print' :
                           selected.printMethod === 'dtf' ? 'Direct-to-Film' :
                           selected.printMethod === 'vintage' ? 'Discharge' :
                           selected.printMethod === 'vinyl' ? 'Vinyl Cut' : 'DTG Cotton'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: 'chenille', label: 'Chenille / Fuzzy', sub: 'Tactile yarn loops (Image 1)' },
                          { id: 'embroidery', label: 'Sewed / Stitched', sub: '3D raised thread sheen' },
                          { id: 'dtg', label: 'DTG (Water-based)', sub: 'Soft embedded ink' },
                          { id: 'screen', label: 'Screen Print', sub: 'Thick plastisol layer' },
                          { id: 'dtf', label: 'Direct-to-Film', sub: 'High-vibrancy film' },
                          { id: 'vintage', label: 'Vintage Discharge', sub: 'Soft bleached feel' },
                          { id: 'vinyl', label: 'Heat Transfer Vinyl', sub: 'Solid matte rubber' },
                        ].map(m => {
                          const isCur = (selected.printMethod || 'dtg') === m.id
                          return (
                            <button
                              key={m.id}
                              onClick={() => {
                                updateLayer(selected.id, { printMethod: m.id as PrintMethod })
                                setActivePrintMethod(m.id as PrintMethod)
                              }}
                              className={cn(
                                'p-2 rounded-xl border text-left transition-all',
                                isCur
                                  ? 'bg-[#575C46] text-white border-[#575C46] shadow-xs'
                                  : 'bg-white hover:bg-[#FAF9F6] border-[#D5D2CA] text-[#1A1A12] hover:border-[#1A1A12]'
                              )}
                            >
                              <span className={cn('block text-[11px] font-bold leading-tight', isCur ? 'text-white' : 'text-[#1A1A12]')}>
                                {m.label}
                              </span>
                              <span className={cn('block text-[9px] mt-0.5 leading-tight', isCur ? 'text-white/80' : 'text-[#8C8880]')}>
                                {m.sub}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Transform numbers */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-[#8C8880] font-semibold block mb-1">Width (px)</label>
                        <input
                          type="number"
                          value={Math.round(selected.width)}
                          onChange={e => updateLayer(selected.id, { width: +e.target.value })}
                          className="w-full border border-[#D5D2CA] rounded-lg px-2.5 py-1 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#8C8880] font-semibold block mb-1">Height (px)</label>
                        <input
                          type="number"
                          value={Math.round(selected.height)}
                          onChange={e => updateLayer(selected.id, { height: +e.target.value })}
                          className="w-full border border-[#D5D2CA] rounded-lg px-2.5 py-1 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#8C8880] font-semibold block mb-1">Rotation (°)</label>
                        <input
                          type="number"
                          value={Math.round(selected.rotation)}
                          onChange={e => updateLayer(selected.id, { rotation: +e.target.value })}
                          className="w-full border border-[#D5D2CA] rounded-lg px-2.5 py-1 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#8C8880] font-semibold block mb-1">Opacity (%)</label>
                        <input
                          type="number"
                          min={10} max={100}
                          value={Math.round((selected.opacity ?? 1) * 100)}
                          onChange={e => updateLayer(selected.id, { opacity: +e.target.value / 100 })}
                          className="w-full border border-[#D5D2CA] rounded-lg px-2.5 py-1 text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* POD Placement Presets & Precise Alignment */}
                    <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E2DC] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#1A1A12] uppercase tracking-wider">Placement &amp; Alignment</span>
                        <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">Printify Mode</span>
                      </div>

                      {['tshirt', 'sweatshirt', 'jacket', 'hoodie', 'hoodie-zip'].includes(info.type) && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#8C8880] uppercase tracking-wider block">Chest Presets</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => alignLayer('leftChest')}
                              className="p-2 rounded-lg border border-[#D5D2CA] bg-white hover:border-[#1A1A12] hover:shadow-xs text-left transition-all group">
                              <span className="block text-[11px] font-bold text-[#1A1A12] group-hover:text-blue-600">Left Chest</span>
                              <span className="block text-[9px] text-[#8C8880]">Pocket badge (4×4&quot;)</span>
                            </button>
                            <button
                              onClick={() => alignLayer('centerChest')}
                              className="p-2 rounded-lg border border-[#D5D2CA] bg-white hover:border-[#1A1A12] hover:shadow-xs text-left transition-all group">
                              <span className="block text-[11px] font-bold text-[#1A1A12] group-hover:text-blue-600">Center Chest</span>
                              <span className="block text-[9px] text-[#8C8880]">Full front (12×16&quot;)</span>
                            </button>
                            <button
                              onClick={() => alignLayer('rightChest')}
                              className="p-2 rounded-lg border border-[#D5D2CA] bg-white hover:border-[#1A1A12] hover:shadow-xs text-left transition-all group">
                              <span className="block text-[11px] font-bold text-[#1A1A12] group-hover:text-blue-600">Right Chest</span>
                              <span className="block text-[9px] text-[#8C8880]">Right badge (4×4&quot;)</span>
                            </button>
                            <button
                              onClick={() => alignLayer('fit')}
                              className="p-2 rounded-lg border border-[#D5D2CA] bg-white hover:border-[#1A1A12] hover:shadow-xs text-left transition-all group">
                              <span className="block text-[11px] font-bold text-[#1A1A12] group-hover:text-blue-600">Fit Area</span>
                              <span className="block text-[9px] text-[#8C8880]">Scale to bounds</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Precise Alignment Grid */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#8C8880] uppercase tracking-wider block">Align In Area</label>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => alignLayer('left')}
                            className="py-1.5 rounded-lg border border-[#D5D2CA] bg-white hover:border-[#1A1A12] text-[11px] font-medium text-[#5C5A55] hover:text-[#1A1A12] text-center transition-colors">
                            Left
                          </button>
                          <button
                            onClick={() => alignLayer('centerX')}
                            className="py-1.5 rounded-lg border border-[#D5D2CA] bg-white hover:border-[#1A1A12] text-[11px] font-bold text-[#1A1A12] text-center transition-colors">
                            Center H
                          </button>
                          <button
                            onClick={() => alignLayer('right')}
                            className="py-1.5 rounded-lg border border-[#D5D2CA] bg-white hover:border-[#1A1A12] text-[11px] font-medium text-[#5C5A55] hover:text-[#1A1A12] text-center transition-colors">
                            Right
                          </button>
                          <button
                            onClick={() => alignLayer('top')}
                            className="py-1.5 rounded-lg border border-[#D5D2CA] bg-white hover:border-[#1A1A12] text-[11px] font-medium text-[#5C5A55] hover:text-[#1A1A12] text-center transition-colors">
                            Top
                          </button>
                          <button
                            onClick={() => alignLayer('centerY')}
                            className="py-1.5 rounded-lg border border-[#D5D2CA] bg-white hover:border-[#1A1A12] text-[11px] font-bold text-[#1A1A12] text-center transition-colors">
                            Center V
                          </button>
                          <button
                            onClick={() => alignLayer('bottom')}
                            className="py-1.5 rounded-lg border border-[#D5D2CA] bg-white hover:border-[#1A1A12] text-[11px] font-medium text-[#5C5A55] hover:text-[#1A1A12] text-center transition-colors">
                            Bottom
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* 4. Pricing & Profit Margin Calculator */}
              <div className="pt-4 border-t border-[#E5E2DC]">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold text-[#1A1A12] uppercase tracking-wider">Pricing &amp; Profit</h3>
                  <button
                    onClick={() => setShowVariantMatrix(true)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <Table2 size={12} />
                    <span>All variants</span>
                  </button>
                </div>
                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E2DC] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6E6B65]">Base production cost</span>
                    <span className="font-semibold text-[#1A1A12]">ETB {info.baseCost}</span>
                  </div>
                  {hasBack && (
                    <div className="flex justify-between text-blue-700">
                      <span>+ Back location print</span>
                      <span className="font-semibold">ETB {backSurcharge}</span>
                    </div>
                  )}
                  {hasSleeve && (
                    <div className="flex justify-between text-blue-700">
                      <span>+ Sleeve location print</span>
                      <span className="font-semibold">ETB {sleeveSurcharge}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-1 border-t border-[#E5E2DC]">
                    <span className="text-[#1A1A12]">Total production cost</span>
                    <span className="text-[#1A1A12]">ETB {totalProductionCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E6B65]">Suggested retail</span>
                    <span className="font-bold text-[#1A1A12]">ETB {suggestedRetail}</span>
                  </div>
                  <div className="border-t border-[#E5E2DC] pt-2 flex justify-between text-emerald-600 font-extrabold text-sm">
                    <span>Estimated profit ({marginPct}%)</span>
                    <span>ETB {profit}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          <div className="flex-1" />

          {/* Sticky Bottom Save Button (Printify Signature Lime Green matching Image 1) */}
          <div className="p-4 border-t border-[#E5E2DC] bg-white sticky bottom-0">
            <button
              onClick={handleSave}
              disabled={layers.length === 0}
              className={cn(
                'w-full py-3.5 rounded-xl text-[14px] font-black transition-all shadow-xs flex items-center justify-center gap-2',
                layers.length === 0
                  ? 'bg-[#E5E2DC] text-[#9E9B95] cursor-not-allowed'
                  : 'bg-[#B5E853] hover:bg-[#A3E03A] text-[#1A1A12] active:scale-[0.99]'
              )}>
              {saved ? <Check size={16} strokeWidth={2.5} /> : null}
              {saved ? 'Saved to Your Products' : 'Save product'}
            </button>
          </div>
        </aside>

      </div>

      {/* ── Modal: Variant Matrix & Sizing Guide ─────────────────────────── */}
      {showVariantMatrix && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-[#E5E2DC] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E5E2DC] flex items-center justify-between shrink-0 bg-[#FAF9F6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E5E2DC] flex items-center justify-center text-[#1A1A12] shadow-xs">
                  <Table2 size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1A1A12]">{info.name} · Variants & Sizing</h2>
                  <p className="text-xs text-[#8C8880]">{info.brand} · {info.sku} · Direct-to-Garment</p>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center gap-1 bg-[#EFECE6] p-1 rounded-xl">
                <button
                  onClick={() => setVariantModalTab('matrix')}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
                    variantModalTab === 'matrix' ? 'bg-white text-[#1A1A12] shadow-xs' : 'text-[#6E6B65] hover:text-[#1A1A12]'
                  )}>
                  Variant Pricing Matrix
                </button>
                <button
                  onClick={() => setVariantModalTab('sizing')}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
                    variantModalTab === 'sizing' ? 'bg-white text-[#1A1A12] shadow-xs' : 'text-[#6E6B65] hover:text-[#1A1A12]'
                  )}>
                  Size Guide & Specs
                </button>
              </div>

              <button
                onClick={() => setShowVariantMatrix(false)}
                className="w-8 h-8 rounded-full hover:bg-[#E5E2DC] flex items-center justify-center text-[#6E6B65] hover:text-[#1A1A12] transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {variantModalTab === 'matrix' ? (
                <div className="space-y-4">
                  {/* Bulk Markup Bar */}
                  <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E2DC] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1A1A12]">Set uniform profit markup:</span>
                      {[30, 40, 50, 60, 75].map(pct => (
                        <button
                          key={pct}
                          onClick={() => setVariantMarkupPct(pct)}
                          className={cn(
                            'px-2.5 py-1 rounded-lg text-xs font-bold transition-all border',
                            variantMarkupPct === pct
                              ? 'bg-[#1A1A12] text-white border-[#1A1A12]'
                              : 'bg-white text-[#6E6B65] border-[#D5D2CA] hover:border-[#1A1A12]'
                          )}>
                          +{pct}%
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-[#8C8880]">Active Variants: </span>
                        <span className="font-bold text-[#1A1A12]">{info.colors.length * 5}</span>
                      </div>
                      <div>
                        <span className="text-[#8C8880]">Production Cost: </span>
                        <span className="font-bold text-[#1A1A12]">ETB {totalProductionCost}</span>
                      </div>
                      <div>
                        <span className="text-[#8C8880]">Est. Margin: </span>
                        <span className="font-bold text-emerald-600">{Math.round((variantMarkupPct / (100 + variantMarkupPct)) * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Matrix Table */}
                  <div className="border border-[#E5E2DC] rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF9F6] text-[#6E6B65] font-semibold border-b border-[#E5E2DC]">
                        <tr>
                          <th className="py-3 px-4">Color</th>
                          <th className="py-3 px-4">Size</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Production</th>
                          <th className="py-3 px-4">Retail Price</th>
                          <th className="py-3 px-4">Profit</th>
                          <th className="py-3 px-4 text-right">Margin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E2DC]">
                        {info.colors.flatMap(color =>
                          ['S', 'M', 'L', 'XL', '2XL'].map(size => {
                            const unitRetail = Math.round(totalProductionCost * (1 + variantMarkupPct / 100))
                            const unitProfit = unitRetail - totalProductionCost
                            const unitMargin = Math.round((unitProfit / unitRetail) * 100)
                            return (
                              <tr key={`${color.hex}-${size}`} className="hover:bg-[#FAF9F6] transition-colors">
                                <td className="py-2.5 px-4 flex items-center gap-2">
                                  <span
                                    className="w-4 h-4 rounded-full border border-black/10 inline-block shrink-0 shadow-2xs"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  <span className="font-semibold text-[#1A1A12]">{color.name}</span>
                                </td>
                                <td className="py-2.5 px-4 font-bold text-[#1A1A12]">{size}</td>
                                <td className="py-2.5 px-4">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    In Stock
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 text-[#6E6B65]">ETB {totalProductionCost}</td>
                                <td className="py-2.5 px-4 font-bold text-[#1A1A12]">ETB {unitRetail}</td>
                                <td className="py-2.5 px-4 font-extrabold text-emerald-600">ETB {unitProfit}</td>
                                <td className="py-2.5 px-4 text-right font-bold text-[#1A1A12]">{unitMargin}%</td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Sizing Controls */}
                  <div className="flex items-center justify-between bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E2DC]">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A12]">Garment Sizing Specifications</h3>
                      <p className="text-xs text-[#8C8880]">Manufacturer tolerance ± 1 inch / 2.5 cm</p>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D5D2CA]">
                      <button
                        onClick={() => setSizeUnit('in')}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                          sizeUnit === 'in' ? 'bg-[#1A1A12] text-white shadow-xs' : 'text-[#6E6B65] hover:text-[#1A1A12]'
                        )}>
                        Inches (in)
                      </button>
                      <button
                        onClick={() => setSizeUnit('cm')}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                          sizeUnit === 'cm' ? 'bg-[#1A1A12] text-white shadow-xs' : 'text-[#6E6B65] hover:text-[#1A1A12]'
                        )}>
                        Centimeters (cm)
                      </button>
                    </div>
                  </div>

                  {/* Sizing Chart Table */}
                  <div className="border border-[#E5E2DC] rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF9F6] text-[#6E6B65] font-semibold border-b border-[#E5E2DC]">
                        <tr>
                          <th className="py-3 px-4">Size</th>
                          <th className="py-3 px-4">A: Chest Width</th>
                          <th className="py-3 px-4">B: Body Length</th>
                          <th className="py-3 px-4">C: Sleeve Length</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E2DC]">
                        {[
                          { sz: 'S',   wIn: '19.5"', lIn: '27.2"', sIn: '8.5"', wCm: '49.5 cm', lCm: '69.0 cm', sCm: '21.5 cm' },
                          { sz: 'M',   wIn: '20.5"', lIn: '28.3"', sIn: '8.7"', wCm: '52.0 cm', lCm: '72.0 cm', sCm: '22.0 cm' },
                          { sz: 'L',   wIn: '21.7"', lIn: '29.1"', sIn: '9.1"', wCm: '55.0 cm', lCm: '74.0 cm', sCm: '23.0 cm' },
                          { sz: 'XL',  wIn: '22.8"', lIn: '29.9"', sIn: '9.3"', wCm: '58.0 cm', lCm: '76.0 cm', sCm: '23.5 cm' },
                          { sz: '2XL', wIn: '24.0"', lIn: '30.7"', sIn: '9.6"', wCm: '61.0 cm', lCm: '78.0 cm', sCm: '24.5 cm' },
                        ].map(row => (
                          <tr key={row.sz} className="hover:bg-[#FAF9F6] transition-colors">
                            <td className="py-3 px-4 font-bold text-[#1A1A12]">{row.sz}</td>
                            <td className="py-3 px-4 text-[#5C5A55] font-medium">{sizeUnit === 'in' ? row.wIn : row.wCm}</td>
                            <td className="py-3 px-4 text-[#5C5A55] font-medium">{sizeUnit === 'in' ? row.lIn : row.lCm}</td>
                            <td className="py-3 px-4 text-[#5C5A55] font-medium">{sizeUnit === 'in' ? row.sIn : row.sCm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Garment Diagram and Material Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E2DC] space-y-2 text-xs">
                      <h4 className="font-bold text-[#1A1A12] flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        <span>Fabric & Eco Certifications</span>
                      </h4>
                      <p className="text-[#6E6B65]">100% Organic ring-spun combed cotton, single jersey, fabric washed.</p>
                      <ul className="list-disc list-inside space-y-1 text-[#6E6B65] text-[11px] pt-1">
                        <li>Weight: 180 GSM (5.3 oz/yd²)</li>
                        <li>OEKO-TEX® Standard 100 Certified</li>
                        <li>GOTS (Global Organic Textile Standard)</li>
                        <li>Fair Wear Leader & PETA-Approved Vegan</li>
                      </ul>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E2DC] space-y-2 text-xs">
                      <h4 className="font-bold text-[#1A1A12]">Care & Laundering</h4>
                      <p className="text-[#6E6B65]">To preserve graphic vibrancy across 50+ wash cycles:</p>
                      <ul className="list-disc list-inside space-y-1 text-[#6E6B65] text-[11px] pt-1">
                        <li>Wash inside out at 30°C (86°F) or cold</li>
                        <li>Do not tumble dry; line dry recommended</li>
                        <li>Do not iron directly on printed graphics</li>
                        <li>Do not bleach or dry clean</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E5E2DC] bg-[#FAF9F6] flex items-center justify-between shrink-0">
              <span className="text-xs text-[#8C8880]">All prices in Ethiopian Birr (ETB) inclusive of VAT</span>
              <button
                onClick={() => setShowVariantMatrix(false)}
                className="btn-primary text-xs py-2 px-6">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
