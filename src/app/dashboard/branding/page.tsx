'use client'

import { useState } from 'react'
import { Upload, Palette, Type, Trash2, Save } from 'lucide-react'
import { useAuth } from '@/lib/auth'

const BRAND_COLORS = ['#1C2B0C', '#4A7B3F', '#EDE9E1', '#1A1A12', '#8B7355']

export default function BrandingPage() {
  const { user, updateUser }        = useAuth()
  const [storeName, setStoreName]   = useState(user?.storeName ?? 'My Store')
  const [tagline, setTagline]       = useState('Custom prints, made in Ethiopia')
  const [primary, setPrimary]       = useState('#1C2B0C')
  const [secondary, setSecondary]   = useState('#EDE9E1')
  const [saved, setSaved]           = useState(false)

  function handleSave() {
    updateUser({ storeName })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pf-ink">Branding</h1>
          <p className="text-pf-muted text-sm mt-1">Customize how your store looks to customers.</p>
        </div>
        <button onClick={handleSave} className="btn-primary gap-2">
          <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Store identity */}
          <div className="pf-card p-6">
            <h2 className="font-semibold text-pf-ink mb-5">Store Identity</h2>
            <div className="space-y-4">
              <div>
                <label className="pf-label">Store Name</label>
                <input className="pf-input" value={storeName} onChange={e => setStoreName(e.target.value)} />
              </div>
              <div>
                <label className="pf-label">Tagline</label>
                <input className="pf-input" value={tagline} onChange={e => setTagline(e.target.value)}
                  placeholder="Short description of your store" />
              </div>
              <div>
                <label className="pf-label">Store URL</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-pf-muted px-3 py-2 bg-pf-paper border border-pf-border rounded-pf-sm border-r-0">
                    printflow.et/store/
                  </span>
                  <input className="pf-input flex-1" defaultValue={user?.storeSlug ?? 'my-store'} />
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="pf-card p-6">
            <h2 className="font-semibold text-pf-ink mb-5">Logo</h2>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-pf bg-pf-divider flex items-center justify-center">
                <Type size={28} className="text-pf-muted" />
              </div>
              <div>
                <button className="btn-secondary gap-2 text-sm mb-2">
                  <Upload size={14} /> Upload Logo
                </button>
                <p className="text-xs text-pf-muted">PNG or SVG, min 400×400 px, max 5 MB</p>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="pf-card p-6">
            <h2 className="font-semibold text-pf-ink mb-5 flex items-center gap-2">
              <Palette size={16} /> Brand Colors
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="pf-label">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={primary} onChange={e => setPrimary(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0" />
                  <input className="pf-input flex-1 font-mono text-sm uppercase" value={primary}
                    onChange={e => setPrimary(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="pf-label">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={secondary} onChange={e => setSecondary(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0" />
                  <input className="pf-input flex-1 font-mono text-sm uppercase" value={secondary}
                    onChange={e => setSecondary(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="pf-label">Presets</label>
              <div className="flex gap-2 flex-wrap">
                {BRAND_COLORS.map(c => (
                  <button key={c} onClick={() => setPrimary(c)}
                    className="w-8 h-8 rounded-full border-2 border-pf-border hover:border-pf-ink transition-colors"
                    style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="pf-card p-5 sticky top-6">
            <h3 className="font-semibold text-pf-ink mb-4 text-sm">Store Preview</h3>
            <div className="rounded-pf overflow-hidden border border-pf-border">
              <div className="h-10 flex items-center px-3 gap-2"
                style={{ backgroundColor: primary }}>
                <div className="w-4 h-4 rounded bg-white/20" />
                <span className="text-white text-xs font-semibold">{storeName}</span>
              </div>
              <div className="p-3 bg-white">
                <div className="text-xs text-gray-500 mb-2">{tagline}</div>
                <div className="grid grid-cols-2 gap-2">
                  {['👕', '🧥', '☕', '👜'].map(e => (
                    <div key={e} className="aspect-square rounded bg-gray-100 flex items-center justify-center text-2xl">
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
