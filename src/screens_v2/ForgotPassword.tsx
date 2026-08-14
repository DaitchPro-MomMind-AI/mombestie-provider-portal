import { useState } from 'react'
import type { Screen } from '../App'

// Real Supabase password-reset email, replacing the prototype's fake
// setSent(true)-with-no-actual-call.
interface Props { navigate: (s: Screen) => void; onReset: (email: string) => Promise<string | null> }

export default function ForgotPassword({ navigate, onReset }: Props) {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '52px 20px 0' }}>
        <button onClick={() => navigate('signin')} style={{
          background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
          borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111A3A',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>

      <div style={{ padding: '32px 28px', flex: 1 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'rgba(36,107,253,0.15)', border: '1px solid rgba(36,107,253,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 24,
        }}>🔑</div>

        <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#111A3A', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
          {sent ? 'Check your email' : 'Reset your password'}
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(17,26,58,0.45)', margin: '0 0 32px', lineHeight: 1.55 }}>
          {sent
            ? `We sent a password reset link to ${email || 'your email'}. Check your inbox and follow the instructions.`
            : "Enter the email or phone associated with your MomBestie Provider account and we'll send you a reset link."
          }
        </p>

        {!sent ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'rgba(17,26,58,0.5)', display: 'block', marginBottom: 6 }}>Email or Phone</label>
              <input
                type="text" placeholder="you@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 12,
                  background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.12)',
                  color: '#111A3A', fontFamily: 'Inter', fontSize: 15, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            {error && (
              <div style={{ borderRadius: 12, padding: '10px 14px', marginBottom: 14, background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.25)', color: '#DC3545', fontFamily: 'Inter', fontSize: 12.5 }}>{error}</div>
            )}
            <button onClick={async () => {
              setSubmitting(true); setError(null)
              const err = await onReset(email)
              setSubmitting(false)
              if (err) { setError(err); return }
              setSent(true)
            }} disabled={submitting || !email.trim()} style={{
              width: '100%', padding: '15.5px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)',
              boxShadow: '0 8px 24px rgba(36,107,253,0.4)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: 'white',
              opacity: !email.trim() ? 0.5 : 1,
            }}>{submitting ? 'Sending…' : 'Send Reset Link'}</button>
          </>
        ) : (
          <>
            <div style={{
              padding: '16px', borderRadius: 16,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
              display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20,
            }} className="anim-bounce-in">
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="13" viewBox="0 0 16 13" fill="none"><path d="M1 6l5 5L15 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#10B981' }}>Reset link sent!</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)', marginTop: 3, lineHeight: 1.5 }}>Didn't receive it? Check your spam folder or try a different email.</div>
              </div>
            </div>
            <button onClick={() => setSent(false)} style={{
              width: '100%', padding: '14px', borderRadius: 14, cursor: 'pointer',
              background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.15)',
              fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: 'rgba(17,26,58,0.8)', marginBottom: 12,
            }}>Try a different email</button>
            <button onClick={() => navigate('signin')} style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white',
            }}>Back to Sign In</button>
          </>
        )}

        <div style={{ marginTop: 28, padding: '12px 14px', borderRadius: 12, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)', fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.35)', lineHeight: 1.5 }}>
          🔒 MomBestie will never ask for your password by phone or chat. Keep your account secure.
        </div>
      </div>
    </div>
  )
}
