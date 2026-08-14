import type { Screen } from '../App'

interface Props {
  current: Screen
  navigate: (s: Screen) => void
}

export default function BottomNav({ current, navigate }: Props) {
  const isMain = ['dashboard', 'bookings', 'ai', 'messages', 'settings'].includes(current)

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 76,
      // Rich navy per feedback -- the spec calls for navy as "Premium dark
      // surfaces... Headers" (mom-bestie-provider-spec.md §3), and a
      // fully-white recolor had erased that entirely. Chrome that's
      // visible on every screen (this bar) is the highest-leverage place
      // to bring it back without re-flattening the white content areas
      // the "more white" feedback asked for.
      background: 'linear-gradient(180deg, #151F46 0%, #111A3A 100%)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 4px 10px',
      zIndex: 50,
    }}>
      <NavBtn icon={<HomeIco />} label="Home" active={current === 'dashboard'} onClick={() => navigate('dashboard')} />
      <NavBtn icon={<BookIco />} label="Bookings" active={current === 'bookings'} onClick={() => navigate('bookings')} />

      {/* Center AI button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: -18 }}>
        <button
          onClick={() => navigate('ai')}
          style={{
            width: 54, height: 54, borderRadius: '50%',
            background: current === 'ai'
              ? 'linear-gradient(135deg, #246BFD 0%, #28A8FF 60%, #A855F7 100%)'
              : 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)',
            boxShadow: current === 'ai'
              ? '0 0 24px rgba(36,107,253,0.8), 0 0 48px rgba(168,85,247,0.35)'
              : '0 0 20px rgba(36,107,253,0.55)',
            border: '1.5px solid rgba(17,26,58,0.25)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          className={current === 'ai' ? 'anim-orb-idle' : ''}
        >
          <SparkleIco />
        </button>
        <span style={{ fontSize: 9, fontFamily: 'Inter', fontWeight: 600, color: current === 'ai' ? '#5BAAFF' : 'rgba(255,255,255,0.45)', letterSpacing: 0.2 }}>AI</span>
      </div>

      <NavBtn icon={<ChatIco />} label="Messages" active={current === 'messages'} onClick={() => navigate('messages')} />
      <NavBtn icon={<MoreIco />} label="More" active={current === 'more' || current === 'settings'} onClick={() => navigate('more')} />
    </div>
  )
}

function NavBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      background: 'none', border: 'none', cursor: 'pointer', flex: 1, padding: '6px 0',
    }}>
      <div style={{ color: active ? '#5BAAFF' : 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }}>
        {icon}
      </div>
      <span style={{
        fontSize: 9, fontFamily: 'Inter', fontWeight: active ? 600 : 400,
        color: active ? '#5BAAFF' : 'rgba(255,255,255,0.45)',
        letterSpacing: 0.2, transition: 'color 0.2s',
      }}>{label}</span>
    </button>
  )
}

function HomeIco() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.55 2.53a2 2 0 012.9 0l7 6.73A2 2 0 0121 10.67V19a2 2 0 01-2 2h-4v-5h-6v5H5a2 2 0 01-2-2v-8.33a2 2 0 01.55-1.41l7-6.73z"/>
    </svg>
  )
}
function BookIco() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <line x1="8" y1="8" x2="16" y2="8"/>
      <line x1="8" y1="12" x2="14" y2="12"/>
      <line x1="8" y1="16" x2="11" y2="16"/>
      <circle cx="17" cy="16" r="2.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}
function ChatIco() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  )
}
function MoreIco() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
    </svg>
  )
}
function SparkleIco() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M12 2L13.7 8.3L20 10L13.7 11.7L12 18L10.3 11.7L4 10L10.3 8.3L12 2Z"/>
      <path d="M19 15L19.8 17.2L22 18L19.8 18.8L19 21L18.2 18.8L16 18L18.2 17.2L19 15Z" opacity="0.75"/>
      <path d="M5 3L5.7 5.3L8 6L5.7 6.7L5 9L4.3 6.7L2 6L4.3 5.3L5 3Z" opacity="0.75"/>
    </svg>
  )
}
