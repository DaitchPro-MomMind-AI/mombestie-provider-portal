import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

type ViewMode = 'day' | 'week' | 'month'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

// Calendar data for Aug 2026
const BOOKINGS_BY_DAY: Record<number, { color: string; label: string }[]> = {
  14: [{ color: '#246BFD', label: 'Sarah K.' }, { color: '#246BFD', label: 'Ahmed F.' }, { color: '#246BFD', label: 'Nadia H.' }],
  16: [{ color: '#F59E0B', label: 'Fatima M.' }],
  18: [{ color: '#246BFD', label: 'Riya B.' }],
  20: [{ color: '#A855F7', label: 'Tasneem K.' }],
  21: [{ color: '#10B981', label: 'Blocked' }],
  22: [{ color: '#246BFD', label: 'Priya S.' }],
  25: [{ color: '#246BFD', label: 'Maya L.' }],
  28: [{ color: '#10B981', label: 'Blocked' }],
  29: [{ color: '#10B981', label: 'Blocked' }],
}

const DAY_SLOTS = [
  { time: '8:00 AM', status: 'available' },
  { time: '9:00 AM', status: 'booked', label: 'Sarah K. · Babysitting', color: '#246BFD' },
  { time: '10:00 AM', status: 'booked', label: 'Sarah K. · Babysitting', color: '#246BFD' },
  { time: '11:00 AM', status: 'booked', label: 'Sarah K. · Babysitting', color: '#246BFD' },
  { time: '12:00 PM', status: 'booked', label: 'Ahmed F. · Childcare', color: '#28A8FF' },
  { time: '1:00 PM', status: 'booked', label: 'Ahmed F. · Childcare', color: '#28A8FF' },
  { time: '2:00 PM', status: 'booked', label: 'Ahmed F. · Childcare', color: '#28A8FF' },
  { time: '3:00 PM', status: 'booked', label: 'Nadia H. · Newborn Care', color: '#A855F7' },
  { time: '4:00 PM', status: 'booked', label: 'Nadia H. · Newborn Care', color: '#A855F7' },
  { time: '5:00 PM', status: 'available' },
  { time: '6:00 PM', status: 'available' },
  { time: '7:00 PM', status: 'available' },
  { time: '8:00 PM', status: 'blocked', label: 'Personal time' },
  { time: '9:00 PM', status: 'blocked', label: 'Personal time' },
]

export default function Calendar({ navigate }: Props) {
  const [view, setView] = useState<ViewMode>('month')
  const [selectedDay, setSelectedDay] = useState(14)
  const [aiInput, setAiInput] = useState('')
  const [aiMsg, setAiMsg] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleAI = () => {
    if (!aiInput.trim()) return
    setAiMsg(`I'll ${aiInput.toLowerCase().includes('open') || aiInput.toLowerCase().includes('available') ? 'open your availability' : 'update your calendar'}. Shall I confirm this change?`)
    setShowConfirm(true)
    setAiInput('')
  }

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '48px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <button onClick={() => navigate('more')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              <span style={{ fontFamily: 'Inter', fontSize: 12 }}>More</span>
            </button>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: 'white' }}>Calendar</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.12)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.6)" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 0, background: 'rgba(17,26,58,0.06)', borderRadius: 12, padding: 4, marginBottom: 16 }}>
          {(['day', 'week', 'month'] as ViewMode[]).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              flex: 1, padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: view === v ? 'rgba(17,26,58,0.12)' : 'transparent',
              fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
              color: view === v ? 'white' : 'rgba(17,26,58,0.4)', textTransform: 'capitalize',
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', paddingBottom: 80 }} className="scrollbar-hide">

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          {[
            { color: '#246BFD', label: 'Booked' },
            { color: '#F59E0B', label: 'Pending' },
            { color: '#10B981', label: 'Blocked' },
            { color: 'rgba(17,26,58,0.15)', label: 'Available' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }}/>
              <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.45)' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Month view */}
        {view === 'month' && (
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
            marginBottom: 16,
          }}>
            {/* Month header */}
            <div style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid rgba(17,26,58,0.07)',
            }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)', fontSize: 18 }}>‹</button>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: 'white' }}>August 2026</div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)', fontSize: 18 }}>›</button>
            </div>

            {/* Day labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '10px 8px 4px' }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: 'rgba(17,26,58,0.3)' }}>{d}</div>
              ))}
            </div>

            {/* Days grid — Aug 2026 starts on Saturday (col 6) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, padding: '4px 8px 12px' }}>
              {/* Offset: Aug 1 is Saturday = index 6 */}
              {Array.from({ length: 6 }, (_, i) => (
                <div key={`empty-${i}`}/>
              ))}
              {MONTH_DAYS.map(day => {
                const bookings = BOOKINGS_BY_DAY[day] || []
                const isSelected = selectedDay === day
                const isToday = day === 14
                return (
                  <button
                    key={day}
                    onClick={() => { setSelectedDay(day); setView('day') }}
                    style={{
                      height: 44, borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: isSelected ? '#246BFD' : isToday ? 'rgba(36,107,253,0.2)' : 'transparent',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                      position: 'relative',
                    }}
                  >
                    <span style={{
                      fontFamily: 'Inter', fontSize: 13, fontWeight: isToday || isSelected ? 700 : 400,
                      color: isSelected ? 'white' : isToday ? '#246BFD' : 'rgba(17,26,58,0.75)',
                    }}>{day}</span>
                    {bookings.length > 0 && (
                      <div style={{ display: 'flex', gap: 2 }}>
                        {bookings.slice(0, 3).map((b, i) => (
                          <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? 'rgba(17,26,58,0.8)' : b.color }}/>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Day view */}
        {(view === 'day' || view === 'month') && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)' }}>
                {view === 'day' ? `${FULL_DAYS[new Date(2026, 7, selectedDay).getDay()]}, Aug ${selectedDay}` : `Aug ${selectedDay} — Schedule`}
              </div>
              <button style={{
                padding: '6px 12px', borderRadius: 20, cursor: 'pointer', border: 'none',
                background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: 'white',
              }}>+ Block Time</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {DAY_SLOTS.map((slot, i) => {
                const isFirst = i === 0 || DAY_SLOTS[i - 1].status !== slot.status || DAY_SLOTS[i - 1].label !== slot.label
                const isLast = i === DAY_SLOTS.length - 1 || DAY_SLOTS[i + 1].status !== slot.status || DAY_SLOTS[i + 1].label !== slot.label

                return (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 56, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(17,26,58,0.35)', textAlign: 'right', flexShrink: 0 }}>
                      {isFirst ? slot.time : ''}
                    </div>
                    <div style={{
                      flex: 1, height: 44,
                      borderRadius: isFirst && isLast ? 10 : isFirst ? '10px 10px 2px 2px' : isLast ? '2px 2px 10px 10px' : 2,
                      background: slot.status === 'booked'
                        ? `${slot.color}22`
                        : slot.status === 'blocked'
                        ? 'rgba(17,26,58,0.05)'
                        : 'rgba(36,107,253,0.06)',
                      border: slot.status === 'booked'
                        ? `1px solid ${slot.color}40`
                        : slot.status === 'blocked'
                        ? '1px solid rgba(17,26,58,0.08)'
                        : '1px dashed rgba(36,107,253,0.2)',
                      display: 'flex', alignItems: 'center', paddingLeft: 12,
                      borderLeft: slot.status === 'booked' ? `3px solid ${slot.color}` : undefined,
                    }}>
                      {isFirst && slot.label && (
                        <span style={{
                          fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
                          color: slot.status === 'booked' ? 'rgba(17,26,58,0.8)' : 'rgba(17,26,58,0.35)',
                        }}>{slot.label}</span>
                      )}
                      {slot.status === 'available' && isFirst && (
                        <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(36,107,253,0.6)' }}>Available</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {view === 'week' && (
          <div>
            {/* Week grid */}
            <div style={{
              borderRadius: 18, overflow: 'hidden',
              background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
              marginBottom: 16,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgba(17,26,58,0.07)' }}>
                {[10,11,12,13,14,15,16].map((d, i) => (
                  <div key={d} style={{
                    padding: '10px 4px', textAlign: 'center',
                    background: d === 14 ? 'rgba(36,107,253,0.15)' : 'transparent',
                    borderRight: i < 6 ? '1px solid rgba(17,26,58,0.05)' : 'none',
                  }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(17,26,58,0.35)', marginBottom: 4 }}>{DAYS[i]}</div>
                    <div style={{
                      fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: d === 14 ? 700 : 400,
                      color: d === 14 ? '#246BFD' : 'rgba(17,26,58,0.7)',
                    }}>{d}</div>
                    {BOOKINGS_BY_DAY[d] && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 4 }}>
                        {BOOKINGS_BY_DAY[d].slice(0, 3).map((b, bi) => (
                          <div key={bi} style={{ width: 5, height: 5, borderRadius: '50%', background: b.color }}/>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Week summary */}
              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-around' }}>
                {[
                  { label: 'Bookings', value: '5' },
                  { label: 'Hours', value: '18' },
                  { label: 'Net Earn.', value: '৳14,470' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: 800, color: '#246BFD' }}>{s.value}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Calendar assistant */}
        <div style={{
          padding: '14px', borderRadius: 18, marginBottom: 12,
          background: 'linear-gradient(135deg, rgba(36,107,253,0.15) 0%, rgba(168,85,247,0.08) 100%)',
          border: '1px solid rgba(36,107,253,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 45%, #7C3AED 100%)',
            }} className="anim-orb-idle"/>
            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#5BAAFF' }}>AI Calendar Command</span>
          </div>
          {aiMsg && showConfirm ? (
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.85)', marginBottom: 12, lineHeight: 1.5 }}>"{aiMsg}"</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setShowConfirm(false); setAiMsg(null) }} style={{
                  flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', border: 'none',
                  background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                  fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'white',
                }}>✓ Confirm</button>
                <button onClick={() => { setShowConfirm(false); setAiMsg(null) }} style={{
                  flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
                  background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
                  fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.6)',
                }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAI()}
                placeholder="e.g. 'Open Friday 9 AM to 4 PM'"
                style={{
                  flex: 1, padding: '11px 14px', borderRadius: 12,
                  background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
                  color: 'white', fontFamily: 'Inter', fontSize: 13.5, outline: 'none',
                }}
              />
              <button onClick={handleAI} style={{
                width: 42, height: 42, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {["Block Sunday", "Open weekday mornings", "Set vacation Aug 28–30"].map(p => (
              <button key={p} onClick={() => setAiInput(p)} style={{
                padding: '5px 10px', borderRadius: 16, cursor: 'pointer',
                background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.1)',
                fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.55)',
              }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Availability summary */}
        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 10 }}>
          This Week's Availability
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => {
            const hours = [8, 9, 8, 8, 6, 0][i]
            const status = hours === 0 ? 'blocked' : hours >= 8 ? 'full' : 'partial'
            return (
              <div key={day} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                borderRadius: 13, background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
              }}>
                <div style={{ width: 4, height: 28, borderRadius: 2, background: status === 'blocked' ? 'rgba(17,26,58,0.2)' : status === 'full' ? '#246BFD' : '#F59E0B', flexShrink: 0 }}/>
                <div style={{ flex: 1, fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500, color: 'rgba(17,26,58,0.8)' }}>{day}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: status === 'blocked' ? 'rgba(17,26,58,0.3)' : 'rgba(17,26,58,0.55)' }}>
                  {status === 'blocked' ? 'Blocked' : `9 AM – ${9 + hours - 1} PM`}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: status === 'blocked' ? 'rgba(17,26,58,0.25)' : '#246BFD' }}>
                  {status === 'blocked' ? '—' : `${hours}h`}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav current="bookings" navigate={navigate}/>
    </div>
  )
}
