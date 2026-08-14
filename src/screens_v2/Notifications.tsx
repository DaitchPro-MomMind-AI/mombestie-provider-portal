import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

interface Notif {
  id: number; type: string; icon: string; title: string; body: string; time: string; read: boolean; color: string; action?: string; actionScreen?: string
}

const NOTIFS: Notif[] = [
  { id: 1, type: 'booking', icon: '📅', title: 'New Booking Request', body: 'Fatima M. requested babysitting on Saturday Aug 16, 5–9 PM. Respond within 2 hours.', time: 'Just now', read: false, color: '#F59E0B', action: 'View Request', actionScreen: 'bookings' },
  { id: 2, type: 'message', icon: '💬', title: 'New Message — Sarah K.', body: '"Can you arrive 15 minutes earlier?" — regarding today\'s babysitting at 9 AM.', time: '9 min ago', read: false, color: '#246BFD', action: 'Reply', actionScreen: 'messages' },
  { id: 3, type: 'ai', icon: '✨', title: 'AI Pricing Insight', body: 'Weekend childcare demand is rising in Dhaka. Consider updating your Saturday rate to ৳800/hr.', time: '1 hr ago', read: false, color: '#A855F7', action: 'View Pricing', actionScreen: 'smartpricing' },
  { id: 4, type: 'payment', icon: '💰', title: 'Payment Received', body: 'You received ৳1,785 from Ahmed F. for Childcare on Aug 12. Available balance: ৳4,850.', time: '2 hrs ago', read: true, color: '#10B981', action: 'View Earnings', actionScreen: 'earnings' },
  { id: 5, type: 'review', icon: '⭐', title: 'New 5-Star Review!', body: 'Ahmed F. left you a 5-star review: "Professional, reliable and caring."', time: 'Yesterday', read: true, color: '#F59E0B', action: 'Reply', actionScreen: 'reviews' },
  { id: 6, type: 'booking', icon: '✅', title: 'Booking Confirmed', body: 'Your booking with Nadia H. for Newborn Care today at 3:00 PM is confirmed.', time: 'Yesterday', read: true, color: '#10B981' },
  { id: 7, type: 'ai', icon: '🔔', title: 'Availability Opportunity', body: 'You have no availability on Sunday. 4 customers searched for Sunday childcare in your area this week.', time: '2 days ago', read: true, color: '#246BFD', action: 'Update Calendar', actionScreen: 'calendar' },
  { id: 8, type: 'payout', icon: '📤', title: 'Payout Sent', body: '৳18,020 was sent to your bKash account ending in XXXX. Usually arrives within 24 hours.', time: 'Aug 10', read: true, color: '#10B981' },
  { id: 9, type: 'verification', icon: '✅', title: 'Verification Complete', body: 'Your background check has been approved. Your profile is now fully verified.', time: 'Aug 5', read: true, color: '#10B981' },
]

const TABS = ['All', 'Bookings', 'Payments', 'AI Insights', 'Reviews']

export default function Notifications({ navigate }: Props) {
  const [tab, setTab] = useState(0)
  const [read, setRead] = useState<Set<number>>(new Set(NOTIFS.filter(n => n.read).map(n => n.id)))

  const typeMap: Record<number, string> = { 0: 'all', 1: 'booking', 2: 'payment', 3: 'ai', 4: 'review' }
  const filtered = tab === 0 ? NOTIFS : NOTIFS.filter(n => n.type === typeMap[tab] || (tab === 2 && (n.type === 'payment' || n.type === 'payout')))
  const unreadCount = NOTIFS.filter(n => !read.has(n.id)).length

  const markAllRead = () => setRead(new Set(NOTIFS.map(n => n.id)))

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '48px 20px 0', flexShrink: 0, background: 'linear-gradient(180deg, #F7F9FF 0%, #FFFFFF 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <button onClick={() => navigate('more')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)', display: 'flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              <span style={{ fontFamily: 'Inter', fontSize: 12 }}>More</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A' }}>Notifications</div>
              {unreadCount > 0 && (
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: '#246BFD',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: 'white',
                }}>{unreadCount}</div>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Inter', fontSize: 12, color: '#246BFD', fontWeight: 500, paddingTop: 24,
            }}>Mark all read</button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '16px 0 16px' }} className="scrollbar-hide">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', flexShrink: 0,
              background: tab === i ? '#246BFD' : 'rgba(17,26,58,0.07)',
              fontFamily: 'Inter', fontSize: 12.5, fontWeight: 600,
              color: tab === i ? 'white' : 'rgba(17,26,58,0.5)',
              boxShadow: tab === i ? '0 4px 12px rgba(36,107,253,0.35)' : 'none',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">
        {filtered.map(n => {
          const isRead = read.has(n.id)
          return (
            <div
              key={n.id}
              onClick={() => setRead(r => new Set([...r, n.id]))}
              style={{
                display: 'flex', gap: 12, padding: '14px 20px',
                borderBottom: '1px solid rgba(17,26,58,0.05)',
                background: isRead ? 'transparent' : 'rgba(36,107,253,0.04)',
                cursor: 'pointer',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                background: `${n.color}18`, border: `1px solid ${n.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                position: 'relative',
              }}>
                {n.icon}
                {!isRead && (
                  <div style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 10, height: 10, borderRadius: '50%',
                    background: n.color, border: '2px solid #FFFFFF',
                  }}/>
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{
                    fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, fontWeight: isRead ? 600 : 700,
                    color: isRead ? 'rgba(17,26,58,0.75)' : '#111A3A',
                  }}>{n.title}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: 'rgba(17,26,58,0.3)', flexShrink: 0, marginLeft: 8 }}>{n.time}</div>
                </div>
                <div style={{
                  fontFamily: 'Inter', fontSize: 12.5,
                  color: isRead ? 'rgba(17,26,58,0.4)' : 'rgba(17,26,58,0.65)',
                  lineHeight: 1.5,
                }}>{n.body}</div>
                {n.action && n.actionScreen && (
                  <button
                    onClick={e => { e.stopPropagation(); navigate(n.actionScreen as Screen) }}
                    style={{
                      marginTop: 10, padding: '6px 12px', borderRadius: 10, cursor: 'pointer',
                      background: `${n.color}18`, border: `1px solid ${n.color}30`,
                      fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: n.color,
                    }}
                  >{n.action} →</button>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🔔</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 17, fontWeight: 700, color: 'rgba(17,26,58,0.5)' }}>No notifications here</div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.3)', marginTop: 8 }}>This section is looking quiet for now.</div>
          </div>
        )}
      </div>

      <BottomNav current="dashboard" navigate={navigate}/>
    </div>
  )
}
