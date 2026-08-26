import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'
import FlagIcon from '../components/FlagIcon'

// onSignOut real, per the file-header comment. Every other item in this
// screen (personal info, business hours, payment methods list,
// notification toggles) is still the prototype's own fixture data, not
// yet wired to real Supabase state -- flagged here rather than silently
// left as-is; see docs/PROJECT_REPORT.md for the follow-up list.
interface Props { navigate: (s: Screen) => void; onSignOut: () => void }

interface SettingItem {
  icon: string
  label: string
  sub?: string
  active?: boolean
  flagCode?: string
  toggle?: boolean
  on?: boolean
  danger?: boolean
}

const SECTIONS: { title: string; items: SettingItem[] }[] = [
  {
    title: 'Account',
    items: [
      { icon: '👤', label: 'Personal Information', sub: 'Ayesha Rahman' },
      { icon: '📧', label: 'Email Address', sub: 'ayesha@email.com' },
      { icon: '📱', label: 'Phone Number', sub: '+880 17 XXXX XXXX' },
      { icon: '🔒', label: 'Password & Security', sub: 'Last changed 30 days ago' },
      { icon: '🔐', label: 'Two-Factor Authentication', sub: 'Enabled', active: true },
    ],
  },
  {
    title: 'Business',
    items: [
      { icon: '🏷', label: 'Provider Profile', sub: 'Babysitter · Childcare' },
      { icon: '🛠', label: 'My Services', sub: '3 active services' },
      { icon: '📅', label: 'Availability', sub: 'Mon–Sat · 9AM–9PM' },
      { icon: '📍', label: 'Service Area', sub: 'Dhaka, 15km radius' },
      { icon: '✅', label: 'Verification & Documents', sub: 'Verified · 2 docs' },
    ],
  },
  {
    title: 'Language & Region',
    items: [
      { icon: '🌍', label: 'Operating Country', sub: 'Bangladesh', flagCode: 'BD' },
      { icon: '🌐', label: 'Language', sub: 'বাংলা (Bengali)' },
      { icon: '💱', label: 'Currency', sub: 'BDT · ৳ Bangladesh Taka' },
      { icon: '🕐', label: 'Time Zone', sub: 'Asia/Dhaka (GMT+6)' },
      { icon: '📏', label: 'Units', sub: 'Metric · km' },
    ],
  },
  {
    title: 'Money',
    items: [
      { icon: '💳', label: 'Payment Methods', sub: 'bKash, Nagad, Visa' },
      { icon: '📤', label: 'Payout Methods', sub: 'bKash · 01XXXXXXXXXX' },
      { icon: '🧾', label: 'Tax Information', sub: 'TIN: 1234XXXXX' },
      { icon: '📊', label: 'Transaction History', sub: 'View all transactions' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: '🔔', label: 'Booking Requests', toggle: true, on: true },
      { icon: '💬', label: 'Customer Messages', toggle: true, on: true },
      { icon: '💰', label: 'Payments & Payouts', toggle: true, on: true },
      { icon: '⭐', label: 'New Reviews', toggle: true, on: true },
      { icon: '✨', label: 'AI Insights', toggle: true, on: true },
      { icon: '📣', label: 'Marketing', toggle: true, on: false },
    ],
  },
  {
    title: 'Privacy',
    items: [
      { icon: '🛡', label: 'Privacy Settings', sub: 'Manage data sharing' },
      { icon: '🤝', label: 'Customer Data Permissions', sub: 'Authorized sharing only' },
      { icon: '📥', label: 'Download My Data', sub: 'Export your information' },
      { icon: '🗑', label: 'Delete Account', sub: 'Permanently remove account', danger: true },
    ],
  },
  {
    title: 'Legal',
    items: [
      { icon: '📜', label: 'Provider Agreement', sub: 'Accepted Aug 1, 2024' },
      { icon: '📋', label: 'Terms of Service', sub: 'View' },
      { icon: '🔏', label: 'Privacy Policy', sub: 'View' },
      { icon: '🏪', label: 'Marketplace Rules', sub: 'Bangladesh · View' },
    ],
  },
]

export default function Settings({ navigate, onSignOut }: Props) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Booking Requests': true, 'Customer Messages': true, 'Payments & Payouts': true,
    'New Reviews': true, 'AI Insights': true, 'Marketing': false,
  })

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">

        {/* Header */}
        <div style={{ padding: '48px 20px 20px' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A', marginBottom: 16 }}>Settings</div>

          {/* Profile card */}
          <div style={{
            padding: '16px', borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(36,107,253,0.15) 0%, rgba(168,85,247,0.08) 100%)',
            border: '1px solid rgba(36,107,253,0.25)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Plus Jakarta Sans', fontSize: 20, fontWeight: 800, color: 'white',
                border: '2px solid rgba(36,107,253,0.5)',
              }}>AR</div>
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 16, height: 16, borderRadius: '50%',
                background: '#10B981', border: '2px solid #FFFFFF',
              }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 800, color: '#111A3A' }}>Ayesha Rahman</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.5)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                Babysitter · Dhaka, Bangladesh <FlagIcon code="BD" width={14} radius={2}/>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, color: '#10B981' }}>✓ Verified</span>
                <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, color: '#F59E0B' }}>⭐ 4.9</span>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.5)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { icon: '💰', label: 'Earnings', sub: '৳4,850 available', onClick: () => navigate('earnings') },
              { icon: '✨', label: 'AI Assistant', sub: 'Your business partner', onClick: () => navigate('ai') },
            ].map(q => (
              <button key={q.label} onClick={q.onClick} style={{
                padding: '14px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                background: 'rgba(17,26,58,0.05)', border: '1px solid rgba(17,26,58,0.09)',
              }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{q.icon}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#111A3A' }}>{q.label}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>{q.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings sections */}
        <div style={{ padding: '0 16px' }}>
          {SECTIONS.map(section => (
            <div key={section.title} style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: 'rgba(17,26,58,0.3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
                {section.title}
              </div>
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(17,26,58,0.07)' }}>
                {section.items.map((item, i) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
                      borderBottom: i < section.items.length - 1 ? '1px solid rgba(17,26,58,0.05)' : 'none',
                      background: 'rgba(17,26,58,0.03)', cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: item.danger ? 'rgba(255,107,107,0.12)' : 'rgba(17,26,58,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500,
                        color: item.danger ? '#FF6B6B' : 'rgba(17,26,58,0.88)',
                      }}>{item.label}</div>
                      {(item.sub || item.flagCode) && !item.toggle && (
                        <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: item.active ? '#10B981' : 'rgba(17,26,58,0.35)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {item.flagCode && <FlagIcon code={item.flagCode} width={14} radius={2}/>}{item.sub}
                        </div>
                      )}
                    </div>
                    {item.toggle ? (
                      <div
                        onClick={() => setToggles(t => ({ ...t, [item.label]: !t[item.label] }))}
                        style={{
                          width: 44, height: 26, borderRadius: 13, flexShrink: 0,
                          background: toggles[item.label] ? '#246BFD' : 'rgba(17,26,58,0.15)',
                          position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                        }}
                      >
                        <div style={{
                          position: 'absolute', top: 3, left: toggles[item.label] ? 21 : 3,
                          width: 20, height: 20, borderRadius: '50%', background: 'white',
                          transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                        }}/>
                      </div>
                    ) : (
                      !item.danger && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.25)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Version + support */}
        <div style={{ padding: '8px 20px 20px', textAlign: 'center' }}>
          <button onClick={onSignOut} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#FF6B6B', marginBottom: 12 }}>
            Sign Out
          </button>
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.2)' }}>
            MomBestie Provider v2.4.0 · Bangladesh Market
          </div>
        </div>
      </div>

      <BottomNav current="settings" navigate={navigate}/>
    </div>
  )
}
