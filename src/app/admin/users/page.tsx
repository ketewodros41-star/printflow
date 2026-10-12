import { Search, Filter, UserCheck, UserX } from 'lucide-react'

const USERS = [
  { id: '1', name: 'Tigist Alemu',   email: 'tigist@email.com',   plan: 'Pro',  products: 24, orders: 183, status: 'ACTIVE',    joined: 'Jan 2026' },
  { id: '2', name: 'Bereket M.',     email: 'bereket@email.com',  plan: 'Free', products: 5,  orders: 12,  status: 'ACTIVE',    joined: 'Mar 2026' },
  { id: '3', name: 'Selam Tadesse',  email: 'selam@email.com',    plan: 'Pro',  products: 41, orders: 320, status: 'ACTIVE',    joined: 'Sep 2025' },
  { id: '4', name: 'Dawit Kebede',   email: 'dawit@email.com',    plan: 'Free', products: 2,  orders: 3,   status: 'SUSPENDED', joined: 'Aug 2026' },
  { id: '5', name: 'Hiwot Girma',    email: 'hiwot@email.com',    plan: 'Business', products: 87, orders: 940, status: 'ACTIVE', joined: 'Jun 2025' },
]

export default function AdminUsersPage() {
  return (
    <div className="p-8">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pf-ink">Users</h1>
          <p className="text-pf-muted text-sm mt-1">{USERS.length} merchants</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pf-subtle" />
          <input className="pf-input pl-10" placeholder="Search by name, email…" />
        </div>
        <button className="btn-secondary gap-2 text-sm"><Filter size={14} /> Filter</button>
      </div>

      <div className="pf-card overflow-hidden">
        <table className="pf-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Products</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map(u => (
              <tr key={u.id}>
                <td>
                  <div>
                    <div className="font-medium text-pf-ink text-sm">{u.name}</div>
                    <div className="text-xs text-pf-muted">{u.email}</div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${u.plan === 'Business' ? 'badge-olive' : u.plan === 'Pro' ? 'badge-sage' : 'badge-neutral'}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="text-sm">{u.products}</td>
                <td className="text-sm">{u.orders}</td>
                <td>
                  <span className={u.status === 'ACTIVE' ? 'status-active' : 'status-error'}>
                    {u.status}
                  </span>
                </td>
                <td className="text-sm text-pf-subtle">{u.joined}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-pf-divider rounded text-pf-muted hover:text-pf-ink" title="View">
                      <UserCheck size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded text-pf-muted hover:text-red-500" title="Suspend">
                      <UserX size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
