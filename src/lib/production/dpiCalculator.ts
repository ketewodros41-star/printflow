export interface DpiHealthResult {
  dpi: number
  quality: 'optimal' | 'good' | 'fair' | 'poor' | 'vector'
  label: string
  recommendation: string
  colorClass: string
  badgeDotClass: string
  isVector: boolean
}

/**
 * Calculates real-time DPI resolution based on native graphic dimensions,
 * placed size on canvas, and physical garment dimensions in inches.
 */
export function calculateLayerDpi(
  layer: {
    type: 'image' | 'text'
    width: number
    height: number
    naturalWidth?: number
    naturalHeight?: number
  },
  printBox: { w: number; h: number },
  productType: string = 'polo',
  panelKey: string = 'front'
): DpiHealthResult {
  if (layer.type === 'text') {
    return {
      dpi: 300,
      quality: 'vector',
      label: 'Vector Text (300+ DPI)',
      recommendation: 'Crisp vector typography scales infinitely without resolution loss.',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeDotClass: 'bg-emerald-500',
      isVector: true,
    }
  }

  // Determine physical width in inches for the active print panel
  let physicalPanelWidthInches = 12.0
  const normType = productType.toLowerCase()
  const normPanel = panelKey.toLowerCase()

  if (normType === 'polo') {
    if (normPanel.includes('front') || normPanel.includes('back')) physicalPanelWidthInches = 24.4 // 620 mm
    else if (normPanel.includes('sleeve')) physicalPanelWidthInches = 15.0 // 380 mm
    else if (normPanel.includes('collar')) physicalPanelWidthInches = 18.1 // 460 mm
    else if (normPanel.includes('placket')) physicalPanelWidthInches = 2.4  // 60 mm
  } else if (normType === 'tshirt' || normType === 'sweatshirt' || normType === 'hoodie') {
    if (normPanel.includes('chest') && (normPanel.includes('left') || normPanel.includes('right'))) physicalPanelWidthInches = 4.0
    else if (normPanel.includes('sleeve')) physicalPanelWidthInches = 3.5
    else physicalPanelWidthInches = 12.0
  } else if (normType === 'mug') {
    physicalPanelWidthInches = 3.5
  } else if (normType === 'tote') {
    physicalPanelWidthInches = 14.0
  } else if (normType === 'poster') {
    physicalPanelWidthInches = 18.0
  }

  // Calculate layer physical width in inches
  const layerPhysicalInches = (layer.width / Math.max(1, printBox.w)) * physicalPanelWidthInches
  const naturalWidth = layer.naturalWidth || (layer.type === 'image' ? 1600 : 800)
  const calculatedDpi = Math.round(naturalWidth / Math.max(0.1, layerPhysicalInches))

  if (calculatedDpi >= 280) {
    return {
      dpi: calculatedDpi,
      quality: 'optimal',
      label: `${calculatedDpi} DPI · High Quality`,
      recommendation: 'Print-ready resolution. Details will print sharp and crisp.',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeDotClass: 'bg-emerald-500',
      isVector: false,
    }
  }

  if (calculatedDpi >= 180) {
    return {
      dpi: calculatedDpi,
      quality: 'good',
      label: `${calculatedDpi} DPI · Good`,
      recommendation: 'Good resolution for standard apparel printing.',
      colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeDotClass: 'bg-blue-500',
      isVector: false,
    }
  }

  if (calculatedDpi >= 120) {
    return {
      dpi: calculatedDpi,
      quality: 'fair',
      label: `${calculatedDpi} DPI · Medium`,
      recommendation: 'Resolution is borderline. Micro-details or small text may appear slightly soft.',
      colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeDotClass: 'bg-amber-500',
      isVector: false,
    }
  }

  return {
    dpi: calculatedDpi,
    quality: 'poor',
    label: `${calculatedDpi} DPI · Low Resolution`,
    recommendation: 'Warning: Low resolution image. Graphic will print blurry or pixelated on fabric.',
    colorClass: 'bg-red-50 text-red-700 border-red-200',
    badgeDotClass: 'bg-red-500',
    isVector: false,
  }
}
