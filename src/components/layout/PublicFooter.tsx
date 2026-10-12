import Link from 'next/link'

export default function PublicFooter() {
  return (
    <footer className="bg-pf-ink text-white/80 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-white text-lg">PrintFlow</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Ethiopia's first print-on-demand platform. Design, sell, and ship
              custom products — all without holding stock.
            </p>
            {/* Ethiopian payment badges */}
            <div className="flex items-center gap-2 mt-5">
              <span className="px-2.5 py-1 text-xs font-bold rounded-sm bg-pf-chapa text-white">Chapa</span>
              <span className="px-2.5 py-1 text-xs font-bold rounded-sm bg-pf-mpesa text-white">M-Pesa</span>
              <span className="px-2.5 py-1 text-xs font-bold rounded-sm bg-pf-telebirr text-white">Telebirr</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {['Catalog', 'Product Creator', 'Mockup Generator', 'Store Builder', 'Pricing'].map(l => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Integrations</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {['Shopify', 'WooCommerce', 'Etsy', 'TikTok Shop', 'Amazon', 'Custom API'].map(l => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {['Help Center', 'Getting Started', 'Print Providers', 'Shipping Guide', 'Contact Us'].map(l => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} PrintFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
