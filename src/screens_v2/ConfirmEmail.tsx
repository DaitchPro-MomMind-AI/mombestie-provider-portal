import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void; email: string }

/**
 * Real-flow replacement for the prototype's OTPVerify.tsx. Supabase's
 * actual email/password sign-up flow confirms via a clicked link, not a
 * typed 6-digit code -- routing a real signup into OTPVerify's
 * interactive digit-entry UI would fake a verification step that isn't
 * how the real backend works. This screen tells the truth instead:
 * check your email, click the link, come back and sign in.
 */
export default function ConfirmEmail({ navigate, email }: Props) {
  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '32px 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'rgba(36,107,253,0.15)', border: '1px solid rgba(36,107,253,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 24,
        }}>📧</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#111A3A', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
          Confirm your email
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(17,26,58,0.5)', margin: '0 0 32px', lineHeight: 1.55 }}>
          We sent a confirmation link to <strong style={{ color: '#111A3A' }}>{email}</strong>. Click it, then come back and sign in.
        </p>
        <button onClick={() => navigate('signin')} style={{
          width: '100%', padding: '15.5px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)',
          boxShadow: '0 8px 24px rgba(36,107,253,0.4)',
          fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: 'white',
        }}>Back to Sign In</button>
      </div>
    </div>
  )
}
