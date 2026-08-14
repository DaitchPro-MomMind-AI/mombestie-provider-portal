import { useState, useRef, useEffect } from 'react'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

export default function OTPVerify({ navigate }: Props) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(59)
  const [verified, setVerified] = useState(false)
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null))

  useEffect(() => {
    if (timer === 0) return
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  const handleChange = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 5) refs[i + 1].current?.focus()
    if (next.every(d => d !== '') && next.join('').length === 6) {
      setVerified(true)
      setTimeout(() => navigate('country'), 900)
    }
  }

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus()
  }

  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '52px 20px 0' }}>
        <button onClick={() => navigate('signup')} style={{
          background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
          borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111A3A',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>

      <div style={{ padding: '32px 28px', flex: 1 }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'rgba(36,107,253,0.15)', border: '1px solid rgba(36,107,253,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, marginBottom: 24,
        }}>📱</div>

        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 26, fontWeight: 800, color: '#111A3A', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
          Verify your account
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(17,26,58,0.45)', margin: '0 0 36px', lineHeight: 1.55 }}>
          We sent a 6-digit code to<br/>
          <strong style={{ color: 'rgba(17,26,58,0.8)' }}>ayesha@email.com</strong>
        </p>

        {/* OTP boxes */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          {digits.map((d, i) => (
            <input
              key={i} ref={refs[i]} maxLength={1} value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              style={{
                flex: 1, height: 60, borderRadius: 14, textAlign: 'center',
                background: d ? 'rgba(36,107,253,0.2)' : 'rgba(17,26,58,0.07)',
                border: d ? '2px solid #246BFD' : '1.5px solid rgba(17,26,58,0.12)',
                color: '#111A3A', fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 24, fontWeight: 700, outline: 'none',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>

        {/* Verified state */}
        {verified && (
          <div style={{
            padding: '14px 20px', borderRadius: 14,
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
          }} className="anim-bounce-in">
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="13" viewBox="0 0 16 13" fill="none"><path d="M1 6l5 5L15 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#10B981' }}>Verified!</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.5)' }}>Redirecting to country setup...</div>
            </div>
          </div>
        )}

        <button onClick={() => navigate('country')} style={{
          width: '100%', padding: '15.5px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)',
          boxShadow: '0 8px 24px rgba(36,107,253,0.4)',
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 700, color: 'white',
          marginBottom: 20,
        }}>
          Verify Account
        </button>

        <div style={{ textAlign: 'center' }}>
          {timer > 0
            ? <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.4)' }}>
                Resend code in <span style={{ color: '#246BFD', fontWeight: 600 }}>0:{timer.toString().padStart(2, '0')}</span>
              </span>
            : <button onClick={() => setTimer(59)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#246BFD' }}>
                Resend Code
              </button>
          }
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.35)' }}>
            Change email or phone
          </button>
        </div>

        {/* Security note */}
        <div style={{
          marginTop: 28, padding: '12px 14px', borderRadius: 12,
          background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.35)', margin: 0, lineHeight: 1.5 }}>
            MomBestie will never ask for your code by phone or message. Keep it private.
          </p>
        </div>
      </div>
    </div>
  )
}
