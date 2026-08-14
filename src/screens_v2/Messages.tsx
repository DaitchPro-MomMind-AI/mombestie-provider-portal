import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

const THREADS = [
  {
    id: 1, name: 'Sarah K.', avatar: 'SK', color: '#246BFD',
    service: 'Babysitting · Aug 14', last: 'Can you arrive 15 minutes earlier?',
    time: '9:32 AM', unread: 2, status: 'upcoming',
  },
  {
    id: 2, name: 'Fatima M.', avatar: 'FM', color: '#F472B6',
    service: 'Request · Aug 16', last: 'Hi! I sent a booking request for Saturday.',
    time: 'Yesterday', unread: 0, status: 'request',
  },
  {
    id: 3, name: 'Ahmed F.', avatar: 'AF', color: '#10B981',
    service: 'Completed · Aug 12', last: 'Thanks for the wonderful session! ⭐⭐⭐⭐⭐',
    time: 'Aug 12', unread: 0, status: 'completed',
  },
  {
    id: 4, name: 'Nadia H.', avatar: 'NH', color: '#A855F7',
    service: 'Newborn Care · Today', last: "Looking forward to seeing you at 3 PM!",
    time: '8:15 AM', unread: 0, status: 'upcoming',
  },
]

const CHAT_MSGS = [
  { role: 'customer', text: 'Hi Ayesha! Excited for today\'s session.', time: '8:15 AM' },
  { role: 'provider', text: 'Hello Sarah! I\'m looking forward to it. See you at 9 AM!', time: '8:22 AM' },
  { role: 'customer', text: 'One quick thing — can you arrive 15 minutes earlier? Around 8:45 AM?', time: '9:32 AM' },
  { role: 'ai-suggest', text: 'AI suggests: "Absolutely! I can arrive at 8:45 AM. See you then!"', time: '' },
]

export default function Messages({ navigate }: Props) {
  const [tab, setTab] = useState(0)
  const [openThread, setOpenThread] = useState<number | null>(null)
  const [chatMsg, setChatMsg] = useState('')
  const [chatHistory, setChatHistory] = useState(CHAT_MSGS)
  const [aiAssist, setAiAssist] = useState(false)

  if (openThread !== null) {
    const thread = THREADS.find(t => t.id === openThread)!
    return (
      <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
        {/* Chat header */}
        <div style={{
          padding: '48px 16px 14px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(17,26,58,0.08)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setOpenThread(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111A3A', padding: 4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${thread.color}20`, border: `1.5px solid ${thread.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 800, color: thread.color }}>{thread.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: '#111A3A' }}>{thread.name}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.4)' }}>{thread.service}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.6)" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.56-1.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </button>
              <button onClick={() => navigate('ai')} style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(36,107,253,0.15)', border: '1px solid rgba(36,107,253,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 16 }}>✨</span>
              </button>
            </div>
          </div>
        </div>

        {/* Booking context bar */}
        <div style={{
          padding: '8px 16px',
          background: 'rgba(36,107,253,0.08)', borderBottom: '1px solid rgba(36,107,253,0.15)',
          display: 'flex', alignItems: 'center', gap: 8,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 14 }}>📅</span>
          <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.6)' }}>Babysitting · Today 9:00 AM · ৳2,380 net</span>
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: 11, color: '#246BFD' }}>View ›</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }} className="scrollbar-hide">
          {chatHistory.map((m, i) => {
            if (m.role === 'ai-suggest') {
              return (
                <div key={i} style={{
                  margin: '12px 0', padding: '12px 14px', borderRadius: 14,
                  background: 'rgba(36,107,253,0.1)', border: '1px solid rgba(36,107,253,0.25)',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }} className="anim-fade">
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'radial-gradient(circle, #246BFD, #7C3AED)', flexShrink: 0 }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: '#246BFD', marginBottom: 4 }}>✨ AI Reply Suggestion</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.8)', lineHeight: 1.5 }}>
                      "Absolutely! I can arrive at 8:45 AM. See you then!"
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      {['Professional', 'Friendly', 'Short', 'Translate'].map(s => (
                        <button key={s} style={{
                          padding: '4px 10px', borderRadius: 16, cursor: 'pointer',
                          background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
                          fontFamily: 'Inter', fontSize: 10.5, color: 'rgba(17,26,58,0.6)',
                        }}>{s}</button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button onClick={() => {
                        setChatHistory(h => h.filter(m => m.role !== 'ai-suggest').concat([{ role: 'provider', text: "Absolutely! I can arrive at 8:45 AM. See you then!", time: '9:41 AM' }]))
                      }} style={{
                        flex: 1, padding: '8px', borderRadius: 10, cursor: 'pointer', border: 'none',
                        background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                        fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'white',
                      }}>Send This</button>
                      <button onClick={() => setChatHistory(h => h.filter(m => m.role !== 'ai-suggest'))} style={{
                        flex: 1, padding: '8px', borderRadius: 10, cursor: 'pointer',
                        background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
                        fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.6)',
                      }}>Dismiss</button>
                    </div>
                  </div>
                </div>
              )
            }
            const isProvider = m.role === 'provider'
            return (
              <div key={i} style={{ display: 'flex', justifyContent: isProvider ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                <div style={{
                  maxWidth: '78%', padding: '11px 14px',
                  borderRadius: isProvider ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isProvider ? 'linear-gradient(135deg, #246BFD, #28A8FF)' : 'rgba(17,26,58,0.08)',
                  border: isProvider ? 'none' : '1px solid rgba(17,26,58,0.1)',
                }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 13.5, color: isProvider ? 'white' : '#111A3A', lineHeight: 1.5 }}>{m.text}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 10, color: isProvider ? 'rgba(17,26,58,0.6)' : 'rgba(17,26,58,0.35)', marginTop: 5, textAlign: 'right' }}>{m.time}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input */}
        <div style={{ padding: '10px 12px 16px', borderTop: '1px solid rgba(17,26,58,0.08)', background: 'rgba(255,255,255,0.95)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <button onClick={() => {
              if (!chatHistory.find(m => m.role === 'ai-suggest')) {
                setChatHistory(h => [...h, { role: 'ai-suggest', text: '', time: '' }])
              }
            }} style={{
              width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
              background: 'rgba(36,107,253,0.15)', border: '1px solid rgba(36,107,253,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>✨</button>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && chatMsg.trim()) {
                    setChatHistory(h => [...h, { role: 'provider', text: chatMsg, time: '9:41 AM' }])
                    setChatMsg('')
                  }
                }}
                placeholder="Message..."
                style={{
                  width: '100%', padding: '11px 44px 11px 16px', borderRadius: 24,
                  background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
                  color: '#111A3A', fontFamily: 'Inter', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button style={{
                position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: chatMsg.trim() ? 'linear-gradient(135deg, #246BFD, #28A8FF)' : 'rgba(17,26,58,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} onClick={() => {
                if (chatMsg.trim()) {
                  setChatHistory(h => [...h, { role: 'provider', text: chatMsg, time: '9:41 AM' }])
                  setChatMsg('')
                }
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '48px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A' }}>Messages</div>
          <button onClick={() => navigate('ai')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'rgba(36,107,253,0.15)', border: '1px solid rgba(36,107,253,0.3)', cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#246BFD' }}>
            ✨ AI Chat
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, background: 'rgba(17,26,58,0.06)', borderRadius: 12, padding: 4, marginBottom: 16 }}>
          {['Customers', 'MomBestie AI'].map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              flex: 1, padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: tab === i ? 'rgba(17,26,58,0.12)' : 'transparent',
              fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
              color: tab === i ? '#111A3A' : 'rgba(17,26,58,0.45)',
              transition: 'all 0.2s',
            }}>{t}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.3)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input placeholder="Search conversations..." style={{
            width: '100%', padding: '11px 14px 11px 34px', borderRadius: 12,
            background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.1)',
            color: '#111A3A', fontFamily: 'Inter', fontSize: 14, outline: 'none', boxSizing: 'border-box',
          }}/>
        </div>
      </div>

      {/* Thread list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">
        {tab === 0 && THREADS.map(t => (
          <div
            key={t.id}
            onClick={() => setOpenThread(t.id)}
            style={{
              display: 'flex', gap: 12, padding: '14px 20px', cursor: 'pointer',
              borderBottom: '1px solid rgba(17,26,58,0.05)',
              background: t.unread > 0 ? 'rgba(36,107,253,0.04)' : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: `${t.color}20`, border: `1.5px solid ${t.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 800, color: t.color,
              }}>{t.avatar}</div>
              {t.unread > 0 && (
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 18, height: 18, borderRadius: '50%', background: '#246BFD',
                  border: '2px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: 'white',
                }}>{t.unread}</div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: t.unread > 0 ? 700 : 600, color: '#111A3A' }}>{t.name}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.35)', flexShrink: 0, marginLeft: 8 }}>{t.time}</div>
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#246BFD', marginBottom: 4 }}>{t.service}</div>
              <div style={{
                fontFamily: 'Inter', fontSize: 13, color: t.unread > 0 ? 'rgba(17,26,58,0.7)' : 'rgba(17,26,58,0.4)',
                fontWeight: t.unread > 0 ? 500 : 400,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{t.last}</div>
            </div>
          </div>
        ))}

        {tab === 1 && (
          <div style={{ padding: '20px 16px' }}>
            <div style={{
              padding: '20px', borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(36,107,253,0.15) 0%, rgba(168,85,247,0.08) 100%)',
              border: '1px solid rgba(36,107,253,0.25)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 45%, #7C3AED 100%)',
                boxShadow: '0 0 24px rgba(36,107,253,0.6)',
                marginBottom: 14,
              }} className="anim-orb-idle"/>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 17, fontWeight: 800, color: '#111A3A', marginBottom: 6 }}>MomBestie AI</div>
              <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.5)', lineHeight: 1.5, marginBottom: 16 }}>
                Your AI business partner. Ask anything about your bookings, pricing, customers and earnings.
              </div>
              <button onClick={() => navigate('ai')} style={{
                padding: '12px 28px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white',
              }}>Open AI Chat</button>
            </div>
          </div>
        )}
      </div>

      <BottomNav current="messages" navigate={navigate}/>
    </div>
  )
}
