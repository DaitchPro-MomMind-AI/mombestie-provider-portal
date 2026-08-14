import { useState } from 'react'
import { signIn, signUp, requestPasswordReset, supabase } from '../services'

type Mode = 'signin' | 'signup' | 'confirm-email' | 'forgot'

const FEATURES = [
  { icon: '📋', label: 'Bookings', bg: '#FFD6C9', fg: '#C94930' },
  { icon: '💰', label: 'Earnings', bg: '#E4D8FA', fg: '#7C5CBF' },
  { icon: '📈', label: 'Grow', bg: '#D3EFE0', fg: '#2E8358' },
]

// Same decorative-only pattern as mombestie-customer-app's LoginScreen.tsx
// social row -- no onClick, no OAuth wired. Kept honest rather than faking
// a working Google/Apple sign-in; see chat for the real-OAuth follow-up.
const SOCIAL = [
  { label: 'Google', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" /><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" /><path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" /><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" /></svg> },
  { label: 'Apple', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14.5 9.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7C5.8 4.8 4 6 3 7.8c-2 3.4-.5 8.5 1.4 11.2.9 1.4 2 2.9 3.5 2.8 1.4-.1 1.9-.9 3.6-.9 1.7 0 2.1.9 3.6.8 1.5 0 2.5-1.4 3.4-2.7.5-.8.9-1.6 1.1-2.4-2.8-1-4.7-3.8-4.1-7z" fill="#242424" /><path d="M12.4 3c.8-1 1.3-2.3 1.1-3.7-1.1.1-2.4.8-3.2 1.7-.7.8-1.3 2.1-1.1 3.4 1.2.1 2.4-.6 3.2-1.4z" fill="#242424" /></svg> },
  { label: 'Facebook', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#1877F2" /><path d="M11.8 9H10v6H7.5V9H6V6.9h1.5V5.6c0-1.8.8-2.6 2.5-2.6H11.5v2.1H10.5c-.6 0-.5.3-.5.7V6.9h2l-.2 2.1z" fill="white" /></svg> },
]

const TRUST = [
  { icon: '🛡️', label: 'Your data is safe' },
  { icon: '🔒', label: 'Private & secure' },
  { icon: '🤝', label: 'Trusted by providers' },
]

/**
 * Real Supabase auth gate -- replaces the old LoginGate, which accepted any
 * input and moved straight to the dashboard. Same signup -> confirm-email ->
 * sign-in flow as mombestie-customer-app's LoginScreen, verified against the
 * real project during that work; reused here rather than reinvented.
 *
 * Visual redesign 2026-08-13, iterated twice: first pass matched a
 * branded reference screenshot; second pass (this one) went bigger,
 * more colorful, and added a real glass/parallax effect per direct
 * feedback -- drifting color blobs behind a backdrop-blur card (see the
 * blob and glass-sheen classes in index.css), with the blob layer translating at
 * a fraction of scroll speed for genuine parallax, not just a static
 * background. Every element that *looks* interactive either does
 * something real (sign in/up, show/hide password, Contact Support mailto,
 * scroll-linked parallax) or is explicitly marked decorative-only in a
 * comment, matching the "never fake it" rule this whole project holds
 * payment/discovery integrations to.
 */
export function AuthGate({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<Mode>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Real scroll-linked parallax: the blob layer moves at ~40% of the
  // container's scroll speed, so it drifts behind the foreground content
  // instead of scrolling in lockstep with it.
  const [scrollY, setScrollY] = useState(0)

  // Real forgot-password flow -- Supabase's own resetPasswordForEmail(),
  // not a fake "check your email" that never sends anything.
  const [resetSubmitting, setResetSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  // Real, if modest, "Remember me": Supabase already persists the session
  // in localStorage by default (that's why you normally stay signed in
  // across reloads). Unchecking this doesn't fake a new capability -- it
  // signs you out when you close the tab/window, via a real beforeunload
  // hook, rather than doing nothing while looking like a working toggle.
  // Known limit: beforeunload isn't guaranteed on every mobile/native
  // lifecycle path -- a full solution needs a custom Supabase storage
  // adapter, which is a larger change than this pass makes.
  const [rememberMe, setRememberMe] = useState(true)

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
    if (!rememberMe) {
      window.addEventListener('beforeunload', () => { void supabase?.auth.signOut() })
    }
    onSignedIn()
  }

  const BlobLayer = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ transform: `translateY(${scrollY * -0.4}px)` }}>
      <div className="blob blob-coral drift-1" style={{ width: 260, height: 260, top: -60, left: -70 }} />
      <div className="blob blob-blue drift-2" style={{ width: 220, height: 220, top: 120, right: -80 }} />
      <div className="blob blob-lavender drift-3" style={{ width: 200, height: 200, top: 420, left: -60 }} />
      <div className="blob blob-mint drift-1" style={{ width: 180, height: 180, top: 640, right: -50 }} />
      <div className="blob blob-gold drift-2" style={{ width: 200, height: 200, top: 900, left: 40 }} />
      <div className="blob blob-peach drift-3" style={{ width: 240, height: 240, top: 1150, right: -60 }} />
    </div>
  )

  const Header = () => (
    <div className="text-center mb-6 relative z-10">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 logo-glow" style={{ background: 'linear-gradient(135deg, #EE674E 0%, #F47B66 45%, #A78BD6 100%)' }}>
        <svg width="34" height="31" viewBox="0 0 24 22" fill="none"><path d="M12 20.5S2 14.8 2 8.2A5.2 5.2 0 0112 5.3a5.2 5.2 0 0110 2.9c0 6.6-10 12.3-10 12.3z" fill="white" /></svg>
      </div>
      <h1 className="font-display text-2xl text-[#242424] leading-none">Mom<span className="text-[#EE674E]">Bestie</span></h1>
      <p className="text-[10px] font-semibold text-[#B0A8A4] tracking-[0.18em] uppercase mt-1">Provider Portal</p>
    </div>
  )

  if (mode === 'confirm-email') {
    return (
      <div className="h-full w-full overflow-y-auto relative bg-[#FFFCFA] px-5 py-8" onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
        <BlobLayer />
        <div className="relative z-10">
          <Header />
          <div className="relative overflow-hidden w-full glass-card-strong rounded-[2rem] p-8 text-center">
            <div className="glass-sheen" />
            <div className="w-16 h-16 rounded-full bg-[#FEF3CD] flex items-center justify-center text-3xl mx-auto mb-4">📧</div>
            <h2 className="font-display text-2xl text-[#242424] mb-2">Confirm your email</h2>
            <p className="text-sm text-[#6E6E73] mb-6">We sent a confirmation link to <span className="font-semibold text-[#242424]">{email}</span>. Click it, then come back and sign in.</p>
            <button onClick={() => setMode('signin')} className="action-btn w-full bg-[#F0E8E4] text-[#6E6E73] font-semibold py-3.5 rounded-2xl">Back to Sign In</button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'forgot') {
    return (
      <div className="h-full w-full overflow-y-auto relative bg-[#FFFCFA] px-5 py-8" onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
        <BlobLayer />
        <div className="relative z-10">
          <Header />
          <div className="relative overflow-hidden w-full glass-card-strong rounded-[2rem] p-8">
            <div className="glass-sheen" />
            {resetSent ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#E8F5EE] flex items-center justify-center text-3xl mx-auto mb-4">📬</div>
                <h2 className="font-display text-2xl text-[#242424] mb-2">Check your email</h2>
                <p className="text-sm text-[#6E6E73] mb-6">If an account exists for <span className="font-semibold text-[#242424]">{email}</span>, a password reset link is on its way.</p>
                <button onClick={() => { setMode('signin'); setResetSent(false) }} className="action-btn w-full bg-[#F0E8E4] text-[#6E6E73] font-semibold py-3.5 rounded-2xl">Back to Sign In</button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#FFD6C9] flex items-center justify-center text-3xl mx-auto mb-4">🔑</div>
                <h2 className="font-display text-2xl text-[#242424] mb-2 text-center">Reset your password</h2>
                <p className="text-sm text-[#6E6E73] mb-6 text-center">Enter your email and we'll send a real reset link via Supabase.</p>
                {resetError && (
                  <div className="rounded-xl px-3.5 py-2.5 mb-3 text-xs text-[#D9534F]" style={{ background: '#FAECEC', border: '1px solid #ECA0A0' }}>{resetError}</div>
                )}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-[#6E6E73] mb-1.5 block">Email address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">✉️</span>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email"
                      className="cartoon-input w-full pl-10 pr-4 py-3.5 text-[15px]" />
                  </div>
                </div>
                <button onClick={async () => {
                  setResetSubmitting(true); setResetError(null)
                  const res = await requestPasswordReset(email)
                  setResetSubmitting(false)
                  if (!res.ok) { setResetError(res.error ?? 'Something went wrong.'); return }
                  setResetSent(true)
                }} disabled={resetSubmitting || !email.trim()}
                  className="action-btn w-full coral-gradient text-white font-bold py-4 rounded-2xl mb-3 text-[15px] disabled:opacity-40">
                  {resetSubmitting ? 'Sending…' : 'Send Reset Link'}
                </button>
                <button onClick={() => { setMode('signin'); setResetError(null) }} className="action-btn w-full text-sm font-semibold text-[#6E6E73] py-1.5">← Back to Sign In</button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto relative bg-[#FFFCFA] px-5 py-8" onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
      <BlobLayer />

      <div className="relative z-10">
        <Header />

        {/* Tagline -- condensed from the desktop reference for phone width */}
        <div className="text-center mb-6">
          <p className="font-display text-2xl text-[#242424] leading-tight">Care. Connect.<br /><span style={{ background: 'linear-gradient(90deg,#EE674E,#A78BD6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Grow together.</span></p>
          <p className="text-[13px] text-[#6E6E73] mt-2 px-3">Manage bookings, track earnings, and grow your business.</p>
          <div className="flex justify-center gap-2 mt-4">
            {FEATURES.map(f => (
              <span key={f.label} className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-3.5 py-1.5" style={{ background: f.bg, color: f.fg }}>
                <span className="text-sm">{f.icon}</span>{f.label}
              </span>
            ))}
          </div>
        </div>

        {/* Sign-in / sign-up card */}
        <div className="relative overflow-hidden glass-card-strong rounded-[2rem] p-7" style={{ boxShadow: '0 16px 48px rgba(238,103,78,0.16), 0 4px 16px rgba(167,139,214,0.12)' }}>
          <div className="glass-sheen" />
          <h2 className="font-display text-2xl text-[#242424] mb-1">{mode === 'signup' ? 'Join MomBestie 🎉' : 'Welcome back 👋'}</h2>
          <p className="text-sm text-[#6E6E73] mb-6">{mode === 'signup' ? 'Create your provider account.' : 'Sign in to access your MomBestie Provider Portal.'}</p>

          {error && (
            <div className="rounded-xl px-3.5 py-2.5 mb-3 text-xs text-[#D9534F]" style={{ background: '#FAECEC', border: '1px solid #ECA0A0' }}>{error}</div>
          )}

          {mode === 'signup' && (
            <div className="mb-3.5">
              <label className="text-xs font-semibold text-[#6E6E73] mb-1.5 block">Full name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">👤</span>
                <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jordan Rivera"
                  className="cartoon-input w-full pl-10 pr-4 py-3.5 text-[15px]" />
              </div>
            </div>
          )}

          <div className="mb-3.5">
            <label className="text-xs font-semibold text-[#6E6E73] mb-1.5 block">Email address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">✉️</span>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email"
                className="cartoon-input w-full pl-10 pr-4 py-3.5 text-[15px]" />
            </div>
          </div>

          <div className="mb-2">
            <label className="text-xs font-semibold text-[#6E6E73] mb-1.5 block">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">🔒</span>
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type={showPassword ? 'text' : 'password'}
                className="cartoon-input w-full pl-10 pr-12 py-3.5 text-[15px]" />
              <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-[#B0A8A4]">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {mode === 'signin' && (
            <div className="flex items-center justify-between mb-1 mt-1">
              <label className="flex items-center gap-1.5 text-xs text-[#6E6E73] cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-3.5 h-3.5 accent-[#EE674E]" />
                Remember me
              </label>
              <button type="button" onClick={() => { setMode('forgot'); setError(null) }} className="text-xs font-semibold text-[#EE674E]">Forgot password?</button>
            </div>
          )}

          <button onClick={submit} disabled={submitting || !email.trim() || !password.trim() || (mode === 'signup' && !fullName.trim())}
            className="action-btn w-full coral-gradient text-white font-bold py-4 rounded-2xl mt-5 mb-3 text-[15px] disabled:opacity-40 flex items-center justify-center gap-1.5"
            style={{ boxShadow: '0 8px 20px rgba(222,69,39,0.4)' }}>
            {submitting ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
            {!submitting && <span>→</span>}
          </button>

          <button onClick={() => { setMode(m => m === 'signup' ? 'signin' : 'signup'); setError(null) }}
            className="action-btn w-full text-sm font-semibold text-[#6E6E73] py-1.5">
            {mode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? "}
            {mode === 'signin' && <span className="text-[#EE674E]">Create an account →</span>}
          </button>

          {/* Decorative only -- see file header comment. Not wired to real OAuth. */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#F0E8E4]" />
            <span className="text-xs text-[#B0A8A4] font-medium">or continue with</span>
            <div className="flex-1 h-px bg-[#F0E8E4]" />
          </div>
          <div className="flex gap-2.5">
            {SOCIAL.map(s => (
              <button key={s.label} title={`${s.label} sign-in isn't connected yet`}
                className="flex-1 flex items-center justify-center py-3 rounded-xl bg-[#FFF8F4] border border-[#F0E8E4] opacity-60 cursor-not-allowed">
                {s.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Support -- a real mailto link, not a fake button. Point this at a
            real inbox before launch. */}
        <a href="mailto:support@mombestie.app" className="action-btn mt-4 relative overflow-hidden glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EFE7FB] flex items-center justify-center text-lg flex-shrink-0">🎧</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#242424]">Need help?</p>
            <p className="text-xs text-[#6E6E73] truncate">Our support team is here for you.</p>
          </div>
          <span className="text-sm font-semibold text-[#EE674E] flex-shrink-0">Contact →</span>
        </a>

        {/* Trust badges -- general marketing copy, no functional claims. */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {TRUST.map(t => (
            <div key={t.label} className="text-center">
              <p className="text-xl mb-1">{t.icon}</p>
              <p className="text-[10px] text-[#6E6E73] leading-tight">{t.label}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-[#B0A8A4] mt-6 mb-2">© 2026 MomBestie. All rights reserved.</p>
      </div>
    </div>
  )
}
