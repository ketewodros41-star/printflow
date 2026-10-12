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
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <filter id={`sleeve-shadow-${id}`} x="-10%" y="-10%" width="125%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#000" floodOpacity="0.10" />
          </filter>
        </defs>
        {/* Sleeve base profile */}
        <g transform={isLeft ? 'translate(0,0)' : 'translate(500,0) scale(-1,1)'}>
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
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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
      <ellipse cx="230" cy="430" rx="140" ry="16" fill="#1A1A12" opacity={dark ? 0.22 : 0.10} filter="blur(8px)" />
      <ellipse cx="230" cy="430" rx="100" ry="8" fill="#1A1A12" opacity={dark ? 0.30 : 0.15} filter="blur(3px)" />

      {/* ── Ceramic C-Handle ── */}
      {!isWrap && (
        <g id="mug-handle" transform={isLeftHandle ? 'translate(460, 0) scale(-1, 1)' : undefined}>
          <path
            d="M 330 150 C 420 150, 445 200, 445 270 C 445 340, 415 375, 330 375 L 330 335 C 390 335, 410 310, 410 270 C 410 215, 385 185, 330 185 Z"
            fill={`url(#mug-handle-${id})`}
            stroke={dark ? '#454550' : '#1A1A12'}
            strokeOpacity={dark ? 0.6 : 0.18}
            strokeWidth="1.2"
          />
          {/* Specular ridge catch */}
          <path
            d="M 335 155 C 418 155, 440 202, 440 270 C 440 335, 412 370, 335 370"
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
              ? 'M 80 100 L 80 395 C 80 425, 420 425, 420 395 L 420 100 Z'
              : 'M 120 100 L 120 395 C 120 422, 340 422, 340 395 L 340 100 Z'
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
          height="300"
          fill={`url(#mug-specular-${id})`}
        />

        {/* Bottom foot ring highlight */}
        <path
          d={
            isWrap
              ? 'M 82 395 C 90 423, 410 423, 418 395'
              : 'M 122 395 C 130 420, 330 420, 338 395'
          }
          stroke="#FFFFFF"
          strokeOpacity={dark ? 0.25 : 0.9}
          strokeWidth="2"
        />

        {/* ── Ceramic Rim & Inner Cavity ── */}
        <ellipse
          cx={isWrap ? 250 : 230}
          cy="100"
          rx={isWrap ? 170 : 110}
          ry="24"
          fill={`url(#mug-cavity-${id})`}
        />
        {/* Glossy top rim ring */}
        <ellipse
          cx={isWrap ? 250 : 230}
          cy="100"
          rx={isWrap ? 170 : 110}
          ry="24"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeOpacity={dark ? 0.3 : 0.9}
        />
        <ellipse
          cx={isWrap ? 250 : 230}
          cy="100"
          rx={isWrap ? 170 : 110}
          ry="24"
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
        y="125"
        width={isWrap ? 28 : 22}
        height="265"
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
  const strokeColor = dark ? '#4A4A52' : '#1A1A12'
  const strokeOpacity = dark ? 0.6 : 0.25
  const seamOpacity = dark ? 0.35 : 0.15

  return (
    <svg viewBox="0 0 500 580" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`hoodie-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000" floodOpacity={dark ? 0.28 : 0.10} />
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity={dark ? 0.18 : 0.07} />
        </filter>
        <linearGradient id={`hoodie-body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.10 : 0.85} />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity={dark ? 0.03 : 0.15} />
          <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.30 : 0.14} />
        </linearGradient>
      </defs>

      {/* Floor shadow */}
      <path
        d="M 160 40 L 90 90 C 60 130, 40 210, 32 290 C 24 370, 30 435, 36 492 L 84 506 L 98 215 L 105 540 L 395 540 L 402 215 L 416 506 L 464 492 C 470 435, 476 370, 468 290 C 460 210, 440 130, 410 90 L 340 40 Z"
        fill="#000" opacity={dark ? 0.24 : 0.08} transform="translate(0, 14)" filter={`url(#hoodie-shadow-${id})`}
      />

      {/* ── Main Fleece Body (Full-Length Sleeves) ── */}
      <path
        d="M 165 48 L 94 92 C 65 130, 44 210, 36 290 C 28 370, 34 435, 40 490 L 86 502 L 98 215 L 98 480 L 98 524 C 98 534, 108 540, 120 540 L 380 540 C 392 540, 402 534, 402 524 L 402 480 L 402 215 L 414 502 L 460 490 C 466 435, 472 370, 464 290 C 456 210, 435 130, 406 92 L 335 48 Z"
        fill={color}
      />
      <path
        d="M 165 48 L 94 92 C 65 130, 44 210, 36 290 C 28 370, 34 435, 40 490 L 86 502 L 98 215 L 98 480 L 98 524 C 98 534, 108 540, 120 540 L 380 540 C 392 540, 402 534, 402 524 L 402 480 L 402 215 L 414 502 L 460 490 C 466 435, 472 370, 464 290 C 456 210, 435 130, 406 92 L 335 48 Z"
        fill={`url(#hoodie-body-${id})`}
      />

      {/* Inner Sleeve Seam Separation */}
      <path d="M 98 215 L 86 502" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />
      <path d="M 402 215 L 414 502" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />

      {/* ── Ribbed Waistband Hem ── */}
      <rect x="98" y="480" width="304" height="60" rx="3" fill="#000" opacity={dark ? 0.15 : 0.05} />
      <path d="M 98 480 L 402 480" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
      <path d="M 98 540 L 402 540" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />

      {/* Full-Sleeve Ribbed Wrist Cuffs */}
      <g id="ribbed-wrist-cuffs">
        {/* Left cuff */}
        <rect x="38" y="488" width="48" height="24" rx="2" fill="#000" opacity={dark ? 0.18 : 0.06} transform="rotate(14, 40, 490)" />
        <path d="M 40 490 L 86 502" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
        <path d="M 42 502 L 88 514" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.8} />

        {/* Right cuff */}
        <rect x="414" y="488" width="48" height="24" rx="2" fill="#000" opacity={dark ? 0.18 : 0.06} transform="rotate(-14, 460, 490)" />
        <path d="M 460 490 L 414 502" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
        <path d="M 458 502 L 412 514" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.8} />
      </g>

      {/* Kangaroo Pouch Pocket (Front View Only) */}
      {!isBack && (
        <g id="kangaroo-pocket">
          <path
            d="M 140 330 L 175 330 C 180 330, 185 334, 188 340 L 205 385 L 295 385 L 312 340 C 315 334, 320 330, 325 330 L 360 330 C 365 330, 370 335, 368 340 L 350 480 L 150 480 L 132 340 C 130 335, 135 330, 140 330 Z"
            fill={color}
          />
          <path
            d="M 140 330 L 175 330 C 180 330, 185 334, 188 340 L 205 385 L 295 385 L 312 340 C 315 334, 320 330, 325 330 L 360 330 C 365 330, 370 335, 368 340 L 350 480 L 150 480 L 132 340 C 130 335, 135 330, 140 330 Z"
            fill="#000" opacity={dark ? 0.20 : 0.06}
          />
          {/* Pocket edge topstitching */}
          <path
            d="M 140 330 L 175 330 L 205 385 L 295 385 L 325 330 L 360 330"
            stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity}
          />
          <path d="M 150 480 L 350 480" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
        </g>
      )}

      {/* ── 3D Volumetric Hood Construction ── */}
      <g id="hood-layer">
        {/* Generous hood arch rising gracefully behind neck */}
        <path
          d="M 175 56 C 185 10, 220 -8, 270 -8 C 320 -8, 355 10, 365 56 C 335 105, 205 105, 175 56 Z"
          fill={color}
          stroke={strokeColor}
          strokeWidth="1.4"
          strokeOpacity={strokeOpacity}
        />
        {/* Inner hood opening & cavity depth shadow */}
        {!isBack && (
          <g id="inner-hood">
            <path
              d="M 200 62 C 220 86, 320 86, 340 62 C 325 106, 215 106, 200 62 Z"
              fill="#000"
              opacity={dark ? 0.45 : 0.22}
            />
            {/* Front neck crossover lapels */}
            <path
              d="M 195 66 C 235 96, 305 96, 345 66"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeOpacity={strokeOpacity}
            />
          </g>
        )}
      </g>

      {/* ── Braided Drawstrings with Metal Aglets (Front View Only) ── */}
      {!isBack && (
        <g id="drawstrings">
          {/* Left string */}
          <path d="M 238 88 Q 232 145, 226 215" stroke="#E2E0D8" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 238 88 Q 232 145, 226 215" stroke="#999" strokeWidth="1" strokeDasharray="2 1" />
          <rect x="223" y="215" width="6.5" height="14" rx="1.5" fill="#DCDCE2" stroke="#444" strokeWidth="0.6" />

          {/* Right string */}
          <path d="M 302 88 Q 308 145, 314 215" stroke="#E2E0D8" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 302 88 Q 308 145, 314 215" stroke="#999" strokeWidth="1" strokeDasharray="2 1" />
          <rect x="311" y="215" width="6.5" height="14" rx="1.5" fill="#DCDCE2" stroke="#444" strokeWidth="0.6" />
        </g>
      )}

      {/* Outer contour stroke */}
      <path
        d="M 165 48 L 94 92 C 60 115, 34 150, 24 186 C 18 206, 32 216, 48 214 L 92 206 L 98 480 L 98 524 C 98 534, 108 540, 120 540 L 380 540 C 392 540, 402 534, 402 524 L 402 480 L 408 206 L 452 214 C 468 216, 482 206, 476 186 C 466 150, 440 115, 406 92 L 335 48 Z"
        stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity}
      />

      {/* Print area */}
      {showPrintArea && (
        <rect
          x="156"
          y={isBack ? 130 : 130}
          width="188"
          height={isBack ? 280 : 180}
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
    <svg viewBox="0 0 500 580" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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
      <rect x="75" y="165" width="350" height="380" rx="6" fill="#000" opacity={0.08} transform="translate(0, 14)" filter={`url(#tote-shadow-${id})`} />

      {/* ── Twill Webbing Handles (Looping up) ── */}
      {/* Back handle */}
      <path d="M 170 170 C 170 30, 210 20, 250 20 C 290 20, 330 30, 330 170" stroke={color} strokeWidth="18" strokeLinecap="round" />
      <path d="M 170 170 C 170 30, 210 20, 250 20 C 290 20, 330 30, 330 170" stroke="#000" strokeWidth="18" strokeLinecap="round" opacity="0.12" />
      <path d="M 170 170 C 170 30, 210 20, 250 20 C 290 20, 330 30, 330 170" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />

      {/* ── Tote Body ── */}
      <path
        d="M 80 170 L 65 520 C 65 535, 75 545, 90 545 L 410 545 C 425 545, 435 535, 435 520 L 420 170 Z"
        fill={color}
      />
      <path
        d="M 80 170 L 65 520 C 65 535, 75 545, 90 545 L 410 545 C 425 545, 435 535, 435 520 L 420 170 Z"
        fill={`url(#tote-grad-${id})`}
      />

      {/* Top hem fold & double needle stitch */}
      <rect x="79" y="170" width="342" height="26" fill="#000" opacity={dark ? 0.20 : 0.05} />
      <line x1="79" y1="196" x2="421" y2="196" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" strokeOpacity={strokeOpacity} />

      {/* Front handle */}
      <path d="M 165 195 C 165 55, 205 45, 250 45 C 295 45, 335 55, 335 195" stroke={color} strokeWidth="18" strokeLinecap="round" />
      <path d="M 165 195 C 165 55, 205 45, 250 45 C 295 45, 335 55, 335 195" stroke="#000" strokeWidth="18" strokeLinecap="round" opacity={dark ? 0.15 : 0.04} />
      <path d="M 165 195 C 165 55, 205 45, 250 45 C 295 45, 335 55, 335 195" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />

      {/* Reinforced Box-X stitches at handle bases */}
      {/* Left box */}
      <rect x="157" y="174" width="16" height="20" fill="none" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
      <line x1="157" y1="174" x2="173" y2="194" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
      <line x1="173" y1="174" x2="157" y2="194" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
      {/* Right box */}
      <rect x="327" y="174" width="16" height="20" fill="none" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
      <line x1="327" y1="174" x2="343" y2="194" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />
      <line x1="343" y1="174" x2="327" y2="194" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity * 1.5} />

      {/* Bottom corner gusset seams */}
      <path d="M 65 520 L 100 545" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />
      <path d="M 435 520 L 400 545" stroke={strokeColor} strokeWidth="1" strokeOpacity={strokeOpacity} />

      {/* Outer outline */}
      <path
        d="M 80 170 L 65 520 C 65 535, 75 545, 90 545 L 410 545 C 425 545, 435 535, 435 520 L 420 170 Z"
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
  const strokeColor = dark ? '#4A4A52' : '#1A1A12'
  const strokeOpacity = dark ? 0.6 : 0.25

  return (
    <svg viewBox="0 0 500 580" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id={`ziphoodie-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000" floodOpacity={dark ? 0.28 : 0.10} />
        </filter>
        <linearGradient id={`ziphoodie-body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={dark ? 0.10 : 0.85} />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity={dark ? 0.03 : 0.15} />
          <stop offset="100%" stopColor="#000000" stopOpacity={dark ? 0.30 : 0.14} />
        </linearGradient>
      </defs>

      {/* Floor shadow */}
      <path
        d="M 160 40 L 90 90 C 60 130, 40 210, 32 290 C 24 370, 30 435, 36 492 L 84 506 L 98 215 L 105 540 L 395 540 L 402 215 L 416 506 L 464 492 C 470 435, 476 370, 468 290 C 460 210, 440 130, 410 90 L 340 40 Z"
        fill="#000" opacity={dark ? 0.24 : 0.08} transform="translate(0, 14)" filter={`url(#ziphoodie-shadow-${id})`}
      />

      {/* Main Fleece Body (Full-Length Sleeves) */}
      <path
        d="M 165 48 L 94 92 C 65 130, 44 210, 36 290 C 28 370, 34 435, 40 490 L 86 502 L 98 215 L 98 480 L 98 524 C 98 534, 108 540, 120 540 L 380 540 C 392 540, 402 534, 402 524 L 402 480 L 402 215 L 414 502 L 460 490 C 466 435, 472 370, 464 290 C 456 210, 435 130, 406 92 L 335 48 Z"
        fill={color}
      />
      <path
        d="M 165 48 L 94 92 C 65 130, 44 210, 36 290 C 28 370, 34 435, 40 490 L 86 502 L 98 215 L 98 480 L 98 524 C 98 534, 108 540, 120 540 L 380 540 C 392 540, 402 534, 402 524 L 402 480 L 402 215 L 414 502 L 460 490 C 466 435, 472 370, 464 290 C 456 210, 435 130, 406 92 L 335 48 Z"
        fill={`url(#ziphoodie-body-${id})`}
      />

      {/* Inner Sleeve Seam Separation */}
      <path d="M 98 215 L 86 502" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />
      <path d="M 402 215 L 414 502" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity * 0.7} />

      {/* Ribbed Wrist Cuffs */}
      <path d="M 40 490 L 86 502" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />
      <path d="M 460 490 L 414 502" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={strokeOpacity} />

      {/* Full-Length Front Metallic Zipper Track (Front View Only) */}
      {!isBack && (
        <g id="center-zip-track">
          <line x1="250" y1="88" x2="250" y2="540" stroke="#1A1A1A" strokeWidth="6" />
          <line x1="250" y1="88" x2="250" y2="540" stroke="#C8C8CE" strokeWidth="2.5" strokeDasharray="3 1" />
          <rect x="246" y="110" width="8" height="14" rx="1.5" fill="#E2E2E8" stroke="#555" strokeWidth="0.8" />
        </g>
      )}

      {/* Split Kangaroo Pockets */}
      {!isBack && (
        <g id="split-kangaroo-pockets">
          <path d="M 140 345 L 175 345 C 180 345, 184 348, 186 352 L 202 390 L 246 390 L 246 480 L 150 480 L 132 355 C 130 350, 135 345, 140 345 Z" fill={color} stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
          <path d="M 360 345 L 325 345 C 320 345, 316 348, 314 352 L 298 390 L 254 390 L 254 480 L 350 480 L 368 355 C 370 350, 365 345, 360 345 Z" fill={color} stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
        </g>
      )}

      {/* ── 3D Hood Construction ── */}
      <g id="hood-structure">
        <path d="M 165 48 C 175 18, 205 0, 250 0 C 295 0, 325 18, 335 48 C 300 90, 200 90, 165 48 Z" fill={color} stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
        {!isBack && <ellipse cx="250" cy="58" rx="55" ry="32" fill="#000" opacity={dark ? 0.45 : 0.20} />}
      </g>

      {/* Braided Drawstrings */}
      {!isBack && (
        <g id="zip-drawstrings">
          <path d="M 220 76 Q 215 130, 210 190" stroke="#EEE" strokeWidth="3" strokeLinecap="round" />
          <rect x="207" y="190" width="6" height="12" rx="1.5" fill="#888" stroke="#333" strokeWidth="0.5" />
          <path d="M 280 76 Q 285 130, 290 190" stroke="#EEE" strokeWidth="3" strokeLinecap="round" />
          <rect x="287" y="190" width="6" height="12" rx="1.5" fill="#888" stroke="#333" strokeWidth="0.5" />
        </g>
      )}

      {/* Ribbed Waistband & Cuffs */}
      <rect x="98" y="480" width="304" height="60" rx="3" fill="#000" opacity={dark ? 0.15 : 0.05} />
      <path d="M 98 480 L 402 480" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
      <path d="M 98 540 L 402 540" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />

      {/* Print area */}
      {showPrintArea && (
        <rect
          x={isBack ? 156 : 272}
          y={isBack ? 130 : 155}
          width={isBack ? 188 : 80}
          height={isBack ? 280 : 80}
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
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g transform={isLeft ? 'translate(0,0)' : 'translate(500,0) scale(-1,1)'}>
          <path
            d="M 160 70 C 210 60, 270 65, 340 90 L 365 410 C 365 425, 355 435, 340 435 L 180 435 C 165 435, 155 425, 155 410 Z"
            fill={color}
          />
          <path
            d="M 160 70 C 210 60, 270 65, 340 90 L 365 410 C 365 425, 355 435, 340 435 L 180 435 C 165 435, 155 425, 155 410 Z"
            fill="black" opacity={dark ? 0.15 : 0.05}
          />
          <rect x="155" y="395" width="210" height="40" fill="#000" opacity={dark ? 0.18 : 0.06} />
          <path d="M 155 395 L 365 395" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={strokeOpacity} />
          <path d="M 155 435 L 365 435" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={strokeOpacity} />
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
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Heather Knitted Cotton Grain Shader (Matching Image 2 Sport Grey) */}
        <filter id={`longsleeve-heather-${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.92 0.52" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.22 0" result="heatherNoise" />
          <feBlend mode="multiply" in="SourceGraphic" in2="heatherNoise" result="blend" />
          <feComposite in="blend" in2="SourceAlpha" operator="in" />
        </filter>

        <filter id={`longsleeve-shadow-${id}`} x="-15%" y="-10%" width="130%" height="135%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#1A1A12" floodOpacity={dark ? 0.24 : 0.08} />
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#1A1A12" floodOpacity={dark ? 0.14 : 0.05} />
        </filter>
      </defs>

      {/* Floor Contact Shadow */}
      <path
        d="M 118 80 L 38 173 C 20 198, 9 232, 8 256 C 7 285, 12 315, 23 332 L 28 356 L 62 356 L 68 332 C 78 305, 90 259, 106 232 L 117 415 L 361 415 L 372 232 C 388 259, 400 305, 410 332 L 416 356 L 450 356 L 455 332 C 466 315, 471 285, 470 256 C 469 232, 458 198, 440 173 L 360 80 L 276 46 L 203 46 Z"
        fill="#000000"
        opacity={dark ? 0.20 : 0.05}
        transform="translate(0, 10)"
        filter={`url(#longsleeve-shadow-${id})`}
      />

      {/* Garment Base Body (Matching Image 1 & Image 2) */}
      <g id={`longsleeve-base-${id}`} filter={isHeather ? `url(#longsleeve-heather-${id})` : undefined}>
        {/* Torso Base */}
        <path
          d="M 203 46 C 222 41, 256 41, 276 46 L 360 80 L 361 212 L 361 415 L 117 415 L 117 212 L 118 80 Z"
          fill={color}
        />
        {/* Left Sleeve (Ergonomic outward branch with elbow curve) */}
        <path
          d="M 118 80 C 95 105, 59 149, 38 173 C 20 198, 9 232, 8 256 C 7 285, 12 315, 23 332 L 28 356 L 62 356 L 68 332 C 78 305, 90 259, 106 232 C 115 220, 117 212, 117 212 Z"
          fill={color}
        />
        {/* Right Sleeve (Ergonomic outward branch with elbow curve) */}
        <path
          d="M 360 80 C 383 105, 419 149, 440 173 C 458 198, 469 232, 470 256 C 471 285, 466 315, 455 332 L 450 356 L 416 356 L 410 332 C 400 305, 388 259, 372 232 C 363 220, 361 212, 361 212 Z"
          fill={color}
        />
      </g>

      {/* Inner Neck Crescent (Back Neck Cavity) */}
      {!isBack && (
        <path
          d="M 203 46 C 212 68, 266 68, 276 46 C 259 41, 220 41, 203 46 Z"
          fill={innerNeckFill}
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      )}

      {/* Technical Apparel Crease & Fold Lines (Exact Match to Image 1) */}
      <g stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity * 2.8}>
        {/* Left Sleeve Arm Folds */}
        <path d="M 55 176 C 71 188, 94 204, 106 212" />
        <path d="M 21 247 C 37 253, 63 260, 78 254" />
        <path d="M 22 276 C 39 286, 61 287, 76 279" />
        <path d="M 117 212 C 121 222, 126 234, 128 244" strokeWidth="1.2" opacity={seamOpacity * 2.5} />

        {/* Right Sleeve Arm Folds */}
        <path d="M 424 176 C 408 188, 385 204, 372 212" />
        <path d="M 458 247 C 442 253, 415 260, 401 254" />
        <path d="M 457 276 C 440 286, 418 287, 403 279" />
        <path d="M 361 212 C 357 222, 352 234, 350 244" strokeWidth="1.2" opacity={seamOpacity * 2.5} />
      </g>

      {/* Technical Silhouette Outlines (Stroke #1A1A12, 2.0px - 2.5px) */}
      <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Left Sleeve Outer Line */}
        <path d="M 118 80 C 95 105, 59 149, 38 173 C 20 198, 9 232, 8 256 C 7 285, 12 315, 23 332" />
        {/* Left Wrist Ribbed Cuff */}
        <path d="M 23 332 L 28 356 L 62 356 L 68 332" />
        <path d="M 23 332 L 68 332" strokeWidth="1.8" />
        {/* Left Sleeve Inner Line */}
        <path d="M 68 332 C 78 305, 90 259, 106 232 C 115 220, 117 212, 117 212" />

        {/* Left Shoulder Seam */}
        <path d="M 118 80 C 124 117, 126 166, 117 212" strokeWidth="1.8" />
        {/* Left Shoulder Line */}
        <path d="M 203 46 L 118 80" />

        {/* Left Torso Side */}
        <path d="M 117 212 L 117 415" />

        {/* Bottom Waist Hem Line & Double-Needle Stitch */}
        <path d="M 117 415 L 361 415" />
        <path d="M 117 409 L 361 409" strokeWidth="1" strokeDasharray="4 3" strokeOpacity={seamOpacity * 2.5} />

        {/* Right Torso Side */}
        <path d="M 361 212 L 361 415" />

        {/* Right Shoulder Seam */}
        <path d="M 360 80 C 354 117, 352 166, 361 212" strokeWidth="1.8" />
        {/* Right Shoulder Line */}
        <path d="M 276 46 L 360 80" />

        {/* Right Sleeve Outer Line */}
        <path d="M 360 80 C 383 105, 419 149, 440 173 C 458 198, 469 232, 470 256 C 471 285, 466 315, 455 332" />
        {/* Right Wrist Ribbed Cuff */}
        <path d="M 455 332 L 450 356 L 416 356 L 410 332" />
        <path d="M 455 332 L 410 332" strokeWidth="1.8" />
        {/* Right Sleeve Inner Line */}
        <path d="M 410 332 C 400 305, 388 259, 372 232 C 363 220, 361 212, 361 212" />

        {/* Crewneck Ribbed Collar Front Band */}
        {!isBack ? (
          <>
            <path d="M 203 46 C 205 78, 273 78, 276 46" strokeWidth="2.2" fill={dark ? '#222225' : '#D8D5CF'} />
            <path d="M 198 46 C 200 88, 278 88, 281 46" strokeWidth="1.8" />
          </>
        ) : (
          <path d="M 203 46 C 212 55, 266 55, 276 46" strokeWidth="2.2" fill={dark ? '#222225' : '#D8D5CF'} />
        )}
      </g>

      {/* Print area guide (12" x 16" dashed bounding box matching Image 1) */}
      {showPrintArea && (
        <rect
          x="156"
          y={isBack ? 115 : 125}
          width="168"
          height={isBack ? 245 : 230}
          rx="2"
          stroke="#1A1A12"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          fill="none"
          opacity="0.9"
        />
      )}

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
  tank: {
    front: { x: 165, y: 165, w: 170, h: 220 },
    'center chest': { x: 165, y: 165, w: 170, h: 220 },
    'left chest': { x: 260, y: 155, w: 70, h: 70 },
    'right chest': { x: 170, y: 155, w: 70, h: 70 },
    back: { x: 165, y: 145, w: 170, h: 240 },
  },
  'tank-muscle': {
    front: { x: 165, y: 165, w: 170, h: 220 },
    'center chest': { x: 165, y: 165, w: 170, h: 220 },
    'left chest': { x: 260, y: 155, w: 70, h: 70 },
    'right chest': { x: 170, y: 155, w: 70, h: 70 },
    back: { x: 165, y: 145, w: 170, h: 240 },
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
  type: 'tshirt' | 'longsleeve' | 'tshirt-longsleeve' | 'tank' | 'tank-muscle' | 'sweatshirt' | 'hoodie' | 'hoodie-zip' | 'jacket' | 'mug' | 'tote' | 'hat' | 'poster' | 'blanket' | 'pillow' | 'phone'
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

