import { useEffect, useMemo, useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'
import { listMyBookings, getEligiblePaymentMethods, type ProviderBooking, type EligiblePaymentMethod, type CountryFee } from '../services'

interface Props {
  navigate: (s: Screen) => void
  providerId: string | null
  countryCode: string | null
  countries: CountryFee[]
}

function moneyStr(cents: number, currency: string) {
  return `${currency} ${(cents / 100).toFixed(2)}`
}

const DAY_MS = 24 * 60 * 60 * 1000

function inPeriod(iso: string, period: 0 | 1 | 2, now: Date): boolean {
  const d = new Date(iso)
  if (period === 0) return now.getTime() - d.getTime() < 7 * DAY_MS && d <= now
  if (period === 1) return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  return d.getFullYear() === now.getFullYear()
}

/**
 * MBPRV-45/46/48: real Earnings screen -- replaces the entirely fixture
 * previous version (hardcoded "৳4,850" balance, six fake transactions,
 * "Payout via bKash · 01XXXXXXXXXX · Verified"). Every number here comes
 * from the real `bookings` table (bookingService.listMyBookings), the same
 * source Bookings.tsx/Dashboard.tsx already use.
 *
 * Honest about payout timing (MBPRV-45's own AC): "Net Earned" reflects
 * completed/paid_out bookings, not money that has necessarily reached a
 * real payout account -- MBPRV-47 (real payout schedule/history) is
 * separately blocked, since no confirmed real `provider_payouts` columns
 * exist in this workspace to query safely.
 */
export default function Earnings({ navigate, providerId, countryCode, countries }: Props) {
  const [period, setPeriod] = useState<0 | 1 | 2>(1)
  const [bookings, setBookings] = useState<ProviderBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [methods, setMethods] = useState<EligiblePaymentMethod[] | null>(null)

  useEffect(() => {
    if (!providerId) { setBookings([]); setLoading(false); return }
    setLoading(true)
    listMyBookings(providerId).then(rows => { setBookings(rows); setLoading(false) })
  }, [providerId])

  const country = countries.find(c => c.country_code === countryCode)
  useEffect(() => {
    if (!countryCode || !country) { setMethods(null); return }
    let cancelled = false
    getEligiblePaymentMethods(countryCode, country.currency, 'provider_payout').then(m => { if (!cancelled) setMethods(m) })
    return () => { cancelled = true }
  }, [countryCode, country?.currency])

  const now = new Date()
  const completed = useMemo(() => bookings.filter(b => b.status === 'completed' || b.status === 'paid_out'), [bookings])
  const pending = useMemo(() => bookings.filter(b => ['requested', 'accepted', 'confirmed', 'in_progress'].includes(b.status)), [bookings])
  const currency = completed[0]?.currency ?? bookings[0]?.currency ?? country?.currency ?? null

  const periodCompleted = useMemo(() => completed.filter(b => inPeriod(b.scheduled_at, period, now)), [completed, period])
  const grossCents = periodCompleted.reduce((s, b) => s + b.price_cents, 0)
  const commissionCents = periodCompleted.reduce((s, b) => s + b.commission_cents, 0)
  const netCents = grossCents - commissionCents
  const pendingNetCents = pending.reduce((s, b) => s + (b.price_cents - b.commission_cents), 0)

  // MBPRV-46: real breakdown by service category, for the current period.
  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const b of periodCompleted) map.set(b.service_category, (map.get(b.service_category) ?? 0) + (b.price_cents - b.commission_cents))
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [periodCompleted])

  // Real daily net totals for the last 7 days, for the bar chart -- an
  // honestly sparse chart (mostly empty bars) is correct for a provider
  // with few completed bookings, not a bug to disguise with fixture data.
  const dayBars = useMemo(() => {
    const days: { label: string; net: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0)
      const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999)
      const net = completed
        .filter(b => { const t = new Date(b.scheduled_at); return t >= d && t <= dayEnd })
        .reduce((s, b) => s + (b.price_cents - b.commission_cents), 0)
      days.push({ label: d.toLocaleDateString(undefined, { weekday: 'narrow' }), net })
    }
    return days
  }, [completed])
  const maxDayNet = Math.max(1, ...dayBars.map(d => d.net))

  const exportCsv = () => {
    const header = ['id', 'household_id', 'service_category', 'scheduled_at', 'duration_hours', 'price_cents', 'commission_cents', 'net_cents', 'currency', 'status']
    const rows = completed.map(b => [b.id, b.household_id, b.service_category, b.scheduled_at, b.duration_hours, b.price_cents, b.commission_cents, b.price_cents - b.commission_cents, b.currency, b.status])
    const esc = (v: unknown) => { const s = String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
    const csv = [header, ...rows].map(r => r.map(esc).join(',')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `mombestie-earnings-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const PERIODS = ['This Week', 'This Month', 'This Year']

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">

        {/* Hero */}
        <div style={{
          padding: '48px 20px 24px',
          background: 'linear-gradient(180deg, #F7F9FF 0%, #FFFFFF 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(36,107,253,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>

          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A', marginBottom: 20 }}>Earnings</div>

          {/* Balance hero card */}
          <div style={{
            borderRadius: 22, padding: '22px', marginBottom: 16,
            background: 'linear-gradient(135deg, rgba(36,107,253,0.25) 0%, rgba(40,168,255,0.12) 100%)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(36,107,253,0.35)',
          }}>
            <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: 'rgba(17,26,58,0.5)', letterSpacing: 0.5, marginBottom: 6 }}>NET EARNED · {PERIODS[period].toUpperCase()}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: loading ? 20 : 40, fontWeight: 800, color: '#111A3A', letterSpacing: '-1px', lineHeight: 1 }}>
              {loading ? 'Loading…' : currency ? moneyStr(netCents, currency) : 'No completed bookings yet'}
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.4)', marginTop: 8, lineHeight: 1.5 }}>
              Real sum of completed bookings' price minus commission -- not a claim that this amount has already reached a real payout account (see below).
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ padding: '14px', borderRadius: 16, background: 'rgba(17,26,58,0.05)', border: '1px solid rgba(17,26,58,0.08)' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>⏳</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: 800, color: '#F59E0B' }}>{currency ? moneyStr(pendingNetCents, currency) : '—'}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.45)', marginTop: 3 }}>Pending</div>
              <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: 'rgba(17,26,58,0.3)', marginTop: 2 }}>{pending.length} booking{pending.length === 1 ? '' : 's'}</div>
            </div>
            <div style={{ padding: '14px', borderRadius: 16, background: 'rgba(17,26,58,0.05)', border: '1px solid rgba(17,26,58,0.08)' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>✅</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'rgba(17,26,58,0.4)' }}>Not tracked yet</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.45)', marginTop: 3 }}>Last Payout</div>
              <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: 'rgba(17,26,58,0.3)', marginTop: 2 }}>No real payout backend yet</div>
            </div>
          </div>
        </div>

        {/* Period selector */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', gap: 0, background: 'rgba(17,26,58,0.06)', borderRadius: 12, padding: 4, marginBottom: 16 }}>
            {PERIODS.map((p, i) => (
              <button key={p} onClick={() => setPeriod(i as 0 | 1 | 2)} style={{
                flex: 1, padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: period === i ? 'rgba(17,26,58,0.12)' : 'transparent',
                fontFamily: 'Inter', fontSize: 12, fontWeight: 600,
                color: period === i ? '#111A3A' : 'rgba(17,26,58,0.4)',
                transition: 'all 0.2s',
              }}>{p}</button>
            ))}
          </div>

          {/* Period totals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Gross', value: currency ? moneyStr(grossCents, currency) : '—', color: '#111A3A' },
              { label: 'Commission', value: currency ? moneyStr(commissionCents, currency) : '—', color: '#FF6B6B' },
              { label: 'Net Earned', value: currency ? moneyStr(netCents, currency) : '—', color: '#10B981' },
            ].map(s => (
              <div key={s.label} style={{ padding: '12px 10px', borderRadius: 14, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 9, color: 'rgba(17,26,58,0.35)', marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Bar chart -- real last-7-days net totals */}
          <div style={{
            padding: '16px', borderRadius: 18,
            background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
            marginBottom: 16,
          }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 16 }}>
              Daily Earnings (real, last 7 days) {currency ? `· ${currency}` : ''}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 72 }}>
              {dayBars.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%', borderRadius: '5px 5px 0 0',
                    background: i === 6 ? 'linear-gradient(180deg, #246BFD, #28A8FF)' : 'rgba(36,107,253,0.3)',
                    height: `${Math.max(4, (d.net / maxDayNet) * 100)}%`,
                    boxShadow: i === 6 ? '0 0 10px rgba(36,107,253,0.5)' : 'none',
                    transition: 'height 0.6s ease',
                    minHeight: 4,
                  }}/>
                  <div style={{ fontFamily: 'Inter', fontSize: 9, color: 'rgba(17,26,58,0.35)' }}>{d.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MBPRV-46: real breakdown by service category */}
          {byCategory.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 10 }}>By Service Category</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {byCategory.map(([cat, net]) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 12, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#111A3A' }}>{cat}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, fontWeight: 700, color: '#10B981' }}>{currency ? moneyStr(net, currency) : '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real payout methods -- same centralized eligibility engine as
              registration (MBPRV-39), previously built (PayoutMethodsCard in
              App.tsx) but never actually rendered anywhere in the app. */}
          <div style={{
            padding: '14px', borderRadius: 16, marginBottom: 16,
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#111A3A', marginBottom: 8 }}>Payout methods</div>
            {!countryCode ? (
              <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)' }}>Complete your provider registration to see payout methods for your country.</p>
            ) : methods === null ? (
              <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)' }}>Loading…</p>
            ) : methods.length === 0 ? (
              <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)' }}>No payout method is enabled for {country?.country_name ?? countryCode} yet. MomBestie is rolling out payout providers by country -- see Support for status.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {methods.map(m => (
                  <div key={m.provider_code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(17,26,58,0.08)' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#111A3A' }}>{m.display_name}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 10, background: m.mode === 'live' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: m.mode === 'live' ? '#10B981' : '#B8860B' }}>{m.mode}</span>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontFamily: 'Inter', fontSize: 10.5, color: 'rgba(17,26,58,0.35)', marginTop: 8, lineHeight: 1.5 }}>
              Payout options come from your country's real configuration -- never hardcoded to one processor.
            </p>
          </div>

          {/* MBPRV-48: real CSV export */}
          <button onClick={exportCsv} disabled={completed.length === 0} style={{
            width: '100%', padding: '13px', borderRadius: 13, border: '1px solid rgba(36,107,253,0.3)', cursor: completed.length === 0 ? 'not-allowed' : 'pointer',
            background: 'rgba(36,107,253,0.08)', fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#246BFD',
            marginBottom: 16, opacity: completed.length === 0 ? 0.5 : 1,
          }}>
            ⬇️ Export Completed Bookings as CSV
          </button>

          {/* Transactions -- real completed bookings, honest "Household
              #xxxxxxxx" (MBPRV-34's pattern) since no customer name exists
              on a booking row. */}
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 10 }}>Recent Transactions</div>
          {loading ? (
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.4)', textAlign: 'center', padding: '20px 0' }}>Loading…</p>
          ) : completed.length === 0 ? (
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.4)', textAlign: 'center', padding: '20px 0' }}>No completed bookings yet.</p>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
            {completed
              .slice()
              .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
              .slice(0, 20)
              .map(b => (
              <div key={b.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderRadius: 14, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: '#10B981', flexShrink: 0,
                }}>{b.household_id.slice(0, 2).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#111A3A' }}>Household #{b.household_id.slice(0, 8)}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>{b.service_category} · {new Date(b.scheduled_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13.5, fontWeight: 600, color: '#10B981' }}>{moneyStr(b.price_cents - b.commission_cents, b.currency)}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(17,26,58,0.3)', marginTop: 2 }}>{moneyStr(b.price_cents, b.currency)} gross</div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      <BottomNav current="settings" navigate={navigate}/>
    </div>
  )
}
