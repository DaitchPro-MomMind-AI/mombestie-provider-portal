import { useEffect, useState } from 'react'
import { getCurrentUser, updateEmail, updatePassword } from '../services'

/**
 * Real Settings screen -- replaces the old one-line placeholder card.
 * Every row does something real when tapped: password/email change hit
 * real Supabase auth calls, Contact Support/Terms/Privacy are real links,
 * Sign Out ends the real session, and Dark Mode is a real, working toggle
 * (see index.css [data-dark] overrides + App.tsx PhoneShell). The one
 * still-honest exception is Push Notifications -- that needs real
 * infrastructure (Firebase/APNs + a server trigger on new bookings) this
 * pass didn't build, so it's a structurally-disabled "Soon" control
 * rather than a switch that flips and silently does nothing.
 *
 * Row itself is the single interactive element for every entry (renders
 * as <a> when given href, <button> for onClick, plain <div> otherwise) so
 * every row -- links and actions alike -- gets identical tap/hover
 * feedback instead of link-rows feeling different from button-rows.
 */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-bold text-[#B0A8A4] uppercase tracking-[0.12em] mb-2 px-1">{title}</p>
      <div className="relative overflow-hidden glass-card rounded-2xl divide-y divide-[#F6EDE8]">{children}</div>
    </div>
  )
}

function Row({ icon, iconBg, label, sub, right, onClick, href, target, danger }: {
  icon: string; iconBg: string; label: string; sub?: string
  right?: React.ReactNode; onClick?: () => void; href?: string; target?: string; danger?: boolean
}) {
  const interactive = Boolean(onClick || href)
  // Never render a literal <button> here -- some rows (Dark Mode) nest a
  // real interactive ToggleSwitch <button> in `right`, and a <button>
  // inside a <button> is invalid HTML that browsers handle inconsistently.
  // <a>/<div role="button"> avoids that while staying fully tappable and
  // keyboard-accessible.
  const Comp = href ? 'a' : 'div'
  const extraProps = href
    ? { href, target, rel: target ? 'noreferrer' : undefined }
    : onClick
      ? { onClick, role: 'button' as const, tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } }
      : {}
  return (
    <Comp {...extraProps} className={`action-btn w-full flex items-center gap-3 px-4 py-3.5 text-left ${interactive ? 'hover:bg-black/[0.025] active:bg-black/[0.05] cursor-pointer' : ''}`}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ background: iconBg }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${danger ? 'text-[#D9534F]' : 'text-[#242424]'}`}>{label}</p>
        {sub && <p className="text-xs text-[#6E6E73] truncate">{sub}</p>}
      </div>
      {right}
    </Comp>
  )
}

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={e => { e.stopPropagation(); onChange() }}
      aria-pressed={on} aria-label="Toggle"
      className="action-btn w-10 h-6 rounded-full relative flex-shrink-0"
      style={{ background: on ? 'linear-gradient(135deg,#DE4527,#EE674E)' : '#F0E8E4', transition: 'background 0.2s ease' }}>
      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" style={{ left: on ? '18px' : '2px', transition: 'left 0.2s ease' }} />
    </button>
  )
}

function ComingSoonToggle() {
  return (
    <span className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
      <span className="text-[9px] font-bold text-[#B0A8A4] bg-[#F0E8E4] rounded-full px-2 py-0.5 uppercase tracking-wide">Soon</span>
      <span className="w-10 h-6 rounded-full bg-[#F0E8E4] relative flex-shrink-0 cursor-not-allowed" title="Needs push infrastructure (Firebase/APNs) -- not connected yet">
        <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow" />
      </span>
    </span>
  )
}

const Chevron = () => <span className="text-[#D8D0CB] text-lg flex-shrink-0">›</span>

export function SettingsPanel({ onSignOut, darkMode, onToggleDarkMode }: {
  onSignOut: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}) {
  const [email, setEmail] = useState<string | null>(null)
  const [panel, setPanel] = useState<null | 'password' | 'email'>(null)

  useEffect(() => { getCurrentUser().then(u => setEmail(u?.email ?? null)) }, [])

  return (
    <div className="pb-2">
      {/* Account summary */}
      <div className="relative overflow-hidden glass-card-strong rounded-2xl p-4 flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full coral-gradient flex items-center justify-center text-white font-display text-lg flex-shrink-0">J</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#242424] truncate">Jordan's Care Services</p>
          <p className="text-xs text-[#6E6E73] truncate">{email ?? 'Loading…'}</p>
        </div>
        <span className="text-xs font-semibold text-[#EE674E] flex items-center gap-0.5 flex-shrink-0">4.9<span>★</span></span>
      </div>

      <Section title="Account">
        <Row icon="🔑" iconBg="#FFD6C9" label="Change Password" sub="Update your sign-in password" right={<Chevron />} onClick={() => setPanel(p => p === 'password' ? null : 'password')} />
        {panel === 'password' && <PasswordForm onDone={() => setPanel(null)} />}
        <Row icon="✉️" iconBg="#E4D8FA" label="Change Email" sub={email ?? undefined} right={<Chevron />} onClick={() => setPanel(p => p === 'email' ? null : 'email')} />
        {panel === 'email' && <EmailForm current={email} onDone={next => { setPanel(null); if (next) setEmail(next) }} />}
      </Section>

      <Section title="Preferences">
        <Row icon="🌙" iconBg="#DDE6F5" label="Dark Mode" sub={darkMode ? 'On' : 'Off'} right={<ToggleSwitch on={darkMode} onChange={onToggleDarkMode} />} onClick={onToggleDarkMode} />
        <Row icon="🔔" iconBg="#FCE3D6" label="Push Notifications" sub="New booking & message alerts" right={<ComingSoonToggle />} />
      </Section>

      <Section title="Support & Legal">
        <Row icon="🎧" iconBg="#EFE7FB" label="Contact Support" sub="We usually reply within a day" href="mailto:support@mombestie.app" right={<Chevron />} />
        <Row icon="📄" iconBg="#F0E8E4" label="Terms of Service" href="https://mombestie.app/terms" target="_blank" right={<Chevron />} />
        <Row icon="🔒" iconBg="#F0E8E4" label="Privacy Policy" href="https://mombestie.app/privacy" target="_blank" right={<Chevron />} />
        <Row icon="ℹ️" iconBg="#F0E8E4" label="App Version" sub="MomBestie Provider 1.0.0" />
      </Section>

      <Section title="Danger Zone">
        <Row icon="🚪" iconBg="#FAECEC" label="Sign Out" danger onClick={onSignOut} right={<Chevron />} />
        <Row icon="🗑️" iconBg="#FAECEC" label="Delete Account" danger sub="Contact us to permanently delete your account and data" href="mailto:support@mombestie.app?subject=Delete%20my%20account" right={<Chevron />} />
      </Section>
    </div>
  )
}

function PasswordForm({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = async () => {
    if (pw.length < 6) { setMsg({ ok: false, text: 'Password must be at least 6 characters.' }); return }
    if (pw !== confirm) { setMsg({ ok: false, text: "Passwords don't match." }); return }
    setBusy(true)
    const res = await updatePassword(pw)
    setBusy(false)
    if (!res.ok) { setMsg({ ok: false, text: res.error ?? 'Something went wrong.' }); return }
    setMsg({ ok: true, text: 'Password updated.' })
    setPw(''); setConfirm('')
    setTimeout(onDone, 900)
  }

  return (
    <div className="px-4 pb-4 pt-1 space-y-2.5 bg-[#FFF8F4]/60">
      <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="New password" className="cartoon-input w-full px-3.5 py-2.5 text-sm" />
      <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm new password" className="cartoon-input w-full px-3.5 py-2.5 text-sm" />
      {msg && <p className={`text-xs font-medium ${msg.ok ? 'text-[#55A67A]' : 'text-[#D9534F]'}`}>{msg.text}</p>}
      <button onClick={submit} disabled={busy || !pw || !confirm} className="action-btn w-full coral-gradient text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-40">
        {busy ? 'Updating…' : 'Update Password'}
      </button>
    </div>
  )
}

function EmailForm({ current, onDone }: { current: string | null; onDone: (next?: string) => void }) {
  const [next, setNext] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = async () => {
    if (!next.trim() || next === current) { setMsg({ ok: false, text: 'Enter a new, different email address.' }); return }
    setBusy(true)
    const res = await updateEmail(next.trim())
    setBusy(false)
    if (!res.ok) { setMsg({ ok: false, text: res.error ?? 'Something went wrong.' }); return }
    setMsg({ ok: true, text: `Check ${next} for a confirmation link.` })
    setTimeout(() => onDone(), 1400)
  }

  return (
    <div className="px-4 pb-4 pt-1 space-y-2.5 bg-[#FFF8F4]/60">
      <input type="email" value={next} onChange={e => setNext(e.target.value)} placeholder="New email address" className="cartoon-input w-full px-3.5 py-2.5 text-sm" />
      {msg && <p className={`text-xs font-medium ${msg.ok ? 'text-[#55A67A]' : 'text-[#D9534F]'}`}>{msg.text}</p>}
      <button onClick={submit} disabled={busy || !next} className="action-btn w-full coral-gradient text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-40">
        {busy ? 'Updating…' : 'Send Confirmation'}
      </button>
    </div>
  )
}
