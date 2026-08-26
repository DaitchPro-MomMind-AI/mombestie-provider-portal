import { useEffect, useState } from 'react'
import { getCurrentUser, signOut, signIn, signUp, requestPasswordReset, getMyProviderApplication, getMyHealthcareApplication, submitProviderApplication, listCountries, type CountryFee, getEligiblePaymentMethods, type EligiblePaymentMethod } from './services'
import { ProviderTypeChoice } from './screens/ProviderTypeChoice'
import { HealthcareWizard } from './screens/HealthcareWizard'
import { PendingStatusScreen } from './screens/PendingStatusScreen'
import { PaymentMethodPicker } from './screens/PaymentMethodPicker'

// ─── v2 design (2026-08-14) ─────────────────────────────────────────────────
// User-provided redesign (royal blue + white, see
// docs/PROJECT_REPORT.md for the color/integration writeup), copied into
// src/screens_v2/ and recolored from its original dark-navy build to match
// the spec's own "white primary, navy as accent" direction. This is now
// the primary UI -- the old AuthGate/OverviewPanel/SettingsPanel screens
// (src/screens/) are kept on disk for reference but no longer rendered by
// default. Only the auth flow (Splash/Welcome/SignIn/SignUp/
// ForgotPassword/ConfirmEmail) and Dashboard are wired to real data this
// pass; every other v2 screen (Bookings/AIHome/Messages/Earnings/
// Settings/More/Calendar/Profile/Reviews/Notifications/SmartPricing/
// MarketInsights/Healthcare/Support) still shows its own prototype
// fixture data -- flagged, not hidden, same as every other honest gap in
// this project.
import Splash from './screens_v2/Splash'
import Welcome from './screens_v2/Welcome'
import SignIn from './screens_v2/SignIn'
import SignUp from './screens_v2/SignUp'
import ForgotPassword from './screens_v2/ForgotPassword'
import ConfirmEmail from './screens_v2/ConfirmEmail'
import CountrySelect from './screens_v2/CountrySelect'
import LanguageSelect from './screens_v2/LanguageSelect'
import ProviderType from './screens_v2/ProviderType'
import Onboarding from './screens_v2/Onboarding'
import Dashboard from './screens_v2/Dashboard'
import Bookings from './screens_v2/Bookings'
import AIHome from './screens_v2/AIHome'
import Messages from './screens_v2/Messages'
import Earnings from './screens_v2/Earnings'
import SettingsV2 from './screens_v2/Settings'
import MoreV2 from './screens_v2/More'
import Calendar from './screens_v2/Calendar'
import ProviderProfileV2 from './screens_v2/ProviderProfile'
import Reviews from './screens_v2/Reviews'
import Notifications from './screens_v2/Notifications'
import SmartPricing from './screens_v2/SmartPricing'
import MarketInsights from './screens_v2/MarketInsights'
import HealthcareV2 from './screens_v2/Healthcare'
import Support from './screens_v2/Support'

export type Screen =
  | 'splash' | 'welcome' | 'signin' | 'signup' | 'otp'
  | 'country' | 'language' | 'providertype' | 'onboarding'
  | 'dashboard' | 'bookings' | 'ai' | 'messages' | 'earnings' | 'settings'
  | 'more' | 'forgotpassword' | 'calendar' | 'profile' | 'reviews'
  | 'notifications' | 'smartpricing' | 'marketinsights' | 'healthcare' | 'support'

// ─── Mock data ──────────────────────────────────────────────────────────────
// Everything here is a frontend fixture, same status as the customer app's
// pre-tracking-service mocks — clearly not live data. See
// ../../docs/ARCHITECTURE.md §10 for the real Provider/Booking service contracts
// this UI is designed to be wired to.

export type BookingStatus = 'Requested' | 'Confirmed' | 'Completed' | 'Declined'
export type Booking = { id: string; customer: string; service: string; when: string; status: BookingStatus; amount: number }
const INITIAL_BOOKINGS: Booking[] = [
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

// Native app IA: 4 primary tabs live in the bottom bar (the ones a provider
// checks constantly), everything lower-frequency (Availability, Profile,
// Verification, Settings) lives one tap deeper behind "More" -- an 8-item
// bottom bar is a desktop-sidebar habit, not a phone-app one.
const PRIMARY_NAV = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'bookings', label: 'Bookings', icon: '📋' },
  { id: 'earnings', label: 'Earnings', icon: '💰' },
  { id: 'messages', label: 'Messages', icon: '💬' },
] as const
const MORE_NAV = [
  { id: 'availability', label: 'Availability', icon: '📅' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'verification', label: 'Verification', icon: '✅' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
] as const
const NAV = [...PRIMARY_NAV, ...MORE_NAV] as const
export type NavId = typeof NAV[number]['id'] | 'more'

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
    <div className="h-full w-full overflow-y-auto bg-[#FFFCFA] px-4 py-8 flex items-start justify-center">
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
                      <p className="text-[11px] text-[#6E6E73]">No monthly fee, ever. Set per-country by MomBestie admin — see Marketing site.</p>
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

export function StatusPill({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    Requested: 'bg-[#FEF7E0] text-[#B8860B]',
    Confirmed: 'bg-[#EBF2FC] text-[#6299D5]',
    Completed: 'bg-[#E8F5EE] text-[#55A67A]',
    Declined: 'bg-[#F0E8E4] text-[#6E6E73]',
  }
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status]}`}>{status}</span>
}

// Same phone-frame pattern as the customer app (src/App.tsx): full-bleed on
// an actual phone, a scaled/centered phone mockup everywhere else -- so a
// desktop browser preview looks like a real native screen, not a website.
// Providers work from their phones (see docs/ARCHITECTURE.md native-app
// section, 2026-08-13) so this app is native-first the same way the
// customer app is, not a "responsive dashboard that also fits on mobile."
function PhoneShell({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 844)
  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const isMobile = vw < 640
  const frameW = 390
  const frameH = 844
  const scale = isMobile ? 1 : Math.min(1, (vw * 0.9) / frameW, (vh * 0.95) / frameH)
  const borderRad = isMobile ? 0 : 44
  const statusColor = dark ? '#F4F4F5' : '#242424'

  return (
    <div className="flex items-center justify-center overflow-hidden" style={{
      minHeight: '100dvh',
      background: dark ? '#0E0E10' : isMobile ? '#FFFCFA' : 'radial-gradient(ellipse at 20% 30%, #FFE8DE 0%, #FFF8F4 45%, #EEF4FF 100%)',
    }}>
      {!isMobile && (
        <>
          <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'rgba(246,182,165,0.22)', filter: 'blur(80px)', top: '-100px', left: '-120px', pointerEvents: 'none' }} />
          <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'rgba(98,153,213,0.13)', filter: 'blur(70px)', bottom: '-80px', right: '-100px', pointerEvents: 'none' }} />
        </>
      )}
      <div className="relative flex flex-col overflow-hidden" data-dark={dark ? 'true' : undefined} style={{
        width: isMobile ? '100%' : frameW,
        height: isMobile ? '100dvh' : frameH,
        maxWidth: isMobile ? '100%' : frameW,
        borderRadius: borderRad,
        background: dark ? '#18181B' : '#FFFCFA',
        transform: isMobile ? 'none' : `scale(${scale})`,
        transformOrigin: 'center center',
        boxShadow: isMobile ? 'none' : '0 32px 80px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.10)',
        flexShrink: 0,
      }}>
        {/* Status bar -- purely visual, same mockup pattern as the customer
            app, so a desktop preview reads as a phone screenshot. */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1 flex-shrink-0">
          <span className="text-xs font-semibold" style={{ color: statusColor }}>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0" y="6" width="3" height="6" rx="0.5" fill={statusColor} />
              <rect x="4.5" y="4" width="3" height="8" rx="0.5" fill={statusColor} />
              <rect x="9" y="2" width="3" height="10" rx="0.5" fill={statusColor} />
              <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill={statusColor} />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 2.5C10.5 2.5 12.8 3.6 14.3 5.4L15.5 4.1C13.7 2 11 .8 8 .8s-5.7 1.2-7.5 3.3L1.7 5.4C3.2 3.6 5.5 2.5 8 2.5z" fill={statusColor} />
              <path d="M8 5.5c1.6 0 3 .7 4 1.8l1.2-1.3C11.7 4.6 10 3.8 8 3.8S4.3 4.6 2.8 6L4 7.3C5 6.2 6.4 5.5 8 5.5z" fill={statusColor} />
              <circle cx="8" cy="10.5" r="1.5" fill={statusColor} />
            </svg>
            <div className="w-5.5 h-3 rounded-sm p-0.5 flex" style={{ border: `1px solid ${dark ? 'rgba(244,244,245,0.4)' : 'rgba(36,36,36,0.4)'}` }}>
              <div className="w-3/4 h-full rounded-xs bg-[#55A67A]" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

function ProviderBottomNav({ active, onChange }: { active: NavId; onChange: (id: NavId) => void }) {
  const moreActive = active === 'more' || MORE_NAV.some(n => n.id === active)
  return (
    <div className="glass-card-strong border-t border-white/60 px-1 pt-2 pb-5 flex items-center flex-shrink-0">
      {PRIMARY_NAV.map(n => (
        <button key={n.id} onClick={() => onChange(n.id)} className="flex-1 flex flex-col items-center gap-0.5 py-1">
          <span className="text-lg">{n.icon}</span>
          <span className={`text-[10px] font-medium ${active === n.id ? 'text-[#EE674E]' : 'text-[#B0A8A4]'}`}>{n.label}</span>
        </button>
      ))}
      <button onClick={() => onChange('more')} className="flex-1 flex flex-col items-center gap-0.5 py-1">
        <span className="text-lg">☰</span>
        <span className={`text-[10px] font-medium ${moreActive ? 'text-[#EE674E]' : 'text-[#B0A8A4]'}`}>More</span>
      </button>
    </div>
  )
}

function Card({ title, compact, children }: { title?: string; compact?: boolean; children: React.ReactNode }) {
  return (
    <div className={`glass-card rounded-2xl ${compact ? 'p-3' : 'p-5'}`}>
      {title && <p className="text-[10px] font-semibold text-[#6E6E73] uppercase tracking-wide mb-2 leading-tight">{title}</p>}
      {children}
    </div>
  )
}

// Real, country-aware payout methods for the Earnings screen -- replaces
// a hardcoded "requires Stripe Connect" line that assumed every provider
// worldwide uses the same US-centric processor. Uses the same centralized
// eligibility engine as the registration-fee flow (docs/ARCHITECTURE.md
// §15), just with transaction_type='provider_payout'. No "connect"
// button here -- payouts are written by a trusted service-role process
// only (provider_payouts table), so there's no real client action to
// wire yet; this is an honest "here's what's eligible" status, not a
// working connect flow.
function PayoutMethodsCard({ countryCode, countries }: { countryCode: string | null; countries: CountryFee[] }) {
  const [methods, setMethods] = useState<EligiblePaymentMethod[] | null>(null)
  const country = countries.find(c => c.country_code === countryCode)

  useEffect(() => {
    if (!countryCode || !country) { setMethods(null); return }
    let cancelled = false
    getEligiblePaymentMethods(countryCode, country.currency, 'provider_payout').then(m => { if (!cancelled) setMethods(m) })
    return () => { cancelled = true }
  }, [countryCode, country?.currency])

  return (
    <Card title="Payout methods">
      {!countryCode ? (
        <p className="text-sm text-[#6E6E73]">Complete your provider registration to see payout methods for your country.</p>
      ) : methods === null ? (
        <p className="text-sm text-[#6E6E73]">Loading…</p>
      ) : methods.length === 0 ? (
        <p className="text-sm text-[#6E6E73]">No payout method is enabled for {country?.country_name ?? countryCode} yet. MomBestie is rolling out payout providers by country -- see Settings → Contact Support for status.</p>
      ) : (
        <div className="space-y-2">
          {methods.map(m => (
            <div key={m.provider_code} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: '#FFF8F4', border: '1.5px solid #F0E8E4' }}>
              <span className="text-sm font-semibold text-[#242424]">{m.display_name}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${m.mode === 'live' ? 'bg-[#E8F5EE] text-[#55A67A]' : 'bg-[#FEF3CD] text-[#B8860B]'}`}>{m.mode}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-[11px] text-[#6E6E73] mt-3">Payout options come from your country's configuration, same eligibility engine as your registration fee -- never hardcoded to one processor.</p>
    </Card>
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
  const [providerCountry, setProviderCountry] = useState<string | null>(null)
  const [countries, setCountries] = useState<CountryFee[]>([])
  useEffect(() => { listCountries().then(setCountries) }, [])

  // Real provider identity for the header/summary cards -- replaces the
  // "Jordan's Care Services / San Francisco, CA" demo fixture that was
  // hardcoded regardless of who was actually signed in (flagged directly:
  // "demo data must be clearly separated from production"). Falls back to
  // an honest "no profile yet" state rather than a fake name.
  const [providerProfile, setProviderProfile] = useState<{ name: string; city: string | null; status: string; verified: boolean } | null>(null)
  // Real `providers.id` for the signed-in family-service provider -- needed
  // to query/decide their real rows in the shared `bookings` table (Bookings
  // screen). Null for healthcare providers (a separate table, no bookings
  // integration yet) or anyone with no application.
  const [providerId, setProviderId] = useState<string | null>(null)

  // v2 design screen navigation -- separate from the real `view` state
  // machine above. `view` decides WHICH real flow you're in (auth vs.
  // registration vs. dashboard); `v2Screen` decides which v2 screen
  // renders within that flow (e.g. which of Splash/Welcome/SignIn/SignUp
  // is showing while view === 'auth', or which of
  // Dashboard/Bookings/AIHome/... while view === 'dashboard').
  const [v2Screen, setV2Screen] = useState<Screen>('splash')
  const [pendingSignupEmail, setPendingSignupEmail] = useState('')

  // Real registration flow state -- carries the Country -> Language ->
  // Provider Type selections through to Onboarding/HealthcareWizard's
  // real submission.
  const [regCountry, setRegCountry] = useState({ name: 'Bangladesh', code: 'BD' })
  const [regCategory, setRegCategory] = useState<{ item: string; group: string } | null>(null)

  // Real dark mode -- device-level preference (not per-account), persisted
  // across sessions, same as most native apps. See index.css for the
  // [data-dark="true"] overrides this actually drives.
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('mombestie_provider_dark') === 'true'
  })
  useEffect(() => {
    window.localStorage.setItem('mombestie_provider_dark', darkMode ? 'true' : 'false')
  }, [darkMode])

  const routeAfterAuth = async (uid: string) => {
    setUserId(uid)
    const [familyApp, healthcareApp] = await Promise.all([getMyProviderApplication(uid), getMyHealthcareApplication(uid)])
    setProviderCountry(familyApp?.country ?? healthcareApp?.country ?? null)
    if (familyApp) {
      setProviderProfile({ name: familyApp.business_name || familyApp.full_name, city: familyApp.service_city, status: familyApp.status, verified: familyApp.status === 'approved' })
      setProviderId(familyApp.id)
    } else if (healthcareApp) {
      setProviderProfile({ name: healthcareApp.practice_name || healthcareApp.legal_name, city: healthcareApp.service_city, status: healthcareApp.status, verified: healthcareApp.status === 'approved' })
      setProviderId(null)
    } else {
      setProviderProfile(null)
      setProviderId(null)
    }
    if (familyApp && familyApp.status !== 'approved') { setPendingKind('family'); setHasApplication(true); setView('pending'); return }
    if (healthcareApp && healthcareApp.status !== 'approved') { setPendingKind('healthcare'); setHasApplication(true); setView('pending'); return }
    const has = Boolean(familyApp || healthcareApp)
    setHasApplication(has)
    setView('dashboard')
    // A signed-in provider with no application on file goes straight into
    // real registration (Country -> Language -> Provider Type -> Onboarding)
    // instead of landing on a dashboard full of someone else's placeholder
    // bookings with no obvious way to actually register.
    if (!has) setV2Screen('country')
  }

  useEffect(() => {
    getCurrentUser().then(user => (user ? routeAfterAuth(user.id) : setView('auth')))
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUserId(null)
    setHasApplication(false)
    setV2Screen('welcome')
    setView('auth')
  }

  if (view === 'loading') {
    return <PhoneShell dark={darkMode}><div className="h-full flex items-center justify-center bg-[#FFFCFA]"><span className="w-8 h-8 rounded-full border-2 border-[#F0E8E4] border-t-[#EE674E] inline-block spin-slow" /></div></PhoneShell>
  }

  if (view === 'auth') {
    const afterRealAuth = async () => {
      const user = await getCurrentUser()
      if (user) await routeAfterAuth(user.id)
    }
    return (
      <PhoneShell dark={darkMode}>
        {v2Screen === 'signin' ? (
          <SignIn navigate={setV2Screen} onSignIn={async (email, password) => {
            const res = await signIn(email, password)
            if (!res.ok) return res.error ?? 'Something went wrong.'
            await afterRealAuth()
            return null
          }} />
        ) : v2Screen === 'signup' ? (
          <SignUp navigate={setV2Screen} onSignUp={async (email, password, fullName) => {
            const res = await signUp(email, password, fullName)
            if (!res.ok) return { error: res.error ?? 'Something went wrong.', needsEmailConfirmation: false }
            if (res.needsEmailConfirmation) { setPendingSignupEmail(email); return { error: null, needsEmailConfirmation: true } }
            await afterRealAuth()
            return { error: null, needsEmailConfirmation: false }
          }} />
        ) : v2Screen === 'otp' ? (
          <ConfirmEmail navigate={setV2Screen} email={pendingSignupEmail} />
        ) : v2Screen === 'forgotpassword' ? (
          <ForgotPassword navigate={setV2Screen} onReset={async email => {
            const res = await requestPasswordReset(email)
            return res.ok ? null : (res.error ?? 'Something went wrong.')
          }} />
        ) : v2Screen === 'splash' ? (
          <Splash navigate={setV2Screen} />
        ) : (
          <Welcome navigate={setV2Screen} />
        )}
      </PhoneShell>
    )
  }

  if (view === 'choose-type') {
    return <PhoneShell dark={darkMode}><ProviderTypeChoice
      onChoose={k => setView(k === 'family' ? 'onboarding-family' : 'onboarding-healthcare')}
      onCancel={() => setView(hasApplication ? 'dashboard' : 'auth')} /></PhoneShell>
  }

  if (view === 'onboarding-family') {
    return <PhoneShell dark={darkMode}><OnboardingWizard
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
      onCancel={() => setView('choose-type')} /></PhoneShell>
  }

  if (view === 'onboarding-healthcare') {
    return <PhoneShell dark={darkMode}><HealthcareWizard userId={userId!}
      onSubmitted={() => { setPendingKind('healthcare'); setHasApplication(true); setView('pending') }}
      onCancel={() => setView('choose-type')} /></PhoneShell>
  }

  if (view === 'pending') {
    return <PhoneShell dark={darkMode}><PendingStatusScreen userId={userId!} kind={pendingKind} onBackToLogin={handleSignOut} /></PhoneShell>
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

  const isMoreItem = MORE_NAV.some(n => n.id === nav)
  const currentLabel = nav === 'more' ? 'More' : NAV.find(n => n.id === nav)?.label
  void isMoreItem; void currentLabel; void decideBooking; void commission
  // (old nav-based dashboard vars kept alive above only to avoid an
  // unused-var build error while src/screens/OverviewPanel.tsx etc. still
  // reference them on disk for later reference -- not otherwise used
  // below now that the v2 Dashboard replaces this screen.)

  const v2ProviderProfile = providerProfile
    ? { name: providerProfile.name, city: providerProfile.city, verified: providerProfile.verified }
    : null

  return (
    <PhoneShell dark={darkMode}>
      {/* Real registration flow: Country -> Language -> Provider Type ->
          Onboarding (family-service) or the real HealthcareWizard
          (different table/fields entirely -- license, specialty,
          credentials -- so a Healthcare-group pick routes there instead
          of into Onboarding.tsx). This is the flow item 1's complaint was
          about: it exists for real now, not skipped in favor of the old
          plainer wizard. */}
      {v2Screen === 'country' ? (
        <CountrySelect navigate={setV2Screen} onSelect={(name, code) => { setRegCountry({ name, code }); setV2Screen('language') }} />
      ) : v2Screen === 'language' ? (
        <LanguageSelect navigate={setV2Screen} country={regCountry.name} countryCode={regCountry.code} />
      ) : v2Screen === 'providertype' ? (
        <ProviderType navigate={setV2Screen} onContinue={(item, group) => {
          setRegCategory({ item, group })
          setV2Screen('onboarding')
        }} />
      ) : v2Screen === 'onboarding' && regCategory?.group === 'Healthcare' ? (
        <HealthcareWizard userId={userId!}
          onSubmitted={() => { setPendingKind('healthcare'); setHasApplication(true); setV2Screen('dashboard'); setView('pending') }}
          onCancel={() => setV2Screen('providertype')} />
      ) : v2Screen === 'onboarding' && regCategory ? (
        <Onboarding navigate={setV2Screen}
          category={regCategory.item} categoryGroup={regCategory.group}
          countryCode={regCountry.code} countryName={regCountry.name}
          currencySymbol={countries.find(c => c.country_code === regCountry.code)?.currency_symbol ?? '$'}
          commissionPct={countries.find(c => c.country_code === regCountry.code)?.commission_pct ?? null}
          userId={userId!}
          onSubmitted={() => { setPendingKind('family'); setHasApplication(true); setV2Screen('dashboard'); setView('pending') }} />
      ) : v2Screen === 'bookings' ? <Bookings navigate={setV2Screen} providerId={providerId} />
        : v2Screen === 'ai' ? <AIHome navigate={setV2Screen} />
        : v2Screen === 'messages' ? <Messages navigate={setV2Screen} />
        : v2Screen === 'earnings' ? <Earnings navigate={setV2Screen} />
        : v2Screen === 'settings' ? <SettingsV2 navigate={setV2Screen} onSignOut={handleSignOut} />
        : v2Screen === 'more' ? <MoreV2 navigate={setV2Screen} onSignOut={handleSignOut} />
        : v2Screen === 'calendar' ? <Calendar navigate={setV2Screen} />
        : v2Screen === 'profile' ? <ProviderProfileV2 navigate={setV2Screen} />
        : v2Screen === 'reviews' ? <Reviews navigate={setV2Screen} />
        : v2Screen === 'notifications' ? <Notifications navigate={setV2Screen} />
        : v2Screen === 'smartpricing' ? <SmartPricing navigate={setV2Screen} />
        : v2Screen === 'marketinsights' ? <MarketInsights navigate={setV2Screen} />
        : v2Screen === 'healthcare' ? <HealthcareV2 navigate={setV2Screen} />
        : v2Screen === 'support' ? <Support navigate={setV2Screen} />
        : <Dashboard navigate={setV2Screen} providerProfile={v2ProviderProfile} />
      }
    </PhoneShell>
  )
}
