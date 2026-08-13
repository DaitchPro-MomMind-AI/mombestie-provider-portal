import { useState } from 'react'
import { signIn, signUp } from '../services'

type Mode = 'signin' | 'signup' | 'confirm-email'

/**
 * Real Supabase auth gate -- replaces the old LoginGate, which accepted any
 * input and moved straight to the dashboard. Same signup -> confirm-email ->
 * sign-in flow as mombestie-customer-app's LoginScreen, verified against the
 * real project during that work; reused here rather than reinvented.
 */
export function AuthGate({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<Mode>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setSubmitting(true)
    setError(null)
    if (mode === 'signup') {
      const res = await signUp(email, password, fullName)
      setSubmitting(false)
      if (!res.ok) { setError(res.error ?? 'Something went wrong.'); return }
      if (res.needsEmailConfirmation) { setMode('confirm-email'); return }
      onSignedIn()
      return
    }
    const res = await signIn(email, password)
    setSubmitting(false)
    if (!res.ok) { setError(res.error ?? 'Something went wrong.'); return }
    onSignedIn()
  }

  if (mode === 'confirm-email') {
    return (
      <div className="h-full w-full overflow-y-auto flex items-center justify-center bg-[#FFFCFA] px-4">
        <div className="w-full max-w-sm glass-card-strong rounded-3xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-[#FEF3CD] flex items-center justify-center text-2xl mx-auto mb-4">📧</div>
          <h1 className="font-display text-xl text-[#242424] mb-2">Confirm your email</h1>
          <p className="text-sm text-[#6E6E73] mb-5">We sent a confirmation link to <span className="font-semibold text-[#242424]">{email}</span>. Click it, then come back and sign in.</p>
          <button onClick={() => setMode('signin')} className="action-btn w-full bg-[#F0E8E4] text-[#6E6E73] font-semibold py-3 rounded-2xl">Back to Sign In</button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto flex items-center justify-center bg-[#FFFCFA] px-4">
      <div className="w-full max-w-sm glass-card-strong rounded-3xl p-8">
        <div className="w-12 h-12 rounded-2xl coral-gradient flex items-center justify-center text-white font-display text-xl mb-4">M</div>
        <h1 className="font-display text-2xl text-[#242424] mb-1">Provider Portal</h1>
        <p className="text-sm text-[#6E6E73] mb-6">{mode === 'signup' ? 'Create your provider account.' : 'Sign in to manage your MomBestie services.'}</p>

        {error && (
          <div className="rounded-xl px-3.5 py-2.5 mb-3 text-xs text-[#D9534F]" style={{ background: '#FAECEC', border: '1px solid #ECA0A0' }}>{error}</div>
        )}

        {mode === 'signup' && (
          <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name"
            className="cartoon-input w-full px-4 py-3 text-sm mb-3" />
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"
          className="cartoon-input w-full px-4 py-3 text-sm mb-3" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
          className="cartoon-input w-full px-4 py-3 text-sm mb-5" />

        <button onClick={submit} disabled={submitting || !email.trim() || !password.trim() || (mode === 'signup' && !fullName.trim())}
          className="action-btn w-full coral-gradient text-white font-semibold py-3 rounded-2xl mb-3 disabled:opacity-40">
          {submitting ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>

        <button onClick={() => { setMode(m => m === 'signup' ? 'signin' : 'signup'); setError(null) }}
          className="action-btn w-full text-sm font-semibold text-[#6E6E73] py-2">
          {mode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>

        {mode === 'signin' && (
          <button onClick={() => { setMode('signup'); setError(null) }} className="action-btn w-full bg-[#FFD6C9] text-[#C94930] font-semibold py-3 rounded-2xl mt-3">
            New provider? Create an account →
          </button>
        )}
      </div>
    </div>
  )
}
