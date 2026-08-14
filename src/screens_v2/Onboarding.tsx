import { useState } from 'react'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

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

export default function Onboarding({ navigate }: Props) {
  const [step, setStep] = useState<Step>('about')
  const [bio, setBio] = useState('')
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set(['Mon','Tue','Wed','Thu']))
  const [aiPriceVisible, setAiPriceVisible] = useState(false)
  const [aiPriceLoading, setAiPriceLoading] = useState(false)
  const [useAiPrice, setUseAiPrice] = useState(false)

  const stepIdx = STEP_KEYS.indexOf(step)

  const next = () => {
    if (step === 'review') { setStep('submitted'); return }
    const idx = STEP_KEYS.indexOf(step)
    if (idx < STEP_KEYS.length - 1) setStep(STEP_KEYS[idx + 1] as Step)
  }
  const back = () => {
    const idx = STEP_KEYS.indexOf(step)
    if (idx === 0) { navigate('providertype'); return }
    setStep(STEP_KEYS[idx - 1] as Step)
  }

  const toggleDay = (d: string) => {
    setSelectedDays(prev => {
      const n = new Set(prev)
      n.has(d) ? n.delete(d) : n.add(d)
      return n
    })
  }

  const showAiPrice = () => {
    setAiPriceLoading(true)
    setTimeout(() => { setAiPriceLoading(false); setAiPriceVisible(true) }, 1600)
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 12, boxSizing: 'border-box' as const,
    background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.13)',
    color: 'white', fontFamily: 'Inter, sans-serif', fontSize: 14.5, outline: 'none',
  }

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
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: 'white', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Application Submitted!
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(17,26,58,0.55)', lineHeight: 1.6, margin: '0 0 32px' }}>
            Welcome to MomBestie, Ayesha! Your provider application is under review. We typically respond within 1–3 business days.
          </p>
          {/* Status cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32, width: '100%' }}>
            {[
              { label: 'Profile', status: 'Complete', color: '#10B981' },
              { label: 'Services', status: 'Complete', color: '#10B981' },
              { label: 'Verification', status: 'Under Review', color: '#F59E0B' },
              { label: 'Payment Setup', status: 'Complete', color: '#10B981' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderRadius: 14,
                background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
              }}>
                <span style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.7)' }}>{s.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }}/>
                  <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: s.color, fontWeight: 600 }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('dashboard')} style={{
            width: '100%', padding: '15px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
            boxShadow: '0 8px 24px rgba(36,107,253,0.45)',
            fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: 'white',
          }}>Go to Dashboard</button>
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
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          {/* Step indicator pills */}
          <div style={{ flex: 1, display: 'flex', gap: 3 }}>
            {STEPS.map((s, i) => (
              <div key={s.key} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= stepIdx ? '#246BFD' : 'rgba(17,26,58,0.1)',
                transition: 'background 0.3s',
              }}/>
            ))}
          </div>

          <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.4)', flexShrink: 0 }}>
            {stepIdx + 1}/{STEPS.length}
          </div>
        </div>

        {/* Save for later */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Inter', fontSize: 12, color: '#246BFD', fontWeight: 500,
          }}>Save & Continue Later</button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }} className="scrollbar-hide">

        {/* ABOUT YOU */}
        {step === 'about' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>About You</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>
              Your profile is how customers discover and trust you.
            </p>

            {/* Profile photo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white',
                border: '2px solid rgba(36,107,253,0.5)', cursor: 'pointer', position: 'relative',
              }}>
                AR
                <div style={{
                  position: 'absolute', bottom: 2, right: 2, width: 22, height: 22, borderRadius: '50%',
                  background: '#246BFD', border: '2px solid #FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                }}>📷</div>
              </div>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white' }}>Ayesha Rahman</div>
                <button style={{
                  marginTop: 6, padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                  background: 'rgba(36,107,253,0.15)', border: '1px solid rgba(36,107,253,0.3)',
                  fontFamily: 'Inter', fontSize: 12, color: '#246BFD',
                }}>Upload Photo</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 5 }}>First Name</label>
                  <input type="text" defaultValue="Ayesha" style={inputStyle}/>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 5 }}>Last Name</label>
                  <input type="text" defaultValue="Rahman" style={inputStyle}/>
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 5 }}>Display Name (optional)</label>
                <input type="text" placeholder="E.g. Ayesha's Childcare" style={inputStyle}/>
              </div>
              <div>
                <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 5 }}>About Yourself</label>
                <textarea
                  value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="Tell families about your experience, qualifications and why you love what you do..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.3)' }}>Write at least 50 characters</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: bio.length >= 50 ? '#10B981' : 'rgba(17,26,58,0.3)' }}>{bio.length}/500</span>
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 5 }}>Years of Experience</label>
                <select style={{ ...inputStyle, appearance: 'none' as const }}>
                  <option>Select...</option>
                  <option>Less than 1 year</option>
                  <option>1–2 years</option>
                  <option selected>3–5 years</option>
                  <option>6–10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
              <div>
                <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 8 }}>Languages Spoken</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Bengali', 'English', 'Hindi', 'Arabic'].map(lang => (
                    <div key={lang} style={{
                      padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                      background: ['Bengali','English'].includes(lang) ? 'rgba(36,107,253,0.2)' : 'rgba(17,26,58,0.06)',
                      border: ['Bengali','English'].includes(lang) ? '1px solid rgba(36,107,253,0.45)' : '1px solid rgba(17,26,58,0.1)',
                      fontFamily: 'Inter', fontSize: 13, fontWeight: 500,
                      color: ['Bengali','English'].includes(lang) ? '#246BFD' : 'rgba(17,26,58,0.5)',
                    }}>{lang}</div>
                  ))}
                  <div style={{
                    padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                    background: 'rgba(17,26,58,0.04)', border: '1px dashed rgba(17,26,58,0.15)',
                    fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.3)',
                  }}>+ Add</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES */}
        {step === 'services' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Your Services</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>
              Tell families what you offer and customize each service.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[
                { name: 'Babysitting', icon: '👶', active: true, price: '৳700/hr' },
                { name: 'Childcare', icon: '🧸', active: true, price: '৳700/hr' },
                { name: 'Newborn Care', icon: '🍼', active: true, price: '৳2,100/hr' },
                { name: 'Overnight Care', icon: '🌙', active: false, price: null },
                { name: 'Family Assistant', icon: '🏠', active: false, price: null },
              ].map(svc => (
                <div key={svc.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                  borderRadius: 16,
                  background: svc.active ? 'rgba(36,107,253,0.1)' : 'rgba(17,26,58,0.04)',
                  border: svc.active ? '1.5px solid rgba(36,107,253,0.3)' : '1.5px solid rgba(17,26,58,0.08)',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: svc.active ? 'rgba(36,107,253,0.15)' : 'rgba(17,26,58,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>{svc.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, fontWeight: 700, color: svc.active ? 'white' : 'rgba(17,26,58,0.5)' }}>{svc.name}</div>
                    {svc.price && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#10B981', marginTop: 2 }}>{svc.price}</div>}
                  </div>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: svc.active ? '#246BFD' : 'transparent',
                    border: svc.active ? '2px solid #246BFD' : '2px solid rgba(17,26,58,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {svc.active && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '12px 14px', borderRadius: 12, marginBottom: 16,
              background: 'rgba(36,107,253,0.07)', border: '1px solid rgba(36,107,253,0.15)',
              fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)', lineHeight: 1.5,
            }}>
              ✨ You can customize each service's description, pricing, duration and availability after approval.
            </div>
          </div>
        )}

        {/* SERVICE AREA */}
        {step === 'area' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Service Area</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>
              Where are you available to work? Customers nearby will find you.
            </p>

            {/* Map placeholder */}
            <div style={{
              height: 160, borderRadius: 18, marginBottom: 18, position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(145deg, rgba(36,107,253,0.12), rgba(16,185,129,0.06))',
              border: '1px solid rgba(36,107,253,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Grid lines */}
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${i * 33.33}%`, borderTop: '1px solid rgba(36,107,253,0.1)' }}/>
              ))}
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${i * 33.33}%`, borderLeft: '1px solid rgba(36,107,253,0.1)' }}/>
              ))}
              {/* Center pin */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(36,107,253,0.25)', border: '2px solid rgba(36,107,253,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 0 20px rgba(36,107,253,0.07), 0 0 0 36px rgba(36,107,253,0.04)',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#246BFD" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 10, right: 12, fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.4)' }}>Gulshan, Dhaka</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 5 }}>Your Location</label>
                <input type="text" defaultValue="Gulshan-1, Dhaka, Bangladesh" style={inputStyle}/>
              </div>
              <div>
                <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 8 }}>Travel Radius</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['2 km', '5 km', '10 km', '15 km', 'Only at my location'].map(r => (
                    <div key={r} style={{
                      padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
                      background: r === '10 km' ? 'rgba(36,107,253,0.2)' : 'rgba(17,26,58,0.06)',
                      border: r === '10 km' ? '1px solid rgba(36,107,253,0.4)' : '1px solid rgba(17,26,58,0.1)',
                      fontFamily: 'Inter', fontSize: 13, color: r === '10 km' ? '#246BFD' : 'rgba(17,26,58,0.55)',
                    }}>{r}</div>
                  ))}
                </div>
              </div>
              <div style={{
                padding: '13px 15px', borderRadius: 14,
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.55)', lineHeight: 1.5,
              }}>
                📍 With a 10 km radius from Gulshan-1, you'll reach Banani, Baridhara, Bashundhara, Mohakhali and parts of Uttara.
              </div>
            </div>
          </div>
        )}

        {/* PRICING */}
        {step === 'pricing' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Set Your Prices</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>
              AI will analyze the local market and suggest competitive prices.
            </p>

            {/* AI pricing card */}
            {aiPriceVisible ? (
              <div style={{
                padding: '16px', borderRadius: 18, marginBottom: 18,
                background: 'linear-gradient(135deg, rgba(36,107,253,0.15), rgba(168,85,247,0.08))',
                border: '1px solid rgba(36,107,253,0.3)',
              }} className="anim-fade-slide">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'radial-gradient(circle, #5BAAFF, #246BFD)', boxShadow: '0 0 12px rgba(36,107,253,0.5)' }} className="anim-orb-idle"/>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#5BAAFF' }}>AI Smart Pricing — Dhaka, BD</div>
                </div>
                {[
                  { service: 'Babysitting', yours: '৳700', ai: '৳800', range: '৳650–৳950', status: 'Competitive', statusColor: '#10B981' },
                  { service: 'Childcare', yours: '৳700', ai: '৳780', range: '৳600–৳900', status: 'Competitive', statusColor: '#10B981' },
                  { service: 'Newborn Care', yours: '৳2,100', ai: '৳2,400', range: '৳1,800–৳3,000', status: 'Below Market', statusColor: '#F59E0B' },
                ].map(p => (
                  <div key={p.service} style={{
                    padding: '12px 14px', borderRadius: 14, marginBottom: 8,
                    background: 'rgba(17,26,58,0.05)', border: '1px solid rgba(17,26,58,0.08)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white' }}>{p.service}</span>
                      <div style={{ padding: '3px 9px', borderRadius: 20, background: `${p.statusColor}15`, border: `1px solid ${p.statusColor}30`, fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, color: p.statusColor }}>{p.status}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div>
                        <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(17,26,58,0.35)' }}>Your Price</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: 'white', fontWeight: 700 }}>{p.yours}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(17,26,58,0.35)' }}>AI Recommended</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: '#246BFD', fontWeight: 700 }}>{p.ai}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(17,26,58,0.35)' }}>Local Range</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(17,26,58,0.5)', fontWeight: 500 }}>{p.range}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button onClick={() => setUseAiPrice(true)} style={{
                    flex: 1, padding: '11px', borderRadius: 12, cursor: 'pointer',
                    background: useAiPrice ? '#10B981' : 'rgba(36,107,253,0.35)', border: useAiPrice ? 'none' : '1px solid rgba(36,107,253,0.5)',
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'white',
                  }}>{useAiPrice ? '✓ AI Price Applied' : 'Use AI Prices'}</button>
                  <button style={{
                    flex: 1, padding: '11px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.12)',
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'rgba(17,26,58,0.7)',
                  }}>Keep My Prices</button>
                </div>
              </div>
            ) : aiPriceLoading ? (
              <div style={{
                padding: '20px', borderRadius: 18, marginBottom: 18, textAlign: 'center',
                background: 'rgba(36,107,253,0.08)', border: '1px solid rgba(36,107,253,0.2)',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'radial-gradient(circle, #5BAAFF, #246BFD)', margin: '0 auto 10px', boxShadow: '0 0 12px rgba(36,107,253,0.5)' }} className="anim-orb-think"/>
                <div style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.6)' }}>Analyzing Dhaka childcare market…</div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#246BFD', animation: `pulseDot 1.2s ${i * 0.2}s ease-in-out infinite` }}/>
                  ))}
                </div>
              </div>
            ) : (
              <button onClick={showAiPrice} style={{
                width: '100%', padding: '16px', borderRadius: 18, cursor: 'pointer', marginBottom: 18,
                background: 'linear-gradient(135deg, rgba(36,107,253,0.2), rgba(168,85,247,0.1))',
                border: '1px solid rgba(36,107,253,0.3)',
                display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'radial-gradient(circle, #5BAAFF, #246BFD)', flexShrink: 0, boxShadow: '0 0 14px rgba(36,107,253,0.5)' }} className="anim-orb-idle"/>
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white' }}>✨ Get AI Price Recommendations</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)', marginTop: 3 }}>See local market ranges for Dhaka, BD</div>
                </div>
              </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Babysitting', 'Childcare', 'Newborn Care'].map(svc => (
                <div key={svc}>
                  <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 5 }}>{svc} — Price per Hour</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <div style={{
                      padding: '13px 14px', background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.1)',
                      borderRight: 'none', borderRadius: '12px 0 0 12px',
                      fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: '#10B981',
                    }}>৳</div>
                    <input type="number" defaultValue={svc === 'Newborn Care' ? 2100 : 700} style={{
                      ...inputStyle, borderRadius: '0 12px 12px 0', flex: 1,
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AVAILABILITY */}
        {step === 'availability' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Availability</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>
              When are you available to work? You can always update this later.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 10 }}>Days Available</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {DAYS.map(d => (
                  <div key={d} onClick={() => toggleDay(d)} style={{
                    flex: 1, height: 44, borderRadius: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: selectedDays.has(d) ? 'rgba(36,107,253,0.25)' : 'rgba(17,26,58,0.05)',
                    border: selectedDays.has(d) ? '1.5px solid #246BFD' : '1.5px solid rgba(17,26,58,0.08)',
                    fontFamily: 'Inter', fontSize: 11, fontWeight: selectedDays.has(d) ? 700 : 400,
                    color: selectedDays.has(d) ? '#246BFD' : 'rgba(17,26,58,0.35)',
                    transition: 'all 0.18s',
                  }}>{d}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {[['Start Time', '09:00 AM'], ['End Time', '06:00 PM']].map(([label, val]) => (
                <div key={label}>
                  <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{val}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.3)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Last-minute bookings (same day)', enabled: true },
                { label: 'Overnight bookings', enabled: false },
                { label: 'Holiday availability', enabled: false },
              ].map(pref => (
                <div key={pref.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '13px 16px', borderRadius: 14,
                  background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
                }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.7)' }}>{pref.label}</span>
                  <div style={{
                    width: 46, height: 26, borderRadius: 13, cursor: 'pointer',
                    background: pref.enabled ? '#246BFD' : 'rgba(17,26,58,0.12)',
                    position: 'relative', transition: 'background 0.2s',
                  }}>
                    <div style={{
                      position: 'absolute', top: 3,
                      left: pref.enabled ? 23 : 3,
                      width: 20, height: 20, borderRadius: '50%', background: 'white',
                      transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VERIFICATION */}
        {step === 'verification' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Verification</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>
              Verified providers get 3× more bookings. This builds trust with families.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { icon: '🪪', label: 'Government ID', desc: 'NID or Passport', status: 'required', done: false },
                { icon: '📸', label: 'Profile Photo', desc: 'Clear face photo', status: 'required', done: true },
                { icon: '✅', label: 'Background Check', desc: 'Identity & criminal record', status: 'required', done: false },
                { icon: '📞', label: 'Phone Verification', desc: '+880 number verified', status: 'done', done: true },
                { icon: '📧', label: 'Email Verification', desc: 'Verified email address', status: 'done', done: true },
                { icon: '📋', label: 'Certifications', desc: 'Childcare or first aid (optional)', status: 'optional', done: false },
              ].map(v => (
                <div key={v.label} style={{
                  display: 'flex', gap: 12, alignItems: 'center', padding: '13px 16px',
                  borderRadius: 14,
                  background: v.done ? 'rgba(16,185,129,0.06)' : 'rgba(17,26,58,0.04)',
                  border: v.done ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(17,26,58,0.08)',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                    background: v.done ? 'rgba(16,185,129,0.12)' : 'rgba(17,26,58,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>{v.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500, color: 'white' }}>{v.label}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>{v.desc}</div>
                  </div>
                  {v.done ? (
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="13" height="11" viewBox="0 0 13 11" fill="none"><path d="M1 5.5l3.5 3.5L12 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  ) : (
                    <div style={{
                      padding: '4px 10px', borderRadius: 20, flexShrink: 0,
                      background: v.status === 'optional' ? 'rgba(17,26,58,0.05)' : 'rgba(245,158,11,0.12)',
                      border: `1px solid ${v.status === 'optional' ? 'rgba(17,26,58,0.1)' : 'rgba(245,158,11,0.25)'}`,
                      fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600,
                      color: v.status === 'optional' ? 'rgba(17,26,58,0.35)' : '#F59E0B',
                    }}>{v.status === 'optional' ? 'Optional' : 'Upload'}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYMENT / PAYOUT */}
        {step === 'payment' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>How You Get Paid</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>
              Set up your payout method for Bangladesh. Local methods supported.
            </p>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'rgba(17,26,58,0.4)', marginBottom: 10 }}>PAYOUT METHODS — BANGLADESH</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: 'bKash', icon: '📱', sub: 'Mobile banking · Instant', selected: true, color: '#E30A14' },
                  { name: 'Nagad', icon: '📲', sub: 'Mobile banking · Same day', selected: false, color: '#FF6B00' },
                  { name: 'Bank Transfer', icon: '🏦', sub: 'NPSB / BEFTN · 1–3 days', selected: false, color: '#246BFD' },
                ].map(m => (
                  <div key={m.name} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px', borderRadius: 16, cursor: 'pointer',
                    background: m.selected ? 'rgba(36,107,253,0.1)' : 'rgba(17,26,58,0.04)',
                    border: m.selected ? '1.5px solid rgba(36,107,253,0.35)' : '1.5px solid rgba(17,26,58,0.08)',
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                      background: `${m.color}15`, border: `1px solid ${m.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                    }}>{m.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white' }}>{m.name}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)', marginTop: 2 }}>{m.sub}</div>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: m.selected ? '#246BFD' : 'transparent',
                      border: m.selected ? '2px solid #246BFD' : '2px solid rgba(17,26,58,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {m.selected && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgba(17,26,58,0.45)', display: 'block', marginBottom: 5 }}>bKash Number</label>
              <input type="tel" placeholder="+880 1X XXXX XXXX" defaultValue="+880 17 1234 5678" style={inputStyle}/>
            </div>

            <div style={{
              padding: '13px 15px', borderRadius: 14, marginTop: 16,
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.55)', lineHeight: 1.5,
            }}>
              🔒 Your payout information is encrypted and stored securely. MomBestie uses verified payment processors to send your earnings.
            </div>
          </div>
        )}

        {/* REVIEW */}
        {step === 'review' && (
          <div className="anim-fade-slide">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '8px 0 6px', letterSpacing: '-0.4px' }}>Review & Submit</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 22px', lineHeight: 1.55 }}>
              Check everything looks right before submitting.
            </p>

            {[
              { title: 'About', items: ['Ayesha Rahman', 'Dhaka, Bangladesh 🇧🇩', '3–5 years experience', 'Bengali, English'] },
              { title: 'Services', items: ['Babysitting · ৳700/hr', 'Childcare · ৳700/hr', 'Newborn Care · ৳2,100/hr'] },
              { title: 'Service Area', items: ['Gulshan-1, Dhaka', '10 km radius'] },
              { title: 'Availability', items: ['Mon–Fri, 9 AM – 6 PM', 'Last-minute bookings: Yes'] },
              { title: 'Verification', items: ['Phone ✓', 'Email ✓', 'ID: Pending upload', 'Background check: Pending'] },
              { title: 'Payout', items: ['bKash', '+880 17 1234 5678'] },
            ].map(sec => (
              <div key={sec.title} style={{
                marginBottom: 10, padding: '14px 16px', borderRadius: 16,
                background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'rgba(17,26,58,0.7)' }}>{sec.title}</div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, color: '#246BFD' }}>Edit</button>
                </div>
                {sec.items.map(item => (
                  <div key={item} style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.55)', marginBottom: 3 }}>• {item}</div>
                ))}
              </div>
            ))}

            <div style={{
              padding: '14px', borderRadius: 14, marginBottom: 16, marginTop: 4,
              background: 'rgba(36,107,253,0.08)', border: '1px solid rgba(36,107,253,0.18)',
              fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)', lineHeight: 1.55,
            }}>
              By submitting, you agree to the MomBestie Provider Terms, Privacy Policy and Marketplace Rules for Bangladesh. Your application will be reviewed within 1–3 business days.
            </div>
          </div>
        )}

        {/* Spacer before button */}
        <div style={{ height: 20 }}/>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '12px 24px 28px', flexShrink: 0, background: 'linear-gradient(0deg, #FFFFFF 70%, transparent)' }}>
        <button onClick={next} style={{
          width: '100%', padding: '15.5px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
          boxShadow: '0 8px 24px rgba(36,107,253,0.45)',
          fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: 'white',
        }}>
          {step === 'review' ? 'Submit Application' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
