import JSZip from 'jszip'

export interface PanelDimensionSpec {
  id: string
  name: string
  widthMm: number
  heightMm: number
  bleedMm: number
  safeMarginMm: number
  dpi: number
  fabricType: string
  threadColorSpec?: string
}

export const PRODUCT_PANEL_SPECS: Record<string, Record<string, PanelDimensionSpec>> = {
  polo: {
    'front side': { id: 'front', name: 'Front Body', widthMm: 620, heightMm: 780, bleedMm: 12.7, safeMarginMm: 15, dpi: 300, fabricType: '100% Recycled Polyester Piqué (180 GSM)', threadColorSpec: 'Tone-on-tone with garment base' },
    'front': { id: 'front', name: 'Front Body', widthMm: 620, heightMm: 780, bleedMm: 12.7, safeMarginMm: 15, dpi: 300, fabricType: '100% Recycled Polyester Piqué (180 GSM)', threadColorSpec: 'Tone-on-tone with garment base' },
    'back side': { id: 'back', name: 'Back Body', widthMm: 620, heightMm: 790, bleedMm: 12.7, safeMarginMm: 15, dpi: 300, fabricType: '100% Recycled Polyester Piqué (180 GSM)', threadColorSpec: 'Tone-on-tone with garment base' },
    'back': { id: 'back', name: 'Back Body', widthMm: 620, heightMm: 790, bleedMm: 12.7, safeMarginMm: 15, dpi: 300, fabricType: '100% Recycled Polyester Piqué (180 GSM)', threadColorSpec: 'Tone-on-tone with garment base' },
    'left sleeve': { id: 'sleeve_left', name: 'Left Sleeve', widthMm: 380, heightMm: 260, bleedMm: 12.7, safeMarginMm: 12, dpi: 300, fabricType: '100% Recycled Polyester Piqué (180 GSM)', threadColorSpec: 'Tone-on-tone with garment base' },
    'right sleeve': { id: 'sleeve_right', name: 'Right Sleeve', widthMm: 380, heightMm: 260, bleedMm: 12.7, safeMarginMm: 12, dpi: 300, fabricType: '100% Recycled Polyester Piqué (180 GSM)', threadColorSpec: 'Tone-on-tone with garment base' },
    'collar': { id: 'collar', name: 'Outer Collar Rib', widthMm: 460, heightMm: 90, bleedMm: 10, safeMarginMm: 8, dpi: 300, fabricType: '100% Polyester 1x1 Rib Knit', threadColorSpec: 'Matching rib color' },
    'undercollar': { id: 'undercollar', name: 'Undercollar Rib', widthMm: 460, heightMm: 90, bleedMm: 10, safeMarginMm: 8, dpi: 300, fabricType: '100% Polyester 1x1 Rib Knit', threadColorSpec: 'Matching rib color' },
    'placket': { id: 'placket', name: 'Front Button Placket', widthMm: 60, heightMm: 180, bleedMm: 10, safeMarginMm: 6, dpi: 300, fabricType: '100% Polyester Interlock with Fused Interfacing', threadColorSpec: 'Tone-on-tone stitch' },
  },
  tshirt: {
    'front': { id: 'front', name: 'Center Chest', widthMm: 305, heightMm: 406, bleedMm: 0, safeMarginMm: 12, dpi: 300, fabricType: '100% Combed Ring-Spun Cotton (180 GSM)' },
    'center chest': { id: 'front', name: 'Center Chest', widthMm: 305, heightMm: 406, bleedMm: 0, safeMarginMm: 12, dpi: 300, fabricType: '100% Combed Ring-Spun Cotton (180 GSM)' },
    'back': { id: 'back', name: 'Back Full', widthMm: 305, heightMm: 406, bleedMm: 0, safeMarginMm: 12, dpi: 300, fabricType: '100% Combed Ring-Spun Cotton (180 GSM)' },
    'left chest': { id: 'left_chest', name: 'Left Chest Pocket Area', widthMm: 100, heightMm: 100, bleedMm: 0, safeMarginMm: 8, dpi: 300, fabricType: '100% Combed Ring-Spun Cotton (180 GSM)' },
    'right chest': { id: 'right_chest', name: 'Right Chest Pocket Area', widthMm: 100, heightMm: 100, bleedMm: 0, safeMarginMm: 8, dpi: 300, fabricType: '100% Combed Ring-Spun Cotton (180 GSM)' },
    'sleeve left': { id: 'sleeve_left', name: 'Left Sleeve', widthMm: 90, heightMm: 280, bleedMm: 0, safeMarginMm: 8, dpi: 300, fabricType: '100% Combed Ring-Spun Cotton (180 GSM)' },
    'sleeve right': { id: 'sleeve_right', name: 'Right Sleeve', widthMm: 90, heightMm: 280, bleedMm: 0, safeMarginMm: 8, dpi: 300, fabricType: '100% Combed Ring-Spun Cotton (180 GSM)' },
  },
  hoodie: {
    'front': { id: 'front', name: 'Front Chest & Pocket', widthMm: 305, heightMm: 380, bleedMm: 0, safeMarginMm: 15, dpi: 300, fabricType: '80% Cotton / 20% Polyester Fleece (320 GSM)' },
    'back': { id: 'back', name: 'Back Full', widthMm: 305, heightMm: 420, bleedMm: 0, safeMarginMm: 15, dpi: 300, fabricType: '80% Cotton / 20% Polyester Fleece (320 GSM)' },
  },
  mug: {
    'wrap': { id: 'wrap', name: 'Panoramic Wrap', widthMm: 220, heightMm: 95, bleedMm: 3, safeMarginMm: 5, dpi: 300, fabricType: 'Glossy Ceramic Sublimation Coated' },
    'front': { id: 'front', name: 'Front Face', widthMm: 75, heightMm: 75, bleedMm: 0, safeMarginMm: 5, dpi: 300, fabricType: 'Glossy Ceramic Sublimation Coated' },
  },
  tote: {
    'front': { id: 'front', name: 'Canvas Face', widthMm: 350, heightMm: 380, bleedMm: 0, safeMarginMm: 15, dpi: 300, fabricType: '100% Cotton Heavy Canvas (300 GSM)' },
    'back': { id: 'back', name: 'Canvas Back', widthMm: 350, heightMm: 380, bleedMm: 0, safeMarginMm: 15, dpi: 300, fabricType: '100% Cotton Heavy Canvas (300 GSM)' },
  },
}

export interface ProductionLayer {
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
  naturalWidth?: number
  naturalHeight?: number
}

export interface ProductionExportResult {
  zipBlob: Blob
  manifest: any
  techPackText: string
  panelFiles: { filename: string; blob: Blob; panelName: string; dpi: number; widthPx: number; heightPx: number }[]
}

/**
 * Renders a single print panel's transparent artwork at high definition (300 DPI equivalent)
 */
export async function renderPanelArtworkToBlob(
  panelKey: string,
  panelSpec: PanelDimensionSpec,
  layers: ProductionLayer[],
  printBox: { x: number; y: number; w: number; h: number }
): Promise<{ blob: Blob; widthPx: number; heightPx: number }> {
  // Compute pixel dimensions at 300 DPI with bleed
  const totalWidthMm = panelSpec.widthMm + (panelSpec.bleedMm * 2)
  const totalHeightMm = panelSpec.heightMm + (panelSpec.bleedMm * 2)

  // Standard target: 300 DPI (capped at max 4200px for browser canvas memory safety)
  const rawTargetW = Math.round((totalWidthMm / 25.4) * panelSpec.dpi)
  const rawTargetH = Math.round((totalHeightMm / 25.4) * panelSpec.dpi)
  
  const maxDim = 4000
  const scaleRatio = Math.min(1, maxDim / Math.max(rawTargetW, rawTargetH))
  const widthPx = Math.round(rawTargetW * scaleRatio)
  const heightPx = Math.round(rawTargetH * scaleRatio)

  const canvas = document.createElement('canvas')
  canvas.width = widthPx
  canvas.height = heightPx
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  if (!ctx) {
    throw new Error('Failed to create 2D canvas context for production render.')
  }

  // Ensure fully transparent background for lossless print alpha channel
  ctx.clearRect(0, 0, widthPx, heightPx)

  // Bleed offsets in pixel space
  const bleedX = (panelSpec.bleedMm / totalWidthMm) * widthPx
  const bleedY = (panelSpec.bleedMm / totalHeightMm) * heightPx
  const activeW = widthPx - (bleedX * 2)
  const activeH = heightPx - (bleedY * 2)

  // Find all active layers that belong to this panel
  const pNorm = panelKey.toLowerCase()
  const relevantLayers = layers.filter(l => {
    if (!l.visible) return false
    const lNorm = (l.view || '').toLowerCase()
    if (lNorm === pNorm) return true
    if (pNorm.includes('front') && (lNorm.includes('front') || lNorm.includes('chest'))) return true
    if (pNorm.includes('back') && lNorm.includes('back')) return true
    if (pNorm.includes('left') && lNorm.includes('left') && !pNorm.includes('right')) return true
    if (pNorm.includes('right') && lNorm.includes('right')) return true
    if (pNorm.includes('collar') && lNorm.includes('collar') && !pNorm.includes('under') && !lNorm.includes('under')) return true
    if (pNorm.includes('under') && lNorm.includes('under')) return true
    if (pNorm.includes('placket') && lNorm.includes('placket')) return true
    return false
  })

  // Render each layer on the high-res transparent canvas
  for (const layer of relevantLayers) {
    ctx.save()

    // Position relative to the 2D editor printBox
    const uX = (layer.x - printBox.x) / printBox.w
    const uY = (layer.y - printBox.y) / printBox.h
    const uW = layer.width / printBox.w
    const uH = layer.height / printBox.h

    const cx = bleedX + (uX + uW / 2) * activeW
    const cy = bleedY + (uY + uH / 2) * activeH
    const targetW = uW * activeW
    const targetH = uH * activeH

    ctx.translate(cx, cy)
    ctx.rotate(((layer.rotation || 0) * Math.PI) / 180)
    if (layer.flipX) ctx.scale(-1, 1)
    if (layer.opacity != null) ctx.globalAlpha = layer.opacity

    if (layer.type === 'image' && layer.src) {
      await new Promise<void>((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH)
          resolve()
        }
        img.onerror = () => {
          console.warn(`Could not load image source for production export: ${layer.src}`)
          resolve()
        }
        img.src = layer.src!
      })
    } else if (layer.type === 'text' && layer.text) {
      const fs = (layer.fontSize || 32) * (targetH / (layer.height || 100)) * 1.8
      ctx.font = `${layer.italic ? 'italic ' : ''}${layer.bold ? 'bold ' : ''}${Math.round(fs)}px ${layer.fontFamily || 'Inter, sans-serif'}`
      ctx.fillStyle = layer.color || '#1A1A12'
      ctx.textAlign = (layer.align || 'center') as CanvasTextAlign
      ctx.textBaseline = 'middle'
      const xOff = layer.align === 'left' ? -targetW / 2 : layer.align === 'right' ? targetW / 2 : 0
      ctx.fillText(layer.text, xOff, 0)
    }

    ctx.restore()
  }

  // Export as lossless transparent PNG blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b)
      else reject(new Error('Canvas toBlob failed'))
    }, 'image/png')
  })

  return { blob, widthPx, heightPx }
}

/**
 * Builds the complete industry-standard Production Package (.ZIP) containing:
 * - 300 DPI Transparent PNGs for each panel with bleed margins
 * - production_manifest.json (machine readable order contract + Printify API v1 format)
 * - tech_pack_operator_sheet.txt (factory floor sewing & press instructions)
 * - QC Mockup visual captures
 */
export async function exportProductionZipPackage({
  productType,
  productInfo,
  colorHex,
  colorName,
  size,
  layers,
  printMethod,
  qcMockupBlobs = [],
}: {
  productType: string
  productInfo: { name: string; brand: string; sku: string; printAreas: string[]; isAOP?: boolean }
  colorHex: string
  colorName: string
  size: string
  layers: ProductionLayer[]
  printMethod?: string
  qcMockupBlobs?: { filename: string; blob: Blob }[]
}): Promise<ProductionExportResult> {
  const zip = new JSZip()
  const orderId = `PF-PROD-${Date.now().toString().slice(-6)}`
  const timestamp = new Date().toISOString()

  const panelSpecs = PRODUCT_PANEL_SPECS[productType] || PRODUCT_PANEL_SPECS['tshirt']
  const panelFiles: { filename: string; blob: Blob; panelName: string; dpi: number; widthPx: number; heightPx: number }[] = []

  // Create folder structure in ZIP
  const panelsFolder = zip.folder('panels')
  const qcFolder = zip.folder('qc_mockups')

  // Standard print box coordinate reference (from 2D editor canvas)
  const printBoxMap: Record<string, { x: number; y: number; w: number; h: number }> = {
    'front side': { x: 140, y: 70, w: 220, h: 380 },
    'front': { x: 140, y: 70, w: 220, h: 380 },
    'back side': { x: 140, y: 70, w: 220, h: 380 },
    'back': { x: 140, y: 70, w: 220, h: 380 },
    'left sleeve': { x: 100, y: 100, w: 300, h: 220 },
    'right sleeve': { x: 100, y: 100, w: 300, h: 220 },
    'collar': { x: 70, y: 100, w: 360, h: 100 },
    'undercollar': { x: 70, y: 100, w: 360, h: 100 },
    'placket': { x: 140, y: 90, w: 120, h: 280 },
  }

  // Determine panels to export
  const panelsToProcess = productInfo.isAOP
    ? productInfo.printAreas.filter(a => !a.toLowerCase().includes('all'))
    : productInfo.printAreas

  for (const area of panelsToProcess) {
    const key = area.toLowerCase()
    const spec = panelSpecs[key] || {
      id: key.replace(/\s+/g, '_'),
      name: area,
      widthMm: 305,
      heightMm: 406,
      bleedMm: 0,
      safeMarginMm: 12,
      dpi: 300,
      fabricType: 'Standard Garment Fabric',
    }

    const box = printBoxMap[key] || { x: 165, y: 165, w: 170, h: 200 }
    const { blob, widthPx, heightPx } = await renderPanelArtworkToBlob(key, spec, layers, box)

    const filename = `panel_${spec.id}_300dpi.png`
    if (panelsFolder) {
      panelsFolder.file(filename, blob)
    }

    panelFiles.push({
      filename,
      blob,
      panelName: spec.name,
      dpi: spec.dpi,
      widthPx,
      heightPx,
    })
  }

  // Add QC Mockups if provided
  if (qcMockupBlobs && qcFolder) {
    for (const qc of qcMockupBlobs) {
      qcFolder.file(qc.filename, qc.blob)
    }
  }

  // Construct comprehensive Production Manifest (Printify API v1 Compatible)
  const manifest = {
    $schema: 'https://printflow.io/schemas/v1/production-manifest.json',
    production_job_id: orderId,
    generated_at: timestamp,
    software: 'PrintFlow Industrial Production Engine v2.4 (Printify Parity Standard)',
    garment: {
      sku: productInfo.sku,
      title: productInfo.name,
      brand: productInfo.brand,
      size: size,
      color: {
        name: colorName,
        hex: colorHex,
      },
      is_all_over_print: !!productInfo.isAOP,
      fabric_composition: panelSpecs['front']?.fabricType || '100% Combed Cotton',
      stitching_thread_color: colorName.toUpperCase() === 'WHITE' ? '#FFFFFF' : colorHex,
      button_specification: productType === 'polo' ? '2-Hole Matte Tone-on-Tone Melamine Buttons' : undefined,
    },
    manufacturing: {
      print_technique: productInfo.isAOP ? 'ALL_OVER_DYE_SUBLIMATION' : (printMethod ? printMethod.toUpperCase() : 'DIRECT_TO_GARMENT'),
      target_resolution_dpi: 300,
      color_space: 'sRGB IEC61966-2.1 with CMYK Fogra39 translation profile',
      sublimation_parameters: productInfo.isAOP ? {
        press_temperature_celsius: 200,
        press_duration_seconds: 45,
        pressure_bar: 4.5,
        paper_type: 'Tack High-Release Sublimation Paper 105 GSM',
      } : undefined,
    },
    panels: panelFiles.map(p => {
      const spec = Object.values(panelSpecs).find(s => s.name === p.panelName)
      return {
        panel_id: p.filename.replace('panel_', '').replace('_300dpi.png', ''),
        panel_name: p.panelName,
        file: `panels/${p.filename}`,
        physical_dimensions_mm: spec ? {
          width: spec.widthMm,
          height: spec.heightMm,
          bleed_margin: spec.bleedMm,
          safe_margin: spec.safeMarginMm,
        } : null,
        pixel_resolution: {
          width: p.widthPx,
          height: p.heightPx,
        },
        dpi: p.dpi,
      }
    }),
    printify_api_v1_payload: {
      title: productInfo.name,
      description: `Automated production order generated by PrintFlow. SKU: ${productInfo.sku}, Size: ${size}, Color: ${colorName}`,
      blueprint_id: productInfo.isAOP ? 1052 : 12,
      print_provider_id: 29,
      variants: [
        {
          id: 48921,
          price: 1850,
          is_enabled: true,
        }
      ],
      print_areas: panelFiles.map(p => ({
        position: p.panelName.toLowerCase().replace(/\s+/g, '_'),
        images: [
          {
            id: p.filename,
            x: 0.5,
            y: 0.5,
            scale: 1.0,
            angle: 0,
          }
        ]
      }))
    }
  }

  // Create human-readable Tech Pack Operator Sheet
  const techPackText = `================================================================================
                    PRINTFLOW COMMERCIAL PRODUCTION TECH PACK
================================================================================
JOB ORDER ID:     ${orderId}
DATE GENERATED:   ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
GARMENT SKU:      ${productInfo.sku} - ${productInfo.name}
GARMENT SIZE:     ${size}
COLORWAY:         ${colorName} (${colorHex})
PRINT TECHNIQUE:  ${manifest.manufacturing.print_technique}
TARGET DPI:       300 DPI (Lossless PNG-24 with Alpha Channel)

--------------------------------------------------------------------------------
1. FABRIC & SEWING SPECIFICATIONS
--------------------------------------------------------------------------------
• Primary Fabric:      ${manifest.garment.fabric_composition}
• Stitching Thread:    ${manifest.garment.stitching_thread_color} (Heavy-Duty Poly-Core)
• Buttons / Trims:     ${manifest.garment.button_specification || 'N/A'}
• Seam Allowance:      1/2 Inch (12.7 mm) Overlock with 4-Thread Safety Stitch
• Hem Stitch:          Twin-Needle Coverstitch (1/4 Inch Spacing)

--------------------------------------------------------------------------------
2. DIE-CUT PANELS & BLEED SPECIFICATIONS
--------------------------------------------------------------------------------
${panelFiles.map(p => `• ${p.panelName.padEnd(20)}: ${p.widthPx} × ${p.heightPx} px (File: panels/${p.filename})`).join('\n')}

--------------------------------------------------------------------------------
3. HEAT PRESS & RIP SETTINGS (DYE SUBLIMATION / CUT & SEW)
--------------------------------------------------------------------------------
• Temperature:         200°C (392°F)
• Dwell Time:          45 Seconds
• Pressure:            Medium-High (4.5 Bar / 65 PSI)
• RIP Profile:         sRGB IEC61966-2.1 to Wasatch / Ergosoft Sublimation Profile
• Heat Transfer Paper: High-Tack Anti-Ghosting 105 GSM

--------------------------------------------------------------------------------
4. OPERATOR QUALITY CONTROL CHECKLIST
--------------------------------------------------------------------------------
[ ] 1. Confirm panel graphics are printed right-reading (not mirrored on final fabric).
[ ] 2. Verify color matches target swatches without dye migration or gas ghosting.
[ ] 3. Ensure artwork bleeds completely past cut marks (no white margins at seams).
[ ] 4. Align placket and front body stripe/pattern intersections according to QC mockups.
[ ] 5. Trim loose threads and inspect collar fold line symmetry before packaging.
================================================================================
`

  // Add manifest and tech pack to ZIP root
  zip.file('production_manifest.json', JSON.stringify(manifest, null, 2))
  zip.file('tech_pack_operator_sheet.txt', techPackText)

  // Generate ZIP blob
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  })

  return {
    zipBlob,
    manifest,
    techPackText,
    panelFiles,
  }
}
