/**
 * PrintFlow Realistic Product Mockups — Senior-Engineer Grade
 * Authentic, photorealistic raw garment & merchandise vectors matching Printify's exact editor standards.
 * Features realistic fabric drapes, ribbed crew-neck collars, 3D ceramic reflections,
 * inner brand neck tapes, kangaroo pockets, twill canvas textures, and multi-angle views.
 */

'use client'

import React, { useId } from 'react'

export interface MockupProps {
  color?: string
  view?: string // 'front' | 'back' | 'sleeve_left' | 'sleeve_right' | 'wrap' | 'handle_right' | 'handle_left'
  className?: string
  showPrintArea?: boolean
  children?: React.ReactNode
  onSelectArea?: (area: string) => void
}

function isColorDark(hex: string): boolean {
  if (!hex || !hex.startsWith('#')) return false
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16) || 0
  const g = parseInt(clean.substring(2, 4), 16) || 0
  const b = parseInt(clean.substring(4, 6), 16) || 0
  return 0.299 * r + 0.587 * g + 0.114 * b < 130
}

/* ═══════════════════════════════════════════════════════════════════════════════
   1. RAW T-SHIRT (Unisex Jersey / Organic Cotton Crew Tee)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function TShirtMockup({
  color = '#FFFFFF',
  view = 'front',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isBack = view === 'back'
  const isSleeve = view === 'sleeve_left' || view === 'sleeve_right'

  // Outer outline color
  const strokeColor = dark ? '#38383E' : '#1A1A12'
  const strokeOpacity = dark ? 0.6 : 0.22
  const seamOpacity = dark ? 0.4 : 0.14
  const innerNeckFill = dark ? '#131316' : '#DDD9D1'
  const neckTapeColor = dark ? '#28282E' : '#BBB7AF'

  if (isSleeve) {
    const isLeft = view === 'sleeve_left'
    return (
      <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <filter id={`sleeve-shadow-${id}`} x="-10%" y="-10%" width="125%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#000" floodOpacity="0.10" />
          </filter>
        </defs>
        {/* Sleeve base profile */}
        <g transform={isLeft ? 'translate(0, 30)' : 'translate(500, 30) scale(-1,1)'}>
          <path
            d="M 160 90 C 210 80, 270 85, 330 110 L 370 280 C 370 295, 360 305, 345 305 L 180 305 C 165 305, 155 295, 155 280 Z"
            fill="#000" opacity="0.08" transform="translate(0, 10)" filter={`url(#sleeve-shadow-${id})`}
          />
          <path
            d="M 160 90 C 210 80, 270 85, 330 110 L 370 280 C 370 295, 360 305, 345 305 L 180 305 C 165 305, 155 295, 155 280 Z"
            fill={color}
          />
          {/* Subtle fold gradient */}
          <path
            d="M 160 90 C 210 80, 270 85, 330 110 L 370 280 C 370 295, 360 305, 345 305 L 180 305 C 165 305, 155 295, 155 280 Z"
            fill="black" opacity={dark ? 0.15 : 0.05}
          />
          {/* Shoulder cap seam */}
          <path d="M 160 90 C 210 80, 270 85, 330 110" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
          {/* Hem cuff double stitch */}
          <path d="M 165 292 L 360 292" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
          <path d="M 165 298 L 360 298" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
          <path d="M 155 305 L 370 305" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
        </g>
        {children}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Soft floor shadow */}
        <filter id={`garment-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#1A1A12" floodOpacity={dark ? 0.22 : 0.09} />
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1A1A12" floodOpacity={dark ? 0.14 : 0.06} />
        </filter>
        {/* Torso light gradient */}
        <linearGradient id={`torso-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.08 : 0.9} />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity={dark ? 0.03 : 0.2} />
          <stop offset="85%" stopColor="#000000" stopOpacity={dark ? 0.25 : 0.06} />
          <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.35 : 0.12} />
        </linearGradient>
        {/* Collar rib texture pattern */}
        <pattern id={`collar-ribs-${id}`} width="3" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={dark ? '#FFFFFF' : '#1A1A12'} strokeWidth="0.6" strokeOpacity={dark ? 0.08 : 0.15} />
        </pattern>
      </defs>

      {/* ── Floor Contact Shadow ── */}
      <path
        d="M 175 60 C 200 56, 300 56, 325 60 L 400 82 C 430 92, 452 114, 470 144 C 480 160, 488 184, 482 202 L 424 216 L 398 178 L 396 496 C 396 512, 384 518, 368 518 L 132 518 C 116 518, 104 512, 104 496 L 102 178 L 76 216 L 18 202 C 12 184, 20 160, 30 144 C 48 114, 70 92, 100 82 Z"
        fill="#000000" opacity={dark ? 0.25 : 0.08} transform="translate(0, 14)" filter={`url(#garment-shadow-${id})`}
      />

      {/* ── Inner Neck Cavity & Brand Label (Front View Only) ── */}
      {!isBack && (
        <g id="inner-neck">
          <path d="M 182 60 C 205 48, 295 48, 318 60 C 304 94, 196 94, 182 60 Z" fill={innerNeckFill} />
          {/* Inner back collar neck tape */}
          <path d="M 194 57 C 220 53, 280 53, 306 57" stroke={neckTapeColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Authentic screen-printed neck label */}
          <text x="250" y="72" textAnchor="middle" fontSize="7" fontWeight="700" fill={dark ? '#6E6E78' : '#88857D'} letterSpacing="0.6" fontFamily="Inter, sans-serif">
            PRINTFLOW ECO
          </text>
          <text x="250" y="79" textAnchor="middle" fontSize="6" fontWeight="500" fill={dark ? '#52525A' : '#A8A59D'} fontFamily="Inter, sans-serif">
            100% ORGANIC COTTON · M
          </text>
        </g>
      )}

      {/* ── Main Shirt Silhouette ── */}
      <g id="shirt-body">
        {/* Base garment fill */}
        <path
          d={
            isBack
              ? 'M 182 60 C 210 54, 290 54, 318 60 L 400 82 C 426 90, 448 110, 468 140 C 478 155, 484 176, 480 196 C 478 204, 470 210, 460 210 L 422 214 C 414 215, 408 210, 406 202 L 396 172 C 392 230, 390 360, 394 496 C 394 506, 386 512, 372 512 C 305 518, 195 518, 128 512 C 114 512, 106 506, 106 496 C 110 360, 108 230, 104 172 L 94 202 C 92 210, 86 215, 78 214 L 40 210 C 30 210, 22 204, 20 196 C 16 176, 22 155, 32 140 C 52 110, 74 90, 100 82 Z'
              : 'M 182 60 C 196 82, 222 96, 250 96 C 278 96, 304 82, 318 60 L 400 82 C 426 90, 448 110, 468 140 C 478 155, 484 176, 480 196 C 478 204, 470 210, 460 210 L 422 214 C 414 215, 408 210, 406 202 L 396 172 C 392 230, 390 360, 394 496 C 394 506, 386 512, 372 512 C 305 518, 195 518, 128 512 C 114 512, 106 506, 106 496 C 110 360, 108 230, 104 172 L 94 202 C 92 210, 86 215, 78 214 L 40 210 C 30 210, 22 204, 20 196 C 16 176, 22 155, 32 140 C 52 110, 74 90, 100 82 Z'
          }
          fill={color}
        />

        {/* Ambient lighting & textile volume overlay */}
        <path
          d={
            isBack
              ? 'M 182 60 C 210 54, 290 54, 318 60 L 400 82 C 426 90, 448 110, 468 140 C 478 155, 484 176, 480 196 C 478 204, 470 210, 460 210 L 422 214 C 414 215, 408 210, 406 202 L 396 172 C 392 230, 390 360, 394 496 C 394 506, 386 512, 372 512 C 305 518, 195 518, 128 512 C 114 512, 106 506, 106 496 C 110 360, 108 230, 104 172 L 94 202 C 92 210, 86 215, 78 214 L 40 210 C 30 210, 22 204, 20 196 C 16 176, 22 155, 32 140 C 52 110, 74 90, 100 82 Z'
              : 'M 182 60 C 196 82, 222 96, 250 96 C 278 96, 304 82, 318 60 L 400 82 C 426 90, 448 110, 468 140 C 478 155, 484 176, 480 196 C 478 204, 470 210, 460 210 L 422 214 C 414 215, 408 210, 406 202 L 396 172 C 392 230, 390 360, 394 496 C 394 506, 386 512, 372 512 C 305 518, 195 518, 128 512 C 114 512, 106 506, 106 496 C 110 360, 108 230, 104 172 L 94 202 C 92 210, 86 215, 78 214 L 40 210 C 30 210, 22 204, 20 196 C 16 176, 22 155, 32 140 C 52 110, 74 90, 100 82 Z'
          }
          fill={`url(#torso-grad-${id})`}
        />

        {/* Natural folds, creases & seams */}
        {/* Armpit depth shadows */}
        <path d="M 104 172 C 112 195, 110 230, 100 260" stroke="#000" strokeOpacity={dark ? 0.35 : 0.09} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 94 202 C 78 180, 60 160, 46 148" stroke="#000" strokeOpacity={dark ? 0.30 : 0.07} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 396 172 C 388 195, 390 230, 400 260" stroke="#000" strokeOpacity={dark ? 0.35 : 0.09} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 406 202 C 422 180, 440 160, 454 148" stroke="#000" strokeOpacity={dark ? 0.30 : 0.07} strokeWidth="1.8" strokeLinecap="round" />

        {/* Torso side drape subtle shadows */}
        <path d="M 135 280 C 150 320, 162 370, 150 420" stroke="#000" strokeOpacity={dark ? 0.18 : 0.04} strokeWidth="8" strokeLinecap="round" />
        <path d="M 365 280 C 350 320, 338 370, 350 420" stroke="#000" strokeOpacity={dark ? 0.18 : 0.04} strokeWidth="8" strokeLinecap="round" />

        {/* Shoulder seam topstitching */}
        <path d="M 182 60 L 100 82" stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 182 61 L 100 83" stroke="#FFFFFF" strokeOpacity={dark ? 0.12 : 0.7} strokeWidth="1" strokeLinecap="round" />
        <path d="M 318 60 L 400 82" stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 318 61 L 400 83" stroke="#FFFFFF" strokeOpacity={dark ? 0.12 : 0.7} strokeWidth="1" strokeLinecap="round" />

        {/* Sleeve cuff double-needle hem */}
        <path d="M 460 204 L 422 208" stroke={strokeColor} strokeOpacity={seamOpacity} strokeWidth="0.8" strokeDasharray="2.5 1.5" />
        <path d="M 40 204 L 78 208" stroke={strokeColor} strokeOpacity={seamOpacity} strokeWidth="0.8" strokeDasharray="2.5 1.5" />

        {/* Bottom hem double-needle stitching */}
        <path d="M 110 496 C 180 503, 320 503, 390 496" stroke={strokeColor} strokeOpacity={seamOpacity} strokeWidth="0.8" strokeDasharray="3 2" />
        <path d="M 110 501 C 180 508, 320 508, 390 501" stroke={strokeColor} strokeOpacity={seamOpacity} strokeWidth="0.8" strokeDasharray="3 2" />

        {/* ── Collar Construction ── */}
        {!isBack ? (
          <>
            {/* Front ribbed collar band */}
            <path
              d="M 182 60 C 196 82, 222 96, 250 96 C 278 96, 304 82, 318 60 C 310 88, 282 106, 250 106 C 218 106, 190 88, 182 60 Z"
              fill={dark ? '#222225' : '#F2EFE8'}
            />
            <path
              d="M 182 60 C 196 82, 222 96, 250 96 C 278 96, 304 82, 318 60 C 310 88, 282 106, 250 106 C 218 106, 190 88, 182 60 Z"
              fill={`url(#collar-ribs-${id})`}
            />
            {/* Inner & outer collar seam boundaries */}
            <path d="M 182 60 C 196 82, 222 96, 250 96 C 278 96, 304 82, 318 60" stroke={strokeColor} strokeOpacity={strokeOpacity * 1.3} strokeWidth="1.2" />
            <path d="M 182 60 C 190 88, 218 106, 250 106 C 282 106, 310 88, 318 60" stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth="1.2" />
            {/* Collar shadow cast onto chest */}
            <path d="M 178 70 C 198 100, 224 112, 250 112 C 276 112, 302 100, 322 70" stroke="#000" strokeOpacity={dark ? 0.35 : 0.08} strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Back collar band */}
            <path d="M 182 60 C 210 54, 290 54, 318 60 C 314 74, 186 74, 182 60 Z" fill={dark ? '#222225' : '#F2EFE8'} />
            <path d="M 182 60 C 210 54, 290 54, 318 60" stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth="1.2" />
            <path d="M 182 60 C 186 74, 314 74, 318 60" stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth="1.2" />
            {/* Back yoke seam */}
            <path d="M 180 88 C 220 92, 280 92, 320 88" stroke={strokeColor} strokeOpacity={seamOpacity} strokeWidth="0.9" strokeDasharray="3 2" />
            {/* Back spine drape fold */}
            <path d="M 250 140 L 250 440" stroke="#000" strokeOpacity={dark ? 0.15 : 0.03} strokeWidth="6" strokeLinecap="round" />
          </>
        )}

        {/* Clean silhouette boundary stroke */}
        <path
          d={
            isBack
              ? 'M 182 60 C 210 54, 290 54, 318 60 L 400 82 C 426 90, 448 110, 468 140 C 478 155, 484 176, 480 196 C 478 204, 470 210, 460 210 L 422 214 C 414 215, 408 210, 406 202 L 396 172 C 392 230, 390 360, 394 496 C 394 506, 386 512, 372 512 C 305 518, 195 518, 128 512 C 114 512, 106 506, 106 496 C 110 360, 108 230, 104 172 L 94 202 C 92 210, 86 215, 78 214 L 40 210 C 30 210, 22 204, 20 196 C 16 176, 22 155, 32 140 C 52 110, 74 90, 100 82 Z'
              : 'M 182 60 C 196 82, 222 96, 250 96 C 278 96, 304 82, 318 60 L 400 82 C 426 90, 448 110, 468 140 C 478 155, 484 176, 480 196 C 478 204, 470 210, 460 210 L 422 214 C 414 215, 408 210, 406 202 L 396 172 C 392 230, 390 360, 394 496 C 394 506, 386 512, 372 512 C 305 518, 195 518, 128 512 C 114 512, 106 506, 106 496 C 110 360, 108 230, 104 172 L 94 202 C 92 210, 86 215, 78 214 L 40 210 C 30 210, 22 204, 20 196 C 16 176, 22 155, 32 140 C 52 110, 74 90, 100 82 Z'
          }
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeOpacity={strokeOpacity}
        />
      </g>

      {/* Optional guide print area */}
      {showPrintArea && (
        <g id="print-area-guide">
          <rect
            x="156"
            y={isBack ? 125 : 145}
            width="188"
            height={isBack ? 260 : 240}
            rx="3"
            stroke="#3B82F6"
            strokeWidth="1.2"
            strokeDasharray="5 4"
            fill="none"
            opacity="0.85"
          />
        </g>
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   1B. RAW SLEEVELESS TANK TOP / MUSCLE TEE (Bella+Canvas 6003)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function TankMockup({
  color = '#FFFFFF',
  view = 'front',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isBack = view === 'back'
  const isPureWhite = color.toUpperCase() === '#FFFFFF'

  const strokeColor = dark ? '#38383E' : '#1A1A12'
  const strokeOpacity = dark ? 0.6 : 0.22
  const innerNeckFill = dark ? '#131316' : '#DDD9D1'

  return (
    <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`tank-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#1A1A12" floodOpacity={dark ? 0.22 : 0.09} />
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1A1A12" floodOpacity={dark ? 0.14 : 0.06} />
        </filter>
        <linearGradient id={`tank-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.08 : 0.9} />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity={dark ? 0.03 : 0.2} />
          <stop offset="85%" stopColor="#000000" stopOpacity={dark ? 0.25 : 0.06} />
          <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.35 : 0.12} />
        </linearGradient>
      </defs>

      {/* Soft floor shadow */}
      <path
        d="M 185 68 C 172 130, 148 200, 138 275 L 140 520 C 140 530, 150 535, 165 535 L 335 535 C 350 535, 360 530, 360 520 L 362 275 C 352 200, 328 130, 315 68 Z"
        fill="#1A1A12"
        opacity={dark ? 0.25 : 0.10}
        transform="translate(0, 14)"
        filter={`url(#tank-shadow-${id})`}
      />

      {/* Inner back neck cavity */}
      {!isBack && (
        <path
          d="M 195 68 C 215 50, 285 50, 305 68 C 285 96, 215 96, 195 68 Z"
          fill={innerNeckFill}
          stroke={strokeColor}
          strokeWidth="0.8"
          strokeOpacity={strokeOpacity}
        />
      )}

      {/* Sleeveless Tank Silhouette (Deep dropped armholes matching Bella+Canvas 6003) */}
      <path
        d={
          isBack
            ? 'M 195 68 C 220 58, 280 58, 305 68 L 330 76 C 345 130, 368 205, 365 275 L 362 516 C 362 524, 350 528, 335 528 L 165 528 C 150 528, 138 524, 138 516 L 135 275 C 132 205, 155 130, 170 76 Z'
            : 'M 195 68 C 215 96, 285 96, 305 68 L 330 76 C 345 130, 368 205, 365 275 L 362 516 C 362 524, 350 528, 335 528 L 165 528 C 150 528, 138 524, 138 516 L 135 275 C 132 205, 155 130, 170 76 Z'
        }
        fill={isPureWhite ? '#FAFAF8' : color}
      />
      <path
        d={
          isBack
            ? 'M 195 68 C 220 58, 280 58, 305 68 L 330 76 C 345 130, 368 205, 365 275 L 362 516 C 362 524, 350 528, 335 528 L 165 528 C 150 528, 138 524, 138 516 L 135 275 C 132 205, 155 130, 170 76 Z'
            : 'M 195 68 C 215 96, 285 96, 305 68 L 330 76 C 345 130, 368 205, 365 275 L 362 516 C 362 524, 350 528, 335 528 L 165 528 C 150 528, 138 524, 138 516 L 135 275 C 132 205, 155 130, 170 76 Z'
        }
        fill={`url(#tank-grad-${id})`}
      />

      {/* Armhole Seam Bindings */}
      <path d="M 170 76 C 155 130, 132 205, 135 275" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} fill="none" />
      <path d="M 172 78 C 157 132, 134 207, 137 275" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={strokeOpacity * 0.7} fill="none" />

      <path d="M 330 76 C 345 130, 368 205, 365 275" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} fill="none" />
      <path d="M 328 78 C 343 132, 366 207, 363 275" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={strokeOpacity * 0.7} fill="none" />

      {/* Ribbed Collar Band */}
      {!isBack ? (
        <path d="M 195 68 C 215 96, 285 96, 305 68" stroke={strokeColor} strokeWidth="2.5" strokeOpacity={strokeOpacity * 1.5} fill="none" />
      ) : (
        <path d="M 195 68 C 220 58, 280 58, 305 68" stroke={strokeColor} strokeWidth="2" strokeOpacity={strokeOpacity * 1.5} fill="none" />
      )}

      {/* Double Hem Stitch at bottom */}
      <path d="M 140 514 L 360 514" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={strokeOpacity} />
      <path d="M 140 519 L 360 519" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={strokeOpacity} />

      {/* Print area guide if enabled */}
      {showPrintArea && (
        <rect
          x="165"
          y="150"
          width="170"
          height="220"
          rx="4"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   2. RAW CERAMIC MUG (11oz / 15oz Glossy Ceramic Mug)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function MugMockup({
  color = '#FFFFFF',
  view = 'front',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isLeftHandle = view === 'handle_left'
  const isWrap = view === 'wrap'

  return (
    <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Cylindrical ceramic shading */}
        <linearGradient id={`mug-body-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={dark ? '#18181A' : '#D9D6D0'} />
          <stop offset="7%" stopColor={dark ? '#242428' : '#EDEDE9'} />
          <stop offset="16%" stopColor={dark ? '#3A3A42' : '#FFFFFF'} />
          <stop offset="30%" stopColor={dark ? '#28282C' : '#FFFFFF'} />
          <stop offset="58%" stopColor={dark ? '#1E1E22' : '#F7F6F3'} />
          <stop offset="86%" stopColor={dark ? '#1A1A1E' : '#EDEDE8'} />
          <stop offset="100%" stopColor={dark ? '#121214' : '#D2CEC7'} />
        </linearGradient>

        {/* Specular glossy highlight streak */}
        <linearGradient id={`mug-specular-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity={dark ? 0.35 : 0.85} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Interior cavity depth gradient */}
        <radialGradient id={`mug-cavity-${id}`} cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor={dark ? '#0A0A0C' : '#605E59'} />
          <stop offset="70%" stopColor={dark ? '#16161A' : '#8C8880'} />
          <stop offset="100%" stopColor={dark ? '#222228' : '#C2BEB6'} />
        </radialGradient>

        {/* Handle gradient */}
        <linearGradient id={`mug-handle-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={dark ? '#2C2C32' : '#EDEDE9'} />
          <stop offset="50%" stopColor={dark ? '#3A3A42' : '#FFFFFF'} />
          <stop offset="100%" stopColor={dark ? '#151518' : '#BFB9B0'} />
        </linearGradient>
      </defs>

      {/* ── Floor Contact & Ambient Shadow ── */}
      <ellipse cx={isWrap ? 250 : 230} cy="455" rx={isWrap ? 180 : 130} ry="16" fill="#1A1A12" opacity={dark ? 0.22 : 0.10} filter="blur(8px)" />
      <ellipse cx={isWrap ? 250 : 230} cy="455" rx={isWrap ? 140 : 95} ry="8" fill="#1A1A12" opacity={dark ? 0.30 : 0.15} filter="blur(3px)" />

      {/* ── Ceramic C-Handle ── */}
      {!isWrap && (
        <g id="mug-handle" transform={isLeftHandle ? 'translate(460, 0) scale(-1, 1)' : undefined}>
          <path
            d="M 330 160 C 420 160, 445 210, 445 280 C 445 350, 415 385, 330 385 L 330 345 C 390 345, 410 320, 410 280 C 410 225, 385 195, 330 195 Z"
            fill={`url(#mug-handle-${id})`}
            stroke={dark ? '#454550' : '#1A1A12'}
            strokeOpacity={dark ? 0.6 : 0.18}
            strokeWidth="1.2"
          />
          {/* Specular ridge catch */}
          <path
            d="M 335 165 C 418 165, 440 212, 440 280 C 440 345, 412 380, 335 380"
            stroke="#FFFFFF"
            strokeOpacity={dark ? 0.4 : 0.8}
            strokeWidth="1.5"
          />
        </g>
      )}

      {/* ── Cylinder Mug Body ── */}
      <g id="mug-cylinder">
        <path
          d={
            isWrap
              ? 'M 90 100 L 90 425 C 90 452, 410 452, 410 425 L 410 100 Z'
              : 'M 130 100 L 130 425 C 130 452, 330 452, 330 425 L 330 100 Z'
          }
          fill={`url(#mug-body-${id})`}
          stroke={dark ? '#454550' : '#1A1A12'}
          strokeOpacity={dark ? 0.6 : 0.22}
          strokeWidth="1.2"
        />

        {/* Vertical specular sheen streak */}
        <rect
          x={isWrap ? 130 : 156}
          y="100"
          width={isWrap ? 45 : 32}
          height="325"
          fill={`url(#mug-specular-${id})`}
        />

        {/* Bottom foot ring highlight */}
        <path
          d={
            isWrap
              ? 'M 92 425 C 100 450, 400 450, 408 425'
              : 'M 132 425 C 140 450, 320 450, 328 425'
          }
          stroke="#FFFFFF"
          strokeOpacity={dark ? 0.25 : 0.9}
          strokeWidth="2"
        />

        {/* ── Ceramic Rim & Inner Cavity ── */}
        <ellipse
          cx={isWrap ? 250 : 230}
          cy="100"
          rx={isWrap ? 160 : 100}
          ry="20"
          fill={`url(#mug-cavity-${id})`}
        />
        {/* Glossy top rim ring */}
        <ellipse
          cx={isWrap ? 250 : 230}
          cy="100"
          rx={isWrap ? 160 : 100}
          ry="20"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeOpacity={dark ? 0.3 : 0.9}
        />
        <ellipse
          cx={isWrap ? 250 : 230}
          cy="100"
          rx={isWrap ? 160 : 100}
          ry="20"
          stroke={dark ? '#454550' : '#1A1A12'}
          strokeWidth="1.2"
          strokeOpacity={dark ? 0.6 : 0.22}
        />
      </g>

      {/* Guide print area */}
      {showPrintArea && (
        <rect
          x={isWrap ? 105 : 145}
          y="145"
          width={isWrap ? 290 : 170}
          height="210"
          rx="4"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}

      {/* Ceramic gloss reflection overlay across printed artwork */}
      <rect
        x={isWrap ? 145 : 175}
        y="135"
        width={isWrap ? 28 : 22}
        height="280"
        rx="10"
        fill="#FFFFFF"
        opacity={dark ? 0.20 : 0.35}
        style={{ pointerEvents: 'none' }}
      />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   3. RAW PULLOVER HOODIE (Unisex Premium Heavyweight Hoodie)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function HoodieMockup({
  color = '#2E2E32',
  view = 'front',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isBack = view === 'back'
  const isSleeve = view === 'sleeve_left' || view === 'sleeve_right'

  const strokeColor = dark ? '#4E5058' : '#1A1A12'
  const strokeOpacity = dark ? 0.65 : 0.28
  const seamOpacity = dark ? 0.40 : 0.16
  const innerHoodFill = dark ? '#131316' : '#D5D1C7'

  if (isSleeve) {
    const isLeft = view === 'sleeve_left'
    return (
      <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g transform={isLeft ? 'translate(0,0)' : 'translate(500,0) scale(-1,1)'}>
          <path
            d="M 160 70 C 210 60, 270 65, 340 90 L 365 440 C 365 455, 355 465, 340 465 L 180 465 C 165 465, 155 455, 155 440 Z"
            fill={color}
          />
          <path
            d="M 160 70 C 210 60, 270 65, 340 90 L 365 440 C 365 455, 355 465, 340 465 L 180 465 C 165 465, 155 455, 155 440 Z"
            fill="black" opacity={dark ? 0.15 : 0.05}
          />
          <rect x="155" y="425" width="210" height="40" fill="#000" opacity={dark ? 0.18 : 0.06} />
          <path d="M 155 425 L 365 425" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
          <path d="M 155 465 L 365 465" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
        </g>
        {children}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Soft ground contact shadow */}
        <filter id={`hoodie-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000" floodOpacity={dark ? 0.28 : 0.09} />
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity={dark ? 0.16 : 0.06} />
        </filter>
        {/* Subtle fleece body lighting gradient */}
        <linearGradient id={`hoodie-body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.09 : 0.85} />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity={dark ? 0.03 : 0.15} />
          <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.28 : 0.12} />
        </linearGradient>
        {/* Ribbing texture for waistband & cuffs */}
        <pattern id={`hoodie-ribs-${id}`} width="4" height="8" patternUnits="userSpaceOnUse">
          <line x1="1" y1="0" x2="1" y2="8" stroke={strokeColor} strokeWidth="0.8" strokeOpacity={dark ? 0.25 : 0.18} />
        </pattern>
      </defs>

      {/* ── Floor Contact Shadow ── */}
      <path
        d="M 176 138 C 155 80, 200 28, 250 26 C 300 28, 345 80, 324 138 L 404 168 C 438 185, 464 250, 464 340 C 464 425, 458 480, 454 506 L 408 516 L 382 470 L 382 528 L 118 528 L 118 470 L 92 516 L 46 506 C 42 480, 36 425, 36 340 C 36 250, 62 185, 96 168 Z"
        fill="#000000" opacity={dark ? 0.22 : 0.08} transform="translate(0, 12)" filter={`url(#hoodie-shadow-${id})`}
      />

      {/* ── Hood (Back Layer in Front View, Full Drape in Back View) ── */}
      {/* Outer Hood Contour Arch */}
      <path
        d="M 176 138 C 154 78, 196 28, 250 26 C 304 28, 346 78, 324 138 Z"
        fill={color}
      />
      <path
        d="M 176 138 C 154 78, 196 28, 250 26 C 304 28, 346 78, 324 138 Z"
        fill={`url(#hoodie-body-${id})`}
      />
      <path
        d="M 176 138 C 154 78, 196 28, 250 26 C 304 28, 346 78, 324 138"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeOpacity={strokeOpacity}
        strokeLinecap="round"
      />

      {/* Inner Hood Cavity & Neckline Trim (Front View Only) */}
      {!isBack ? (
        <g id="inner-hood-opening">
          {/* Inner hood depth opening */}
          <path
            d="M 194 138 C 184 92, 218 64, 250 64 C 282 64, 316 92, 306 138 Z"
            fill={innerHoodFill}
          />
          {/* Inner hood drop shadow */}
          <path
            d="M 194 138 C 184 92, 218 64, 250 64 C 282 64, 316 92, 306 138 Z"
            fill="#000"
            opacity={dark ? 0.45 : 0.20}
          />
          {/* Front crossover neckline collar lapels */}
          <path
            d="M 186 142 C 218 152, 250 152, 276 146"
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeOpacity={strokeOpacity}
            strokeLinecap="round"
          />
          <path
            d="M 314 142 C 282 152, 250 152, 224 146"
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeOpacity={strokeOpacity}
            strokeLinecap="round"
          />
          {/* Subtle hood neck grommets (drawstrings kept neat at neck, chest 100% clean) */}
          <circle cx="228" cy="144" r="2.5" fill={dark ? '#333338' : '#D0CDC5'} stroke={strokeColor} strokeWidth="0.8" strokeOpacity={strokeOpacity} />
          <circle cx="272" cy="144" r="2.5" fill={dark ? '#333338' : '#D0CDC5'} stroke={strokeColor} strokeWidth="0.8" strokeOpacity={strokeOpacity} />
          {/* Short neat drawstring cord tips resting at neck */}
          <path d="M 228 147 Q 227 154, 226 156" stroke="#DCD9D0" strokeWidth="2" strokeLinecap="round" />
          <path d="M 272 147 Q 273 154, 274 156" stroke="#DCD9D0" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : (
        /* Rear hood drape fold in Back View */
        <g id="back-hood-drape">
          <path
            d="M 176 138 C 196 116, 250 114, 324 138"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeOpacity={strokeOpacity}
          />
          <path
            d="M 200 128 C 224 110, 276 110, 300 128"
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeOpacity={strokeOpacity * 0.7}
          />
        </g>
      )}

      {/* ── Main Fleece Body (Torso & Sleeves) ── */}
      <g id="hoodie-fleece-body">
        {/* Base Fleece Silhouette */}
        <path
          d="M 176 138 L 96 168 C 65 185, 42 245, 36 330 C 30 405, 36 460, 42 482 L 88 492 L 118 235 L 118 470 L 382 470 L 382 235 L 412 492 L 458 482 C 464 460, 470 405, 464 330 C 458 245, 435 185, 404 168 L 324 138 Z"
          fill={color}
        />
        {/* Shading overlay */}
        <path
          d="M 176 138 L 96 168 C 65 185, 42 245, 36 330 C 30 405, 36 460, 42 482 L 88 492 L 118 235 L 118 470 L 382 470 L 382 235 L 412 492 L 458 482 C 464 460, 470 405, 464 330 C 458 245, 435 185, 404 168 L 324 138 Z"
          fill={`url(#hoodie-body-${id})`}
        />

        {/* Outer contour stroke */}
        <path
          d="M 176 138 L 96 168 C 65 185, 42 245, 36 330 C 30 405, 36 460, 42 482 L 88 492 L 118 235 L 118 470 L 382 470 L 382 235 L 412 492 L 458 482 C 464 460, 470 405, 464 330 C 458 245, 435 185, 404 168 L 324 138"
          stroke={strokeColor}
          strokeWidth="1.4"
          strokeOpacity={strokeOpacity}
          strokeLinejoin="round"
        />

        {/* Underarm inner sleeve separation seams */}
        <path d="M 118 235 L 88 492" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.75} />
        <path d="M 382 235 L 412 492" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.75} />

        {/* Ergonomic arm crease lines */}
        <g stroke={strokeColor} strokeWidth="1" strokeOpacity={seamOpacity * 1.8} strokeLinecap="round">
          <path d="M 70 250 C 85 270, 102 285, 114 290" />
          <path d="M 52 350 C 68 365, 88 375, 104 378" />
          <path d="M 430 250 C 415 270, 398 285, 386 290" />
          <path d="M 448 350 C 432 365, 412 375, 396 378" />
        </g>
      </g>

      {/* ── Ribbed Waistband Hem ── */}
      <g id="ribbed-waistband">
        <rect x="118" y="470" width="264" height="58" rx="2" fill={color} />
        <rect x="118" y="470" width="264" height="58" rx="2" fill="#000" opacity={dark ? 0.18 : 0.05} />
        <rect x="118" y="470" width="264" height="58" rx="2" fill={`url(#hoodie-ribs-${id})`} />
        {/* Double-needle waistband attachment seam */}
        <path d="M 118 470 L 382 470" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
        <path d="M 118 474 L 382 474" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
        {/* Bottom edge */}
        <path d="M 118 528 L 382 528" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
      </g>

      {/* ── Ribbed Wrist Cuffs ── */}
      <g id="ribbed-wrist-cuffs">
        {/* Left cuff */}
        <g transform="rotate(13, 42, 482)">
          <rect x="38" y="480" width="50" height="26" rx="2" fill={color} />
          <rect x="38" y="480" width="50" height="26" rx="2" fill="#000" opacity={dark ? 0.18 : 0.05} />
          <rect x="38" y="480" width="50" height="26" rx="2" fill={`url(#hoodie-ribs-${id})`} />
          <path d="M 38 480 L 88 480" stroke={strokeColor} strokeWidth="1.3" strokeOpacity={strokeOpacity} />
          <path d="M 38 506 L 88 506" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
        </g>
        {/* Right cuff */}
        <g transform="rotate(-13, 458, 482)">
          <rect x="412" y="480" width="50" height="26" rx="2" fill={color} />
          <rect x="412" y="480" width="50" height="26" rx="2" fill="#000" opacity={dark ? 0.18 : 0.05} />
          <rect x="412" y="480" width="50" height="26" rx="2" fill={`url(#hoodie-ribs-${id})`} />
          <path d="M 412 480 L 462 480" stroke={strokeColor} strokeWidth="1.3" strokeOpacity={strokeOpacity} />
          <path d="M 412 506 L 462 506" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
        </g>
      </g>

      {/* ── Kangaroo Pouch Pocket (Front View Only) ── */}
      {!isBack && (
        <g id="kangaroo-pouch-pocket">
          {/* Base pocket fill */}
          <path
            d="M 182 315 L 318 315 C 326 315, 332 320, 336 326 L 368 388 C 371 394, 370 402, 370 410 L 370 470 L 130 470 L 130 410 C 130 402, 129 394, 132 388 L 164 326 C 168 320, 174 315, 182 315 Z"
            fill={color}
          />
          {/* Pocket shading */}
          <path
            d="M 182 315 L 318 315 C 326 315, 332 320, 336 326 L 368 388 C 371 394, 370 402, 370 410 L 370 470 L 130 470 L 130 410 C 130 402, 129 394, 132 388 L 164 326 C 168 320, 174 315, 182 315 Z"
            fill="#000"
            opacity={dark ? 0.20 : 0.06}
          />
          {/* Top edge double-needle stitch */}
          <path d="M 182 315 L 318 315" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
          <path d="M 182 319 L 318 319" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
          {/* Slanted side hand entry welt seams */}
          <path d="M 182 315 L 132 388" stroke={strokeColor} strokeWidth="1.6" strokeOpacity={strokeOpacity} />
          <path d="M 186 317 L 136 390" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
          <path d="M 318 315 L 368 388" stroke={strokeColor} strokeWidth="1.6" strokeOpacity={strokeOpacity} />
          <path d="M 314 317 L 364 390" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
          {/* Hand opening shadow depth */}
          <path d="M 132 388 L 130 470" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />
          <path d="M 368 388 L 370 470" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />
          {/* Bottom pocket seam */}
          <path d="M 130 470 L 370 470" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
        </g>
      )}

      {/* Print area */}
      {showPrintArea && (
        <rect
          x={isBack ? 150 : 157}
          y={isBack ? 137 : 168}
          width={isBack ? 200 : 186}
          height={isBack ? 234 : 136}
          rx="3"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   4. RAW CANVAS TOTE BAG (Eco Heavy Cotton Canvas Tote)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function ToteMockup({
  color = '#C8BC9A',
  view = 'front',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const strokeColor = dark ? '#454550' : '#1A1A12'
  const strokeOpacity = dark ? 0.6 : 0.22

  return (
    <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`tote-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000" floodOpacity={dark ? 0.25 : 0.10} />
        </filter>
        <linearGradient id={`tote-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.12 : 0.8} />
          <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.25 : 0.12} />
        </linearGradient>
      </defs>

      {/* Floor shadow */}
      <rect x="70" y="215" width="360" height="305" rx="8" fill="#000" opacity={0.08} transform="translate(0, 16)" filter={`url(#tote-shadow-${id})`} />

      {/* ── Twill Webbing Handles (Looping up with natural drape) ── */}
      {/* Back handle (resting behind bag opening) */}
      <path d="M 170 205 C 170 24, 210 18, 250 18 C 290 18, 330 24, 330 205" stroke={color} strokeWidth="18" strokeLinecap="round" />
      <path d="M 170 205 C 170 24, 210 18, 250 18 C 290 18, 330 24, 330 205" stroke="#000" strokeWidth="18" strokeLinecap="round" opacity="0.14" />
      <path d="M 170 205 C 170 24, 210 18, 250 18 C 290 18, 330 24, 330 205" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />

      {/* ── Tote Canvas Body ── */}
      <path
        d="M 86 205 L 75 505 C 75 518, 85 526, 98 526 L 402 526 C 415 526, 425 518, 425 505 L 414 205 Z"
        fill={color}
      />
      <path
        d="M 86 205 L 75 505 C 75 518, 85 526, 98 526 L 402 526 C 415 526, 425 518, 425 505 L 414 205 Z"
        fill={`url(#tote-grad-${id})`}
      />

      {/* Top hem fold & double needle stitch */}
      <rect x="85" y="205" width="330" height="24" rx="1" fill="#000" opacity={dark ? 0.20 : 0.05} />
      <line x1="85" y1="227" x2="415" y2="227" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" strokeOpacity={strokeOpacity} />

      {/* Front handle (anchored on front bag panel) */}
      <path d="M 166 215 C 166 38, 208 30, 250 30 C 292 30, 334 38, 334 215" stroke={color} strokeWidth="18" strokeLinecap="round" />
      <path d="M 166 215 C 166 38, 208 30, 250 30 C 292 30, 334 38, 334 215" stroke="#000" strokeWidth="18" strokeLinecap="round" opacity={dark ? 0.15 : 0.04} />
      <path d="M 166 215 C 166 38, 208 30, 250 30 C 292 30, 334 38, 334 215" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />

      {/* Reinforced Box-X stitches at handle bases */}
      {/* Left box */}
      <rect x="158" y="207" width="16" height="20" fill="none" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
      <line x1="158" y1="207" x2="174" y2="227" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
      <line x1="174" y1="207" x2="158" y2="227" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
      {/* Right box */}
      <rect x="326" y="207" width="16" height="20" fill="none" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
      <line x1="326" y1="207" x2="342" y2="227" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
      <line x1="342" y1="207" x2="326" y2="227" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />

      {/* Bottom corner gusset seams */}
      <path d="M 75 505 L 108 526" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />
      <path d="M 425 505 L 392 526" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />

      {/* Outer outline */}
      <path
        d="M 86 205 L 75 505 C 75 518, 85 526, 98 526 L 402 526 C 415 526, 425 518, 425 505 L 414 205 Z"
        stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity}
      />

      {/* Print area */}
      {showPrintArea && (
        <rect
          x="130"
          y="235"
          width="240"
          height="250"
          rx="4"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   5. RAW DAD HAT / BASEBALL CAP (Classic 6-Panel Cotton Twill Cap)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function HatMockup({
  color = '#C4A882',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const strokeColor = dark ? '#454550' : '#1A1A12'
  const strokeOpacity = dark ? 0.6 : 0.22

  return (
    <svg viewBox="0 0 500 440" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`hat-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity={dark ? 0.28 : 0.12} />
        </filter>
        <linearGradient id={`hat-visor-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.15 : 0.6} />
          <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.35 : 0.18} />
        </linearGradient>
      </defs>

      {/* Floor shadow under brim */}
      <ellipse cx="250" cy="385" rx="190" ry="22" fill="#000" opacity={0.14} filter="blur(8px)" />

      {/* ── Crown Silhouette ── */}
      <path
        d="M 96 295 C 96 160, 150 56, 250 56 C 350 56, 404 160, 404 295 Z"
        fill={color}
      />
      <path
        d="M 96 295 C 96 160, 150 56, 250 56 C 350 56, 404 160, 404 295 Z"
        fill="#000" opacity={dark ? 0.20 : 0.06}
      />

      {/* 6-Panel Seams */}
      <path d="M 250 56 L 250 295" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />
      <path d="M 250 56 C 205 130, 140 210, 116 265" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />
      <path d="M 250 56 C 295 130, 360 210, 384 265" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />

      {/* Embroidered Eyelets */}
      <circle cx="210" cy="175" r="4" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity * 1.5} />
      <circle cx="290" cy="175" r="4" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity * 1.5} />

      {/* ── Curved Visor / Brim ── */}
      <path
        d="M 60 300 C 60 275, 150 262, 250 262 C 350 262, 440 275, 440 300 C 440 330, 350 348, 250 348 C 150 348, 60 330, 60 300 Z"
        fill={color}
      />
      <path
        d="M 60 300 C 60 275, 150 262, 250 262 C 350 262, 440 275, 440 300 C 440 330, 350 348, 250 348 C 150 348, 60 330, 60 300 Z"
        fill={`url(#hat-visor-${id})`}
      />

      {/* 4 Rows of Concentric Visor Topstitching */}
      <path d="M 78 304 C 85 288, 160 276, 250 276 C 340 276, 415 288, 422 304" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={strokeOpacity} fill="none" />
      <path d="M 74 312 C 82 296, 160 284, 250 284 C 340 284, 418 296, 426 312" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={strokeOpacity} fill="none" />
      <path d="M 70 320 C 80 304, 160 292, 250 292 C 340 292, 420 304, 430 320" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={strokeOpacity} fill="none" />
      <path d="M 66 328 C 76 312, 160 300, 250 300 C 340 300, 424 312, 434 328" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={strokeOpacity} fill="none" />

      {/* Top Button (Squatchee) */}
      <circle cx="250" cy="60" r="9" fill={color} stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
      <circle cx="250" cy="60" r="9" fill="#000" opacity={dark ? 0.2 : 0.08} />

      {/* Print area */}
      {showPrintArea && (
        <rect
          x="195"
          y="155"
          width="110"
          height="80"
          rx="4"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6. RAW FRAMED POSTER (Gallery Matted Art Print)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function PosterMockup({
  color = '#FFFFFF',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')

  return (
    <svg viewBox="0 0 440 540" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`poster-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity="0.14" />
        </filter>
        <linearGradient id={`glass-glare-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.04" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Cast shadow */}
      <rect x="40" y="24" width="360" height="490" rx="4" fill="#000" opacity="0.08" transform="translate(0, 12)" filter={`url(#poster-shadow-${id})`} />

      {/* Outer Wooden/Aluminum Gallery Frame */}
      <rect x="40" y="24" width="360" height="490" rx="3" fill="#1A1A12" stroke="#2A2A22" strokeWidth="2" />

      {/* Matting border */}
      <rect x="58" y="42" width="324" height="454" fill="#FAF8F5" stroke="#E2DFD8" strokeWidth="1" />

      {/* Archival Print Paper Area */}
      <rect x="82" y="66" width="276" height="406" fill={color} stroke="#D4D0C8" strokeWidth="0.8" />

      {/* Glass Reflection Glare */}
      <rect x="58" y="42" width="324" height="454" fill={`url(#glass-glare-${id})`} pointerEvents="none" />

      {/* Print area */}
      {showPrintArea && (
        <rect
          x="82"
          y="66"
          width="276"
          height="406"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}
    </svg>
  )
}

export function BlanketMockup({
  color = '#FDFBF7',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')

  return (
    <svg viewBox="0 0 520 580" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`blanket-editor-drop-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity={0.10} />
        </filter>
        <linearGradient id={`blanket-editor-light-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.75} />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.06} />
        </linearGradient>
      </defs>

      <rect x="40" y="30" width="440" height="520" rx="16" fill="#000" opacity="0.08" transform="translate(0, 10)" filter={`url(#blanket-editor-drop-${id})`} />
      <rect x="40" y="30" width="440" height="520" rx="16" fill={color} />
      <rect x="40" y="30" width="440" height="520" rx="16" fill={`url(#blanket-editor-light-${id})`} />
      <rect x="44" y="34" width="432" height="512" rx="14" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="5 3" strokeOpacity="0.2" />

      {showPrintArea && (
        <rect x="50" y="40" width="420" height="500" rx="12" stroke="#3B82F6" strokeWidth="1.2" strokeDasharray="5 4" fill="none" opacity="0.85" />
      )}

      {children}
    </svg>
  )
}

export function PillowMockup({
  color = '#FFFFFF',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')

  return (
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`pillow-editor-drop-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity={0.12} />
        </filter>
        <radialGradient id={`pillow-editor-puff-${id}`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.15} />
        </radialGradient>
      </defs>

      <ellipse cx="250" cy="450" rx="190" ry="24" fill="#000" opacity="0.10" filter={`url(#pillow-editor-drop-${id})`} />
      <path d="M 75 75 Q 250 45 425 75 Q 455 250 425 425 Q 250 455 75 425 Q 45 250 75 75 Z" fill={color} />
      <path d="M 75 75 Q 250 45 425 75 Q 455 250 425 425 Q 250 455 75 425 Q 45 250 75 75 Z" fill={`url(#pillow-editor-puff-${id})`} />
      <path d="M 75 75 Q 250 45 425 75 Q 455 250 425 425 Q 250 455 75 425 Q 45 250 75 75 Z" stroke="#1A1A12" strokeWidth="1.2" strokeOpacity="0.18" fill="none" />

      {showPrintArea && (
        <rect x="110" y="110" width="280" height="280" rx="6" stroke="#3B82F6" strokeWidth="1.2" strokeDasharray="5 4" fill="none" opacity="0.85" />
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   7. RAW PHONE CASE (Slim Tough Matte/Gloss Case)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function PhoneMockup({
  color = '#1C2B0C',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)

  return (
    <svg viewBox="0 0 360 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`phone-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity={0.16} />
        </filter>
        <linearGradient id={`phone-bevel-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="10%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="90%" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <rect x="70" y="24" width="220" height="510" rx="42" fill="#000" opacity="0.10" transform="translate(0, 12)" filter={`url(#phone-shadow-${id})`} />

      {/* Case Body */}
      <rect x="70" y="24" width="220" height="510" rx="42" fill={color} stroke="#1A1A12" strokeWidth="1.5" />
      <rect x="70" y="24" width="220" height="510" rx="42" fill={`url(#phone-bevel-${id})`} />

      {/* Camera Bump Island */}
      <rect x="88" y="44" width="84" height="88" rx="22" fill="#18181A" stroke="#333336" strokeWidth="1.5" />
      <circle cx="114" cy="70" r="14" fill="#0E0E10" stroke="#3E3E44" strokeWidth="2" />
      <circle cx="114" cy="70" r="8" fill="#1E2835" />
      <circle cx="114" cy="106" r="14" fill="#0E0E10" stroke="#3E3E44" strokeWidth="2" />
      <circle cx="114" cy="106" r="8" fill="#1E2835" />
      <circle cx="148" cy="88" r="7" fill="#F4F4E8" stroke="#888" strokeWidth="1" />

      {/* Print area */}
      {showPrintArea && (
        <rect
          x="80"
          y="34"
          width="200"
          height="490"
          rx="36"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   8. RAW CREWNECK SWEATSHIRT ("Hoodie without Head Cover" / Fleece Pullover)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function SweatshirtMockup({
  color = '#2E3238',
  view = 'front',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isBack = view === 'back'
  const isSleeve = view === 'sleeve_left' || view === 'sleeve_right'
  const strokeColor = dark ? '#454852' : '#1A1A12'
  const strokeOpacity = dark ? 0.6 : 0.24
  const seamOpacity = dark ? 0.35 : 0.15
  const innerNeckFill = dark ? '#16171B' : '#D5D1C8'

  if (isSleeve) {
    const isLeft = view === 'sleeve_left'
    return (
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g transform={isLeft ? 'translate(0,0)' : 'translate(500,0) scale(-1,1)'}>
          <path d="M 150 70 C 210 60, 270 65, 340 90 L 370 380 C 370 395, 360 405, 345 405 L 175 405 C 160 405, 150 395, 150 380 Z" fill={color} />
          <path d="M 150 70 C 210 60, 270 65, 340 90 L 370 380 C 370 395, 360 405, 345 405 L 175 405 C 160 405, 150 395, 150 380 Z" fill="#000" opacity={dark ? 0.15 : 0.05} />
          <rect x="150" y="360" width="220" height="45" fill="#000" opacity={dark ? 0.18 : 0.06} />
          <path d="M 150 360 L 370 360" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
        </g>
        {children}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`sweat-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity={dark ? 0.28 : 0.10} />
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity={dark ? 0.16 : 0.06} />
        </filter>
        <linearGradient id={`sweat-body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.10 : 0.85} />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity={dark ? 0.03 : 0.18} />
          <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.30 : 0.14} />
        </linearGradient>
      </defs>

      {/* Floor shadow */}
      <path
        d="M 175 60 L 98 84 L 28 175 L 85 200 L 96 490 L 404 490 L 415 200 L 472 175 L 402 84 L 325 60 Z"
        fill="#000" opacity={dark ? 0.24 : 0.08} transform="translate(0, 14)" filter={`url(#sweat-shadow-${id})`}
      />

      {/* Inner Neck Cavity & Brand Label */}
      {!isBack && (
        <g id="inner-sweat-neck">
          <path d="M 180 62 C 205 48, 295 48, 320 62 C 305 98, 195 98, 180 62 Z" fill={innerNeckFill} />
          <path d="M 194 57 C 220 53, 280 53, 306 57" stroke={dark ? '#2A2C34' : '#BAB6AD'} strokeWidth="4" strokeLinecap="round" />
          <text x="250" y="74" textAnchor="middle" fontSize="7" fontWeight="700" fill={dark ? '#6E7280' : '#88857D'} letterSpacing="0.8" fontFamily="Inter, sans-serif">
            PRINTFLOW FLEECE
          </text>
          <text x="250" y="82" textAnchor="middle" fontSize="6" fontWeight="500" fill={dark ? '#525560' : '#A8A59D'} fontFamily="Inter, sans-serif">
            CREWNECK SWEATSHIRT · L
          </text>
        </g>
      )}

      {/* Main Fleece Torso & Long Sleeves */}
      <path
        d={
          isBack
            ? 'M 180 62 C 210 54, 290 54, 320 62 L 402 84 C 428 92, 452 115, 472 155 C 480 172, 474 195, 458 202 L 408 204 L 404 475 L 404 522 C 404 532, 394 538, 382 538 L 118 538 C 106 538, 96 532, 96 522 L 96 475 L 92 204 L 42 202 C 26 195, 20 172, 28 155 C 48 115, 72 92, 98 84 Z'
            : 'M 180 62 C 196 86, 222 100, 250 100 C 278 100, 304 86, 320 62 L 402 84 C 428 92, 452 115, 472 155 C 480 172, 474 195, 458 202 L 408 204 L 404 475 L 404 522 C 404 532, 394 538, 382 538 L 118 538 C 106 538, 96 532, 96 522 L 96 475 L 92 204 L 42 202 C 26 195, 20 172, 28 155 C 48 115, 72 92, 98 84 Z'
        }
        fill={color}
      />
      <path
        d={
          isBack
            ? 'M 180 62 C 210 54, 290 54, 320 62 L 402 84 C 428 92, 452 115, 472 155 C 480 172, 474 195, 458 202 L 408 204 L 404 475 L 404 522 C 404 532, 394 538, 382 538 L 118 538 C 106 538, 96 532, 96 522 L 96 475 L 92 204 L 42 202 C 26 195, 20 172, 28 155 C 48 115, 72 92, 98 84 Z'
            : 'M 180 62 C 196 86, 222 100, 250 100 C 278 100, 304 86, 320 62 L 402 84 C 428 92, 452 115, 472 155 C 480 172, 474 195, 458 202 L 408 204 L 404 475 L 404 522 C 404 532, 394 538, 382 538 L 118 538 C 106 538, 96 532, 96 522 L 96 475 L 92 204 L 42 202 C 26 195, 20 172, 28 155 C 48 115, 72 92, 98 84 Z'
        }
        fill={`url(#sweat-body-${id})`}
      />

      {/* ── Triangular V-Notch "Dorito" Insert (Front Only) ── */}
      {!isBack && (
        <g id="dorito-v-stitch">
          <path d="M 238 100 L 250 118 L 262 100 Z" fill={color} stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />
          <path d="M 241 100 L 250 114 L 259 100" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 1.5" strokeOpacity={seamOpacity} />
        </g>
      )}

      {/* ── 2×2 Thick Ribbed Crewneck Collar Band ── */}
      <path
        d={
          isBack
            ? 'M 180 62 C 210 52, 290 52, 320 62 C 314 74, 186 74, 180 62 Z'
            : 'M 180 62 C 196 86, 222 100, 250 100 C 278 100, 304 86, 320 62 C 304 74, 278 84, 250 84 C 222 84, 196 74, 180 62 Z'
        }
        fill={color}
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeOpacity={strokeOpacity}
      />

      {/* Raglan / Drop-Shoulder Seams */}
      <path d="M 180 62 L 132 175" stroke={strokeColor} strokeWidth="1" strokeOpacity={seamOpacity} strokeDasharray="3 2" />
      <path d="M 320 62 L 368 175" stroke={strokeColor} strokeWidth="1" strokeOpacity={seamOpacity} strokeDasharray="3 2" />

      {/* ── Ribbed Waistband Hem (Thick 63px) ── */}
      <rect x="96" y="475" width="308" height="63" rx="3" fill="#000" opacity={dark ? 0.16 : 0.05} />
      <path d="M 96 475 L 404 475" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
      <path d="M 96 538 L 404 538" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
      <line x1="96" y1="482" x2="404" y2="482" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity={seamOpacity} />

      {/* ── Ribbed Sleeve Cuffs ── */}
      <path d="M 28 155 L 42 202" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
      <path d="M 472 155 L 458 202" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />

      {/* Outer contour stroke */}
      <path
        d={
          isBack
            ? 'M 180 62 C 210 54, 290 54, 320 62 L 402 84 C 428 92, 452 115, 472 155 C 480 172, 474 195, 458 202 L 408 204 L 404 475 L 404 522 C 404 532, 394 538, 382 538 L 118 538 C 106 538, 96 532, 96 522 L 96 475 L 92 204 L 42 202 C 26 195, 20 172, 28 155 C 48 115, 72 92, 98 84 Z'
            : 'M 180 62 C 196 86, 222 100, 250 100 C 278 100, 304 86, 320 62 L 402 84 C 428 92, 452 115, 472 155 C 480 172, 474 195, 458 202 L 408 204 L 404 475 L 404 522 C 404 532, 394 538, 382 538 L 118 538 C 106 538, 96 532, 96 522 L 96 475 L 92 204 L 42 202 C 26 195, 20 172, 28 155 C 48 115, 72 92, 98 84 Z'
        }
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeOpacity={strokeOpacity}
      />

      {/* Guide print area */}
      {showPrintArea && (
        <rect
          x="156"
          y={isBack ? 125 : 140}
          width="188"
          height={isBack ? 270 : 250}
          rx="3"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   9. RAW BOMBER JACKET (Streetwear Zip-Up Flight Jacket)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function JacketMockup({
  color = '#1E242B',
  view = 'front',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isBack = view === 'back'
  const strokeColor = dark ? '#4A4E58' : '#1A1A12'
  const strokeOpacity = dark ? 0.65 : 0.25
  const ribColor = dark ? '#131518' : '#45433E'

  return (
    <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`jacket-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000" floodOpacity={dark ? 0.32 : 0.12} />
        </filter>
        <linearGradient id={`jacket-nylon-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.18 : 0.9} />
          <stop offset="30%" stopColor="#FFFFFF" stopOpacity={dark ? 0.04 : 0.25} />
          <stop offset="70%" stopColor="#000000" stopOpacity={dark ? 0.15 : 0.05} />
          <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.40 : 0.18} />
        </linearGradient>
      </defs>

      {/* Floor shadow */}
      <path
        d="M 185 70 L 102 96 L 24 185 L 86 210 L 98 480 L 402 480 L 414 210 L 476 185 L 398 96 L 315 70 Z"
        fill="#000" opacity={dark ? 0.28 : 0.10} transform="translate(0, 14)" filter={`url(#jacket-shadow-${id})`}
      />

      {/* Main Jacket Shell Silhouette */}
      <path
        d={
          isBack
            ? 'M 185 70 C 210 60, 290 60, 315 70 L 400 96 C 428 106, 452 135, 474 175 C 482 190, 474 210, 458 214 L 412 210 L 404 465 L 404 515 C 404 525, 394 532, 382 532 L 118 532 C 106 532, 96 525, 96 515 L 96 465 L 88 210 L 42 214 C 26 210, 18 190, 26 175 C 48 135, 72 106, 100 96 Z'
            : 'M 185 70 C 205 92, 225 102, 250 102 C 275 102, 295 92, 315 70 L 400 96 C 428 106, 452 135, 474 175 C 482 190, 474 210, 458 214 L 412 210 L 404 465 L 404 515 C 404 525, 394 532, 382 532 L 118 532 C 106 532, 96 525, 96 515 L 96 465 L 88 210 L 42 214 C 26 210, 18 190, 26 175 C 48 135, 72 106, 100 96 Z'
        }
        fill={color}
      />
      <path
        d={
          isBack
            ? 'M 185 70 C 210 60, 290 60, 315 70 L 400 96 C 428 106, 452 135, 474 175 C 482 190, 474 210, 458 214 L 412 210 L 404 465 L 404 515 C 404 525, 394 532, 382 532 L 118 532 C 106 532, 96 525, 96 515 L 96 465 L 88 210 L 42 214 C 26 210, 18 190, 26 175 C 48 135, 72 106, 100 96 Z'
            : 'M 185 70 C 205 92, 225 102, 250 102 C 275 102, 295 92, 315 70 L 400 96 C 428 106, 452 135, 474 175 C 482 190, 474 210, 458 214 L 412 210 L 404 465 L 404 515 C 404 525, 394 532, 382 532 L 118 532 C 106 532, 96 525, 96 515 L 96 465 L 88 210 L 42 214 C 26 210, 18 190, 26 175 C 48 135, 72 106, 100 96 Z'
        }
        fill={`url(#jacket-nylon-${id})`}
      />

      {/* ── Ribbed Baseball / Bomber Stand Collar ── */}
      <path
        d="M 185 70 C 205 88, 225 96, 250 96 C 275 96, 295 88, 315 70 C 300 56, 200 56, 185 70 Z"
        fill={ribColor}
        stroke={strokeColor}
        strokeWidth="1.2"
      />

      {/* Front Center Heavy-Duty Metal Zipper (Front View Only) */}
      {!isBack && (
        <g id="jacket-zipper">
          <rect x="246" y="96" width="8" height="375" fill="#1A1A1A" stroke="#444" strokeWidth="0.5" />
          <line x1="250" y1="96" x2="250" y2="470" stroke="#C8C8D0" strokeWidth="2.5" strokeDasharray="3 1.5" />
          <rect x="244" y="120" width="12" height="18" rx="2" fill="#E0E0E6" stroke="#555" strokeWidth="1" />
          <path d="M 250 138 L 250 156" stroke="#B0B0B8" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {/* ── Slanted Welt Pockets with Snap Rivets (Front View) ── */}
      {!isBack && (
        <g id="welt-pockets">
          <g transform="rotate(18, 160, 370)">
            <rect x="135" y="360" width="65" height="18" rx="3" fill={color} stroke={strokeColor} strokeWidth="1.2" />
            <circle cx="185" cy="369" r="3.5" fill="#C0C0C8" stroke="#555" strokeWidth="0.8" />
          </g>
          <g transform="rotate(-18, 340, 370)">
            <rect x="300" y="360" width="65" height="18" rx="3" fill={color} stroke={strokeColor} strokeWidth="1.2" />
            <circle cx="315" cy="369" r="3.5" fill="#C0C0C8" stroke="#555" strokeWidth="0.8" />
          </g>
        </g>
      )}

      {/* ── Left Arm MA-1 Utility Zipper Pocket ── */}
      {!isBack && (
        <g id="arm-pocket">
          <rect x="52" y="210" width="30" height="48" rx="3" fill="#1C1E24" stroke={strokeColor} strokeWidth="1" />
          <line x1="67" y1="210" x2="67" y2="258" stroke="#AAA" strokeWidth="1.5" strokeDasharray="2 1" />
          <rect x="64" y="256" width="6" height="32" rx="1" fill="#D32F2F" />
        </g>
      )}

      {/* ── Ribbed Waistband Hem ── */}
      <rect x="96" y="468" width="308" height="64" rx="3" fill={ribColor} stroke={strokeColor} strokeWidth="1.2" />
      <line x1="96" y1="500" x2="404" y2="500" stroke="#FFF" strokeOpacity={dark ? 0.08 : 0.15} strokeWidth="1" />

      {/* ── Ribbed Cuffs ── */}
      <path d="M 26 175 L 42 214" stroke={ribColor} strokeWidth="6" strokeLinecap="round" />
      <path d="M 474 175 L 458 214" stroke={ribColor} strokeWidth="6" strokeLinecap="round" />

      {/* Back Panel Spine Seam */}
      {isBack && (
        <g id="back-jacket-seams">
          <line x1="250" y1="70" x2="250" y2="468" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} strokeDasharray="3 2" />
          <path d="M 160 110 L 140 230" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />
          <path d="M 340 110 L 360 230" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />
        </g>
      )}

      {/* Outer outline */}
      <path
        d={
          isBack
            ? 'M 185 70 C 210 60, 290 60, 315 70 L 400 96 C 428 106, 452 135, 474 175 C 482 190, 474 210, 458 214 L 412 210 L 404 465 L 404 515 C 404 525, 394 532, 382 532 L 118 532 C 106 532, 96 525, 96 515 L 96 465 L 88 210 L 42 214 C 26 210, 18 190, 26 175 C 48 135, 72 106, 100 96 Z'
            : 'M 185 70 C 205 92, 225 102, 250 102 C 275 102, 295 92, 315 70 L 400 96 C 428 106, 452 135, 474 175 C 482 190, 474 210, 458 214 L 412 210 L 404 465 L 404 515 C 404 525, 394 532, 382 532 L 118 532 C 106 532, 96 525, 96 515 L 96 465 L 88 210 L 42 214 C 26 210, 18 190, 26 175 C 48 135, 72 106, 100 96 Z'
        }
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeOpacity={strokeOpacity}
      />

      {/* Guide print area */}
      {showPrintArea && (
        <rect
          x={isBack ? 156 : 272}
          y={isBack ? 130 : 155}
          width={isBack ? 188 : 80}
          height={isBack ? 270 : 80}
          rx="3"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   10. RAW FULL-ZIP HOODIE (Heavyweight Zip-Up Hoodie)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function ZipHoodieMockup({
  color = '#2E4A2E',
  view = 'front',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isBack = view === 'back'
  const isSleeve = view === 'sleeve_left' || view === 'sleeve_right'

  const strokeColor = dark ? '#4E5058' : '#1A1A12'
  const strokeOpacity = dark ? 0.65 : 0.28
  const seamOpacity = dark ? 0.40 : 0.16
  const innerHoodFill = dark ? '#131316' : '#D5D1C7'

  if (isSleeve) {
    const isLeft = view === 'sleeve_left'
    return (
      <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g transform={isLeft ? 'translate(0,0)' : 'translate(500,0) scale(-1,1)'}>
          <path
            d="M 160 70 C 210 60, 270 65, 340 90 L 365 440 C 365 455, 355 465, 340 465 L 180 465 C 165 465, 155 455, 155 440 Z"
            fill={color}
          />
          <path
            d="M 160 70 C 210 60, 270 65, 340 90 L 365 440 C 365 455, 355 465, 340 465 L 180 465 C 165 465, 155 455, 155 440 Z"
            fill="black" opacity={dark ? 0.15 : 0.05}
          />
          <rect x="155" y="425" width="210" height="40" fill="#000" opacity={dark ? 0.18 : 0.06} />
          <path d="M 155 425 L 365 425" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
          <path d="M 155 465 L 365 465" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
        </g>
        {children}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Soft ground contact shadow */}
        <filter id={`ziphoodie-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000" floodOpacity={dark ? 0.28 : 0.09} />
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity={dark ? 0.16 : 0.06} />
        </filter>
        {/* Subtle fleece body lighting gradient */}
        <linearGradient id={`ziphoodie-body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.09 : 0.85} />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity={dark ? 0.03 : 0.15} />
          <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.28 : 0.12} />
        </linearGradient>
        {/* Ribbing texture for waistband & cuffs */}
        <pattern id={`ziphoodie-ribs-${id}`} width="4" height="8" patternUnits="userSpaceOnUse">
          <line x1="1" y1="0" x2="1" y2="8" stroke={strokeColor} strokeWidth="0.8" strokeOpacity={dark ? 0.25 : 0.18} />
        </pattern>
      </defs>

      {/* ── Floor Contact Shadow ── */}
      <path
        d="M 176 138 C 155 80, 200 28, 250 26 C 300 28, 345 80, 324 138 L 404 168 C 438 185, 464 250, 464 340 C 464 425, 458 480, 454 506 L 408 516 L 382 470 L 382 528 L 118 528 L 118 470 L 92 516 L 46 506 C 42 480, 36 425, 36 340 C 36 250, 62 185, 96 168 Z"
        fill="#000000" opacity={dark ? 0.22 : 0.08} transform="translate(0, 12)" filter={`url(#ziphoodie-shadow-${id})`}
      />

      {/* ── Hood Construction ── */}
      {/* Outer Hood Contour Arch */}
      <path
        d="M 176 138 C 154 78, 196 28, 250 26 C 304 28, 346 78, 324 138 Z"
        fill={color}
      />
      <path
        d="M 176 138 C 154 78, 196 28, 250 26 C 304 28, 346 78, 324 138 Z"
        fill={`url(#ziphoodie-body-${id})`}
      />
      <path
        d="M 176 138 C 154 78, 196 28, 250 26 C 304 28, 346 78, 324 138"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeOpacity={strokeOpacity}
        strokeLinecap="round"
      />

      {/* Inner Hood Cavity & Neckline (Front View Only) */}
      {!isBack ? (
        <g id="zip-inner-hood-opening">
          <path
            d="M 194 138 C 184 92, 218 64, 250 64 C 282 64, 316 92, 306 138 Z"
            fill={innerHoodFill}
          />
          <path
            d="M 194 138 C 184 92, 218 64, 250 64 C 282 64, 316 92, 306 138 Z"
            fill="#000"
            opacity={dark ? 0.45 : 0.20}
          />
          {/* Subtle hood neck grommets */}
          <circle cx="228" cy="144" r="2.5" fill={dark ? '#333338' : '#D0CDC5'} stroke={strokeColor} strokeWidth="0.8" strokeOpacity={strokeOpacity} />
          <circle cx="272" cy="144" r="2.5" fill={dark ? '#333338' : '#D0CDC5'} stroke={strokeColor} strokeWidth="0.8" strokeOpacity={strokeOpacity} />
          {/* Short neat drawstring cord tips */}
          <path d="M 228 147 Q 227 154, 226 156" stroke="#DCD9D0" strokeWidth="2" strokeLinecap="round" />
          <path d="M 272 147 Q 273 154, 274 156" stroke="#DCD9D0" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : (
        /* Rear hood drape fold in Back View */
        <g id="back-hood-drape">
          <path
            d="M 176 138 C 196 116, 250 114, 324 138"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeOpacity={strokeOpacity}
          />
          <path
            d="M 200 128 C 224 110, 276 110, 300 128"
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeOpacity={strokeOpacity * 0.7}
          />
        </g>
      )}

      {/* ── Main Fleece Body (Torso & Sleeves) ── */}
      <g id="ziphoodie-fleece-body">
        {/* Base Fleece Silhouette */}
        <path
          d="M 176 138 L 96 168 C 65 185, 42 245, 36 330 C 30 405, 36 460, 42 482 L 88 492 L 118 235 L 118 470 L 382 470 L 382 235 L 412 492 L 458 482 C 464 460, 470 405, 464 330 C 458 245, 435 185, 404 168 L 324 138 Z"
          fill={color}
        />
        {/* Shading overlay */}
        <path
          d="M 176 138 L 96 168 C 65 185, 42 245, 36 330 C 30 405, 36 460, 42 482 L 88 492 L 118 235 L 118 470 L 382 470 L 382 235 L 412 492 L 458 482 C 464 460, 470 405, 464 330 C 458 245, 435 185, 404 168 L 324 138 Z"
          fill={`url(#ziphoodie-body-${id})`}
        />

        {/* Outer contour stroke */}
        <path
          d="M 176 138 L 96 168 C 65 185, 42 245, 36 330 C 30 405, 36 460, 42 482 L 88 492 L 118 235 L 118 470 L 382 470 L 382 235 L 412 492 L 458 482 C 464 460, 470 405, 464 330 C 458 245, 435 185, 404 168 L 324 138"
          stroke={strokeColor}
          strokeWidth="1.4"
          strokeOpacity={strokeOpacity}
          strokeLinejoin="round"
        />

        {/* Underarm inner sleeve separation seams */}
        <path d="M 118 235 L 88 492" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.75} />
        <path d="M 382 235 L 412 492" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.75} />

        {/* Ergonomic arm crease lines */}
        <g stroke={strokeColor} strokeWidth="1" strokeOpacity={seamOpacity * 1.8} strokeLinecap="round">
          <path d="M 70 250 C 85 270, 102 285, 114 290" />
          <path d="M 52 350 C 68 365, 88 375, 104 378" />
          <path d="M 430 250 C 415 270, 398 285, 386 290" />
          <path d="M 448 350 C 432 365, 412 375, 396 378" />
        </g>
      </g>

      {/* ── Ribbed Waistband Hem ── */}
      <g id="zip-ribbed-waistband">
        <rect x="118" y="470" width="264" height="58" rx="2" fill={color} />
        <rect x="118" y="470" width="264" height="58" rx="2" fill="#000" opacity={dark ? 0.18 : 0.05} />
        <rect x="118" y="470" width="264" height="58" rx="2" fill={`url(#ziphoodie-ribs-${id})`} />
        {/* Double-needle waistband attachment seam */}
        <path d="M 118 470 L 382 470" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
        <path d="M 118 474 L 382 474" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
        {/* Bottom edge */}
        <path d="M 118 528 L 382 528" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
      </g>

      {/* ── Ribbed Wrist Cuffs ── */}
      <g id="zip-ribbed-wrist-cuffs">
        {/* Left cuff */}
        <g transform="rotate(13, 42, 482)">
          <rect x="38" y="480" width="50" height="26" rx="2" fill={color} />
          <rect x="38" y="480" width="50" height="26" rx="2" fill="#000" opacity={dark ? 0.18 : 0.05} />
          <rect x="38" y="480" width="50" height="26" rx="2" fill={`url(#ziphoodie-ribs-${id})`} />
          <path d="M 38 480 L 88 480" stroke={strokeColor} strokeWidth="1.3" strokeOpacity={strokeOpacity} />
          <path d="M 38 506 L 88 506" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
        </g>
        {/* Right cuff */}
        <g transform="rotate(-13, 458, 482)">
          <rect x="412" y="480" width="50" height="26" rx="2" fill={color} />
          <rect x="412" y="480" width="50" height="26" rx="2" fill="#000" opacity={dark ? 0.18 : 0.05} />
          <rect x="412" y="480" width="50" height="26" rx="2" fill={`url(#ziphoodie-ribs-${id})`} />
          <path d="M 412 480 L 462 480" stroke={strokeColor} strokeWidth="1.3" strokeOpacity={strokeOpacity} />
          <path d="M 412 506 L 462 506" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
        </g>
      </g>

      {/* ── Split Kangaroo Pockets (Front View Only) ── */}
      {!isBack && (
        <g id="split-kangaroo-pockets">
          {/* Right pouch (wearer's right, screen left) */}
          <path
            d="M 182 315 L 244 315 L 244 470 L 130 470 L 130 410 C 130 402, 129 394, 132 388 L 164 326 C 168 320, 174 315, 182 315 Z"
            fill={color}
          />
          <path
            d="M 182 315 L 244 315 L 244 470 L 130 470 L 130 410 C 130 402, 129 394, 132 388 L 164 326 C 168 320, 174 315, 182 315 Z"
            fill="#000"
            opacity={dark ? 0.20 : 0.06}
          />
          <path d="M 182 315 L 244 315" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
          <path d="M 182 315 L 132 388" stroke={strokeColor} strokeWidth="1.6" strokeOpacity={strokeOpacity} />
          <path d="M 186 317 L 136 390" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
          <path d="M 132 388 L 130 470" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />
          <path d="M 130 470 L 244 470" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />

          {/* Left pouch (wearer's left, screen right) */}
          <path
            d="M 256 315 L 318 315 C 326 315, 332 320, 336 326 L 368 388 C 371 394, 370 402, 370 410 L 370 470 L 256 470 Z"
            fill={color}
          />
          <path
            d="M 256 315 L 318 315 C 326 315, 332 320, 336 326 L 368 388 C 371 394, 370 402, 370 410 L 370 470 L 256 470 Z"
            fill="#000"
            opacity={dark ? 0.20 : 0.06}
          />
          <path d="M 256 315 L 318 315" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
          <path d="M 318 315 L 368 388" stroke={strokeColor} strokeWidth="1.6" strokeOpacity={strokeOpacity} />
          <path d="M 314 317 L 364 390" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
          <path d="M 368 388 L 370 470" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />
          <path d="M 256 470 L 370 470" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
        </g>
      )}

      {/* ── Authentic Full-Length Center Zipper Divider (Front View Only) ── */}
      {!isBack && (
        <g id="authentic-center-zipper">
          {/* Zipper welt tape backing (fabric edge) */}
          <rect x="246" y="140" width="8" height="388" fill={dark ? '#18181C' : '#DDD8CE'} />
          <line x1="246" y1="140" x2="246" y2="528" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />
          <line x1="254" y1="140" x2="254" y2="528" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />
          {/* Parallel topstitching along zipper insertion welt */}
          <line x1="243" y1="142" x2="243" y2="528" stroke={strokeColor} strokeWidth="0.7" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
          <line x1="257" y1="142" x2="257" y2="528" stroke={strokeColor} strokeWidth="0.7" strokeDasharray="3 2" strokeOpacity={seamOpacity} />

          {/* Interlocking Metallic Teeth track */}
          <line x1="250" y1="140" x2="250" y2="528" stroke="#222" strokeWidth="2.5" />
          <line x1="250" y1="140" x2="250" y2="528" stroke="#DCDCE2" strokeWidth="1.8" strokeDasharray="2 1.5" />

          {/* Realistic Metallic Slider & Pull-Tab near collar */}
          <g id="zipper-slider-pull">
            {/* Slider diamond body */}
            <rect x="245" y="152" width="10" height="13" rx="2" fill="#C5C5CC" stroke="#333338" strokeWidth="0.9" />
            <rect x="246.5" y="153.5" width="7" height="10" rx="1" fill="#E8E8EE" />
            {/* Pull tab neck loop */}
            <circle cx="250" cy="165" r="1.8" fill="#555" />
            {/* Pull tab body */}
            <rect x="247" y="166" width="6" height="14" rx="1.5" fill="#B0B0B8" stroke="#333" strokeWidth="0.8" />
            <rect x="248" y="167" width="4" height="12" rx="1" fill="#D5D5DE" />
            {/* Cutout hole in pull-tab */}
            <rect x="248.5" y="174" width="3" height="4" rx="0.8" fill="#555" />
          </g>
        </g>
      )}

      {/* Print area */}
      {showPrintArea && (
        <rect
          x={isBack ? 150 : 261}
          y={isBack ? 137 : 166}
          width={isBack ? 200 : 88}
          height={isBack ? 234 : 88}
          rx="3"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   11. RAW LONG-SLEEVE T-SHIRT (Unisex Ultra Cotton Long Sleeve Tee)
   ═══════════════════════════════════════════════════════════════════════════════ */
export function LongSleeveMockup({
  color = '#FFFFFF',
  view = 'front',
  className = '',
  showPrintArea = false,
  children,
}: MockupProps) {
  const id = useId().replace(/:/g, '')
  const dark = isColorDark(color)
  const isBack = view === 'back'
  const isSleeve = view === 'sleeve_left' || view === 'sleeve_right'

  const strokeColor = dark ? '#38383E' : '#1A1A12'
  const strokeOpacity = dark ? 0.6 : 0.22
  const seamOpacity = dark ? 0.4 : 0.14
  const innerNeckFill = dark ? '#131316' : '#DDD9D1'
  const neckTapeColor = dark ? '#28282E' : '#BBB7AF'

  if (isSleeve) {
    const isLeft = view === 'sleeve_left'
    return (
      <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <filter id={`ls-sleeve-shadow-${id}`} x="-10%" y="-10%" width="125%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#000" floodOpacity="0.10" />
          </filter>
        </defs>
        <g transform={isLeft ? 'translate(0, 20)' : 'translate(500, 20) scale(-1,1)'}>
          <path
            d="M 160 70 C 210 60, 270 65, 340 90 L 365 440 C 365 455, 355 465, 340 465 L 180 465 C 165 465, 155 455, 155 440 Z"
            fill={color}
          />
          <path
            d="M 160 70 C 210 60, 270 65, 340 90 L 365 440 C 365 455, 355 465, 340 465 L 180 465 C 165 465, 155 455, 155 440 Z"
            fill="black" opacity={dark ? 0.15 : 0.05}
          />
          {/* Shoulder cap seam */}
          <path d="M 160 70 C 210 60, 270 65, 340 90" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
          {/* Ribbed wrist cuff */}
          <rect x="155" y="425" width="210" height="40" fill="#000" opacity={dark ? 0.18 : 0.06} />
          <path d="M 155 425 L 365 425" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
          <path d="M 155 429 L 365 429" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
          <path d="M 155 465 L 365 465" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
        </g>
        {children}
      </svg>
    )
  }

  const isHeather =
    color.toUpperCase() === '#C8C5C0' ||
    color.toUpperCase() === '#DEDEDB' ||
    color.toUpperCase() === '#4A4A48' ||
    color.toUpperCase() === '#9A9A8E'

  return (
    <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Knitted cotton grain shader */}
        <filter id={`longsleeve-heather-${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.92 0.52" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.22 0" result="heatherNoise" />
          <feBlend mode="multiply" in="SourceGraphic" in2="heatherNoise" result="blend" />
          <feComposite in="blend" in2="SourceAlpha" operator="in" />
        </filter>

        <filter id={`longsleeve-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#1A1A12" floodOpacity={dark ? 0.24 : 0.08} />
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#1A1A12" floodOpacity={dark ? 0.14 : 0.05} />
        </filter>

        {/* Ribbing texture for wrist cuffs */}
        <pattern id={`longsleeve-ribs-${id}`} width="4" height="8" patternUnits="userSpaceOnUse">
          <line x1="1" y1="0" x2="1" y2="8" stroke={strokeColor} strokeWidth="0.8" strokeOpacity={dark ? 0.25 : 0.18} />
        </pattern>
      </defs>

      {/* Floor Contact Shadow */}
      <path
        d="M 115 105 L 38 480 L 34 508 L 80 508 L 84 480 L 140 484 L 140 512 L 360 512 L 360 484 L 416 480 L 420 508 L 466 508 L 462 480 L 385 105 L 300 56 L 200 56 Z"
        fill="#000000"
        opacity={dark ? 0.20 : 0.06}
        transform="translate(0, 12)"
        filter={`url(#longsleeve-shadow-${id})`}
      />

      {/* Garment Base Body */}
      <g id={`longsleeve-base-${id}`} filter={isHeather ? `url(#longsleeve-heather-${id})` : undefined}>
        {/* Torso Base */}
        <path
          d="M 200 56 C 220 51, 280 51, 300 56 L 385 105 L 356 198 L 360 486 L 140 486 L 144 198 L 115 105 Z"
          fill={color}
        />
        {/* Left Full-Length Sleeve (Sculpted with natural drape to wrist) */}
        <path
          d="M 115 105 C 88 140, 52 210, 36 295 C 26 355, 28 420, 38 480 L 84 480 C 78 420, 94 340, 115 275 C 130 230, 144 198, 144 198 Z"
          fill={color}
        />
        {/* Right Full-Length Sleeve (Sculpted with natural drape to wrist) */}
        <path
          d="M 385 105 C 412 140, 448 210, 464 295 C 474 355, 472 420, 462 480 L 416 480 C 422 420, 406 340, 385 275 C 370 230, 356 198, 356 198 Z"
          fill={color}
        />

        {/* Shading overlay */}
        <path
          d="M 200 56 L 385 105 L 462 480 L 416 480 L 360 486 L 140 486 L 84 480 L 38 480 L 115 105 Z"
          fill="#000"
          opacity={dark ? 0.08 : 0.03}
        />
      </g>

      {/* Inner Neck Crescent (Front View Only) */}
      {!isBack && (
        <g id="inner-ls-neck">
          <path
            d="M 200 56 C 205 90, 295 90, 300 56 C 280 51, 220 51, 200 56 Z"
            fill={innerNeckFill}
            stroke={strokeColor}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* Inner Brand Tape */}
          <path d="M 215 54 C 235 52, 265 52, 285 54" stroke={neckTapeColor} strokeWidth="3" strokeLinecap="round" />
          <text x="250" y="70" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={dark ? '#666' : '#888'} letterSpacing="0.8" fontFamily="Inter, sans-serif">
            PRINTFLOW
          </text>
          <text x="250" y="78" textAnchor="middle" fontSize="5.5" fontWeight="500" fill={dark ? '#555' : '#AAA'} fontFamily="Inter, sans-serif">
            100% COTTON · L
          </text>
        </g>
      )}

      {/* Ergonomic Sleeve Folds */}
      <g stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity * 2.2}>
        {/* Left Sleeve Folds */}
        <path d="M 52 240 C 68 252, 90 262, 108 268" />
        <path d="M 40 330 C 56 340, 78 348, 96 352" />
        <path d="M 36 410 C 50 418, 68 424, 82 426" />
        {/* Right Sleeve Folds */}
        <path d="M 448 240 C 432 252, 410 262, 392 268" />
        <path d="M 460 330 C 444 340, 422 348, 404 352" />
        <path d="M 464 410 C 450 418, 432 424, 418 426" />
      </g>

      {/* Technical Garment Outlines */}
      <g stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={strokeOpacity}>
        {/* Left Sleeve Outer */}
        <path d="M 115 105 C 88 140, 52 210, 36 295 C 26 355, 28 420, 38 480" />
        {/* Left Inner Seam */}
        <path d="M 84 480 C 78 420, 94 340, 115 275 C 130 230, 144 198, 144 198" />
        {/* Left Shoulder Seam */}
        <path d="M 115 105 C 124 135, 128 170, 144 198" strokeWidth="1.3" strokeDasharray="4 2" strokeOpacity={seamOpacity * 2} />
        {/* Left Shoulder Top */}
        <path d="M 200 56 L 115 105" />

        {/* Torso Sides */}
        <path d="M 144 198 L 140 486" />
        <path d="M 356 198 L 360 486" />

        {/* Bottom Waist Hem */}
        <path d="M 140 486 L 360 486" />
        <path d="M 140 512 L 360 512" strokeWidth="1.4" />
        <path d="M 140 490 L 360 490" strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity * 2} />

        {/* Right Shoulder Top */}
        <path d="M 300 56 L 385 105" />
        {/* Right Shoulder Seam */}
        <path d="M 385 105 C 376 135, 372 170, 356 198" strokeWidth="1.3" strokeDasharray="4 2" strokeOpacity={seamOpacity * 2} />
        {/* Right Inner Seam */}
        <path d="M 416 480 C 422 420, 406 340, 385 275 C 370 230, 356 198, 356 198" />
        {/* Right Sleeve Outer */}
        <path d="M 385 105 C 412 140, 448 210, 464 295 C 474 355, 472 420, 462 480" />
      </g>

      {/* ── Ribbed Wrist Cuffs ── */}
      {/* Left Cuff */}
      <g id="longsleeve-left-cuff">
        <rect x="34" y="480" width="50" height="28" rx="2" fill={color} />
        <rect x="34" y="480" width="50" height="28" rx="2" fill="#000" opacity={dark ? 0.16 : 0.04} />
        <rect x="34" y="480" width="50" height="28" rx="2" fill={`url(#longsleeve-ribs-${id})`} />
        <path d="M 34 480 L 84 480" stroke={strokeColor} strokeWidth="1.3" strokeOpacity={strokeOpacity} />
        <path d="M 34 484 L 84 484" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
        <path d="M 34 508 L 84 508" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
      </g>

      {/* Right Cuff */}
      <g id="longsleeve-right-cuff">
        <rect x="416" y="480" width="50" height="28" rx="2" fill={color} />
        <rect x="416" y="480" width="50" height="28" rx="2" fill="#000" opacity={dark ? 0.16 : 0.04} />
        <rect x="416" y="480" width="50" height="28" rx="2" fill={`url(#longsleeve-ribs-${id})`} />
        <path d="M 416 480 L 466 480" stroke={strokeColor} strokeWidth="1.3" strokeOpacity={strokeOpacity} />
        <path d="M 416 484 L 466 484" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
        <path d="M 416 508 L 466 508" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
      </g>

      {/* ── Crewneck Ribbed Collar ── */}
      {!isBack ? (
        <g id="longsleeve-crew-collar">
          <path d="M 200 56 C 202 88, 298 88, 300 56" stroke={strokeColor} strokeWidth="2.2" strokeOpacity={strokeOpacity} fill={dark ? '#222225' : '#D8D5CF'} />
          <path d="M 196 56 C 198 94, 302 94, 304 56" stroke={strokeColor} strokeWidth="1.6" strokeOpacity={strokeOpacity} />
          <path d="M 198 60 C 200 90, 300 90, 302 60" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity={seamOpacity} />
        </g>
      ) : (
        <g id="longsleeve-back-collar">
          <path d="M 200 56 C 215 68, 285 68, 300 56" stroke={strokeColor} strokeWidth="2.2" strokeOpacity={strokeOpacity} fill={dark ? '#222225' : '#D8D5CF'} />
        </g>
      )}

      {/* Print area guide */}
      {showPrintArea && (
        <rect
          x="156"
          y={isBack ? 125 : 145}
          width="188"
          height={isBack ? 260 : 240}
          rx="3"
          stroke="#3B82F6"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          fill="none"
          opacity="0.85"
        />
      )}

      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   15. ALL-OVER PRINT CUT & SEW POLO SHIRT (7-Panel Multi-Cut Layout)
   Exact match to Printify's AOP Cut & Sew Pattern Editor
   ═══════════════════════════════════════════════════════════════════════════════ */
export function PoloPatternMockup({
  color = '#FFFFFF',
  view = 'all',
  className = '',
  showPrintArea = true,
  children,
  onSelectArea,
}: MockupProps) {
  const normView = (view || 'all').toLowerCase()
  const isAll = normView.includes('all')
  const isFront = normView.includes('front') && !isAll
  const isBack = normView.includes('back') && !isAll
  const isRightSleeve = normView.includes('right') || normView.includes('sleeve_right')
  const isLeftSleeve = (normView.includes('left') || normView.includes('sleeve_left')) && !isRightSleeve
  const isUnderCollar = normView.includes('under')
  const isCollar = normView.includes('collar') && !isUnderCollar
  const isPlacket = normView.includes('placket')

  // Theme styling matching Printify Image 2
  const seamFill = '#BDC1C3'
  const seamStroke = '#707478'
  const pieceFill = color || '#FFFFFF'
  const dashedStroke = '#4E5154'
  const labelColor = '#1A1A12'

  if (isAll) {
    return (
      <svg
        viewBox="0 0 1000 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none ${className}`}
      >
        <defs>
          <filter id="aop-panel-shadow" x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.05" />
          </filter>
        </defs>

        {/* ── 1. COLLAR (Top-Left Arched Band) ── */}
        <g
          id="panel-collar"
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() => onSelectArea?.('Collar')}
        >
          <path
            d="M 40 108 C 85 88, 185 88, 230 108 L 225 132 C 180 115, 90 115, 45 132 Z"
            fill={seamFill}
            stroke={seamStroke}
            strokeWidth="1.2"
          />
          <path
            d="M 48 110 C 88 94, 182 94, 222 110 L 218 128 C 178 117, 92 117, 52 128 Z"
            fill={pieceFill}
            stroke={dashedStroke}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text x="135" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
            COLLAR
          </text>
        </g>

        {/* ── 2. UNDER COLLAR (Middle-Left Arched Band) ── */}
        <g
          id="panel-undercollar"
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() => onSelectArea?.('Undercollar')}
        >
          <path
            d="M 40 208 C 85 188, 185 188, 230 208 L 225 232 C 180 215, 90 215, 45 232 Z"
            fill={seamFill}
            stroke={seamStroke}
            strokeWidth="1.2"
          />
          <path
            d="M 48 210 C 88 194, 182 194, 222 210 L 218 228 C 178 217, 92 217, 52 228 Z"
            fill={pieceFill}
            stroke={dashedStroke}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text x="135" y="252" textAnchor="middle" fontSize="11" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
            UNDER COLLAR
          </text>
        </g>

        {/* ── 3. PLACKET (Bottom-Left Vertical Strip with Buttons) ── */}
        <g
          id="panel-placket"
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() => onSelectArea?.('Placket')}
        >
          <rect x="110" y="295" width="50" height="70" rx="1.5" fill={seamFill} stroke={seamStroke} strokeWidth="1.2" />
          <rect x="115" y="300" width="18" height="60" rx="1" fill={pieceFill} stroke={dashedStroke} strokeWidth="1.2" strokeDasharray="3 2" />
          <rect x="137" y="300" width="18" height="60" rx="1" fill={pieceFill} stroke={dashedStroke} strokeWidth="1.2" strokeDasharray="3 2" />
          <circle cx="124" cy="312" r="2.5" fill="none" stroke="#787C80" strokeWidth="1" />
          <circle cx="124" cy="330" r="2.5" fill="none" stroke="#787C80" strokeWidth="1" />
          <circle cx="124" cy="348" r="2.5" fill="none" stroke="#787C80" strokeWidth="1" />
          <text x="135" y="382" textAnchor="middle" fontSize="11" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
            PLACKET
          </text>
        </g>

        {/* ── 4. FRONT (Center-Left Torso with Placket Notch) ── */}
        <g
          id="panel-front"
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() => onSelectArea?.('Front side')}
        >
          <path
            d="M 290 110 L 335 95 C 342 110, 362 122, 368 122 L 368 185 L 378 185 L 378 122 C 384 122, 404 110, 411 95 L 456 110 C 445 135, 442 165, 452 185 L 485 185 L 485 365 L 260 365 L 260 185 L 293 185 C 303 165, 301 135, 290 110 Z"
            fill={seamFill}
            stroke={seamStroke}
            strokeWidth="1.4"
          />
          <path
            d="M 298 116 L 333 103 C 344 118, 360 126, 365 126 L 365 180 L 381 180 L 381 126 C 386 126, 402 118, 413 103 L 448 116 C 438 138, 436 166, 444 180 L 468 180 L 468 355 L 277 355 L 277 180 L 301 180 C 309 166, 307 138, 298 116 Z"
            fill={pieceFill}
            stroke={dashedStroke}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text x="372" y="392" textAnchor="middle" fontSize="12" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
            FRONT
          </text>
        </g>

        {/* ── 5. BACK (Center-Right Torso with High Neck Arch) ── */}
        <g
          id="panel-back"
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() => onSelectArea?.('Back side')}
        >
          <path
            d="M 550 110 L 595 95 C 612 102, 658 102, 675 95 L 720 110 C 709 135, 706 165, 716 185 L 750 185 L 750 365 L 520 365 L 520 185 L 554 185 C 564 165, 561 135, 550 110 Z"
            fill={seamFill}
            stroke={seamStroke}
            strokeWidth="1.4"
          />
          <path
            d="M 558 116 L 593 103 C 612 108, 658 108, 677 103 L 712 116 C 702 138, 700 166, 708 180 L 733 180 L 733 355 L 537 355 L 537 180 L 562 180 C 570 166, 568 138, 558 116 Z"
            fill={pieceFill}
            stroke={dashedStroke}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text x="635" y="392" textAnchor="middle" fontSize="12" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
            BACK
          </text>
        </g>

        {/* ── 6. RIGHT SLEEVE (Top-Right Curved Bell) ── */}
        <g
          id="panel-right-sleeve"
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() => onSelectArea?.('Right sleeve')}
        >
          <path
            d="M 785 150 C 795 125, 835 90, 875 90 C 915 90, 955 125, 965 150 L 955 178 L 795 178 Z"
            fill={seamFill}
            stroke={seamStroke}
            strokeWidth="1.3"
          />
          <path
            d="M 798 147 C 808 128, 838 98, 875 98 C 912 98, 942 128, 952 147 L 945 170 L 805 170 Z"
            fill={pieceFill}
            stroke={dashedStroke}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text x="875" y="198" textAnchor="middle" fontSize="11" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
            RIGHT SLEEVE
          </text>
        </g>

        {/* ── 7. LEFT SLEEVE (Bottom-Right Curved Bell) ── */}
        <g
          id="panel-left-sleeve"
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() => onSelectArea?.('Left sleeve')}
        >
          <path
            d="M 785 330 C 795 305, 835 270, 875 270 C 915 270, 955 305, 965 330 L 955 358 L 795 358 Z"
            fill={seamFill}
            stroke={seamStroke}
            strokeWidth="1.3"
          />
          <path
            d="M 798 327 C 808 308, 838 278, 875 278 C 912 278, 942 308, 952 327 L 945 350 L 805 350 Z"
            fill={pieceFill}
            stroke={dashedStroke}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text x="875" y="378" textAnchor="middle" fontSize="11" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
            LEFT SLEEVE
          </text>
        </g>

        {children}
      </svg>
    )
  }

  // Single-Panel Focused Views
  if (isFront || isBack) {
    return (
      <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path
          d={
            isFront
              ? 'M 140 70 L 195 50 C 205 70, 235 88, 245 88 L 245 160 L 255 160 L 255 88 C 265 88, 295 70, 305 50 L 360 70 C 345 105, 340 145, 355 170 L 395 170 L 395 490 L 105 490 L 105 170 L 145 170 C 160 145, 155 105, 140 70 Z'
              : 'M 140 70 L 195 50 C 215 62, 285 62, 305 50 L 360 70 C 345 105, 340 145, 355 170 L 395 170 L 395 490 L 105 490 L 105 170 L 145 170 C 160 145, 155 105, 140 70 Z'
          }
          fill={seamFill}
          stroke={seamStroke}
          strokeWidth="1.5"
        />
        <path
          d={
            isFront
              ? 'M 152 78 L 192 62 C 208 82, 232 94, 240 94 L 240 152 L 260 152 L 260 94 C 268 94, 292 82, 308 62 L 348 78 C 336 108, 332 144, 342 165 L 372 165 L 372 475 L 128 475 L 128 165 L 158 165 C 168 144, 164 108, 152 78 Z'
              : 'M 152 78 L 192 62 C 215 72, 285 72, 308 62 L 348 78 C 336 108, 332 144, 342 165 L 372 165 L 372 475 L 128 475 L 128 165 L 158 165 C 168 144, 164 108, 152 78 Z'
          }
          fill={pieceFill}
          stroke={dashedStroke}
          strokeWidth="1.4"
          strokeDasharray="4 3"
        />
        <text x="250" y="525" textAnchor="middle" fontSize="13" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
          {isFront ? 'FRONT PANEL' : 'BACK PANEL'}
        </text>
        {children}
      </svg>
    )
  }

  if (isRightSleeve || isLeftSleeve) {
    const isRight = isRightSleeve
    return (
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path
          d="M 60 220 C 85 160, 180 80, 250 80 C 320 80, 415 160, 440 220 L 415 320 L 85 320 Z"
          fill={seamFill}
          stroke={seamStroke}
          strokeWidth="1.5"
        />
        <path
          d="M 85 215 C 105 168, 185 96, 250 96 C 315 96, 395 168, 415 215 L 395 300 L 105 300 Z"
          fill={pieceFill}
          stroke={dashedStroke}
          strokeWidth="1.4"
          strokeDasharray="4 3"
        />
        <text x="250" y="360" textAnchor="middle" fontSize="13" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
          {isRight ? 'RIGHT SLEEVE PANEL' : 'LEFT SLEEVE PANEL'}
        </text>
        {children}
      </svg>
    )
  }

  if (isCollar || isUnderCollar) {
    return (
      <svg viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path
          d="M 40 140 C 130 95, 370 95, 460 140 L 445 200 C 360 160, 140 160, 55 200 Z"
          fill={seamFill}
          stroke={seamStroke}
          strokeWidth="1.5"
        />
        <path
          d="M 60 145 C 140 106, 360 106, 440 145 L 430 190 C 352 160, 148 160, 70 190 Z"
          fill={pieceFill}
          stroke={dashedStroke}
          strokeWidth="1.4"
          strokeDasharray="4 3"
        />
        <text x="250" y="240" textAnchor="middle" fontSize="13" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
          {isCollar ? 'COLLAR PANEL' : 'UNDER COLLAR PANEL'}
        </text>
        {children}
      </svg>
    )
  }

  // Placket
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="130" y="80" width="140" height="300" rx="3" fill={seamFill} stroke={seamStroke} strokeWidth="1.5" />
      <rect x="145" y="95" width="50" height="270" rx="2" fill={pieceFill} stroke={dashedStroke} strokeWidth="1.4" strokeDasharray="4 3" />
      <rect x="205" y="95" width="50" height="270" rx="2" fill={pieceFill} stroke={dashedStroke} strokeWidth="1.4" strokeDasharray="4 3" />
      <circle cx="170" cy="140" r="7" fill="none" stroke="#787C80" strokeWidth="1.5" />
      <circle cx="170" cy="220" r="7" fill="none" stroke="#787C80" strokeWidth="1.5" />
      <circle cx="170" cy="300" r="7" fill="none" stroke="#787C80" strokeWidth="1.5" />
      <text x="200" y="420" textAnchor="middle" fontSize="13" fontWeight="bold" fill={labelColor} letterSpacing="0.5">
        PLACKET PANEL
      </text>
      {children}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   EXPORT MAP & UNIFIED PRODUCT MOCKUP WITH ARTWORK
   ═══════════════════════════════════════════════════════════════════════════════ */
export const MOCKUP_MAP: Record<string, React.FC<MockupProps>> = {
  tshirt: TShirtMockup,
  longsleeve: LongSleeveMockup,
  'tshirt-longsleeve': LongSleeveMockup,
  polo: PoloPatternMockup,
  'polo-sublimation': PoloPatternMockup,
  tank: TankMockup,
  'tank-muscle': TankMockup,
  sweatshirt: SweatshirtMockup,
  hoodie: HoodieMockup,
  'hoodie-zip': ZipHoodieMockup,
  jacket: JacketMockup,
  'jacket-letterman': JacketMockup,
  mug: MugMockup,
  tote: ToteMockup,
  hat: HatMockup,
  cap: HatMockup,
  'cap-snapback': HatMockup,
  poster: PosterMockup,
  blanket: BlanketMockup,
  pillow: PillowMockup,
  phone: PhoneMockup,
}

// Built-in calibrated artwork boxes for standard product views
const ARTWORK_VIEW_BOXES: Record<string, Record<string, { x: number; y: number; w: number; h: number }>> = {
  tshirt: {
    front: { x: 165, y: 165, w: 170, h: 200 },
    'center chest': { x: 165, y: 165, w: 170, h: 200 },
    'left chest': { x: 275, y: 155, w: 72, h: 72 },
    'right chest': { x: 153, y: 155, w: 72, h: 72 },
    back: { x: 165, y: 145, w: 170, h: 220 },
    'back collar': { x: 215, y: 95, w: 70, h: 70 },
    'sleeve left': { x: 190, y: 135, w: 120, h: 130 },
    'sleeve right': { x: 190, y: 135, w: 120, h: 130 },
  },
  longsleeve: {
    front: { x: 165, y: 165, w: 170, h: 200 },
    'center chest': { x: 165, y: 165, w: 170, h: 200 },
    'left chest': { x: 275, y: 155, w: 72, h: 72 },
    'right chest': { x: 153, y: 155, w: 72, h: 72 },
    back: { x: 165, y: 145, w: 170, h: 220 },
    'back collar': { x: 215, y: 95, w: 70, h: 70 },
    'sleeve left': { x: 190, y: 135, w: 120, h: 130 },
    'sleeve right': { x: 190, y: 135, w: 120, h: 130 },
  },
  'tshirt-longsleeve': {
    front: { x: 165, y: 165, w: 170, h: 200 },
    'center chest': { x: 165, y: 165, w: 170, h: 200 },
    'left chest': { x: 275, y: 155, w: 72, h: 72 },
    'right chest': { x: 153, y: 155, w: 72, h: 72 },
    back: { x: 165, y: 145, w: 170, h: 220 },
    'back collar': { x: 215, y: 95, w: 70, h: 70 },
    'sleeve left': { x: 190, y: 135, w: 120, h: 130 },
    'sleeve right': { x: 190, y: 135, w: 120, h: 130 },
  },
  polo: {
    'all areas (view only)': { x: 20, y: 20, w: 960, h: 480 },
    'all': { x: 20, y: 20, w: 960, h: 480 },
    'front side': { x: 140, y: 70, w: 220, h: 380 },
    'front': { x: 140, y: 70, w: 220, h: 380 },
    'back side': { x: 140, y: 70, w: 220, h: 380 },
    'back': { x: 140, y: 70, w: 220, h: 380 },
    'right sleeve': { x: 100, y: 100, w: 300, h: 220 },
    'left sleeve': { x: 100, y: 100, w: 300, h: 220 },
    collar: { x: 70, y: 100, w: 360, h: 100 },
    undercollar: { x: 70, y: 100, w: 360, h: 100 },
    placket: { x: 140, y: 90, w: 120, h: 280 },
  },
  tank: {
    front: { x: 160, y: 145, w: 180, h: 240 },
    'center chest': { x: 160, y: 145, w: 180, h: 240 },
    'left chest': { x: 260, y: 152, w: 70, h: 70 },
    'right chest': { x: 170, y: 152, w: 70, h: 70 },
    back: { x: 160, y: 130, w: 180, h: 260 },
  },
  'tank-muscle': {
    front: { x: 160, y: 145, w: 180, h: 240 },
    'center chest': { x: 160, y: 145, w: 180, h: 240 },
    'left chest': { x: 260, y: 152, w: 70, h: 70 },
    'right chest': { x: 170, y: 152, w: 70, h: 70 },
    back: { x: 160, y: 130, w: 180, h: 260 },
  },
  sweatshirt: {
    front: { x: 165, y: 160, w: 170, h: 210 },
    'center chest': { x: 165, y: 160, w: 170, h: 210 },
    'left chest': { x: 275, y: 155, w: 72, h: 72 },
    'right chest': { x: 153, y: 155, w: 72, h: 72 },
    back: { x: 165, y: 140, w: 170, h: 230 },
    'back collar': { x: 215, y: 95, w: 70, h: 70 },
    'sleeve left': { x: 190, y: 135, w: 120, h: 130 },
    'sleeve right': { x: 190, y: 135, w: 120, h: 130 },
  },
  hoodie: {
    front: { x: 175, y: 190, w: 150, h: 150 },
    'center chest': { x: 175, y: 190, w: 150, h: 150 },
    'left chest': { x: 275, y: 160, w: 70, h: 70 },
    'right chest': { x: 155, y: 160, w: 70, h: 70 },
    back: { x: 170, y: 160, w: 160, h: 190 },
    'back collar': { x: 215, y: 100, w: 70, h: 70 },
  },
  'hoodie-zip': {
    front: { x: 272, y: 160, w: 75, h: 75 },
    'left chest': { x: 272, y: 160, w: 75, h: 75 },
    'right chest': { x: 153, y: 160, w: 75, h: 75 },
    back: { x: 170, y: 160, w: 160, h: 200 },
  },
  jacket: {
    front: { x: 272, y: 155, w: 80, h: 80 },
    'left chest': { x: 272, y: 155, w: 80, h: 80 },
    'right chest': { x: 148, y: 155, w: 80, h: 80 },
    back: { x: 165, y: 150, w: 170, h: 220 },
  },
  mug: {
    front: { x: 160, y: 170, w: 140, h: 160 },
    wrap: { x: 135, y: 170, w: 230, h: 160 },
    'handle left': { x: 155, y: 170, w: 130, h: 160 },
    'handle right': { x: 175, y: 170, w: 130, h: 160 },
  },
  tote: {
    front: { x: 165, y: 235, w: 170, h: 170 },
    back: { x: 165, y: 235, w: 170, h: 170 },
  },
  hat: {
    front: { x: 205, y: 265, w: 90, h: 45 },
  },
  poster: {
    front: { x: 115, y: 85, w: 270, h: 390 },
  },
  blanket: {
    front: { x: 50, y: 40, w: 420, h: 500 },
  },
  pillow: {
    front: { x: 110, y: 110, w: 280, h: 280 },
    back: { x: 110, y: 110, w: 280, h: 280 },
  },
  phone: {
    front: { x: 90, y: 150, w: 180, h: 340 },
  },
}

export interface ProductMockupWithArtProps {
  type: 'tshirt' | 'longsleeve' | 'tshirt-longsleeve' | 'polo' | 'polo-sublimation' | 'tank' | 'tank-muscle' | 'sweatshirt' | 'hoodie' | 'hoodie-zip' | 'jacket' | 'mug' | 'tote' | 'hat' | 'poster' | 'blanket' | 'pillow' | 'phone'
  color?: string
  view?: string
  artworkUrl?: string
  artworkSvg?: string
  className?: string
  showPrintArea?: boolean
  alt?: string
}

export function ProductMockupWithArt({
  type = 'tshirt',
  color = '#FFFFFF',
  view = 'front',
  artworkUrl,
  artworkSvg,
  className = '',
  showPrintArea = false,
}: ProductMockupWithArtProps) {
  const MockupComponent = MOCKUP_MAP[type] || TShirtMockup
  const normView = (view || 'front').toLowerCase()
  const box = ARTWORK_VIEW_BOXES[type]?.[normView] || ARTWORK_VIEW_BOXES[type]?.['front'] || { x: 165, y: 165, w: 170, h: 200 }
  const isDark = isColorDark(color)

  const url = artworkUrl || (artworkSvg ? `data:image/svg+xml;utf8,${encodeURIComponent(artworkSvg)}` : undefined)

  return (
    <MockupComponent color={color} view={normView} className={className} showPrintArea={showPrintArea}>
      {url && (
        <g id="product-artwork-overlay">
          <image
            href={url}
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
            preserveAspectRatio="xMidYMid meet"
            style={{
              mixBlendMode: !isDark && type !== 'mug' && type !== 'poster' ? 'multiply' : 'normal',
              filter: isDark ? 'contrast(1.05) brightness(1.02)' : 'none',
            }}
          />
        </g>
      )}
    </MockupComponent>
  )
}

