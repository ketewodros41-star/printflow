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

export function isColorDark(hex: string): boolean {
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
export function PrintTechniqueSvgDefs({ id, isDark = false }: { id: string; isDark?: boolean }) {
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
        <feDropShadow in="litThread" dx="0.6" dy="1.4" stdDeviation="0.8" floodColor="#000000" floodOpacity={isDark ? 0.60 : 0.40} />
      </filter>

      {/* ── 1B. CHENILLE / FUZZY MOSS-STITCH (Exact Match to User Image 1: Radiating Yarn Loop Whiskers, Tactile 3D Relief) ── */}
      <filter id={`technique-chenille-${id}`} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.48 0.48" numOctaves="4" result="loopNoise" />
        <feDisplacementMap in="SourceGraphic" in2="loopNoise" scale="4.2" xChannelSelector="R" yChannelSelector="G" result="fringedLoops" />
        <feTurbulence type="fractalNoise" baseFrequency="0.85 0.85" numOctaves="3" result="microFibers" />
        <feDisplacementMap in="fringedLoops" in2="microFibers" scale="1.8" xChannelSelector="B" yChannelSelector="R" result="fuzzyTufts" />
        <feDropShadow in="fuzzyTufts" dx="0.8" dy="1.6" stdDeviation="0.9" floodColor="#000000" floodOpacity={isDark ? 0.75 : 0.55} result="contactShadow" />
        <feDropShadow in="contactShadow" dx="2.0" dy="3.2" stdDeviation="2.8" floodColor="#000000" floodOpacity={isDark ? 0.40 : 0.28} />
      </filter>

      {/* ── 2. DIRECT-TO-GARMENT (DTG) (Water-based ink embedded in micro combed-cotton fibers) ── */}
      <filter id={`technique-dtg-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.55 0.50" numOctaves="2" result="fiberGrain" />
        <feDisplacementMap in="SourceGraphic" in2="fiberGrain" scale="0.35" xChannelSelector="R" yChannelSelector="G" result="embeddedInk" />
        <feComponentTransfer in="embeddedInk" result="tonedInk">
          <feFuncR type="linear" slope="1.02" />
          <feFuncG type="linear" slope="1.02" />
          <feFuncB type="linear" slope="1.02" />
        </feComponentTransfer>
        {isDark ? (
          <feDropShadow in="tonedInk" dx="0" dy="0.35" stdDeviation="0.3" floodColor="#FFFFFF" floodOpacity="0.16" />
        ) : (
          <feDropShadow in="tonedInk" dx="0.2" dy="0.4" stdDeviation="0.3" floodColor="#000000" floodOpacity="0.15" />
        )}
      </filter>

      {/* ── 3. SCREEN PRINTING (Thick opaque plastisol ink layer, crisp stencil edges, subtle ink bevel) ── */}
      <filter id={`technique-screen-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" result="screenGrain" />
        <feDisplacementMap in="SourceGraphic" in2="screenGrain" scale="0.25" xChannelSelector="R" yChannelSelector="G" result="texturedInk" />
        <feDropShadow in="texturedInk" dx="0.3" dy="0.5" stdDeviation="0.35" floodColor="#000000" floodOpacity={isDark ? 0.40 : 0.22} result="shadowInk" />
        {isDark && (
          <feDropShadow in="shadowInk" dx="0" dy="0.35" stdDeviation="0.3" floodColor="#FFFFFF" floodOpacity="0.18" />
        )}
      </filter>

      {/* ── 4. DIRECT-TO-FILM (DTF) (High vibrancy, razor-sharp edge, smooth polymer film with satin sheen) ── */}
      <filter id={`technique-dtf-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feComponentTransfer in="SourceGraphic" result="vibrantFilm">
          <feFuncR type="linear" slope="1.04" />
          <feFuncG type="linear" slope="1.04" />
          <feFuncB type="linear" slope="1.04" />
        </feComponentTransfer>
        <feSpecularLighting in="SourceAlpha" surfaceScale="1.4" specularConstant="0.45" specularExponent="18" lightingColor="#FFFFFF" result="filmSheen">
          <feDistantLight azimuth="220" elevation="65" />
        </feSpecularLighting>
        <feComposite in="filmSheen" in2="SourceAlpha" operator="in" result="sheenMasked" />
        <feBlend mode="screen" in="vibrantFilm" in2="sheenMasked" result="litFilm" />
        <feDropShadow in="litFilm" dx="0.3" dy="0.5" stdDeviation="0.35" floodColor="#000000" floodOpacity={isDark ? 0.35 : 0.18} result="shadedFilm" />
        {isDark && (
          <feDropShadow in="shadedFilm" dx="0" dy="0.35" stdDeviation="0.3" floodColor="#FFFFFF" floodOpacity="0.18" />
        )}
      </filter>

      {/* ── 5. VINTAGE DISCHARGE (Distressed soft-hand discharge, bleached cotton fiber feel) ── */}
      <filter id={`technique-vintage-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="3" result="vintageNoise" />
        <feDisplacementMap in="SourceGraphic" in2="vintageNoise" scale="1.0" xChannelSelector="R" yChannelSelector="G" result="weathered" />
        <feColorMatrix in="weathered" type="matrix" values="
          0.96 0 0 0 0.02
          0 0.96 0 0 0.02
          0 0 0.96 0 0.02
          0 0 0 0.92 0" result="weatheredToned" />
        <feComposite in="weatheredToned" in2="SourceAlpha" operator="in" />
      </filter>

      {/* ── 6. HEAT TRANSFER VINYL (HTV) (Solid matte rubberized cut finish, crisp bevel edge) ── */}
      <filter id={`technique-vinyl-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feDropShadow in="SourceGraphic" dx="0.4" dy="0.7" stdDeviation="0.35" floodColor="#000000" floodOpacity={isDark ? 0.40 : 0.25} result="shadowVinyl" />
        {isDark && (
          <feDropShadow in="shadowVinyl" dx="0" dy="0.35" stdDeviation="0.3" floodColor="#FFFFFF" floodOpacity="0.18" />
        )}
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
  globalPrintMethod?: PrintMethod,
  isDarkGarment: boolean = false
) {
  const normSide = (side || 'front').toLowerCase()
  const relevantLayers = layers.filter(l => {
    if (l.visible === false) return false
    const v = (l.view || 'Center chest').toLowerCase()
    if (normSide === 'all') return true

    if (normSide === 'collar' || normSide.includes('undercollar')) {
      return v.includes('collar') || v === 'all'
    }
    if (normSide === 'placket') {
      return v.includes('placket') || v === 'all'
    }
    if (normSide === 'sleeve_right' || normSide.includes('right sleeve') || normSide.includes('right-sleeve')) {
      return (v.includes('right sleeve') || (v.includes('right') && !v.includes('chest') && !v.includes('front'))) || v === 'all'
    }
    if (normSide === 'sleeve_left' || normSide.includes('left sleeve') || normSide.includes('left-sleeve')) {
      return (v.includes('left sleeve') || (v.includes('left') && !v.includes('chest') && !v.includes('front'))) || v === 'all'
    }
    if (normSide === 'back') {
      return (v.includes('back') && !v.includes('collar')) || v === 'all'
    }
    if (normSide === 'front' || normSide === 'wrap' || normSide === 'front-side' || normSide.includes('handle')) {
      if (v.includes('sleeve') || v.includes('collar') || v.includes('placket')) {
        return false
      }
      return v.includes('front') || v.includes('chest') || v.includes('center') || v.includes('crown') || v.includes('wrap') || v.includes('handle') || v === 'all'
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
    const isDarkText = isColorDark(l.color ?? '#000000')

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
              stroke={
                method === 'chenille' || method === 'embroidery'
                  ? (l.color ?? '#000000')
                  : (isDarkGarment && isDarkText)
                  ? '#FFFFFF'
                  : undefined
              }
              strokeWidth={
                method === 'chenille'
                  ? Math.max(1.2, fontSize * 0.055)
                  : method === 'embroidery'
                  ? Math.max(0.6, fontSize * 0.035)
                  : (isDarkGarment && isDarkText)
                  ? Math.max(0.6, fontSize * 0.02)
                  : undefined
              }
              strokeOpacity={(isDarkGarment && isDarkText) && method !== 'chenille' && method !== 'embroidery' ? 0.25 : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ paintOrder: 'stroke fill' }}
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
            stroke={
              method === 'chenille' || method === 'embroidery'
                ? (l.color ?? '#000000')
                : (isDarkGarment && isDarkText)
                ? '#FFFFFF'
                : undefined
            }
            strokeWidth={
              method === 'chenille'
                ? Math.max(1.2, fontSize * 0.055)
                : method === 'embroidery'
                ? Math.max(0.6, fontSize * 0.035)
                : (isDarkGarment && isDarkText)
                ? Math.max(0.6, fontSize * 0.02)
                : undefined
            }
            strokeOpacity={(isDarkGarment && isDarkText) && method !== 'chenille' && method !== 'embroidery' ? 0.25 : undefined}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ paintOrder: 'stroke fill' }}
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

const TSHIRT_BACK_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/tshirt-flatlay-back-white.png',
  '#1A1A12': '/mockups/tshirt-flatlay-back-black.png',
  '#1B2A4A': '/mockups/tshirt-flatlay-back-navy.png',
  '#C8C5C0': '/mockups/tshirt-flatlay-back-heather-grey.png',
  '#9A9A8E': '/mockups/tshirt-flatlay-back-heather-grey.png',
  '#C62828': '/mockups/tshirt-flatlay-back-red.png',
  '#2E4A2E': '/mockups/tshirt-flatlay-back-forest-green.png',
  '#4A5E35': '/mockups/tshirt-flatlay-back-olive.png',
  '#8FAF7A': '/mockups/tshirt-flatlay-back-sage.png',
  '#373435': '/mockups/tshirt-flatlay-back-pepper.png',
  '#7799B5': '/mockups/tshirt-flatlay-back-chambray.png',
  '#8DB8A7': '/mockups/tshirt-flatlay-back-seafoam.png',
  '#B86851': '/mockups/tshirt-flatlay-back-terracotta.png',
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
    ? TSHIRT_BACK_ASSETS[normColor]
    : TSHIRT_FLATLAY_ASSETS[normColor]

  const cleanHex = normColor.replace('#', '')
  const r = (parseInt(cleanHex.substring(0, 2), 16) || 255) / 255
  const g = (parseInt(cleanHex.substring(2, 4), 16) || 255) / 255
  const b = (parseInt(cleanHex.substring(4, 6), 16) || 255) / 255

  // Direct high-res photographic blank when available, or high-res white flat-lay dynamically tinted
  const assetUrl = directAsset || (isBack ? '/mockups/tshirt-flatlay-back-white.png' : '/mockups/tshirt-flatlay-white.png')

  const targetChest = printBox
    ? {
        x: (printBox.left / 500) * 985,
        y: (printBox.top / 500) * 1024,
        width: (printBox.w / 500) * 985,
        height: (printBox.h / 500) * 1024,
      }
    : (isBack
        ? { x: 310, y: 200, width: 365, height: 500 }
        : { x: 310, y: 225, width: 365, height: 490 })

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

          {/* Dynamic photographic fabric tinting for custom garment colors (Front & Back) */}
          {!directAsset && (
            <filter id={`garment-tint-tshirt-${id}`} colorInterpolationFilters="sRGB">
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
          filter={!directAsset ? `url(#garment-tint-tshirt-${id})` : undefined}
        />

        {/* ── Artwork Projected Directly Inside SVG Vector Space (Authentic Technique Finish) ── */}
        <g
          id="artwork-projection-group"
          style={{
            mixBlendMode: 'normal',
            filter: 'contrast(1.02) saturate(1.02)',
          }}
        >
          {renderLayersInSvg(layers, printBox, targetChest, view, colorMode, id, printMethod, isDark)}
        </g>

        {/* Authentic Fabric Fold & Lighting Crease Overlay (Printify Physical Integration) */}
        {layers.length > 0 && (
          <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }} opacity={0.12}>
            <image
              href={assetUrl}
              x="0"
              y="0"
              width="985"
              height="1024"
            />
          </g>
        )}
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
  const targetChest = isCollarCloseup
    ? (isBack ? { x: 335, y: 210, width: 354, height: 490 } : { x: 335, y: 230, width: 354, height: 480 })
    : (printBox
        ? {
            x: (printBox.left / 500) * 1024,
            y: (printBox.top / 500) * 953,
            width: (printBox.w / 500) * 1024,
            height: (printBox.h / 500) * 953,
          }
        : (isBack
            ? { x: 335, y: 210, width: 354, height: 490 }
            : { x: 335, y: 230, width: 354, height: 480 }))

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
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
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
          {renderLayersInSvg(layers, printBox, targetChest, isBack ? 'back' : 'front', colorMode, id, printMethod, isDark)}
        </g>

        {/* Authentic Fabric Fold & Lighting Crease Overlay (Printify Physical Integration) */}
        {layers.length > 0 && (
          <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }} opacity={0.12} clipPath={`url(#ls-print-clip-${id})`}>
            <image
              href={assetUrl}
              x="0"
              y="0"
              width="1024"
              height="953"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        )}

        {children}
      </svg>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════════
   1C. REALISTIC POLO SHIRT (Unisex Performance Pique All-Over Print Polo)
   ═══════════════════════════════════════════════════════════════════════════════ */
export const POLO_SUBLIMATION_FRONT_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/polo-sublimation-front-white.png',
  '#1A1A12': '/mockups/polo-sublimation-front-black.png',
  '#1B2A4A': '/mockups/polo-sublimation-front-navy.png',
  '#C8C5C0': '/mockups/polo-sublimation-front-heather-grey.png',
  '#C62828': '/mockups/polo-sublimation-front-red.png',
  '#2E4A2E': '/mockups/polo-sublimation-front-forest-green.png',
  '#4A5E35': '/mockups/polo-sublimation-front-olive.png',
  '#8FAF7A': '/mockups/polo-sublimation-front-sage.png',
  '#373435': '/mockups/polo-sublimation-front-pepper.png',
  '#7799B5': '/mockups/polo-sublimation-front-chambray.png',
  '#8DB8A7': '/mockups/polo-sublimation-front-seafoam.png',
  '#B86851': '/mockups/polo-sublimation-front-terracotta.png',
}

export const POLO_SUBLIMATION_BACK_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/polo-sublimation-back-white.png',
  '#1A1A12': '/mockups/polo-sublimation-back-black.png',
  '#1B2A4A': '/mockups/polo-sublimation-back-navy.png',
  '#C8C5C0': '/mockups/polo-sublimation-back-heather-grey.png',
  '#C62828': '/mockups/polo-sublimation-back-red.png',
  '#2E4A2E': '/mockups/polo-sublimation-back-forest-green.png',
  '#4A5E35': '/mockups/polo-sublimation-back-olive.png',
  '#8FAF7A': '/mockups/polo-sublimation-back-sage.png',
  '#373435': '/mockups/polo-sublimation-back-pepper.png',
  '#7799B5': '/mockups/polo-sublimation-back-chambray.png',
  '#8DB8A7': '/mockups/polo-sublimation-back-seafoam.png',
  '#B86851': '/mockups/polo-sublimation-back-terracotta.png',
}

export function RealisticPoloFlatLay({
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
    ? POLO_SUBLIMATION_BACK_ASSETS[normColor]
    : POLO_SUBLIMATION_FRONT_ASSETS[normColor]

  const cleanHex = normColor.replace('#', '')
  const r = (parseInt(cleanHex.substring(0, 2), 16) || 255) / 255
  const g = (parseInt(cleanHex.substring(2, 4), 16) || 255) / 255
  const b = (parseInt(cleanHex.substring(4, 6), 16) || 255) / 255

  const assetUrl = directAsset || (isBack ? '/mockups/polo-sublimation-back-white.png' : '/mockups/polo-sublimation-front-white.png')

  const neutralBlankUrl = isBack ? '/mockups/polo-sublimation-back-white.png' : '/mockups/polo-sublimation-front-white.png'

  // Target coordinates on 954 x 1024 polo canvas
  const mainTargetBox = isBack
    ? { x: 295, y: 200, width: 365, height: 530 }
    : { x: 295, y: 240, width: 360, height: 490 }

  const collarTargetBox = isBack
    ? { x: 370, y: 72, width: 214, height: 75 }
    : { x: 375, y: 65, width: 204, height: 160 }

  const placketTargetBox = { x: 447, y: 180, width: 60, height: 210 }

  // Screen-left sleeve (wearer right on front, wearer left on back)
  const screenLeftSleeveBox = { x: 55, y: 160, width: 235, height: 260 }
  // Screen-right sleeve (wearer left on front, wearer right on back)
  const screenRightSleeveBox = { x: 665, y: 160, width: 235, height: 260 }

  const rightSleeveTargetBox = isBack ? screenRightSleeveBox : screenLeftSleeveBox
  const leftSleeveTargetBox = isBack ? screenLeftSleeveBox : screenRightSleeveBox

  // Calibrated reference print boxes from editor stage
  const POLO_TORSO_PRINT_BOX = { left: 145, top: 85, w: 210, h: 375 }
  const POLO_COLLAR_PRINT_BOX = { left: 65, top: 105, w: 370, h: 80 }
  const POLO_PLACKET_PRINT_BOX = { left: 145, top: 95, w: 110, h: 260 }
  const POLO_SLEEVE_PRINT_BOX = { left: 95, top: 105, w: 310, h: 185 }

  // Filter layers by target panels
  const mainLayers = layers.filter(l => {
    if (l.visible === false) return false
    const v = (l.view || 'front').toLowerCase()
    return isBack
      ? v.includes('back') && !v.includes('collar')
      : (v.includes('front') || v.includes('chest') || v.includes('all')) && !v.includes('sleeve') && !v.includes('collar') && !v.includes('placket')
  })

  const collarLayers = layers.filter(l => {
    if (l.visible === false) return false
    const v = (l.view || '').toLowerCase()
    return v.includes('collar')
  })

  const placketLayers = !isBack ? layers.filter(l => {
    if (l.visible === false) return false
    const v = (l.view || '').toLowerCase()
    return v.includes('placket')
  }) : []

  const rightSleeveLayers = layers.filter(l => {
    if (l.visible === false) return false
    const v = (l.view || '').toLowerCase()
    return (v.includes('right sleeve') || (v.includes('right') && !v.includes('chest') && !v.includes('front')))
  })

  const leftSleeveLayers = layers.filter(l => {
    if (l.visible === false) return false
    const v = (l.view || '').toLowerCase()
    return (v.includes('left sleeve') || (v.includes('left') && !v.includes('chest') && !v.includes('front')))
  })

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 954 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} isDark={isDark} />

          {/* Dynamic fabric dye filter (only for custom non-preset colors) */}
          {!directAsset && (
            <filter id={`garment-tint-polo-${id}`} colorInterpolationFilters="sRGB">
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
                <feFuncR type="linear" slope="1.05" intercept="0.015" />
                <feFuncG type="linear" slope="1.05" intercept="0.015" />
                <feFuncB type="linear" slope="1.05" intercept="0.015" />
              </feComponentTransfer>
            </filter>
          )}

          {/* Alpha-to-White mask generator: converts graphic alpha into solid white mask for crease draping */}
          <filter id={`alpha-mask-${id}`} colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                0 0 0 1 0
                0 0 0 1 0
                0 0 0 1 0
                0 0 0 1 0"
            />
          </filter>

          {/* Neutral Grayscale Crease Shading Filter: balanced at 0.50 neutral gray for 0% color bleed on flat fabric */}
          <filter id={`polo-crease-shading-${id}`} colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                0.299 0.587 0.114 0 0
                0.299 0.587 0.114 0 0
                0.299 0.587 0.114 0 0
                0     0     0     1 0"
              result="grayLuma"
            />
            <feComponentTransfer in="grayLuma" result="balancedCrease">
              <feFuncR type="linear" slope="2.0" intercept="-1.266" />
              <feFuncG type="linear" slope="2.0" intercept="-1.266" />
              <feFuncB type="linear" slope="2.0" intercept="-1.266" />
            </feComponentTransfer>
          </filter>

          {/* Panel Seam Clip Boundaries aligned to physical hem at y=942 */}
          <clipPath id={`polo-print-clip-front-${id}`}>
            <path d="M 295,235 C 330,225 380,220 477,220 C 574,220 624,225 659,235 L 728,470 L 741,942 C 650,942 550,942 477,942 C 404,942 304,942 198,942 L 226,470 Z" />
          </clipPath>

          <clipPath id={`polo-print-clip-back-${id}`}>
            <path d="M 365,142 C 420,158 535,158 590,142 L 665,220 L 728,470 L 741,942 C 650,942 550,942 477,942 C 404,942 304,942 198,942 L 226,470 L 289,220 Z" />
          </clipPath>

          <clipPath id={`polo-collar-clip-${id}`}>
            {isBack ? (
              <polygon points="365,72 589,72 585,142 369,142" />
            ) : (
              <polygon points="370,60 585,60 560,240 477,185 394,240" />
            )}
          </clipPath>

          <clipPath id={`polo-placket-clip-${id}`}>
            <rect x="444" y="175" width="66" height="220" rx="3" />
          </clipPath>

          <clipPath id={`polo-screen-left-sleeve-clip-${id}`}>
            <polygon points="310,205 368,118 39,345 160,480 230,470 305,225" />
          </clipPath>

          <clipPath id={`polo-screen-right-sleeve-clip-${id}`}>
            <polygon points="644,205 586,118 915,345 794,480 724,470 649,225" />
          </clipPath>

          {/* Masks for Artwork-Only Crease Draping */}
          {mainLayers.length > 0 && (
            <mask id={`polo-art-mask-main-${id}`}>
              <g filter={`url(#alpha-mask-${id})`}>
                {renderLayersInSvg(
                  mainLayers,
                  POLO_TORSO_PRINT_BOX,
                  mainTargetBox,
                  isBack ? 'back' : 'front',
                  colorMode,
                  undefined,
                  undefined,
                  isDark
                )}
              </g>
            </mask>
          )}

          {collarLayers.length > 0 && (
            <mask id={`polo-art-mask-collar-${id}`}>
              <g filter={`url(#alpha-mask-${id})`}>
                {renderLayersInSvg(
                  collarLayers,
                  POLO_COLLAR_PRINT_BOX,
                  collarTargetBox,
                  'collar',
                  colorMode,
                  undefined,
                  undefined,
                  isDark
                )}
              </g>
            </mask>
          )}

          {placketLayers.length > 0 && (
            <mask id={`polo-art-mask-placket-${id}`}>
              <g filter={`url(#alpha-mask-${id})`}>
                {renderLayersInSvg(
                  placketLayers,
                  POLO_PLACKET_PRINT_BOX,
                  placketTargetBox,
                  'placket',
                  colorMode,
                  undefined,
                  undefined,
                  isDark
                )}
              </g>
            </mask>
          )}

          {rightSleeveLayers.length > 0 && (
            <mask id={`polo-art-mask-right-sleeve-${id}`}>
              <g filter={`url(#alpha-mask-${id})`}>
                {renderLayersInSvg(
                  rightSleeveLayers,
                  POLO_SLEEVE_PRINT_BOX,
                  rightSleeveTargetBox,
                  'sleeve_right',
                  colorMode,
                  undefined,
                  undefined,
                  isDark
                )}
              </g>
            </mask>
          )}

          {leftSleeveLayers.length > 0 && (
            <mask id={`polo-art-mask-left-sleeve-${id}`}>
              <g filter={`url(#alpha-mask-${id})`}>
                {renderLayersInSvg(
                  leftSleeveLayers,
                  POLO_SLEEVE_PRINT_BOX,
                  leftSleeveTargetBox,
                  'sleeve_left',
                  colorMode,
                  undefined,
                  undefined,
                  isDark
                )}
              </g>
            </mask>
          )}
        </defs>

        {/* ── Studio Flat-Lay Photographic Blank (100% Continuous Uniform Garment Fabric) ── */}
        <image
          href={assetUrl}
          x="0"
          y="0"
          width="954"
          height="1024"
          preserveAspectRatio="xMidYMid meet"
          filter={!directAsset ? `url(#garment-tint-polo-${id})` : undefined}
        />

        {/* ── Main Torso (Front or Back) Artwork Stage ── */}
        {mainLayers.length > 0 && (
          <>
            <g
              id="polo-main-stage"
              clipPath={isBack ? `url(#polo-print-clip-back-${id})` : `url(#polo-print-clip-front-${id})`}
              style={{
                mixBlendMode: printMethod === 'vintage' ? 'multiply' : 'normal',
                filter: 'contrast(1.02) saturate(1.02)',
              }}
            >
              {renderLayersInSvg(
                mainLayers,
                POLO_TORSO_PRINT_BOX,
                mainTargetBox,
                isBack ? 'back' : 'front',
                colorMode,
                id,
                printMethod,
                isDark
              )}
            </g>
            {/* Seamless Fabric Crease Drape (Only over artwork pixels via mask, using neutral white luminance map) */}
            <g
              clipPath={isBack ? `url(#polo-print-clip-back-${id})` : `url(#polo-print-clip-front-${id})`}
              mask={`url(#polo-art-mask-main-${id})`}
              style={{
                mixBlendMode: 'soft-light',
                pointerEvents: 'none',
              }}
              opacity={0.16}
            >
              <image
                href={neutralBlankUrl}
                x="0"
                y="0"
                width="954"
                height="1024"
                preserveAspectRatio="xMidYMid meet"
                filter={`url(#polo-crease-shading-${id})`}
              />
            </g>
          </>
        )}

        {/* ── Collar Artwork Projection ── */}
        {collarLayers.length > 0 && (
          <>
            <g
              id="polo-collar-stage"
              clipPath={`url(#polo-collar-clip-${id})`}
              style={{
                mixBlendMode: printMethod === 'vintage' ? 'multiply' : 'normal',
                filter: 'contrast(1.02) saturate(1.02)',
              }}
            >
              {renderLayersInSvg(
                collarLayers,
                POLO_COLLAR_PRINT_BOX,
                collarTargetBox,
                'collar',
                colorMode,
                id,
                printMethod,
                isDark
              )}
            </g>
            {/* Seamless Collar Crease Drape */}
            <g
              clipPath={`url(#polo-collar-clip-${id})`}
              mask={`url(#polo-art-mask-collar-${id})`}
              style={{
                mixBlendMode: 'soft-light',
                pointerEvents: 'none',
              }}
              opacity={0.16}
            >
              <image
                href={neutralBlankUrl}
                x="0"
                y="0"
                width="954"
                height="1024"
                preserveAspectRatio="xMidYMid meet"
                filter={`url(#polo-crease-shading-${id})`}
              />
            </g>
          </>
        )}

        {/* ── Placket Artwork Projection ── */}
        {placketLayers.length > 0 && (
          <>
            <g
              id="polo-placket-stage"
              clipPath={`url(#polo-placket-clip-${id})`}
              style={{
                mixBlendMode: printMethod === 'vintage' ? 'multiply' : 'normal',
                filter: 'contrast(1.02) saturate(1.02)',
              }}
            >
              {renderLayersInSvg(
                placketLayers,
                POLO_PLACKET_PRINT_BOX,
                placketTargetBox,
                'placket',
                colorMode,
                id,
                printMethod,
                isDark
              )}
            </g>
            {/* Seamless Placket Crease Drape */}
            <g
              clipPath={`url(#polo-placket-clip-${id})`}
              mask={`url(#polo-art-mask-placket-${id})`}
              style={{
                mixBlendMode: 'soft-light',
                pointerEvents: 'none',
              }}
              opacity={0.16}
            >
              <image
                href={neutralBlankUrl}
                x="0"
                y="0"
                width="954"
                height="1024"
                preserveAspectRatio="xMidYMid meet"
                filter={`url(#polo-crease-shading-${id})`}
              />
            </g>
          </>
        )}

        {/* ── Right Sleeve Projection ── */}
        {rightSleeveLayers.length > 0 && (
          <>
            <g
              id="polo-right-sleeve-stage"
              clipPath={isBack ? `url(#polo-screen-right-sleeve-clip-${id})` : `url(#polo-screen-left-sleeve-clip-${id})`}
              style={{
                mixBlendMode: printMethod === 'vintage' ? 'multiply' : 'normal',
                filter: 'contrast(1.02) saturate(1.02)',
              }}
            >
              {renderLayersInSvg(
                rightSleeveLayers,
                POLO_SLEEVE_PRINT_BOX,
                rightSleeveTargetBox,
                'sleeve_right',
                colorMode,
                id,
                printMethod,
                isDark
              )}
            </g>
            {/* Seamless Right Sleeve Crease Drape */}
            <g
              clipPath={isBack ? `url(#polo-screen-right-sleeve-clip-${id})` : `url(#polo-screen-left-sleeve-clip-${id})`}
              mask={`url(#polo-art-mask-right-sleeve-${id})`}
              style={{
                mixBlendMode: 'soft-light',
                pointerEvents: 'none',
              }}
              opacity={0.16}
            >
              <image
                href={neutralBlankUrl}
                x="0"
                y="0"
                width="954"
                height="1024"
                preserveAspectRatio="xMidYMid meet"
                filter={`url(#polo-crease-shading-${id})`}
              />
            </g>
          </>
        )}

        {/* ── Left Sleeve Projection ── */}
        {leftSleeveLayers.length > 0 && (
          <>
            <g
              id="polo-left-sleeve-stage"
              clipPath={isBack ? `url(#polo-screen-left-sleeve-clip-${id})` : `url(#polo-screen-right-sleeve-clip-${id})`}
              style={{
                mixBlendMode: printMethod === 'vintage' ? 'multiply' : 'normal',
                filter: 'contrast(1.02) saturate(1.02)',
              }}
            >
              {renderLayersInSvg(
                leftSleeveLayers,
                POLO_SLEEVE_PRINT_BOX,
                leftSleeveTargetBox,
                'sleeve_left',
                colorMode,
                id,
                printMethod,
                isDark
              )}
            </g>
            {/* Seamless Left Sleeve Crease Drape */}
            <g
              clipPath={isBack ? `url(#polo-screen-left-sleeve-clip-${id})` : `url(#polo-screen-right-sleeve-clip-${id})`}
              mask={`url(#polo-art-mask-left-sleeve-${id})`}
              style={{
                mixBlendMode: 'soft-light',
                pointerEvents: 'none',
              }}
              opacity={0.16}
            >
              <image
                href={neutralBlankUrl}
                x="0"
                y="0"
                width="954"
                height="1024"
                preserveAspectRatio="xMidYMid meet"
                filter={`url(#polo-crease-shading-${id})`}
              />
            </g>
          </>
        )}

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
const SWEATSHIRT_FLATLAY_FRONT_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/sweatshirt-flatlay-front-white.png',
  '#1A1A12': '/mockups/sweatshirt-flatlay-front-black.png',
  '#1B2A4A': '/mockups/sweatshirt-flatlay-front-navy.png',
  '#C8C5C0': '/mockups/sweatshirt-flatlay-front-heather-grey.png',
  '#9A9A8E': '/mockups/sweatshirt-flatlay-front-heather-grey.png',
  '#C62828': '/mockups/sweatshirt-flatlay-front-red.png',
  '#581825': '/mockups/sweatshirt-flatlay-front-red.png',
  '#2E4A2E': '/mockups/sweatshirt-flatlay-front-forest-green.png',
  '#4A5E35': '/mockups/sweatshirt-flatlay-front-olive.png',
  '#8FAF7A': '/mockups/sweatshirt-flatlay-front-sage.png',
  '#373435': '/mockups/sweatshirt-flatlay-front-pepper.png',
  '#7799B5': '/mockups/sweatshirt-flatlay-front-chambray.png',
  '#8DB8A7': '/mockups/sweatshirt-flatlay-front-seafoam.png',
  '#B86851': '/mockups/sweatshirt-flatlay-front-terracotta.png',
  '#D1C7BD': '/mockups/sweatshirt-flatlay-front-heather-grey.png',
}

const SWEATSHIRT_FLATLAY_BACK_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/sweatshirt-flatlay-back-white.png',
  '#1A1A12': '/mockups/sweatshirt-flatlay-back-black.png',
  '#1B2A4A': '/mockups/sweatshirt-flatlay-back-navy.png',
  '#C8C5C0': '/mockups/sweatshirt-flatlay-back-heather-grey.png',
  '#9A9A8E': '/mockups/sweatshirt-flatlay-back-heather-grey.png',
  '#C62828': '/mockups/sweatshirt-flatlay-back-red.png',
  '#581825': '/mockups/sweatshirt-flatlay-back-red.png',
  '#2E4A2E': '/mockups/sweatshirt-flatlay-back-forest-green.png',
  '#4A5E35': '/mockups/sweatshirt-flatlay-back-olive.png',
  '#8FAF7A': '/mockups/sweatshirt-flatlay-back-sage.png',
  '#373435': '/mockups/sweatshirt-flatlay-back-pepper.png',
  '#7799B5': '/mockups/sweatshirt-flatlay-back-chambray.png',
  '#8DB8A7': '/mockups/sweatshirt-flatlay-back-seafoam.png',
  '#B86851': '/mockups/sweatshirt-flatlay-back-terracotta.png',
  '#D1C7BD': '/mockups/sweatshirt-flatlay-back-heather-grey.png',
}

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
  const normColor = (color || '#FFFFFF').toUpperCase()

  const directAsset = isBack
    ? SWEATSHIRT_FLATLAY_BACK_ASSETS[normColor]
    : SWEATSHIRT_FLATLAY_FRONT_ASSETS[normColor]

  const cleanHex = normColor.replace('#', '')
  const r = (parseInt(cleanHex.substring(0, 2), 16) || 255) / 255
  const g = (parseInt(cleanHex.substring(2, 4), 16) || 255) / 255
  const b = (parseInt(cleanHex.substring(4, 6), 16) || 255) / 255

  const assetUrl = directAsset || (isBack ? '/mockups/sweatshirt-flatlay-back-white.png' : '/mockups/sweatshirt-flatlay-white.png')

  // Target coordinates calibrated on 1024x1024 photographic studio crewneck sweatshirt blank
  const targetChest = printBox
    ? {
        x: (printBox.left / 500) * 1024,
        y: (printBox.top / 500) * 1024,
        width: (printBox.w / 500) * 1024,
        height: (printBox.h / 500) * 1024,
      }
    : (isBack
        ? { x: 310, y: 230, width: 404, height: 500 }
        : { x: 310, y: 260, width: 404, height: 480 })

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} isDark={dark} />
          {!directAsset && (
            <filter id={`garment-tint-sweat-${id}`} colorInterpolationFilters="sRGB">
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

        {/* Studio Flat-Lay Photographic Blank */}
        <image
          href={assetUrl}
          x="0"
          y="0"
          width="1024"
          height="1024"
          filter={!directAsset ? `url(#garment-tint-sweat-${id})` : undefined}
        />

        {/* Projected Artwork with Manufacturing Shaders */}
        <g
          id="artwork-projection-group"
          style={{
            mixBlendMode: 'normal',
            filter: 'contrast(1.02) saturate(1.02)',
          }}
        >
          {renderLayersInSvg(layers, printBox, targetChest, isBack ? 'back' : 'front', colorMode, id, printMethod, dark)}
        </g>

        {/* Physical Heavyweight Fleece Fold Overlay */}
        {layers.length > 0 && (
          <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }} opacity={0.16}>
            <image href={assetUrl} x="0" y="0" width="1024" height="1024" />
          </g>
        )}
      </svg>
      {children}
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
const MUG_STUDIO_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/mug-studio-white.png',
  '#1A1A12': '/mockups/mug-studio-black.png',
}

export function RealisticMugMockup({
  color = '#FFFFFF',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox = { left: 145, top: 145, w: 170, h: 210 },
  printMethod,
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const normColor = (color || '#FFFFFF').toUpperCase()
  const isWrap = view === 'wrap'
  const isHandleLeft = view === 'handle_left' || view === 'left'

  const assetUrl = MUG_STUDIO_ASSETS[normColor] || (dark ? '/mockups/mug-studio-black.png' : '/mockups/mug-studio-white.png')

  // Target cylindrical coordinates calibrated on 1024x1024 photographic studio mug blank
  // Default right handle: cylinder face is x: 250..640 (w: 390)
  // Left handle (flipped): cylinder face is x: 384..774 (w: 390)
  // Wrap view covers full cylindrical body width: x: 200..690 (w: 490)
  const targetBox = isWrap
    ? { x: 200, y: 240, width: 490, height: 530 }
    : isHandleLeft
    ? { x: 384, y: 260, width: 390, height: 490 }
    : { x: 250, y: 260, width: 390, height: 490 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} isDark={dark} />
          {/* Ceramic Cylindrical Print Clip Path */}
          <clipPath id={`mug-clip-${id}`}>
            <rect x={targetBox.x} y={targetBox.y} width={targetBox.width} height={targetBox.height} rx="8" />
          </clipPath>

          {/* Ceramic Cylindrical Specular Glaze Overlay */}
          <linearGradient id={`ceramic-sheen-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity={dark ? 0.35 : 0.65} />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity={dark ? 0.15 : 0.30} />
            <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.35 : 0.10} />
          </linearGradient>
        </defs>

        {/* Studio Ceramic Blank (flips horizontally for left-handle view) */}
        <image
          href={assetUrl}
          x="0"
          y="0"
          width="1024"
          height="1024"
          transform={isHandleLeft ? 'scale(-1, 1) translate(-1024, 0)' : undefined}
        />

        {/* Projected Artwork with Manufacturing Shaders */}
        <g
          id="artwork-projection-group"
          clipPath={`url(#mug-clip-${id})`}
          style={{
            mixBlendMode: 'normal',
            filter: 'contrast(1.02) saturate(1.02)',
          }}
        >
          {renderLayersInSvg(layers, printBox, targetBox, view, colorMode, id, printMethod, dark)}
        </g>

        {/* Ceramic High-Gloss Curvature Specular Sheen (only active when artwork is present) */}
        {layers.length > 0 && (
          <rect
            x={targetBox.x}
            y={targetBox.y}
            width={targetBox.width}
            height={targetBox.height}
            clipPath={`url(#mug-clip-${id})`}
            fill={`url(#ceramic-sheen-${id})`}
            style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
            opacity={dark ? 0.55 : 0.8}
          />
        )}

        {/* Photographic Glaze & Reflection Overlay */}
        {layers.length > 0 && (
          <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }} opacity={0.22}>
            <image
              href={assetUrl}
              x="0"
              y="0"
              width="1024"
              height="1024"
              transform={isHandleLeft ? 'scale(-1, 1) translate(-1024, 0)' : undefined}
            />
          </g>
        )}
      </svg>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6B. REALISTIC RAW SLEEVELESS MUSCLE TANK TOP (Exact Bella+Canvas 6003 Reference)
   ═══════════════════════════════════════════════════════════════════════════════ */
const TANK_FLATLAY_FRONT_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/tank-flatlay-front-white.png',
  '#1A1A12': '/mockups/tank-flatlay-front-black.png',
  '#C8C5C0': '/mockups/tank-flatlay-front-heather-grey.png',
  '#4A4A48': '/mockups/tank-flatlay-front-dark-grey-heather.png',
  '#B87B7B': '/mockups/tank-flatlay-front-mauve.png',
  '#4A5240': '/mockups/tank-flatlay-front-military-green.png',
  '#1B2A4A': '/mockups/tank-flatlay-front-navy.png',
  '#C62828': '/mockups/tank-flatlay-front-red.png',
  '#2E4A2E': '/mockups/tank-flatlay-front-forest-green.png',
  '#4A5E35': '/mockups/tank-flatlay-front-olive.png',
  '#8FAF7A': '/mockups/tank-flatlay-front-sage.png',
  '#373435': '/mockups/tank-flatlay-front-pepper.png',
  '#7799B5': '/mockups/tank-flatlay-front-chambray.png',
  '#8DB8A7': '/mockups/tank-flatlay-front-seafoam.png',
  '#B86851': '/mockups/tank-flatlay-front-terracotta.png',
}

const TANK_FLATLAY_BACK_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/tank-flatlay-back-white.png',
  '#1A1A12': '/mockups/tank-flatlay-back-black.png',
  '#C8C5C0': '/mockups/tank-flatlay-back-heather-grey.png',
  '#4A4A48': '/mockups/tank-flatlay-back-dark-grey-heather.png',
  '#B87B7B': '/mockups/tank-flatlay-back-mauve.png',
  '#4A5240': '/mockups/tank-flatlay-back-military-green.png',
  '#1B2A4A': '/mockups/tank-flatlay-back-navy.png',
  '#C62828': '/mockups/tank-flatlay-back-red.png',
  '#2E4A2E': '/mockups/tank-flatlay-back-forest-green.png',
  '#4A5E35': '/mockups/tank-flatlay-back-olive.png',
  '#8FAF7A': '/mockups/tank-flatlay-back-sage.png',
  '#373435': '/mockups/tank-flatlay-back-pepper.png',
  '#7799B5': '/mockups/tank-flatlay-back-chambray.png',
  '#8DB8A7': '/mockups/tank-flatlay-back-seafoam.png',
  '#B86851': '/mockups/tank-flatlay-back-terracotta.png',
}

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
  const normColor = (color || '#FFFFFF').toUpperCase()

  const directAsset = isBack
    ? TANK_FLATLAY_BACK_ASSETS[normColor]
    : TANK_FLATLAY_FRONT_ASSETS[normColor]

  const cleanHex = normColor.replace('#', '')
  const r = (parseInt(cleanHex.substring(0, 2), 16) || 255) / 255
  const g = (parseInt(cleanHex.substring(2, 4), 16) || 255) / 255
  const b = (parseInt(cleanHex.substring(4, 6), 16) || 255) / 255

  const assetUrl = directAsset || (isBack ? '/mockups/tank-flatlay-back-white.png' : '/mockups/tank-flatlay-white.png')

  // Target coordinates calibrated on 1024x1024 photographic studio muscle tank blank
  const targetChest = printBox
    ? {
        x: (printBox.left / 500) * 1024,
        y: (printBox.top / 500) * 1024,
        width: (printBox.w / 500) * 1024,
        height: (printBox.h / 500) * 1024,
      }
    : (isBack
        ? { x: 335, y: 230, width: 354, height: 480 }
        : { x: 335, y: 270, width: 354, height: 460 })

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} isDark={isDark} />
          {!directAsset && (
            <filter id={`garment-tint-tank-${id}`} colorInterpolationFilters="sRGB">
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

        {/* Studio Flat-Lay Photographic Blank */}
        <image
          href={assetUrl}
          x="0"
          y="0"
          width="1024"
          height="1024"
          filter={!directAsset ? `url(#garment-tint-tank-${id})` : undefined}
        />

        {/* Projected Artwork with Manufacturing Shaders */}
        <g
          id="artwork-projection-group"
          style={{
            mixBlendMode: 'normal',
            filter: 'contrast(1.02) saturate(1.02)',
          }}
        >
          {renderLayersInSvg(layers, printBox, targetChest, view, colorMode, id, printMethod, isDark)}
        </g>

        {/* Physical Cotton Jersey Fold Crease Overlay */}
        {layers.length > 0 && (
          <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }} opacity={0.14}>
            <image href={assetUrl} x="0" y="0" width="1024" height="1024" />
          </g>
        )}
      </svg>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6C. REALISTIC PULLOVER FLEECE HOODIE (Stanley Stella STSU812 / Gildan 18500)
   ═══════════════════════════════════════════════════════════════════════════════ */
const HOODIE_FLATLAY_FRONT_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/hoodie-flatlay-front-white.png',
  '#1A1A12': '/mockups/hoodie-flatlay-front-black.png',
  '#1B2A4A': '/mockups/hoodie-flatlay-front-navy.png',
  '#C8C5C0': '/mockups/hoodie-flatlay-front-heather-grey.png',
  '#9A9A8E': '/mockups/hoodie-flatlay-front-heather-grey.png',
  '#C62828': '/mockups/hoodie-flatlay-front-red.png',
  '#2E4A2E': '/mockups/hoodie-flatlay-front-forest-green.png',
  '#4A5E35': '/mockups/hoodie-flatlay-front-olive.png',
  '#8FAF7A': '/mockups/hoodie-flatlay-front-sage.png',
  '#373435': '/mockups/hoodie-flatlay-front-pepper.png',
  '#7799B5': '/mockups/hoodie-flatlay-front-chambray.png',
  '#8DB8A7': '/mockups/hoodie-flatlay-front-seafoam.png',
  '#B86851': '/mockups/hoodie-flatlay-front-terracotta.png',
  '#D1C7BD': '/mockups/hoodie-flatlay-front-heather-grey.png',
  '#FAF9F6': '/mockups/hoodie-flatlay-front-white.png',
  '#232326': '/mockups/hoodie-flatlay-front-black.png',
  '#263447': '/mockups/hoodie-flatlay-front-navy.png',
  '#4A543E': '/mockups/hoodie-flatlay-front-olive.png',
  '#4A4A48': '/mockups/hoodie-flatlay-front-heather-grey.png',
  '#581825': '/mockups/hoodie-flatlay-front-red.png',
}

const HOODIE_FLATLAY_BACK_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/hoodie-flatlay-back-white.png',
  '#1A1A12': '/mockups/hoodie-flatlay-back-black.png',
  '#1B2A4A': '/mockups/hoodie-flatlay-back-navy.png',
  '#C8C5C0': '/mockups/hoodie-flatlay-back-heather-grey.png',
  '#9A9A8E': '/mockups/hoodie-flatlay-back-heather-grey.png',
  '#C62828': '/mockups/hoodie-flatlay-back-red.png',
  '#2E4A2E': '/mockups/hoodie-flatlay-back-forest-green.png',
  '#4A5E35': '/mockups/hoodie-flatlay-back-olive.png',
  '#8FAF7A': '/mockups/hoodie-flatlay-back-sage.png',
  '#373435': '/mockups/hoodie-flatlay-back-pepper.png',
  '#7799B5': '/mockups/hoodie-flatlay-back-chambray.png',
  '#8DB8A7': '/mockups/hoodie-flatlay-back-seafoam.png',
  '#B86851': '/mockups/hoodie-flatlay-back-terracotta.png',
  '#D1C7BD': '/mockups/hoodie-flatlay-back-heather-grey.png',
  '#FAF9F6': '/mockups/hoodie-flatlay-back-white.png',
  '#232326': '/mockups/hoodie-flatlay-back-black.png',
  '#263447': '/mockups/hoodie-flatlay-back-navy.png',
  '#4A543E': '/mockups/hoodie-flatlay-back-olive.png',
  '#4A4A48': '/mockups/hoodie-flatlay-back-heather-grey.png',
  '#581825': '/mockups/hoodie-flatlay-back-red.png',
}

export function RealisticHoodieFlatLay({
  color = '#1A1A12',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox,
  printMethod,
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const isBack = view === 'back'
  const isDark = isColorDark(color)
  const normColor = (color || '#FFFFFF').toUpperCase()

  const directAsset = isBack
    ? HOODIE_FLATLAY_BACK_ASSETS[normColor]
    : HOODIE_FLATLAY_FRONT_ASSETS[normColor]

  const cleanHex = normColor.replace('#', '')
  const r = (parseInt(cleanHex.substring(0, 2), 16) || 255) / 255
  const g = (parseInt(cleanHex.substring(2, 4), 16) || 255) / 255
  const b = (parseInt(cleanHex.substring(4, 6), 16) || 255) / 255

  const assetUrl = directAsset || (isBack ? '/mockups/hoodie-flatlay-back-white.png' : '/mockups/hoodie-flatlay-front-white.png')

  // 1:1 Scale & Coordinate Parity: directly project from printBox with 1024/500 ratio
  const resolvedPrintBox = printBox || (isBack
    ? { left: 150, top: 137, w: 200, h: 234 }
    : { left: 157, top: 168, w: 186, h: 136 })

  const targetChest = {
    x: (resolvedPrintBox.left / 500) * 1024,
    y: (resolvedPrintBox.top / 500) * 1024,
    width: (resolvedPrintBox.w / 500) * 1024,
    height: (resolvedPrintBox.h / 500) * 1024,
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} isDark={isDark} />
          {!directAsset && (
            <filter id={`garment-tint-hoodie-${id}`} colorInterpolationFilters="sRGB">
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

        {/* Studio Flat-Lay Photographic Blank */}
        <image
          href={assetUrl}
          x="0"
          y="0"
          width="1024"
          height="1024"
          filter={!directAsset ? `url(#garment-tint-hoodie-${id})` : undefined}
        />

        {/* Projected Artwork with Manufacturing Shaders */}
        <g
          id="artwork-projection-group"
          style={{
            mixBlendMode: 'normal',
            filter: 'contrast(1.02) saturate(1.02)',
          }}
        >
          {renderLayersInSvg(layers, resolvedPrintBox, targetChest, view, colorMode, id, printMethod, isDark)}
        </g>

        {/* Physical Fleece Fold Crease & Lighting Overlay */}
        {layers.length > 0 && (
          <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }} opacity={0.16}>
            <image href={assetUrl} x="0" y="0" width="1024" height="1024" />
          </g>
        )}
      </svg>
      {children}
    </div>
  )
}

const ZIP_HOODIE_FLATLAY_FRONT_ASSETS: Record<string, string> = {
  '#FFFFFF': '/mockups/hoodie-zip-flatlay-front-white.png',
  '#1A1A12': '/mockups/hoodie-zip-flatlay-front-black.png',
  '#1B2A4A': '/mockups/hoodie-zip-flatlay-front-navy.png',
  '#C8C5C0': '/mockups/hoodie-zip-flatlay-front-heather-grey.png',
  '#9A9A8E': '/mockups/hoodie-zip-flatlay-front-heather-grey.png',
  '#C62828': '/mockups/hoodie-zip-flatlay-front-red.png',
  '#2E4A2E': '/mockups/hoodie-zip-flatlay-front-forest-green.png',
  '#4A5E35': '/mockups/hoodie-zip-flatlay-front-olive.png',
  '#8FAF7A': '/mockups/hoodie-zip-flatlay-front-sage.png',
  '#373435': '/mockups/hoodie-zip-flatlay-front-pepper.png',
  '#7799B5': '/mockups/hoodie-zip-flatlay-front-chambray.png',
  '#8DB8A7': '/mockups/hoodie-zip-flatlay-front-seafoam.png',
  '#B86851': '/mockups/hoodie-zip-flatlay-front-terracotta.png',
  '#D1C7BD': '/mockups/hoodie-zip-flatlay-front-heather-grey.png',
  '#FAF9F6': '/mockups/hoodie-zip-flatlay-front-white.png',
  '#232326': '/mockups/hoodie-zip-flatlay-front-black.png',
  '#263447': '/mockups/hoodie-zip-flatlay-front-navy.png',
  '#4A543E': '/mockups/hoodie-zip-flatlay-front-olive.png',
  '#4A4A48': '/mockups/hoodie-zip-flatlay-front-heather-grey.png',
  '#581825': '/mockups/hoodie-zip-flatlay-front-red.png',
}

export function RealisticZipHoodieFlatLay({
  color = '#2E4A2E',
  view = 'front',
  colorMode = 'rgb',
  layers = [],
  printBox,
  printMethod,
  className = '',
  children,
}: RealisticFlatLayProps) {
  const id = useId().replace(/:/g, '')
  const isBack = view === 'back'
  const isDark = isColorDark(color)
  const normColor = (color || '#FFFFFF').toUpperCase()

  const directAsset = isBack
    ? HOODIE_FLATLAY_BACK_ASSETS[normColor]
    : ZIP_HOODIE_FLATLAY_FRONT_ASSETS[normColor]

  const cleanHex = normColor.replace('#', '')
  const r = (parseInt(cleanHex.substring(0, 2), 16) || 255) / 255
  const g = (parseInt(cleanHex.substring(2, 4), 16) || 255) / 255
  const b = (parseInt(cleanHex.substring(4, 6), 16) || 255) / 255

  const assetUrl = directAsset || (isBack ? '/mockups/hoodie-flatlay-back-white.png' : '/mockups/hoodie-zip-flatlay-front-white.png')

  // 1:1 Scale & Coordinate Parity: directly project from printBox with 1024/500 ratio
  const resolvedPrintBox = printBox || (isBack
    ? { left: 150, top: 137, w: 200, h: 234 }
    : { left: 261, top: 166, w: 88, h: 88 })

  const targetChest = {
    x: (resolvedPrintBox.left / 500) * 1024,
    y: (resolvedPrintBox.top / 500) * 1024,
    width: (resolvedPrintBox.w / 500) * 1024,
    height: (resolvedPrintBox.h / 500) * 1024,
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} isDark={isDark} />
          {!isBack && (
            <clipPath id={`zip-chest-clip-${id}`}>
              <path d="M 0,0 L 504,0 L 504,1024 L 0,1024 Z M 520,0 L 1024,0 L 1024,1024 L 520,1024 Z" />
            </clipPath>
          )}
          {!directAsset && (
            <filter id={`garment-tint-zip-${id}`} colorInterpolationFilters="sRGB">
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

        {/* Studio Flat-Lay Photographic Blank with Integrated Metal Zipper */}
        <image
          href={assetUrl}
          x="0"
          y="0"
          width="1024"
          height="1024"
          filter={!directAsset ? `url(#garment-tint-zip-${id})` : undefined}
        />

        {/* Projected Artwork */}
        <g
          id="artwork-projection-group"
          clipPath={!isBack ? `url(#zip-chest-clip-${id})` : undefined}
          style={{
            mixBlendMode: 'normal',
            filter: 'contrast(1.02) saturate(1.02)',
          }}
        >
          {renderLayersInSvg(layers, resolvedPrintBox, targetChest, view, colorMode, id, printMethod, isDark)}
        </g>

        {/* Physical Fleece Fold Crease Overlay */}
        {layers.length > 0 && (
          <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }} opacity={0.16}>
            <image href={assetUrl} x="0" y="0" width="1024" height="1024" />
          </g>
        )}
      </svg>
      {children}
    </div>
  )
}

const TOTE_FLATLAY_ASSETS: Record<string, string> = {
  '#C8BC9A': '/mockups/tote-flatlay-natural.png',
  '#FFFFFF': '/mockups/tote-flatlay-white.png',
  '#1A1A12': '/mockups/tote-flatlay-black.png',
  '#1B2A4A': '/mockups/tote-flatlay-navy.png',
  '#C62828': '/mockups/tote-flatlay-crimson.png',
}

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
  const normColor = (color || '#C8BC9A').toUpperCase()
  const isDark = isColorDark(color)

  const directAsset = TOTE_FLATLAY_ASSETS[normColor]
  const assetUrl = directAsset || '/mockups/tote-flatlay-white.png'

  const cleanHex = normColor.replace('#', '')
  const r = (parseInt(cleanHex.substring(0, 2), 16) || 255) / 255
  const g = (parseInt(cleanHex.substring(2, 4), 16) || 255) / 255
  const b = (parseInt(cleanHex.substring(4, 6), 16) || 255) / 255

  // Target coordinates calibrated on 1024x1024 photographic studio tote bag blank
  // Centered on canvas body below top hem: x: 280, y: 410, w: 464, h: 480
  const targetBox = { x: 280, y: 410, width: 464, height: 480 }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[580px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.07)]"
      >
        <defs>
          <PrintTechniqueSvgDefs id={id} isDark={isDark} />
          {!directAsset && (
            <filter id={`garment-tint-tote-${id}`} colorInterpolationFilters="sRGB">
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
                <feFuncR type="linear" slope="1.04" intercept="0.01" />
                <feFuncG type="linear" slope="1.04" intercept="0.01" />
                <feFuncB type="linear" slope="1.04" intercept="0.01" />
              </feComponentTransfer>
            </filter>
          )}
        </defs>

        {/* Studio Canvas Tote Photographic Blank */}
        <image
          href={assetUrl}
          x="0"
          y="0"
          width="1024"
          height="1024"
          filter={!directAsset ? `url(#garment-tint-tote-${id})` : undefined}
        />

        {/* Projected Artwork with Manufacturing Shaders */}
        <g
          id="artwork-projection-group"
          style={{
            mixBlendMode: 'normal',
            filter: 'contrast(1.02) saturate(1.02)',
          }}
        >
          {renderLayersInSvg(layers, printBox, targetBox, view, colorMode, id, printMethod, isDark)}
        </g>

        {/* Physical Heavy Canvas Weave & Seam Fold Overlay */}
        {layers.length > 0 && (
          <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }} opacity={0.20}>
            <image href={assetUrl} x="0" y="0" width="1024" height="1024" />
          </g>
        )}
      </svg>
      {children}
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

/**
 * Resolves the authentic photographic studio blank URL and direct asset status for any product type, view, and color.
 */
export function getPhotorealisticBlank(
  productType: string,
  view: string = 'front',
  color: string = '#FFFFFF'
): { assetUrl: string; directAsset: boolean } {
  const normType = (productType || 'tshirt').toLowerCase()
  const isBack = view === 'back' || view.toLowerCase().includes('back')
  const normColor = (color || '#FFFFFF').toUpperCase()

  let directAsset: string | undefined
  let fallback = '/mockups/tshirt-flatlay-white.png'

  if (normType === 'hoodie' || normType.includes('hoodie')) {
    if (normType.includes('zip')) {
      directAsset = isBack ? HOODIE_FLATLAY_BACK_ASSETS[normColor] : ZIP_HOODIE_FLATLAY_FRONT_ASSETS[normColor]
      fallback = isBack ? '/mockups/hoodie-flatlay-back-white.png' : '/mockups/hoodie-zip-flatlay-front-white.png'
    } else {
      directAsset = isBack ? HOODIE_FLATLAY_BACK_ASSETS[normColor] : HOODIE_FLATLAY_FRONT_ASSETS[normColor]
      fallback = isBack ? '/mockups/hoodie-flatlay-back-white.png' : '/mockups/hoodie-flatlay-front-white.png'
    }
  } else if (normType === 'sweatshirt' || normType.includes('sweatshirt')) {
    directAsset = isBack ? SWEATSHIRT_FLATLAY_BACK_ASSETS[normColor] : SWEATSHIRT_FLATLAY_FRONT_ASSETS[normColor]
    fallback = isBack ? '/mockups/sweatshirt-flatlay-back-white.png' : '/mockups/sweatshirt-flatlay-front-white.png'
  } else if (normType === 'longsleeve' || normType.includes('longsleeve')) {
    directAsset = isBack ? LONGSLEEVE_BACK_ASSETS[normColor] : LONGSLEEVE_FLATLAY_ASSETS[normColor]
    fallback = isBack ? '/mockups/longsleeve-flatlay-back-white.png' : '/mockups/longsleeve-flatlay-white.png'
  } else if (normType === 'tshirt' || normType.includes('tshirt')) {
    directAsset = isBack ? TSHIRT_BACK_ASSETS[normColor] : TSHIRT_FLATLAY_ASSETS[normColor]
    fallback = isBack ? '/mockups/tshirt-flatlay-back-white.png' : '/mockups/tshirt-flatlay-white.png'
  } else if (normType === 'tank' || normType.includes('tank')) {
    directAsset = isBack ? TANK_FLATLAY_BACK_ASSETS[normColor] : TANK_FLATLAY_FRONT_ASSETS[normColor]
    fallback = isBack ? '/mockups/tank-flatlay-back-white.png' : '/mockups/tank-flatlay-white.png'
  } else if (normType === 'polo' || normType.includes('polo')) {
    directAsset = isBack ? POLO_SUBLIMATION_BACK_ASSETS[normColor] : POLO_SUBLIMATION_FRONT_ASSETS[normColor]
    fallback = isBack ? '/mockups/polo-sublimation-back-white.png' : '/mockups/polo-sublimation-front-white.png'
  } else if (normType === 'tote' || normType.includes('tote')) {
    directAsset = '/mockups/tote-flatlay-natural.png'
    fallback = '/mockups/tote-flatlay-natural.png'
  } else if (normType === 'mug' || normType.includes('mug')) {
    directAsset = '/mockups/mug-studio-white.png'
    fallback = '/mockups/mug-studio-white.png'
  } else if (normType === 'hat' || normType.includes('hat') || normType.includes('cap')) {
    directAsset = '/mockups/cap-studio-white.png'
    fallback = '/mockups/cap-studio-white.png'
  } else if (normType === 'poster' || normType.includes('poster')) {
    directAsset = '/mockups/poster-studio-frame.png'
    fallback = '/mockups/poster-studio-frame.png'
  } else if (normType === 'blanket' || normType.includes('blanket')) {
    directAsset = '/mockups/blanket-studio-folded.png'
    fallback = '/mockups/blanket-studio-folded.png'
  } else if (normType === 'pillow' || normType.includes('pillow')) {
    directAsset = '/mockups/pillow-studio-square.png'
    fallback = '/mockups/pillow-studio-square.png'
  }

  return {
    assetUrl: directAsset || fallback,
    directAsset: Boolean(directAsset),
  }
}

/**
 * Photorealistic Studio Blank Canvas for 2D Design Edit Mode.
 * Directly underlays the authentic photographic flat-lay blank behind canvas layers,
 * giving designers 100% realistic garment context (collars, pockets, zippers, seams).
 */
export function PhotorealisticStudioCanvas({
  productType,
  view = 'front',
  color = '#FFFFFF',
  className = '',
}: {
  productType: string
  view?: string
  color?: string
  className?: string
}) {
  const id = useId().replace(/:/g, '')
  const normType = (productType || 'tshirt').toLowerCase()
  const isBack = view === 'back' || view.toLowerCase().includes('back')
  const normColor = (color || '#FFFFFF').toUpperCase()

  const { assetUrl, directAsset } = getPhotorealisticBlank(normType, isBack ? 'back' : 'front', normColor)

  const cleanHex = normColor.replace('#', '')
  const r = (parseInt(cleanHex.substring(0, 2), 16) || 255) / 255
  const g = (parseInt(cleanHex.substring(2, 4), 16) || 255) / 255
  const b = (parseInt(cleanHex.substring(4, 6), 16) || 255) / 255

  const viewBox = normType === 'tshirt'
    ? '0 0 985 1024'
    : normType === 'longsleeve'
      ? '0 0 1024 953'
      : '0 0 1024 1024'

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] pointer-events-none"
      >
        <defs>
          {!directAsset && (
            <filter id={`canvas-dye-${normType}-${id}`} colorInterpolationFilters="sRGB">
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

        {/* Studio Flat-Lay Photographic Blank */}
        <image
          href={assetUrl}
          x="0"
          y="0"
          width={normType === 'tshirt' ? 985 : 1024}
          height={normType === 'longsleeve' ? 953 : 1024}
          filter={!directAsset ? `url(#canvas-dye-${normType}-${id})` : undefined}
        />
      </svg>
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

  // All-Over Print / Cut & Sew Polo Shirt
  if (normType === 'polo' || normId.includes('polo')) {
    return (
      <RealisticPoloFlatLay
        color={color}
        view={isBack ? 'back' : 'front'}
        colorMode={colorMode}
        layers={layers}
        printBox={printBox}
        printMethod={printMethod}
        className={className}
      >
        {children}
      </RealisticPoloFlatLay>
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

