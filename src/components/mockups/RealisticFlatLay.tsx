/**
 * PrintFlow Realistic Studio Flat-Lay & On-Person Mockup Components — Senior Engineer Grade
 * Matching Printify's exact close-view preview standards (Image 1, 2, 3).
 */

'use client'

import React, { useId } from 'react'

export type PrintMethod = 'dtg' | 'embroidery' | 'chenille' | 'screen' | 'dtf' | 'vintage' | 'vinyl'

export interface ArtworkLayer {
  id: string
  type: 'image' | 'text'
  src?: string
  text?: string
  fontSize?: number
  fontFamily?: string
  color?: string
  bold?: boolean
  italic?: boolean
  align?: 'left' | 'center' | 'right'
  letterSpacing?: number
  arc?: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  flipX?: boolean
  opacity?: number
  view?: string
  visible?: boolean
  printMethod?: PrintMethod
}

export interface RealisticFlatLayProps {
  color?: string
  view?: string
  className?: string
  colorMode?: 'cmyk' | 'rgb'
  layers?: ArtworkLayer[]
  printBox?: { left: number; top: number; w: number; h: number }
  printMethod?: PrintMethod
  children?: React.ReactNode
}

function isColorDark(hex: string): boolean {
  if (!hex || !hex.startsWith('#')) return false
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16) || 0
  const g = parseInt(clean.substring(2, 4), 16) || 0
  const b = parseInt(clean.substring(4, 6), 16) || 0
  return 0.299 * r + 0.587 * g + 0.114 * b < 130
}

/**
 * Reusable physical manufacturing & print technique SVG filter shaders.
 * Authentically models:
 * - Chenille / Moss Stitch: thick tufted loop pile, radiating micro-thread fringe whiskers, 3D raised tactile relief (Matching Image 1)
 * - Embroidery: 3D raised satin stitch relief, directional thread ridges, specular satin sheen
 * - Direct-to-Garment (DTG): water-based ink embedded in micro combed-cotton fibers
 * - Screen Printing: thick opaque plastisol ink layer with crisp stencil edges
 * - Direct-to-Film (DTF): ultra-vibrant heat-press polymer film finish
 * - Vintage Discharge: soft-hand bleached fibers with weathered textile aesthetic
 * - Heat Transfer Vinyl (HTV): uniform matte rubberized cut finish with crisp bevel shadow
 */
export function PrintTechniqueSvgDefs({ id }: { id: string }) {
  return (
    <>
      {/* ── 1. EMBROIDERY / SEWED STITCHES (3D Satin Stitch Thread Relief, Directional Specular Light & Contact Drop Shadow) ── */}
      <filter id={`technique-embroidery-${id}`} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.12 0.85" numOctaves="3" result="threadGrain" />
        <feSpecularLighting in="threadGrain" surfaceScale="2.2" specularConstant="0.65" specularExponent="22" lightingColor="#FFFFFF" result="satinSheen">
          <feDistantLight azimuth="215" elevation="55" />
        </feSpecularLighting>
        <feComposite in="satinSheen" in2="SourceAlpha" operator="in" result="sheenMasked" />
        <feBlend mode="screen" in="SourceGraphic" in2="sheenMasked" result="litThread" />
        <feDropShadow in="litThread" dx="0.6" dy="1.4" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.45" />
      </filter>

      {/* ── 1B. CHENILLE / FUZZY MOSS-STITCH (Exact Match to User Image 1: Radiating Yarn Loop Whiskers, Tactile 3D Relief) ── */}
      <filter id={`technique-chenille-${id}`} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.48 0.48" numOctaves="4" result="loopNoise" />
        <feDisplacementMap in="SourceGraphic" in2="loopNoise" scale="4.2" xChannelSelector="R" yChannelSelector="G" result="fringedLoops" />
        <feTurbulence type="fractalNoise" baseFrequency="0.85 0.85" numOctaves="3" result="microFibers" />
        <feDisplacementMap in="fringedLoops" in2="microFibers" scale="1.8" xChannelSelector="B" yChannelSelector="R" result="fuzzyTufts" />
        <feDropShadow in="fuzzyTufts" dx="0.8" dy="1.6" stdDeviation="0.9" floodColor="#000000" floodOpacity="0.65" result="contactShadow" />
        <feDropShadow in="contactShadow" dx="2.0" dy="3.2" stdDeviation="2.8" floodColor="#000000" floodOpacity="0.32" />
      </filter>

      {/* ── 2. DIRECT-TO-GARMENT (DTG) (Water-based ink embedded in micro combed-cotton fibers) ── */}
      <filter id={`technique-dtg-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.85 0.85" numOctaves="2" result="fiberGrain" />
        <feDisplacementMap in="SourceGraphic" in2="fiberGrain" scale="0.75" xChannelSelector="R" yChannelSelector="G" result="embeddedInk" />
        <feComponentTransfer in="embeddedInk">
          <feFuncR type="linear" slope="1.02" />
          <feFuncG type="linear" slope="1.02" />
          <feFuncB type="linear" slope="1.02" />
        </feComponentTransfer>
      </filter>

      {/* ── 3. SCREEN PRINTING (Thick opaque plastisol ink layer, crisp stencil edges, subtle ink bevel) ── */}
      <filter id={`technique-screen-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feDropShadow in="SourceGraphic" dx="0.4" dy="0.6" stdDeviation="0.4" floodColor="#000000" floodOpacity="0.32" result="inkRelief" />
        <feComponentTransfer in="inkRelief">
          <feFuncR type="linear" slope="1.03" />
          <feFuncG type="linear" slope="1.03" />
          <feFuncB type="linear" slope="1.03" />
        </feComponentTransfer>
      </filter>

      {/* ── 4. DIRECT-TO-FILM (DTF) (High vibrancy, razor-sharp edge, smooth polymer film) ── */}
      <filter id={`technique-dtf-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feComponentTransfer in="SourceGraphic" result="vibrantFilm">
          <feFuncR type="linear" slope="1.05" />
          <feFuncG type="linear" slope="1.05" />
          <feFuncB type="linear" slope="1.05" />
        </feComponentTransfer>
        <feDropShadow in="vibrantFilm" dx="0.3" dy="0.45" stdDeviation="0.3" floodColor="#000000" floodOpacity="0.22" />
      </filter>

      {/* ── 5. VINTAGE DISCHARGE (Distressed soft-hand discharge, bleached cotton fiber feel) ── */}
      <filter id={`technique-vintage-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="3" result="vintageNoise" />
        <feDisplacementMap in="SourceGraphic" in2="vintageNoise" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="weathered" />
        <feColorMatrix in="weathered" type="matrix" values="
          0.96 0 0 0 0.02
          0 0.96 0 0 0.02
          0 0 0.96 0 0.02
          0 0 0 0.92 0" result="weatheredToned" />
        <feComposite in="weatheredToned" in2="SourceAlpha" operator="in" />
      </filter>

      {/* ── 6. HEAT TRANSFER VINYL (HTV) (Solid matte rubberized cut finish, crisp bevel edge) ── */}
      <filter id={`technique-vinyl-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feDropShadow in="SourceGraphic" dx="0.4" dy="0.7" stdDeviation="0.35" floodColor="#000000" floodOpacity="0.28" />
      </filter>
    </>
  )
}

/**
 * Projects design layers into target SVG chest box coordinates with 1:1 scale, rotation, and physical print shaders.
 */
export function renderLayersInSvg(
  layers: ArtworkLayer[] = [],
  printBox: { left: number; top: number; w: number; h: number } = { left: 152, top: 130, w: 196, h: 290 },
  targetChest: { x: number; y: number; width: number; height: number },
  side: string = 'front',
  colorMode: 'cmyk' | 'rgb' = 'rgb',
  svgDefsId?: string,
  globalPrintMethod?: PrintMethod
) {
  const normSide = (side || 'front').toLowerCase()
  const relevantLayers = layers.filter(l => {
    if (l.visible === false) return false
    const v = (l.view || 'Center chest').toLowerCase()
    if (normSide === 'all') return true
    if (normSide === 'front' || normSide === 'wrap' || normSide === 'front-side' || normSide.includes('handle')) {
      return v.includes('front') || v.includes('chest') || v.includes('center') || v.includes('right') || v.includes('left') || v.includes('crown') || v.includes('wrap') || v.includes('handle')
    } else if (normSide === 'back') {
      return v.includes('back') || v.includes('collar')
    } else if (normSide.includes('left')) {
      return v.includes('left') || v.includes('chest') || v.includes('center') || v.includes('front')
    } else if (normSide.includes('right')) {
      return v.includes('right') || v.includes('chest') || v.includes('center') || v.includes('front')
    }
    return true
  })

  return relevantLayers.map(l => {
    const relX = (l.x - printBox.left) / printBox.w
    const relY = (l.y - printBox.top) / printBox.h
    const relW = l.width / printBox.w
    const relH = l.height / printBox.h

    const x = targetChest.x + relX * targetChest.width
    const y = targetChest.y + relY * targetChest.height
    const w = relW * targetChest.width
    const h = relH * targetChest.height
    const cx = x + w / 2
    const cy = y + h / 2

    const scaleFactor = targetChest.width / printBox.w
    const fontSize = (l.fontSize ?? 28) * scaleFactor
    const rot = l.rotation || 0
    const flipX = l.flipX ? -1 : 1

    const transform = `translate(${cx}, ${cy}) rotate(${rot}) scale(${flipX}, 1) translate(${-cx}, ${-cy})`
    const method: PrintMethod = globalPrintMethod || l.printMethod || 'dtg'
    const filterAttr = svgDefsId ? `url(#technique-${method}-${svgDefsId})` : undefined

    if (l.type === 'image' && l.src) {
      return (
        <g key={l.id} transform={transform} opacity={l.opacity ?? 1} filter={filterAttr}>
          <image
            href={l.src}
            x={x}
            y={y}
            width={w}
            height={h}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      )
    }

    if (l.type === 'text') {
      if (l.arc && l.arc !== 0) {
        const arcPathId = `svg-arc-${l.id}`
        const arcD =
          l.arc > 0
            ? `M ${x},${y + h * 0.70} Q ${cx},${y + h * 0.70 - (l.arc / 180) * (h * 0.65)} ${x + w},${y + h * 0.70}`
            : `M ${x},${y + h * 0.30} Q ${cx},${y + h * 0.30 - (l.arc / 180) * (h * 0.65)} ${x + w},${y + h * 0.30}`

        return (
          <g key={l.id} transform={transform} opacity={l.opacity ?? 1} filter={filterAttr}>
            <defs>
              <path id={arcPathId} d={arcD} fill="none" />
            </defs>
            {/* 3D Thread contact shadow for raised stitch relief */}
            {(method === 'embroidery' || method === 'chenille') && (
              <text
                fill="#000000"
                opacity={0.35}
                fontFamily={l.fontFamily ?? 'Inter'}
                fontSize={fontSize}
                fontWeight={l.bold ? 'bold' : 'normal'}
                fontStyle={l.italic ? 'italic' : 'normal'}
                letterSpacing={l.letterSpacing ? l.letterSpacing * scaleFactor : 0}
                transform="translate(0.6, 0.9)"
              >
                <textPath href={`#${arcPathId}`} startOffset="50%" textAnchor="middle">
                  {l.text}
                </textPath>
              </text>
            )}
            {/* Primary Text Layer */}
            <text
              fill={l.color ?? '#000000'}
              fontFamily={l.fontFamily ?? 'Inter'}
              fontSize={fontSize}
              fontWeight={l.bold ? 'bold' : 'normal'}
              fontStyle={l.italic ? 'italic' : 'normal'}
              letterSpacing={l.letterSpacing ? l.letterSpacing * scaleFactor : 0}
              stroke={method === 'chenille' || method === 'embroidery' ? (l.color ?? '#000000') : undefined}
              strokeWidth={method === 'chenille' ? Math.max(1.2, fontSize * 0.055) : method === 'embroidery' ? Math.max(0.6, fontSize * 0.035) : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <textPath href={`#${arcPathId}`} startOffset="50%" textAnchor="middle">
                {l.text}
              </textPath>
            </text>
            {/* Satin Sheen Thread Ridge Highlight for Sewed / Embroidered Finish */}
            {(method === 'embroidery' || method === 'chenille') && (
              <text
                fill="none"
                fontFamily={l.fontFamily ?? 'Inter'}
                fontSize={fontSize}
                fontWeight={l.bold ? 'bold' : 'normal'}
                fontStyle={l.italic ? 'italic' : 'normal'}
                letterSpacing={l.letterSpacing ? l.letterSpacing * scaleFactor : 0}
                stroke="#FFFFFF"
                strokeWidth={Math.max(0.3, fontSize * 0.016)}
                strokeOpacity={method === 'chenille' ? 0.20 : 0.28}
                strokeDasharray={method === 'chenille' ? "3 2" : "2 1"}
                strokeLinejoin="round"
              >
                <textPath href={`#${arcPathId}`} startOffset="50%" textAnchor="middle">
                  {l.text}
                </textPath>
              </text>
            )}
          </g>
        )
      }

      const anchor = l.align === 'left' ? 'start' : l.align === 'right' ? 'end' : 'middle'
      const textX = l.align === 'left' ? x : l.align === 'right' ? x + w : cx
      const textY = cy + fontSize * 0.35

      return (
        <g key={l.id} transform={transform} opacity={l.opacity ?? 1} filter={filterAttr}>
          {/* 3D Thread contact shadow for raised stitch relief */}
          {(method === 'embroidery' || method === 'chenille') && (
            <text
              x={textX + 0.6}
              y={textY + 0.9}
              textAnchor={anchor}
              fill="#000000"
              opacity={0.35}
              fontFamily={l.fontFamily ?? 'Inter'}
              fontSize={fontSize}
              fontWeight={l.bold ? 'bold' : 'normal'}
              fontStyle={l.italic ? 'italic' : 'normal'}
              letterSpacing={l.letterSpacing ? l.letterSpacing * scaleFactor : 0}
            >
              {l.text}
            </text>
          )}
          {/* Main Typography Layer */}
          <text
            x={textX}
            y={textY}
            textAnchor={anchor}
            fill={l.color ?? '#000000'}
            fontFamily={l.fontFamily ?? 'Inter'}
            fontSize={fontSize}
            fontWeight={l.bold ? 'bold' : 'normal'}
            fontStyle={l.italic ? 'italic' : 'normal'}
            letterSpacing={l.letterSpacing ? l.letterSpacing * scaleFactor : 0}
            stroke={method === 'chenille' || method === 'embroidery' ? (l.color ?? '#000000') : undefined}
            strokeWidth={method === 'chenille' ? Math.max(1.2, fontSize * 0.055) : method === 'embroidery' ? Math.max(0.6, fontSize * 0.035) : undefined}
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            {l.text}
          </text>
          {/* Satin Sheen Highlight Dash Overlay for Sewed / Embroidered Finish */}
          {(method === 'embroidery' || method === 'chenille') && (
            <text
              x={textX}
              y={textY - 0.4}
              textAnchor={anchor}
              fill="none"
              fontFamily={l.fontFamily ?? 'Inter'}
              fontSize={fontSize}
              fontWeight={l.bold ? 'bold' : 'normal'}
              fontStyle={l.italic ? 'italic' : 'normal'}
              letterSpacing={l.letterSpacing ? l.letterSpacing * scaleFactor : 0}
              stroke="#FFFFFF"
              strokeWidth={Math.max(0.3, fontSize * 0.016)}
              strokeOpacity={method === 'chenille' ? 0.20 : 0.28}
              strokeDasharray={method === 'chenille' ? "3 2" : "2 1"}
              strokeLinejoin="round"
            >
              {l.text}
            </text>
          )}
        </g>
      )
    }

    return null
  })
}

/* ═══════════════════════════════════════════════════════════════════════════════
   1. CLOSE-VIEW REALISTIC T-SHIRT (Exact Match to Printify Image 3)
   ═══════════════════════════════════════════════════════════════════════════════ */
const TSHIRT_FLATLAY_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/tshirt-flatlay-white.png',
  '#1A1A12': '/mockups/tshirt-flatlay-black.png',
  '#1B2A4A': '/mockups/tshirt-flatlay-navy.png',
  '#C8C5C0': '/mockups/tshirt-flatlay-heather-grey.png',
  '#9A9A8E': '/mockups/tshirt-flatlay-heather-grey.png',
  '#C62828': '/mockups/tshirt-flatlay-red.png',
  '#2E4A2E': '/mockups/tshirt-flatlay-forest-green.png',
  '#4A5E35': '/mockups/tshirt-flatlay-olive.png',
  '#8FAF7A': '/mockups/tshirt-flatlay-sage.png',
  '#373435': '/mockups/tshirt-flatlay-pepper.png',
  '#7799B5': '/mockups/tshirt-flatlay-chambray.png',
  '#8DB8A7': '/mockups/tshirt-flatlay-seafoam.png',
  '#B86851': '/mockups/tshirt-flatlay-terracotta.png',
}

export function RealisticTShirtFlatLay({
  color = '#FFFFFF',
  view = 'front',
  className = '',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 152, top: 130, w: 196, h: 290 },
  printMethod,
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const isBack = view === 'back'
  const isDark = isColorDark(color)
  const normColor = (color || '#FFFFFF').toUpperCase()

  const directAsset = isBack
    ? '/mockups/tshirt-flatlay-studio-back.png'
    : TSHIRT_FLATLAY_ASSETS[normColor]

  const cleanHex = normColor.replace('#', '')
  const r = (parseInt(cleanHex.substring(0, 2), 16) || 255) / 255
  const g = (parseInt(cleanHex.substring(2, 4), 16) || 255) / 255
  const b = (parseInt(cleanHex.substring(4, 6), 16) || 255) / 255

  // Direct high-res photographic blank when available, or high-res white flat-lay dynamically tinted
  const assetUrl = directAsset || (isBack ? '/mockups/tshirt-flatlay-studio-back.png' : '/mockups/tshirt-flatlay-white.png')

  const targetChest = isBack
    ? { x: 310, y: 200, width: 365, height: 500 }
    : { x: 310, y: 225, width: 365, height: 490 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 985 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          {/* Physical print & embroidery shaders */}
          <PrintTechniqueSvgDefs id={id} />

          {/* Dynamic photographic fabric tinting for custom garment colors */}
          {!directAsset && !isBack && (
            <filter id={`garment-tint-${id}`} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values={`
                  ${r.toFixed(3)} 0 0 0 0
                  0 ${g.toFixed(3)} 0 0 0
                  0 0 ${b.toFixed(3)} 0 0
                  0 0 0 1 0
                `}
                result="baseDye"
              />
              <feComponentTransfer in="baseDye">
                <feFuncR type="linear" slope="1.06" intercept="0.015" />
                <feFuncG type="linear" slope="1.06" intercept="0.015" />
                <feFuncB type="linear" slope="1.06" intercept="0.015" />
              </feComponentTransfer>
            </filter>
          )}
        </defs>

        {/* ── Authentic Printify Studio Flat-Lay Photographic Blank (Crisp Natural Fabric & Folds) ── */}
        <image
          href={assetUrl}
          x="0"
          y="0"
          width="985"
          height="1024"
          filter={!directAsset && !isBack ? `url(#garment-tint-${id})` : undefined}
        />

        {/* ── Artwork Projected Directly Inside SVG Vector Space (Authentic Technique Finish) ── */}
        <g
          id="artwork-projection-group"
          style={{
            mixBlendMode: 'normal',
            filter: 'contrast(1.02) saturate(1.02)',
          }}
        >
          {renderLayersInSvg(layers, printBox, targetChest, view, colorMode, id, printMethod)}
        </g>

        {/* Authentic Fabric Fold & Lighting Crease Overlay */}
        <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }} opacity={0.15}>
          <image
            href={assetUrl}
            x="0"
            y="0"
            width="985"
            height="1024"
          />
        </g>
      </svg>

      {/* Optional custom children overlay */}
      {children && (
        <div
          style={{
            position: 'absolute',
            left: '30.7%',
            top: '22.5%',
            width: '38.5%',
            height: '48%',
            pointerEvents: 'none',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   1B. CLOSE-VIEW REALISTIC LONG-SLEEVE TEE FLAT-LAY (Ultra Cotton Heavyweight)
   ═══════════════════════════════════════════════════════════════════════════════ */
const LONGSLEEVE_FLATLAY_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/longsleeve-flatlay-white.png',
  '#C8C5C0': '/mockups/longsleeve-flatlay-grey.png',
  '#9A9A8E': '/mockups/longsleeve-flatlay-grey.png',
  '#D6ED17': '/mockups/longsleeve-flatlay-neon.png',
  '#DEDE00': '/mockups/longsleeve-flatlay-neon.png',
  '#18181B': '/mockups/longsleeve-flatlay-black.png',
  '#1A1A12': '/mockups/longsleeve-flatlay-black.png',
  '#1B2A4A': '/mockups/longsleeve-flatlay-navy.png',
  '#C62828': '/mockups/longsleeve-flatlay-red.png',
  '#1B4332': '/mockups/longsleeve-flatlay-forest-green.png',
  '#2E4A2E': '/mockups/longsleeve-flatlay-forest-green.png',
  '#5C1D24': '/mockups/longsleeve-flatlay-maroon.png',
  '#1D4ED8': '/mockups/longsleeve-flatlay-royal.png',
  '#D4C5B3': '/mockups/longsleeve-flatlay-sand.png',
  '#4B5320': '/mockups/longsleeve-flatlay-military-green.png',
  '#4A5E35': '/mockups/longsleeve-flatlay-military-green.png',
  '#EA580C': '/mockups/longsleeve-flatlay-orange.png',
  '#7BAED1': '/mockups/longsleeve-flatlay-carolina-blue.png',
  '#7799B5': '/mockups/longsleeve-flatlay-carolina-blue.png',
  '#4A4A48': '/mockups/longsleeve-flatlay-dark-heather.png',
  '#DEDEDB': '/mockups/longsleeve-flatlay-ash.png',
}

const LONGSLEEVE_BACK_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/longsleeve-flatlay-back-white.png',
  '#C8C5C0': '/mockups/longsleeve-flatlay-back-grey.png',
  '#9A9A8E': '/mockups/longsleeve-flatlay-back-grey.png',
  '#D6ED17': '/mockups/longsleeve-flatlay-back-neon.png',
  '#DEDE00': '/mockups/longsleeve-flatlay-back-neon.png',
  '#18181B': '/mockups/longsleeve-flatlay-back-black.png',
  '#1A1A12': '/mockups/longsleeve-flatlay-back-black.png',
  '#1B2A4A': '/mockups/longsleeve-flatlay-back-navy.png',
  '#C62828': '/mockups/longsleeve-flatlay-back-red.png',
  '#1B4332': '/mockups/longsleeve-flatlay-back-forest-green.png',
  '#2E4A2E': '/mockups/longsleeve-flatlay-back-forest-green.png',
  '#5C1D24': '/mockups/longsleeve-flatlay-back-maroon.png',
  '#1D4ED8': '/mockups/longsleeve-flatlay-back-royal.png',
  '#D4C5B3': '/mockups/longsleeve-flatlay-back-sand.png',
  '#4B5320': '/mockups/longsleeve-flatlay-back-military-green.png',
  '#4A5E35': '/mockups/longsleeve-flatlay-back-military-green.png',
  '#EA580C': '/mockups/longsleeve-flatlay-back-orange.png',
  '#7BAED1': '/mockups/longsleeve-flatlay-back-carolina-blue.png',
  '#7799B5': '/mockups/longsleeve-flatlay-back-carolina-blue.png',
  '#4A4A48': '/mockups/longsleeve-flatlay-back-dark-heather.png',
  '#DEDEDB': '/mockups/longsleeve-flatlay-back-ash.png',
}

export function RealisticLongSleeveFlatLay({
  color = '#FFFFFF',
  view = 'front',
  className = '',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 156, top: 145, w: 188, h: 240 },
  printMethod,
  sceneId = 'front',
  children,
}: RealisticFlatLayProps & { sceneId?: string }) {
  const id = useId().replace(/:/g, '')
  const isBack = view === 'back' || sceneId === 'back'
  const isCollarCloseup = sceneId === 'collar'
  const isPersonLeft = sceneId === 'person-left'
  const isPersonRight = sceneId === 'person-right'
  const isDark = isColorDark(color)
  const normColor = (color || '#FFFFFF').toUpperCase()

  // On-Model Views (Person Left & Person Right with Authentic Full-Sleeve Shirts)
  if (isPersonLeft || isPersonRight) {
    const modelPhoto = isPersonLeft
      ? '/mockups/model-longsleeve-male.jpg'
      : '/mockups/model-longsleeve-female.jpg'
    const modelChest = isPersonLeft
      ? { x: 340, y: 320, width: 345, height: 420 }
      : { x: 345, y: 340, width: 335, height: 410 }

    return (
      <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
        <svg
          viewBox="0 0 1024 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full max-h-[580px] rounded-xl overflow-hidden shadow-sm"
        >
          <defs>
            <PrintTechniqueSvgDefs id={id} />
          </defs>
          <image href={modelPhoto} x="0" y="0" width="1024" height="1024" preserveAspectRatio="xMidYMid slice" />
          {/* Subtle model lighting wash */}
          <rect x="0" y="0" width="1024" height="1024" fill={color} opacity={isDark ? 0.08 : 0.04} style={{ mixBlendMode: 'multiply' }} />
          <g style={{ mixBlendMode: 'normal', filter: 'contrast(1.02) saturate(1.02)' }}>
            {renderLayersInSvg(layers, printBox, modelChest, 'front', colorMode, id, printMethod)}
          </g>
          {children}
        </svg>
      </div>
    )
  }

  // Photographic Studio Flat Lay Blank
  const directAsset = isBack
    ? (LONGSLEEVE_BACK_ASSETS[normColor] || '/mockups/longsleeve-flatlay-back.png')
    : LONGSLEEVE_FLATLAY_ASSETS[normColor]

  const cleanHex = normColor.replace('#', '')
  const r = (parseInt(cleanHex.substring(0, 2), 16) || 255) / 255
  const g = (parseInt(cleanHex.substring(2, 4), 16) || 255) / 255
  const b = (parseInt(cleanHex.substring(4, 6), 16) || 255) / 255

  const assetUrl = directAsset || (isBack ? '/mockups/longsleeve-flatlay-back.png' : '/mockups/longsleeve-flatlay-white.png')

  // Target Chest Projection (12" x 16" bounds on 1024 x 953 photographic stage)
  const targetChest = isBack
    ? { x: 335, y: 210, width: 354, height: 490 }
    : { x: 335, y: 230, width: 354, height: 480 }

  // Collar Closeup: Macro 2.2x zoom centered on collar ribbing and upper chest print
  const viewBox = isCollarCloseup
    ? '260 70 504 470'
    : '0 0 1024 953'

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_18px_26px_rgba(0,0,0,0.06)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} />

          {/* Dynamic textile tinting with highlight preservation for custom hex colors */}
          {!directAsset && (
            <filter id={`garment-tint-ls-${id}`} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values={`
                  ${r.toFixed(3)} 0 0 0 0
                  0 ${g.toFixed(3)} 0 0 0
                  0 0 ${b.toFixed(3)} 0 0
                  0 0 0 1 0
                `}
                result="dyedBase"
              />
              <feBlend mode="multiply" in="SourceGraphic" in2="dyedBase" result="dyedFolds" />
              <feComponentTransfer in="SourceGraphic" result="specularPeaks">
                <feFuncR type="linear" slope="1.4" intercept="-0.35" />
                <feFuncG type="linear" slope="1.4" intercept="-0.35" />
                <feFuncB type="linear" slope="1.4" intercept="-0.35" />
              </feComponentTransfer>
              <feBlend mode="screen" in="dyedFolds" in2="specularPeaks" result="finalDye" />
              <feComposite in="finalDye" in2="SourceAlpha" operator="in" />
            </filter>
          )}

          {/* Natural Combed-Cotton Weave Micro-Grain Overlay */}
          <filter id={`ls-cotton-weave-${id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.95 0.95" numOctaves="2" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0" result="textureGrain" />
            <feBlend mode="multiply" in="SourceGraphic" in2="textureGrain" result="blended" />
            <feComposite in="blended" in2="SourceAlpha" operator="in" />
          </filter>

          {/* Garment Body Clipping Mask: strictly bounds artwork within garment boundaries and prevents leaks above collar ribbing */}
          <clipPath id={`ls-print-clip-${id}`}>
            <rect
              x={targetChest.x - 30}
              y={isBack ? 165 : 175}
              width={targetChest.width + 60}
              height={targetChest.height + 70}
              rx="12"
            />
          </clipPath>
        </defs>

        {/* Studio Floor Soft Contact Shadows (Subtle, authentic Printify standard) */}
        <ellipse
          cx="512"
          cy="801"
          rx="230"
          ry="5"
          fill="#000000"
          opacity={0.06}
          filter="blur(5px)"
        />
        {/* Left & Right Cuff Contact Shadows (Tight against wrists) */}
        <ellipse cx="125" cy="688" rx="28" ry="4" fill="#000000" opacity={0.05} filter="blur(4px)" />
        <ellipse cx="899" cy="688" rx="28" ry="4" fill="#000000" opacity={0.05} filter="blur(4px)" />

        {/* Photographic Long Sleeve Garment Blank (Pristine isolated photographic canvas) */}
        <image
          href={assetUrl}
          x="0"
          y="0"
          width="1024"
          height="953"
          preserveAspectRatio="xMidYMid meet"
          filter={!directAsset ? `url(#garment-tint-ls-${id})` : undefined}
        />

        {/* Artwork Projection Stage (With Physical Print & Embroidery Finishes) */}
        <g
          id="ls-artwork-stage"
          filter={`url(#ls-cotton-weave-${id})`}
          clipPath={`url(#ls-print-clip-${id})`}
          style={{
            mixBlendMode: 'normal',
            filter: 'contrast(1.02) saturate(1.02)',
          }}
        >
          {renderLayersInSvg(layers, printBox, targetChest, isBack ? 'back' : 'front', colorMode, id, printMethod)}
        </g>

        {/* Authentic Fabric Fold & Lighting Crease Overlay (Printify Physical Integration) */}
        <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }} opacity={0.10}>
          <image
            href={assetUrl}
            x="0"
            y="0"
            width="1024"
            height="953"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {children}
      </svg>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════════
   2. CLOSE-VIEW ON-PERSON MODEL (Matching Images 1 & 3)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticModelTorsoMockup({
  photoUrl,
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 152, top: 130, w: 196, h: 290 },
  targetChest,
  objectPosition = 'center top',
  children,
  className = '',
}: {
  photoUrl: string
  colorMode?: 'cmyk' | 'rgb'
  layers?: ArtworkLayer[]
  printBox?: { left: number; top: number; w: number; h: number }
  targetChest?: { x: number; y: number; width: number; height: number }
  objectPosition?: string
  children?: React.ReactNode
  className?: string
}) {
  const chest = targetChest || { x: 175, y: 145, width: 190, height: 240 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-[#FAF9F6] select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt="Product on model close view"
        className="w-full h-full object-cover"
        style={{ objectPosition }}
        draggable={false}
      />

      {/* Artwork Projected over Model's Chest */}
      <svg
        viewBox="0 0 540 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          mixBlendMode: 'multiply',
          filter: 'contrast(1.05)',
          opacity: 0.95,
        }}
      >
        <g id="model-artwork-group">
          {renderLayersInSvg(layers, printBox, chest, 'front', colorMode)}
        </g>
      </svg>

      {/* Optional custom children */}
      {children && (
        <div
          style={{
            position: 'absolute',
            left: '34%',
            top: '28%',
            width: '32%',
            height: '42%',
            pointerEvents: 'none',
            mixBlendMode: 'multiply',
            filter: 'contrast(1.06)',
            opacity: 0.96,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   3. CLOSE-VIEW CREWNECK SWEATSHIRT FLAT-LAY (Matching Image 4)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticSweatshirtFlatLay({
  color = '#9A9A8E',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 156, top: 140, w: 188, h: 250 },
  printMethod,
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isBack = view === 'back'
  const isPureWhite = color.toUpperCase() === '#FFFFFF'

  const seamColor = dark ? '#FFFFFF' : '#1A1A12'
  const shadowColor = dark ? '#000000' : '#2A2822'
  const cuffColor = dark ? '#131518' : '#88847C'

  const chestArea = isBack
    ? { x: 172, y: 140, width: 196, height: 260 }
    : { x: 172, y: 155, width: 196, height: 250 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 540 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} />

          <filter id={`sweat-drop-${id}`} x="-20%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="0" dy="26" stdDeviation="22" floodColor="#1A1813" floodOpacity={dark ? 0.35 : 0.16} />
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1A1813" floodOpacity={dark ? 0.22 : 0.10} />
          </filter>

          {/* Heavyweight fleece shading */}
          <linearGradient id={`sweat-fleece-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.12 : 0.88} />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity={dark ? 0.04 : 0.30} />
            <stop offset="70%" stopColor="#000000" stopOpacity={dark ? 0.15 : 0.04} />
            <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.32 : 0.12} />
          </linearGradient>

          {/* Ribbed collar & cuff pattern */}
          <pattern id={`sweat-rib-${id}`} width="4" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke={shadowColor} strokeWidth="0.85" strokeOpacity="0.22" />
            <line x1="2" y1="0" x2="2" y2="4" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.15" />
          </pattern>
        </defs>

        {/* Ambient floor shadow */}
        <path
          d="M 175 75 L 85 110 L 22 250 L 78 280 L 115 220 L 118 515 L 422 515 L 425 220 L 462 280 L 518 250 L 455 110 L 365 75 Z"
          fill="#000"
          opacity={dark ? 0.30 : 0.12}
          transform="translate(0, 18)"
          filter={`url(#sweat-drop-${id})`}
        />

        {/* Base Fleece Silhouette */}
        <g id="sweatshirt-base">
          <path
            d="M 180 74 C 210 65, 330 65, 360 74 L 458 112 C 485 125, 515 210, 516 248 C 516 260, 502 268, 488 262 L 448 240 L 425 225 L 422 478 L 424 515 C 424 522, 418 526, 410 526 L 130 526 C 122 526, 116 522, 116 515 L 118 478 L 115 225 L 92 240 L 52 262 C 38 268, 24 260, 24 248 C 25 210, 55 125, 82 112 Z"
            fill={isPureWhite ? '#F9F8F5' : color}
          />
          <path
            d="M 180 74 C 210 65, 330 65, 360 74 L 458 112 C 485 125, 515 210, 516 248 C 516 260, 502 268, 488 262 L 448 240 L 425 225 L 422 478 L 424 515 C 424 522, 418 526, 410 526 L 130 526 C 122 526, 116 522, 116 515 L 118 478 L 115 225 L 92 240 L 52 262 C 38 268, 24 260, 24 248 C 25 210, 55 125, 82 112 Z"
            fill={`url(#sweat-fleece-${id})`}
          />
        </g>

        {/* Realistic Heavyweight Drape Folds */}
        <g id="sweat-drapes" opacity={dark ? 0.35 : 0.18}>
          <path d="M 120 480 C 150 465, 230 472, 270 468 C 310 464, 390 470, 420 480" stroke={shadowColor} strokeWidth="3" fill="none" />
          <path d="M 125 420 C 160 405, 220 412, 270 408 C 320 404, 380 410, 415 420" stroke={shadowColor} strokeWidth="2.5" fill="none" />
          <path d="M 115 230 C 150 250, 190 270, 210 320" stroke={shadowColor} strokeWidth="2" fill="none" />
          <path d="M 425 230 C 390 250, 350 270, 330 320" stroke={shadowColor} strokeWidth="2" fill="none" />
        </g>

        {/* Raglan / Drop-Shoulder Flatlock Seams */}
        <g id="sweat-shoulder-seams">
          <path d="M 188 78 C 165 140, 140 185, 116 230" stroke={seamColor} strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity={dark ? 0.45 : 0.20} />
          <path d="M 352 78 C 375 140, 400 185, 424 230" stroke={seamColor} strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity={dark ? 0.45 : 0.20} />
        </g>

        {/* Wide Ribbed Cuffs */}
        <g id="sweat-cuffs">
          {/* Left sleeve cuff */}
          <path d="M 24 248 L 52 262 L 68 238 L 40 224 Z" fill={isPureWhite ? '#F0EEE8' : color} />
          <path d="M 24 248 L 52 262 L 68 238 L 40 224 Z" fill={`url(#sweat-rib-${id})`} />
          <line x1="24" y1="248" x2="52" y2="262" stroke={shadowColor} strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Right sleeve cuff */}
          <path d="M 516 248 L 488 262 L 472 238 L 500 224 Z" fill={isPureWhite ? '#F0EEE8' : color} />
          <path d="M 516 248 L 488 262 L 472 238 L 500 224 Z" fill={`url(#sweat-rib-${id})`} />
          <line x1="516" y1="248" x2="488" y2="262" stroke={shadowColor} strokeWidth="1.5" strokeOpacity="0.4" />
        </g>

        {/* Wide Ribbed Bottom Hem (2-needle coverstitch) */}
        <g id="sweat-hem">
          <rect x="116" y="478" width="308" height="48" rx="3" fill={isPureWhite ? '#F0EEE8' : color} />
          <rect x="116" y="478" width="308" height="48" rx="3" fill={`url(#sweat-rib-${id})`} />
          <line x1="116" y1="478" x2="424" y2="478" stroke={shadowColor} strokeWidth="1.8" strokeOpacity="0.35" />
          <line x1="116" y1="484" x2="424" y2="484" stroke={seamColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.25" />
          <line x1="116" y1="488" x2="424" y2="488" stroke={seamColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.25" />
        </g>

        {/* Inner Neck Hole & Label */}
        {!isBack && (
          <g id="sweat-inner-neck">
            <path
              d="M 195 72 C 220 54, 320 54, 345 72 C 330 92, 210 92, 195 72 Z"
              fill={dark ? '#111215' : '#D0CCC4'}
            />
            {/* Stanley Stella / PrintFlow brand label */}
            <rect x="252" y="60" width="36" height="20" rx="2" fill="#FAF9F5" stroke="#CCC" strokeWidth="0.5" />
            <text x="270" y="73" textAnchor="middle" fontSize="6" fontFamily="sans-serif" fontWeight="bold" fill="#333">PRINTFLOW</text>
          </g>
        )}

        {/* Wide Ribbed Crewneck Collar & Triangular V-Notch Accent */}
        <g id="sweat-collar">
          {!isBack ? (
            <>
              <path
                d="M 190 70 C 215 110, 325 110, 350 70 C 335 60, 205 60, 190 70 Z"
                fill={isPureWhite ? '#F5F5F0' : color}
              />
              <path
                d="M 190 70 C 215 110, 325 110, 350 70 C 335 60, 205 60, 190 70 Z"
                fill={`url(#sweat-rib-${id})`}
              />
              <path
                d="M 190 70 C 215 110, 325 110, 350 70"
                stroke={shadowColor}
                strokeWidth="2.5"
                strokeOpacity={isPureWhite ? 0.25 : 0.45}
              />
              {/* Classic triangular V-stitch under collar */}
              <path
                d="M 252 110 L 270 128 L 288 110"
                stroke={seamColor}
                strokeWidth="1.2"
                strokeDasharray="3 2"
                strokeOpacity={dark ? 0.5 : 0.25}
                fill="none"
              />
            </>
          ) : (
            <>
              <path
                d="M 190 70 C 225 60, 315 60, 350 70 C 335 80, 205 80, 190 70 Z"
                fill={isPureWhite ? '#F5F5F0' : color}
              />
              <path
                d="M 190 70 C 225 60, 315 60, 350 70"
                stroke={shadowColor}
                strokeWidth="2"
                strokeOpacity={0.4}
              />
            </>
          )}
        </g>

        {/* Projected Live User Artwork */}
        <g
          id="sweat-artwork-stage"
          style={{
            mixBlendMode: !dark || colorMode === 'cmyk' ? 'multiply' : 'normal',
            filter: 'contrast(1.04) saturate(1.02)',
            opacity: dark ? 0.98 : 1,
          }}
        >
          {renderLayersInSvg(layers, printBox, chestArea, isBack ? 'back' : 'front', colorMode, id, printMethod)}
        </g>

        {/* ── Fabric Shading & Natural Folds OVER the Artwork ── */}
        <g id="sweat-surface-over-artwork" pointerEvents="none">
          <path
            d="M 180 260 Q 270 285 360 255"
            stroke="#000000"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            opacity={dark ? 0.08 : 0.04}
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d="M 185 340 Q 270 365 355 335"
            stroke="#000000"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            opacity={dark ? 0.07 : 0.04}
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d="M 190 220 Q 270 240 350 215"
            stroke="#FFFFFF"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            opacity={dark ? 0.08 : 0.16}
            style={{ mixBlendMode: 'screen' }}
          />
        </g>
      </svg>

      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   4. STRUCTURED FLAT BILL SNAPBACK CAP (Matching Images 2 & 3)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticCapMockup({
  color = '#1A1A12',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 195, top: 155, w: 110, h: 80 },
  printMethod,
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isBack = view === 'back'
  const isSide = view === 'side' || view === 'front-side'
  const isPureWhite = color.toUpperCase() === '#FFFFFF'

  const seamColor = dark ? '#FFFFFF' : '#1A1A12'
  const shadowColor = dark ? '#000000' : '#2A2822'

  // Front crown embroidery area (4" x 2")
  const crownBox = { x: 185, y: 155, width: 170, height: 95 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 540 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <filter id={`cap-shadow-${id}`} x="-20%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="0" dy="28" stdDeviation="24" floodColor="#000" floodOpacity={dark ? 0.40 : 0.18} />
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity={dark ? 0.25 : 0.10} />
          </filter>

          {/* 3D Wool Twill Spherical Highlight */}
          <radialGradient id={`cap-twill-${id}`} cx="48%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.22 : 0.90} />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity={dark ? 0.05 : 0.35} />
            <stop offset="80%" stopColor="#000000" stopOpacity={dark ? 0.20 : 0.05} />
            <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.45 : 0.18} />
          </radialGradient>

          {/* Visor plane lighting */}
          <linearGradient id={`visor-plane-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.15 : 0.7} />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity={dark ? 0.02 : 0.2} />
            <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.35 : 0.15} />
          </linearGradient>

          {/* Physical manufacturing & print technique shaders */}
          <PrintTechniqueSvgDefs id={id} />

          {/* Raised 3D embroidery texture filter */}
          <filter id={`embroidery-relief-${id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0.5" dy="1.5" stdDeviation="1.2" floodColor="#000" floodOpacity={dark ? 0.55 : 0.25} />
          </filter>
        </defs>

        {/* Ambient floor shadow */}
        <ellipse
          cx="270"
          cy="420"
          rx="220"
          ry="30"
          fill="#000"
          opacity={dark ? 0.35 : 0.16}
          filter={`url(#cap-shadow-${id})`}
        />

        {!isBack ? (
          /* ── FRONT 3D STRUCTURED SNAPBACK VIEW (Matching Images 2 & 3) ── */
          <g id="snapback-front">
            {/* Structured High-Crown Dome */}
            <path
              d="M 100 310 C 95 180, 160 70, 270 70 C 380 70, 445 180, 440 310 Z"
              fill={isPureWhite ? '#FAF8F5' : color}
            />
            <path
              d="M 100 310 C 95 180, 160 70, 270 70 C 380 70, 445 180, 440 310 Z"
              fill={`url(#cap-twill-${id})`}
            />

            {/* 6-Panel Structural Seams */}
            <path d="M 270 70 L 270 310" stroke={seamColor} strokeWidth="1.4" strokeOpacity={dark ? 0.45 : 0.22} />
            <path d="M 270 70 C 220 150, 150 230, 120 285" stroke={seamColor} strokeWidth="1.2" strokeOpacity={dark ? 0.35 : 0.18} />
            <path d="M 270 70 C 320 150, 390 230, 420 285" stroke={seamColor} strokeWidth="1.2" strokeOpacity={dark ? 0.35 : 0.18} />

            {/* Embroidered Ventilation Eyelets with 3D thread rims */}
            <g id="front-eyelets">
              <circle cx="225" cy="190" r="5" fill="#111" stroke={seamColor} strokeWidth="1.8" strokeOpacity={dark ? 0.7 : 0.35} />
              <circle cx="315" cy="190" r="5" fill="#111" stroke={seamColor} strokeWidth="1.8" strokeOpacity={dark ? 0.7 : 0.35} />
            </g>

            {/* Front Crown Projected User Artwork (Embroidered / Screen Printed) */}
            <g
              id="cap-artwork-stage"
              style={{
                mixBlendMode: colorMode === 'cmyk' ? 'multiply' : isPureWhite ? 'multiply' : 'normal',
                filter: 'contrast(1.05)',
              }}
            >
              {renderLayersInSvg(layers, printBox, crownBox, 'front', colorMode, id, printMethod || 'embroidery')}
            </g>

            {/* Wide Flat Bill / Visor Extending Forward */}
            <g id="snapback-flat-bill">
              {/* Visor Drop Shadow onto stage */}
              <path
                d="M 50 315 C 50 285, 150 270, 270 270 C 390 270, 490 285, 490 315 C 490 360, 390 382, 270 382 C 150 382, 50 360, 50 315 Z"
                fill="#000"
                opacity="0.25"
                transform="translate(0, 10)"
              />

              {/* Visor Upper Plane */}
              <path
                d="M 50 315 C 50 285, 150 270, 270 270 C 390 270, 490 285, 490 315 C 490 360, 390 382, 270 382 C 150 382, 50 360, 50 315 Z"
                fill={isPureWhite ? '#F5F3ED' : color}
              />
              <path
                d="M 50 315 C 50 285, 150 270, 270 270 C 390 270, 490 285, 490 315 C 490 360, 390 382, 270 382 C 150 382, 50 360, 50 315 Z"
                fill={`url(#visor-plane-${id})`}
              />

              {/* Visor Front Edge Thickness Layer (The plastic/buckram sandwich) */}
              <path
                d="M 50 315 C 50 360, 150 382, 270 382 C 390 382, 490 360, 490 315 L 490 322 C 490 367, 390 389, 270 389 C 150 389, 50 367, 50 322 Z"
                fill={dark ? '#0A0A0C' : '#99958D'}
                opacity="0.6"
              />

              {/* 6 Rows of Concentric Visor Topstitching (Signature Snapback Detail) */}
              {[286, 296, 306, 318, 330, 344].map((yOffset, idx) => (
                <path
                  key={idx}
                  d={`M ${72 + idx * 4} ${320 + idx * 5} C ${130 + idx * 2} ${280 + idx * 4}, ${410 - idx * 2} ${280 + idx * 4}, ${468 - idx * 4} ${320 + idx * 5}`}
                  stroke={seamColor}
                  strokeWidth="0.85"
                  strokeDasharray="3 2"
                  strokeOpacity={dark ? 0.40 : 0.20}
                  fill="none"
                />
              ))}

              {/* Crown-to-Visor Base Join Seam */}
              <path
                d="M 96 312 C 145 292, 215 282, 270 282 C 325 282, 395 292, 444 312"
                stroke={shadowColor}
                strokeWidth="2.2"
                strokeOpacity={dark ? 0.6 : 0.3}
                fill="none"
              />
            </g>

            {/* Top Squatchee Button with 3D dome reflection */}
            <circle cx="270" cy="72" r="10" fill={isPureWhite ? '#FFF' : color} stroke={seamColor} strokeWidth="1.2" strokeOpacity={dark ? 0.6 : 0.25} />
            <circle cx="270" cy="72" r="10" fill="#000" opacity={dark ? 0.25 : 0.08} />
            <ellipse cx="268" cy="69" rx="4" ry="2.5" fill="#FFF" opacity={dark ? 0.35 : 0.7} />
          </g>
        ) : (
          /* ── REAR VIEW (Showing Snapback Plastic Strap & Keyhole Arch) ── */
          <g id="snapback-rear">
            {/* Rear Crown */}
            <path
              d="M 100 310 C 95 180, 160 70, 270 70 C 380 70, 445 180, 440 310 Z"
              fill={isPureWhite ? '#FAF8F5' : color}
            />
            <path
              d="M 100 310 C 95 180, 160 70, 270 70 C 380 70, 445 180, 440 310 Z"
              fill={`url(#cap-twill-${id})`}
            />

            {/* Inner Sweatband Rim Visible through Arch */}
            <path
              d="M 160 310 C 160 220, 380 220, 380 310 Z"
              fill="#18181A"
            />

            {/* Plastic Snapback Closure Strap */}
            <g id="plastic-snap-strap">
              <rect x="175" y="275" width="190" height="22" rx="4" fill="#222" stroke="#444" strokeWidth="0.8" />
              {/* 7 Pegs & Receiver Holes */}
              {[195, 215, 235, 255, 275, 295, 315, 335, 350].map((x, i) => (
                <circle key={i} cx={x} cy={286} r="3" fill="#111" stroke="#555" strokeWidth="0.8" />
              ))}
            </g>

            {/* Rear Seam and Top Button */}
            <line x1="270" y1="70" x2="270" y2="220" stroke={seamColor} strokeWidth="1.4" strokeOpacity={0.35} />
            <circle cx="270" cy="72" r="10" fill={isPureWhite ? '#FFF' : color} stroke={seamColor} strokeWidth="1.2" />
          </g>
        )}
      </svg>

      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   5. AWDIS JH043 HEAVYWEIGHT LETTERMAN JACKET (Matching Image 5)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticVarsityJacket({
  color = '#1E242B',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 272, top: 152, w: 80, h: 80 },
  printMethod,
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isBack = view === 'back'
  const isPureWhite = color.toUpperCase() === '#FFFFFF'

  // Contrast Sleeves: Crisp Heather/Off-White Varsity Contrast
  const sleeveColor = '#EAE8E3'
  const ribColor = color
  const stripeColor = '#FFFFFF'
  const snapColor = '#FFFFFF'
  const seamColor = dark ? '#FFFFFF' : '#1A1A12'
  const shadowColor = dark ? '#000000' : '#2A2822'

  // Target areas for badge/chest
  const leftChestBox = { x: 300, y: 175, width: 85, height: 85 }
  const backPanelBox = { x: 175, y: 155, width: 190, height: 260 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 540 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} />
          <filter id={`varsity-shadow-${id}`} x="-20%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="0" dy="28" stdDeviation="24" floodColor="#000" floodOpacity={dark ? 0.40 : 0.18} />
          </filter>

          {/* Body Wool Fabric Shading */}
          <linearGradient id={`varsity-body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.15 : 0.9} />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity={dark ? 0.04 : 0.3} />
            <stop offset="70%" stopColor="#000000" stopOpacity={dark ? 0.18 : 0.05} />
            <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.40 : 0.18} />
          </linearGradient>

          {/* Contrast Sleeve Shading */}
          <linearGradient id={`varsity-sleeve-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#DDD9D0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#BBB7AD" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Ambient Floor Shadow */}
        <path
          d="M 180 72 L 95 102 L 18 200 L 75 230 L 115 190 L 118 518 L 422 518 L 425 190 L 465 230 L 522 200 L 445 102 L 360 72 Z"
          fill="#000"
          opacity={dark ? 0.32 : 0.14}
          transform="translate(0, 18)"
          filter={`url(#varsity-shadow-${id})`}
        />

        {/* ── Contrast Sleeves (AWDis Signature Feature) ── */}
        <g id="varsity-contrast-sleeves">
          {/* Left Sleeve */}
          <path
            d="M 120 106 C 90 120, 30 190, 20 205 C 15 218, 28 226, 42 222 L 80 202 L 116 195 Z"
            fill={sleeveColor}
          />
          <path
            d="M 120 106 C 90 120, 30 190, 20 205 C 15 218, 28 226, 42 222 L 80 202 L 116 195 Z"
            fill={`url(#varsity-sleeve-${id})`}
          />

          {/* Right Sleeve */}
          <path
            d="M 420 106 C 450 120, 510 190, 520 205 C 525 218, 512 226, 498 222 L 460 202 L 424 195 Z"
            fill={sleeveColor}
          />
          <path
            d="M 420 106 C 450 120, 510 190, 520 205 C 525 218, 512 226, 498 222 L 460 202 L 424 195 Z"
            fill={`url(#varsity-sleeve-${id})`}
          />

          {/* Striped Ribbed Knitted Cuffs (Two White Stripes) */}
          {/* Left Cuff */}
          <rect x="20" y="205" width="28" height="20" rx="2" fill={ribColor} transform="rotate(18, 20, 205)" />
          <line x1="22" y1="210" x2="46" y2="218" stroke={stripeColor} strokeWidth="1.5" />
          <line x1="25" y1="216" x2="49" y2="224" stroke={stripeColor} strokeWidth="1.5" />

          {/* Right Cuff */}
          <rect x="492" y="205" width="28" height="20" rx="2" fill={ribColor} transform="rotate(-18, 492, 205)" />
          <line x1="494" y1="218" x2="518" y2="210" stroke={stripeColor} strokeWidth="1.5" />
          <line x1="491" y1="224" x2="515" y2="216" stroke={stripeColor} strokeWidth="1.5" />
        </g>

        {/* ── Main Torso Shell (Body Color) ── */}
        <g id="varsity-torso">
          <path
            d="M 180 72 C 210 62, 330 62, 360 72 L 420 106 L 422 478 L 422 518 C 422 525, 416 530, 408 530 L 132 530 C 124 530, 118 525, 118 518 L 118 478 L 120 106 Z"
            fill={isPureWhite ? '#F8F6F0' : color}
          />
          <path
            d="M 180 72 C 210 62, 330 62, 360 72 L 420 106 L 422 478 L 422 518 C 422 525, 416 530, 408 530 L 132 530 C 124 530, 118 525, 118 518 L 118 478 L 120 106 Z"
            fill={`url(#varsity-body-${id})`}
          />
        </g>

        {/* ── Striped Ribbed Knitted Waistband Hem (Two White Stripes) ── */}
        <g id="varsity-hem">
          <rect x="118" y="478" width="304" height="52" rx="4" fill={ribColor} />
          {/* 2 Contrast Varsity Stripes */}
          <line x1="118" y1="493" x2="422" y2="493" stroke={stripeColor} strokeWidth="3" />
          <line x1="118" y1="507" x2="422" y2="507" stroke={stripeColor} strokeWidth="3" />
          <line x1="118" y1="478" x2="422" y2="478" stroke={shadowColor} strokeWidth="1.5" strokeOpacity="0.4" />
        </g>

        {/* ── Slanted Welt Pockets with Contrast Piping ── */}
        {!isBack && (
          <g id="varsity-welt-pockets">
            {/* Left pocket */}
            <g transform="rotate(18, 160, 390)">
              <rect x="135" y="380" width="70" height="20" rx="3" fill={sleeveColor} stroke="#999" strokeWidth="0.8" />
              <line x1="135" y1="390" x2="205" y2="390" stroke="#444" strokeWidth="1.5" strokeOpacity="0.3" />
            </g>
            {/* Right pocket */}
            <g transform="rotate(-18, 380, 390)">
              <rect x="335" y="380" width="70" height="20" rx="3" fill={sleeveColor} stroke="#999" strokeWidth="0.8" />
              <line x1="335" y1="390" x2="405" y2="390" stroke="#444" strokeWidth="1.5" strokeOpacity="0.3" />
            </g>
          </g>
        )}

        {/* ── Center Front Placket with Contrast White Press-Stud Snap Buttons ── */}
        {!isBack && (
          <g id="varsity-placket">
            {/* Center closure seam */}
            <rect x="264" y="94" width="12" height="384" fill="#000" opacity={dark ? 0.35 : 0.12} />
            <line x1="270" y1="94" x2="270" y2="478" stroke={seamColor} strokeWidth="1" strokeOpacity="0.3" />

            {/* 6 White Press-Stud Snaps down center */}
            {[120, 185, 250, 315, 380, 445].map((y, idx) => (
              <g key={idx} id={`snap-${idx}`}>
                {/* Metallic rim */}
                <circle cx="270" cy={y} r="8" fill="#D8D8DE" stroke="#888890" strokeWidth="0.8" />
                {/* White enameled center */}
                <circle cx="270" cy={y} r="6.2" fill={snapColor} />
                {/* Highlight */}
                <ellipse cx="268" cy={y - 2} rx="2.5" ry="1.5" fill="#FFF" />
              </g>
            ))}
          </g>
        )}

        {/* ── Striped Ribbed Knitted Stand Collar (Two White Stripes) ── */}
        <g id="varsity-collar">
          <path
            d="M 180 72 C 205 94, 225 102, 270 102 C 315 102, 335 94, 360 72 C 340 54, 200 54, 180 72 Z"
            fill={ribColor}
            stroke={shadowColor}
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          {/* 2 White Contrast Stripes */}
          <path
            d="M 188 72 C 210 88, 230 94, 270 94 C 310 94, 330 88, 352 72"
            stroke={stripeColor}
            strokeWidth="2.2"
            fill="none"
          />
          <path
            d="M 196 66 C 215 80, 235 86, 270 86 C 305 86, 325 80, 344 66"
            stroke={stripeColor}
            strokeWidth="2.2"
            fill="none"
          />
        </g>

        {/* ── Projected User Artwork (Left Chest Badge or Back Panel) ── */}
        <g
          id="varsity-artwork-stage"
          style={{
            mixBlendMode: colorMode === 'cmyk' ? 'multiply' : isPureWhite ? 'multiply' : 'normal',
            filter: 'contrast(1.05)',
          }}
        >
          {isBack
            ? renderLayersInSvg(layers, printBox, backPanelBox, 'back', colorMode, id, printMethod || 'embroidery')
            : renderLayersInSvg(layers, printBox, leftChestBox, 'left chest', colorMode, id, printMethod || 'embroidery')}
        </g>
      </svg>

      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6. HIGH-END STUDIO CERAMIC MUG MOCKUP
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticMugMockup({
  color = '#FFFFFF',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 145, top: 145, w: 170, h: 210 },
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isLeftHandle = view === 'handle_left' || view === 'handle-left'
  const isWrap = view === 'wrap'

  // Artwork box mapped on mug face
  const mugArtBox = isWrap
    ? { x: 120, y: 165, width: 260, height: 180 }
    : { x: 165, y: 165, width: 170, height: 180 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Ceramic Cylindrical 3D Light Shading */}
          <linearGradient id={`real-mug-body-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={dark ? '#111214' : '#D0CCC4'} />
            <stop offset="8%" stopColor={dark ? '#1D1E22' : '#ECE8E1'} />
            <stop offset="22%" stopColor={dark ? '#353740' : '#FFFFFF'} />
            <stop offset="45%" stopColor={dark ? '#222328' : '#FAF8F5'} />
            <stop offset="78%" stopColor={dark ? '#18191D' : '#EDE9E2'} />
            <stop offset="100%" stopColor={dark ? '#0D0E10' : '#C8C4BC'} />
          </linearGradient>

          {/* Specular Glossy Vertical Highlight */}
          <linearGradient id={`real-mug-sheen-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity={dark ? 0.35 : 0.85} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Cavity Inner Depth Gradient */}
          <radialGradient id={`real-mug-cavity-${id}`} cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor={dark ? '#050506' : '#524F4A'} />
            <stop offset="70%" stopColor={dark ? '#101114' : '#7D7972'} />
            <stop offset="100%" stopColor={dark ? '#1E1F24' : '#B8B4AC'} />
          </radialGradient>

          {/* Handle 3D Curvature */}
          <linearGradient id={`real-mug-handle-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={dark ? '#22242A' : '#E8E4DC'} />
            <stop offset="50%" stopColor={dark ? '#383A44' : '#FFFFFF'} />
            <stop offset="100%" stopColor={dark ? '#111215' : '#B8B4AC'} />
          </linearGradient>
          {/* Right edge cylindrical shading */}
          <linearGradient id={`real-mug-edge-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.45 : 0.22} />
          </linearGradient>

          {/* Mug Body Clip Path (Prevents artwork bleeding past ceramic cylinder boundary) */}
          <clipPath id={`mug-clip-${id}`}>
            <path
              d={
                isWrap
                  ? 'M 80 100 L 80 395 C 80 430, 420 430, 420 395 L 420 100 Z'
                  : 'M 130 100 L 130 395 C 130 425, 370 425, 370 395 L 370 100 Z'
              }
            />
          </clipPath>
        </defs>

        {/* ── Tabletop Soft Contact Shadow & Reflection ── */}
        <ellipse cx="250" cy="435" rx="160" ry="20" fill="#000" opacity={dark ? 0.28 : 0.12} filter="blur(10px)" />
        <ellipse cx="250" cy="435" rx="110" ry="10" fill="#000" opacity={dark ? 0.35 : 0.18} filter="blur(3px)" />

        {/* ── Sturdy Ceramic C-Handle ── */}
        {!isWrap && (
          <g id="real-mug-handle" transform={isLeftHandle ? 'translate(500, 0) scale(-1, 1)' : undefined}>
            <path
              d="M 345 150 C 445 150, 470 205, 470 275 C 470 345, 440 380, 345 380 L 345 340 C 410 340, 432 315, 432 275 C 432 220, 405 188, 345 188 Z"
              fill={`url(#real-mug-handle-${id})`}
              stroke={dark ? '#454550' : '#1A1A12'}
              strokeOpacity={dark ? 0.6 : 0.15}
              strokeWidth="1.2"
            />
            {/* Highlight along handle outer crest */}
            <path
              d="M 350 155 C 440 155, 465 208, 465 275 C 465 340, 436 375, 350 375"
              stroke="#FFFFFF"
              strokeOpacity={dark ? 0.45 : 0.85}
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* ── Cylindrical Mug Body Base ── */}
        <g id="real-mug-cylinder">
          <path
            d={
              isWrap
                ? 'M 80 100 L 80 395 C 80 430, 420 430, 420 395 L 420 100 Z'
                : 'M 130 100 L 130 395 C 130 425, 370 425, 370 395 L 370 100 Z'
            }
            fill={`url(#real-mug-body-${id})`}
            stroke={dark ? '#454550' : '#1A1A12'}
            strokeOpacity={dark ? 0.6 : 0.18}
            strokeWidth="1.2"
          />
        </g>

        {/* ── Projected User Artwork (Clipped to Cylindrical Mug Boundary) ── */}
        <g
          id="real-mug-artwork-stage"
          clipPath={`url(#mug-clip-${id})`}
          style={{
            mixBlendMode: dark ? 'normal' : 'multiply',
            filter: 'contrast(1.05) saturate(1.03)',
            opacity: dark ? 0.96 : 1,
          }}
        >
          {renderLayersInSvg(layers, printBox, mugArtBox, 'wrap', colorMode)}
        </g>

        {/* ── Ceramic Over-Print Glaze Highlights & Cylindrical Shadows ── */}
        <g id="real-mug-glaze-overlay" clipPath={`url(#mug-clip-${id})`} pointerEvents="none">
          {/* Vertical glossy specular sheen running OVER the artwork */}
          <rect
            x={isWrap ? 135 : 170}
            y="100"
            width={isWrap ? 45 : 34}
            height="305"
            fill={`url(#real-mug-sheen-${id})`}
            style={{ mixBlendMode: 'screen' }}
          />
          {/* Natural curvature shading on right side running OVER the artwork */}
          <rect
            x={isWrap ? 340 : 310}
            y="100"
            width={isWrap ? 80 : 60}
            height="305"
            fill={`url(#real-mug-edge-${id})`}
            style={{ mixBlendMode: 'multiply' }}
          />
        </g>

        {/* ── Ceramic Rim Depth & Inner Cavity ── */}
        <g id="real-mug-rim">
          <ellipse
            cx="250"
            cy="100"
            rx={isWrap ? 170 : 120}
            ry={28}
            fill={`url(#real-mug-cavity-${id})`}
            stroke={dark ? '#454550' : '#B8B4AC'}
            strokeWidth="1.5"
          />
          {/* Ceramic wall thickness lip highlight */}
          <ellipse
            cx="250"
            cy="100"
            rx={isWrap ? 168 : 118}
            ry={26}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity={dark ? 0.45 : 0.9}
            strokeWidth="1.8"
          />
        </g>
      </svg>

      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6B. REALISTIC RAW SLEEVELESS MUSCLE TANK TOP (Exact Bella+Canvas 6003 Reference)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticTankTopFlatLay({
  color = '#FFFFFF',
  view = 'front',
  className = '',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 160, top: 145, w: 180, h: 240 },
  printMethod,
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const isBack = view === 'back'
  const isDark = isColorDark(color)
  const isPureWhite = color.toUpperCase() === '#FFFFFF'

  const shadowColor = isDark ? '#000000' : '#8A857D'
  const highlightColor = '#FFFFFF'
  const seamColor = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(26,26,18,0.18)'
  const innerNeckFill = isDark ? '#141418' : '#DED9D0'

  const targetChest = isBack
    ? { x: 175, y: 135, width: 190, height: 280 }
    : { x: 175, y: 150, width: 190, height: 260 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 540 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.04)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} />
          <filter id={`tank-drop-${id}`} x="-20%" y="-15%" width="140%" height="145%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#1A1A12" floodOpacity={isDark ? 0.28 : 0.08} />
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1A1A12" floodOpacity={isDark ? 0.16 : 0.05} />
          </filter>

          <linearGradient id={`tank-studio-light-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={highlightColor} stopOpacity={isPureWhite ? 0.95 : 0.22} />
            <stop offset="30%" stopColor={highlightColor} stopOpacity={isPureWhite ? 0.55 : 0.08} />
            <stop offset="70%" stopColor={shadowColor} stopOpacity={isPureWhite ? 0.08 : 0.15} />
            <stop offset="100%" stopColor={shadowColor} stopOpacity={isPureWhite ? 0.18 : 0.32} />
          </linearGradient>

          <linearGradient id={`tank-arm-shadow-l-${id}`} x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={shadowColor} stopOpacity={isPureWhite ? 0.25 : 0.40} />
            <stop offset="100%" stopColor={shadowColor} stopOpacity="0" />
          </linearGradient>

          <linearGradient id={`tank-arm-shadow-r-${id}`} x1="100%" y1="0%" x2="0%" y2="50%">
            <stop offset="0%" stopColor={shadowColor} stopOpacity={isPureWhite ? 0.25 : 0.40} />
            <stop offset="100%" stopColor={shadowColor} stopOpacity="0" />
          </linearGradient>

          <pattern id={`tank-rib-${id}`} width="3" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <line x1="0" y1="0" x2="0" y2="10" stroke={isDark ? '#FFFFFF' : '#1A1A12'} strokeWidth="0.6" strokeOpacity={isPureWhite ? 0.12 : 0.08} />
          </pattern>
        </defs>

        {/* ── Floor Ambient Drop Shadow Silhouette ── */}
        <path
          d="M 215 74 L 165 92 C 150 170, 140 240, 154 300 L 160 540 C 175 544, 365 544, 380 540 L 386 300 C 400 240, 390 170, 375 92 L 325 74 Z"
          fill="#1A1A12"
          opacity="0.08"
          transform="translate(0, 14)"
          filter={`url(#tank-drop-${id})`}
        />

        {/* ── Inner Back Neck Cavity & Label (Front View Only) ── */}
        {!isBack && (
          <g id="tank-inner-neck-cavity">
            <path
              d="M 215 74 C 235 52, 305 52, 325 74 C 305 98, 235 98, 215 74 Z"
              fill={innerNeckFill}
            />
            <path
              d="M 226 66 C 244 58, 296 58, 314 66"
              stroke={isDark ? '#2B2B32' : '#BEB9AF'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Bella+Canvas Style Minimalist Neck Stamp */}
            <g transform="translate(254, 68) scale(0.6)" opacity={isDark ? 0.45 : 0.35}>
              <rect x="0" y="0" width="52" height="24" rx="2" fill="none" stroke={isDark ? '#FFF' : '#333'} strokeWidth="1" />
              <line x1="8" y1="8" x2="44" y2="8" stroke={isDark ? '#FFF' : '#333'} strokeWidth="1.5" />
              <line x1="14" y1="14" x2="38" y2="14" stroke={isDark ? '#FFF' : '#333'} strokeWidth="1" />
            </g>
          </g>
        )}

        {/* ── Main Tank Body Shell ── */}
        <g id="tank-main-body">
          <path
            d={
              isBack
                ? 'M 215 74 C 235 62, 305 62, 325 74 L 375 92 C 390 170, 400 240, 386 300 L 380 540 C 365 544, 175 544, 160 540 L 154 300 C 140 240, 150 170, 165 92 Z'
                : 'M 215 74 C 235 106, 305 106, 325 74 L 375 92 C 390 170, 400 240, 386 300 L 380 540 C 365 544, 175 544, 160 540 L 154 300 C 140 240, 150 170, 165 92 Z'
            }
            fill={isPureWhite ? '#FAFAF8' : color}
          />

          <path
            d={
              isBack
                ? 'M 215 74 C 235 62, 305 62, 325 74 L 375 92 C 390 170, 400 240, 386 300 L 380 540 C 365 544, 175 544, 160 540 L 154 300 C 140 240, 150 170, 165 92 Z'
                : 'M 215 74 C 235 106, 305 106, 325 74 L 375 92 C 390 170, 400 240, 386 300 L 380 540 C 365 544, 175 544, 160 540 L 154 300 C 140 240, 150 170, 165 92 Z'
            }
            fill={`url(#tank-studio-light-${id})`}
            style={{ mixBlendMode: 'multiply' }}
          />

          {/* Dropped Armhole Deep Inset Shadow Cast */}
          <path d="M 165 92 C 150 170, 140 240, 154 300 L 164 290 C 154 240, 162 170, 175 100 Z" fill={`url(#tank-arm-shadow-l-${id})`} opacity="0.5" />
          <path d="M 375 92 C 390 170, 400 240, 386 300 L 376 290 C 386 240, 378 170, 365 100 Z" fill={`url(#tank-arm-shadow-r-${id})`} opacity="0.5" />

          {/* Natural Muscle Tank Drape Ripples */}
          <path d="M 195 230 Q 188 340 192 460" stroke={shadowColor} strokeWidth="10" strokeOpacity={isPureWhite ? 0.04 : 0.08} strokeLinecap="round" />
          <path d="M 345 230 Q 352 340 348 460" stroke={shadowColor} strokeWidth="10" strokeOpacity={isPureWhite ? 0.04 : 0.08} strokeLinecap="round" />
          <path d="M 270 240 Q 268 360 270 480" stroke={highlightColor} strokeWidth="22" strokeOpacity={isPureWhite ? 0.40 : 0.10} strokeLinecap="round" />

          {/* Armhole Narrow Ribbed Binding (Signature Bella+Canvas 6003 Muscle Detail) */}
          <path
            d="M 165 92 C 150 170, 140 240, 154 300"
            stroke={isPureWhite ? '#ECEAE3' : color}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 165 92 C 150 170, 140 240, 154 300"
            stroke={seamColor}
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />

          <path
            d="M 375 92 C 390 170, 400 240, 386 300"
            stroke={isPureWhite ? '#ECEAE3' : color}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 375 92 C 390 170, 400 240, 386 300"
            stroke={seamColor}
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />

          {/* Shoulder Topstitching */}
          <path d="M 215 74 L 165 92" stroke={seamColor} strokeWidth="1.2" />
          <path d="M 325 74 L 375 92" stroke={seamColor} strokeWidth="1.2" />

          {/* Bottom Hem Double-Needle Coverstitch */}
          <path d="M 160 532 C 215 536, 325 536, 380 532" stroke={seamColor} strokeWidth="1" strokeDasharray="4 2.5" />
          <path d="M 160 538 C 215 542, 325 542, 380 538" stroke={seamColor} strokeWidth="1" strokeDasharray="4 2.5" />
        </g>

        {/* ── Artwork Projected Directly Inside SVG Vector Space ── */}
        <g
          id="tank-artwork-projection-group"
          style={{
            mixBlendMode: !isDark || colorMode === 'cmyk' ? 'multiply' : 'normal',
          }}
        >
          {renderLayersInSvg(layers, printBox, targetChest, view, colorMode, id, printMethod)}
        </g>

        {/* ── Collar Band (Overlaps Artwork Naturally) ── */}
        {!isBack ? (
          <g id="tank-front-crew-collar">
            <path
              d="M 215 74 C 235 106, 305 106, 325 74 C 316 64, 224 64, 215 74 Z"
              fill={isPureWhite ? '#F5F5F0' : color}
            />
            <path
              d="M 215 74 C 235 106, 305 106, 325 74 C 316 64, 224 64, 215 74 Z"
              fill={`url(#tank-rib-${id})`}
            />
            <path
              d="M 215 74 C 235 106, 305 106, 325 74"
              stroke={shadowColor}
              strokeWidth="2.2"
              strokeOpacity={isPureWhite ? 0.22 : 0.40}
            />
            <path
              d="M 216 76 C 236 108, 304 108, 324 76"
              stroke={seamColor}
              strokeWidth="1"
              strokeDasharray="3 2"
            />
          </g>
        ) : (
          <g id="tank-back-crew-collar">
            <path
              d="M 215 74 C 240 64, 300 64, 325 74 C 316 80, 224 80, 215 74 Z"
              fill={isPureWhite ? '#F5F5F0' : color}
            />
            <path
              d="M 215 74 C 240 64, 300 64, 325 74"
              stroke={shadowColor}
              strokeWidth="2"
              strokeOpacity={isPureWhite ? 0.25 : 0.45}
            />
          </g>
        )}
      </svg>

      {/* Optional custom children overlay */}
      {children && (
        <div
          style={{
            position: 'absolute',
            left: '32%',
            top: '24%',
            width: '36%',
            height: '46%',
            pointerEvents: 'none',
            mixBlendMode: !isDark || colorMode === 'cmyk' ? 'multiply' : 'normal',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6C. REALISTIC PULLOVER FLEECE HOODIE (Stanley Stella STSU812 / Gildan 18500)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticHoodieFlatLay({
  color = '#1A1A12',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 156, top: 165, w: 188, h: 160 },
  printMethod,
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const isBack = view === 'back'
  const isDark = isColorDark(color)
  const isPureWhite = color.toUpperCase() === '#FFFFFF'

  const strokeColor = isDark ? '#4A4A54' : '#1A1A12'
  const strokeOpacity = isDark ? 0.45 : 0.20
  const shadowColor = isDark ? '#000000' : '#8A857D'

  // Front chest artwork placement (calibrated above kangaroo pouch)
  const chestBox = isBack
    ? { x: 170, y: 145, width: 200, height: 260 }
    : { x: 172, y: 170, width: 196, height: 160 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 540 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} />

          <filter id={`hoodie-drop-${id}`} x="-15%" y="-10%" width="130%" height="135%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity={isDark ? 0.35 : 0.10} />
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity={isDark ? 0.20 : 0.06} />
          </filter>
          {/* Heavyweight fleece light model */}
          <linearGradient id={`hoodie-body-light-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isDark ? 0.15 : 0.88} />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity={isDark ? 0.04 : 0.25} />
            <stop offset="70%" stopColor="#000000" stopOpacity={isDark ? 0.16 : 0.04} />
            <stop offset="100%" stopColor="#000000" stopOpacity={isDark ? 0.34 : 0.12} />
          </linearGradient>
          {/* Inner hood cavity depth */}
          <radialGradient id={`hood-cavity-${id}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#000000" stopOpacity={isDark ? 0.65 : 0.35} />
            <stop offset="70%" stopColor="#000000" stopOpacity={isDark ? 0.40 : 0.18} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          {/* Metal aglet sheen */}
          <linearGradient id={`metal-aglet-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#888890" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#666670" />
          </linearGradient>
          {/* Soft blur for organic cloth fold shadows */}
          <filter id={`soft-drape-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          {/* Subtle heavyweight fleece knit weave grain */}
          <filter id={`hoodie-fleece-weave-${id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.60" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" result="textureGrain" />
            <feBlend mode="multiply" in="SourceGraphic" in2="textureGrain" result="blended" />
            <feComposite in="blended" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>

        {/* Ambient Floor Contact Shadow */}
        <path
          d="M 175 40 L 105 95 C 70 130, 45 220, 34 300 C 25 380, 32 445, 38 505 L 88 518 L 108 300 L 115 572 L 425 572 L 432 300 L 452 518 L 502 505 C 508 445, 515 380, 506 300 C 495 220, 470 130, 435 95 L 365 40 Z"
          fill="#000"
          opacity={isDark ? 0.25 : 0.08}
          transform="translate(0, 14)"
          filter={`url(#hoodie-drop-${id})`}
        />

        {/* ── Main Heavyweight Fleece Body Shell (Full-Length Sleeves) ── */}
        <g id="hoodie-fleece-body">
          <path
            d="M 175 55 L 104 96 C 68 135, 46 220, 36 300 C 28 380, 34 445, 42 495 L 86 508 L 108 220 L 108 500 L 108 550 C 108 560, 118 566, 130 566 L 410 566 C 422 566, 432 560, 432 550 L 432 500 L 432 220 L 454 508 L 498 495 C 506 445, 512 380, 504 300 C 494 220, 472 135, 436 96 L 365 55 Z"
            fill={isPureWhite ? '#FAFAF8' : color}
          />
          <path
            d="M 175 55 L 104 96 C 68 135, 46 220, 36 300 C 28 380, 34 445, 42 495 L 86 508 L 108 220 L 108 500 L 108 550 C 108 560, 118 566, 130 566 L 410 566 C 422 566, 432 560, 432 550 L 432 500 L 432 220 L 454 508 L 498 495 C 506 445, 512 380, 504 300 C 494 220, 472 135, 436 96 L 365 55 Z"
            fill={`url(#hoodie-body-light-${id})`}
          />
        </g>

        {/* ── Raglan Shoulder & Inner Sleeve Seams ── */}
        <path d="M 175 55 L 108 220" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" strokeOpacity={strokeOpacity} />
        <path d="M 365 55 L 432 220" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" strokeOpacity={strokeOpacity} />
        <path d="M 108 220 L 86 508" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />
        <path d="M 432 220 L 454 508" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />

        {/* ── Ribbed Waistband Hem (2-Needle Coverstitch) ── */}
        <rect x="108" y="500" width="324" height="66" rx="4" fill="#000" opacity={isDark ? 0.16 : 0.05} />
        <line x1="108" y1="500" x2="432" y2="500" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
        <line x1="108" y1="566" x2="432" y2="566" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
        <line x1="108" y1="506" x2="432" y2="506" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={strokeOpacity * 0.8} />

        {/* ── Ribbed Sleeve Cuffs ── */}
        <path d="M 42 495 L 86 508" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
        <path d="M 40 510 L 84 523" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity={strokeOpacity * 0.7} />
        <path d="M 498 495 L 454 508" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
        <path d="M 500 510 L 456 523" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity={strokeOpacity * 0.7} />

        {/* ── Kangaroo Pouch Pocket with 3D Depth ── */}
        {!isBack && (
          <g id="kangaroo-pocket">
            <path
              d="M 148 350 L 192 350 C 196 350, 201 354, 204 360 L 222 410 L 318 410 L 336 360 C 339 354, 344 350, 348 350 L 392 350 C 397 350, 401 355, 399 360 L 378 500 L 162 500 L 141 360 C 139 355, 143 350, 148 350 Z"
              fill={isPureWhite ? '#F5F5F0' : color}
            />
            {/* Pocket shading */}
            <path
              d="M 148 350 L 192 350 C 196 350, 201 354, 204 360 L 222 410 L 318 410 L 336 360 C 339 354, 344 350, 348 350 L 392 350 C 397 350, 401 355, 399 360 L 378 500 L 162 500 L 141 360 C 139 355, 143 350, 148 350 Z"
              fill="#000"
              opacity={isDark ? 0.22 : 0.06}
            />
            {/* Topstitching along pocket entry flaps */}
            <path
              d="M 148 350 L 192 350 L 222 410 L 318 410 L 348 350 L 392 350"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeDasharray="4 2"
              strokeOpacity={strokeOpacity}
            />
            <line x1="162" y1="500" x2="378" y2="500" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
          </g>
        )}

        {/* ── Projected User Artwork Stage (Physical Print & Embroidery Finish) ── */}
        <g
          id="hoodie-artwork-stage"
          filter={`url(#hoodie-fleece-weave-${id})`}
          style={{
            mixBlendMode: !isDark || colorMode === 'cmyk' ? 'multiply' : 'normal',
            filter: 'contrast(1.05) saturate(1.03)',
            opacity: isDark ? 0.98 : 1,
          }}
        >
          {renderLayersInSvg(layers, printBox, chestBox, isBack ? 'back' : 'front', colorMode, id, printMethod)}
        </g>

        {/* ── Surface Shading & Fold Ripples OVER the Artwork ── */}
        <g id="hoodie-surface-over-artwork" pointerEvents="none" filter={`url(#soft-drape-${id})`}>
          {/* Subtle softbox lighting sheen crossing the chest */}
          <path
            d="M 185 185 Q 270 205 355 180"
            stroke="#FFFFFF"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
            opacity={isDark ? 0.06 : 0.12}
            style={{ mixBlendMode: 'screen' }}
          />
          {/* Natural soft fleece ripples crossing the chest */}
          <path
            d="M 180 230 Q 270 250 360 225"
            stroke="#000000"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            opacity={isDark ? 0.08 : 0.04}
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d="M 185 300 Q 270 320 355 295"
            stroke="#000000"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            opacity={isDark ? 0.07 : 0.03}
            style={{ mixBlendMode: 'multiply' }}
          />
          {/* Natural sleeve fold creases on left & right arms */}
          <path d="M 68 280 Q 86 292 76 318" stroke="#000000" strokeWidth="12" strokeLinecap="round" fill="none" opacity={isDark ? 0.22 : 0.05} style={{ mixBlendMode: 'multiply' }} />
          <path d="M 472 280 Q 454 292 464 318" stroke="#000000" strokeWidth="12" strokeLinecap="round" fill="none" opacity={isDark ? 0.22 : 0.05} style={{ mixBlendMode: 'multiply' }} />
          <path d="M 60 400 Q 75 412 68 435" stroke="#000000" strokeWidth="12" strokeLinecap="round" fill="none" opacity={isDark ? 0.20 : 0.04} style={{ mixBlendMode: 'multiply' }} />
          <path d="M 480 400 Q 465 412 472 435" stroke="#000000" strokeWidth="12" strokeLinecap="round" fill="none" opacity={isDark ? 0.20 : 0.04} style={{ mixBlendMode: 'multiply' }} />
        </g>

        {/* ── Volumetric 3D Hood & Hanging Drawstrings (Overhangs Chest) ── */}
        <g id="hood-cords-layer">
          {/* Deep Volumetric Hood Arch */}
          <path
            d="M 175 60 C 185 10, 220 -8, 270 -8 C 320 -8, 355 10, 365 60 C 335 105, 205 105, 175 60 Z"
            fill={isPureWhite ? '#FAFAF8' : color}
            stroke={strokeColor}
            strokeWidth="1.4"
            strokeOpacity={strokeOpacity}
          />
          <path
            d="M 175 60 C 185 10, 220 -8, 270 -8 C 320 -8, 355 10, 365 60 C 335 105, 205 105, 175 60 Z"
            fill="#000"
            opacity={isDark ? 0.18 : 0.04}
          />

          {/* Inner Hood Depth Opening & Cavity Shadow */}
          {!isBack && (
            <g id="inner-hood-cavity">
              <path
                d="M 200 64 C 220 88, 320 88, 340 64 C 325 108, 215 108, 200 64 Z"
                fill={`url(#hood-cavity-${id})`}
              />
              {/* Front Neckline Crossover Collar Lapels */}
              <path
                d="M 195 68 C 235 98, 305 98, 345 68"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeOpacity={strokeOpacity}
              />
              <path
                d="M 215 76 C 245 94, 295 94, 325 76"
                stroke={isDark ? '#FFF' : '#333'}
                strokeWidth="0.8"
                strokeOpacity="0.2"
              />

              {/* Brass/Nickel Drawstring Eyelets */}
              <circle cx="238" cy="88" r="4" fill="#333" stroke="#888" strokeWidth="1.2" />
              <circle cx="302" cy="88" r="4" fill="#333" stroke="#888" strokeWidth="1.2" />

              {/* Braided Flat-Knit Cords with Silver Metal Aglets (Dangling IN FRONT of chest) */}
              <g id="drawstrings">
                {/* Left Cord */}
                <path d="M 238 90 Q 232 145, 226 215" stroke="#E2E0D8" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M 238 90 Q 232 145, 226 215" stroke="#999" strokeWidth="1" strokeDasharray="2 1" />
                {/* Metallic Silver Aglet */}
                <rect x="223" y="215" width="6.5" height="15" rx="1.5" fill={`url(#metal-aglet-${id})`} stroke="#444" strokeWidth="0.5" />

                {/* Right Cord */}
                <path d="M 302 90 Q 308 145, 314 215" stroke="#E2E0D8" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M 302 90 Q 308 145, 314 215" stroke="#999" strokeWidth="1" strokeDasharray="2 1" />
                {/* Metallic Silver Aglet */}
                <rect x="311" y="215" width="6.5" height="15" rx="1.5" fill={`url(#metal-aglet-${id})`} stroke="#444" strokeWidth="0.5" />
              </g>
            </g>
          )}
        </g>
      </svg>

      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6D. REALISTIC FULL-ZIP FLEECE HOODIE (Gildan GI18600 Heavy Blend)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticZipHoodieFlatLay({
  color = '#2E4A2E',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 272, top: 160, w: 75, h: 75 },
  printMethod,
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const isBack = view === 'back'
  const isDark = isColorDark(color)
  const isPureWhite = color.toUpperCase() === '#FFFFFF'

  const strokeColor = isDark ? '#4A4A54' : '#1A1A12'
  const strokeOpacity = isDark ? 0.5 : 0.22

  const leftChestBox = { x: 295, y: 175, width: 85, height: 85 }
  const backPanelBox = { x: 170, y: 150, width: 200, height: 260 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 540 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} />
          <filter id={`ziphoodie-drop-${id}`} x="-15%" y="-10%" width="130%" height="135%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity={isDark ? 0.35 : 0.10} />
          </filter>
          <linearGradient id={`zip-body-light-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isDark ? 0.15 : 0.88} />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity={isDark ? 0.04 : 0.25} />
            <stop offset="100%" stopColor="#000000" stopOpacity={isDark ? 0.34 : 0.12} />
          </linearGradient>
          <linearGradient id={`metal-teeth-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#333" />
            <stop offset="50%" stopColor="#DDD" />
            <stop offset="100%" stopColor="#333" />
          </linearGradient>
        </defs>

        {/* Ambient Floor Shadow */}
        <path
          d="M 175 40 L 105 95 C 70 130, 45 220, 34 300 C 25 380, 32 445, 38 505 L 88 518 L 108 300 L 115 572 L 425 572 L 432 300 L 452 518 L 502 505 C 508 445, 515 380, 506 300 C 495 220, 470 130, 435 95 L 365 40 Z"
          fill="#000"
          opacity={isDark ? 0.25 : 0.08}
          transform="translate(0, 14)"
          filter={`url(#ziphoodie-drop-${id})`}
        />

        {/* Main Body Fleece (Full-Length Sleeves) */}
        <path
          d="M 175 55 L 104 96 C 68 135, 46 220, 36 300 C 28 380, 34 445, 42 495 L 86 508 L 108 220 L 108 500 L 108 550 C 108 560, 118 566, 130 566 L 410 566 C 422 566, 432 560, 432 550 L 432 500 L 432 220 L 454 508 L 498 495 C 506 445, 512 380, 504 300 C 494 220, 472 135, 436 96 L 365 55 Z"
          fill={isPureWhite ? '#FAFAF8' : color}
        />
        <path
          d="M 175 55 L 104 96 C 68 135, 46 220, 36 300 C 28 380, 34 445, 42 495 L 86 508 L 108 220 L 108 500 L 108 550 C 108 560, 118 566, 130 566 L 410 566 C 422 566, 432 560, 432 550 L 432 500 L 432 220 L 454 508 L 498 495 C 506 445, 512 380, 504 300 C 494 220, 472 135, 436 96 L 365 55 Z"
          fill={`url(#zip-body-light-${id})`}
        />

        {/* Inner Sleeve Seam Lines & Wrist Cuffs */}
        <path d="M 108 220 L 86 508" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />
        <path d="M 432 220 L 454 508" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />
        <path d="M 42 495 L 86 508" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
        <path d="M 498 495 L 454 508" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />

        {/* Full-Length Front Metallic Zipper Track (Front View Only) */}
        {!isBack && (
          <g id="center-zipper">
            <line x1="270" y1="88" x2="270" y2="566" stroke="#1A1A1A" strokeWidth="8" />
            <line x1="270" y1="88" x2="270" y2="566" stroke={`url(#metal-teeth-${id})`} strokeWidth="3.5" strokeDasharray="3 1.5" />
            {/* Metal zipper pull */}
            <rect x="265" y="112" width="10" height="18" rx="2" fill="#DCDCE2" stroke="#444" strokeWidth="0.8" />
            <circle cx="270" cy="124" r="2.5" fill="#333" />
          </g>
        )}

        {/* Split Kangaroo Pockets */}
        {!isBack && (
          <g id="split-pockets">
            <path d="M 148 365 L 188 365 C 193 365, 197 368, 200 373 L 218 415 L 265 415 L 265 500 L 162 500 L 141 375 C 139 370, 144 365, 148 365 Z" fill={color} stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
            <path d="M 392 365 L 352 365 C 347 365, 343 368, 340 373 L 322 415 L 275 415 L 275 500 L 378 500 L 399 375 C 401 370, 396 365, 392 365 Z" fill={color} stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
          </g>
        )}

        {/* Volumetric Hood Arch */}
        <g id="hood-top">
          <path d="M 175 60 C 185 10, 220 -8, 270 -8 C 320 -8, 355 10, 365 60 C 335 105, 205 105, 175 60 Z" fill={isPureWhite ? '#FAFAF8' : color} stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
          {!isBack && <ellipse cx="270" cy="62" rx="58" ry="34" fill="#000" opacity={isDark ? 0.45 : 0.20} />}
        </g>

        {/* Artwork Stage */}
        <g
          id="zip-artwork-stage"
          style={{
            mixBlendMode: !isDark || colorMode === 'cmyk' ? 'multiply' : 'normal',
            filter: 'contrast(1.04) saturate(1.02)',
            opacity: isDark ? 0.96 : 1,
          }}
        >
          {isBack
            ? renderLayersInSvg(layers, printBox, backPanelBox, 'back', colorMode, id, printMethod)
            : renderLayersInSvg(layers, printBox, leftChestBox, 'left chest', colorMode, id, printMethod)}
        </g>

        {/* Shading overlay over chest print */}
        <g id="zip-surface-shading" pointerEvents="none">
          <path
            d="M 280 200 Q 330 220 375 205"
            stroke="#000000"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            opacity={isDark ? 0.28 : 0.07}
            style={{ mixBlendMode: 'multiply' }}
          />
        </g>
      </svg>

      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6E. REALISTIC HEAVY COTTON CANVAS TOTE BAG
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticToteBagFlatLay({
  color = '#C8BC9A',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 165, top: 235, w: 170, h: 170 },
  printMethod,
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const isDark = isColorDark(color)
  const isPureWhite = color.toUpperCase() === '#FFFFFF'

  const strokeColor = isDark ? '#4A4A54' : '#1A1A12'
  const strokeOpacity = isDark ? 0.5 : 0.22

  const toteArtBox = { x: 145, y: 220, width: 230, height: 250 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 520 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} />
          <filter id={`tote-drop-${id}`} x="-15%" y="-10%" width="130%" height="135%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity={isDark ? 0.28 : 0.10} />
          </filter>
          <linearGradient id={`tote-light-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isDark ? 0.15 : 0.75} />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity={isDark ? 0.03 : 0.15} />
            <stop offset="100%" stopColor="#000000" stopOpacity={isDark ? 0.28 : 0.10} />
          </linearGradient>
        </defs>

        {/* Floor Shadow */}
        <rect x="75" y="170" width="370" height="400" rx="8" fill="#000" opacity="0.08" transform="translate(0, 14)" filter={`url(#tote-drop-${id})`} />

        {/* Back Webbing Handle */}
        <path d="M 180 180 C 180 35, 220 25, 260 25 C 300 25, 340 35, 340 180" stroke={color} strokeWidth="20" strokeLinecap="round" />
        <path d="M 180 180 C 180 35, 220 25, 260 25 C 300 25, 340 35, 340 180" stroke="#000" strokeWidth="20" strokeLinecap="round" opacity="0.14" />
        <path d="M 180 180 C 180 35, 220 25, 260 25 C 300 25, 340 35, 340 180" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />

        {/* Main Canvas Tote Body */}
        <path
          d="M 85 180 L 70 540 C 70 556, 82 566, 98 566 L 422 566 C 438 566, 450 556, 450 540 L 435 180 Z"
          fill={isPureWhite ? '#FAFAF8' : color}
        />
        <path
          d="M 85 180 L 70 540 C 70 556, 82 566, 98 566 L 422 566 C 438 566, 450 556, 450 540 L 435 180 Z"
          fill={`url(#tote-light-${id})`}
        />

        {/* Top Fold Hem with Double Stitching */}
        <rect x="83" y="180" width="354" height="28" fill="#000" opacity={isDark ? 0.20 : 0.05} />
        <line x1="83" y1="208" x2="437" y2="208" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" strokeOpacity={strokeOpacity} />

        {/* Front Webbing Handle */}
        <path d="M 175 208 C 175 60, 215 50, 260 50 C 305 50, 345 60, 345 208" stroke={color} strokeWidth="20" strokeLinecap="round" />
        <path d="M 175 208 C 175 60, 215 50, 260 50 C 305 50, 345 60, 345 208" stroke="#000" strokeWidth="20" strokeLinecap="round" opacity={isDark ? 0.15 : 0.05} />
        <path d="M 175 208 C 175 60, 215 50, 260 50 C 305 50, 345 60, 345 208" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />

        {/* Box-X Reinforced Stitches at Handle Anchors */}
        <rect x="166" y="184" width="18" height="22" fill="none" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
        <line x1="166" y1="184" x2="184" y2="206" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
        <line x1="184" y1="184" x2="166" y2="206" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />

        <rect x="336" y="184" width="18" height="22" fill="none" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
        <line x1="336" y1="184" x2="354" y2="206" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
        <line x1="354" y1="184" x2="336" y2="206" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />

        {/* Artwork Stage */}
        <g
          id="tote-artwork-stage"
          style={{
            mixBlendMode: !isDark || colorMode === 'cmyk' ? 'multiply' : 'normal',
            filter: 'contrast(1.05) saturate(1.02)',
            opacity: isDark ? 0.96 : 1,
          }}
        >
          {renderLayersInSvg(layers, printBox, toteArtBox, view, colorMode, id, printMethod)}
        </g>

        {/* ── Heavy Canvas Weave Shading & Creases OVER the Artwork ── */}
        <g id="tote-canvas-over-artwork" pointerEvents="none">
          <path
            d="M 100 320 Q 260 350 420 310"
            stroke="#000000"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            opacity={isDark ? 0.28 : 0.06}
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d="M 110 430 Q 260 460 410 420"
            stroke="#000000"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            opacity={isDark ? 0.24 : 0.05}
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d="M 120 280 Q 260 305 400 275"
            stroke="#FFFFFF"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            opacity={isDark ? 0.06 : 0.14}
            style={{ mixBlendMode: 'screen' }}
          />
        </g>
      </svg>

      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6F. REALISTIC ARCHIVAL MATTE POSTER IN GALLERY FRAME
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticPosterMockup({
  color = '#FFFFFF',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 120, top: 90, w: 260, h: 380 },
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const posterArtBox = { x: 75, y: 60, width: 310, height: 430 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 460 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.09)]"
      >
        <defs>
          <filter id={`poster-drop-${id}`} x="-15%" y="-10%" width="130%" height="135%">
            <feDropShadow dx="0" dy="20" stdDeviation="18" floodColor="#000" floodOpacity="0.16" />
          </filter>
          <linearGradient id={`glaze-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Cast Wall Shadow */}
        <rect x="40" y="24" width="380" height="500" rx="4" fill="#000" opacity="0.08" transform="translate(0, 14)" filter={`url(#poster-drop-${id})`} />

        {/* Gallery Frame */}
        <rect x="40" y="24" width="380" height="500" rx="3" fill="#1A1A12" stroke="#2A2A22" strokeWidth="2.5" />

        {/* Beveled Archival Matting */}
        <rect x="58" y="42" width="344" height="464" fill="#FAF8F5" stroke="#E2DFD8" strokeWidth="1" />

        {/* Paper Surface */}
        <rect x="75" y="60" width="310" height="430" fill={color} stroke="#D4D0C8" strokeWidth="0.8" />

        {/* Artwork Stage */}
        <g id="poster-art-stage">
          {renderLayersInSvg(layers, printBox, posterArtBox, 'front', colorMode)}
        </g>

        {/* Glazing Reflection */}
        <rect x="58" y="42" width="344" height="464" fill={`url(#glaze-${id})`} pointerEvents="none" />
      </svg>

      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6G. REALISTIC VELVETEEN PLUSH FLEECE BLANKET (50" × 60")
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticBlanketMockup({
  color = '#FDFBF7',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 100, top: 60, w: 300, h: 440 },
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const blanketArtBox = { x: 50, y: 40, width: 420, height: 500 }
  const isDark = isColorDark(color)

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 520 580"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <filter id={`blanket-drop-${id}`} x="-15%" y="-10%" width="130%" height="135%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity="0.12" />
          </filter>
          <linearGradient id={`fleece-light-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.08" />
          </linearGradient>
          {/* Subtle micro-plush fiber pattern */}
          <pattern id={`fleece-fibers-${id}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#000" opacity="0.03" />
            <circle cx="5" cy="5" r="0.8" fill="#FFF" opacity="0.06" />
          </pattern>
        </defs>

        {/* Ambient Drop Shadow */}
        <rect x="40" y="30" width="440" height="520" rx="16" fill="#000" opacity="0.08" transform="translate(0, 12)" filter={`url(#blanket-drop-${id})`} />

        {/* Plush Blanket Fleece Body */}
        <rect x="40" y="30" width="440" height="520" rx="16" fill={color} />
        <rect x="40" y="30" width="440" height="520" rx="16" fill={`url(#fleece-light-${id})`} />
        <rect x="40" y="30" width="440" height="520" rx="16" fill={`url(#fleece-fibers-${id})`} />

        {/* ── Artwork Stage (Blended Into Plush Fleece) ── */}
        <g
          id="blanket-art-stage"
          style={{
            mixBlendMode: !isDark || colorMode === 'cmyk' ? 'multiply' : 'normal',
            filter: 'contrast(1.04) saturate(1.02)',
            opacity: isDark ? 0.96 : 1,
          }}
        >
          {renderLayersInSvg(layers, printBox, blanketArtBox, 'front', colorMode)}
        </g>

        {/* ── Organic Soft Fleece Folds & Drapery OVER the Artwork ── */}
        <g id="blanket-drape-overlay" pointerEvents="none">
          <path d="M 60 175 Q 260 215 460 165" stroke="#000" strokeWidth="14" strokeOpacity="0.05" strokeLinecap="round" fill="none" style={{ mixBlendMode: 'multiply' }} />
          <path d="M 60 375 Q 260 415 460 365" stroke="#000" strokeWidth="16" strokeOpacity="0.05" strokeLinecap="round" fill="none" style={{ mixBlendMode: 'multiply' }} />
          <path d="M 60 165 Q 260 205 460 155" stroke="#FFF" strokeWidth="12" strokeOpacity="0.12" strokeLinecap="round" fill="none" style={{ mixBlendMode: 'screen' }} />
          <path d="M 60 365 Q 260 405 460 355" stroke="#FFF" strokeWidth="14" strokeOpacity="0.12" strokeLinecap="round" fill="none" style={{ mixBlendMode: 'screen' }} />
        </g>

        {/* Whipped Blanket Stitch Hem (Whipstitch Border) */}
        <rect x="44" y="34" width="432" height="512" rx="14" fill="none" stroke="#000" strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.25" />
      </svg>

      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6H. REALISTIC SPUN POLYESTER SQUARE THROW PILLOW (18" × 18")
   ═══════════════════════════════════════════════════════════════════════════════ */
export function RealisticPillowMockup({
  color = '#FFFFFF',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 120, top: 120, w: 260, h: 260 },
  printMethod,
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const pillowArtBox = { x: 105, y: 105, width: 290, height: 290 }
  const isDark = isColorDark(color)

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.08)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} />
          <filter id={`pillow-drop-${id}`} x="-15%" y="-10%" width="130%" height="135%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity="0.14" />
          </filter>
          {/* 3D Spherical Plump Volume Gradient */}
          <radialGradient id={`pillow-puff-${id}`} cx="45%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isDark ? 0.20 : 0.95} />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity={isDark ? 0.05 : 0.35} />
            <stop offset="85%" stopColor="#000000" stopOpacity={isDark ? 0.22 : 0.08} />
            <stop offset="100%" stopColor="#000000" stopOpacity={isDark ? 0.40 : 0.18} />
          </radialGradient>
          {/* Over-Artwork Spherical Shadow */}
          <radialGradient id={`pillow-art-shadow-${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity={isDark ? 0.35 : 0.18} />
          </radialGradient>
        </defs>

        {/* Ambient Floor Shadow */}
        <ellipse cx="250" cy="450" rx="190" ry="24" fill="#000" opacity="0.12" filter={`url(#pillow-drop-${id})`} />

        {/* 3D Plump Pillow Contour with Pinched Corners */}
        <path
          d="M 75 75 Q 250 45 425 75 Q 455 250 425 425 Q 250 455 75 425 Q 45 250 75 75 Z"
          fill={color}
        />
        <path
          d="M 75 75 Q 250 45 425 75 Q 455 250 425 425 Q 250 455 75 425 Q 45 250 75 75 Z"
          fill={`url(#pillow-puff-${id})`}
        />

        {/* ── Artwork Stage (Blended with Pillow Surface) ── */}
        <g
          id="pillow-art-stage"
          style={{
            mixBlendMode: !isDark || colorMode === 'cmyk' ? 'multiply' : 'normal',
            filter: 'contrast(1.04) saturate(1.02)',
            opacity: isDark ? 0.96 : 1,
          }}
        >
          {renderLayersInSvg(layers, printBox, pillowArtBox, view, colorMode, id, printMethod)}
        </g>

        {/* ── 3D Volume Shading OVER the Artwork (Gives Graphic Curvature) ── */}
        <g id="pillow-volume-overlay" pointerEvents="none">
          <path
            d="M 75 75 Q 250 45 425 75 Q 455 250 425 425 Q 250 455 75 425 Q 45 250 75 75 Z"
            fill={`url(#pillow-art-shadow-${id})`}
            style={{ mixBlendMode: 'multiply' }}
          />
          {/* Subtle central pillow highlight */}
          <ellipse
            cx="225"
            cy="195"
            rx="120"
            ry="90"
            fill="#FFFFFF"
            opacity={isDark ? 0.08 : 0.16}
            style={{ mixBlendMode: 'screen' }}
          />
        </g>

        {/* Piped Edge Seam Welt Cord */}
        <path
          d="M 75 75 Q 250 45 425 75 Q 455 250 425 425 Q 250 455 75 425 Q 45 250 75 75 Z"
          stroke="#1A1A12"
          strokeWidth="1.4"
          strokeOpacity="0.22"
          fill="none"
        />

        {/* Corner Pinch Indent Lines */}
        <line x1="75" y1="75" x2="110" y2="110" stroke="#000" strokeWidth="1.8" strokeOpacity="0.18" strokeLinecap="round" />
        <line x1="425" y1="75" x2="390" y2="110" stroke="#000" strokeWidth="1.8" strokeOpacity="0.18" strokeLinecap="round" />
        <line x1="425" y1="425" x2="390" y2="390" stroke="#000" strokeWidth="1.8" strokeOpacity="0.18" strokeLinecap="round" />
        <line x1="75" y1="425" x2="110" y2="390" stroke="#000" strokeWidth="1.8" strokeOpacity="0.18" strokeLinecap="round" />
      </svg>

      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   7. UNIVERSAL REALISTIC PRODUCT PREVIEW ROUTER
   ═══════════════════════════════════════════════════════════════════════════════ */
export interface RealisticProductPreviewProps {
  productType: string
  productId?: string
  view?: string
  sceneId?: string
  color?: string
  colorMode?: 'cmyk' | 'rgb'
  layers?: ArtworkLayer[]
  printBox?: { left: number; top: number; w: number; h: number }
  printMethod?: PrintMethod
  className?: string
  photoId?: string
  children?: React.ReactNode
}

export function RealisticProductPreview({
  productType,
  productId,
  view = 'front',
  sceneId,
  color = '#FFFFFF',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 152, top: 130, w: 196, h: 290 },
  printMethod,
  className = '',
  photoId,
  children,
}: RealisticProductPreviewProps) {
  const normType = (productType || 'tshirt').toLowerCase()
  const normId = (productId || '').toLowerCase()
  const isBack = view === 'back' || sceneId === 'back' || sceneId === 'flat-back'

  // Model torso view for t-shirt, tank, or sweatshirt
  if (photoId && (sceneId === 'on-person' || sceneId === 'on-person-2')) {
    return (
      <RealisticModelTorsoMockup
        photoUrl={photoId.startsWith('/') ? photoId : `https://images.unsplash.com/${photoId}?w=1200&auto=format&fit=crop&q=85`}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        targetChest={
          sceneId === 'on-person-2'
            ? { x: 165, y: 110, width: 210, height: 260 }
            : { x: 175, y: 155, width: 190, height: 240 }
        }
        className={className}
      >
        {children}
      </RealisticModelTorsoMockup>
    )
  }

  // Blanket -> Velveteen Plush Blanket
  if (normType === 'blanket' || normId.includes('blanket')) {
    return (
      <RealisticBlanketMockup
        color={color}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticBlanketMockup>
    )
  }

  // Pillow -> Spun Polyester Square Pillowcase
  if (normType === 'pillow' || normId.includes('pillow')) {
    return (
      <RealisticPillowMockup
        color={color}
        view={isBack ? 'back' : 'front'}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticPillowMockup>
    )
  }

  // Poster -> Archival Matte Art Poster
  if (normType === 'poster' || normId.includes('poster')) {
    return (
      <RealisticPosterMockup
        color={color}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticPosterMockup>
    )
  }

  // Canvas Tote Bag
  if (normType === 'tote' || normId.includes('tote')) {
    return (
      <RealisticToteBagFlatLay
        color={color}
        view={isBack ? 'back' : 'front'}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticToteBagFlatLay>
    )
  }

  // Full-Zip Hoodie (Gildan 18600)
  if (normType === 'hoodie-zip' || normId.includes('hoodie-zip') || normId.includes('zip')) {
    return (
      <RealisticZipHoodieFlatLay
        color={color}
        view={isBack ? 'back' : 'front'}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticZipHoodieFlatLay>
    )
  }

  // Pullover Hoodie (Stanley Stella STSU812)
  if (normType === 'hoodie' || normId.includes('hoodie')) {
    return (
      <RealisticHoodieFlatLay
        color={color}
        view={isBack ? 'back' : 'front'}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticHoodieFlatLay>
    )
  }

  // Sleeveless Tank Top / Muscle Tank (Bella+Canvas 6003)
  if (normType === 'tank' || normType.includes('tank') || normType.includes('muscle') || normType.includes('sleeveless')) {
    return (
      <RealisticTankTopFlatLay
        color={color}
        view={isBack ? 'back' : 'front'}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticTankTopFlatLay>
    )
  }

  // Cap / Hat -> 3D Twill Flat Bill Snapback
  if (normType === 'hat' || normType === 'cap' || normType.includes('snapback') || normType.includes('hat')) {
    const capView = isBack ? 'back' : sceneId === 'side' || sceneId === 'front-side' ? 'front-side' : 'front'
    return (
      <RealisticCapMockup
        color={color}
        view={capView}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticCapMockup>
    )
  }

  // Sweatshirt -> Heavyweight Crewneck Flat Lay (No Hood)
  if (normType === 'sweatshirt' || normType.includes('sweat')) {
    return (
      <RealisticSweatshirtFlatLay
        color={color}
        view={isBack ? 'back' : 'front'}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticSweatshirtFlatLay>
    )
  }

  // Letterman / Varsity Jacket
  if (normType === 'jacket' || normType.includes('jacket') || normType.includes('letterman')) {
    return (
      <RealisticVarsityJacket
        color={color}
        view={isBack ? 'back' : 'front'}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticVarsityJacket>
    )
  }

  // Ceramic Mug
  if (normType === 'mug' || normType.includes('cup')) {
    const mugView = sceneId === 'wrap' ? 'wrap' : sceneId === 'handle-left' ? 'handle_left' : 'front'
    return (
      <RealisticMugMockup
        color={color}
        view={mugView}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticMugMockup>
    )
  }

  // Long-Sleeve Shirts / Tees with full sleeves (Gildan 2400, Russell Outdoors, Port Authority)
  const isExplicitLongSleeve =
    normType === 'longsleeve' ||
    normType === 'tshirt-longsleeve' ||
    normId.includes('longsleeve') ||
    normId === 'camo-longsleeve' ||
    normId === 'shirt-daybreak' ||
    normId.startsWith('shirt-oxford')

  if (isExplicitLongSleeve) {
    return (
      <RealisticLongSleeveFlatLay
        color={color}
        view={isBack ? 'back' : 'front'}
        sceneId={sceneId}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticLongSleeveFlatLay>
    )
  }

  // Default: T-Shirt Studio Flat Lay (Authentic Printify Photographic Blanks)
  return (
    <RealisticTShirtFlatLay
      color={color}
      view={isBack ? 'back' : 'front'}
      colorMode={colorMode}
      layers={layers}
      printBox={printBox}
      printMethod={printMethod}
      className={className}
    >
      {children}
    </RealisticTShirtFlatLay>
  )
}

