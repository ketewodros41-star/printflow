'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Heart, ChevronRight, Info, Check, Star, ZoomIn, Search, SlidersHorizontal, ArrowUpRight, ShieldCheck, Truck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCKUP_MAP, TShirtMockup } from '@/components/mockups/ProductMockups'

// ── Realistic Photography Scenes for Products ─────────────────────────────────
interface ScenePhoto {
  id: string
  label: string
  photoId: string
  isVector?: boolean
}

const PRODUCT_SCENES: Record<string, ScenePhoto[]> = {
  'tshirt-classic': [
    { id: 'model-front',  label: 'Model Front',     photoId: 'photo-1521572267360-ee0c2909d518' },
    { id: 'flat-front',   label: 'Flat Lay Front',  photoId: 'photo-1581655353564-df123a1eb820' },
    { id: 'flat-back',    label: 'Flat Lay Back',   photoId: 'photo-1618354691373-d851c5c3a990' },
    { id: 'folded',       label: 'Folded',          photoId: 'photo-1523381210434-271e8be1f52b' },
    { id: 'lifestyle',    label: 'Lifestyle',       photoId: 'photo-1503342217505-b0a15ec3261c' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'tshirt-premium': [
    { id: 'model-long',   label: 'Model Front',     photoId: 'photo-1503341455253-b2e723bb3dbb' },
    { id: 'flat-front',   label: 'Flat Lay',        photoId: 'photo-1581655353564-df123a1eb820' },
    { id: 'folded',       label: 'Folded',          photoId: 'photo-1523381210434-271e8be1f52b' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'sweatshirt-crew': [
    { id: 'model-crew',   label: 'Model Front',     photoId: 'photo-1556905055-8f358a7a47b2' },
    { id: 'folded',       label: 'Folded Fleece',   photoId: 'photo-1614252369475-531eba835eb1' },
    { id: 'lifestyle',    label: 'Flat Lay',        photoId: 'photo-1489987707025-afc232f7ea0f' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'jacket-bomber': [
    { id: 'model-jacket', label: 'Model Outerwear', photoId: 'photo-1551028719-00167b16eac5' },
    { id: 'lifestyle',    label: 'Styling',         photoId: 'photo-1506794778202-cad84cf45f1d' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'hoodie-zip': [
    { id: 'model-zip',    label: 'Model Full-Zip',  photoId: 'photo-1509967419530-da38b4704bc6' },
    { id: 'folded',       label: 'Folded Hoodie',   photoId: 'photo-1614252369475-531eba835eb1' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'hoodie-premium': [
    { id: 'model-hoodie', label: 'Model Pullover',  photoId: 'photo-1614252369475-531eba835eb1' },
    { id: 'lifestyle',    label: 'Lifestyle',       photoId: 'photo-1509967419530-da38b4704bc6' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'mug-classic': [
    { id: 'mug-studio',   label: 'Ceramic Studio',  photoId: 'photo-1514228742587-6b1558fcca3d' },
    { id: 'mug-table',    label: 'Tabletop',        photoId: 'photo-1572119865084-43c285814d63' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'tote-standard': [
    { id: 'tote-studio',  label: 'Studio Canvas',   photoId: 'photo-1584917865442-de89df76afd3' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'tank-muscle': [
    { id: 'model-tank',   label: 'Model Torso',     photoId: 'photo-1503342217505-b0a15ec3261c' },
    { id: 'flat-front',   label: 'Muscle Tank Flat',photoId: 'photo-1521572267360-ee0c2909d518' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'cap-snapback': [
    { id: 'flat-front',   label: 'Crown Front',     photoId: 'photo-1588850561407-ed78c282e89b' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'jacket-letterman': [
    { id: 'model-jacket', label: 'Varsity Model',   photoId: 'photo-1551028719-00167b16eac5' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'tshirt-staple': [
    { id: 'model-front',  label: 'Model Front',     photoId: 'photo-1521572267360-ee0c2909d518' },
    { id: 'flat-front',   label: 'Flat Lay Front',  photoId: 'photo-1581655353564-df123a1eb820' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'tshirt-comfort': [
    { id: 'model-front',  label: 'Garment-Dyed Model', photoId: 'photo-1521572267360-ee0c2909d518' },
    { id: 'flat-front',   label: 'Flat Lay',        photoId: 'photo-1581655353564-df123a1eb820' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'tshirt-longsleeve': [
    { id: 'model-long',   label: 'Model Long Sleeve', photoId: 'photo-1503341455253-b2e723bb3dbb' },
    { id: 'flat-front',   label: 'Flat Lay',        photoId: 'photo-1581655353564-df123a1eb820' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'camo-longsleeve': [
    { id: 'model-camo',   label: 'Performance Model', photoId: 'photo-1503341455253-b2e723bb3dbb' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'shirt-daybreak': [
    { id: 'model-uv',     label: 'Daybreak UV Model', photoId: 'photo-1503342217505-b0a15ec3261c' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'shirt-oxford': [
    { id: 'model-oxford', label: 'Oxford Classic',  photoId: 'photo-1503341455253-b2e723bb3dbb' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'blanket-plush': [
    { id: 'plush-cozy',   label: 'Plush Fleece Bed',photoId: 'photo-1584100936595-c0654b55a2e2' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'pillow-polyester': [
    { id: 'pillow-sofa',  label: 'Living Room Pillow', photoId: 'photo-1584100936595-c0654b55a2e2' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'hat-dad': [
    { id: 'dad-hat',      label: 'Cotton Dad Hat',  photoId: 'photo-1588850561407-ed78c282e89b' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
  'mug-black': [
    { id: 'mug-dark',     label: 'Black Ceramic Mug', photoId: 'photo-1514228742587-6b1558fcca3d' },
    { id: 'blueprint',    label: 'Vector Mockup',   photoId: '', isVector: true },
  ],
}

function getPhotoUrl(photoId: string, size = 900) {
  return `https://images.unsplash.com/${photoId}?w=${size}&auto=format&fit=crop&q=85`
}

// ── Full Product Data Catalog ────────────────────────────────────────────────
interface ProductDef {
  name: string
  brand: string
  sku: string
  type: string
  category: string
  breadcrumb: string[]
  costRange: string
  premiumCost: string
  shippingFrom: string
  deliveryDays: string
  printAreaSize: string
  rating: number
  reviewsCount: number
  bestseller?: boolean
  personalization?: boolean
  colors: { name: string; hex: string }[]
  sizes: string[]
  printAreas: string[]
  method: { name: string; tag: string; desc: string; features: string[] }
  keyFeatures: { icon: string; title: string; desc: string }[]
  sizeGuide: { headers: string[]; rows: { label: string; values: string[] }[] }
  providers: {
    name: string
    country: string
    flag: string
    rating: number
    productionDays: string
    price: string
    premiumPrice: string
    shipping: string
    sizes: string
    colorsCount: number
    printMethod: string
    badge?: string
  }[]
}

const PRODUCTS: Record<string, ProductDef> = {
  'tshirt-classic': {
    name: 'Adult Staple Tee',
    brand: 'AS Colour',
    sku: '5001',
    type: 'tshirt',
    category: "Men's Clothing",
    breadcrumb: ['Catalog', "Men's Clothing", 'T-shirts'],
    costRange: 'ETB 320',
    premiumCost: 'ETB 256',
    shippingFrom: 'ETB 45',
    deliveryDays: '1.9',
    rating: 4.9,
    reviewsCount: 3840,
    bestseller: true,
    printAreaSize: '3600 × 4110 px',
    colors: [
      { name: 'White',      hex: '#FFFFFF' },
      { name: 'Black',      hex: '#1A1A12' },
      { name: 'Light Grey', hex: '#C8C5C0' },
      { name: 'Charcoal',   hex: '#4A4A48' },
      { name: 'Navy',       hex: '#1B2A4A' },
      { name: 'Olive Green',hex: '#4A5E35' },
      { name: 'Dusty Pink', hex: '#D4A0A0' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Sleeve left', 'Sleeve right', 'Inner neck label'],
    method: {
      name: 'DTG (Direct-to-garment)',
      tag: 'Soft Feel & High Vibrancy',
      desc: 'Industry standard digital textile printing that binds eco-friendly inks directly into cotton fibers.',
      features: ['Ultra-soft print finish', 'Long-lasting wash durability', 'Photo-real detail fidelity'],
    },
    keyFeatures: [
      { icon: '🌿', title: '100% Combed ring-spun cotton', desc: 'Pre-shrunk 180 gsm cotton for a super soft hand feel and consistent sizing.' },
      { icon: '🧵', title: 'Twin needle topstitch & side seamed', desc: 'Preserves the shirt shape wash after wash without twisting or warping.' },
      { icon: '🎯', title: 'Multi-location POD placements', desc: 'Full support for Left Chest, Center Graphic, Back, and Sleeve prints.' },
      { icon: '🧣', title: '1×1 Ribbed collar with shoulder tape', desc: 'Snug fit around the neckline that bounces back into shape.' },
      { icon: '🏷️', title: 'Tear-away neck label', desc: 'Ideal for custom brand relabeling with your store logo.' },
      { icon: '👕', title: 'Modern regular fit', desc: 'Flattering unisex drape suited for everyday wear and streetwear drops.' },
    ],
    sizeGuide: {
      headers: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      rows: [
        { label: 'Chest width, in', values: ['18.5', '20.5', '22.2', '24.0', '26.0', '28.0'] },
        { label: 'Body length, in',  values: ['28.0', '29.5', '31.0', '32.2', '33.5', '34.5'] },
        { label: 'Sleeve length, in', values: ['8.2', '8.6', '9.0', '9.4', '9.8', '10.2'] },
      ],
    },
    providers: [
      {
        name: 'PrintFlow Choice (Recommended)',
        country: 'Addis Ababa',
        flag: '🇪🇹',
        rating: 9.8,
        productionDays: '1.8 business days',
        price: 'ETB 320',
        premiumPrice: 'ETB 256',
        shipping: 'ETB 45',
        sizes: 'XS – 3XL',
        colorsCount: 35,
        printMethod: 'DTG Full Color',
        badge: 'Lowest Price & Highest Rating',
      },
      {
        name: 'SwiftPrint Addis Hub',
        country: 'Bole Sub-City',
        flag: '🇪🇹',
        rating: 9.6,
        productionDays: '2.0 business days',
        price: 'ETB 335',
        premiumPrice: 'ETB 268',
        shipping: 'ETB 45',
        sizes: 'S – 2XL',
        colorsCount: 24,
        printMethod: 'DTG & Film',
      },
      {
        name: 'Nile Apparel Works',
        country: 'Hawassa Industrial Park',
        flag: '🇪🇹',
        rating: 9.4,
        productionDays: '2.3 business days',
        price: 'ETB 310',
        premiumPrice: 'ETB 248',
        shipping: 'ETB 50',
        sizes: 'XS – 2XL',
        colorsCount: 18,
        printMethod: 'Screen & DTG',
      },
    ],
  },

  'sweatshirt-crew': {
    name: 'Unisex Crewneck Sweatshirt (No Hood)',
    brand: 'Stanley Stella',
    sku: 'STSU823',
    type: 'sweatshirt',
    category: "Men's Clothing",
    breadcrumb: ['Catalog', "Men's Clothing", 'Sweatshirts'],
    costRange: 'ETB 540',
    premiumCost: 'ETB 432',
    shippingFrom: 'ETB 55',
    deliveryDays: '2.1',
    rating: 4.8,
    reviewsCount: 1420,
    bestseller: true,
    printAreaSize: '4000 × 4800 px',
    colors: [
      { name: 'Heather Grey', hex: '#C4B5A5' },
      { name: 'Black',        hex: '#1A1A12' },
      { name: 'Navy',         hex: '#1B2A4A' },
      { name: 'Forest Green', hex: '#2D4A2D' },
      { name: 'Burgundy',     hex: '#5A1827' },
      { name: 'Sand',         hex: '#D5C7B2' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Back collar', 'Sleeve left', 'Sleeve right'],
    method: {
      name: 'DTG & High-Density Embroidery',
      tag: 'Collegiate Fleece',
      desc: 'Superb soft-hand feel with fleece interior, triangular collar ribbing, and precision multi-location print placement.',
      features: ['2×2 Ribbed Collar', 'Triangular V-Stitch Insert', 'Multi-location Placement', 'Fleece interior'],
    },
    keyFeatures: [
      { icon: '🧵', title: '85% Organic cotton, 15% recycled polyester', desc: 'Pre-shrunk ring-spun combed fleece for maximum shape retention and zero pill.' },
      { icon: '📐', title: 'Authentic collegiate Dorito V-stitch', desc: 'Ribbed crewneck collar with reinforced triangular V-stitch insert.' },
      { icon: '🪡', title: 'Thick elastic ribbed cuffs and hem', desc: 'Heavyweight ribbed waistband and cuffs that never sag or roll over.' },
      { icon: '🎯', title: 'Multi-location print areas', desc: 'Left chest badge, center graphic, back statement, and collar tag.' },
    ],
    sizeGuide: {
      headers: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      rows: [
        { label: 'Chest width, in', values: ['20.0', '21.5', '23.0', '24.5', '26.0', '27.5'] },
        { label: 'Length, in',      values: ['27.0', '28.0', '29.0', '30.0', '31.0', '32.0'] },
      ],
    },
    providers: [
      {
        name: 'PrintFlow Choice (Recommended)',
        country: 'Addis Ababa',
        flag: '🇪🇹',
        rating: 9.7,
        productionDays: '2.1 business days',
        price: 'ETB 540',
        premiumPrice: 'ETB 432',
        shipping: 'ETB 55',
        sizes: 'XS – 2XL',
        colorsCount: 6,
        printMethod: 'DTG & Fleece Ink',
        badge: 'Top Choice Provider',
      },
      {
        name: 'District Streetwear Co.',
        country: 'Addis Ababa',
        flag: '🇪🇹',
        rating: 9.5,
        productionDays: '2.4 business days',
        price: 'ETB 560',
        premiumPrice: 'ETB 448',
        shipping: 'ETB 55',
        sizes: 'S – 2XL',
        colorsCount: 5,
        printMethod: 'DTG Print',
      },
    ],
  },

  'jacket-bomber': {
    name: 'Classic Streetwear Bomber Jacket',
    brand: 'Urban Edge',
    sku: 'JKT001',
    type: 'jacket',
    category: 'Outerwear',
    breadcrumb: ['Catalog', 'Outerwear', 'Jackets'],
    costRange: 'ETB 890',
    premiumCost: 'ETB 712',
    shippingFrom: 'ETB 65',
    deliveryDays: '2.4',
    rating: 4.9,
    reviewsCount: 890,
    personalization: true,
    printAreaSize: '3800 × 4400 px',
    colors: [
      { name: 'Olive Green', hex: '#2D3A2D' },
      { name: 'Stealth Black', hex: '#1A1A12' },
      { name: 'Airforce Navy', hex: '#1B243B' },
      { name: 'Burgundy', hex: '#4A1D24' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    printAreas: ['Left chest', 'Right chest', 'Back', 'Sleeve left'],
    method: {
      name: 'High-Definition Screen Print & DTF',
      tag: 'Weatherproof Outerwear',
      desc: 'Engineered for weatherproof nylon canvas with reinforced metallic zipper and utility pocket tags.',
      features: ['Heavyweight Zipper Teeth', 'Snap Welt Pockets', 'MA-1 Utility Sleeve Pocket', 'Windproof Shell'],
    },
    keyFeatures: [
      { icon: '🧥', title: 'Durable nylon flight shell', desc: 'Water-resistant satin twill outer shell with diamond-quilted thermal lining.' },
      { icon: '⚡', title: 'Heavy-duty center metal zipper', desc: 'Individually molded antique silver zipper teeth with pull slider.' },
      { icon: '✈️', title: 'MA-1 Utility sleeve pocket', desc: 'Left arm zippered flight pocket with removable red high-visibility tag.' },
    ],
    sizeGuide: {
      headers: ['S', 'M', 'L', 'XL', '2XL'],
      rows: [
        { label: 'Chest, in',  values: ['42', '44', '46', '48', '50'] },
        { label: 'Length, in', values: ['26.5', '27.5', '28.5', '29.5', '30.5'] },
      ],
    },
    providers: [
      {
        name: 'PrintFlow Choice (Recommended)',
        country: 'Addis Ababa',
        flag: '🇪🇹',
        rating: 9.8,
        productionDays: '2.4 business days',
        price: 'ETB 890',
        premiumPrice: 'ETB 712',
        shipping: 'ETB 65',
        sizes: 'S – 2XL',
        colorsCount: 4,
        printMethod: 'Screen & DTF',
        badge: 'Outerwear Specialist',
      },
    ],
  },

  'hoodie-zip': {
    name: 'Heavy Blend Full-Zip Hoodie',
    brand: 'Gildan',
    sku: 'GI18600',
    type: 'hoodie-zip',
    category: "Men's Clothing",
    breadcrumb: ['Catalog', "Men's Clothing", 'Hoodies'],
    costRange: 'ETB 620',
    premiumCost: 'ETB 496',
    shippingFrom: 'ETB 55',
    deliveryDays: '2.2',
    rating: 4.7,
    reviewsCount: 2150,
    bestseller: true,
    printAreaSize: '3600 × 4200 px',
    colors: [
      { name: 'Forest Green', hex: '#2D4A2D' },
      { name: 'Black',        hex: '#1A1A12' },
      { name: 'Heather Grey', hex: '#9A9A8E' },
      { name: 'Navy',         hex: '#1B2A4A' },
      { name: 'Maroon',       hex: '#5A1827' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    printAreas: ['Left chest', 'Right chest', 'Back', 'Back collar'],
    method: {
      name: 'DTG Print with Split Zipper Layout',
      tag: 'Split Zip Compatible',
      desc: 'Formulated for split zip apparel with calibrated left and right chest badge alignment.',
      features: ['YKK Metal Zipper', 'Split Kangaroo Pockets', 'Drawstring Hood with Metal Aglets'],
    },
    keyFeatures: [
      { icon: '🧥', title: 'Split pouch pocket design', desc: 'Separated twin kangaroo handwarmer pockets flanking the center zipper.' },
      { icon: '⚡', title: 'Exposed metal zipper', desc: 'Durable nylon-coil and metal teeth zipper from waist to chin.' },
      { icon: '🧵', title: 'Double-needle stitched fleece', desc: '50% cotton, 50% polyester fleece for optimal warmth.' },
    ],
    sizeGuide: {
      headers: ['S', 'M', 'L', 'XL', '2XL'],
      rows: [
        { label: 'Chest, in',  values: ['40', '44', '48', '52', '56'] },
        { label: 'Length, in', values: ['27', '28', '29', '30', '31'] },
      ],
    },
    providers: [
      {
        name: 'PrintFlow Choice (Recommended)',
        country: 'Addis Ababa',
        flag: '🇪🇹',
        rating: 9.7,
        productionDays: '2.2 business days',
        price: 'ETB 620',
        premiumPrice: 'ETB 496',
        shipping: 'ETB 55',
        sizes: 'S – 2XL',
        colorsCount: 5,
        printMethod: 'DTG Print',
        badge: 'Best Value',
      },
    ],
  },

  'hoodie-premium': {
    name: 'Unisex Premium Pullover Hoodie',
    brand: 'Stanley Stella',
    sku: 'STSU812',
    type: 'hoodie',
    category: "Men's Clothing",
    breadcrumb: ['Catalog', "Men's Clothing", 'Hoodies'],
    costRange: 'ETB 520',
    premiumCost: 'ETB 416',
    shippingFrom: 'ETB 55',
    deliveryDays: '2.3',
    rating: 4.9,
    reviewsCount: 3100,
    bestseller: true,
    printAreaSize: '4000 × 4800 px',
    colors: [
      { name: 'Black',  hex: '#1A1A12' },
      { name: 'Grey',   hex: '#9A9A8E' },
      { name: 'Navy',   hex: '#1B2A4A' },
      { name: 'Olive',  hex: '#4A5E35' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Sleeve left', 'Sleeve right'],
    method: {
      name: 'DTG (Direct-to-garment)',
      tag: 'Soft Feel',
      desc: 'High detail prints with smooth ink penetration and cozy kangaroo pocket.',
      features: ['Brushed fleece interior', 'Metal aglets on drawstrings', 'Reinforced pouch'],
    },
    keyFeatures: [
      { icon: '🌿', title: 'Organic cotton blend', desc: '85% organic cotton, 15% recycled polyester for a luxurious feel.' },
      { icon: '🧵', title: 'Brushed fleece interior', desc: 'Warm, cozy interior with a soft brushed finish.' },
    ],
    sizeGuide: {
      headers: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      rows: [
        { label: 'Chest, in',  values: ['36', '38', '40', '42', '44', '46'] },
        { label: 'Length, in', values: ['25', '26', '27', '28', '29', '30'] },
      ],
    },
    providers: [
      {
        name: 'PrintFlow Choice',
        country: 'Addis Ababa',
        flag: '🇪🇹',
        rating: 9.8,
        productionDays: '2.3 business days',
        price: 'ETB 520',
        premiumPrice: 'ETB 416',
        shipping: 'ETB 55',
        sizes: 'XS – 2XL',
        colorsCount: 4,
        printMethod: 'DTG Print',
        badge: 'Recommended',
      },
    ],
  },

  'mug-classic': {
    name: 'Classic Ceramic Mug 11oz',
    brand: 'Generic brand',
    sku: 'MUG001',
    type: 'mug',
    category: 'Home & Living',
    breadcrumb: ['Catalog', 'Home & Living', 'Drinkware'],
    costRange: 'ETB 180',
    premiumCost: 'ETB 144',
    shippingFrom: 'ETB 35',
    deliveryDays: '1.8',
    rating: 4.8,
    reviewsCount: 1850,
    bestseller: true,
    printAreaSize: '8808 × 3006 px',
    colors: [
      { name: 'Glossy White', hex: '#FFFFFF' },
      { name: 'Matte Black',  hex: '#1A1A12' },
    ],
    sizes: ['11 oz'],
    printAreas: ['Wrap', 'Left side', 'Right side'],
    method: {
      name: 'Sublimation Printing',
      tag: 'Vivid & Dishwasher Safe',
      desc: 'Heat-activated dyes penetrate the ceramic polymer glaze for scratch-resistant color vibrancy.',
      features: ['360° Wrap Around Print', 'Microwave & Dishwasher Safe', 'High-Gloss Glaze'],
    },
    keyFeatures: [
      { icon: '☕', title: 'Durable ceramic build', desc: 'Resistant to chipping with sturdy ergonomic C-handle.' },
      { icon: '🎨', title: 'Full wrap sublimation', desc: 'High resolution photographic printing edge-to-edge.' },
    ],
    sizeGuide: {
      headers: ['11 oz'],
      rows: [
        { label: 'Height, in', values: ['3.75'] },
        { label: 'Diameter, in', values: ['3.25'] },
      ],
    },
    providers: [
      {
        name: 'PrintFlow Choice',
        country: 'Addis Ababa',
        flag: '🇪🇹',
        rating: 9.7,
        productionDays: '1.8 business days',
        price: 'ETB 180',
        premiumPrice: 'ETB 144',
        shipping: 'ETB 35',
        sizes: '11 oz',
        colorsCount: 2,
        printMethod: 'Sublimation',
      },
    ],
  },
}

// ── Complete Catalog Products Mapping ──────────────────────────────────────────
PRODUCTS['tshirt-staple'] = {
  ...PRODUCTS['tshirt-classic'],
  name: 'Adult Staple Tee',
  brand: 'AS Colour · 5001',
  sku: '5001',
  costRange: 'ETB 320',
  premiumCost: 'ETB 256',
  colors: [
    { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1A1A12' },
    { name: 'Navy', hex: '#1B2A4A' }, { name: 'Coal', hex: '#373435' },
    { name: 'Forest', hex: '#2E4A2E' }, { name: 'Clay', hex: '#B86851' },
  ],
}

PRODUCTS['tshirt-premium'] = {
  ...PRODUCTS['tshirt-classic'],
  name: 'Unisex Premium Cotton Tee',
  brand: 'Gildan · G64000',
  sku: 'G64000',
  costRange: 'ETB 280',
  premiumCost: 'ETB 224',
  colors: [
    { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1A1A12' },
    { name: 'Ash Grey', hex: '#C8C5C0' }, { name: 'Forest Green', hex: '#2E4A2E' },
    { name: 'Royal Navy', hex: '#1B2A4A' },
  ],
}

PRODUCTS['tshirt-comfort'] = {
  ...PRODUCTS['tshirt-classic'],
  name: 'Comfort Colors 1717 Garment-Dyed Tee',
  brand: 'Comfort Colors · 1717',
  sku: 'CC1717',
  costRange: 'ETB 340',
  premiumCost: 'ETB 272',
  colors: [
    { name: 'Pepper', hex: '#373435' }, { name: 'White', hex: '#FFFFFF' },
    { name: 'Chambray', hex: '#7799B5' }, { name: 'Seafoam', hex: '#8DB8A7' },
    { name: 'Terracotta', hex: '#B86851' }, { name: 'Butter', hex: '#F0E2A8' },
  ],
}

PRODUCTS['tshirt-longsleeve'] = {
  ...PRODUCTS['tshirt-classic'],
  name: 'Unisex Ultra Cotton Long Sleeve Tee',
  brand: 'Gildan · 2400',
  sku: '2400',
  costRange: 'ETB 340',
  premiumCost: 'ETB 272',
  printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back', 'Sleeve left', 'Sleeve right'],
  colors: [
    { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1A1A12' },
    { name: 'Navy', hex: '#1B2A4A' }, { name: 'Sport Grey', hex: '#C8C5C0' },
    { name: 'Red', hex: '#C62828' },
  ],
}

PRODUCTS['camo-longsleeve'] = {
  ...PRODUCTS['tshirt-classic'],
  name: 'Performance Long Sleeve Tee',
  brand: 'Russell Outdoors™ · RU150LS',
  sku: 'RU150LS',
  costRange: 'ETB 440',
  premiumCost: 'ETB 352',
  colors: [
    { name: 'Woodland Camo', hex: '#4A5240' }, { name: 'Black', hex: '#1A1A12' },
    { name: 'Olive', hex: '#4A5E35' },
  ],
}

PRODUCTS['shirt-daybreak'] = {
  ...PRODUCTS['tshirt-classic'],
  name: "Women's Long Sleeve UV Daybreak Shirt",
  brand: 'Port Authority · LW960',
  sku: 'LW960',
  costRange: 'ETB 490',
  premiumCost: 'ETB 392',
  category: "Women's Clothing",
  breadcrumb: ['Catalog', "Women's Clothing", 'Long Sleeve'],
  colors: [
    { name: 'Sky Blue', hex: '#7799B5' }, { name: 'White', hex: '#FFFFFF' },
    { name: 'Soft Coral', hex: '#B86851' },
  ],
}

PRODUCTS['shirt-oxford'] = {
  ...PRODUCTS['tshirt-classic'],
  name: "Women's Long Sleeve Modern Oxford Shirt",
  brand: 'Mercer+Mettle™ · MM2003',
  sku: 'MM2003',
  costRange: 'ETB 475',
  premiumCost: 'ETB 380',
  category: "Women's Clothing",
  breadcrumb: ['Catalog', "Women's Clothing", 'Shirts'],
  colors: [
    { name: 'Oxford Blue', hex: '#1B2A4A' }, { name: 'White', hex: '#FFFFFF' },
    { name: 'Light French Grey', hex: '#C8C5C0' },
  ],
}

PRODUCTS['tank-muscle'] = {
  ...PRODUCTS['tshirt-classic'],
  name: "Bella + Canvas 6003 Women's Muscle Tank",
  brand: 'Bella + Canvas · 6003',
  sku: 'BC6003',
  type: 'tank',
  category: "Women's Clothing",
  breadcrumb: ['Catalog', "Women's Clothing", 'Tanks'],
  costRange: 'ETB 290',
  premiumCost: 'ETB 232',
  printAreas: ['Center chest', 'Left chest', 'Right chest', 'Back'],
  colors: [
    { name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1A1A12' },
    { name: 'Heather Grey', hex: '#C8C5C0' }, { name: 'Dark Grey Heather', hex: '#4A4A48' },
    { name: 'Mauve', hex: '#B87B7B' }, { name: 'Military Green', hex: '#4A5240' },
  ],
}

PRODUCTS['cap-snapback'] = {
  ...PRODUCTS['tshirt-classic'],
  name: 'OTTO Cap 125-978 Wool Blend Flat Bill Snapback',
  brand: 'OTTO Cap · 125-978',
  sku: '125-978',
  type: 'hat',
  category: 'Accessories',
  breadcrumb: ['Catalog', 'Accessories', 'Hats'],
  costRange: 'ETB 360',
  premiumCost: 'ETB 288',
  sizes: ['One Size (Snapback)'],
  printAreas: ['Front crown', 'Back arch', 'Right side', 'Left side'],
  colors: [
    { name: 'Black', hex: '#1A1A12' }, { name: 'Heather Grey', hex: '#8C8A84' },
    { name: 'Navy', hex: '#1B2A4A' }, { name: 'Red', hex: '#C62828' },
    { name: 'Royal', hex: '#244585' }, { name: 'White', hex: '#FFFFFF' },
  ],
}

PRODUCTS['hat-dad'] = {
  ...PRODUCTS['cap-snapback'],
  name: 'Classic Cotton Dad Hat',
  brand: 'PrintFlow Choice · HAT001',
  sku: 'HAT001',
  costRange: 'ETB 300',
  premiumCost: 'ETB 240',
  colors: [
    { name: 'Tan Khaki', hex: '#C4A882' }, { name: 'Black', hex: '#1A1A12' },
    { name: 'White', hex: '#FFFFFF' }, { name: 'Navy', hex: '#1B2A4A' },
  ],
}

PRODUCTS['jacket-letterman'] = {
  ...PRODUCTS['jacket-bomber'],
  name: 'AWDIS JH043 Heavyweight Letterman Jacket',
  brand: 'Just Hoods by AWDis · JH043',
  sku: 'JH043',
  type: 'jacket',
  costRange: 'ETB 920',
  premiumCost: 'ETB 736',
  printAreas: ['Left chest', 'Right chest', 'Back', 'Right sleeve', 'Left sleeve'],
  colors: [
    { name: 'Charcoal / Heather', hex: '#2C2E33' },
    { name: 'Oxford Navy / White', hex: '#19253B' },
    { name: 'Burgundy / Heather', hex: '#4E1822' },
    { name: 'Jet Black / White', hex: '#181A1D' },
    { name: 'Forest Green / White', hex: '#263826' },
  ],
}

PRODUCTS['blanket-plush'] = {
  ...PRODUCTS['mug-classic'],
  name: 'Velveteen Plush Blanket 50" × 60"',
  brand: 'Generic brand · BLK001',
  sku: 'BLK001',
  costRange: 'ETB 420',
  premiumCost: 'ETB 336',
  type: 'blanket',
  category: 'Home and Living',
  breadcrumb: ['Catalog', 'Home and Living', 'Blankets'],
  sizes: ['50" × 60"', '60" × 80"'],
  colors: [
    { name: 'Off White Fleece', hex: '#FDFBF7' },
  ],
}

PRODUCTS['pillow-polyester'] = {
  ...PRODUCTS['blanket-plush'],
  name: 'Spun Polyester Square Pillowcase 18" × 18"',
  brand: 'Generic brand · PLW001',
  sku: 'PLW001',
  costRange: 'ETB 260',
  premiumCost: 'ETB 208',
  type: 'pillow',
  category: 'Home and Living',
  breadcrumb: ['Catalog', 'Home and Living', 'Pillows'],
  sizes: ['14" × 14"', '16" × 16"', '18" × 18"', '20" × 20"'],
  colors: [
    { name: 'White', hex: '#FFFFFF' },
  ],
}

PRODUCTS['poster-matte'] = {
  ...PRODUCTS['blanket-plush'],
  name: 'Premium Matte Vertical Art Poster',
  brand: 'PrintFlow Choice · POS001',
  sku: 'POS001',
  costRange: 'ETB 200',
  premiumCost: 'ETB 160',
  type: 'poster',
  category: 'Home and Living',
  breadcrumb: ['Catalog', 'Home and Living', 'Posters'],
  sizes: ['12" × 18"', '18" × 24"', '24" × 36"'],
  colors: [
    { name: 'White Archival', hex: '#FFFFFF' },
  ],
}

PRODUCTS['tote-standard'] = {
  ...PRODUCTS['tshirt-classic'],
  name: 'Eco Heavy Canvas Tote Bag',
  brand: 'PrintFlow Choice · TOTE001',
  sku: 'TOTE001',
  type: 'tote',
  category: 'Accessories',
  breadcrumb: ['Catalog', 'Accessories', 'Bags'],
  costRange: 'ETB 220',
  premiumCost: 'ETB 176',
  sizes: ['One Size (15" × 16")'],
  colors: [
    { name: 'Natural Canvas', hex: '#C8BC9A' }, { name: 'Black', hex: '#1A1A12' },
    { name: 'Navy', hex: '#1B2A4A' }, { name: 'Crimson', hex: '#C62828' },
  ],
}

PRODUCTS['mug-black'] = {
  ...PRODUCTS['mug-classic'],
  name: 'Black Ceramic Mug 11oz, 15oz',
  brand: 'PrintFlow Choice · MUG002',
  sku: 'MUG002',
  costRange: 'ETB 190',
  premiumCost: 'ETB 152',
  colors: [
    { name: 'Glossy Black', hex: '#1A1A12' }, { name: 'Glossy White', hex: '#FFFFFF' },
  ],
}

// ── Print area SVG Icon ───────────────────────────────────────────────────────
function PrintAreaIcon({ area }: { area: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-10 h-10 border border-[#D6D3CE] rounded-lg flex items-center justify-center bg-[#F5F4F1] shadow-2xs">
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
          <path
            d="M12 5 C13 9 16 11 20 11 C24 11 27 9 28 5 L35 9 L31 14 L29 13 L29 36 L11 36 L11 13 L9 14 L5 9 Z"
            fill="#E8E5DF"
            stroke="#C2BFB8"
            strokeWidth="0.8"
          />
          {(area === 'Front' || area === 'Center chest') && (
            <rect x="14" y="15" width="12" height="12" rx="1" fill="none" stroke="#1A1A12" strokeWidth="1" strokeDasharray="2 1.5" />
          )}
          {area === 'Left chest' && <rect x="21" y="15" width="5" height="5" rx="1" fill="#1A1A12" opacity="0.85" />}
          {area === 'Right chest' && <rect x="14" y="15" width="5" height="5" rx="1" fill="#1A1A12" opacity="0.85" />}
          {area === 'Back' && <rect x="14" y="15" width="12" height="12" rx="1" fill="#C2BFB8" opacity="0.5" />}
          {area === 'Back collar' && <rect x="18" y="9" width="4" height="3" rx="0.5" fill="#1A1A12" opacity="0.85" />}
          {(area === 'Sleeve left' || area === 'Sleeve right') && (
            <rect x={area === 'Sleeve left' ? '6' : '22'} y="11" width="6" height="8" rx="1" fill="none" stroke="#1A1A12" strokeWidth="1" strokeDasharray="2 1.5" />
          )}
          {area.startsWith('Neck') && <ellipse cx="20" cy="11" rx="4" ry="2.5" fill="none" stroke="#1A1A12" strokeWidth="1" strokeDasharray="2 1.5" />}
          {area === 'Wrap' && <rect x="11" y="14" width="18" height="14" rx="1" fill="none" stroke="#1A1A12" strokeWidth="1" strokeDasharray="2 1.5" />}
        </svg>
      </div>
      <span className="text-[10px] text-[#5C5A55] text-center leading-tight max-w-[54px] font-medium">{area}</span>
    </div>
  )
}

// ── Catalog Detail Page ───────────────────────────────────────────────────────
export default function CatalogProductPage() {
  const { id } = useParams<{ id: string }>()
  const p = PRODUCTS[id] ?? PRODUCTS['tshirt-classic']
  const scenes = PRODUCT_SCENES[id] ?? PRODUCT_SCENES['tshirt-classic']

  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [activeColor, setActiveColor]           = useState(p.colors[0])
  const [liked, setLiked]                       = useState(false)
  const [sizeUnit, setSizeUnit]                 = useState<'Imperial' | 'Metric'>('Imperial')
  const [showMoreFeatures, setShowMoreFeatures] = useState(false)

  const activeScene = scenes[activeSceneIndex] ?? scenes[0]
  const visibleFeatures = showMoreFeatures ? p.keyFeatures : p.keyFeatures.slice(0, 4)

  return (
    <div className="bg-white min-h-full flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top Nav Bar matching Printify Catalog ──────────────────────────── */}
      <header className="flex items-center justify-between border-b border-[#E8E6E1] px-6 py-2.5 shrink-0 bg-white">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['For you', 'Men', 'Women', 'Kids', 'Accessories', 'Home and Living'].map((cat, i) => (
            <Link
              key={cat}
              href="/dashboard/catalog"
              className={cn(
                'px-4 py-2 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap',
                i === 1 ? 'bg-[#EAE7DF] text-[#1A1A12]' : 'text-[#5C5A55] hover:bg-[#F5F4F0] hover:text-[#1A1A12]'
              )}>
              {cat}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#5C5A55]">
            <span>🇪🇹</span>
            <span className="font-semibold text-[#1A1A12]">ET | ETB</span>
          </div>
          <Link
            href="/dashboard/catalog"
            className="flex items-center gap-2 bg-[#1A1A12] hover:bg-[#2A2A22] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors">
            <Search size={13} strokeWidth={2.5} />
            <span>Search</span>
          </Link>
        </div>
      </header>

      {/* ── Main Two-Column Hero ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,460px] border-b border-[#E8E6E1]">

        {/* ── LEFT: Realistic Photographic Showcase ────────────────────────── */}
        <div className="relative flex flex-col bg-[#F7F6F2] border-r border-[#E8E6E1]">
          {/* Top Actions: Favorite Heart & Zoom */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={() => setLiked(l => !l)}
              className="w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xs border border-[#E8E6E1] transition-all">
              <Heart size={15} className={liked ? 'fill-red-500 text-red-500' : 'text-[#5C5A55]'} />
            </button>
          </div>

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20">
            {p.bestseller && (
              <span className="bg-[#FED7AA] text-[#9A3412] text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs">
                Bestseller
              </span>
            )}
            {p.personalization && (
              <span className="bg-[#F3E8FF] text-[#7E22CE] text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs">
                🪄 Personalization Pick
              </span>
            )}
          </div>

          {/* Main Stage Viewport */}
          <div className="flex-1 flex items-center justify-center p-8 min-h-[520px]">
            {activeScene.isVector ? (
              <div className="w-full max-w-[420px] h-[420px] flex items-center justify-center bg-white rounded-2xl shadow-sm border border-[#E8E6E1] p-6">
                {(() => {
                  const MockupComp = MOCKUP_MAP[p.type] ?? TShirtMockup
                  return <MockupComp color={activeColor.hex} className="w-full h-full max-h-[380px]" showPrintArea={true} />
                })()}
              </div>
            ) : (
              <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-[#E8E6E1] bg-white group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPhotoUrl(activeScene.photoId, 1000)}
                  alt={`${p.name} - ${activeScene.label}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5 pointer-events-none">
                  <Sparkles size={11} className="text-[#B5E853]" />
                  <span>Real studio photograph</span>
                </div>
              </div>
            )}
          </div>

          {/* Scene Thumbnail Switcher (Grid / Carousel underneath) */}
          <div className="p-4 bg-white/70 border-t border-[#E8E6E1] flex items-center justify-center gap-2.5 flex-wrap">
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => setActiveSceneIndex(idx)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold',
                  activeSceneIndex === idx
                    ? 'border-[#1A1A12] bg-[#1A1A12] text-white shadow-xs'
                    : 'border-[#E8E6E1] bg-white text-[#5C5A55] hover:border-[#9A9A8E] hover:text-[#1A1A12]'
                )}>
                {!scene.isVector && (
                  <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getPhotoUrl(scene.photoId, 60)} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <span>{scene.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Product Info, Options & Pricing ───────────────────────── */}
        <div className="flex flex-col bg-white overflow-y-auto">
          <div className="p-8 flex-1 space-y-6">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[12px] text-[#8C8880]">
              {p.breadcrumb.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={12} />}
                  <Link href="/dashboard/catalog" className="hover:text-[#1A1A12] transition-colors">{crumb}</Link>
                </span>
              ))}
            </div>

            {/* Title & Brand */}
            <div>
              <h1 className="text-[26px] font-bold text-[#1A1A12] leading-tight mb-1.5">{p.name}</h1>
              <div className="flex items-center gap-3 text-[13px]">
                <span className="font-semibold text-[#5C5A55]">{p.brand}</span>
                <span className="text-[#C8C5C0]">·</span>
                <span className="text-[#8C8880]">{p.sku}</span>
                <span className="text-[#C8C5C0]">·</span>
                <div className="flex items-center gap-1 text-[#1A1A12] font-semibold">
                  <Star size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{p.rating}</span>
                  <span className="text-[#8C8880] font-normal">({p.reviewsCount.toLocaleString()})</span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-medium text-[#8C8880] uppercase tracking-wider">Starting price</div>
                <div className="text-[22px] font-bold text-[#1A1A12]">From {p.costRange}</div>
              </div>
              <div className="text-right">
                <span className="bg-[#EBF7E3] text-[#366827] text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
                  <Check size={11} strokeWidth={3} /> With Premium
                </span>
                <div className="text-[14px] font-bold text-[#366827]">From {p.premiumCost}</div>
              </div>
            </div>

            {/* Primary Action Button (Printify signature green or dark pill) */}
            <div>
              <Link
                href={`/create/${id}`}
                className="w-full bg-[#B5E853] hover:bg-[#a3d93d] text-[#1A1A12] font-bold text-[15px] py-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 group">
                <span>Start designing</span>
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <div className="flex items-center justify-center gap-4 mt-2.5 text-[11px] text-[#8C8880]">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" /> PrintFlow Quality Promise
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Truck size={13} className="text-blue-600" /> Ships from {p.shippingFrom}
                </span>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2 pt-2 border-t border-[#F0ECE1]">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-semibold text-[#1A1A12]">Colors</span>
                <span className="text-[#8C8880]">{activeColor.name} ({p.colors.length} options)</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {p.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setActiveColor(c)}
                    title={c.name}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all p-0.5',
                      activeColor.name === c.name
                        ? 'border-[#1A1A12] ring-2 ring-[#1A1A12] scale-110'
                        : 'border-[#E8E6E1] hover:border-[#9A9A8E]'
                    )}>
                    <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2 pt-2 border-t border-[#F0ECE1]">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-semibold text-[#1A1A12]">Available sizes</span>
                <span className="text-[#8C8880]">{p.sizes.length} sizes</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {p.sizes.map(s => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-xl border border-[#D6D3CE] text-xs font-semibold text-[#1A1A12] bg-[#FAF9F6]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Print Areas */}
            <div className="space-y-3 pt-2 border-t border-[#F0ECE1]">
              <div className="text-[13px] font-semibold text-[#1A1A12]">Print areas</div>
              <div className="flex flex-wrap gap-3">
                {p.printAreas.map(area => (
                  <PrintAreaIcon key={area} area={area} />
                ))}
              </div>
            </div>

            {/* Method Box */}
            <div className="border border-[#D6D3CE] rounded-2xl p-4 bg-[#FAF9F6]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-bold text-[#1A1A12]">{p.method.name}</span>
                <span className="bg-[#EAE7DF] text-[#1A1A12] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {p.method.tag}
                </span>
              </div>
              <p className="text-[12px] text-[#5C5A55] leading-relaxed mb-2.5">{p.method.desc}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {p.method.features.map(f => (
                  <span key={f} className="text-[11px] font-medium text-[#5C5A55] bg-white border border-[#E8E6E1] px-2 py-0.5 rounded-md">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── SECTION: Print Providers Table (Printify's Core Comparison) ────── */}
      <div className="border-t border-[#E8E6E1] bg-[#FAF9F6] px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-[20px] font-bold text-[#1A1A12]">Print Providers</h2>
              <p className="text-[13px] text-[#6E6B65]">Compare fulfilled pricing, ratings, and production turnaround across verified Ethiopian fulfillment hubs.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#5C5A55]">Sort by:</span>
              <button className="px-3 py-1.5 rounded-xl bg-white border border-[#D6D3CE] text-xs font-semibold text-[#1A1A12]">
                PrintFlow Choice
              </button>
            </div>
          </div>

          {/* Providers Table */}
          <div className="bg-white border border-[#E8E6E1] rounded-2xl overflow-hidden shadow-2xs">
            <div className="divide-y divide-[#E8E6E1]">
              {p.providers.map((prov, i) => (
                <div key={prov.name} className="p-5 flex items-center justify-between flex-wrap gap-4 hover:bg-[#FAF9F6] transition-colors">
                  <div className="space-y-1 min-w-[240px]">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{prov.flag}</span>
                      <span className="text-[14px] font-bold text-[#1A1A12]">{prov.name}</span>
                      {prov.badge && (
                        <span className="bg-[#B5E853]/40 text-[#2B3B10] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {prov.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-[#6E6B65] flex items-center gap-3">
                      <span>{prov.country}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#1A1A12] font-semibold">
                        <Star size={11} className="fill-[#F59E0B] text-[#F59E0B]" /> {prov.rating}
                      </span>
                      <span>·</span>
                      <span>Avg. {prov.productionDays}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 flex-wrap">
                    <div>
                      <div className="text-[11px] text-[#8C8880]">Sizes &amp; Colors</div>
                      <div className="text-[13px] font-semibold text-[#1A1A12]">{prov.sizes} · {prov.colorsCount} col</div>
                    </div>

                    <div>
                      <div className="text-[11px] text-[#8C8880]">Standard Price</div>
                      <div className="text-[14px] font-bold text-[#1A1A12]">{prov.price}</div>
                    </div>

                    <div>
                      <div className="text-[11px] text-[#366827] font-semibold">With Premium</div>
                      <div className="text-[14px] font-bold text-[#366827]">{prov.premiumPrice}</div>
                    </div>

                    <div>
                      <div className="text-[11px] text-[#8C8880]">Shipping</div>
                      <div className="text-[13px] font-semibold text-[#1A1A12]">{prov.shipping}</div>
                    </div>

                    <Link
                      href={`/create/${id}`}
                      className="bg-[#1A1A12] hover:bg-[#2A2A22] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs transition-colors">
                      Start designing
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: Key Features ───────────────────────────────────────────── */}
      <div className="border-t border-[#E8E6E1] px-8 py-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[20px] font-bold text-[#1A1A12] mb-6">Key features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {visibleFeatures.map(f => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="text-3xl shrink-0 mt-0.5">{f.icon}</div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#1A1A12] mb-1">{f.title}</h3>
                  <p className="text-[12px] text-[#5C5A55] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {p.keyFeatures.length > 4 && (
            <button
              onClick={() => setShowMoreFeatures(m => !m)}
              className="mt-6 text-[13px] font-bold text-[#1A1A12] underline underline-offset-2">
              {showMoreFeatures ? 'Show fewer' : 'See all features'}
            </button>
          )}
        </div>
      </div>

      {/* ── SECTION: Size Guide ─────────────────────────────────────────────── */}
      <div className="border-t border-[#E8E6E1] px-8 py-10 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-[20px] font-bold text-[#1A1A12] mb-2">Size guide</h2>
            <p className="text-[12px] text-[#8C8880] mb-4">All measurements in the table refer to garment flat dimensions.</p>

            <div className="flex items-center gap-4 mb-4 border-b border-[#E8E6E1]">
              {(['Imperial', 'Metric'] as const).map(u => (
                <button
                  key={u}
                  onClick={() => setSizeUnit(u)}
                  className={cn(
                    'pb-2.5 text-[13px] font-semibold border-b-2 transition-colors',
                    sizeUnit === u ? 'border-[#1A1A12] text-[#1A1A12]' : 'border-transparent text-[#8C8880] hover:text-[#1A1A12]'
                  )}>
                  {u}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-[#E8E6E1]">
                    <th className="text-left py-2.5 text-[#8C8880] font-medium w-36" />
                    {p.sizeGuide.headers.map(h => (
                      <th key={h} className="text-center py-2.5 text-[#5C5A55] font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.sizeGuide.rows.map(row => (
                    <tr key={row.label} className="border-b border-[#E8E6E1]/60">
                      <td className="py-3 text-[#5C5A55] font-medium">{row.label}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="py-3 text-center text-[#1A1A12] font-semibold">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recently Viewed */}
          <div>
            <h2 className="text-[20px] font-bold text-[#1A1A12] mb-4">Recently viewed</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'tshirt-classic', name: 'Adult Staple Tee', photo: 'photo-1521572267360-ee0c2909d518' },
                { id: 'sweatshirt-crew', name: 'Crewneck Sweatshirt', photo: 'photo-1556905055-8f358a7a47b2' },
                { id: 'mug-classic', name: 'Ceramic Mug 11oz', photo: 'photo-1514228742587-6b1558fcca3d' },
              ].map(item => (
                <Link
                  key={item.id}
                  href={`/dashboard/catalog/${item.id}`}
                  className="group rounded-2xl overflow-hidden border border-[#E8E6E1] bg-white hover:shadow-md transition-all">
                  <div className="aspect-square overflow-hidden bg-[#ECE9E4]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getPhotoUrl(item.photo, 300)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[12px] font-bold text-[#1A1A12] line-clamp-1 leading-snug">{item.name}</p>
                    <p className="text-[10px] text-[#8C8880]">Stanley Stella</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
