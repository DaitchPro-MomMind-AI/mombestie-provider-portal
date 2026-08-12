import { useState } from 'react'

// ─── Mock data ──────────────────────────────────────────────────────────────
// Everything here is a frontend fixture, same status as the customer app's
// pre-tracking-service mocks — clearly not live data. See
// ../../docs/ARCHITECTURE.md §10 for the real Provider/Booking service contracts
// this UI is designed to be wired to.

type BookingStatus = 'Requested' | 'Confirmed' | 'Completed'
const BOOKINGS: { id: string; customer: string; service: string; when: string; status: BookingStatus; amount: number }[] = [
  { id: 'bk_1', customer: 'Sarah M.', service: 'Evening babysitting (3h)', when: 'Today, 6:00 PM', status: 'Requested', amount: 75 },
  { id: 'bk_2', customer: 'Amara O.', service: 'Postpartum support (4h)', when: 'Tomorrow, 9:00 AM', status: 'Confirmed', amount: 140 },
  { id: 'bk_3', customer: 'Wei L.', service: 'Meal preparation', when: 'Aug 8', status: 'Completed', amount: 60 },
]

const VERIFICATION_STEPS = [
  { label: 'Identity verified', done: true },
  { label: 'Background check', done: true },
  { label: 'Certifications uploaded', done: true },
  { label: 'Application fee paid', done: true },
  { label: 'Admin review', done: false },
]

const NAV = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'bookings', label: 'Bookings', icon: '📋' },
  { id: 'availability', label: 'Availability', icon: '📅' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'earnings', label: 'Earnings & Payouts', icon: '💰' },
  { id: 'messages', label: 'Messages', icon: '💬' },
  { id: 'verification', label: 'Verification', icon: '✅' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
] as const
type NavId = typeof NAV[number]['id']

const COMMISSION_PCT = 10 // reference value — real commission is server-side, per country (see ARCHITECTURE.md §9)

function StatusPill({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    Requested: 'bg-[#FEF7E0] text-[#B8860B]',
    Confirmed: 'bg-[#EBF2FC] text-[#6299D5]',
    Completed: 'bg-[#E8F5EE] text-[#55A67A]',
  }
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status]}`}>{status}</span>
}

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCFA] px-4">
      <div className="w-full max-w-sm glass-card-strong rounded-3xl p-8">
        <div className="w-12 h-12 rounded-2xl coral-gradient flex items-center justify-center text-white font-display text-xl mb-4">M</div>
        <h1 className="font-display text-2xl text-[#242424] mb-1">Provider Portal</h1>
        <p className="text-sm text-[#6E6E73] mb-6">Sign in to manage your MomMind services.</p>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"
          className="cartoon-input w-full px-4 py-3 text-sm mb-3" />
        <input type="password" placeholder="Password" className="cartoon-input w-full px-4 py-3 text-sm mb-5" />
        <button onClick={onLogin} className="action-btn w-full coral-gradient text-white font-semibold py-3 rounded-2xl mb-3">Sign In</button>
        <button className="action-btn w-full bg-[#FFD6C9] text-[#C94930] font-semibold py-3 rounded-2xl">Start Provider Registration</button>
      </div>
    </div>
  )
}

function Sidebar({ active, onChange }: { active: NavId; onChange: (id: NavId) => void }) {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[#F6EDE8] bg-white p-4">
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-8 h-8 rounded-xl coral-gradient flex items-center justify-center text-white font-display">M</div>
        <span className="font-display text-[#242424]">Provider Portal</span>
      </div>
      <nav className="space-y-1">
        {NAV.map(n => (
          <button key={n.id} onClick={() => onChange(n.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${active === n.id ? 'bg-[#FFD6C9] text-[#C94930] font-semibold' : 'text-[#6E6E73] hover:bg-[#FFF3EE]'}`}>
            <span>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      {title && <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide mb-3">{title}</p>}
      {children}
    </div>
  )
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [nav, setNav] = useState<NavId>('overview')

  if (!loggedIn) return <LoginGate onLogin={() => setLoggedIn(true)} />

  const totalEarned = BOOKINGS.filter(b => b.status === 'Completed').reduce((s, b) => s + b.amount, 0)
  const commission = Math.round(totalEarned * (COMMISSION_PCT / 100) * 100) / 100

  return (
    <div className="min-h-screen flex bg-[#FFFCFA]">
      <Sidebar active={nav} onChange={setNav} />
      <main className="flex-1 min-w-0 px-6 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-[#242424] capitalize">{NAV.find(n => n.id === nav)?.label}</h1>
            <p className="text-sm text-[#6E6E73]">Jordan's Care Services · San Francisco, CA</p>
          </div>
          <select className="md:hidden text-sm border border-[#F0E8E4] rounded-lg px-2 py-1.5" value={nav} onChange={e => setNav(e.target.value as NavId)}>
            {NAV.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>

        {nav === 'overview' && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card title="Pending requests"><p className="font-display text-3xl text-[#242424]">{BOOKINGS.filter(b => b.status === 'Requested').length}</p></Card>
              <Card title="Upcoming bookings"><p className="font-display text-3xl text-[#242424]">{BOOKINGS.filter(b => b.status === 'Confirmed').length}</p></Card>
              <Card title="Rating"><p className="font-display text-3xl text-[#242424]">4.9 ★</p><p className="text-xs text-[#6E6E73] mt-1">32 reviews</p></Card>
            </div>
            <Card title="Recent activity">
              <div className="space-y-3">
                {BOOKINGS.map(b => (
                  <div key={b.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#242424]">{b.customer} — {b.service}</p>
                      <p className="text-xs text-[#6E6E73]">{b.when}</p>
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {nav === 'bookings' && (
          <div className="space-y-3">
            {BOOKINGS.map(b => (
              <Card key={b.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#242424]">{b.service}</p>
                    <p className="text-sm text-[#6E6E73]">{b.customer} · {b.when}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-[#242424]">${b.amount}</p>
                    <StatusPill status={b.status} />
                  </div>
                </div>
                {b.status === 'Requested' && (
                  <div className="flex gap-2 mt-4">
                    <button className="action-btn flex-1 coral-gradient text-white text-sm font-semibold py-2 rounded-xl">Accept</button>
                    <button className="action-btn flex-1 bg-[#F0E8E4] text-[#6E6E73] text-sm font-semibold py-2 rounded-xl">Decline</button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {nav === 'availability' && (
          <Card title="Weekly availability">
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                <div key={d} className={`rounded-xl py-4 text-sm font-medium ${i < 5 ? 'bg-[#FFD6C9] text-[#C94930]' : 'bg-[#F0E8E4] text-[#6E6E73]'}`}>{d}</div>
              ))}
            </div>
            <p className="text-xs text-[#6E6E73] mt-3">Editing availability updates what customers can book — changes are never shown as available until saved.</p>
          </Card>
        )}

        {nav === 'profile' && (
          <div className="space-y-4">
            <Card title="Public profile">
              <div className="grid sm:grid-cols-2 gap-3">
                <input defaultValue="Jordan's Care Services" className="cartoon-input px-4 py-2.5 text-sm" placeholder="Business name" />
                <input defaultValue="Babysitting, Postpartum Support" className="cartoon-input px-4 py-2.5 text-sm" placeholder="Categories" />
              </div>
              <textarea defaultValue="8 years of childcare experience, CPR certified, background-checked." className="cartoon-input w-full px-4 py-2.5 text-sm mt-3" rows={3} />
              <button className="action-btn coral-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-xl mt-3">Save Changes</button>
            </Card>
          </div>
        )}

        {nav === 'earnings' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card title="Gross (completed)"><p className="font-display text-2xl text-[#242424]">${totalEarned.toFixed(2)}</p></Card>
              <Card title={`Commission (${COMMISSION_PCT}%)`}><p className="font-display text-2xl text-[#242424]">-${commission.toFixed(2)}</p></Card>
              <Card title="Net payout"><p className="font-display text-2xl text-[#55A67A]">${(totalEarned - commission).toFixed(2)}</p></Card>
            </div>
            <Card title="Payout method">
              <p className="text-sm text-[#6E6E73]">No payout method connected yet. Real payouts require a Stripe Connect (or equivalent) account — see docs/ARCHITECTURE.md §9.</p>
              <button className="action-btn bg-[#FFD6C9] text-[#C94930] text-sm font-semibold px-5 py-2.5 rounded-xl mt-3">Connect Payout Method</button>
            </Card>
          </div>
        )}

        {nav === 'messages' && (
          <Card title="Conversations">
            <p className="text-sm text-[#6E6E73]">No messages yet. Conversations open once a booking is requested.</p>
          </Card>
        )}

        {nav === 'verification' && (
          <Card title="Verification status">
            <div className="space-y-3">
              {VERIFICATION_STEPS.map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${s.done ? 'bg-[#E8F5EE] text-[#55A67A]' : 'bg-[#F0E8E4] text-[#6E6E73]'}`}>
                    {s.done ? '✓' : '·'}
                  </div>
                  <p className={`text-sm ${s.done ? 'text-[#242424]' : 'text-[#6E6E73]'}`}>{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#6E6E73] mt-4">Verification badges are backend-controlled — this portal cannot self-assign a "Verified" status.</p>
          </Card>
        )}

        {nav === 'settings' && (
          <Card title="Account settings">
            <p className="text-sm text-[#6E6E73]">Notification preferences, security, and account deactivation would live here.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
