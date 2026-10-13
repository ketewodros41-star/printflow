'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { createFabricNormalTexture } from './productGeometries'
import { getPhotorealisticBlank } from '@/components/mockups/RealisticFlatLay'

export interface ArtworkLayer {
  id: string
  type: 'image' | 'text'
  src?: string
  text?: string
  view: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  fontSize?: number
  fontFamily?: string
  color?: string
  bold?: boolean
  italic?: boolean
  align?: 'left' | 'center' | 'right'
  flipX?: boolean
  visible: boolean
  opacity?: number
  arc?: number
  letterSpacing?: number
}

export interface DynamicTextureProps {
  productColor: string
  productType: string
  layers: ArtworkLayer[]
  printBox: { left: number; top: number; w: number; h: number }
  isHeather?: boolean
  onDirty?: () => void
}

// Global in-memory cache for loaded HTMLImageElement
const imageCache = new Map<string, HTMLImageElement>()

/**
 * Loads an image into memory cache with callback on completion.
 */
function getOrLoadImage(url: string, onLoad: () => void): HTMLImageElement | null {
  if (typeof window === 'undefined' || !url) return null
  const cached = imageCache.get(url)
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return cached
  }
  if (!cached) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => {
      imageCache.set(url, img)
      onLoad()
    }
    img.onerror = () => {
      imageCache.set(url, img)
    }
    imageCache.set(url, img)
  }
  return null
}

/**
 * Offscreen 2048x2048 canvas texture bridge baking garment color, heather grain,
 * authentic studio photographic folds/shading, and user placed layers in real-time.
 */
export function useDynamicTexture({
  productColor,
  productType,
  layers,
  printBox,
  isHeather,
  onDirty,
}: DynamicTextureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const [dynamicTexture, setDynamicTexture] = useState<THREE.CanvasTexture | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [dirtyCount, setDirtyCount] = useState(0)

  // Fabric normal map (cached)
  const fabricNormal = useMemo(() => {
    return createFabricNormalTexture()
  }, [])

  // Initialize offscreen 2048x2048 canvas and Three.js CanvasTexture once
  useEffect(() => {
    if (typeof window === 'undefined') return

    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 2048
    canvasRef.current = canvas

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 16
    textureRef.current = texture
    setDynamicTexture(texture)
    setIsReady(true)

    return () => {
      texture.dispose()
    }
  }, [])

  // Bake texture onto canvas
  useEffect(() => {
    if (!isReady || !canvasRef.current || !textureRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 2048
    const height = 2048
    const normType = (productType || 'tshirt').toLowerCase()
    const isMug = normType === 'mug' || normType.includes('mug')
    const isTote = normType === 'tote' || normType.includes('tote')
    const isCap = normType === 'cap' || normType.includes('hat')
    const isBlanket = normType === 'blanket' || normType.includes('blanket')

    // 1. Fill garment base color
    ctx.fillStyle = productColor || '#FFFFFF'
    ctx.fillRect(0, 0, width, height)

    // 2. Procedural Heather Grain if garment has heather/melange
    if (isHeather) {
      const grainCanvas = document.createElement('canvas')
      grainCanvas.width = 256
      grainCanvas.height = 256
      const gctx = grainCanvas.getContext('2d')!
      const gdata = gctx.createImageData(256, 256)
      const gd = gdata.data

      for (let i = 0; i < gd.length; i += 4) {
        const rand = Math.random()
        if (rand > 0.88) {
          gd[i] = 255
          gd[i + 1] = 255
          gd[i + 2] = 255
          gd[i + 3] = 40
        } else if (rand < 0.12) {
          gd[i] = 0
          gd[i + 1] = 0
          gd[i + 2] = 0
          gd[i + 3] = 35
        } else {
          gd[i + 3] = 0
        }
      }
      gctx.putImageData(gdata, 0, 0)

      const pat = ctx.createPattern(grainCanvas, 'repeat')
      if (pat) {
        ctx.fillStyle = pat
        ctx.fillRect(0, 0, width, height)
      }
    }

    // 3. Structural garment guide lines (zipper tape backing & polo placket)
    if (normType.includes('hoodie-zip') || normType === 'jacket') {
      // Dark fabric split tape under the metallic zipper
      ctx.save()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
      ctx.fillRect(508, 200, 8, 1600)
      ctx.restore()
    } else if (normType === 'polo') {
      // Subtle placket outline on front chest
      ctx.save()
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)'
      ctx.lineWidth = 2
      ctx.strokeRect(485, 340, 54, 280)
      ctx.restore()
    }

    // 4. Subtle procedural micro-weave texture for tactile depth
    if (!isMug) {
      const weaveCanvas = document.createElement('canvas')
      weaveCanvas.width = 128
      weaveCanvas.height = 128
      const wctx = weaveCanvas.getContext('2d')!
      const wdata = wctx.createImageData(128, 128)
      const wd = wdata.data

      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          const v = Math.sin((x / 2) * Math.PI) * Math.sin((y / 2) * Math.PI) * 12
          const idx = (y * 128 + x) * 4
          wd[idx] = 0
          wd[idx + 1] = 0
          wd[idx + 2] = 0
          wd[idx + 3] = Math.max(0, Math.floor(v))
        }
      }
      wctx.putImageData(wdata, 0, 0)
      const weavePattern = ctx.createPattern(weaveCanvas, 'repeat')
      if (weavePattern) {
        ctx.save()
        ctx.globalAlpha = 0.05
        ctx.fillStyle = weavePattern
        ctx.fillRect(0, 0, width, height)
        ctx.restore()
      }
    }

    // 5. Calibration of target regions and 1:1 conformal aspect ratio
    let frontCenter: { x: number; y: number }
    let backCenter: { x: number; y: number }
    let baseScale: number
    let aspectCorrection: number

    if (isMug) {
      // Cylinder wrap
      frontCenter = { x: 1024, y: 1024 }
      backCenter = { x: 1024, y: 1024 }
      baseScale = 3.6
      aspectCorrection = 1.0
    } else if (isTote) {
      // Canvas tote bag front and back faces
      frontCenter = { x: 512, y: 1020 }
      backCenter = { x: 1536, y: 1020 }
      baseScale = 3.2
      aspectCorrection = 1.0
    } else if (isCap) {
      // Baseball cap front crown
      frontCenter = { x: 512, y: 1024 }
      backCenter = { x: 1536, y: 1024 }
      baseScale = 3.0
      aspectCorrection = 1.0
    } else if (isBlanket) {
      // Blanket full throw
      frontCenter = { x: 1024, y: 1024 }
      backCenter = { x: 1024, y: 1024 }
      baseScale = 3.6
      aspectCorrection = 1.0
    } else if (normType.includes('hoodie')) {
      // High-fidelity 3D hoodie mesh from reference FBX
      frontCenter = { x: 512, y: 720 }
      backCenter = { x: 1536, y: 720 }
      baseScale = 2.6
      aspectCorrection = 1.34
    } else {
      // Apparel garments (chest centered at X = 512, Y ≈ 720; back at X = 1536)
      frontCenter = { x: 512, y: 720 }
      backCenter = { x: 1536, y: 720 }
      baseScale = 2.6
      // Conformal aspect ratio correction: dx/du = 3.75, dy/dv = 2.158 -> 3.75 / 2.158 = 1.737
      aspectCorrection = 1.737
    }

    // Reference center of the 2D editor print zone (standard 500x500 editor coordinates)
    const refCenterX = printBox.left + printBox.w / 2
    const refCenterY = printBox.top + printBox.h / 2

    // 6. Render user artwork layers
    const visibleLayers = layers.filter(l => l.visible !== false)

    visibleLayers.forEach(layer => {
      const isBackSide = (layer.view || '').toLowerCase().includes('back')
      const targetCenter = isBackSide ? backCenter : frontCenter

      // Unified offset from print area center, maintaining 1:1 physical aspect ratio
      const layerCenterX = layer.x + layer.width / 2
      const layerCenterY = layer.y + layer.height / 2

      const offsetX = (layerCenterX - refCenterX) * baseScale
      const offsetY = (layerCenterY - refCenterY) * baseScale * aspectCorrection

      const dstW = layer.width * baseScale
      const dstH = layer.height * baseScale * aspectCorrection

      const cx = targetCenter.x + offsetX
      const cy = targetCenter.y + offsetY

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(((layer.rotation || 0) * Math.PI) / 180)
      if (layer.flipX) {
        ctx.scale(-1, 1)
      }
      ctx.globalAlpha = layer.opacity ?? 1

      if (layer.type === 'image' && layer.src) {
        const cached = imageCache.get(layer.src)
        if (cached && cached.complete && cached.naturalWidth > 0) {
          ctx.drawImage(cached, -dstW / 2, -dstH / 2, dstW, dstH)
        } else if (!cached) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = layer.src
          img.onload = () => {
            imageCache.set(layer.src!, img)
            setDirtyCount(c => c + 1)
          }
          imageCache.set(layer.src, img)
        }
      } else if (layer.type === 'text' && layer.text) {
        const fontSize = Math.max(14, Math.round((layer.fontSize || 28) * baseScale * 0.45 * aspectCorrection))
        const fontStyle = `${layer.italic ? 'italic ' : ''}${layer.bold ? 'bold ' : ''}${fontSize}px ${layer.fontFamily || 'Inter, sans-serif'}`

        ctx.font = fontStyle
        ctx.fillStyle = layer.color || '#000000'
        ctx.textAlign = layer.align || 'center'
        ctx.textBaseline = 'middle'

        // Arched text support
        if (layer.arc && Math.abs(layer.arc) > 1) {
          const arcAngle = (layer.arc * Math.PI) / 180
          const radius = Math.max(dstW * 0.8, 160)
          const chars = layer.text.split('')
          const totalAngle = arcAngle
          const step = totalAngle / Math.max(1, chars.length - 1)
          const startAngle = -totalAngle / 2

          chars.forEach((char, idx) => {
            const charAngle = startAngle + idx * step
            ctx.save()
            ctx.rotate(charAngle)
            ctx.translate(0, -radius)
            ctx.fillText(char, 0, 0)
            ctx.restore()
          })
        } else {
          // Standard single or multi-line text
          const lines = layer.text.split('\n')
          const lineHeight = fontSize * 1.18
          const totalTextHeight = lines.length * lineHeight
          const startY = -(totalTextHeight / 2) + lineHeight / 2

          lines.forEach((line, i) => {
            ctx.fillText(line, 0, startY + i * lineHeight)
          })
        }
      }

      ctx.restore()
    })

    // 7. Update Three.js Texture & trigger dirty frame
    textureRef.current.needsUpdate = true
    if (typeof window !== 'undefined') {
      ;(window as any).__TEXTURE_CANVAS__ = canvas
    }
    if (onDirty) {
      onDirty()
    }
  }, [
    isReady,
    productColor,
    productType,
    layers,
    printBox,
    isHeather,
    dirtyCount,
    onDirty,
  ])

  return {
    dynamicTexture,
    fabricNormal,
    isReady,
  }
}
export default useDynamicTexture
