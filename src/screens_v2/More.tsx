import type { Screen } from '../App'
import BottomNav from '../components/BottomNav'

// onSignOut real -- added directly here per feedback: Sign Out itself was
// never broken (verified live: it does clear the real session), but it
// was buried two taps deep (More -> Settings -> scroll to the very
// bottom of a long list), which is a genuine discoverability problem.
// Now reachable from the first screen you land on when you tap More.
interface Props { navigate: (s: Screen) => void; onSignOut: () => void }

const FEATURES = [
  { icon: '👤', label: 'My Profile', sub: 'Edit & preview', screen: 'profile', color: '#246BFD' },
  { icon: '📅', label: 'Calendar', sub: 'Manage availability', screen: 'calendar', color: '#28A8FF' },
  { icon: '💰', label: 'Earnings', sub: '৳4,850 available', screen: 'earnings', color: '#10B981' },
  { icon: '⭐', label: 'Reviews', sub: '4.9 · 47 reviews', screen: 'reviews', color: '#F59E0B' },
  { icon: '🔔', label: 'Notifications', sub: '5 unread', screen: 'notifications', color: '#A855F7' },
  { icon: '✨', label: 'AI Pricing', sub: 'Smart recommendations', screen: 'smartpricing', color: '#246BFD' },
  { icon: '📊', label: 'Market Insights', sub: 'Local demand data', screen: 'marketinsights', color: '#28A8FF' },
  { icon: '⚕️', label: 'Healthcare Mode', sub: 'Switch to clinical', screen: 'healthcare', color: '#FF6B6B' },
  { icon: '🛡', label: 'Support & Safety', sub: 'Help, report, block', screen: 'support', color: '#F59E0B' },
  { icon: '⚙️', label: 'Settings', sub: 'Account & preferences', screen: 'settings', color: 'rgba(17,26,58,0.5)' },
]

export default function More({ navigate, onSignOut }: Props) {
  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">

        {/* Header */}
        <div style={{
          padding: '48px 20px 20px',
          background: 'linear-gradient(180deg, #F7F9FF 0%, #FFFFFF 100%)',
        }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A' }}>More</div>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.4)', marginTop: 4 }}>Tools, insights and account management</div>
        </div>

        {/* Provider status card */}
        <div style={{ padding: '0 16px 20px' }}>
          <div style={{
            borderRadius: 20, padding: '16px 18px',
            background: 'linear-gradient(135deg, rgba(36,107,253,0.18) 0%, rgba(168,85,247,0.08) 100%)',
            border: '1px solid rgba(36,107,253,0.28)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: 800, color: 'white',
                border: '2px solid rgba(36,107,253,0.5)',
              }}>AR</div>
              <div style={{
                position: 'absolute', bottom: 1, right: 1,
                width: 14, height: 14, borderRadius: '50%',
                background: '#10B981', border: '2px solid #FFFFFF',
              }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 800, color: '#111A3A' }}>Ayesha Rahman</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.5)', marginTop: 2 }}>Babysitter · Dhaka 🇧🇩 · BDT ৳</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 7 }}>
                <div style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, color: '#10B981' }}>✓ Verified</div>
                <div style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, color: '#F59E0B' }}>⭐ 4.9</div>
                <div style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(36,107,253,0.12)', border: '1px solid rgba(36,107,253,0.25)', fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, color: '#246BFD' }}>47 Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {FEATURES.map(f => (
            <button
              key={f.label}
              onClick={() => navigate(f.screen as Screen)}
              style={{
                padding: '16px 14px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
                background: 'rgba(17,26,58,0.04)',
                border: '1px solid rgba(17,26,58,0.08)',
                transition: 'all 0.18s',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, marginBottom: 10,
                background: `${f.color}18`, border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{f.icon}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#111A3A', marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.38)', lineHeight: 1.3 }}>{f.sub}</div>
            </button>
          ))}
        </div>

        {/* Availability toggle */}
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{
            padding: '14px 16px', borderRadius: 16,
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981', flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#111A3A' }}>You're Available</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>Visible in the MomBestie marketplace</div>
            </div>
            <div style={{
              width: 48, height: 28, borderRadius: 14, background: '#10B981', position: 'relative', cursor: 'pointer',
            }}>
              <div style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'white' }}/>
            </div>
          </div>
        </div>

        {/* MomBestie AI quick access */}
        <div style={{ padding: '8px 16px 24px' }}>
          <button onClick={() => navigate('ai')} style={{
            width: '100%', padding: '14px 16px', borderRadius: 16, cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(36,107,253,0.2) 0%, rgba(168,85,247,0.1) 100%)',
            border: '1px solid rgba(36,107,253,0.3)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 45%, #7C3AED 100%)',
              boxShadow: '0 0 14px rgba(36,107,253,0.6)',
              flexShrink: 0,
            }} className="anim-orb-idle"/>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#111A3A' }}>Ask MomBestie AI</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)', marginTop: 2 }}>What's my recommended price? How do I grow faster?</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Sign Out -- real, right here, not buried in Settings */}
        <div style={{ padding: '0 16px 24px' }}>
          <button onClick={onSignOut} style={{
            width: '100%', padding: '14px 16px', borderRadius: 16, cursor: 'pointer',
            background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>🚪</span>
            <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#FF6B6B' }}>Sign Out</span>
          </button>
        </div>
      </div>

      <BottomNav current="more" navigate={navigate}/>
    </div>
  )
}
