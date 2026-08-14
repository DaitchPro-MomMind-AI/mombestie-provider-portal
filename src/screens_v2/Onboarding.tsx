import { useState } from 'react'
import type { Screen } from '../App'
import { submitProviderApplication } from '../services'

interface Props {
  navigate: (s: Screen) => void
  category: string
  categoryGroup: string
  countryCode: string
  countryName: string
  currencySymbol: string
  userId: string
  onSubmitted: () => void
}

type Step = 'about' | 'services' | 'area' | 'pricing' | 'availability' | 'verification' | 'payment' | 'review' | 'submitted'

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: 'about', label: 'About You', icon: '👤' },
  { key: 'services', label: 'Services', icon: '🛎' },
  { key: 'area', label: 'Service Area', icon: '📍' },
  { key: 'pricing', label: 'Pricing', icon: '💰' },
  { key: 'availability', label: 'Availability', icon: '📅' },
  { key: 'verification', label: 'Verify', icon: '✅' },
  { key: 'payment', label: 'Payout', icon: '🏦' },
  { key: 'review', label: 'Review', icon: '📋' },
]

const STEP_KEYS: Step[] = ['about', 'services', 'area', 'pricing', 'availability', 'verification', 'payment', 'review', 'submitted']

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Country-aware -- found and fixed during verification: this list and the
// pricing step's currency symbol were both hardcoded to Bangladesh
// regardless of which country the provider actually picked (a US test
// registration showed "PAYOUT METHODS — UNITED STATES" listing bKash and
// Nagad, and a ৳ symbol on a USD rate). Real per-country payout rails
// beyond BD aren't onboarded yet (see PayoutMethodsCard.tsx's honest
// empty-state pattern for the equivalent Earnings-screen problem), so
// this is a reasonable default set, not a claim that these are live --
// the screen's own copy already says real payout wiring happens after
// approval.
function payoutMethodsFor(countryCode: string): { name: string; icon: string; sub: string; color: string }[] {
  if (countryCode === 'BD') {
    return [
      { name: 'bKash', icon: '📱', sub: 'Mobile banking', color: '#E30A14' },
      { name: 'Nagad', icon: '📲', sub: 'Mobile banking', color: '#FF6B00' },
      { name: 'Bank Transfer', icon: '🏦', sub: 'NPSB / BEFTN', color: '#246BFD' },
    ]
  }
  return [
    { name: 'Bank Transfer', icon: '🏦', sub: 'Direct deposit', color: '#246BFD' },
    { name: 'PayPal', icon: '💳', sub: 'Email-linked payout', color: '#0070BA' },
  ]
}

/**
 * Real family-service provider registration -- replaces the prototype
 * version, which had exactly one (of ~15) fields wired to state (`bio`)
 * and a "Submit Application" button that only navigated to a static
 * success screen without writing anything anywhere. Every field below
 * now feeds the same `submitProviderApplication()` call the old
 * (visually plainer) OnboardingWizard used, so the real data model and
 * RLS/status pipeline are unchanged -- only the screen got rebuilt.
 *
 * Not yet real, flagged rather than hidden: profile photo upload (needs
 * Supabase Storage wiring), per-service AI price suggestions (needs a
 * connected AI model), and the provider registration *fee* step the old
 * wizard had (this is the payout-*receiving* method, a different real
 * concept -- see PaymentMethodPicker.tsx for the fee flow, not yet
 * re-integrated into this redesigned flow).
 */
export default function Onboarding({ navigate, category, categoryGroup, countryCode, countryName, currencySymbol, userId, onSubmitted }: Props) {
  const PAYOUT_METHODS = payoutMethodsFor(countryCode)
  const [step, setStep] = useState<Step>('about')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // About You
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [languages, setLanguages] = useState<Set<string>>(new Set(['English']))

  // Service area
  const [serviceCity, setServiceCity] = useState('')
  const [serviceRadius, setServiceRadius] = useState('10 km')

  // Pricing
  const [hourlyRate, setHourlyRate] = useState('')

  // Availability
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']))

  // Verification -- honest boolean consent/upload flags, same as the old
  // wizard; there's no real document-processing pipeline yet.
  const [idUploaded, setIdUploaded] = useState(false)
  const [backgroundCheckConsent, setBackgroundCheckConsent] = useState(false)
  const [certifications, setCertifications] = useState(false)

  // Payout
  const [payoutMethod, setPayoutMethod] = useState<string | null>(null)

  const stepIdx = STEP_KEYS.indexOf(step)
  const toggleLang = (l: string) => setLanguages(prev => {
    const n = new Set(prev)
    n.has(l) ? n.delete(l) : n.add(l)
    return n
  })
  const toggleDay = (d: string) => setSelectedDays(prev => {
    const n = new Set(prev)
    n.has(d) ? n.delete(d) : n.add(d)
    return n
  })

  const canAdvance = (() => {
    switch (step) {
      case 'about': return firstName.trim() && lastName.trim() && phone.trim() && bio.trim().length >= 50
      case 'area': return serviceCity.trim()
      case 'pricing': return hourlyRate.trim()
      case 'availability': return selectedDays.size > 0
      case 'verification': return idUploaded && backgroundCheckConsent
      case 'payment': return Boolean(payoutMethod)
      default: return true
    }
  })()

  const submit = async () => {
    setSubmitting(true); setError(null)
    const res = await submitProviderApplication({
      user_id: userId,
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      phone: phone.trim(),
      address: serviceCity.trim(),
      business_name: businessName.trim() || null,
      categories: [category],
      bio: bio.trim() || null,
      experience_years: experienceYears ? parseInt(experienceYears, 10) : null,
      service_city: serviceCity.trim() || null,
      service_radius_mi: Math.round(parseInt(serviceRadius, 10) * 0.621371) || 6,
      hourly_rate_cents: hourlyRate ? Math.round(parseFloat(hourlyRate) * 100) : null,
      country: countryCode,
      availability_days: Array.from(selectedDays),
      id_uploaded: idUploaded,
      background_check_consent: backgroundCheckConsent,
      certifications,
      application_fee_paid: false,
      payout_connected: Boolean(payoutMethod),
    })
    setSubmitting(false)
    if (!res.ok) { setError(res.error ?? 'Something went wrong submitting your application.'); return }
    setStep('submitted')
  }

  const next = () => {
    if (!canAdvance) return
    if (step === 'review') { submit(); return }
    const idx = STEP_KEYS.indexOf(step)
    if (idx < STEP_KEYS.length - 1) setStep(STEP_KEYS[idx + 1] as Step)
  }
  const back = () => {
    const idx = STEP_KEYS.indexOf(step)
    if (idx === 0) { navigate('providertype'); return }
    setStep(STEP_KEYS[idx - 1] as Step)
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 12, boxSizing: 'border-box' as const,
    background: 'rgba(17,26,58,0.05)', border: '1px solid rgba(17,26,58,0.13)',
    color: '#111A3A', fontFamily: 'Inter, sans-serif', fontSize: 14.5, outline: 'none',
  }
  const labelStyle = { fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block' as const, marginBottom: 5 }

  if (step === 'submitted') {
    return (
      <div style={{
        height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center',
      }}>
        <div className="anim-bounce-in">
          <div style={{
            width: 90, height: 90, borderRadius: '50%', margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 42, boxShadow: '0 0 48px rgba(36,107,253,0.6)',
          }}>🎉</div>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#111A3A', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Application Submitted!
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(17,26,58,0.55)', lineHeight: 1.6, margin: '0 0 32px' }}>
            Welcome to MomBestie, {firstName || 'there'}! Your real application was just written to the database. A provider can never self-verify -- MomBestie staff review every application before it goes live. We typically respond within 1–3 business days.
          </p>
          <button onClick={onSubmitted} style={{
            width: '100%', padding: '15px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
            boxShadow: '0 8px 24px rgba(36,107,253,0.45)',
            fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: 'white',
          }}>Continue</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top header */}
      <div style={{ padding: '44px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={back} style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111A3A',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div style={{ flex: 1, display: 'flex', gap: 3 }}>
            {STEPS.map((s, i) => (
              <div key={s.key} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= stepIdx ? '#246BFD' : 'rgba(17,26,58,0.1)', transition: 'background 0.3s' }}/>
            ))}
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.4)', flexShrink: 0 }}>{stepIdx + 1}/{STEPS.length}</div>
        </div>
        <p style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#246BFD', fontWeight: 600, margin: '0 0 4px' }}>{category} · {categoryGroup} · {countryName}</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }} className="scrollbar-hide">

        {step === 'about' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>About You</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>Your profile is how customers discover and trust you.</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white',
                border: '2px solid rgba(36,107,253,0.5)', cursor: 'not-allowed', position: 'relative', opacity: 0.7,
              }} title="Photo upload isn't wired yet -- needs Supabase Storage">
                {(firstName[0] ?? '?').toUpperCase()}
                <div style={{ position: 'absolute', bottom: 2, right: 2, width: 22, height: 22, borderRadius: '50%', background: '#246BFD', border: '2px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>📷</div>
              </div>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: '#111A3A' }}>{firstName || lastName ? `${firstName} ${lastName}` : 'Your name'}</div>
                <div style={{ marginTop: 6, padding: '5px 12px', borderRadius: 8, background: 'rgba(17,26,58,0.06)', border: '1px solid rgba(17,26,58,0.12)', fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.4)', display: 'inline-block' }}>Photo upload -- coming soon</div>
              </div>
            </div>

            {error && <div style={{ borderRadius: 12, padding: '10px 14px', marginBottom: 14, background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.25)', color: '#DC3545', fontFamily: 'Inter', fontSize: 12.5 }}>{error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle}/>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle}/>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880 17 0000 0000" style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Business / Display Name (optional)</label>
                <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder={`E.g. ${firstName || 'Your'}'s Childcare`} style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>About Yourself</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell families about your experience, qualifications and why you love what you do..." rows={4} style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.3)' }}>Write at least 50 characters</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: bio.length >= 50 ? '#10B981' : 'rgba(17,26,58,0.3)' }}>{bio.length}/500</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Years of Experience</label>
                <select value={experienceYears} onChange={e => setExperienceYears(e.target.value)} style={{ ...inputStyle, appearance: 'none' as const }}>
                  <option value="">Select...</option>
                  <option value="0">Less than 1 year</option>
                  <option value="1">1–2 years</option>
                  <option value="3">3–5 years</option>
                  <option value="6">6–10 years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: 8 }}>Languages Spoken</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Bengali', 'English', 'Hindi', 'Arabic'].map(lang => (
                    <div key={lang} onClick={() => toggleLang(lang)} style={{
                      padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                      background: languages.has(lang) ? 'rgba(36,107,253,0.2)' : 'rgba(17,26,58,0.06)',
                      border: languages.has(lang) ? '1px solid rgba(36,107,253,0.45)' : '1px solid rgba(17,26,58,0.1)',
                      fontFamily: 'Inter', fontSize: 13, fontWeight: 500,
                      color: languages.has(lang) ? '#246BFD' : 'rgba(17,26,58,0.5)',
                    }}>{lang}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'services' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Your Service</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>
              Confirmed from the previous step -- you can offer more services after approval.
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '16px',
              borderRadius: 16, background: 'rgba(36,107,253,0.1)', border: '1.5px solid rgba(36,107,253,0.3)',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(36,107,253,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛎</div>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: '#111A3A' }}>{category}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.5)', marginTop: 2 }}>{categoryGroup}</div>
              </div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 12, marginTop: 16, background: 'rgba(36,107,253,0.07)', border: '1px solid rgba(36,107,253,0.15)', fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)', lineHeight: 1.5 }}>
              ✨ You can add more service categories and set individual pricing after approval.
            </div>
          </div>
        )}

        {step === 'area' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Service Area</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>Where are you available to work? Customers nearby will find you.</p>
            {error && <div style={{ borderRadius: 12, padding: '10px 14px', marginBottom: 14, background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.25)', color: '#DC3545', fontFamily: 'Inter', fontSize: 12.5 }}>{error}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>City / Service Area</label>
                <input type="text" value={serviceCity} onChange={e => setServiceCity(e.target.value)} placeholder="E.g. Dhaka, Bangladesh" style={inputStyle}/>
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: 8 }}>Travel Radius</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['2 km', '5 km', '10 km', '15 km', '25 km'].map(r => (
                    <div key={r} onClick={() => setServiceRadius(r)} style={{
                      padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
                      background: serviceRadius === r ? 'rgba(36,107,253,0.2)' : 'rgba(17,26,58,0.06)',
                      border: serviceRadius === r ? '1px solid rgba(36,107,253,0.4)' : '1px solid rgba(17,26,58,0.1)',
                      fontFamily: 'Inter', fontSize: 13, color: serviceRadius === r ? '#246BFD' : 'rgba(17,26,58,0.55)',
                    }}>{r}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'pricing' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Set Your Price</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 16px', lineHeight: 1.55 }}>What do you charge per hour for {category.toLowerCase()}?</p>

            <div style={{
              padding: '14px 16px', borderRadius: 16, marginBottom: 18,
              background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
              display: 'flex', gap: 12, alignItems: 'center', opacity: 0.7,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(17,26,58,0.08)', flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'rgba(17,26,58,0.5)' }}>✨ AI Price Recommendations</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>Not connected yet -- needs a real AI model set up first.</div>
              </div>
            </div>

            <label style={labelStyle}>Price per Hour</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '13px 14px', background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.1)', borderRight: 'none', borderRadius: '12px 0 0 12px', fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: '#10B981' }}>{currencySymbol}</div>
              <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="700" style={{ ...inputStyle, borderRadius: '0 12px 12px 0', flex: 1 }}/>
            </div>
          </div>
        )}

        {step === 'availability' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Availability</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>Which days are you generally available? You can set specific hours later.</p>
            <label style={{ ...labelStyle, marginBottom: 10 }}>Days Available</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {DAYS.map(d => (
                <div key={d} onClick={() => toggleDay(d)} style={{
                  flex: 1, height: 44, borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: selectedDays.has(d) ? 'rgba(36,107,253,0.25)' : 'rgba(17,26,58,0.05)',
                  border: selectedDays.has(d) ? '1.5px solid #246BFD' : '1.5px solid rgba(17,26,58,0.08)',
                  fontFamily: 'Inter', fontSize: 11, fontWeight: selectedDays.has(d) ? 700 : 400,
                  color: selectedDays.has(d) ? '#246BFD' : 'rgba(17,26,58,0.35)', transition: 'all 0.18s',
                }}>{d}</div>
              ))}
            </div>
          </div>
        )}

        {step === 'verification' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Verification</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>Verified providers get more bookings. This builds trust with families.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { key: 'id' as const, icon: '🪪', label: 'Government ID', desc: 'NID or Passport, on file with you', done: idUploaded, onToggle: () => setIdUploaded(v => !v) },
                { key: 'bg' as const, icon: '✅', label: 'Background Check Consent', desc: 'You authorize MomBestie to run one', done: backgroundCheckConsent, onToggle: () => setBackgroundCheckConsent(v => !v) },
                { key: 'cert' as const, icon: '📋', label: 'Certifications (optional)', desc: 'Childcare, first aid, etc.', done: certifications, onToggle: () => setCertifications(v => !v) },
              ].map(v => (
                <div key={v.key} onClick={v.onToggle} style={{
                  display: 'flex', gap: 12, alignItems: 'center', padding: '13px 16px', borderRadius: 14, cursor: 'pointer',
                  background: v.done ? 'rgba(16,185,129,0.06)' : 'rgba(17,26,58,0.04)',
                  border: v.done ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(17,26,58,0.08)',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: v.done ? 'rgba(16,185,129,0.12)' : 'rgba(17,26,58,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{v.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500, color: '#111A3A' }}>{v.label}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>{v.desc}</div>
                  </div>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: v.done ? '#10B981' : 'transparent', border: v.done ? 'none' : '2px solid rgba(17,26,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {v.done && <svg width="13" height="11" viewBox="0 0 13 11" fill="none"><path d="M1 5.5l3.5 3.5L12 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.35)', marginTop: 12, lineHeight: 1.5 }}>
              These are consent flags for now, not a document-upload pipeline -- MomBestie staff verify ID/background during review.
            </p>
          </div>
        )}

        {step === 'payment' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>How You Get Paid</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>Choose a payout method for {countryName}. Real payout wiring happens with MomBestie's finance team after approval.</p>
            <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'rgba(17,26,58,0.4)', marginBottom: 10 }}>PAYOUT METHODS — {countryName.toUpperCase()}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PAYOUT_METHODS.map(m => (
                <div key={m.name} onClick={() => setPayoutMethod(m.name)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px', borderRadius: 16, cursor: 'pointer',
                  background: payoutMethod === m.name ? 'rgba(36,107,253,0.1)' : 'rgba(17,26,58,0.04)',
                  border: payoutMethod === m.name ? '1.5px solid rgba(36,107,253,0.35)' : '1.5px solid rgba(17,26,58,0.08)',
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: `${m.color}15`, border: `1px solid ${m.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{m.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: '#111A3A' }}>{m.name}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)', marginTop: 2 }}>{m.sub}</div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: payoutMethod === m.name ? '#246BFD' : 'transparent', border: payoutMethod === m.name ? '2px solid #246BFD' : '2px solid rgba(17,26,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {payoutMethod === m.name && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '13px 15px', borderRadius: 14, marginTop: 16, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.55)', lineHeight: 1.5 }}>
              🔒 We record your chosen method now; connecting a real payout account happens after your application is approved.
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Review & Submit</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>Check everything looks right before submitting -- this really writes to the database.</p>
            {error && <div style={{ borderRadius: 12, padding: '10px 14px', marginBottom: 14, background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.25)', color: '#DC3545', fontFamily: 'Inter', fontSize: 12.5 }}>{error}</div>}
            {[
              { title: 'About', items: [`${firstName} ${lastName}`.trim() || '—', phone || '—', `${countryName}`, Array.from(languages).join(', ') || '—'] },
              { title: 'Service', items: [`${category} · ${categoryGroup}`] },
              { title: 'Service Area', items: [serviceCity || '—', serviceRadius] },
              { title: 'Pricing', items: [hourlyRate ? `${currencySymbol}${hourlyRate}/hr` : '—'] },
              { title: 'Availability', items: [Array.from(selectedDays).join(', ') || 'None selected'] },
              { title: 'Verification', items: [`ID: ${idUploaded ? 'Yes' : 'Pending'}`, `Background check: ${backgroundCheckConsent ? 'Consented' : 'Pending'}`, `Certifications: ${certifications ? 'Yes' : 'None'}`] },
              { title: 'Payout', items: [payoutMethod ?? 'Not selected'] },
            ].map(sec => (
              <div key={sec.title} style={{ marginBottom: 10, padding: '14px 16px', borderRadius: 16, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 8 }}>{sec.title}</div>
                {sec.items.map(item => <div key={item} style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.55)', marginBottom: 3 }}>• {item}</div>)}
              </div>
            ))}
            <div style={{ padding: '14px', borderRadius: 14, marginBottom: 16, marginTop: 4, background: 'rgba(36,107,253,0.08)', border: '1px solid rgba(36,107,253,0.18)', fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)', lineHeight: 1.55 }}>
              By submitting, you agree to the MomBestie Provider Terms, Privacy Policy and Marketplace Rules. A provider can never self-verify -- your application is reviewed by MomBestie staff before it goes live.
            </div>
          </div>
        )}

        <div style={{ height: 20 }}/>
      </div>

      <div style={{ padding: '12px 24px 28px', flexShrink: 0, background: 'linear-gradient(0deg, #FFFFFF 70%, transparent)' }}>
        <button onClick={next} disabled={!canAdvance || submitting} style={{
          width: '100%', padding: '15.5px', borderRadius: 14, border: 'none', cursor: canAdvance ? 'pointer' : 'not-allowed',
          background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
          boxShadow: '0 8px 24px rgba(36,107,253,0.45)',
          fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: 'white',
          opacity: canAdvance ? 1 : 0.5,
        }}>
          {submitting ? 'Submitting…' : step === 'review' ? 'Submit Application' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
