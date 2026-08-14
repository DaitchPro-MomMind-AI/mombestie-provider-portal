import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

const REVIEWS = [
  {
    name: 'Sarah K.', avatar: 'SK', color: '#246BFD', rating: 5, date: 'Aug 12, 2026',
    service: 'Babysitting',
    text: 'Ayesha was absolutely wonderful with my children. Arrived on time, very attentive, and the kids loved her! Will definitely book again.',
    replied: true, reply: 'Thank you so much Sarah! It was a pleasure caring for your wonderful children. See you next time! 😊',
  },
  {
    name: 'Ahmed F.', avatar: 'AF', color: '#10B981', rating: 5, date: 'Aug 8, 2026',
    service: 'Childcare',
    text: 'Professional, reliable and caring. Our daughter was happy the entire time. Highly recommend Ayesha to any family.',
    replied: false, reply: '',
  },
  {
    name: 'Priya S.', avatar: 'PS', color: '#F59E0B', rating: 5, date: 'Jul 31, 2026',
    service: 'Babysitting',
    text: 'Excellent communication and very gentle with our toddler. I felt completely at ease leaving my child in her care.',
    replied: true, reply: 'Thank you Priya! Your little one is such a joy. Happy to help anytime.',
  },
  {
    name: 'Maya L.', avatar: 'ML', color: '#A855F7', rating: 4, date: 'Jul 25, 2026',
    service: 'Babysitting',
    text: 'Very good experience overall. Ayesha is kind and responsible. Would book again.',
    replied: false, reply: '',
  },
  {
    name: 'Nadia H.', avatar: 'NH', color: '#FF6B6B', rating: 5, date: 'Jul 18, 2026',
    service: 'Newborn Care',
    text: 'Ayesha was brilliant with our newborn. She was calm, knowledgeable and gave us so much confidence. An absolute lifesaver.',
    replied: true, reply: 'It was such a privilege to care for your precious newborn. Wishing your family all the best!',
  },
]

const DIST = [5, 4, 3, 2, 1]
const DIST_COUNTS = [41, 4, 1, 1, 0]

export default function Reviews({ navigate }: Props) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [aiSuggest, setAiSuggest] = useState<string | null>(null)

  const handleReply = (i: number) => {
    setReplyingTo(i)
    setAiSuggest(null)
  }

  const getAiSuggestion = () => {
    setAiSuggest('Thank you so much for your kind words! It was truly a pleasure and I look forward to working with your family again. 😊')
  }

  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">

        {/* Header */}
        <div style={{ padding: '48px 20px 0', background: 'linear-gradient(180deg, #F7F9FF 0%, #FFFFFF 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <button onClick={() => navigate('more')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              <span style={{ fontFamily: 'Inter', fontSize: 12 }}>More</span>
            </button>
          </div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 20 }}>Reviews</div>

          {/* Rating overview */}
          <div style={{
            borderRadius: 20, padding: '20px', marginBottom: 20,
            background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
          }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              {/* Big rating */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 52, fontWeight: 800, color: 'white', lineHeight: 1 }}>4.9</div>
                <div style={{ color: '#F59E0B', fontSize: 18, marginTop: 4 }}>★★★★★</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.4)', marginTop: 4 }}>47 reviews</div>
              </div>

              {/* Bar breakdown */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {DIST.map((stars, i) => (
                  <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.5)', width: 8 }}>{stars}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(17,26,58,0.1)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        width: `${Math.round((DIST_COUNTS[i] / 47) * 100)}%`,
                        background: stars >= 4 ? '#F59E0B' : stars === 3 ? '#F97316' : '#FF6B6B',
                      }}/>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(17,26,58,0.4)', width: 16, textAlign: 'right' }}>{DIST_COUNTS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Review Summary */}
          <div style={{
            borderRadius: 16, padding: '14px',
            background: 'linear-gradient(135deg, rgba(36,107,253,0.15) 0%, rgba(168,85,247,0.08) 100%)',
            border: '1px solid rgba(36,107,253,0.25)',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'radial-gradient(circle, #246BFD, #7C3AED)', flexShrink: 0 }}/>
              <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#5BAAFF' }}>✨ AI Review Summary</span>
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.82)', margin: 0, lineHeight: 1.55 }}>
              "Recent customers frequently mention <strong style={{ color: 'white' }}>reliability</strong>, <strong style={{ color: 'white' }}>warmth</strong> and <strong style={{ color: 'white' }}>punctuality</strong>. Parents particularly appreciate your calm handling of newborns and toddlers. Your response time is noted positively."
            </p>
          </div>
        </div>

        {/* Review list */}
        <div style={{ padding: '0 16px' }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{
              marginBottom: 12, padding: '16px', borderRadius: 18,
              background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
            }}>
              {/* Reviewer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: `${r.color}20`, border: `1.5px solid ${r.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 800, color: r.color, flexShrink: 0,
                }}>{r.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white' }}>{r.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <div style={{ color: '#F59E0B', fontSize: 12 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.35)' }}>{r.date}</span>
                  </div>
                </div>
                <div style={{
                  padding: '3px 9px', borderRadius: 20, flexShrink: 0,
                  background: 'rgba(36,107,253,0.12)', border: '1px solid rgba(36,107,253,0.2)',
                  fontFamily: 'Inter', fontSize: 10.5, color: '#246BFD',
                }}>{r.service}</div>
              </div>

              <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.75)', margin: '0 0 12px', lineHeight: 1.55 }}>{r.text}</p>

              {/* Provider reply */}
              {r.replied && (
                <div style={{
                  padding: '10px 12px', borderRadius: 12,
                  background: 'rgba(36,107,253,0.08)', border: '1px solid rgba(36,107,253,0.15)',
                }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: '#246BFD', marginBottom: 5 }}>Your reply</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.7)', lineHeight: 1.5 }}>{r.reply}</div>
                </div>
              )}

              {/* Reply actions */}
              {!r.replied && replyingTo !== i && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleReply(i)} style={{
                    flex: 1, padding: '9px', borderRadius: 10, cursor: 'pointer',
                    background: 'rgba(36,107,253,0.12)', border: '1px solid rgba(36,107,253,0.25)',
                    fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#246BFD',
                  }}>Reply</button>
                  <button style={{
                    flex: 1, padding: '9px', borderRadius: 10, cursor: 'pointer',
                    background: 'rgba(17,26,58,0.06)', border: '1px solid rgba(17,26,58,0.1)',
                    fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.5)',
                  }}>Report</button>
                </div>
              )}

              {replyingTo === i && (
                <div>
                  {aiSuggest && (
                    <div style={{
                      padding: '10px 12px', borderRadius: 10, marginBottom: 8,
                      background: 'rgba(36,107,253,0.1)', border: '1px solid rgba(36,107,253,0.2)',
                    }}>
                      <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: '#246BFD', marginBottom: 5 }}>✨ AI suggestion</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.75)' }}>{aiSuggest}</div>
                      <button onClick={() => { setReplyText(aiSuggest); setAiSuggest(null) }} style={{
                        marginTop: 8, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', border: 'none',
                        background: '#246BFD', fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: 'white',
                      }}>Use this</button>
                    </div>
                  )}
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: 12,
                      background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.12)',
                      color: 'white', fontFamily: 'Inter', fontSize: 13.5, outline: 'none',
                      resize: 'none', boxSizing: 'border-box', marginBottom: 8,
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={getAiSuggestion} style={{
                      flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
                      background: 'rgba(36,107,253,0.12)', border: '1px solid rgba(36,107,253,0.25)',
                      fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#246BFD',
                    }}>✨ AI Help</button>
                    <button onClick={() => setReplyingTo(null)} style={{
                      flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
                      background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.1)',
                      fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.5)',
                    }}>Cancel</button>
                    <button style={{
                      flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', border: 'none',
                      background: replyText.trim() ? 'linear-gradient(135deg, #246BFD, #28A8FF)' : 'rgba(17,26,58,0.1)',
                      fontFamily: 'Inter', fontSize: 12, fontWeight: 700,
                      color: replyText.trim() ? 'white' : 'rgba(17,26,58,0.3)',
                    }}>Send</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav current="dashboard" navigate={navigate}/>
    </div>
  )
}
