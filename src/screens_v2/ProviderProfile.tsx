import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

const SERVICES = [
  { name: 'Babysitting', rate: '৳700/hr', ai: '৳800/hr', status: 'active', badge: 'Competitive' },
  { name: 'Childcare', rate: '৳700/hr', ai: '৳780/hr', status: 'active', badge: 'Competitive' },
  { name: 'Newborn Care', rate: '৳2,100/session', ai: '৳2,400/session', status: 'active', badge: 'Below Market' },
]

export default function ProviderProfile({ navigate }: Props) {
  const [previewMode, setPreviewMode] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState(false)

  if (previewMode) {
    return (
      <div style={{ height: '100%', background: '#F7F9FF', display: 'flex', flexDirection: 'column' }}>
        {/* Customer view header */}
        <div style={{
          padding: '48px 16px 14px',
          background: 'white', borderBottom: '1px solid rgba(0,0,0,0.07)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <button onClick={() => setPreviewMode(false)} style={{
              background: 'rgba(36,107,253,0.1)', border: '1px solid rgba(36,107,253,0.2)',
              borderRadius: 10, width: 36, height: 36, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#246BFD" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#246BFD' }}>Customer View Preview</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>This is how customers see your profile</div>
            </div>
          </div>
        </div>

        {/* Customer-side profile */}
        <div style={{ flex: 1, overflowY: 'auto' }} className="scrollbar-hide">
          {/* Hero */}
          <div style={{ background: 'white', padding: '20px 16px', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Plus Jakarta Sans', fontSize: 28, fontWeight: 800, color: 'white',
                border: '3px solid rgba(36,107,253,0.2)',
              }}>AR</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>Ayesha Rahman</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#10B981"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, color: '#10B981' }}>Verified</span>
                  </div>
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(0,0,0,0.55)', marginTop: 4 }}>Babysitter & Childcare Specialist</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#FFFFFF', fontWeight: 600 }}>⭐ 4.9 <span style={{ fontWeight: 400, color: 'rgba(0,0,0,0.45)' }}>(47 reviews)</span></div>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>📍 Dhaka · 5 km</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: '12px', borderRadius: 12, background: '#F7F9FF', border: '1px solid rgba(36,107,253,0.1)' }}>
              <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(0,0,0,0.65)', lineHeight: 1.55 }}>
                Experienced childcare professional with 5+ years working with families across Dhaka. CPR certified. Fluent in Bengali and English. Available weekdays and weekends.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button style={{ flex: 1, padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer', background: '#246BFD', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white' }}>Book Now</button>
              <button style={{ flex: 1, padding: '13px', borderRadius: 12, cursor: 'pointer', background: 'white', border: '1.5px solid #246BFD', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: '#246BFD' }}>Message</button>
            </div>
          </div>

          <div style={{ background: 'white', padding: '16px', marginBottom: 8 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>Services & Pricing</div>
            {SERVICES.map(s => (
              <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#FFFFFF' }}>{s.name}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#246BFD' }}>{s.rate}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', padding: '16px' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>Details</div>
            {[['Response time', '< 1 hour'], ['Languages', 'Bengali, English'], ['Experience', '5+ years'], ['Children preferred', '0–10 years']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <span style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(0,0,0,0.5)' }}>{k}</span>
                <span style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500, color: '#FFFFFF' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">
        {/* Header */}
        <div style={{
          padding: '48px 20px 20px',
          background: 'linear-gradient(180deg, #F7F9FF 0%, #FFFFFF 100%)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <button onClick={() => navigate('more')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              <span style={{ fontFamily: 'Inter', fontSize: 12 }}>More</span>
            </button>
            <button onClick={() => setPreviewMode(true)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 20, cursor: 'pointer',
              background: 'rgba(36,107,253,0.15)', border: '1px solid rgba(36,107,253,0.3)',
              fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#246BFD',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview Customer View
            </button>
          </div>

          {/* Profile header */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%',
                background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: 'white',
                border: '3px solid rgba(36,107,253,0.4)',
              }}>AR</div>
              <button onClick={() => setEditingPhoto(true)} style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: '50%',
                background: '#246BFD', border: '2px solid #FFFFFF',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 20, fontWeight: 800, color: 'white' }}>Ayesha Rahman</div>
              <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.5)', marginTop: 3 }}>Babysitter · Childcare · Dhaka 🇧🇩</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <div style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, color: '#10B981' }}>✓ Verified</div>
                <div style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, color: '#F59E0B' }}>⭐ 4.9</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile completeness */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            padding: '14px', borderRadius: 16,
            background: 'rgba(36,107,253,0.1)', border: '1px solid rgba(36,107,253,0.22)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'white' }}>Profile Strength</span>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 800, color: '#246BFD' }}>78%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(17,26,58,0.1)' }}>
              <div style={{ height: '100%', width: '78%', borderRadius: 3, background: 'linear-gradient(90deg, #246BFD, #28A8FF)' }}/>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)', marginTop: 8 }}>
              Add service photos to reach 90% and get more bookings.
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Rating', value: '4.9', icon: '⭐' },
            { label: 'Reviews', value: '47', icon: '💬' },
            { label: 'Completed', value: '112', icon: '✅' },
            { label: 'Response', value: '<1h', icon: '⚡' },
          ].map(s => (
            <div key={s.label} style={{ padding: '12px 8px', borderRadius: 14, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)', textAlign: 'center' }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 800, color: 'white' }}>{s.value}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 9.5, color: 'rgba(17,26,58,0.35)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* About */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)' }}>About</div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, color: '#246BFD' }}>Edit</button>
          </div>
          <div style={{
            padding: '14px', borderRadius: 14,
            background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
            fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.7)', lineHeight: 1.6,
          }}>
            Experienced childcare professional with 5+ years working with families across Dhaka. CPR certified. Fluent in Bengali and English. Available weekdays and weekends.
          </div>
        </div>

        {/* Services */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)' }}>Services</div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, color: '#246BFD' }}>+ Add</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SERVICES.map(s => (
              <div key={s.name} style={{
                padding: '12px 14px', borderRadius: 14,
                background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white' }}>{s.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#10B981' }}>{s.rate}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(17,26,58,0.3)' }}>·</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.4)' }}>AI: {s.ai}</span>
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 20, flexShrink: 0,
                  background: s.badge === 'Competitive' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                  border: `1px solid ${s.badge === 'Competitive' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600,
                  color: s.badge === 'Competitive' ? '#10B981' : '#F59E0B',
                }}>{s.badge}</div>
                <button onClick={() => navigate('smartpricing')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.3)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 10 }}>Languages</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['বাংলা (Bengali)', 'English'].map(l => (
              <div key={l} style={{ padding: '8px 14px', borderRadius: 20, background: 'rgba(36,107,253,0.12)', border: '1px solid rgba(36,107,253,0.25)', fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: '#246BFD' }}>{l}</div>
            ))}
          </div>
        </div>

        {/* Documents & Verification */}
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 10 }}>Verification</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Identity', status: 'Verified', icon: '🪪', color: '#10B981' },
              { label: 'Background Check', status: 'Verified', icon: '🔍', color: '#10B981' },
              { label: 'CPR Certification', status: 'Verified · Expires Dec 2026', icon: '💊', color: '#10B981' },
              { label: 'Phone Number', status: 'Verified', icon: '📱', color: '#10B981' },
            ].map(v => (
              <div key={v.label} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                borderRadius: 13, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{v.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500, color: 'white' }}>{v.label}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: v.color, marginTop: 2 }}>✓ {v.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav current="dashboard" navigate={navigate}/>
    </div>
  )
}
