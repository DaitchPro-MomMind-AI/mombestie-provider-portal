import { useState, useRef, useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking'

const PROMPTS = [
  "What's my schedule today?",
  "Who is my next customer?",
  "How much did I earn this week?",
  "What's the recommended price for babysitting?",
  "Help me respond to Sarah.",
  "Make me unavailable Sunday.",
  "Summarize today's bookings.",
  "Why is my payout pending?",
]

interface Msg { role: 'user' | 'ai'; text: string; ts: string }

const RESPONSES: Record<string, string> = {
  "What's my schedule today?": "You have **3 bookings today** in Dhaka:\n\n• 9:00 AM — Sarah K. · Babysitting · 4 hrs · ৳2,380 net\n• 12:30 PM — Ahmed F. · Childcare · 3 hrs · ৳1,785 net (in progress)\n• 3:00 PM — Nadia H. · Newborn Care · 2 hrs · ৳3,570 net\n\nTotal projected earnings today: **৳7,735 net**",
  "How much did I earn this week?": "This week you earned **৳28,450 gross** → **৳24,183 net** after the 15% platform fee.\n\n• 8 completed bookings\n• 0 cancellations\n• Average rating: ⭐ 4.9\n\nYour **৳4,850 balance** is available for payout now.",
  "What's the recommended price for babysitting?": "**AI Smart Pricing — Babysitting in Dhaka**\n\nYour current price: **৳700/hr**\nLocal market range: ৳650 – ৳950/hr\n**AI Recommended: ৳800/hr**\n\n🟢 Status: Competitive\n📊 Confidence: High\n\nBased on recent marketplace bookings, comparable providers with your rating typically earn ৳750–৳850/hr. Want me to update your price?",
}

function getResponse(msg: string): string {
  for (const [k, v] of Object.entries(RESPONSES)) {
    if (msg.toLowerCase().includes(k.toLowerCase().split("'")[0].split(' ')[0])) return v
  }
  return "I'm analyzing your provider data now... 🔍\n\nBased on your recent activity in Dhaka:\n\n• 3 bookings confirmed for today\n• 2 new messages from customers\n• ৳4,850 available balance\n\nIs there something specific I can help you with?"
}

function formatMsg(text: string) {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    return <div key={i} style={{ marginBottom: line === '' ? 6 : 2, lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }}/>
  })
}

export default function AIHome({ navigate }: Props) {
  const [orbState, setOrbState] = useState<OrbState>('idle')
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'ai', text: "Good morning, Ayesha! I'm your MomBestie AI assistant.\n\nYou have **3 bookings** today and **২ unread messages**. How can I help you?", ts: '9:41 AM' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, isTyping])

  const send = (text: string) => {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setMsgs(m => [...m, { role: 'user', text, ts: now }])
    setInput('')
    setOrbState('thinking')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setOrbState('speaking')
      const response = getResponse(text)
      setMsgs(m => [...m, { role: 'ai', text: response, ts: now }])
      setTimeout(() => setOrbState('idle'), 2000)
    }, 1400)
  }

  const orbClass = orbState === 'thinking' ? 'anim-orb-think' : 'anim-orb-idle'

  return (
    <div style={{ height: '100%', background: '#F7F9FF', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '48px 20px 16px', flexShrink: 0,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative',
      }}>
        {/* Ambient background glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 200,
          background: 'radial-gradient(ellipse, rgba(36,107,253,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        {/* AI Orb */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          {/* Rings */}
          {(orbState === 'listening' || orbState === 'speaking') && [0,1].map(i => (
            <div key={i} style={{
              position: 'absolute', inset: -16,
              borderRadius: '50%', border: '1px solid rgba(36,107,253,0.4)',
              animation: `ringPulse 1.8s ease-out infinite ${i * 0.9}s`,
            }}/>
          ))}
          <div style={{
            width: 72, height: 72, borderRadius: '50%', position: 'relative', zIndex: 1,
            background: 'radial-gradient(circle at 38% 32%, #7DBFFF 0%, #246BFD 35%, #7C3AED 70%, #EAF2FF 100%)',
            boxShadow: orbState !== 'idle'
              ? '0 0 50px 20px rgba(36,107,253,0.6), 0 0 100px 40px rgba(168,85,247,0.25)'
              : '0 0 30px 10px rgba(36,107,253,0.4)',
          }} className={orbClass}/>
        </div>

        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: 800, color: '#111A3A', textAlign: 'center' }}>MomBestie AI</div>
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.4)', marginTop: 3 }}>
          {orbState === 'idle' ? 'Your AI Business Partner' : orbState === 'thinking' ? 'Thinking...' : orbState === 'listening' ? 'Listening...' : 'Speaking...'}
        </div>

        {/* State indicators */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {[
            { label: '3 Bookings', color: '#246BFD' },
            { label: '₳4,850 Balance', color: '#10B981' },
            { label: '4.9★ Rating', color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '4px 10px', borderRadius: 20,
              background: `${s.color}15`, border: `1px solid ${s.color}30`,
              fontFamily: 'Inter', fontSize: 10.5, fontWeight: 500, color: s.color,
            }}>{s.label}</div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 0' }} className="scrollbar-hide">
        {/* Suggested prompts if first msg */}
        {msgs.length <= 1 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: 'rgba(17,26,58,0.3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Suggested</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {PROMPTS.slice(0, 6).map(p => (
                <button key={p} onClick={() => send(p)} style={{
                  padding: '8px 12px', borderRadius: 24, cursor: 'pointer',
                  background: 'rgba(36,107,253,0.12)', border: '1px solid rgba(36,107,253,0.25)',
                  fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.7)',
                  textAlign: 'left',
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {msgs.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            gap: 10, marginBottom: 14, alignItems: 'flex-end',
          }}>
            {msg.role === 'ai' && (
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 45%, #7C3AED 100%)',
                boxShadow: '0 0 10px rgba(36,107,253,0.5)',
              }}/>
            )}
            <div style={{
              maxWidth: '82%', padding: '12px 14px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)' : 'rgba(17,26,58,0.07)',
              border: msg.role === 'ai' ? '1px solid rgba(17,26,58,0.1)' : 'none',
              fontFamily: 'Inter', fontSize: 13.5, color: msg.role === 'user' ? 'white' : '#111A3A', lineHeight: 1.55,
            }}>
              {formatMsg(msg.text)}
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: msg.role === 'user' ? 'rgba(17,26,58,0.6)' : 'rgba(17,26,58,0.3)', marginTop: 6, textAlign: 'right' }}>{msg.ts}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-end' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 45%, #7C3AED 100%)', flexShrink: 0 }}/>
            <div style={{ padding: '14px 18px', borderRadius: '18px 18px 18px 4px', background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.1)', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#246BFD', animation: `pulseDot 1.2s ease-in-out infinite ${i * 0.2}s` }}/>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px 0', flexShrink: 0, borderTop: '1px solid rgba(17,26,58,0.07)', background: 'rgba(255,255,255,0.95)', paddingBottom: 80 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          {/* Voice button */}
          <button
            onClick={() => setOrbState(s => s === 'listening' ? 'idle' : 'listening')}
            style={{
              width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
              background: orbState === 'listening' ? 'linear-gradient(135deg, #246BFD, #28A8FF)' : 'rgba(17,26,58,0.08)',
              boxShadow: orbState === 'listening' ? '0 0 16px rgba(36,107,253,0.6)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={orbState === 'listening' ? 'white' : 'rgba(17,26,58,0.55)'} strokeWidth="2" strokeLinecap="round">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Ask MomBestie AI anything..."
              style={{
                width: '100%', padding: '12px 44px 12px 16px', borderRadius: 24,
                background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
                color: '#111A3A', fontFamily: 'Inter', fontSize: 14, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={() => send(input)}
              style={{
                position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: input.trim() ? 'linear-gradient(135deg, #246BFD, #28A8FF)' : 'rgba(17,26,58,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <BottomNav current="ai" navigate={navigate}/>
    </div>
  )
}
