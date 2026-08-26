import { useEffect, useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'
import { listMyBookings, decideBooking, type ProviderBooking } from '../services'

interface Props { navigate: (s: Screen) => void; providerId: string | null }

const TABS = ['Requests', 'Upcoming', 'In Progress', 'Completed', 'Cancelled']

function moneyStr(cents: number, currency: string) {
  return `${currency} ${(cents / 100).toFixed(2)}`
}

// Real `bookings` table, filtered to the signed-in provider's own rows --
// replaces the previous fixture (one hardcoded "Fatima M." request, three
// hardcoded "upcoming" rows, three hardcoded "completed" rows). No real
// table stores a customer display name on a booking (only household_id),
// so this shows "Household #xxxxxxxx" rather than inventing a name.
export default function Bookings({ navigate, providerId }: Props) {
  const [tab, setTab] = useState(0)
  const [bookings, setBookings] = useState<ProviderBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const refresh = () => {
    if (!providerId) { setBookings([]); setLoading(false); return }
    setLoading(true)
    listMyBookings(providerId).then(rows => { setBookings(rows); setLoading(false) })
  }
  useEffect(() => { refresh() }, [providerId])

  const act = async (id: string, status: 'accepted' | 'declined') => {
    setBusyId(id)
    await decideBooking(id, status)
    setBusyId(null)
    refresh()
  }

  const byTab: Record<number, ProviderBooking[]> = {
    0: bookings.filter(b => b.status === 'requested'),
    1: bookings.filter(b => b.status === 'accepted' || b.status === 'confirmed'),
    2: bookings.filter(b => b.status === 'in_progress'),
    3: bookings.filter(b => b.status === 'completed' || b.status === 'paid_out'),
    4: bookings.filter(b => b.status === 'declined' || b.status === 'cancelled'),
  }
  const shown = byTab[tab] ?? []
  const requestCount = byTab[0].length

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '48px 20px 0', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A', marginBottom: 16 }}>Bookings</div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 16 }} className="scrollbar-hide">
          {TABS.map((t, i) => (
            <button
              key={t} onClick={() => setTab(i)}
              style={{
                padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', flexShrink: 0,
                background: tab === i ? '#246BFD' : 'rgba(17,26,58,0.07)',
                fontFamily: 'Inter', fontSize: 12.5, fontWeight: 600,
                color: tab === i ? 'white' : 'rgba(17,26,58,0.5)',
                boxShadow: tab === i ? '0 4px 12px rgba(36,107,253,0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {t}
              {i === 0 && requestCount > 0 && (
                <span style={{
                  marginLeft: 6, padding: '1px 6px', borderRadius: 10,
                  background: tab === 0 ? 'rgba(255,255,255,0.25)' : '#F59E0B',
                  fontSize: 10, fontWeight: 700, color: 'white',
                }}>{requestCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px', paddingBottom: 96 }} className="scrollbar-hide">
        {!providerId ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: 'rgba(17,26,58,0.6)' }}>No approved family-service profile</div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.3)', marginTop: 8 }}>Bookings only apply to family-service providers, not healthcare.</div>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.4)' }}>Loading bookings…</div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{tab === 0 ? '📭' : tab === 2 ? '🔄' : '📋'}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: 700, color: 'rgba(17,26,58,0.6)' }}>
              {tab === 0 ? 'No new requests' : tab === 1 ? 'No upcoming bookings' : tab === 2 ? 'No active bookings right now' : tab === 3 ? 'No completed bookings yet' : 'No cancelled bookings'}
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.3)', marginTop: 8 }}>
              {tab === 0 ? "You'll see real requests here the moment a customer books you in the marketplace." : ''}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {shown.map(b => (
              <div key={b.id} style={{
                borderRadius: 18, padding: '14px',
                background: tab === 0 ? 'rgba(245,158,11,0.05)' : 'rgba(17,26,58,0.04)',
                border: tab === 0 ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(17,26,58,0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(36,107,253,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: '#246BFD', flexShrink: 0,
                  }}>{b.household_id.slice(0, 2).toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#111A3A' }}>Household #{b.household_id.slice(0, 8)}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)' }}>{b.service_category} · {new Date(b.scheduled_at).toLocaleDateString()} · {b.duration_hours} hrs</div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#10B981' }}>{moneyStr(b.price_cents - b.commission_cents, b.currency)}</div>
                </div>
                {b.notes && (
                  <div style={{
                    marginBottom: 10, padding: '10px 12px', borderRadius: 10,
                    background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
                    fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)', lineHeight: 1.5,
                  }}>{b.notes}</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.35)' }}>
                    Gross {moneyStr(b.price_cents, b.currency)} · Commission {moneyStr(b.commission_cents, b.currency)}
                  </div>
                  {tab === 0 ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button disabled={busyId === b.id} onClick={() => act(b.id, 'declined')} style={{
                        padding: '8px 14px', borderRadius: 10, cursor: busyId === b.id ? 'wait' : 'pointer', border: 'none',
                        background: 'rgba(255,107,107,0.1)', fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#FF6B6B',
                      }}>Decline</button>
                      <button disabled={busyId === b.id} onClick={() => act(b.id, 'accepted')} style={{
                        padding: '8px 14px', borderRadius: 10, cursor: busyId === b.id ? 'wait' : 'pointer', border: 'none',
                        background: 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)', fontFamily: 'Inter', fontSize: 12, fontWeight: 700, color: 'white',
                      }}>Accept</button>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 600, textTransform: 'capitalize',
                      background: 'rgba(17,26,58,0.06)', color: 'rgba(17,26,58,0.5)',
                    }}>{b.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav current="bookings" navigate={navigate}/>
    </div>
  )
}
