export default function DashboardSettingsPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-pf-ink">Settings</h1>
        <p className="text-pf-muted text-sm mt-1">Manage your account, store, and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="pf-card p-6">
          <h2 className="font-semibold text-pf-ink mb-5">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-pf-divider flex items-center justify-center text-2xl font-bold text-pf-ink">
              A
            </div>
            <div>
              <button className="btn-secondary text-sm px-4 py-2">Change photo</button>
              <p className="text-xs text-pf-subtle mt-1">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="pf-label">First name</label>
              <input className="pf-input" defaultValue="Abebe" />
            </div>
            <div>
              <label className="pf-label">Last name</label>
              <input className="pf-input" defaultValue="Kebede" />
            </div>
            <div className="col-span-2">
              <label className="pf-label">Email</label>
              <input type="email" className="pf-input" defaultValue="abebe@email.com" />
            </div>
          </div>
          <button className="btn-primary mt-4 text-sm">Save changes</button>
        </div>

        {/* Store settings */}
        <div className="pf-card p-6">
          <h2 className="font-semibold text-pf-ink mb-5">Store Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="pf-label">Store name</label>
              <input className="pf-input" defaultValue="My new store" />
            </div>
            <div>
              <label className="pf-label">Store URL slug</label>
              <div className="flex items-center">
                <span className="px-3.5 py-2.5 bg-pf-paper border border-r-0 border-pf-border rounded-l-pf text-sm text-pf-muted">
                  printflow.et/store/
                </span>
                <input className="pf-input rounded-l-none" defaultValue="my-store" />
              </div>
            </div>
            <div>
              <label className="pf-label">Default currency</label>
              <select className="pf-input">
                <option value="ETB">Ethiopian Birr (ETB)</option>
                <option value="USD">US Dollar (USD)</option>
              </select>
            </div>
          </div>
          <button className="btn-primary mt-4 text-sm">Save changes</button>
        </div>

        {/* Notifications */}
        <div className="pf-card p-6">
          <h2 className="font-semibold text-pf-ink mb-5">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: 'New order received',        sub: 'Get notified when a customer places an order' },
              { label: 'Order shipped',             sub: 'Get notified when an order ships' },
              { label: 'Order fulfilled',           sub: 'Get notified when an order is delivered' },
              { label: 'Low stock alerts',          sub: 'Get notified when a variant is running low' },
              { label: 'PrintFlow announcements',   sub: 'Platform updates and new features' },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-pf-ink">{n.label}</div>
                  <div className="text-xs text-pf-muted">{n.sub}</div>
                </div>
                <div className="w-11 h-6 rounded-full bg-pf-olive relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="pf-card p-6">
          <h2 className="font-semibold text-pf-ink mb-5">Security</h2>
          <div className="space-y-3">
            <button className="btn-secondary text-sm w-full justify-start">Change password</button>
            <button className="btn-secondary text-sm w-full justify-start">Enable two-factor authentication</button>
            <button className="btn-secondary text-sm w-full justify-start">View active sessions</button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="pf-card p-6 border-red-100">
          <h2 className="font-semibold text-red-600 mb-3">Danger Zone</h2>
          <p className="text-sm text-pf-muted mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="btn-secondary border-red-200 text-red-600 hover:bg-red-50 text-sm px-5 py-2">
            Delete account
          </button>
        </div>
      </div>
    </div>
  )
}
