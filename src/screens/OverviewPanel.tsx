import { useState } from 'react'
import type { Booking, BookingStatus, NavId } from '../App'

/**
 * The Overview "command center" redesign (2026-08-14, major upgrade
 * request item 3). Every number here comes from real state -- the same
 * `bookings` array the rest of this file already treats as a frontend
 * fixture (see the file-level comment in App.tsx: real booking
 * persistence is a documented gap, not something this pass silently
 * papered over). What's real *today*, this component honestly shows;
 * what has no data source anywhere -- rating, profile views, conversion
 * rate, a live notification feed, a working AI assistant -- it does not
 * fabricate. Each of those renders an explicit "not available yet"
 * state instead of a made-up number.
 */

function StatusDot({ status }: { status: BookingStatus }) {
  const colors: Record<BookingStatus, string> = {
    Requested: '#B8860B', Confirmed: '#6299D5', Completed: '#55A67A', Declined: '#B0A8A4',
  }
  return <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[status] }} />
}

function MetricTile({ icon, label, value, sub, accent }: { icon: string; label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="relative overflow-hidden glass-card rounded-2xl p-3.5">
      <div className="glass-sheen" />
      <div className="relative flex items-center gap-2 mb-1.5">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: accent }}>{icon}</span>
        <p className="text-[10px] font-semibold text-[#6E6E73] uppercase tracking-wide leading-tight">{label}</p>
      </div>
      <p className="relative font-display text-2xl text-[#242424]">{value}</p>
      {sub && <p className="relative text-[10px] text-[#6E6E73] mt-0.5">{sub}</p>}
    </div>
  )
}

export function OverviewPanel({ providerProfile, bookings, totalEarned, onNavigate }: {
  providerProfile: { name: string; city: string | null; status: string; verified: boolean } | null
  bookings: Booking[]
  totalEarned: number
  onNavigate: (id: NavId) => void
}) {
  const [notifTip, setNotifTip] = useState(false)

  const pending = bookings.filter(b => b.status === 'Requested')
  const upcoming = bookings.filter(b => b.status === 'Confirmed')
  const completed = bookings.filter(b => b.status === 'Completed')
  const todaysBookings = bookings.filter(b => b.when.startsWith('Today')).sort((a, b) => a.when.localeCompare(b.when))
  const todaysEarnings = bookings.filter(b => b.status === 'Completed' && b.when.startsWith('Today')).reduce((s, b) => s + b.amount, 0)

  const greeting = (() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  })()
  const firstName = providerProfile?.name.split(/[\s']/)[0] || 'there'

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="relative overflow-hidden glass-card-strong rounded-2xl p-4">
        <div className="glass-sheen" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-full coral-gradient flex items-center justify-center text-white font-display text-lg flex-shrink-0">
            {(providerProfile?.name ?? '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-[#242424] truncate">{providerProfile?.name ?? 'Complete your registration'}</p>
              {providerProfile?.verified && (
                <span className="text-[9px] font-bold text-[#55A67A] bg-[#E8F5EE] rounded-full px-1.5 py-0.5 flex-shrink-0">✓ Verified</span>
              )}
            </div>
            <p className="text-xs text-[#6E6E73] truncate">{providerProfile?.city ?? 'No location set yet'}</p>
          </div>
          <div className="relative flex-shrink-0">
            <button onClick={() => setNotifTip(v => !v)} className="action-btn w-9 h-9 rounded-full bg-[#FFF8F4] border border-[#F0E8E4] flex items-center justify-center text-base">🔔</button>
            {notifTip && (
              <div className="absolute right-0 top-11 z-20 w-48 glass-card-strong rounded-xl p-3 text-[11px] text-[#6E6E73] shadow-lg">
                A real notification center is coming soon -- see Settings for what's live today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics -- only the ones with a real number behind them */}
      <div className="grid grid-cols-2 gap-2.5">
        <MetricTile icon="📋" label="Pending" value={String(pending.length)} accent="#FFD6C9" />
        <MetricTile icon="📅" label="Upcoming" value={String(upcoming.length)} accent="#DDE6F5" />
        <MetricTile icon="✅" label="Completed" value={String(completed.length)} accent="#D3EFE0" />
        <MetricTile icon="💰" label="Today" value={`$${todaysEarnings.toFixed(0)}`} sub={`$${totalEarned.toFixed(0)} all-time`} accent="#E4D8FA" />
      </div>

      {/* AI Assistant -- honestly gated, no fake responses. See
          docs/PROJECT_REPORT.md §11: blocked on a real Anthropic API key. */}
      <div className="relative overflow-hidden glass-card-strong rounded-2xl p-4">
        <div className="glass-sheen" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-full ai-orb ai-orb-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#242424]">MomBestie Provider AI</p>
            <p className="text-xs text-[#6E6E73]">Not connected yet -- your assistant needs a real AI model set up first.</p>
          </div>
          <span className="text-[9px] font-bold text-[#B0A8A4] bg-[#F0E8E4] rounded-full px-2 py-1 uppercase tracking-wide flex-shrink-0">Soon</span>
        </div>
      </div>

      {/* Today's schedule */}
      <div>
        <p className="text-[11px] font-bold text-[#B0A8A4] uppercase tracking-[0.12em] mb-2 px-1">Today's schedule</p>
        <div className="relative overflow-hidden glass-card rounded-2xl p-4">
          {todaysBookings.length === 0 ? (
            <p className="text-sm text-[#6E6E73]">Nothing on the books for today.</p>
          ) : (
            <div className="space-y-3">
              {todaysBookings.map((b, i) => (
                <div key={b.id} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                    <StatusDot status={b.status} />
                    {i < todaysBookings.length - 1 && <div className="w-px flex-1 bg-[#F0E8E4] mt-1" style={{ minHeight: 20 }} />}
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <p className="text-xs font-semibold text-[#EE674E]">{b.when.replace('Today, ', '')}</p>
                    <p className="text-sm font-medium text-[#242424]">{b.service}</p>
                    <p className="text-xs text-[#6E6E73]">{b.customer} · {b.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <p className="text-[11px] font-bold text-[#B0A8A4] uppercase tracking-[0.12em] mb-2 px-1">Recent activity</p>
        <div className="relative overflow-hidden glass-card rounded-2xl divide-y divide-[#F6EDE8]">
          {bookings.length === 0 ? (
            <p className="text-sm text-[#6E6E73] p-4">No activity yet.</p>
          ) : bookings.map(b => (
            <div key={b.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#242424] truncate">{b.customer} — {b.service}</p>
                <p className="text-xs text-[#6E6E73]">{b.when}</p>
              </div>
              <span className="flex-shrink-0 ml-2"><StatusPillLocal status={b.status} /></span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions -- every one navigates to a real screen, nothing
          links to a page that doesn't exist yet. */}
      <div>
        <p className="text-[11px] font-bold text-[#B0A8A4] uppercase tracking-[0.12em] mb-2 px-1">Quick actions</p>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { id: 'bookings' as NavId, icon: '📋', label: 'View Bookings' },
            { id: 'earnings' as NavId, icon: '💰', label: 'Check Earnings' },
            { id: 'availability' as NavId, icon: '📅', label: 'Availability' },
            { id: 'profile' as NavId, icon: '👤', label: 'Edit Profile' },
          ].map(a => (
            <button key={a.id} onClick={() => onNavigate(a.id)}
              className="action-btn glass-card rounded-2xl p-3 flex items-center gap-2 text-left hover:bg-black/[0.02] active:bg-black/[0.04]">
              <span className="text-lg">{a.icon}</span>
              <span className="text-xs font-semibold text-[#242424]">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-[#B0A8A4] pt-1">{greeting}, {firstName} 👋</p>
    </div>
  )
}

function StatusPillLocal({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    Requested: 'bg-[#FEF7E0] text-[#B8860B]',
    Confirmed: 'bg-[#EBF2FC] text-[#6299D5]',
    Completed: 'bg-[#E8F5EE] text-[#55A67A]',
    Declined: 'bg-[#F0E8E4] text-[#6E6E73]',
  }
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${styles[status]}`}>{status}</span>
}
