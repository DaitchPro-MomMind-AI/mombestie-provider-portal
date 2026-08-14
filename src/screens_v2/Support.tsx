import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

const HELP_TOPICS = [
  { icon: '💰', label: 'Payments & Payouts', sub: 'Balance, withdrawals, fees' },
  { icon: '📅', label: 'Bookings & Cancellations', sub: 'Manage and modify bookings' },
  { icon: '✅', label: 'Verification', sub: 'Documents, identity, healthcare' },
  { icon: '🤖', label: 'MomBestie AI', sub: 'AI features, pricing, voice' },
  { icon: '🌍', label: 'Country & Currency', sub: 'Marketplace, region settings' },
  { icon: '🔒', label: 'Account & Security', sub: 'Login, password, 2FA' },
]

export default function Support({ navigate }: Props) {
  const [tab, setTab] = useState(0)
  const [reportSent, setReportSent] = useState(false)
  const [reportText, setReportText] = useState('')

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">

        {/* Header */}
        <div style={{ padding: '48px 20px 16px', background: 'linear-gradient(180deg, #F7F9FF 0%, #FFFFFF 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <button onClick={() => navigate('more')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              <span style={{ fontFamily: 'Inter', fontSize: 12 }}>More</span>
            </button>
          </div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 16 }}>Support & Safety</div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }} className="scrollbar-hide">
            {['Help Center', 'Contact Us', 'Report', 'Safety'].map((t, i) => (
              <button key={t} onClick={() => setTab(i)} style={{
                padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', flexShrink: 0,
                background: tab === i ? '#246BFD' : 'rgba(17,26,58,0.07)',
                fontFamily: 'Inter', fontSize: 12.5, fontWeight: 600,
                color: tab === i ? 'white' : 'rgba(17,26,58,0.5)',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {tab === 0 && (
          <div style={{ padding: '16px 16px' }}>
            {/* AI support */}
            <button onClick={() => navigate('ai')} style={{
              width: '100%', padding: '16px', borderRadius: 18, cursor: 'pointer', marginBottom: 16,
              background: 'linear-gradient(135deg, rgba(36,107,253,0.2) 0%, rgba(168,85,247,0.1) 100%)',
              border: '1px solid rgba(36,107,253,0.3)',
              display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 45%, #7C3AED 100%)',
                flexShrink: 0, boxShadow: '0 0 14px rgba(36,107,253,0.5)',
              }} className="anim-orb-idle"/>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white' }}>Ask MomBestie AI</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.5)', marginTop: 3 }}>Instant answers about your account, payouts, bookings and features.</div>
              </div>
            </button>

            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'rgba(17,26,58,0.5)', marginBottom: 10 }}>Browse Help Topics</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HELP_TOPICS.map(h => (
                <div key={h.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
                  borderRadius: 14, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, background: 'rgba(36,107,253,0.12)', border: '1px solid rgba(36,107,253,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
                  }}>{h.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: 'white' }}>{h.label}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>{h.sub}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.25)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 1 && (
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '💬', label: 'Live Chat Support', sub: 'Usually responds in < 5 min', badge: 'Online', color: '#10B981' },
                { icon: '📧', label: 'Email Support', sub: 'support@mombestie.com', badge: null, color: '#246BFD' },
                { icon: '📞', label: 'Phone Support', sub: 'Available in selected countries', badge: 'BD: +880-XXXX', color: '#28A8FF' },
              ].map(c => (
                <div key={c.label} style={{
                  padding: '16px', borderRadius: 16,
                  background: 'rgba(17,26,58,0.05)', border: '1px solid rgba(17,26,58,0.09)',
                  display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 13, background: `${c.color}15`, border: `1px solid ${c.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                  }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white' }}>{c.label}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)', marginTop: 2 }}>{c.sub}</div>
                  </div>
                  {c.badge && (
                    <div style={{
                      padding: '4px 10px', borderRadius: 20, flexShrink: 0,
                      background: `${c.color}15`, border: `1px solid ${c.color}30`,
                      fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, color: c.color,
                    }}>{c.badge}</div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ margin: '20px 0 8px', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'rgba(17,26,58,0.5)' }}>Operating Hours</div>
            <div style={{
              padding: '14px', borderRadius: 14,
              background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
            }}>
              {[['Live Chat', 'Sun–Thu 8 AM–10 PM (BD)'], ['Email', '24/7 · Response within 12 hours'], ['Phone', 'Varies by country'], ['AI Support', 'Always available']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(17,26,58,0.05)' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.5)' }}>{k}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.7)', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 2 && (
          <div style={{ padding: '16px' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 12 }}>What would you like to report?</div>

            {reportSent ? (
              <div style={{
                padding: '20px', borderRadius: 18,
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                textAlign: 'center',
              }} className="anim-bounce-in">
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: 700, color: '#10B981', marginBottom: 8 }}>Report Submitted</div>
                <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.55)', lineHeight: 1.5 }}>
                  Our Trust & Safety team will review your report within 24 hours. Your account information is kept private.
                </div>
                <button onClick={() => setReportSent(false)} style={{
                  marginTop: 16, padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
                  background: 'rgba(17,26,58,0.1)', border: '1px solid rgba(17,26,58,0.15)',
                  fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.7)',
                }}>Report another issue</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {[
                    { icon: '⚠️', label: 'Report a Customer', sub: 'Inappropriate behavior or communication' },
                    { icon: '🚨', label: 'Report an Incident', sub: 'Safety concern during a booking' },
                    { icon: '🚫', label: 'Block a Customer', sub: 'Prevent further contact or bookings' },
                    { icon: '💬', label: 'Report a Message', sub: 'Abusive or threatening messages' },
                    { icon: '💰', label: 'Report a Payment Issue', sub: 'Fraud, disputes, incorrect charges' },
                  ].map(r => (
                    <div key={r.label} style={{
                      display: 'flex', gap: 12, alignItems: 'center', padding: '13px 14px',
                      borderRadius: 14, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)', cursor: 'pointer',
                    }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{r.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500, color: 'white' }}>{r.label}</div>
                        <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>{r.sub}</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.25)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'rgba(17,26,58,0.5)', display: 'block', marginBottom: 6 }}>Additional details</label>
                  <textarea
                    value={reportText} onChange={e => setReportText(e.target.value)}
                    placeholder="Describe what happened..."
                    rows={4}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 12,
                      background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.12)',
                      color: 'white', fontFamily: 'Inter', fontSize: 13.5, outline: 'none',
                      resize: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <button onClick={() => setReportSent(true)} style={{
                  width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: '#FF6B6B', fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white',
                }}>Submit Report</button>
              </>
            )}
          </div>
        )}

        {tab === 3 && (
          <div style={{ padding: '16px' }}>
            <div style={{
              padding: '16px', borderRadius: 18, marginBottom: 16,
              background: 'rgba(36,107,253,0.1)', border: '1px solid rgba(36,107,253,0.22)',
            }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 8 }}>Your Safety is Our Priority</div>
              <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.6)', lineHeight: 1.55 }}>
                MomBestie takes provider safety seriously. All customers are verified. All bookings are documented. You can always contact our safety team.
              </div>
            </div>

            {[
              { icon: '📋', title: 'Safety Guidelines', sub: 'Provider safety best practices' },
              { icon: '📞', title: 'Emergency Contacts', sub: 'Bangladesh: 999 (Police) · 16999 (Health)', highlight: true },
              { icon: '🔒', title: 'Safe Communication', sub: 'How to keep your personal info private' },
              { icon: '📍', title: 'Location Safety', sub: 'Share location during bookings' },
              { icon: '⚠️', title: 'Recognize Red Flags', sub: 'What to watch out for' },
              { icon: '🛡', title: 'Insurance & Coverage', sub: 'What MomBestie covers during bookings' },
            ].map(s => (
              <div key={s.title} style={{
                display: 'flex', gap: 12, alignItems: 'center', padding: '13px 14px', marginBottom: 8,
                borderRadius: 14,
                background: s.highlight ? 'rgba(255,107,107,0.08)' : 'rgba(17,26,58,0.04)',
                border: s.highlight ? '1px solid rgba(255,107,107,0.2)' : '1px solid rgba(17,26,58,0.07)',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: s.highlight ? 'rgba(255,107,107,0.12)' : 'rgba(36,107,253,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
                }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500, color: 'white' }}>{s.title}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: s.highlight ? '#FF6B6B' : 'rgba(17,26,58,0.4)', marginTop: 2 }}>{s.sub}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.25)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav current="dashboard" navigate={navigate}/>
    </div>
  )
}
