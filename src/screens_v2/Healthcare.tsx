import { useState } from 'react'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

type Step = 'select' | 'identity' | 'license' | 'specialty' | 'verification'

const SPECIALTIES = [
  { icon: '👶', name: 'Pediatrician', sub: 'Children\'s medicine, 0–18 years' },
  { icon: '🏥', name: 'Family Physician', sub: 'General family practice' },
  { icon: '🦷', name: 'Pediatric Dentist', sub: 'Children\'s dental care' },
  { icon: '💻', name: 'Telehealth Provider', sub: 'Online consultations' },
  { icon: '🏪', name: 'Clinic / Practice', sub: 'Registered medical facility' },
  { icon: '🩺', name: 'Pediatric Specialist', sub: 'Sub-specialty paediatrics' },
]

const VERIFICATION_ITEMS = [
  { label: 'Identity', status: 'pending', icon: '🪪', desc: 'Government-issued photo ID' },
  { label: 'Medical License', status: 'pending', icon: '📋', desc: 'Valid BMDC registration' },
  { label: 'Specialty Certification', status: 'pending', icon: '🎓', desc: 'Board certification if applicable' },
  { label: 'Practice Address', status: 'pending', icon: '📍', desc: 'Verified clinic or hospital' },
  { label: 'Insurance / Coverage', status: 'pending', icon: '🛡', desc: 'Professional indemnity where required' },
]

export default function Healthcare({ navigate }: Props) {
  const [step, setStep] = useState<Step>('select')
  const [selected, setSelected] = useState<string | null>(null)
  const [licenseNum, setLicenseNum] = useState('')
  const [licenseExpiry, setLicenseExpiry] = useState('')

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 12,
    background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.12)',
    color: 'white', fontFamily: 'Inter, sans-serif', fontSize: 14.5,
    outline: 'none', boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600 as const,
    color: 'rgba(17,26,58,0.5)' as string, letterSpacing: 0.4,
    display: 'block' as const, marginBottom: 5,
  }

  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => step === 'select' ? navigate('more') : setStep('select')} style={{
            background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
            borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          {/* Steps progress */}
          <div style={{ flex: 1, display: 'flex', gap: 4 }}>
            {(['select', 'identity', 'license', 'specialty', 'verification'] as Step[]).map((s, i) => (
              <div key={s} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: (['select', 'identity', 'license', 'specialty', 'verification'] as Step[]).indexOf(step) >= i
                  ? '#246BFD' : 'rgba(17,26,58,0.12)',
                transition: 'background 0.3s',
              }}/>
            ))}
          </div>
        </div>

        {/* Healthcare badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, marginBottom: 16,
          background: 'rgba(40,168,255,0.12)', border: '1px solid rgba(40,168,255,0.3)',
        }}>
          <span style={{ fontSize: 14 }}>⚕️</span>
          <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#28A8FF' }}>Healthcare Provider Mode</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }} className="scrollbar-hide">

        {step === 'select' && (
          <div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
              What type of healthcare provider are you?
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 24px', lineHeight: 1.55 }}>
              Healthcare providers go through a specialized onboarding flow with professional verification. This keeps MomBestie families safe.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {SPECIALTIES.map(sp => (
                <div
                  key={sp.name}
                  onClick={() => setSelected(sp.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    borderRadius: 16, cursor: 'pointer',
                    background: selected === sp.name ? 'rgba(40,168,255,0.15)' : 'rgba(17,26,58,0.04)',
                    border: selected === sp.name ? '1.5px solid #28A8FF' : '1.5px solid rgba(17,26,58,0.08)',
                    transition: 'all 0.18s',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: 'rgba(40,168,255,0.12)', border: '1px solid rgba(40,168,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>{sp.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white' }}>{sp.name}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)', marginTop: 2 }}>{sp.sub}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: selected === sp.name ? '2px solid #28A8FF' : '2px solid rgba(17,26,58,0.2)',
                    background: selected === sp.name ? '#28A8FF' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selected === sp.name && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '12px 14px', borderRadius: 12, marginBottom: 24,
              background: 'rgba(36,107,253,0.08)', border: '1px solid rgba(36,107,253,0.18)',
              fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)', lineHeight: 1.5,
            }}>
              🔒 Healthcare verification is reviewed by the MomBestie Medical Team. Provider status is only granted after manual approval.
            </div>

            <button onClick={() => selected && setStep('identity')} style={{
              width: '100%', padding: '15.5px', borderRadius: 14, border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
              background: selected ? 'linear-gradient(135deg, #246BFD, #28A8FF)' : 'rgba(17,26,58,0.1)',
              boxShadow: selected ? '0 8px 24px rgba(36,107,253,0.4)' : 'none',
              fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700,
              color: selected ? 'white' : 'rgba(17,26,58,0.35)', marginBottom: 32,
            }}>Continue as {selected || 'Healthcare Provider'}</button>
          </div>
        )}

        {step === 'identity' && (
          <div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
              Professional Identity
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 24px', lineHeight: 1.5 }}>
              How you appear to patients and on MomBestie.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>First Name</label>
                  <input type="text" placeholder="Dr. Sarah" style={inputStyle}/>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" placeholder="Ahmed" style={inputStyle}/>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Medical Title</label>
                <select style={{ ...inputStyle, appearance: 'none' as const }}>
                  <option>Dr. (MBBS)</option>
                  <option>Dr. (FCPS)</option>
                  <option>Prof. Dr.</option>
                  <option>Assoc. Prof. Dr.</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Practice / Clinic Name</label>
                <input type="text" placeholder="Dhaka Children's Clinic" style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Professional Address</label>
                <input type="text" placeholder="Road 27, Gulshan-1, Dhaka" style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Years of Experience</label>
                <input type="number" placeholder="8" style={inputStyle}/>
              </div>
            </div>
            <button onClick={() => setStep('license')} style={{
              width: '100%', marginTop: 24, marginBottom: 32, padding: '15px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white',
            }}>Continue to License</button>
          </div>
        )}

        {step === 'license' && (
          <div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
              Medical License
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 24px', lineHeight: 1.5 }}>
              Your license information is verified by the MomBestie Medical Team before approval.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>License Jurisdiction</label>
                <div style={{
                  ...inputStyle, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                }}>
                  <span>🇧🇩</span>
                  <span>Bangladesh Medical and Dental Council (BMDC)</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>License Number</label>
                <input type="text" value={licenseNum} onChange={e => setLicenseNum(e.target.value)} placeholder="BMDC Reg. No." style={inputStyle}/>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Issue Date</label>
                  <input type="text" placeholder="MM/YYYY" style={inputStyle}/>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Expiry Date</label>
                  <input type="text" value={licenseExpiry} onChange={e => setLicenseExpiry(e.target.value)} placeholder="MM/YYYY" style={inputStyle}/>
                </div>
              </div>
              {/* Document upload */}
              <div>
                <label style={labelStyle}>Upload License Document</label>
                <div style={{
                  padding: '24px', borderRadius: 14,
                  background: 'rgba(17,26,58,0.04)', border: '2px dashed rgba(17,26,58,0.15)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 32 }}>📄</span>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.5)', textAlign: 'center' }}>
                    Tap to upload<br/>
                    <span style={{ fontSize: 11, color: 'rgba(17,26,58,0.3)' }}>PDF, JPG or PNG · Max 10MB</span>
                  </div>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Upload Government ID</label>
                <div style={{
                  padding: '20px', borderRadius: 14,
                  background: 'rgba(17,26,58,0.04)', border: '2px dashed rgba(17,26,58,0.15)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 28 }}>🪪</span>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)' }}>NID / Passport</div>
                </div>
              </div>
            </div>
            <button onClick={() => setStep('specialty')} style={{
              width: '100%', marginTop: 24, marginBottom: 32, padding: '15px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white',
            }}>Continue to Specialty</button>
          </div>
        )}

        {step === 'specialty' && (
          <div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
              Consultation Types
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 24px', lineHeight: 1.5 }}>
              How would you like to see patients through MomBestie?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { icon: '🏥', label: 'In-Person Consultation', sub: 'At your clinic or practice', enabled: true },
                { icon: '💻', label: 'Telehealth / Video Call', sub: 'Online consultations', enabled: true },
                { icon: '🏠', label: 'Home Visit', sub: 'Where permitted and applicable', enabled: false },
              ].map(ct => (
                <div key={ct.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 16,
                  background: ct.enabled ? 'rgba(36,107,253,0.12)' : 'rgba(17,26,58,0.04)',
                  border: ct.enabled ? '1.5px solid rgba(36,107,253,0.3)' : '1.5px solid rgba(17,26,58,0.08)',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: ct.enabled ? 'rgba(36,107,253,0.15)' : 'rgba(17,26,58,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>{ct.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: ct.enabled ? 'white' : 'rgba(17,26,58,0.5)' }}>{ct.label}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>{ct.sub}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: ct.enabled ? '#246BFD' : 'transparent',
                    border: ct.enabled ? '2px solid #246BFD' : '2px solid rgba(17,26,58,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {ct.enabled && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('verification')} style={{
              width: '100%', marginBottom: 32, padding: '15px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white',
            }}>Continue to Verification</button>
          </div>
        )}

        {step === 'verification' && (
          <div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
              Medical Verification
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.45)', margin: '0 0 24px', lineHeight: 1.5 }}>
              Your application has been submitted for review. This typically takes 2–5 business days.
            </p>

            <div style={{
              padding: '16px', borderRadius: 16, marginBottom: 20,
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>⏳</span>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#F59E0B' }}>Under Review</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.55)', lineHeight: 1.5, marginTop: 3 }}>
                  The MomBestie Medical Team is reviewing your credentials. You'll receive a notification when verification is complete.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {VERIFICATION_ITEMS.map(v => (
                <div key={v.label} style={{
                  display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px',
                  borderRadius: 14, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{v.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500, color: 'white' }}>{v.label}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.35)', marginTop: 2 }}>{v.desc}</div>
                  </div>
                  <div style={{
                    padding: '3px 9px', borderRadius: 20,
                    background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                    fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, color: '#F59E0B',
                  }}>Pending</div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '12px 14px', borderRadius: 12, marginBottom: 20,
              background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
              fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.45)', lineHeight: 1.5,
            }}>
              🔒 Provider status is granted only by MomBestie. A Verified Doctor badge is issued after successful credential review. You cannot self-label as a Verified Doctor.
            </div>

            <button onClick={() => navigate('dashboard')} style={{
              width: '100%', marginBottom: 32, padding: '15px', borderRadius: 14, cursor: 'pointer',
              background: 'rgba(17,26,58,0.1)', border: '1px solid rgba(17,26,58,0.15)',
              fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: 'rgba(17,26,58,0.8)',
            }}>Return to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  )
}
