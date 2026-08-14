import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

const TABS = ['Requests', 'Upcoming', 'In Progress', 'Completed', 'Cancelled']

const REQUEST = {
  customer: 'Fatima M.', avatar: 'FM', service: 'Babysitting',
  date: 'Saturday, Aug 16', time: '5:00 PM – 9:00 PM', duration: '4 hrs',
  location: 'Gulshan-2, Dhaka', distance: '3.2 km',
  notes: 'Two children, ages 3 and 6. Both can eat by themselves. Bedtime at 8:30 PM.',
  gross: '৳2,800', commission: '৳420 (15%)', fee: '৳0', net: '৳2,380',
}

const UPCOMING = [
  {
    customer: 'Sarah K.', avatar: 'SK', service: 'Babysitting', date: 'Today', time: '9:00 AM', duration: '4 hrs',
    price: '৳2,800', net: '৳2,380', status: 'upcoming', color: '#246BFD',
  },
  {
    customer: 'Nadia H.', avatar: 'NH', service: 'Newborn Care', date: 'Today', time: '3:00 PM', duration: '2 hrs',
    price: '৳4,200', net: '৳3,570', status: 'upcoming', color: '#246BFD',
  },
  {
    customer: 'Riya B.', avatar: 'RB', service: 'Childcare', date: 'Tomorrow', time: '10:00 AM', duration: '5 hrs',
    price: '৳3,500', net: '৳2,975', status: 'upcoming', color: '#246BFD',
  },
]

const COMPLETED = [
  { customer: 'Ahmed F.', avatar: 'AF', service: 'Childcare', date: 'Aug 12', rating: 5, net: '৳1,785' },
  { customer: 'Priya S.', avatar: 'PS', service: 'Babysitting', date: 'Aug 10', rating: 5, net: '৳2,380' },
  { customer: 'Maya L.', avatar: 'ML', service: 'Babysitting', date: 'Aug 8', rating: 4, net: '৳2,380' },
]

export default function Bookings({ navigate }: Props) {
  const [tab, setTab] = useState(0)
  const [showRequest, setShowRequest] = useState(false)
  const [decided, setDecided] = useState<null | 'accepted' | 'declined'>(null)

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '48px 20px 0', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 16 }}>Bookings</div>
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
              {t === 'Requests' && (
                <span style={{
                  marginLeft: 6, padding: '1px 6px', borderRadius: 10,
                  background: tab === 0 ? 'rgba(17,26,58,0.25)' : '#F59E0B',
                  fontSize: 10, fontWeight: 700, color: 'white',
                }}>2</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px', paddingBottom: 96 }} className="scrollbar-hide">
        {tab === 0 && !showRequest && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Request card */}
            <div style={{
              borderRadius: 18, overflow: 'hidden',
              border: '1px solid rgba(245,158,11,0.3)',
              background: 'rgba(245,158,11,0.05)',
            }}>
              <div style={{
                padding: '10px 14px', background: 'rgba(245,158,11,0.12)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', animation: 'pulseDot 1.5s ease-in-out infinite' }}/>
                <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#F59E0B' }}>New Request · Expires in 2h 45m</span>
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(36,107,253,0.2)', border: '1.5px solid rgba(36,107,253,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 800, color: '#246BFD',
                  }}>FM</div>
                  <div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white' }}>Fatima M.</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)' }}>⭐ New customer · Verified</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    ['🗓', REQUEST.date + ' · ' + REQUEST.time],
                    ['⏱', REQUEST.duration + ' · Babysitting'],
                    ['📍', REQUEST.location + ' · ' + REQUEST.distance],
                  ].map(([icon, val]) => (
                    <div key={val} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 14 }}>{icon}</span>
                      <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.65)' }}>{val}</span>
                    </div>
                  ))}
                </div>
                {/* Notes */}
                <div style={{
                  marginTop: 10, padding: '10px 12px', borderRadius: 10,
                  background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
                  fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)', lineHeight: 1.5,
                }}>{REQUEST.notes}</div>
                {/* Earnings breakdown */}
                <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.4)' }}>Gross</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'rgba(17,26,58,0.7)' }}>{REQUEST.gross}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.4)' }}>Platform fee</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#FF6B6B' }}>−{REQUEST.commission}</span>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(17,26,58,0.08)', paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: 'rgba(17,26,58,0.8)' }}>You receive</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: '#10B981' }}>{REQUEST.net}</span>
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => setDecided('declined')} style={{
                    flex: 1, padding: '12px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#FF6B6B',
                  }}>Decline</button>
                  <button onClick={() => setDecided('accepted')} style={{
                    flex: 2, padding: '12px', borderRadius: 12, cursor: 'pointer', border: 'none',
                    background: 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)',
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: 'white',
                    boxShadow: '0 6px 16px rgba(36,107,253,0.4)',
                  }}>Accept Booking</button>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button style={{
                    flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(17,26,58,0.06)', border: '1px solid rgba(17,26,58,0.1)',
                    fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.6)',
                  }}>📅 Suggest Time</button>
                  <button onClick={() => navigate('messages')} style={{
                    flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(17,26,58,0.06)', border: '1px solid rgba(17,26,58,0.1)',
                    fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.6)',
                  }}>💬 Message</button>
                  <button onClick={() => navigate('ai')} style={{
                    flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(36,107,253,0.1)', border: '1px solid rgba(36,107,253,0.25)',
                    fontFamily: 'Inter', fontSize: 12, color: '#246BFD',
                  }}>✨ Ask AI</button>
                </div>
              </div>
            </div>

            {decided && (
              <div style={{
                padding: '14px', borderRadius: 14,
                background: decided === 'accepted' ? 'rgba(16,185,129,0.12)' : 'rgba(255,107,107,0.1)',
                border: `1px solid ${decided === 'accepted' ? 'rgba(16,185,129,0.3)' : 'rgba(255,107,107,0.25)'}`,
                fontFamily: 'Inter', fontSize: 13, color: decided === 'accepted' ? '#10B981' : '#FF6B6B',
                display: 'flex', gap: 8, alignItems: 'center',
              }} className="anim-bounce-in">
                {decided === 'accepted' ? '✓' : '✗'} {decided === 'accepted' ? 'Booking accepted! Fatima has been notified.' : 'Booking declined. Fatima has been notified.'}
              </div>
            )}

            {/* Second request (smaller) */}
            <div style={{
              borderRadius: 16, padding: '14px',
              background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(245,158,11,0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#A855F7' }}>TK</div>
                  <div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white' }}>Tasneem K.</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.4)' }}>Overnight Care · Aug 20</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: '#10B981' }}>৳5,950</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(17,26,58,0.35)' }}>net</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {UPCOMING.map((b, i) => (
              <div key={i} style={{
                padding: '14px', borderRadius: 16,
                background: 'rgba(17,26,58,0.05)', border: '1px solid rgba(36,107,253,0.2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(36,107,253,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#246BFD' }}>{b.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white' }}>{b.customer}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)' }}>{b.service} · {b.date} · {b.time}</div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#10B981' }}>{b.net}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => navigate('messages')} style={{ flex: 1, padding: '9px', borderRadius: 10, cursor: 'pointer', background: 'rgba(17,26,58,0.06)', border: '1px solid rgba(17,26,58,0.1)', fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.6)' }}>💬 Message</button>
                  <button style={{ flex: 1, padding: '9px', borderRadius: 10, cursor: 'pointer', background: 'rgba(17,26,58,0.06)', border: '1px solid rgba(17,26,58,0.1)', fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.6)' }}>📍 Navigate</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {COMPLETED.map((b, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: 16, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#10B981' }}>{b.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white' }}>{b.customer}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.4)' }}>{b.service} · {b.date}</div>
                  <div style={{ marginTop: 4, color: '#F59E0B', fontSize: 12 }}>{'★'.repeat(b.rating)}{'☆'.repeat(5 - b.rating)}</div>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: '#10B981' }}>{b.net}</div>
              </div>
            ))}
          </div>
        )}

        {(tab === 2 || tab === 4) && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{tab === 2 ? '🔄' : '📋'}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: 700, color: 'rgba(17,26,58,0.6)' }}>
              {tab === 2 ? 'No active bookings right now' : 'No cancelled bookings'}
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.3)', marginTop: 8 }}>
              {tab === 2 ? 'Your in-progress bookings will appear here.' : 'Great — keep your cancellation rate low!'}
            </div>
          </div>
        )}
      </div>

      <BottomNav current="bookings" navigate={navigate}/>
    </div>
  )
}
