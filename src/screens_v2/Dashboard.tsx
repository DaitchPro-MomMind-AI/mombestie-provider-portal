import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

// providerProfile real (see App.tsx routeAfterAuth) -- replaces the
// prototype's hardcoded "Ayesha Rahman / AR". METRICS/TIMELINE below are
// still prototype fixture numbers, not yet wired to real bookings data;
// flagged rather than silently left in, see docs/PROJECT_REPORT.md.
interface Props { navigate: (s: Screen) => void; providerProfile: { name: string; city: string | null; verified: boolean } | null }

const METRICS = [
  { label: "Today's Bookings", value: '3', icon: '📅', color: '#246BFD', bg: 'rgba(36,107,253,0.15)', screen: 'bookings' },
  { label: 'New Requests', value: '2', icon: '🔔', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', screen: 'bookings' },
  { label: 'Messages', value: '2', icon: '💬', color: '#28A8FF', bg: 'rgba(40,168,255,0.12)', screen: 'messages' },
  { label: 'Balance', value: '৳4,850', icon: '💰', color: '#10B981', bg: 'rgba(16,185,129,0.12)', screen: 'earnings' },
  { label: 'Rating', value: '4.9★', icon: '⭐', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', screen: 'reviews' },
  { label: 'Profile Views', value: '48', icon: '👁', color: '#A855F7', bg: 'rgba(168,85,247,0.12)', screen: 'profile' },
]

const TIMELINE = [
  {
    time: '9:00 AM', customer: 'Sarah K.', service: 'Babysitting',
    duration: '4 hrs', price: '৳2,800', net: '৳2,380', status: 'upcoming', color: '#246BFD',
    avatar: 'SK',
  },
  {
    time: '12:30 PM', customer: 'Ahmed F.', service: 'Childcare',
    duration: '3 hrs', price: '৳2,100', net: '৳1,785', status: 'in-progress', color: '#10B981',
    avatar: 'AF',
  },
  {
    time: '3:00 PM', customer: 'Nadia H.', service: 'Newborn Care',
    duration: '2 hrs', price: '৳4,200', net: '৳3,570', status: 'upcoming', color: '#246BFD',
    avatar: 'NH',
  },
]

export default function Dashboard({ navigate, providerProfile }: Props) {
  const [aiThinking, setAiThinking] = useState(false)
  const initials = (providerProfile?.name ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const firstName = providerProfile?.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">

        {/* Header */}
        <div style={{
          padding: '48px 20px 20px',
          background: 'linear-gradient(180deg, #F7F9FF 0%, #FFFFFF 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 800, color: 'white',
                  border: '2px solid rgba(36,107,253,0.5)',
                }}>{initials}</div>
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 14, height: 14, borderRadius: '50%',
                  background: '#10B981', border: '2px solid #FFFFFF',
                }}/>
              </div>
              <div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)' }}>{greeting},</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 17, fontWeight: 800, color: '#111A3A' }}>
                  {firstName} 👋
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Verified badge -- real, from providerProfile.status */}
              {providerProfile?.verified && (
                <div style={{
                  padding: '4px 10px', borderRadius: 20,
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                  fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: '#10B981',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#10B981"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  Verified
                </div>
              )}
              {/* Notifications */}
              <button onClick={() => navigate('notifications')} style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', border: '1.5px solid #FFFFFF' }}/>
              </button>
            </div>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.35)" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.35)' }}>{providerProfile?.city ?? 'No location set yet'}</span>
          </div>
        </div>

        {/* AI Morning Brief */}
        <div style={{ padding: '0 16px 16px' }}>
          {/* Rich navy per feedback -- "AI surfaces" is one of the spec's
              explicit navy use-cases (§3), and the light-tint version this
              became after the mechanical recolor lost that entirely. */}
          <div style={{
            borderRadius: 20, padding: '18px 18px',
            background: 'linear-gradient(135deg, #151F46 0%, #1B2550 55%, #2A1F5C 100%)',
            border: '1px solid rgba(91,170,255,0.3)',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(17,26,58,0.25)',
          }}>
            {/* Glow bg */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)' }}/>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              {/* Orb */}
              <div style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 45%, #7C3AED 100%)',
                boxShadow: '0 0 14px rgba(36,107,253,0.7)',
              }} className="anim-orb-idle"/>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: '#5BAAFF', letterSpacing: 0.5 }}>MOMBESTIE AI</span>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#10B981',
                    animation: 'pulseDot 2s ease-in-out infinite',
                  }}/>
                </div>
                <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.55 }}>
                  "You have <strong style={{ color: '#5BAAFF' }}>3 bookings</strong> today, <strong style={{ color: '#5BAAFF' }}>2 unread messages</strong> and <strong style={{ color: '#4ADE80' }}>৳4,850</strong> available for payout."
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, position: 'relative', zIndex: 1 }}>
              <button onClick={() => navigate('ai')} style={{
                flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
                background: 'rgba(36,107,253,0.45)', border: '1px solid rgba(91,170,255,0.5)',
                fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'white',
              }}>✨ Ask AI</button>
              <button style={{
                flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)',
              }}>View My Day</button>
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 10 }}>At a Glance</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {METRICS.map(m => (
              <div key={m.label} onClick={() => navigate(m.screen as any)} style={{
                padding: '14px 10px', borderRadius: 16, textAlign: 'center',
                background: 'rgba(17,26,58,0.05)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(17,26,58,0.08)', cursor: 'pointer',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: m.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, margin: '0 auto 8px',
                }}>{m.icon}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 9.5, color: 'rgba(17,26,58,0.38)', marginTop: 3, lineHeight: 1.3 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {[
              { label: 'New Booking', icon: '➕', screen: 'bookings', color: '#246BFD' },
              { label: 'AI Pricing', icon: '✨', screen: 'smartpricing', color: '#A855F7' },
              { label: 'Market Data', icon: '📊', screen: 'marketinsights', color: '#28A8FF' },
            ].map(qa => (
              <button key={qa.label} onClick={() => navigate(qa.screen as any)} style={{
                flex: 1, padding: '10px 6px', borderRadius: 14, cursor: 'pointer',
                background: `${qa.color}12`, border: `1px solid ${qa.color}25`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 18 }}>{qa.icon}</span>
                <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, color: qa.color }}>{qa.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Timeline */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)' }}>Today's Timeline</div>
            <button onClick={() => navigate('bookings')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, color: '#246BFD' }}>View all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, padding: '14px 14px', borderRadius: 16,
                background: 'rgba(17,26,58,0.05)',
                border: t.status === 'in-progress' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(17,26,58,0.08)',
              }}>
                {/* Avatar */}
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: `${t.color}20`, border: `1.5px solid ${t.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: t.color,
                }}>{t.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#111A3A' }}>{t.customer}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.5)', marginTop: 2 }}>{t.service} · {t.duration}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#10B981' }}>{t.net}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(17,26,58,0.35)', marginTop: 2 }}>net</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '3px 9px', borderRadius: 20,
                      background: t.status === 'in-progress' ? 'rgba(16,185,129,0.15)' : 'rgba(36,107,253,0.12)',
                      border: `1px solid ${t.status === 'in-progress' ? 'rgba(16,185,129,0.3)' : 'rgba(36,107,253,0.25)'}` as string,
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: t.status === 'in-progress' ? '#10B981' : '#246BFD' }}/>
                      <span style={{ fontFamily: 'Inter', fontSize: 10.5, fontWeight: 500, color: t.status === 'in-progress' ? '#10B981' : '#246BFD' }}>
                        {t.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(17,26,58,0.4)' }}>{t.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Market Insight */}
        <div style={{ padding: '0 16px 20px' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 10 }}>AI Market Insights</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '📈', title: 'Demand Rising', desc: 'Weekend childcare demand is increasing in Dhaka.', color: '#10B981' },
              { icon: '💡', title: 'Pricing Insight', desc: 'Your current rate of ৳700/hr is within the local competitive range.', color: '#246BFD' },
              { icon: '📸', title: 'Profile Opportunity', desc: "Your profile is missing recent service photos.", color: '#F59E0B' },
            ].map(ins => (
              <div key={ins.title} style={{
                display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 14,
                background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${ins.color}15`, border: `1px solid ${ins.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>{ins.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#111A3A' }}>{ins.title}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)', lineHeight: 1.4, marginTop: 3 }}>{ins.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav current="dashboard" navigate={navigate}/>
    </div>
  )
}
