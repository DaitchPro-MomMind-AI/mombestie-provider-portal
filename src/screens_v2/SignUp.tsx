import { useState } from 'react'
import type { Screen } from '../App'

// Real Supabase sign-up, replacing the prototype's fully uncontrolled
// inputs (no value/onChange at all) and its fake navigate('otp'). Returns
// an error string on failure, or null + whether email confirmation is
// needed on success.
interface Props { navigate: (s: Screen) => void; onSignUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; needsEmailConfirmation: boolean }> }

export default function SignUp({ navigate, onSignUp }: Props) {
  const [agreed, setAgreed] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = firstName.trim() && lastName.trim() && email.trim() && pass.length >= 6 && pass === confirmPass && agreed

  const submit = async () => {
    if (!canSubmit) return
    setSubmitting(true); setError(null)
    const res = await onSignUp(email, pass, `${firstName.trim()} ${lastName.trim()}`)
    setSubmitting(false)
    if (res.error) { setError(res.error); return }
    navigate(res.needsEmailConfirmation ? 'otp' : 'providertype')
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 12,
    background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.12)',
    color: '#111A3A', fontFamily: 'Inter, sans-serif', fontSize: 14.5,
    outline: 'none', boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600,
    color: 'rgba(17,26,58,0.5)', letterSpacing: 0.4,
    display: 'block', marginBottom: 5,
  }

  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      overflowY: 'auto',
    }} className="scrollbar-hide">
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '52px 20px 0' }}>
        <button onClick={() => navigate('welcome')} style={{
          background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
          borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111A3A',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>

      <div style={{ padding: '24px 24px 40px' }}>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
          Build your business<br/>with MomBestie
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.4)', margin: '0 0 24px' }}>
          Join thousands of providers growing with AI.
        </p>

        {error && (
          <div style={{ borderRadius: 12, padding: '10px 14px', marginBottom: 14, background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.25)', color: '#DC3545', fontFamily: 'Inter', fontSize: 12.5 }}>{error}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>First Name</label>
              <input type="text" placeholder="Ayesha" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle}/>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Last Name</label>
              <input type="text" placeholder="Rahman" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle}/>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" placeholder="ayesha@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={pass} onChange={e => setPass(e.target.value)} style={{ ...inputStyle, paddingRight: 44 }}/>
              <button onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" placeholder="••••••••" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} style={inputStyle}/>
          </div>

          {/* Country suggestion removed -- it claimed "Detected location:
              Bangladesh" with no real geo-detection behind it. Country is
              asked for real, honestly, in the provider-type/onboarding
              wizard right after sign-up (see App.tsx routing). */}

          {/* Terms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {['I agree to the Provider Terms of Service', 'I agree to the Privacy Policy'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  onClick={() => i === 0 && setAgreed(!agreed)}
                  style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    background: agreed && i === 0 ? '#246BFD' : 'rgba(17,26,58,0.08)',
                    border: '1.5px solid rgba(17,26,58,0.2)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {agreed && i === 0 && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)', lineHeight: 1.4 }}>
                  {t} <span style={{ color: '#246BFD' }}>↗</span>
                </span>
              </div>
            ))}
          </div>

          <button onClick={submit} disabled={submitting || !canSubmit} style={{
            width: '100%', padding: '15.5px', borderRadius: 14, border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
            background: 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)',
            boxShadow: '0 8px 24px rgba(36,107,253,0.4)',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15.5, fontWeight: 700, color: 'white',
            marginTop: 6, opacity: canSubmit ? 1 : 0.5,
          }}>
            {submitting ? 'Creating account…' : 'Create My Provider Account'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.4)' }}>Already have an account? </span>
            <button onClick={() => navigate('signin')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#246BFD' }}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
