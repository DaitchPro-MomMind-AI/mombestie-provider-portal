import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

const FEATURES = [
  {
    icon: '🔗',
    title: 'Find Customers',
    desc: 'Connect with families looking for your services in your local marketplace.',
    color: '#246BFD',
  },
  {
    icon: '📊',
    title: 'Manage Your Business',
    desc: 'Bookings, schedules, payments and messages — all in one professional hub.',
    color: '#10B981',
  },
  {
    icon: '💳',
    title: 'Get Paid',
    desc: 'Track earnings and receive payouts using local payment methods in your country.',
    color: '#F59E0B',
  },
  {
    icon: '✨',
    title: 'AI-Powered',
    desc: 'Your personal AI business assistant helps you price, respond and grow every day.',
    color: '#A855F7',
  },
  {
    icon: '🌍',
    title: 'Global Marketplace',
    desc: 'Serve your local market while running on a trusted worldwide platform.',
    color: '#28A8FF',
  },
]

export default function Welcome({ navigate }: Props) {
  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      overflowY: 'auto', display: 'flex', flexDirection: 'column',
    }} className="scrollbar-hide">

      {/* Hero -- rich navy per feedback ("add more dark rich navy blue").
          Spec (mom-bestie-provider-spec.md §3) calls navy out explicitly
          for headers/premium surfaces; the mechanical "more white" pass
          had flattened this along with everything else. Kept scoped to
          the hero band -- the rest of the page (feature cards, CTAs)
          stays white, per the same feedback's "keep it mostly white." */}
      <div style={{
        padding: '60px 28px 32px',
        background: 'linear-gradient(160deg, #0D1432 0%, #151F46 55%, #1B2550 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(36,107,253,0.35) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        {/* Orb small */}
        <div style={{
          position: 'absolute', top: 14, right: 24,
          width: 42, height: 42, borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 45%, #7C3AED 100%)',
          boxShadow: '0 0 20px rgba(36,107,253,0.6)',
        }} className="anim-orb-idle"/>

        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 600,
          color: '#5BAAFF', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 14, position: 'relative',
        }}>MomBestie Provider</div>

        <h1 style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 30, fontWeight: 800,
          color: 'white', lineHeight: 1.2, letterSpacing: '-0.5px', margin: 0, position: 'relative',
        }}>
          Turn your skills<br/>into opportunity.
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 14.5, color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.6, marginTop: 12, marginBottom: 0, position: 'relative',
        }}>
          Connect with families, manage your services, grow your reputation and run your business with the help of MomBestie AI.
        </p>
      </div>

      {/* Feature Cards */}
      <div style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FEATURES.map((f) => (
          <div key={f.title} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px',
            background: 'rgba(17,26,58,0.05)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(17,26,58,0.09)',
            borderRadius: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: `${f.color}18`, border: `1px solid ${f.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>{f.icon}</div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700, color: '#111A3A' }}>{f.title}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, color: 'rgba(17,26,58,0.48)', lineHeight: 1.5, marginTop: 3 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats strip */}
      <div style={{
        margin: '16px 20px 0',
        padding: '14px 20px',
        background: 'rgba(36,107,253,0.12)',
        border: '1px solid rgba(36,107,253,0.25)',
        borderRadius: 16,
        display: 'flex', justifyContent: 'space-around',
      }}>
        {[['150+', 'Countries'], ['50K+', 'Providers'], ['AI', 'Powered']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 800, color: '#246BFD' }}>{v}</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(17,26,58,0.45)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => navigate('signup')} style={{
          width: '100%', padding: '16px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)',
          boxShadow: '0 8px 28px rgba(36,107,253,0.45)',
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 700, color: 'white',
          letterSpacing: 0.2,
        }}>
          Become a Provider
        </button>
        <button onClick={() => navigate('signin')} style={{
          width: '100%', padding: '15px', borderRadius: 14, cursor: 'pointer',
          background: 'rgba(17,26,58,0.07)',
          border: '1px solid rgba(17,26,58,0.15)',
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15.5, fontWeight: 600, color: 'rgba(17,26,58,0.85)',
        }}>
          Sign In
        </button>
        <button onClick={() => navigate('dashboard')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(17,26,58,0.35)',
          marginTop: 4,
        }}>
          Learn how MomBestie works ↗
        </button>
      </div>
    </div>
  )
}
