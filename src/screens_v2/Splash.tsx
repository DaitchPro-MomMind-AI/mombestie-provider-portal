import { useEffect, useState } from 'react'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

export default function Splash({ navigate }: Props) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t0 = setTimeout(() => setPhase(1), 300)
    const t1 = setTimeout(() => setPhase(2), 900)
    const t2 = setTimeout(() => setPhase(3), 1600)
    const t3 = setTimeout(() => navigate('welcome'), 3400)
    return () => [t0, t1, t2, t3].forEach(clearTimeout)
  }, [navigate])

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 36,
      background: 'linear-gradient(180deg, #F7F9FF 0%, #F7F9FF 40%, #EAF2FF 70%, #F7F9FF 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow layers */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(36,107,253,0.18) 0%, transparent 65%)',
        top: '10%', left: '50%', transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 65%)',
        bottom: '15%', left: '50%', transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }}/>

      {/* AI Orb */}
      <div style={{
        position: 'relative',
        opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.7s ease',
      }}>
        {/* Pulse rings */}
        {phase >= 2 && [0, 1].map(i => (
          <div key={i} style={{
            position: 'absolute', inset: -20,
            borderRadius: '50%', border: '1px solid rgba(36,107,253,0.35)',
            animation: `ringPulse 2.5s ease-out infinite ${i * 1.25}s`,
          }}/>
        ))}

        {/* Core orb */}
        <div style={{
          width: 110, height: 110, borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 35%, #7C3AED 70%, #EAF2FF 100%)',
          position: 'relative', zIndex: 1,
        }} className="anim-orb-idle"/>
      </div>

      {/* Brand */}
      <div style={{
        textAlign: 'center',
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? 'translateY(0)' : 'translateY(18px)',
        transition: 'all 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)',
      }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 32, fontWeight: 800,
          color: '#111A3A', letterSpacing: '-0.8px', lineHeight: 1,
        }}>MomBestie</div>
        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fontWeight: 600,
          color: '#246BFD', letterSpacing: 4, textTransform: 'uppercase', marginTop: 5,
        }}>PROVIDER</div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 13.5,
          color: 'rgba(17,26,58,0.42)', marginTop: 14, letterSpacing: 0.2,
        }}>Grow your business. Help families.</div>
      </div>

      {/* Loading dots */}
      {phase >= 3 && (
        <div style={{ display: 'flex', gap: 7, marginTop: 4 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%', background: '#246BFD',
              animation: `pulseDot 1.1s ease-in-out infinite ${i * 0.22}s`,
            }}/>
          ))}
        </div>
      )}

      {/* Skip */}
      <button
        onClick={() => navigate('welcome')}
        style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(17,26,58,0.28)', fontSize: 12, fontFamily: 'Inter',
          opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.4s',
        }}
      >
        tap to skip
      </button>
    </div>
  )
}
