/**
 * Curated high-resolution SVG graphics library for the PrintFlow designer (Printify-style).
 * Provides instant, zero-latency vector artwork for testing and designing apparel & drinkware.
 */

import type { PrintMethod } from '@/components/mockups/RealisticFlatLay'

export interface GraphicItem {
  id: string
  name: string
  category: 'outdoor' | 'coffee' | 'culture' | 'retro' | 'minimal' | 'streetwear' | 'athletics' | 'japanese' | 'sewed'
  svg: string
  previewUrl: string
  defaultPrintMethod?: PrintMethod
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// 1. Vintage Mountain Explorer
const SVG_MOUNTAIN = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="185" fill="#1C2B1A" />
  <circle cx="200" cy="200" r="175" fill="none" stroke="#E6C875" stroke-width="4" stroke-dasharray="12 6" />
  <circle cx="200" cy="150" r="60" fill="#E89635" />
  <polygon points="200,80 290,240 110,240" fill="#E8E5DF" />
  <polygon points="200,80 290,240 200,240" fill="#C8C4BC" />
  <polygon points="130,130 220,250 60,250" fill="#A8A49C" />
  <polygon points="260,140 330,250 180,250" fill="#88847C" />
  <polygon points="200,210 220,260 180,260" fill="#0D1B0D" />
  <polygon points="160,225 178,265 142,265" fill="#0D1B0D" />
  <polygon points="240,225 258,265 222,265" fill="#0D1B0D" />
  <path d="M 80 270 Q 200 290 320 270 L 320 310 Q 200 330 80 310 Z" fill="#E6C875" />
  <text x="200" y="297" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="22" font-weight="900" fill="#1C2B1A" letter-spacing="4">WILD EXPLORER</text>
  <text x="200" y="340" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#E89635" letter-spacing="5">EST. 1994 · ADDIS ABABA</text>
</svg>
`.trim()

// 2. Ethiopian Highland Coffee Roasters
const SVG_COFFEE = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="185" fill="#2A1810" />
  <circle cx="200" cy="200" r="170" fill="none" stroke="#D4A373" stroke-width="3" />
  <ellipse cx="200" cy="180" rx="70" ry="24" fill="#FAEDCD" />
  <path d="M 130 180 C 130 250, 270 250, 270 180 Z" fill="#FAEDCD" />
  <ellipse cx="200" cy="180" rx="60" ry="16" fill="#6F1D1B" />
  <path d="M 270 190 C 310 190, 310 230, 260 230" fill="none" stroke="#FAEDCD" stroke-width="12" stroke-linecap="round" />
  <path d="M 180 145 Q 170 120 185 100" fill="none" stroke="#D4A373" stroke-width="4" stroke-linecap="round" />
  <path d="M 200 140 Q 215 115 200 90" fill="none" stroke="#D4A373" stroke-width="4" stroke-linecap="round" />
  <path d="M 220 145 Q 210 120 225 100" fill="none" stroke="#D4A373" stroke-width="4" stroke-linecap="round" />
  <text x="200" y="290" text-anchor="middle" font-family="'Georgia', serif" font-size="24" font-weight="bold" fill="#FAEDCD" letter-spacing="2">HABESHA ROAST</text>
  <text x="200" y="315" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="#D4A373" letter-spacing="4">SIDAMA · YIRGACHEFFE · HARAR</text>
  <text x="200" y="335" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#CCD5AE" letter-spacing="3">100% ARABICA SPECIALTY</text>
</svg>
`.trim()

// 3. Retro 80s Sunset Waves
const SVG_RETRO = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="retro-sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF007A" />
      <stop offset="50%" stop-color="#FF7B00" />
      <stop offset="100%" stop-color="#FFDD00" />
    </linearGradient>
  </defs>
  <circle cx="200" cy="200" r="180" fill="#110B29" />
  <g>
    <circle cx="200" cy="180" r="100" fill="url(#retro-sky)" />
    <rect x="90" y="190" width="220" height="6" fill="#110B29" />
    <rect x="90" y="202" width="220" height="9" fill="#110B29" />
    <rect x="90" y="217" width="220" height="13" fill="#110B29" />
    <rect x="90" y="236" width="220" height="18" fill="#110B29" />
    <rect x="90" y="260" width="220" height="25" fill="#110B29" />
  </g>
  <path d="M 120 280 Q 140 210 170 170" fill="none" stroke="#00F5D4" stroke-width="5" />
  <path d="M 280 280 Q 260 210 230 170" fill="none" stroke="#00F5D4" stroke-width="5" />
  <text x="200" y="325" text-anchor="middle" font-family="'Impact', sans-serif" font-size="34" font-weight="900" fill="#00F5D4" letter-spacing="4">SUMMER '84</text>
</svg>
`.trim()

// 4. Lion of Judah Modern Crest
const SVG_LION = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <polygon points="200,30 360,110 360,280 200,370 40,280 40,110" fill="#0F172A" stroke="#EAB308" stroke-width="6" />
  <path d="M 160 110 L 175 140 L 200 90 L 225 140 L 240 110 L 240 150 L 160 150 Z" fill="#EAB308" />
  <path d="M 200 160 L 230 200 L 250 180 L 240 230 L 270 250 L 230 260 L 200 310 L 170 260 L 130 250 L 160 230 L 150 180 L 170 200 Z" fill="#FACC15" />
  <polygon points="185,210 200,230 215,210" fill="#0F172A" />
  <polygon points="195,245 200,250 205,245 200,240" fill="#0F172A" />
  <text x="200" y="340" text-anchor="middle" font-family="'Oswald', sans-serif" font-size="20" font-weight="700" fill="#EAB308" letter-spacing="6">ADDIS ABABA</text>
</svg>
`.trim()

// 5. Minimalist Botanical Line Art
const SVG_BOTANICAL = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="190" r="120" fill="#E9D5C3" />
  <path d="M 200 330 Q 195 240 200 150 Q 202 100 200 70" fill="none" stroke="#2D3142" stroke-width="4.5" stroke-linecap="round" />
  <path d="M 200 240 C 150 220 130 190 140 160 C 170 170 190 200 200 240 Z" fill="none" stroke="#2D3142" stroke-width="4" stroke-linejoin="round" />
  <path d="M 200 200 C 250 180 270 150 260 120 C 230 130 210 160 200 200 Z" fill="none" stroke="#2D3142" stroke-width="4" stroke-linejoin="round" />
  <path d="M 200 150 C 160 130 145 105 155 80 C 180 90 195 120 200 150 Z" fill="none" stroke="#2D3142" stroke-width="4" stroke-linejoin="round" />
  <text x="200" y="365" text-anchor="middle" font-family="'Playfair Display', serif" font-size="18" font-style="italic" fill="#2D3142" letter-spacing="3">L'harmonie Botanique</text>
</svg>
`.trim()

// 6. Bold Urban Streetwear
const SVG_STREETWEAR = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="360" height="360" fill="#000000" />
  <rect x="35" y="35" width="330" height="330" fill="none" stroke="#FFFFFF" stroke-width="3" />
  <text x="200" y="140" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" letter-spacing="8">OVER</text>
  <rect x="60" y="165" width="280" height="40" fill="#FF0033" />
  <text x="200" y="195" text-anchor="middle" font-family="'Impact', sans-serif" font-size="32" font-weight="900" fill="#FFFFFF" letter-spacing="12">DRIVE</text>
  <text x="200" y="280" text-anchor="middle" font-family="'Impact', sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" letter-spacing="8">STUDIO</text>
  <text x="200" y="335" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="#888888" letter-spacing="6">WORLDWIDE PRINT FLOW</text>
</svg>
`.trim()

// 7. Wavy "Be Good Do Good" Typography
const SVG_BE_GOOD = `
<svg viewBox="0 0 400 360" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="wave1" d="M 20 90 Q 110 50 200 90 T 380 90" fill="none" />
    <path id="wave2" d="M 20 180 Q 110 140 200 180 T 380 180" fill="none" />
    <path id="wave3" d="M 20 270 Q 110 230 200 270 T 380 270" fill="none" />
  </defs>
  <text font-family="'Pacifico', 'Impact', sans-serif" font-size="54" font-weight="900" fill="#4A3B32" letter-spacing="2">
    <textPath href="#wave1" startOffset="50%" text-anchor="middle">be good</textPath>
  </text>
  <text font-family="'Pacifico', 'Impact', sans-serif" font-size="58" font-weight="900" fill="#E07A5F" letter-spacing="2">
    <textPath href="#wave2" startOffset="50%" text-anchor="middle">do good</textPath>
  </text>
  <text font-family="'Pacifico', 'Impact', sans-serif" font-size="54" font-weight="900" fill="#3D405B" letter-spacing="2">
    <textPath href="#wave3" startOffset="50%" text-anchor="middle">be good</textPath>
  </text>
</svg>
`.trim()

// 8. Sacred Flaming Heart (Vintage Tattoo Style)
const SVG_SACRED_HEART = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Glowing sunburst rays -->
  <g stroke="#F59E0B" stroke-width="2" opacity="0.6">
    <line x1="200" y1="20" x2="200" y2="70" />
    <line x1="200" y1="330" x2="200" y2="380" />
    <line x1="20" y1="200" x2="70" y2="200" />
    <line x1="330" y1="200" x2="380" y2="200" />
    <line x1="72" y1="72" x2="108" y2="108" />
    <line x1="292" y1="292" x2="328" y2="328" />
    <line x1="72" y1="328" x2="108" y2="292" />
    <line x1="292" y1="108" x2="328" y2="72" />
  </g>
  <!-- Flame top -->
  <path d="M 200 40 C 230 70, 240 100, 200 130 C 160 100, 170 70, 200 40 Z" fill="#EF4444" />
  <path d="M 175 70 C 185 90, 195 105, 180 125 C 165 110, 170 90, 175 70 Z" fill="#F59E0B" />
  <path d="M 225 70 C 215 90, 205 105, 220 125 C 235 110, 230 90, 225 70 Z" fill="#F59E0B" />
  <!-- Main heart -->
  <path d="M 200 130 C 120 70, 60 170, 200 310 C 340 170, 280 70, 200 130 Z" fill="#DC2626" stroke="#991B1B" stroke-width="6" />
  <!-- Crown of thorns -->
  <ellipse cx="200" cy="180" rx="65" ry="14" fill="none" stroke="#78350F" stroke-width="6" />
  <!-- Dagger passing through -->
  <path d="M 150 140 L 250 240" stroke="#E2E8F0" stroke-width="8" stroke-linecap="round" />
  <!-- Banner -->
  <path d="M 90 280 Q 200 260 310 280 L 300 320 Q 200 300 100 320 Z" fill="#FEF3C7" stroke="#B45309" stroke-width="2" />
  <text x="200" y="302" text-anchor="middle" font-family="'Georgia', serif" font-size="16" font-weight="900" fill="#78350F" letter-spacing="3">ETERNAL LOVE</text>
</svg>
`.trim()

// 9. Pacific Surf Club 1978
const SVG_SURF_CLUB = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect x="25" y="25" width="350" height="350" rx="36" fill="#0369A1" />
  <rect x="35" y="35" width="330" height="330" rx="28" fill="none" stroke="#BAE6FD" stroke-width="3" stroke-dasharray="8 4" />
  <!-- Golden Sun -->
  <circle cx="200" cy="150" r="65" fill="#FBBF24" />
  <!-- Big wave -->
  <path d="M 50 280 C 120 280, 160 210, 220 180 C 270 155, 300 170, 310 210 C 270 190, 230 220, 200 280 Z" fill="#38BDF8" />
  <path d="M 50 280 C 140 280, 180 230, 240 220 C 300 210, 330 250, 350 280 Z" fill="#0284C7" />
  <!-- Surfboard silhouette -->
  <ellipse cx="200" cy="235" rx="75" ry="10" fill="#F8FAFC" transform="rotate(-25 200 235)" />
  <text x="200" y="85" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" font-weight="900" fill="#FEF08A" letter-spacing="4">PACIFIC SURF CLUB</text>
  <text x="200" y="330" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="800" fill="#FFFFFF" letter-spacing="6">ENDLESS SWELL · 1978</text>
</svg>
`.trim()

// 10. Heavy Iron Athletics Barbell
const SVG_BARBELL = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="180" fill="#18181B" stroke="#3F3F46" stroke-width="6" />
  <!-- Weight Plates -->
  <rect x="70" y="130" width="16" height="140" rx="4" fill="#71717A" />
  <rect x="90" y="115" width="20" height="170" rx="4" fill="#A1A1AA" />
  <rect x="290" y="115" width="20" height="170" rx="4" fill="#A1A1AA" />
  <rect x="314" y="130" width="16" height="140" rx="4" fill="#71717A" />
  <!-- Barbell Bar -->
  <rect x="50" y="192" width="300" height="16" rx="3" fill="#E4E4E7" />
  <!-- Knurling texture on bar -->
  <line x1="140" y1="192" x2="140" y2="208" stroke="#71717A" stroke-width="2" />
  <line x1="260" y1="192" x2="260" y2="208" stroke="#71717A" stroke-width="2" />
  <!-- Typography -->
  <text x="200" y="95" text-anchor="middle" font-family="'Impact', sans-serif" font-size="34" font-weight="900" fill="#E4E4E7" letter-spacing="5">IRON DIVISION</text>
  <text x="200" y="295" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" font-weight="900" fill="#E11D48" letter-spacing="4">HEAVY ATHLETICS</text>
  <text x="200" y="330" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#71717A" letter-spacing="6">NO SHORTCUTS · EST. 2012</text>
</svg>
`.trim()

// 11. Japanese Crane & Rising Sun
const SVG_JAPANESE_CRANE = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="360" height="360" rx="16" fill="#0C0A09" />
  <!-- Big Red Sun -->
  <circle cx="200" cy="180" r="105" fill="#DC2626" />
  <!-- Crane origami/stylized silhouette -->
  <polygon points="200,90 280,220 200,190" fill="#FFFFFF" />
  <polygon points="200,90 120,220 200,190" fill="#E7E5E4" />
  <polygon points="200,190 200,280 180,260" fill="#A8A29E" />
  <!-- Pine branch at bottom -->
  <path d="M 70 300 Q 200 270 330 300" stroke="#78716C" stroke-width="4" fill="none" />
  <!-- Kanji / Modern Typography -->
  <text x="200" y="340" text-anchor="middle" font-family="'Arial', sans-serif" font-size="20" font-weight="800" fill="#FAFAF9" letter-spacing="10">TOKYO · NIPPON</text>
</svg>
`.trim()

// 12. Cyberpunk Y2K Star Overdrive
const SVG_CYBER_STAR = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="360" height="360" fill="#030712" />
  <!-- Y2K Chrome 4-point Star -->
  <path d="M 200 40 Q 200 170 330 200 Q 200 230 200 360 Q 200 230 70 200 Q 200 170 200 40 Z" fill="#67E8F9" stroke="#E0E7FF" stroke-width="4" />
  <path d="M 200 100 Q 200 185 285 200 Q 200 215 200 300 Q 200 215 115 200 Q 200 185 200 100 Z" fill="#A855F7" />
  <!-- Concentric Orbital Ring -->
  <ellipse cx="200" cy="200" rx="150" ry="45" fill="none" stroke="#22D3EE" stroke-width="3" transform="rotate(-30 200 200)" />
  <text x="200" y="340" text-anchor="middle" font-family="'Impact', sans-serif" font-size="26" font-weight="900" fill="#F43F5E" letter-spacing="6">SYSTEM OVERLOAD</text>
  <text x="200" y="365" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#38BDF8" letter-spacing="4">// Y2K PROTOCOL 2099</text>
</svg>
`.trim()

// 13. Campfire & Night Pines (National Park Badge)
const SVG_CAMPFIRE = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Arch badge shape -->
  <path d="M 70 340 L 70 170 C 70 90, 130 40, 200 40 C 270 40, 330 90, 330 170 L 330 340 Z" fill="#14532D" stroke="#FEF08A" stroke-width="5" />
  <!-- Moon -->
  <circle cx="200" cy="110" r="30" fill="#FEF08A" />
  <!-- Crossed Fire Logs -->
  <line x1="140" y1="280" x2="260" y2="240" stroke="#78350F" stroke-width="12" stroke-linecap="round" />
  <line x1="140" y1="240" x2="260" y2="280" stroke="#9A3412" stroke-width="12" stroke-linecap="round" />
  <!-- Flame -->
  <path d="M 200 180 Q 230 230 200 255 Q 170 230 200 180 Z" fill="#F97316" />
  <path d="M 200 205 Q 215 235 200 250 Q 185 235 200 205 Z" fill="#FDE047" />
  <text x="200" y="315" text-anchor="middle" font-family="'Impact', sans-serif" font-size="24" font-weight="900" fill="#FEF08A" letter-spacing="4">INTO THE WILD</text>
</svg>
`.trim()

// 14. Retro Smiling Flower Daisy (70s Groove)
const SVG_RETRO_FLOWER = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- 8 Petals -->
  <circle cx="200" cy="100" r="45" fill="#F43F5E" />
  <circle cx="270" cy="130" r="45" fill="#F43F5E" />
  <circle cx="300" cy="200" r="45" fill="#F43F5E" />
  <circle cx="270" cy="270" r="45" fill="#F43F5E" />
  <circle cx="200" cy="300" r="45" fill="#F43F5E" />
  <circle cx="130" cy="270" r="45" fill="#F43F5E" />
  <circle cx="100" cy="200" r="45" fill="#F43F5E" />
  <circle cx="130" cy="130" r="45" fill="#F43F5E" />
  <!-- Center face -->
  <circle cx="200" cy="200" r="65" fill="#FBBF24" stroke="#78350F" stroke-width="4" />
  <!-- Eyes -->
  <ellipse cx="180" cy="190" rx="8" ry="12" fill="#18181B" />
  <ellipse cx="220" cy="190" rx="8" ry="12" fill="#18181B" />
  <!-- Big Smile -->
  <path d="M 175 215 Q 200 245 225 215" fill="none" stroke="#18181B" stroke-width="5" stroke-linecap="round" />
  <text x="200" y="365" text-anchor="middle" font-family="'Impact', sans-serif" font-size="26" font-weight="900" fill="#BE123C" letter-spacing="4">KEEP SMILING</text>
</svg>
`.trim()

// 15. Deep Space Astronaut Odyssey
const SVG_ASTRONAUT = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="185" fill="#090A1A" stroke="#3B82F6" stroke-width="4" />
  <!-- Stars -->
  <circle cx="100" cy="90" r="2" fill="#FFFFFF" />
  <circle cx="310" cy="110" r="2.5" fill="#FFFFFF" />
  <circle cx="80" cy="260" r="1.5" fill="#FFFFFF" />
  <circle cx="320" cy="280" r="2" fill="#FFFFFF" />
  <!-- Astronaut Helmet -->
  <circle cx="200" cy="190" r="85" fill="#E2E8F0" />
  <ellipse cx="200" cy="185" rx="65" ry="50" fill="#0284C7" />
  <!-- Gold visor reflection -->
  <path d="M 150 170 Q 200 150 250 170 Q 240 215 160 215 Z" fill="#F59E0B" opacity="0.85" />
  <text x="200" y="330" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" font-weight="900" fill="#60A5FA" letter-spacing="6">DEEP SPACE</text>
  <text x="200" y="355" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#94A3B8" letter-spacing="5">MISSION TO MARS · 2035</text>
</svg>
`.trim()

// 16. Vintage Motorcycle Garage & Customs
const SVG_MOTORCYCLE = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <polygon points="200,20 370,120 370,280 200,380 30,280 30,120" fill="#1C1917" stroke="#EA580C" stroke-width="6" />
  <!-- Piston / Wings Graphic -->
  <path d="M 120 180 L 200 130 L 280 180 L 250 220 L 150 220 Z" fill="#E7E5E4" />
  <line x1="80" y1="200" x2="320" y2="200" stroke="#EA580C" stroke-width="4" />
  <text x="200" y="95" text-anchor="middle" font-family="'Impact', sans-serif" font-size="34" font-weight="900" fill="#F97316" letter-spacing="6">IRON HORSE</text>
  <text x="200" y="270" text-anchor="middle" font-family="'Impact', sans-serif" font-size="26" font-weight="900" fill="#E7E5E4" letter-spacing="4">SPEED &amp; CUSTOM</text>
  <text x="200" y="325" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#A8A29E" letter-spacing="6">BORN FREE · EST. 1973</text>
</svg>
`.trim()

// 17. Pacific Crest Pine Trails (Outdoor Wilderness)
const SVG_PINE_TRAILS = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <polygon points="200,20 370,118 370,314 200,412 30,314 30,118" fill="#14281D" stroke="#D1AC64" stroke-width="5" />
  <polygon points="200,34 358,125 358,307 200,398 42,307 42,125" fill="none" stroke="#D1AC64" stroke-width="2" stroke-dasharray="8 4" />
  <circle cx="200" cy="160" r="55" fill="#E89234" />
  <polygon points="200,90 280,240 120,240" fill="#F3EFE6" />
  <polygon points="200,90 280,240 200,240" fill="#D3CFC6" />
  <!-- Pine Trees -->
  <polygon points="150,180 180,250 120,250" fill="#0C1B12" />
  <polygon points="250,180 280,250 220,250" fill="#0C1B12" />
  <polygon points="200,160 235,260 165,260" fill="#061009" />
  <rect x="70" y="270" width="260" height="38" rx="6" fill="#D1AC64" />
  <text x="200" y="296" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="20" font-weight="900" fill="#14281D" letter-spacing="3">PACIFIC CREST</text>
  <text x="200" y="340" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#E89234" letter-spacing="5">PINE TRAILS · EST. 1968</text>
</svg>
`.trim()

// 18. Endless Summer Surf Co. (Outdoor / Retro)
const SVG_SURF_PALMS = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="surf-sun-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF3366" />
      <stop offset="50%" stop-color="#FF9933" />
      <stop offset="100%" stop-color="#FFCC00" />
    </linearGradient>
  </defs>
  <circle cx="200" cy="200" r="180" fill="#0A1128" />
  <circle cx="200" cy="180" r="110" fill="url(#surf-sun-grad)" />
  <!-- Wave curls -->
  <path d="M 60 220 Q 140 160 220 220 T 360 220 L 360 300 L 60 300 Z" fill="#00C4CC" />
  <path d="M 40 250 Q 130 190 220 250 T 380 250 L 380 320 L 40 320 Z" fill="#0A1128" />
  <!-- Palm silhouettes -->
  <path d="M 120 260 Q 135 180 150 140 Q 110 120 80 140 M 150 140 Q 130 100 110 90 M 150 140 Q 165 95 190 100 M 150 140 Q 180 125 200 145" stroke="#0A1128" stroke-width="6" stroke-linecap="round" fill="none" />
  <text x="200" y="325" text-anchor="middle" font-family="'Impact', sans-serif" font-size="32" font-weight="900" fill="#FFCC00" letter-spacing="4">ENDLESS SUMMER</text>
  <text x="200" y="352" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#00C4CC" letter-spacing="4">NORTH SHORE SURF CO.</text>
</svg>
`.trim()

// 19. Cyber Underground Skull (Streetwear)
const SVG_CYBER_SKULL = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="185" fill="#090A0F" />
  <circle cx="200" cy="200" r="172" fill="none" stroke="#00FFCC" stroke-width="3" stroke-dasharray="16 8" />
  <!-- Crossed Bones -->
  <line x1="80" y1="80" x2="320" y2="320" stroke="#FF0055" stroke-width="12" stroke-linecap="round" />
  <line x1="320" y1="80" x2="80" y2="320" stroke="#FF0055" stroke-width="12" stroke-linecap="round" />
  <!-- Cyber Skull -->
  <path d="M 130 140 C 130 80, 270 80, 270 140 C 270 170, 255 195, 245 220 L 235 270 L 165 270 L 155 220 C 145 195, 130 170, 130 140 Z" fill="#F0F0F5" />
  <!-- Eye Sockets -->
  <ellipse cx="170" cy="155" rx="22" ry="26" fill="#090A0F" />
  <ellipse cx="230" cy="155" rx="22" ry="26" fill="#090A0F" />
  <polygon points="200,185 190,210 210,210" fill="#090A0F" />
  <!-- Cyber HUD Lines -->
  <line x1="168" y1="155" x2="232" y2="155" stroke="#00FFCC" stroke-width="3" />
  <circle cx="170" cy="155" r="8" fill="#FF0055" />
  <circle cx="230" cy="155" r="8" fill="#FF0055" />
  <!-- Teeth Grid -->
  <line x1="170" y1="245" x2="230" y2="245" stroke="#090A0F" stroke-width="3" />
  <line x1="185" y1="230" x2="185" y2="260" stroke="#090A0F" stroke-width="3" />
  <line x1="200" y1="230" x2="200" y2="260" stroke="#090A0F" stroke-width="3" />
  <line x1="215" y1="230" x2="215" y2="260" stroke="#090A0F" stroke-width="3" />
  <text x="200" y="325" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" font-weight="900" fill="#00FFCC" letter-spacing="5">CYBER TOKYO</text>
  <text x="200" y="352" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="800" fill="#FF0055" letter-spacing="6">NEO-CORP · SYSTEM 2099</text>
</svg>
`.trim()

// 20. Tokyo Neon Shinjuku (Japanese / Streetwear)
const SVG_TOKYO_NEON = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" rx="30" fill="#0D0914" />
  <circle cx="200" cy="180" r="115" fill="#E6004C" opacity="0.85" />
  <!-- Neon Box Outline -->
  <rect x="75" y="65" width="250" height="270" fill="none" stroke="#00F0FF" stroke-width="4" rx="4" />
  <rect x="85" y="75" width="230" height="250" fill="none" stroke="#FFE600" stroke-width="1.5" stroke-dasharray="6 3" />
  <!-- Japanese Kanji "東京" (Tokyo) -->
  <text x="200" y="175" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="78" font-weight="900" fill="#FFFFFF" letter-spacing="8">東京</text>
  <text x="200" y="240" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" font-weight="900" fill="#00F0FF" letter-spacing="8">SHINJUKU</text>
  <line x1="110" y1="260" x2="290" y2="260" stroke="#FFE600" stroke-width="3" />
  <text x="200" y="295" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" letter-spacing="6">NIGHT CITY RUNNER</text>
</svg>
`.trim()

// 21. Vintage Vinyl Record & Soundwave (Retro)
const SVG_VINTAGE_VINYL = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="185" fill="#181513" />
  <circle cx="200" cy="200" r="165" fill="none" stroke="#2B2724" stroke-width="6" />
  <circle cx="200" cy="200" r="145" fill="none" stroke="#221E1C" stroke-width="8" />
  <circle cx="200" cy="200" r="125" fill="none" stroke="#2B2724" stroke-width="6" />
  <!-- Vinyl Label -->
  <circle cx="200" cy="200" r="75" fill="#E2843A" />
  <circle cx="200" cy="200" r="65" fill="#F1C27D" />
  <circle cx="200" cy="200" r="16" fill="#181513" />
  <circle cx="200" cy="200" r="7" fill="#F1C27D" />
  <text x="200" y="172" text-anchor="middle" font-family="'Georgia', serif" font-size="13" font-weight="bold" fill="#181513" letter-spacing="3">ANALOG SOUND</text>
  <text x="200" y="235" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#181513" letter-spacing="4">33 ⅓ RPM · STEREO</text>
  <text x="200" y="325" text-anchor="middle" font-family="'Impact', sans-serif" font-size="30" font-weight="900" fill="#F1C27D" letter-spacing="4">HIGH FIDELITY</text>
  <text x="200" y="352" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#E2843A" letter-spacing="5">VINYL STUDIO RECORDINGS</text>
</svg>
`.trim()

// 22. Golden Gloves Boxing Gym (Athletics)
const SVG_BOXING_CLUB = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <polygon points="200,20 370,118 370,314 200,412 30,314 30,118" fill="#1A1821" stroke="#E6B800" stroke-width="5" />
  <!-- Stars -->
  <polygon points="200,60 205,74 219,74 208,82 212,96 200,88 188,96 192,82 181,74 195,74" fill="#E6B800" />
  <polygon points="140,80 144,91 156,91 146,98 150,110 140,103 130,110 134,98 124,91 136,91" fill="#E6B800" />
  <polygon points="260,80 264,91 276,91 266,98 270,110 260,103 250,110 254,98 244,91 256,91" fill="#E6B800" />
  <!-- Gloves Silhouette -->
  <path d="M 140 180 C 130 140, 180 140, 185 170 C 195 160, 205 180, 195 200 L 175 240 L 145 235 Z" fill="#C22E2E" stroke="#E6B800" stroke-width="2" />
  <path d="M 260 180 C 270 140, 220 140, 215 170 C 205 160, 195 180, 205 200 L 225 240 L 255 235 Z" fill="#C22E2E" stroke="#E6B800" stroke-width="2" />
  <text x="200" y="280" text-anchor="middle" font-family="'Impact', sans-serif" font-size="30" font-weight="900" fill="#FFFFFF" letter-spacing="3">GOLDEN GLOVES</text>
  <text x="200" y="310" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" font-weight="900" fill="#E6B800" letter-spacing="4">FIGHT CLUB</text>
  <text x="200" y="345" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#C22E2E" letter-spacing="5">CHAMPIONS DIVISION · 1982</text>
</svg>
`.trim()

// 23. Celestial Sun & Moon Eclipse (Minimal)
const SVG_SOLAR_ECLIPSE = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="180" fill="#FAF6EE" />
  <circle cx="200" cy="180" r="85" fill="#E8BD4A" />
  <!-- Interlocking Crescent Moon -->
  <path d="M 200 95 A 85 85 0 0 0 200 265 A 65 65 0 0 1 200 95 Z" fill="#1C1B24" />
  <!-- Radiant Sun Rays -->
  <line x1="200" y1="65" x2="200" y2="85" stroke="#1C1B24" stroke-width="3" stroke-linecap="round" />
  <line x1="200" y1="275" x2="200" y2="295" stroke="#1C1B24" stroke-width="3" stroke-linecap="round" />
  <line x1="95" y1="180" x2="115" y2="180" stroke="#1C1B24" stroke-width="3" stroke-linecap="round" />
  <line x1="285" y1="180" x2="305" y2="180" stroke="#1C1B24" stroke-width="3" stroke-linecap="round" />
  <line x1="126" y1="106" x2="140" y2="120" stroke="#1C1B24" stroke-width="3" stroke-linecap="round" />
  <line x1="260" y1="240" x2="274" y2="254" stroke="#1C1B24" stroke-width="3" stroke-linecap="round" />
  <line x1="126" y1="254" x2="140" y2="240" stroke="#1C1B24" stroke-width="3" stroke-linecap="round" />
  <line x1="260" y1="120" x2="274" y2="106" stroke="#1C1B24" stroke-width="3" stroke-linecap="round" />
  <circle cx="200" cy="180" r="95" fill="none" stroke="#1C1B24" stroke-width="2" stroke-dasharray="4 6" />
  <text x="200" y="320" text-anchor="middle" font-family="'Playfair Display', serif" font-size="22" font-style="italic" font-weight="bold" fill="#1C1B24" letter-spacing="4">Sol &amp; Luna</text>
  <text x="200" y="350" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="600" fill="#8C7A58" letter-spacing="6">CELESTIAL HARMONY</text>
</svg>
`.trim()

// 24. Addis Golden Filigree Shield (Culture)
const SVG_ETHIOPIAN_SUNBURST = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="185" fill="#18231C" />
  <circle cx="200" cy="200" r="172" fill="none" stroke="#E6B800" stroke-width="4" />
  <circle cx="200" cy="200" r="162" fill="none" stroke="#009A44" stroke-width="2" stroke-dasharray="8 4" />
  <circle cx="200" cy="200" r="154" fill="none" stroke="#DA121A" stroke-width="2" stroke-dasharray="8 4" />
  <!-- Filigree 12-point Golden Starburst -->
  <polygon points="200,60 215,140 295,100 245,170 325,185 255,225 305,295 225,265 200,340 175,265 95,295 145,225 75,185 155,170 105,100 185,140" fill="#E6B800" />
  <!-- Inner Center Medallion -->
  <circle cx="200" cy="200" r="48" fill="#18231C" stroke="#E6B800" stroke-width="4" />
  <circle cx="200" cy="200" r="32" fill="#DA121A" />
  <circle cx="200" cy="200" r="18" fill="#009A44" />
  <circle cx="200" cy="200" r="8" fill="#E6B800" />
  <text x="200" y="325" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="24" font-weight="900" fill="#E6B800" letter-spacing="6">ADDIS ABABA</text>
  <text x="200" y="352" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" letter-spacing="5">ETHIOPIAN HERITAGE · 1886</text>
</svg>
`.trim()

export const SAMPLE_GRAPHICS: GraphicItem[] = [
  {
    id: 'g-begood',
    name: 'Be Good Do Good (Retro Wave)',
    category: 'retro',
    svg: SVG_BE_GOOD,
    previewUrl: svgToDataUrl(SVG_BE_GOOD),
  },
  {
    id: 'g-mountain',
    name: 'Wild Explorer Badge',
    category: 'outdoor',
    svg: SVG_MOUNTAIN,
    previewUrl: svgToDataUrl(SVG_MOUNTAIN),
  },
  {
    id: 'g-coffee',
    name: 'Habesha Coffee Roasters',
    category: 'coffee',
    svg: SVG_COFFEE,
    previewUrl: svgToDataUrl(SVG_COFFEE),
  },
  {
    id: 'g-retro',
    name: '80s Synthwave Sunset',
    category: 'retro',
    svg: SVG_RETRO,
    previewUrl: svgToDataUrl(SVG_RETRO),
  },
  {
    id: 'g-heart',
    name: 'Eternal Sacred Heart',
    category: 'retro',
    svg: SVG_SACRED_HEART,
    previewUrl: svgToDataUrl(SVG_SACRED_HEART),
  },
  {
    id: 'g-surf',
    name: 'Pacific Surf Club 1978',
    category: 'retro',
    svg: SVG_SURF_CLUB,
    previewUrl: svgToDataUrl(SVG_SURF_CLUB),
  },
  {
    id: 'g-barbell',
    name: 'Iron Division Athletics',
    category: 'athletics',
    svg: SVG_BARBELL,
    previewUrl: svgToDataUrl(SVG_BARBELL),
  },
  {
    id: 'g-streetwear',
    name: 'Overdrive Streetwear',
    category: 'streetwear',
    svg: SVG_STREETWEAR,
    previewUrl: svgToDataUrl(SVG_STREETWEAR),
  },
  {
    id: 'g-cyber',
    name: 'Cyberpunk Y2K Star',
    category: 'streetwear',
    svg: SVG_CYBER_STAR,
    previewUrl: svgToDataUrl(SVG_CYBER_STAR),
  },
  {
    id: 'g-lion',
    name: 'Addis Lion Crest',
    category: 'culture',
    svg: SVG_LION,
    previewUrl: svgToDataUrl(SVG_LION),
  },
  {
    id: 'g-botanical',
    name: 'Botanical Line Flora',
    category: 'minimal',
    svg: SVG_BOTANICAL,
    previewUrl: svgToDataUrl(SVG_BOTANICAL),
  },
  {
    id: 'g-japanese',
    name: 'Japanese Crane & Sun',
    category: 'japanese',
    svg: SVG_JAPANESE_CRANE,
    previewUrl: svgToDataUrl(SVG_JAPANESE_CRANE),
  },
  {
    id: 'g-campfire',
    name: 'National Park Campfire',
    category: 'outdoor',
    svg: SVG_CAMPFIRE,
    previewUrl: svgToDataUrl(SVG_CAMPFIRE),
  },
  {
    id: 'g-flower',
    name: 'Groovy Retro Daisy',
    category: 'retro',
    svg: SVG_RETRO_FLOWER,
    previewUrl: svgToDataUrl(SVG_RETRO_FLOWER),
  },
  {
    id: 'g-space',
    name: 'Deep Space Odyssey',
    category: 'minimal',
    svg: SVG_ASTRONAUT,
    previewUrl: svgToDataUrl(SVG_ASTRONAUT),
  },
  {
    id: 'g-moto',
    name: 'Iron Horse Motorcycles',
    category: 'retro',
    svg: SVG_MOTORCYCLE,
    previewUrl: svgToDataUrl(SVG_MOTORCYCLE),
  },
  {
    id: 'g-pine',
    name: 'Pacific Crest Pine Trails',
    category: 'outdoor',
    svg: SVG_PINE_TRAILS,
    previewUrl: svgToDataUrl(SVG_PINE_TRAILS),
  },
  {
    id: 'g-surfsun',
    name: 'Endless Summer Surf Co.',
    category: 'outdoor',
    svg: SVG_SURF_PALMS,
    previewUrl: svgToDataUrl(SVG_SURF_PALMS),
  },
  {
    id: 'g-cyberskull',
    name: 'Tokyo Cyber Skull',
    category: 'streetwear',
    svg: SVG_CYBER_SKULL,
    previewUrl: svgToDataUrl(SVG_CYBER_SKULL),
  },
  {
    id: 'g-tokyoneon',
    name: 'Tokyo Neon Shinjuku',
    category: 'japanese',
    svg: SVG_TOKYO_NEON,
    previewUrl: svgToDataUrl(SVG_TOKYO_NEON),
  },
  {
    id: 'g-vinyl',
    name: 'Vintage Analog Soundwave',
    category: 'retro',
    svg: SVG_VINTAGE_VINYL,
    previewUrl: svgToDataUrl(SVG_VINTAGE_VINYL),
  },
  {
    id: 'g-boxing',
    name: 'Golden Gloves Boxing Gym',
    category: 'athletics',
    svg: SVG_BOXING_CLUB,
    previewUrl: svgToDataUrl(SVG_BOXING_CLUB),
  },
  {
    id: 'g-eclipse',
    name: 'Celestial Sun & Moon',
    category: 'minimal',
    svg: SVG_SOLAR_ECLIPSE,
    previewUrl: svgToDataUrl(SVG_SOLAR_ECLIPSE),
  },
  {
    id: 'g-sunburst',
    name: 'Addis Golden Filigree Shield',
    category: 'culture',
    svg: SVG_ETHIOPIAN_SUNBURST,
    previewUrl: svgToDataUrl(SVG_ETHIOPIAN_SUNBURST),
  },

  // ── SEWED & CHENILLE GRAPHICS (Exact Match to User Image 1 & 2) ──
  {
    id: 'g-newday-chenille',
    name: 'NEW DAY Puffy Chenille (Image 1)',
    category: 'sewed',
    defaultPrintMethod: 'chenille',
    svg: `
<svg viewBox="0 0 500 360" xmlns="http://www.w3.org/2000/svg">
  <g>
    <!-- Thick loop letter base with rounded joints -->
    <text x="250" y="160" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="130" font-weight="900" fill="#141414" letter-spacing="8" stroke="#141414" stroke-width="12" stroke-linejoin="round">NEW</text>
    <text x="250" y="300" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="130" font-weight="900" fill="#141414" letter-spacing="8" stroke="#141414" stroke-width="12" stroke-linejoin="round">DAY</text>
    <!-- Micro loop fringe stitch highlights -->
    <text x="250" y="160" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="130" font-weight="900" fill="none" letter-spacing="8" stroke="#383838" stroke-width="3" stroke-dasharray="4 2" stroke-linejoin="round">NEW</text>
    <text x="250" y="300" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="130" font-weight="900" fill="none" letter-spacing="8" stroke="#383838" stroke-width="3" stroke-dasharray="4 2" stroke-linejoin="round">DAY</text>
  </g>
</svg>
    `.trim(),
    get previewUrl() { return svgToDataUrl(this.svg) }
  },
  {
    id: 'g-embroidered-heart',
    name: '3D Embroidered Heart Patch',
    category: 'sewed',
    defaultPrintMethod: 'embroidery',
    svg: `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="heart-thread-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E53935" />
      <stop offset="50%" stop-color="#C62828" />
      <stop offset="100%" stop-color="#8E0000" />
    </linearGradient>
    <pattern id="heart-thread-ribs" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4" stroke="#FF8A80" stroke-width="0.8" stroke-opacity="0.4" />
    </pattern>
  </defs>
  <!-- Felt patch backing shadow -->
  <path d="M 200 340 C 90 240, 40 170, 70 100 C 95 45, 160 55, 200 110 C 240 55, 305 45, 330 100 C 360 170, 310 240, 200 340 Z" fill="#000000" opacity="0.35" transform="translate(0, 6)" />
  <!-- Merrowed outer stitch border -->
  <path d="M 200 340 C 90 240, 40 170, 70 100 C 95 45, 160 55, 200 110 C 240 55, 305 45, 330 100 C 360 170, 310 240, 200 340 Z" fill="#FFFFFF" stroke="#B71C1C" stroke-width="14" stroke-linejoin="round" />
  <path d="M 200 340 C 90 240, 40 170, 70 100 C 95 45, 160 55, 200 110 C 240 55, 305 45, 330 100 C 360 170, 310 240, 200 340 Z" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="3 2" />
  <!-- Satin stitch heart core -->
  <path d="M 200 325 C 105 230, 60 170, 85 110 C 105 65, 160 70, 200 120 C 240 70, 295 65, 315 110 C 340 170, 295 230, 200 325 Z" fill="url(#heart-thread-grad)" />
  <path d="M 200 325 C 105 230, 60 170, 85 110 C 105 65, 160 70, 200 120 C 240 70, 295 65, 315 110 C 340 170, 295 230, 200 325 Z" fill="url(#heart-thread-ribs)" />
  <!-- Specular satin sheen highlight -->
  <path d="M 115 115 C 135 90, 165 95, 185 125" stroke="#FFA4A4" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6" />
</svg>
    `.trim(),
    get previewUrl() { return svgToDataUrl(this.svg) }
  },
  {
    id: 'g-varsity-chenille',
    name: 'Varsity Chenille Letter "A"',
    category: 'sewed',
    defaultPrintMethod: 'chenille',
    svg: `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <g>
    <!-- Outer Felt Border -->
    <path d="M 200 40 L 330 360 L 265 360 L 235 280 L 165 280 L 135 360 L 70 360 Z M 180 230 L 220 230 L 200 150 Z" fill="#F4E8C1" stroke="#F4E8C1" stroke-width="16" stroke-linejoin="round" />
    <!-- Merrowed Stitch Outline -->
    <path d="M 200 40 L 330 360 L 265 360 L 235 280 L 165 280 L 135 360 L 70 360 Z M 180 230 L 220 230 L 200 150 Z" fill="#1B2A4A" stroke="#C59B27" stroke-width="6" stroke-linejoin="round" />
    <path d="M 200 40 L 330 360 L 265 360 L 235 280 L 165 280 L 135 360 L 70 360 Z M 180 230 L 220 230 L 200 150 Z" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="3 2" />
  </g>
</svg>
    `.trim(),
    get previewUrl() { return svgToDataUrl(this.svg) }
  },
  {
    id: 'g-chainstitch-script',
    name: 'Vintage Chain-Stitch "Good Vibes"',
    category: 'sewed',
    defaultPrintMethod: 'embroidery',
    svg: `
<svg viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(20, 40)">
    <path d="M 20 80 Q 50 20 90 70 Q 120 110 160 50 Q 200 20 240 80 Q 280 120 320 60 Q 360 20 390 70" fill="none" stroke="#E65100" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 20 80 Q 50 20 90 70 Q 120 110 160 50 Q 200 20 240 80 Q 280 120 320 60 Q 360 20 390 70" fill="none" stroke="#FFD54F" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 3" />
    <text x="200" y="140" text-anchor="middle" font-family="'Brush Script MT', cursive, sans-serif" font-size="44" font-weight="bold" fill="#E65100">Good Vibes Only</text>
    <text x="200" y="140" text-anchor="middle" font-family="'Brush Script MT', cursive, sans-serif" font-size="44" font-weight="bold" fill="none" stroke="#FFFFFF" stroke-width="1.2" stroke-dasharray="3 2">Good Vibes Only</text>
  </g>
</svg>
    `.trim(),
    get previewUrl() { return svgToDataUrl(this.svg) }
  },
]
