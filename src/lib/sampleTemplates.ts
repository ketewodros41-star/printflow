/**
 * Curated Pre-made Design Templates for PrintFlow (Printify-Parity Engine).
 * Allows 1-click loading of complete, multi-layered vector compositions.
 */

import type { PrintMethod } from '@/components/mockups/RealisticFlatLay'

export interface TemplateLayer {
  type: 'image' | 'text'
  src?: string
  text?: string
  // Fractional positioning relative to print area (0.0 to 1.0)
  relX: number
  relY: number
  relWidth: number
  relHeight: number
  rotation?: number
  fontSize?: number
  fontFamily?: string
  color?: string
  bold?: boolean
  italic?: boolean
  align?: 'left' | 'center' | 'right'
  arc?: number
  letterSpacing?: number
  printMethod?: PrintMethod
}

export interface DesignTemplate {
  id: string
  name: string
  category: 'Vintage' | 'Streetwear' | 'Athletics' | 'Coffee & Culture' | 'Minimal' | 'Sewed & Chenille'
  placeholder: 'front' | 'back' | 'both'
  description: string
  thumbnailSvg: string
  layers: TemplateLayer[]
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const SAMPLE_TEMPLATES: DesignTemplate[] = [
  // 1. Vintage Explorer Mountain Badge
  {
    id: 'tpl-vintage-explorer',
    name: 'Wilderness Explorer Crest',
    category: 'Vintage',
    placeholder: 'front',
    description: 'Mountain crest badge with circular arc typography and vintage est. banner.',
    thumbnailSvg: svgToDataUrl(`
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#1C2B1A" rx="16"/>
        <circle cx="150" cy="150" r="110" fill="none" stroke="#E6C875" stroke-width="4" stroke-dasharray="8 4"/>
        <polygon points="150,70 210,180 90,180" fill="#E8E5DF"/>
        <polygon points="150,70 210,180 150,180" fill="#A8A49C"/>
        <text x="150" y="225" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="16" fill="#E6C875" letter-spacing="3">WILD EXPLORER</text>
        <text x="150" y="245" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#E89635" letter-spacing="2">EST. 1994 · HIGHLANDS</text>
      </svg>
    `),
    layers: [
      {
        type: 'text',
        text: 'WILD EXPLORER',
        relX: 0.08,
        relY: 0.12,
        relWidth: 0.84,
        relHeight: 0.18,
        fontSize: 34,
        fontFamily: 'Impact',
        color: '#E6C875',
        bold: true,
        align: 'center',
        arc: 25,
        letterSpacing: 3,
        printMethod: 'screen',
      },
      {
        type: 'text',
        text: 'HIGHLANDS OF ETHIOPIA',
        relX: 0.15,
        relY: 0.76,
        relWidth: 0.70,
        relHeight: 0.10,
        fontSize: 16,
        fontFamily: 'Oswald',
        color: '#C8C4BC',
        bold: true,
        align: 'center',
        letterSpacing: 4,
        printMethod: 'dtg',
      },
      {
        type: 'text',
        text: 'EST. 1994 · ADDIS ABABA',
        relX: 0.22,
        relY: 0.85,
        relWidth: 0.56,
        relHeight: 0.08,
        fontSize: 12,
        fontFamily: 'Inter',
        color: '#E89635',
        bold: false,
        align: 'center',
        letterSpacing: 2,
        printMethod: 'dtg',
      }
    ]
  },

  // 2. Heavyweight Varsity Chenille "ATHLETIC 94"
  {
    id: 'tpl-varsity-chenille',
    name: 'Varsity Patch 94',
    category: 'Sewed & Chenille',
    placeholder: 'front',
    description: 'Authentic 3D fuzzy chenille varsity numbering with arched college header.',
    thumbnailSvg: svgToDataUrl(`
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#0D1B2A" rx="16"/>
        <text x="150" y="80" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="22" fill="#F4E8C1" letter-spacing="4">STATE ATHLETICS</text>
        <text x="150" y="200" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="96" fill="#C59B27" stroke="#F4E8C1" stroke-width="6">94</text>
        <text x="150" y="250" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#E0E1DD" letter-spacing="5">CHAMPION DIVISION</text>
      </svg>
    `),
    layers: [
      {
        type: 'text',
        text: 'STATE CHAMPIONS',
        relX: 0.05,
        relY: 0.10,
        relWidth: 0.90,
        relHeight: 0.18,
        fontSize: 32,
        fontFamily: 'Oswald',
        color: '#F4E8C1',
        bold: true,
        align: 'center',
        arc: 20,
        letterSpacing: 4,
        printMethod: 'embroidery',
      },
      {
        type: 'text',
        text: '94',
        relX: 0.20,
        relY: 0.32,
        relWidth: 0.60,
        relHeight: 0.38,
        fontSize: 98,
        fontFamily: 'Impact',
        color: '#C59B27',
        bold: true,
        align: 'center',
        printMethod: 'chenille',
      },
      {
        type: 'text',
        text: 'DIVISION I · ADDIS ABABA',
        relX: 0.15,
        relY: 0.74,
        relWidth: 0.70,
        relHeight: 0.12,
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        bold: true,
        align: 'center',
        letterSpacing: 3,
        printMethod: 'embroidery',
      }
    ]
  },

  // 3. Streetwear Acid Wash Gothic
  {
    id: 'tpl-streetwear-gothic',
    name: 'Tokyo Underground District',
    category: 'Streetwear',
    placeholder: 'front',
    description: 'Raw high-density streetwear drop with Japanese typography and barcode layout.',
    thumbnailSvg: svgToDataUrl(`
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#111111" rx="16"/>
        <text x="150" y="70" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="6">SHIBUYA</text>
        <text x="150" y="110" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#FF0055" letter-spacing="8">渋谷区 · OVERSIZE</text>
        <rect x="50" y="140" width="200" height="4" fill="#FF0055"/>
        <text x="150" y="210" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="44" fill="#FFFFFF">RAW 2026</text>
        <text x="150" y="250" text-anchor="middle" font-family="monospace" font-size="11" fill="#888888" letter-spacing="4">|||||| ||||| |||||||</text>
      </svg>
    `),
    layers: [
      {
        type: 'text',
        text: 'SHIBUYA DISTRICT',
        relX: 0.05,
        relY: 0.12,
        relWidth: 0.90,
        relHeight: 0.16,
        fontSize: 40,
        fontFamily: 'Bebas Neue',
        color: '#FFFFFF',
        bold: true,
        align: 'center',
        letterSpacing: 6,
        printMethod: 'screen',
      },
      {
        type: 'text',
        text: '渋谷区 · HEAVYWEIGHT MERCH',
        relX: 0.10,
        relY: 0.30,
        relWidth: 0.80,
        relHeight: 0.10,
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#FF0055',
        bold: true,
        align: 'center',
        letterSpacing: 4,
        printMethod: 'dtf',
      },
      {
        type: 'text',
        text: 'PROJECT 09',
        relX: 0.12,
        relY: 0.44,
        relWidth: 0.76,
        relHeight: 0.26,
        fontSize: 68,
        fontFamily: 'Impact',
        color: '#E5E5E5',
        bold: true,
        align: 'center',
        printMethod: 'screen',
      },
      {
        type: 'text',
        text: '||||| ||||||| |||| |||||||| |||',
        relX: 0.20,
        relY: 0.78,
        relWidth: 0.60,
        relHeight: 0.10,
        fontSize: 18,
        fontFamily: 'Courier Prime',
        color: '#A3A3A3',
        bold: false,
        align: 'center',
        letterSpacing: 2,
        printMethod: 'dtg',
      }
    ]
  },

  // 4. Ethiopian Specialty Coffee Roasters
  {
    id: 'tpl-coffee-roasters',
    name: 'Habesha Roasters Heritage',
    category: 'Coffee & Culture',
    placeholder: 'front',
    description: 'Heritage coffee seal with Yirgacheffe origin story and arched badge.',
    thumbnailSvg: svgToDataUrl(`
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#2A1810" rx="16"/>
        <circle cx="150" cy="150" r="115" fill="none" stroke="#D4A373" stroke-width="4"/>
        <text x="150" y="85" text-anchor="middle" font-family="serif" font-weight="bold" font-size="18" fill="#FAEDCD" letter-spacing="3">HABESHA ROAST</text>
        <circle cx="150" cy="145" r="36" fill="#6F1D1B"/>
        <text x="150" y="220" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#D4A373" letter-spacing="3">YIRGACHEFFE · SIDAMA</text>
        <text x="150" y="240" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#CCD5AE" letter-spacing="2">100% ARABICA ORIGIN</text>
      </svg>
    `),
    layers: [
      {
        type: 'text',
        text: 'HABESHA COFFEE ROASTERS',
        relX: 0.06,
        relY: 0.10,
        relWidth: 0.88,
        relHeight: 0.16,
        fontSize: 26,
        fontFamily: 'Playfair Display',
        color: '#FAEDCD',
        bold: true,
        align: 'center',
        arc: 22,
        letterSpacing: 2,
        printMethod: 'dtg',
      },
      {
        type: 'text',
        text: 'ETHIOPIA',
        relX: 0.15,
        relY: 0.42,
        relWidth: 0.70,
        relHeight: 0.22,
        fontSize: 54,
        fontFamily: 'Oswald',
        color: '#D4A373',
        bold: true,
        align: 'center',
        letterSpacing: 6,
        printMethod: 'screen',
      },
      {
        type: 'text',
        text: 'YIRGACHEFFE · SIDAMA · HARAR',
        relX: 0.10,
        relY: 0.68,
        relWidth: 0.80,
        relHeight: 0.10,
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#E8D4B0',
        bold: true,
        align: 'center',
        letterSpacing: 3,
        printMethod: 'dtg',
      },
      {
        type: 'text',
        text: 'FIRST HOME OF COFFEE · 100% ARABICA',
        relX: 0.12,
        relY: 0.78,
        relWidth: 0.76,
        relHeight: 0.08,
        fontSize: 11,
        fontFamily: 'Inter',
        color: '#A89275',
        bold: false,
        align: 'center',
        letterSpacing: 2,
        printMethod: 'dtg',
      }
    ]
  },

  // 5. Retro 80s Synthwave Wave
  {
    id: 'tpl-retro-synthwave',
    name: 'Summer of 84 Synthwave',
    category: 'Vintage',
    placeholder: 'front',
    description: 'Neon sunset wave with 80s italic speed typography and tropical vibes.',
    thumbnailSvg: svgToDataUrl(`
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#110B29" rx="16"/>
        <circle cx="150" cy="130" r="70" fill="#FF7B00"/>
        <rect x="70" y="140" width="160" height="5" fill="#110B29"/>
        <rect x="70" y="152" width="160" height="7" fill="#110B29"/>
        <rect x="70" y="167" width="160" height="10" fill="#110B29"/>
        <text x="150" y="235" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="28" fill="#00F5D4" letter-spacing="4">SUMMER '84</text>
        <text x="150" y="260" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#FF007A" letter-spacing="4">NEON HORIZON CLUB</text>
      </svg>
    `),
    layers: [
      {
        type: 'text',
        text: 'SUMMER OF 1984',
        relX: 0.08,
        relY: 0.60,
        relWidth: 0.84,
        relHeight: 0.18,
        fontSize: 44,
        fontFamily: 'Impact',
        color: '#00F5D4',
        bold: true,
        italic: true,
        align: 'center',
        letterSpacing: 3,
        printMethod: 'screen',
      },
      {
        type: 'text',
        text: 'NEON WAVE ARCHIVE',
        relX: 0.15,
        relY: 0.78,
        relWidth: 0.70,
        relHeight: 0.10,
        fontSize: 15,
        fontFamily: 'Righteous',
        color: '#FF007A',
        bold: false,
        align: 'center',
        letterSpacing: 4,
        printMethod: 'dtf',
      }
    ]
  },

  // 6. Minimalist Botanical Studio
  {
    id: 'tpl-minimal-botanical',
    name: 'Botanical Field Herbarium',
    category: 'Minimal',
    placeholder: 'front',
    description: 'Clean Scandinavian editorial typography with subtle serif caption.',
    thumbnailSvg: svgToDataUrl(`
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#F8F7F4" rx="16"/>
        <path d="M 150 70 Q 130 130 150 180 Q 170 130 150 70 Z" fill="#3F4832"/>
        <path d="M 150 110 Q 185 100 175 140 Z" fill="#575C46"/>
        <path d="M 150 130 Q 115 120 125 160 Z" fill="#575C46"/>
        <text x="150" y="225" text-anchor="middle" font-family="serif" font-size="18" fill="#1A1A12" letter-spacing="2">EUCALYPTUS NO. 4</text>
        <text x="150" y="248" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#78756E" letter-spacing="3">FLORA ADDIS · VOL. 02</text>
      </svg>
    `),
    layers: [
      {
        type: 'text',
        text: 'EUCALYPTUS NO. 4',
        relX: 0.10,
        relY: 0.65,
        relWidth: 0.80,
        relHeight: 0.14,
        fontSize: 26,
        fontFamily: 'Playfair Display',
        color: '#1A1A12',
        bold: true,
        align: 'center',
        letterSpacing: 2,
        printMethod: 'dtg',
      },
      {
        type: 'text',
        text: 'FLORA HIGHLANDS · ARCHIVE 2026',
        relX: 0.15,
        relY: 0.78,
        relWidth: 0.70,
        relHeight: 0.08,
        fontSize: 12,
        fontFamily: 'Inter',
        color: '#6E6B65',
        bold: false,
        align: 'center',
        letterSpacing: 3,
        printMethod: 'dtg',
      }
    ]
  },

  // 7. Chain-Stitched Script "Stay Humble"
  {
    id: 'tpl-chainstitch-script',
    name: 'Chainstitch Script & Heart',
    category: 'Sewed & Chenille',
    placeholder: 'front',
    description: 'Raised embroidered chainstitch script with satin thread stitch relief.',
    thumbnailSvg: svgToDataUrl(`
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#1E232A" rx="16"/>
        <text x="150" y="145" text-anchor="middle" font-family="cursive" font-weight="bold" font-size="34" fill="#FFA726" stroke="#FFFFFF" stroke-width="0.8">Stay Humble</text>
        <text x="150" y="195" text-anchor="middle" font-family="cursive" font-weight="bold" font-size="28" fill="#FF7043">Hustle Hard</text>
        <text x="150" y="240" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#B0BEC5" letter-spacing="4">CUSTOM EMBROIDERY</text>
      </svg>
    `),
    layers: [
      {
        type: 'text',
        text: 'Stay Humble',
        relX: 0.10,
        relY: 0.28,
        relWidth: 0.80,
        relHeight: 0.22,
        fontSize: 48,
        fontFamily: 'Pacifico',
        color: '#FFA726',
        bold: true,
        align: 'center',
        printMethod: 'embroidery',
      },
      {
        type: 'text',
        text: 'Hustle Hard',
        relX: 0.12,
        relY: 0.50,
        relWidth: 0.76,
        relHeight: 0.20,
        fontSize: 42,
        fontFamily: 'Dancing Script',
        color: '#FF7043',
        bold: true,
        align: 'center',
        printMethod: 'embroidery',
      },
      {
        type: 'text',
        text: '🧵 CRAFTED IN ADDIS ABABA',
        relX: 0.15,
        relY: 0.76,
        relWidth: 0.70,
        relHeight: 0.10,
        fontSize: 13,
        fontFamily: 'Inter',
        color: '#ECEFF1',
        bold: true,
        align: 'center',
        letterSpacing: 2,
        printMethod: 'embroidery',
      }
    ]
  },

  // 8. Back View: Master Tour Typography Stack
  {
    id: 'tpl-back-tour-stack',
    name: 'World Tour Cities (Back View)',
    category: 'Streetwear',
    placeholder: 'back',
    description: 'Authentic tour dates schedule layout designed specifically for the garment back.',
    thumbnailSvg: svgToDataUrl(`
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#141414" rx="16"/>
        <text x="150" y="55" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" letter-spacing="4">WORLD TOUR</text>
        <line x1="50" y1="70" x2="250" y2="70" stroke="#E50914" stroke-width="2"/>
        <text x="150" y="105" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#D4D4D4">ADDIS ABABA · NAIROBI · CAIRO</text>
        <text x="150" y="135" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#D4D4D4">LONDON · BERLIN · PARIS</text>
        <text x="150" y="165" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#D4D4D4">NEW YORK · TOKYO · SEOUL</text>
        <text x="150" y="220" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="32" fill="#E50914">2026</text>
      </svg>
    `),
    layers: [
      {
        type: 'text',
        text: 'OVERSEAS TOUR',
        relX: 0.08,
        relY: 0.08,
        relWidth: 0.84,
        relHeight: 0.16,
        fontSize: 38,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        bold: true,
        align: 'center',
        letterSpacing: 4,
        printMethod: 'screen',
      },
      {
        type: 'text',
        text: 'ADDIS ABABA — MESKEL SQUARE',
        relX: 0.10,
        relY: 0.28,
        relWidth: 0.80,
        relHeight: 0.08,
        fontSize: 14,
        fontFamily: 'Oswald',
        color: '#E5E5E5',
        bold: true,
        align: 'center',
        letterSpacing: 2,
        printMethod: 'dtg',
      },
      {
        type: 'text',
        text: 'NAIROBI — CARNIVORE GROUNDS',
        relX: 0.10,
        relY: 0.38,
        relWidth: 0.80,
        relHeight: 0.08,
        fontSize: 14,
        fontFamily: 'Oswald',
        color: '#E5E5E5',
        bold: true,
        align: 'center',
        letterSpacing: 2,
        printMethod: 'dtg',
      },
      {
        type: 'text',
        text: 'LONDON — BRIXTON ACADEMY',
        relX: 0.10,
        relY: 0.48,
        relWidth: 0.80,
        relHeight: 0.08,
        fontSize: 14,
        fontFamily: 'Oswald',
        color: '#E5E5E5',
        bold: true,
        align: 'center',
        letterSpacing: 2,
        printMethod: 'dtg',
      },
      {
        type: 'text',
        text: 'NEW YORK — TERMINAL 5',
        relX: 0.10,
        relY: 0.58,
        relWidth: 0.80,
        relHeight: 0.08,
        fontSize: 14,
        fontFamily: 'Oswald',
        color: '#E5E5E5',
        bold: true,
        align: 'center',
        letterSpacing: 2,
        printMethod: 'dtg',
      },
      {
        type: 'text',
        text: 'SOLD OUT WORLDWIDE',
        relX: 0.15,
        relY: 0.74,
        relWidth: 0.70,
        relHeight: 0.12,
        fontSize: 18,
        fontFamily: 'Bebas Neue',
        color: '#FF0055',
        bold: true,
        align: 'center',
        letterSpacing: 5,
        printMethod: 'screen',
      }
    ]
  }
]
