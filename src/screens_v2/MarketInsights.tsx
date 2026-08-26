import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'
import FlagIcon from '../components/FlagIcon'

interface Props { navigate: (s: Screen) => void }

const DEMAND_BARS = [45, 60, 40, 75, 85, 95, 70]
const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const INSIGHTS = [
  {
    icon: '📈', color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)',
    label: 'Rising Demand',
    title: 'Weekend childcare demand +18%',
    body: 'Saturday and Sunday bookings in Dhaka increased 18% this month. Consider opening more weekend slots.',
    action: 'Update Calendar', actionScreen: 'calendar',
  },
  {
    icon: '🕐', color: '#246BFD', bg: 'rgba(36,107,253,0.12)', border: 'rgba(36,107,253,0.25)',
    label: 'Peak Time',
    title: 'Saturday evenings are highest demand',
    body: 'Providers with Saturday 5–9 PM availability receive 3× more requests than those without.',
    action: null, actionScreen: null,
  },
  {
    icon: '💡', color: '#A855F7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)',
    label: 'Pricing Insight',
    title: 'Your rate is competitive but leave room',
    body: 'Your ৳700/hr babysitting rate falls within the local range (৳650–৳950). With your 4.9 rating, ৳800 is sustainable.',
    action: 'AI Smart Pricing', actionScreen: 'smartpricing',
  },
  {
    icon: '📸', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)',
    label: 'Profile Opportunity',
    title: 'Providers with photos get 2× more views',
    body: "Your profile is missing recent service photos. Adding 3+ photos can significantly increase your booking rate.",
    action: 'Edit Profile', actionScreen: 'profile',
  },
  {
    icon: '🌙', color: '#28A8FF', bg: 'rgba(40,168,255,0.12)', border: 'rgba(40,168,255,0.25)',
    label: 'Availability Gap',
    title: 'No Sunday availability',
    body: '4 customers searched for Sunday childcare in your service area this week. You currently have no Sunday slots.',
    action: 'Open Sundays', actionScreen: 'calendar',
  },
]

export default function MarketInsights({ navigate }: Props) {
  const [period, setPeriod] = useState(0)

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">

        {/* Header */}
        <div style={{
          padding: '48px 20px 20px',
          background: 'linear-gradient(180deg, #F7F9FF 0%, #FFFFFF 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <button onClick={() => navigate('more')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              <span style={{ fontFamily: 'Inter', fontSize: 12 }}>More</span>
            </button>
          </div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A', marginBottom: 4 }}>Market Insights</div>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
            Local demand data for Dhaka, Bangladesh <FlagIcon code="BD" width={16} radius={2}/>
          </div>
        </div>

        {/* Period toggle */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', gap: 0, background: 'rgba(17,26,58,0.06)', borderRadius: 12, padding: 4 }}>
            {['This Week', 'This Month'].map((p, i) => (
              <button key={p} onClick={() => setPeriod(i)} style={{
                flex: 1, padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: period === i ? 'rgba(17,26,58,0.12)' : 'transparent',
                fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
                color: period === i ? '#111A3A' : 'rgba(17,26,58,0.4)',
              }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Demand chart */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            borderRadius: 20, padding: '18px',
            background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
          }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 4 }}>Childcare Search Demand</div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.35)', marginBottom: 18 }}>Dhaka area · Indexed demand by day</div>

            {/* Chart */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
              {DEMAND_BARS.map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: '100%', borderRadius: '5px 5px 0 0',
                    background: i === 5 ? 'linear-gradient(180deg, #246BFD, #28A8FF)'
                      : i === 4 ? 'rgba(36,107,253,0.45)' : 'rgba(36,107,253,0.2)',
                    height: `${h}%`, minHeight: 4,
                    boxShadow: i === 5 ? '0 0 12px rgba(36,107,253,0.6)' : 'none',
                    position: 'relative',
                  }}>
                    {i === 5 && (
                      <div style={{
                        position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                        padding: '2px 7px', borderRadius: 6,
                        background: '#246BFD', fontFamily: 'Inter', fontSize: 9, fontWeight: 700, color: 'white', whiteSpace: 'nowrap',
                      }}>Peak</div>
                    )}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 9.5, color: i === 5 ? '#246BFD' : 'rgba(17,26,58,0.35)', fontWeight: i === 5 ? 700 : 400 }}>{LABELS[i]}</div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 12, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(17,26,58,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: 'linear-gradient(135deg, #246BFD, #28A8FF)' }}/>
                <span style={{ fontFamily: 'Inter', fontSize: 10.5, color: 'rgba(17,26,58,0.4)' }}>Peak day (Sat)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(36,107,253,0.2)' }}/>
                <span style={{ fontFamily: 'Inter', fontSize: 10.5, color: 'rgba(17,26,58,0.4)' }}>Normal demand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Searches near you', value: period === 0 ? '142' : '580', icon: '🔍', color: '#246BFD' },
            { label: 'Active providers', value: '47', icon: '👥', color: '#28A8FF' },
            { label: 'Avg. booking rate', value: '৳762/hr', icon: '💰', color: '#10B981' },
          ].map(s => (
            <div key={s.label} style={{ padding: '14px 10px', borderRadius: 16, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)', textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 9.5, color: 'rgba(17,26,58,0.35)', marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Insight cards */}
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 12 }}>Insights for You</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {INSIGHTS.map((ins, i) => (
              <div key={i} style={{
                padding: '14px 14px', borderRadius: 18,
                background: ins.bg, border: `1px solid ${ins.border}`,
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: `${ins.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>{ins.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 10.5, fontWeight: 700, color: ins.color, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>{ins.label}</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#111A3A', marginBottom: 5 }}>{ins.title}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.6)', lineHeight: 1.5 }}>{ins.body}</div>
                    {ins.action && ins.actionScreen && (
                      <button onClick={() => navigate(ins.actionScreen as Screen)} style={{
                        marginTop: 10, padding: '7px 14px', borderRadius: 10, cursor: 'pointer',
                        background: `${ins.color}22`, border: `1px solid ${ins.color}40`,
                        fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: ins.color,
                      }}>{ins.action} →</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{
            padding: '12px 14px', borderRadius: 12,
            background: 'rgba(17,26,58,0.03)', border: '1px solid rgba(17,26,58,0.06)',
            fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.28)', lineHeight: 1.5,
          }}>
            Market insights are based on authorized marketplace activity data. No guaranteed income claims. Patterns may vary. AI insights are advisory only.
          </div>
        </div>
      </div>

      <BottomNav current="dashboard" navigate={navigate}/>
    </div>
  )
}
