import type { Screen } from '../App'
import BottomNav from '../components/BottomNav'

interface Props { navigate: (s: Screen) => void }

/**
 * MBPRV-62: honest "no reviews yet" state. Previously this screen showed a
 * fabricated 4.9 rating, "47 reviews", a fake per-star distribution bar,
 * five fake reviewer testimonials, a fake "AI Review Summary", and a fake
 * "AI suggestion" reply generator with a Send button that wrote nothing
 * real. No real `reviews` table exists yet (design tracked in [MBPRV-61]),
 * so there is nothing real to show -- replaced all of it with an honest
 * empty state rather than simulating one.
 */
export default function Reviews({ navigate }: Props) {
  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '48px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <button onClick={() => navigate('more')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            <span style={{ fontFamily: 'Inter', fontSize: 12 }}>More</span>
          </button>
        </div>
        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A', marginBottom: 16 }}>Reviews</div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 32px' }}>
        <div style={{
          borderRadius: 20, padding: '28px 24px', textAlign: 'center',
          background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>⭐</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: '#111A3A', marginBottom: 8 }}>
            No reviews yet
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.5)', lineHeight: 1.55 }}>
            Reviews aren't collected yet -- the real reviews schema is still being designed. No rating, average score, or review will be shown here until it's real.
          </div>
        </div>
      </div>

      <BottomNav current="dashboard" navigate={navigate}/>
    </div>
  )
}
