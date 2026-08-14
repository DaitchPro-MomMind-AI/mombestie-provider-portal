import { useState } from 'react'
import type { Screen } from '../App'

// Real Supabase sign-in, replacing the prototype's fake navigate('otp').
// onSignIn returns an error string on failure, or null on success (the
// parent then does its own real routing via routeAfterAuth).
interface Props { navigate: (s: Screen) => void; onSignIn: (email: string, password: string) => Promise<string | null> }

export default function SignIn({ navigate, onSignIn }: Props) {
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [remember, setRemember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setSubmitting(true); setError(null)
    const err = await onSignIn(email, pass)
    setSubmitting(false)
    if (err) setError(err)
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 12,
    background: 'rgba(17,26,58,0.05)', border: '1px solid rgba(17,26,58,0.12)',
    color: '#111A3A', fontFamily: 'Inter, sans-serif', fontSize: 15,
    outline: 'none', boxSizing: 'border-box' as const,
  }

  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      overflowY: 'auto', display: 'flex', flexDirection: 'column',
    }} className="scrollbar-hide">

      {/* Top nav */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '52px 20px 0' }}>
        <button onClick={() => navigate('welcome')} style={{
          background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
          borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111A3A',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        {/* Orb + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 45%, #7C3AED 100%)',
            boxShadow: '0 0 18px rgba(36,107,253,0.55)',
            flexShrink: 0,
          }} className="anim-orb-idle"/>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fontWeight: 600, color: '#246BFD', letterSpacing: 2.5, textTransform: 'uppercase' }}>MomBestie</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(17,26,58,0.5)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Provider</div>
          </div>
        </div>

        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 26, fontWeight: 800, color: '#111A3A', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
          Welcome Back
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 28px', lineHeight: 1.5 }}>
          Your customers, bookings, earnings and AI assistant are waiting.
        </p>

        {error && (
          <div style={{ borderRadius: 12, padding: '10px 14px', marginBottom: 14, background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.25)', color: '#DC3545', fontFamily: 'Inter', fontSize: 12.5 }}>{error}</div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'rgba(17,26,58,0.55)', letterSpacing: 0.4, display: 'block', marginBottom: 6 }}>Email or Phone</label>
            <input
              type="text" placeholder="you@email.com" value={email}
              onChange={e => setEmail(e.target.value)} style={inputStyle}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'rgba(17,26,58,0.55)', letterSpacing: 0.4 }}>Password</label>
              <button onClick={() => navigate('forgotpassword')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, color: '#246BFD', fontWeight: 500 }}>Forgot Password?</button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} placeholder="••••••••" value={pass}
                onChange={e => setPass(e.target.value)} style={{ ...inputStyle, paddingRight: 44 }}
              />
              <button onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)',
              }}>
                {showPass
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Remember -- UI-only for now; real "sign out on tab close" wiring
              (as in the previous AuthGate.tsx) is a follow-up, not yet
              reconnected in this redesign pass. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              onClick={() => setRemember(!remember)}
              style={{
                width: 20, height: 20, borderRadius: 6,
                background: remember ? '#246BFD' : 'rgba(17,26,58,0.08)',
                border: remember ? '1.5px solid #246BFD' : '1.5px solid rgba(17,26,58,0.2)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {remember && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.5)' }}>Remember me</span>
          </div>

          <button onClick={submit} disabled={submitting || !email.trim() || !pass.trim()} style={{
            width: '100%', padding: '15.5px', borderRadius: 14, border: 'none', cursor: submitting ? 'default' : 'pointer',
            background: 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)',
            boxShadow: '0 8px 24px rgba(36,107,253,0.4)',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 700, color: 'white',
            marginTop: 4, opacity: (!email.trim() || !pass.trim()) ? 0.5 : 1,
          }}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(17,26,58,0.1)' }}/>
          <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.3)' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(17,26,58,0.1)' }}/>
        </div>

        {/* Social auth */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Google', icon: '🔵' },
            { label: 'Apple', icon: '⬛' },
          ].map(s => (
            <button key={s.label} style={{
              flex: 1, padding: '13px', borderRadius: 12, cursor: 'pointer',
              background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.12)',
              fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500, color: 'rgba(17,26,58,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 32 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.4)' }}>New to MomBestie? </span>
          <button onClick={() => navigate('signup')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#246BFD' }}>
            Become a Provider
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 18 }}>
            {['Privacy', 'Terms', 'Help'].map(l => (
              <span key={l} style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.25)', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
