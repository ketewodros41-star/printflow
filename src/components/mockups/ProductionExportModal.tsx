'use client'

import React, { useState } from 'react'
import {
  X,
  Download,
  FileCheck2,
  Package,
  Layers,
  FileCode,
  Copy,
  Check,
  Printer,
  Sparkles,
  AlertTriangle,
  Info,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  exportProductionZipPackage,
  ProductionExportResult,
  ProductionLayer,
} from '@/lib/production/exportProductionPackage'

interface ProductionExportModalProps {
  isOpen: boolean
  onClose: () => void
  productType: string
  productInfo: { name: string; brand: string; sku: string; printAreas: string[]; isAOP?: boolean }
  colorHex: string
  colorName: string
  size: string
  layers: ProductionLayer[]
  printMethod?: string
}

export function ProductionExportModal({
  isOpen,
  onClose,
  productType,
  productInfo,
  colorHex,
  colorName,
  size,
  layers,
  printMethod,
}: ProductionExportModalProps) {
  const [activeTab, setActiveTab] = useState<'package' | 'api' | 'techpack'>('package')
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<ProductionExportResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleStartExport = async () => {
    setIsExporting(true)
    setErrorMsg(null)
    try {
      const result = await exportProductionZipPackage({
        productType,
        productInfo,
        colorHex,
        colorName,
        size,
        layers,
        printMethod,
      })
      setExportResult(result)

      // Automatically trigger download of the ZIP file
      const downloadUrl = URL.createObjectURL(result.zipBlob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `PrintFlow-Production-Package-${productInfo.sku}-${colorName.toUpperCase()}-${Date.now().toString().slice(-4)}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
    } catch (err: any) {
      console.error('Production export failed:', err)
      setErrorMsg(err.message || 'Failed to generate 300 DPI production files.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyApiPayload = () => {
    if (!exportResult) return
    navigator.clipboard.writeText(JSON.stringify(exportResult.manifest.printify_api_v1_payload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Pre-flight validation checks
  const totalLayers = layers.filter(l => l.visible).length
  const hasAopPanels = productInfo.isAOP
  const panelCount = hasAopPanels ? productInfo.printAreas.filter(a => !a.toLowerCase().includes('all')).length : productInfo.printAreas.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#E5E2DC] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E2DC] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#575C46] text-white flex items-center justify-center shadow-xs">
              <Printer size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1A1A12]">Commercial Production Package</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Printify & RIP Ready
                </span>
              </div>
              <p className="text-xs text-[#8C8880]">
                {productInfo.sku} · {productInfo.name} · {size} / {colorName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C8880] hover:text-[#1A1A12] hover:bg-[#EFECE6] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Pre-flight Audit Banner */}
        <div className="px-6 py-3.5 bg-[#F6F5F2] border-b border-[#E5E2DC] flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck size={16} />
              <span>300 DPI Raster Engine</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#5C5A55]">
              <Layers size={14} />
              <span>{totalLayers} Active Layers</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#5C5A55]">
              <Package size={14} />
              <span>{panelCount} Die-Cut Panels</span>
            </div>
            {hasAopPanels && (
              <div className="flex items-center gap-1.5 text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                <span>0.5" (12.7mm) Bleed Enabled</span>
              </div>
            )}
          </div>
          <span className="font-mono text-[11px] text-[#8C8880]">sRGB IEC61966-2.1</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E2DC] px-6 gap-6 bg-white">
          <button
            onClick={() => setActiveTab('package')}
            className={cn(
              'py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2',
              activeTab === 'package'
                ? 'border-[#575C46] text-[#1A1A12]'
                : 'border-transparent text-[#8C8880] hover:text-[#1A1A12]'
            )}
          >
            <Download size={14} />
            <span>Production ZIP Bundle</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={cn(
              'py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2',
              activeTab === 'api'
                ? 'border-[#575C46] text-[#1A1A12]'
                : 'border-transparent text-[#8C8880] hover:text-[#1A1A12]'
            )}
          >
            <FileCode size={14} />
            <span>Printify API v1 Contract</span>
          </button>
          <button
            onClick={() => setActiveTab('techpack')}
            className={cn(
              'py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2',
              activeTab === 'techpack'
                ? 'border-[#575C46] text-[#1A1A12]'
                : 'border-transparent text-[#8C8880] hover:text-[#1A1A12]'
            )}
          >
            <FileCheck2 size={14} />
            <span>Factory Tech Pack</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'package' && (
            <div className="space-y-5">
              <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A1A12]">Included Manufacturing Assets:</span>
                  <span className="text-[11px] font-semibold text-[#575C46]">Lossless PNG-24 + Metadata</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {hasAopPanels ? (
                    <>
                      <div className="p-2.5 bg-white border border-[#E5E2DC] rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A12]">panel_front_300dpi.png</span>
                        <span className="text-[10px] text-[#8C8880]">620×780mm + 0.5" bleed</span>
                      </div>
                      <div className="p-2.5 bg-white border border-[#E5E2DC] rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A12]">panel_back_300dpi.png</span>
                        <span className="text-[10px] text-[#8C8880]">620×790mm + 0.5" bleed</span>
                      </div>
                      <div className="p-2.5 bg-white border border-[#E5E2DC] rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A12]">panel_sleeve_left_300dpi.png</span>
                        <span className="text-[10px] text-[#8C8880]">380×260mm + 0.5" bleed</span>
                      </div>
                      <div className="p-2.5 bg-white border border-[#E5E2DC] rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A12]">panel_sleeve_right_300dpi.png</span>
                        <span className="text-[10px] text-[#8C8880]">380×260mm + 0.5" bleed</span>
                      </div>
                      <div className="p-2.5 bg-white border border-[#E5E2DC] rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A12]">panel_collar_300dpi.png</span>
                        <span className="text-[10px] text-[#8C8880]">460×90mm + 10mm bleed</span>
                      </div>
                      <div className="p-2.5 bg-white border border-[#E5E2DC] rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A12]">panel_placket_300dpi.png</span>
                        <span className="text-[10px] text-[#8C8880]">60×180mm + 10mm bleed</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2.5 bg-white border border-[#E5E2DC] rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A12]">artwork_front_300dpi.png</span>
                        <span className="text-[10px] text-[#8C8880]">305×406mm (12×16")</span>
                      </div>
                      <div className="p-2.5 bg-white border border-[#E5E2DC] rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A12]">artwork_back_300dpi.png</span>
                        <span className="text-[10px] text-[#8C8880]">305×406mm (12×16")</span>
                      </div>
                    </>
                  )}
                  <div className="p-2.5 bg-white border border-[#E5E2DC] rounded-xl flex items-center justify-between">
                    <span className="font-semibold text-[#1A1A12]">production_manifest.json</span>
                    <span className="text-[10px] text-[#8C8880]">Machine specifications</span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#E5E2DC] rounded-xl flex items-center justify-between">
                    <span className="font-semibold text-[#1A1A12]">tech_pack_operator_sheet.txt</span>
                    <span className="text-[10px] text-[#8C8880]">Heat press & sewing guide</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Direct Commercial Fulfillment Compatibility</p>
                  <p className="text-amber-800 leading-relaxed">
                    This ZIP archive contains transparent, unflattened artwork files without shirt blanks or drop shadows.
                    Any commercial dye-sublimation printer (Epson SureColor, Mimaki, Wasatch RIP) or DTG firm can load these directly into their production queue without pre-press adjustment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A12]">Printify API Payload (Ready to POST)</span>
                <button
                  onClick={handleCopyApiPayload}
                  disabled={!exportResult}
                  className="px-3 py-1.5 rounded-xl border border-[#D5D2CA] text-xs font-bold text-[#1A1A12] bg-white hover:bg-[#FAF9F6] flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#1A1A12] text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto max-h-[360px] border border-[#333]">
                {exportResult
                  ? JSON.stringify(exportResult.manifest.printify_api_v1_payload, null, 2)
                  : JSON.stringify(
                      {
                        title: productInfo.name,
                        blueprint_id: productInfo.isAOP ? 1052 : 12,
                        print_provider_id: 29,
                        sku: productInfo.sku,
                        variant: { size, color: colorName, hex: colorHex },
                        status: 'Generate package to view complete payload with coordinate mappings',
                      },
                      null,
                      2
                    )}
              </pre>
            </div>
          )}

          {activeTab === 'techpack' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A12]">Factory Floor Tech Pack Specification</span>
                <span className="text-[11px] font-mono text-[#8C8880]">UTF-8 Plaintext</span>
              </div>
              <pre className="p-4 bg-[#FAF9F6] text-[#1A1A12] font-mono text-[11px] rounded-2xl overflow-x-auto max-h-[360px] border border-[#E5E2DC] leading-relaxed">
                {exportResult
                  ? exportResult.techPackText
                  : `PRINTFLOW COMMERCIAL PRODUCTION TECH PACK
SKU: ${productInfo.sku}
GARMENT: ${productInfo.name}
SIZE: ${size} | COLOR: ${colorName} (${colorHex})
PRINT TECHNIQUE: ${productInfo.isAOP ? 'ALL_OVER_DYE_SUBLIMATION' : 'DIRECT_TO_GARMENT'}
RESOLUTION: 300 DPI Lossless Alpha PNG

Click "Generate & Download Production Package" to compile full sewing metrics and heat press guidelines.`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E5E2DC] bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#8C8880]">
            <Sparkles size={14} className="text-[#575C46]" />
            <span>Lossless PNG-24 with alpha channel · Zero watermarks</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#6E6B65] hover:text-[#1A1A12] hover:bg-[#EFECE6] transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleStartExport}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl bg-[#575C46] text-white text-xs font-bold hover:bg-[#434736] transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Download size={14} className={isExporting ? 'animate-bounce' : ''} />
              <span>{isExporting ? 'Compiling 300 DPI Package…' : 'Generate & Download (.ZIP)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
