import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

const TRANSACTIONS = [
  { customer: 'Sarah K.', service: 'Babysitting', date: 'Aug 14', gross: '৳2,800', net: '৳2,380', status: 'completed' },
  { customer: 'Ahmed F.', service: 'Childcare', date: 'Aug 12', gross: '৳2,100', net: '৳1,785', status: 'completed' },
  { customer: 'Priya S.', service: 'Babysitting', date: 'Aug 10', gross: '৳2,800', net: '৳2,380', status: 'completed' },
  { customer: 'Maya L.', service: 'Babysitting', date: 'Aug 8', gross: '৳2,800', net: '৳2,380', status: 'completed' },
  { customer: 'Riya B.', service: 'Childcare', date: 'Aug 6', gross: '৳3,500', net: '৳2,975', status: 'completed' },
  { customer: 'Nadia H.', service: 'Newborn Care', date: 'Aug 4', gross: '৳4,200', net: '৳3,570', status: 'completed' },
]

const WEEK_BARS = [35, 55, 40, 80, 65, 90, 70]
const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function Earnings({ navigate }: Props) {
  const [period, setPeriod] = useState(1)
  const PERIODS = ['This Week', 'This Month', 'This Year']
  const TOTALS = ['৳28,450', '৳48,200', '৳3,24,800']
  const NETS   = ['৳24,183', '৳40,970', '৳2,76,080']

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">

        {/* Hero */}
        <div style={{
          padding: '48px 20px 24px',
          background: 'linear-gradient(180deg, #F7F9FF 0%, #FFFFFF 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(36,107,253,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>

          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A', marginBottom: 20 }}>Earnings</div>

          {/* Balance hero card */}
          <div style={{
            borderRadius: 22, padding: '22px', marginBottom: 16,
            background: 'linear-gradient(135deg, rgba(36,107,253,0.25) 0%, rgba(40,168,255,0.12) 100%)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(36,107,253,0.35)',
          }}>
            <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: 'rgba(17,26,58,0.5)', letterSpacing: 0.5, marginBottom: 6 }}>AVAILABLE BALANCE</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 40, fontWeight: 800, color: '#111A3A', letterSpacing: '-1px', lineHeight: 1 }}>৳4,850</div>
            <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.45)', marginTop: 6 }}>Bangladesh Taka · BDT</div>
            <div style={{ marginTop: 16 }}>
              <button style={{
                width: '100%', padding: '13px', borderRadius: 13, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)',
                boxShadow: '0 6px 20px rgba(36,107,253,0.4)',
                fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <span>💸</span> Request Payout
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Pending', value: '৳7,140', sub: '3 bookings', color: '#F59E0B', icon: '⏳' },
              { label: 'Last Payout', value: '৳18,020', sub: 'Aug 10', color: '#10B981', icon: '✅' },
            ].map(c => (
              <div key={c.label} style={{
                padding: '14px', borderRadius: 16,
                background: 'rgba(17,26,58,0.05)', border: '1px solid rgba(17,26,58,0.08)',
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{c.icon}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: 800, color: c.color }}>{c.value}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.45)', marginTop: 3 }}>{c.label}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: 'rgba(17,26,58,0.3)', marginTop: 2 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Period selector */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', gap: 0, background: 'rgba(17,26,58,0.06)', borderRadius: 12, padding: 4, marginBottom: 16 }}>
            {PERIODS.map((p, i) => (
              <button key={p} onClick={() => setPeriod(i)} style={{
                flex: 1, padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: period === i ? 'rgba(17,26,58,0.12)' : 'transparent',
                fontFamily: 'Inter', fontSize: 12, fontWeight: 600,
                color: period === i ? '#111A3A' : 'rgba(17,26,58,0.4)',
                transition: 'all 0.2s',
              }}>{p}</button>
            ))}
          </div>

          {/* Period totals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Gross', value: TOTALS[period], color: '#111A3A' },
              { label: 'Commission (15%)', value: period === 0 ? '৳4,268' : period === 1 ? '৳7,230' : '৳48,720', color: '#FF6B6B' },
              { label: 'Net Earned', value: NETS[period], color: '#10B981' },
            ].map(s => (
              <div key={s.label} style={{ padding: '12px 10px', borderRadius: 14, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 9, color: 'rgba(17,26,58,0.35)', marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div style={{
            padding: '16px', borderRadius: 18,
            background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
            marginBottom: 16,
          }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 16 }}>Daily Earnings · BDT</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 72 }}>
              {WEEK_BARS.map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%', borderRadius: '5px 5px 0 0',
                    background: i === 5 ? 'linear-gradient(180deg, #246BFD, #28A8FF)' : 'rgba(36,107,253,0.3)',
                    height: `${h}%`,
                    boxShadow: i === 5 ? '0 0 10px rgba(36,107,253,0.5)' : 'none',
                    transition: 'height 0.6s ease',
                    minHeight: 4,
                  }}/>
                  <div style={{ fontFamily: 'Inter', fontSize: 9, color: 'rgba(17,26,58,0.35)' }}>{WEEK_LABELS[i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payout info */}
          <div style={{
            padding: '14px', borderRadius: 16, marginBottom: 16,
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📱</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#111A3A' }}>Payout via bKash</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.45)', marginTop: 2 }}>01XXXXXXXXXX · Verified</div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, color: '#246BFD' }}>Change</button>
          </div>

          {/* Transactions */}
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 10 }}>Recent Transactions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
            {TRANSACTIONS.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderRadius: 14, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: '#10B981', flexShrink: 0,
                }}>{t.customer.split(' ').map(w => w[0]).join('')}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#111A3A' }}>{t.customer}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>{t.service} · {t.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13.5, fontWeight: 600, color: '#10B981' }}>{t.net}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(17,26,58,0.3)', marginTop: 2 }}>{t.gross} gross</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav current="settings" navigate={navigate}/>
    </div>
  )
}
