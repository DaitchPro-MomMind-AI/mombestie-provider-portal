import { useEffect, useState } from 'react'
import { getCurrentUser, signOut, getMyProviderApplication, getMyHealthcareApplication, submitProviderApplication, listCountries, type CountryFee } from './services'
import { AuthGate } from './screens/AuthGate'
import { ProviderTypeChoice } from './screens/ProviderTypeChoice'
import { HealthcareWizard } from './screens/HealthcareWizard'
import { PendingStatusScreen } from './screens/PendingStatusScreen'
import { PaymentMethodPicker } from './screens/PaymentMethodPicker'

// ─── Mock data ──────────────────────────────────────────────────────────────
// Everything here is a frontend fixture, same status as the customer app's
// pre-tracking-service mocks — clearly not live data. See
// ../../docs/ARCHITECTURE.md §10 for the real Provider/Booking service contracts
// this UI is designed to be wired to.

type BookingStatus = 'Requested' | 'Confirmed' | 'Completed' | 'Declined'
const INITIAL_BOOKINGS: { id: string; customer: string; service: string; when: string; status: BookingStatus; amount: number }[] = [
  { id: 'bk_1', customer: 'Sarah M.', service: 'Evening babysitting (3h)', when: 'Today, 6:00 PM', status: 'Requested', amount: 75 },
  { id: 'bk_2', customer: 'Amara O.', service: 'Postpartum support (4h)', when: 'Tomorrow, 9:00 AM', status: 'Confirmed', amount: 140 },
  { id: 'bk_3', customer: 'Wei L.', service: 'Meal preparation', when: 'Aug 8', status: 'Completed', amount: 60 },
]

const VERIFICATION_STEPS = [
  { label: 'Identity verified', done: true },
  { label: 'Background check', done: true },
  { label: 'Certifications uploaded', done: true },
  { label: 'Application fee paid', done: true },
  { label: 'Admin review', done: false },
]

const NAV = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'bookings', label: 'Bookings', icon: '📋' },
  { id: 'availability', label: 'Availability', icon: '📅' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'earnings', label: 'Earnings & Payouts', icon: '💰' },
  { id: 'messages', label: 'Messages', icon: '💬' },
  { id: 'verification', label: 'Verification', icon: '✅' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
] as const
type NavId = typeof NAV[number]['id']

const COMMISSION_PCT = 10 // reference value — real commission is server-side, per country (see ARCHITECTURE.md §9)

// Onboarding pipeline per the master spec §11: registration -> identity ->
// category -> service info -> experience -> service area -> pricing ->
// availability -> documents -> application fee -> payout setup -> admin
// review. Ends in Pending Verification, never the full dashboard — a
// provider cannot self-verify (see docs/ARCHITECTURE.md §10).
type ProviderStatus = 'draft' | 'submitted' | 'pending_verification' | 'approved' | 'rejected' | 'suspended' | 'expired'

const CATEGORIES = ['Babysitting', 'Nanny Services', 'Postpartum Support', 'Housecleaning', 'Meal Preparation', 'Baby Photography', 'Babyproofing', 'Family Support', 'Other']

interface OnboardingData {
  fullName: string
  email: string
  phone: string
  address: string
  categories: string[]
  businessName: string
  description: string
  experienceYears: string
  country: string
  serviceCity: string
  serviceRadius: string
  hourlyRate: string
  availability: string[]
  idUploaded: boolean
  backgroundCheckConsent: boolean
  certifications: boolean
  feePaid: boolean
  feePaymentMethod: string | null
  payoutConnected: boolean
}

const EMPTY_ONBOARDING: OnboardingData = {
  fullName: '', email: '', phone: '', address: '',
  categories: [], businessName: '', description: '', experienceYears: '',
  country: 'US', serviceCity: '', serviceRadius: '10', hourlyRate: '',
  availability: [], idUploaded: false, backgroundCheckConsent: false, certifications: false,
  feePaid: false, feePaymentMethod: null, payoutConnected: false,
}

const ONBOARDING_STEPS = ['Account', 'Identity', 'Category', 'Service Details', 'Area & Pricing', 'Availability', 'Documents & Fee', 'Payout'] as const

function OnboardingWizard({ onSubmit, onCancel }: { onSubmit: (data: OnboardingData) => void; onCancel: () => void }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(EMPTY_ONBOARDING)
  const [countries, setCountries] = useState<CountryFee[]>([])
  useEffect(() => { listCountries().then(setCountries) }, [])
  const totalSteps = ONBOARDING_STEPS.length

  // Functional form throughout — reading `data.x` directly from the render
  // closure (as an earlier version of this did) computes toggles against a
  // stale snapshot whenever two updates land in the same React batch, which
  // silently drops one of them. Always derive the next value from the
  // updater's own `d`, never the outer `data`.
  const update = (patch: Partial<OnboardingData> | ((d: OnboardingData) => Partial<OnboardingData>)) =>
    setData(d => ({ ...d, ...(typeof patch === 'function' ? patch(d) : patch) }))
  const toggleCategory = (c: string) => update(d => ({ categories: d.categories.includes(c) ? d.categories.filter(x => x !== c) : [...d.categories, c] }))
  const toggleDay = (day: string) => update(d => ({ availability: d.availability.includes(day) ? d.availability.filter(x => x !== day) : [...d.availability, day] }))

  const canAdvance = (() => {
    switch (step) {
      case 1: return data.fullName.trim() && data.email.trim()
      case 2: return data.phone.trim() && data.address.trim()
      case 3: return data.categories.length > 0
      case 4: return data.businessName.trim() && data.experienceYears.trim()
      case 5: return data.serviceCity.trim() && data.hourlyRate.trim()
      case 6: return data.availability.length > 0
      case 7: return data.idUploaded && data.backgroundCheckConsent && data.feePaid
      case 8: return data.payoutConnected
      default: return true
    }
  })()

  const next = () => step < totalSteps ? setStep(step + 1) : onSubmit(data)
  const back = () => step > 1 ? setStep(step - 1) : onCancel()

  return (
    <div className="min-h-screen bg-[#FFFCFA] px-4 py-8 flex items-start justify-center">
      <div className="w-full max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-6">
          {ONBOARDING_STEPS.map((label, i) => {
            const s = i + 1
            return (
              <div key={label} className="flex items-center gap-1 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0`}
                  style={{ background: step > s ? '#55A67A' : step === s ? 'linear-gradient(135deg,#EE674E,#F47B66)' : '#F0E8E4', color: step >= s ? 'white' : '#B0A8A4' }}>
                  {step > s ? '✓' : s}
                </div>
                {s < totalSteps && <div className="h-px flex-1" style={{ background: step > s ? '#55A67A' : '#F0E8E4' }} />}
              </div>
            )
          })}
        </div>
        <p className="text-xs font-semibold text-[#EE674E] uppercase tracking-wide mb-1">Step {step} of {totalSteps}</p>
        <h1 className="font-display text-2xl text-[#242424] mb-5">{ONBOARDING_STEPS[step - 1]}</h1>

        <div className="glass-card-strong rounded-3xl p-6 space-y-4">
          {step === 1 && (<>
            <input value={data.fullName} onChange={e => update({ fullName: e.target.value })} placeholder="Full name" className="cartoon-input w-full px-4 py-3 text-sm" />
            <input value={data.email} onChange={e => update({ email: e.target.value })} placeholder="Email address" className="cartoon-input w-full px-4 py-3 text-sm" />
            <input type="password" placeholder="Password" className="cartoon-input w-full px-4 py-3 text-sm" />
          </>)}

          {step === 2 && (<>
            <p className="text-xs text-[#6E6E73]">Required for identity verification — never shown on your public profile.</p>
            <input value={data.phone} onChange={e => update({ phone: e.target.value })} placeholder="Phone number" className="cartoon-input w-full px-4 py-3 text-sm" />
            <input value={data.address} onChange={e => update({ address: e.target.value })} placeholder="Home address" className="cartoon-input w-full px-4 py-3 text-sm" />
          </>)}

          {step === 3 && (<>
            <p className="text-xs text-[#6E6E73] mb-1">Select every category you offer (at least one).</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => toggleCategory(c)}
                  className="action-btn py-2.5 px-3 rounded-xl text-xs font-semibold text-left"
                  style={data.categories.includes(c)
                    ? { background: '#FFD6C9', border: '2px solid #EE674E', color: '#C94930' }
                    : { background: '#FFF8F4', border: '2px solid #F0E8E4', color: '#6E6E73' }}>
                  {data.categories.includes(c) ? '✓ ' : ''}{c}
                </button>
              ))}
            </div>
          </>)}

          {step === 4 && (<>
            <input value={data.businessName} onChange={e => update({ businessName: e.target.value })} placeholder="Business / display name" className="cartoon-input w-full px-4 py-3 text-sm" />
            <textarea value={data.description} onChange={e => update({ description: e.target.value })} placeholder="Describe your experience and approach" rows={3} className="cartoon-input w-full px-4 py-3 text-sm" />
            <input value={data.experienceYears} onChange={e => update({ experienceYears: e.target.value.replace(/\D/g, '') })} placeholder="Years of experience" inputMode="numeric" className="cartoon-input w-full px-4 py-3 text-sm" />
          </>)}

          {step === 5 && (<>
            <div>
              <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide mb-1.5">Country</p>
              <div className="grid grid-cols-2 gap-2">
                {countries.map(c => (
                  <button key={c.country_code} onClick={() => update({ country: c.country_code })}
                    className="action-btn py-2.5 px-3 rounded-xl text-xs font-semibold text-left"
                    style={data.country === c.country_code
                      ? { background: '#FFD6C9', border: '2px solid #EE674E', color: '#C94930' }
                      : { background: '#FFF8F4', border: '2px solid #F0E8E4', color: '#6E6E73' }}>
                    {data.country === c.country_code ? '✓ ' : ''}{c.country_name}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#6E6E73] mt-1.5">Determines your registration fee amount and eligible payment methods — every country uses the same architecture, not a special case.</p>
            </div>
            <input value={data.serviceCity} onChange={e => update({ serviceCity: e.target.value })} placeholder="City / service area" className="cartoon-input w-full px-4 py-3 text-sm" />
            <div>
              <label className="text-xs text-[#6E6E73] mb-1 block">Service radius: {data.serviceRadius} mi</label>
              <input type="range" min="1" max="50" value={data.serviceRadius} onChange={e => update({ serviceRadius: e.target.value })} className="w-full" />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#6E6E73]">$</span>
              <input value={data.hourlyRate} onChange={e => update({ hourlyRate: e.target.value.replace(/\D/g, '') })} placeholder="Hourly rate" inputMode="numeric" className="cartoon-input w-full pl-7 pr-4 py-3 text-sm" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6E6E73]">/hr</span>
            </div>
          </>)}

          {step === 6 && (<>
            <p className="text-xs text-[#6E6E73] mb-1">Which days are you generally available?</p>
            <div className="grid grid-cols-7 gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <button key={d} onClick={() => toggleDay(d)}
                  className="action-btn py-3 rounded-xl text-xs font-semibold"
                  style={data.availability.includes(d)
                    ? { background: '#FFD6C9', color: '#C94930', border: '2px solid #EE674E' }
                    : { background: '#F0E8E4', color: '#6E6E73', border: '2px solid transparent' }}>
                  {d}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#6E6E73]">You'll set specific hours later — this is never shown to customers as live availability until you save real hours.</p>
          </>)}

          {step === 7 && (<>
            <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide">Required documents</p>
            {[
              { key: 'idUploaded' as const, label: 'Government-issued photo ID' },
              { key: 'backgroundCheckConsent' as const, label: 'Consent to background check' },
              { key: 'certifications' as const, label: 'Certifications (optional — CPR, first aid, etc.)' },
            ].map(doc => (
              <button key={doc.key} onClick={() => update(d => ({ [doc.key]: !d[doc.key] }))}
                className="action-btn w-full flex items-center gap-3 p-3 rounded-xl text-left"
                style={{ background: '#FFF8F4', border: '1.5px solid #F0E8E4' }}>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs flex-shrink-0 ${data[doc.key] ? 'bg-[#55A67A] text-white' : 'bg-[#F0E8E4]'}`}>
                  {data[doc.key] ? '✓' : ''}
                </div>
                <span className="text-sm text-[#242424]">{doc.label}</span>
              </button>
            ))}
            <div className="pt-2 border-t border-[#F0E8E4] mt-2">
              <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide mb-2">Application fee</p>
              {(() => {
                const c = countries.find(x => x.country_code === data.country)
                const feeLabel = c ? `${c.currency_symbol}${(c.provider_application_fee_cents / 100).toLocaleString()} one-time` : 'Loading…'
                return (
                  <>
                    <div className="p-3 rounded-xl mb-3" style={{ background: '#FFF8F4', border: '1.5px solid #F0E8E4' }}>
                      <p className="text-sm font-semibold text-[#242424]">{feeLabel}</p>
                      <p className="text-[11px] text-[#6E6E73]">No monthly fee, ever. Set per-country by MomMind admin — see Marketing site.</p>
                    </div>
                    {c && (
                      <PaymentMethodPicker countryCode={c.country_code} currency={c.currency} transactionType="provider_registration_fee"
                        amountCents={c.provider_application_fee_cents}
                        selected={data.feePaymentMethod}
                        onSelect={pm => update({ feePaymentMethod: pm, feePaid: true })} />
                    )}
                  </>
                )
              })()}
              <p className="text-[11px] text-[#6E6E73] mt-2">Payment methods shown are only ones actually eligible for your country and this transaction type — nothing is hardcoded (docs/ARCHITECTURE.md §15).</p>
            </div>
          </>)}

          {step === 8 && (<>
            <p className="text-xs text-[#6E6E73]">Payouts require a Stripe Connect (or equivalent) account. This is a placeholder — no real account is created.</p>
            <button onClick={() => update(d => ({ payoutConnected: !d.payoutConnected }))}
              className={`action-btn w-full py-3.5 rounded-2xl font-semibold text-sm ${data.payoutConnected ? 'bg-[#E8F5EE] text-[#55A67A]' : 'bg-[#FFD6C9] text-[#C94930]'}`}>
              {data.payoutConnected ? '✓ Payout method connected (demo)' : 'Connect Payout Method (demo)'}
            </button>
            <div className="rounded-xl p-3 mt-2" style={{ background: '#FFF8F4', border: '1.5px dashed #F0E8E4' }}>
              <p className="text-xs font-semibold text-[#242424] mb-1">Ready to submit</p>
              <p className="text-[11px] text-[#6E6E73]">Submitting sends your application for admin review. You'll see "Pending Verification" until an admin approves — a provider account can never self-verify.</p>
            </div>
          </>)}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={back} className="action-btn flex-1 bg-[#F0E8E4] text-[#6E6E73] font-semibold py-3 rounded-2xl">
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button onClick={next} disabled={!canAdvance}
            className="action-btn flex-1 coral-gradient text-white font-semibold py-3 rounded-2xl disabled:opacity-40">
            {step === totalSteps ? 'Submit Application' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    Requested: 'bg-[#FEF7E0] text-[#B8860B]',
    Confirmed: 'bg-[#EBF2FC] text-[#6299D5]',
    Completed: 'bg-[#E8F5EE] text-[#55A67A]',
    Declined: 'bg-[#F0E8E4] text-[#6E6E73]',
  }
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status]}`}>{status}</span>
}

function Sidebar({ active, onChange, onSignOut }: { active: NavId; onChange: (id: NavId) => void; onSignOut: () => void }) {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[#F6EDE8] bg-white p-4">
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-8 h-8 rounded-xl coral-gradient flex items-center justify-center text-white font-display">M</div>
        <span className="font-display text-[#242424]">Provider Portal</span>
      </div>
      <nav className="space-y-1 flex-1">
        {NAV.map(n => (
          <button key={n.id} onClick={() => onChange(n.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${active === n.id ? 'bg-[#FFD6C9] text-[#C94930] font-semibold' : 'text-[#6E6E73] hover:bg-[#FFF3EE]'}`}>
            <span>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>
      <button onClick={onSignOut} className="w-full text-left px-3 py-2.5 text-sm font-semibold text-[#D9534F]">🚪 Sign Out</button>
    </aside>
  )
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      {title && <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide mb-3">{title}</p>}
      {children}
    </div>
  )
}

type View = 'loading' | 'auth' | 'choose-type' | 'onboarding-family' | 'onboarding-healthcare' | 'pending' | 'dashboard'

export default function App() {
  // Real Supabase session drives everything below -- 'auth' is a genuine
  // sign-up/sign-in gate (src/screens/AuthGate.tsx), not the old "any input
  // accepted" stub. After sign-in, real application rows decide the view:
  // an unresolved application (either provider class) always routes to
  // 'pending', never 'dashboard' -- a provider can never self-verify
  // (docs/ARCHITECTURE.md §14.4/§14.9).
  const [view, setView] = useState<View>('loading')
  const [userId, setUserId] = useState<string | null>(null)
  const [hasApplication, setHasApplication] = useState(false)
  const [pendingKind, setPendingKind] = useState<'family' | 'healthcare'>('family')
  const [nav, setNav] = useState<NavId>('overview')
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS)

  const routeAfterAuth = async (uid: string) => {
    setUserId(uid)
    const [familyApp, healthcareApp] = await Promise.all([getMyProviderApplication(uid), getMyHealthcareApplication(uid)])
    if (familyApp && familyApp.status !== 'approved') { setPendingKind('family'); setHasApplication(true); setView('pending'); return }
    if (healthcareApp && healthcareApp.status !== 'approved') { setPendingKind('healthcare'); setHasApplication(true); setView('pending'); return }
    setHasApplication(Boolean(familyApp || healthcareApp))
    setView('dashboard')
  }

  useEffect(() => {
    getCurrentUser().then(user => (user ? routeAfterAuth(user.id) : setView('auth')))
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUserId(null)
    setHasApplication(false)
    setView('auth')
  }

  if (view === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFFCFA]"><span className="w-8 h-8 rounded-full border-2 border-[#F0E8E4] border-t-[#EE674E] inline-block spin-slow" /></div>
  }

  if (view === 'auth') {
    return <AuthGate onSignedIn={async () => { const user = await getCurrentUser(); if (user) await routeAfterAuth(user.id) }} />
  }

  if (view === 'choose-type') {
    return <ProviderTypeChoice
      onChoose={k => setView(k === 'family' ? 'onboarding-family' : 'onboarding-healthcare')}
      onCancel={() => setView(hasApplication ? 'dashboard' : 'auth')} />
  }

  if (view === 'onboarding-family') {
    return <OnboardingWizard
      onSubmit={async d => {
        if (!userId) { setView('auth'); return }
        await submitProviderApplication({
          user_id: userId,
          full_name: d.fullName, phone: d.phone, address: d.address,
          business_name: d.businessName || null, categories: d.categories, bio: d.description || null,
          experience_years: d.experienceYears ? parseInt(d.experienceYears, 10) : null,
          service_city: d.serviceCity || null, service_radius_mi: parseInt(d.serviceRadius, 10) || 10,
          hourly_rate_cents: d.hourlyRate ? Math.round(parseFloat(d.hourlyRate) * 100) : null,
          country: d.country, availability_days: d.availability,
          id_uploaded: d.idUploaded, background_check_consent: d.backgroundCheckConsent,
          certifications: d.certifications, application_fee_paid: d.feePaid, payout_connected: d.payoutConnected,
        })
        setPendingKind('family'); setHasApplication(true); setView('pending')
      }}
      onCancel={() => setView('choose-type')} />
  }

  if (view === 'onboarding-healthcare') {
    return <HealthcareWizard userId={userId!}
      onSubmitted={() => { setPendingKind('healthcare'); setHasApplication(true); setView('pending') }}
      onCancel={() => setView('choose-type')} />
  }

  if (view === 'pending') {
    return <PendingStatusScreen userId={userId!} kind={pendingKind} onBackToLogin={handleSignOut} />
  }

  // Accept moves Requested -> Confirmed (a real commitment to show up);
  // Decline moves it to Declined rather than deleting it, so the provider
  // still has a record of what they turned down. Neither writes anywhere
  // outside this session — there's no shared backend with the customer app
  // yet, so the requester never actually sees this decision (documented gap).
  const decideBooking = (id: string, next: 'Confirmed' | 'Declined') =>
    setBookings(list => list.map(b => b.id === id ? { ...b, status: next } : b))

  const totalEarned = bookings.filter(b => b.status === 'Completed').reduce((s, b) => s + b.amount, 0)
  const commission = Math.round(totalEarned * (COMMISSION_PCT / 100) * 100) / 100

  return (
    <div className="min-h-screen flex bg-[#FFFCFA]">
      <Sidebar active={nav} onChange={setNav} onSignOut={handleSignOut} />
      <main className="flex-1 min-w-0 px-6 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-[#242424] capitalize">{NAV.find(n => n.id === nav)?.label}</h1>
            <p className="text-sm text-[#6E6E73]">Jordan's Care Services · San Francisco, CA</p>
          </div>
          <select className="md:hidden text-sm border border-[#F0E8E4] rounded-lg px-2 py-1.5" value={nav} onChange={e => setNav(e.target.value as NavId)}>
            {NAV.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>

        {!hasApplication && (
          <div className="glass-card-strong rounded-2xl p-4 flex items-center gap-3 mb-5" style={{ background: 'linear-gradient(135deg,#FFF3EE,#FFD6C9)' }}>
            <span className="text-2xl">📝</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#242424]">No provider application on file for this account</p>
              <p className="text-xs text-[#6E6E73]">The screens below are demo data (Jordan's Care Services). Register a real application to appear in MomMind's real marketplace/Find Care.</p>
            </div>
            <button onClick={() => setView('choose-type')} className="action-btn flex-shrink-0 text-xs font-bold text-white px-3 py-2 rounded-lg" style={{ background: 'linear-gradient(135deg,#EE674E,#F47B66)' }}>Register →</button>
          </div>
        )}

        {nav === 'overview' && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card title="Pending requests"><p className="font-display text-3xl text-[#242424]">{bookings.filter(b => b.status === 'Requested').length}</p></Card>
              <Card title="Upcoming bookings"><p className="font-display text-3xl text-[#242424]">{bookings.filter(b => b.status === 'Confirmed').length}</p></Card>
              <Card title="Rating"><p className="font-display text-3xl text-[#242424]">4.9 ★</p><p className="text-xs text-[#6E6E73] mt-1">32 reviews</p></Card>
            </div>
            <Card title="Recent activity">
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#242424]">{b.customer} — {b.service}</p>
                      <p className="text-xs text-[#6E6E73]">{b.when}</p>
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {nav === 'bookings' && (
          <div className="space-y-3">
            {bookings.map(b => (
              <Card key={b.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#242424]">{b.service}</p>
                    <p className="text-sm text-[#6E6E73]">{b.customer} · {b.when}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-[#242424]">${b.amount}</p>
                    <StatusPill status={b.status} />
                  </div>
                </div>
                {b.status === 'Requested' && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => decideBooking(b.id, 'Confirmed')} className="action-btn flex-1 coral-gradient text-white text-sm font-semibold py-2 rounded-xl">Accept</button>
                    <button onClick={() => decideBooking(b.id, 'Declined')} className="action-btn flex-1 bg-[#F0E8E4] text-[#6E6E73] text-sm font-semibold py-2 rounded-xl">Decline</button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {nav === 'availability' && (
          <Card title="Weekly availability">
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                <div key={d} className={`rounded-xl py-4 text-sm font-medium ${i < 5 ? 'bg-[#FFD6C9] text-[#C94930]' : 'bg-[#F0E8E4] text-[#6E6E73]'}`}>{d}</div>
              ))}
            </div>
            <p className="text-xs text-[#6E6E73] mt-3">Editing availability updates what customers can book — changes are never shown as available until saved.</p>
          </Card>
        )}

        {nav === 'profile' && (
          <div className="space-y-4">
            <Card title="Public profile">
              <div className="grid sm:grid-cols-2 gap-3">
                <input defaultValue="Jordan's Care Services" className="cartoon-input px-4 py-2.5 text-sm" placeholder="Business name" />
                <input defaultValue="Babysitting, Postpartum Support" className="cartoon-input px-4 py-2.5 text-sm" placeholder="Categories" />
              </div>
              <textarea defaultValue="8 years of childcare experience, CPR certified, background-checked." className="cartoon-input w-full px-4 py-2.5 text-sm mt-3" rows={3} />
              <button className="action-btn coral-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-xl mt-3">Save Changes</button>
            </Card>
          </div>
        )}

        {nav === 'earnings' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card title="Gross (completed)"><p className="font-display text-2xl text-[#242424]">${totalEarned.toFixed(2)}</p></Card>
              <Card title={`Commission (${COMMISSION_PCT}%)`}><p className="font-display text-2xl text-[#242424]">-${commission.toFixed(2)}</p></Card>
              <Card title="Net payout"><p className="font-display text-2xl text-[#55A67A]">${(totalEarned - commission).toFixed(2)}</p></Card>
            </div>
            <Card title="Payout method">
              <p className="text-sm text-[#6E6E73]">No payout method connected yet. Real payouts require a Stripe Connect (or equivalent) account — see docs/ARCHITECTURE.md §9.</p>
              <button className="action-btn bg-[#FFD6C9] text-[#C94930] text-sm font-semibold px-5 py-2.5 rounded-xl mt-3">Connect Payout Method</button>
            </Card>
          </div>
        )}

        {nav === 'messages' && (
          <Card title="Conversations">
            <p className="text-sm text-[#6E6E73]">No messages yet. Conversations open once a booking is requested.</p>
          </Card>
        )}

        {nav === 'verification' && (
          <Card title="Verification status">
            <div className="space-y-3">
              {VERIFICATION_STEPS.map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${s.done ? 'bg-[#E8F5EE] text-[#55A67A]' : 'bg-[#F0E8E4] text-[#6E6E73]'}`}>
                    {s.done ? '✓' : '·'}
                  </div>
                  <p className={`text-sm ${s.done ? 'text-[#242424]' : 'text-[#6E6E73]'}`}>{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#6E6E73] mt-4">Verification badges are backend-controlled — this portal cannot self-assign a "Verified" status.</p>
          </Card>
        )}

        {nav === 'settings' && (
          <Card title="Account settings">
            <p className="text-sm text-[#6E6E73]">Notification preferences, security, and account deactivation would live here.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
