import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import type { Screen } from '../App'

interface Props { navigate: (s: Screen) => void }

const SERVICES = [
  {
    name: 'Babysitting', category: 'Childcare',
    myPrice: 700, aiPrice: 800, min: 650, max: 950, currency: '৳', unit: 'hr',
    status: 'competitive', confidence: 'high',
    factors: ['High weekend demand in Dhaka', '47 similar providers nearby', 'Your 4.9 rating commands premium', 'Peak season booking activity'],
  },
  {
    name: 'Childcare', category: 'Childcare',
    myPrice: 700, aiPrice: 780, min: 650, max: 900, currency: '৳', unit: 'hr',
    status: 'competitive', confidence: 'high',
    factors: ['Similar to babysitting demand', 'Longer sessions typically valued higher', 'Mid-week availability opens pricing room'],
  },
  {
    name: 'Newborn Care', category: 'Newborn',
    myPrice: 2100, aiPrice: 2400, min: 1800, max: 3200, currency: '৳', unit: 'session',
    status: 'below', confidence: 'medium',
    factors: ['Specialized service commands premium', 'Limited providers in your area', 'Your certification supports higher pricing'],
  },
]

const CONFIDENCE_COLOR: Record<string, string> = {
  high: '#10B981', medium: '#F59E0B', low: '#FF6B6B',
}
const STATUS_COLOR: Record<string, string> = {
  competitive: '#10B981', below: '#F59E0B', premium: '#246BFD',
}
const STATUS_LABEL: Record<string, string> = {
  competitive: '🟢 Competitive', below: '🟡 Below Market', premium: '💎 Premium',
}

export default function SmartPricing({ navigate }: Props) {
  const [selectedService, setSelectedService] = useState(0)
  const [appliedPrices, setAppliedPrices] = useState<Record<string, number>>({})
  const [thinking, setThinking] = useState(false)
  const [analysisVisible, setAnalysisVisible] = useState(false)

  const service = SERVICES[selectedService]
  const effectivePrice = appliedPrices[service.name] ?? service.myPrice
  const applied = effectivePrice === service.aiPrice

  const handleAnalyze = () => {
    setThinking(true)
    setAnalysisVisible(false)
    setTimeout(() => { setThinking(false); setAnalysisVisible(true) }, 1600)
  }

  const rangePercent = (price: number) =>
    Math.min(100, Math.max(0, ((price - service.min) / (service.max - service.min)) * 100))

  return (
    <div style={{ height: '100%', background: '#F7F9FF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="scrollbar-hide">

        {/* Header */}
        <div style={{
          padding: '48px 20px 20px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -40, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}/>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <button onClick={() => navigate('more')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,26,58,0.4)', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              <span style={{ fontFamily: 'Inter', fontSize: 12 }}>More</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'radial-gradient(circle at 38% 32%, #5BAAFF 0%, #246BFD 45%, #7C3AED 100%)',
              boxShadow: '0 0 16px rgba(36,107,253,0.6)',
              flexShrink: 0,
            }} className="anim-orb-idle"/>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A', letterSpacing: '-0.4px' }}>AI Smart Pricing</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>Powered by local marketplace intelligence</div>
            </div>
          </div>

          {/* Dhaka context */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10,
            background: 'rgba(17,26,58,0.06)', border: '1px solid rgba(17,26,58,0.08)', width: 'fit-content',
          }}>
            <span>🇧🇩</span>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.6)' }}>Dhaka, Bangladesh · BDT ৳</span>
          </div>
        </div>

        {/* Service selector */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
            {SERVICES.map((s, i) => (
              <button key={s.name} onClick={() => { setSelectedService(i); setAnalysisVisible(false) }} style={{
                padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', flexShrink: 0,
                background: selectedService === i ? '#246BFD' : 'rgba(17,26,58,0.07)',
                fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
                color: selectedService === i ? 'white' : 'rgba(17,26,58,0.5)',
                boxShadow: selectedService === i ? '0 4px 12px rgba(36,107,253,0.4)' : 'none',
              }}>{s.name}</button>
            ))}
          </div>
        </div>

        {/* Main pricing card */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            borderRadius: 22, padding: '20px',
            background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.09)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Status badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, marginBottom: 16,
              background: `${STATUS_COLOR[service.status]}18`, border: `1px solid ${STATUS_COLOR[service.status]}35`,
              fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: STATUS_COLOR[service.status],
            }}>
              {STATUS_LABEL[service.status]}
            </div>

            {/* Price comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {/* My price */}
              <div style={{
                padding: '16px', borderRadius: 16,
                background: applied ? 'rgba(16,185,129,0.08)' : 'rgba(17,26,58,0.06)',
                border: applied ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(17,26,58,0.1)',
              }}>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.4)', marginBottom: 8, letterSpacing: 0.5 }}>YOUR PRICE</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#111A3A', letterSpacing: '-0.5px' }}>
                  {service.currency}{effectivePrice.toLocaleString()}
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.4)', marginTop: 4 }}>per {service.unit}</div>
                {applied && <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#10B981', marginTop: 6 }}>✓ AI Recommended</div>}
              </div>

              {/* AI recommended */}
              <div style={{
                padding: '16px', borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(36,107,253,0.18) 0%, rgba(168,85,247,0.1) 100%)',
                border: '1px solid rgba(36,107,253,0.3)',
                position: 'relative',
              }}>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#5BAAFF', marginBottom: 8, letterSpacing: 0.5 }}>AI RECOMMENDED</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#28A8FF', letterSpacing: '-0.5px' }}>
                  {service.currency}{service.aiPrice.toLocaleString()}
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgba(17,26,58,0.4)', marginTop: 4 }}>per {service.unit}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#A855F7', marginTop: 6 }}>
                  +{service.currency}{(service.aiPrice - effectivePrice).toLocaleString()} more
                </div>
              </div>
            </div>

            {/* Market range bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(17,26,58,0.4)' }}>Local Market Range</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(17,26,58,0.55)' }}>
                  {service.currency}{service.min.toLocaleString()} – {service.currency}{service.max.toLocaleString()}/{service.unit}
                </span>
              </div>
              <div style={{ position: 'relative', height: 12, borderRadius: 6, background: 'rgba(17,26,58,0.08)' }}>
                {/* Range fill */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: '5%', right: '5%', borderRadius: 6,
                  background: 'linear-gradient(90deg, rgba(36,107,253,0.3), rgba(36,107,253,0.5))',
                }}/>
                {/* My price dot */}
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
                  left: `${rangePercent(effectivePrice)}%`,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'white', border: '3px solid #10B981',
                  boxShadow: '0 0 8px rgba(16,185,129,0.6)',
                }}/>
                {/* AI price dot */}
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
                  left: `${rangePercent(service.aiPrice)}%`,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#246BFD', border: '3px solid #28A8FF',
                  boxShadow: '0 0 12px rgba(36,107,253,0.7)',
                }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'white', border: '2px solid #10B981' }}/>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(17,26,58,0.4)' }}>Your price</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#246BFD', border: '2px solid #28A8FF' }}/>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(17,26,58,0.4)' }}>AI recommended</span>
                </div>
              </div>
            </div>

            {/* Confidence */}
            <div style={{
              padding: '10px 12px', borderRadius: 12, marginBottom: 16,
              background: `${CONFIDENCE_COLOR[service.confidence]}10`,
              border: `1px solid ${CONFIDENCE_COLOR[service.confidence]}25`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: CONFIDENCE_COLOR[service.confidence], flexShrink: 0 }}/>
              <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: CONFIDENCE_COLOR[service.confidence] }}>
                {service.confidence === 'high' ? 'High' : service.confidence === 'medium' ? 'Medium' : 'Low'} Confidence
              </span>
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.4)' }}>
                · Based on recent marketplace activity
              </span>
            </div>

            {/* Action buttons */}
            {!applied ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setAppliedPrices(p => ({ ...p, [service.name]: service.aiPrice }))} style={{
                  flex: 2, padding: '13px', borderRadius: 13, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #246BFD, #28A8FF)',
                  boxShadow: '0 6px 20px rgba(36,107,253,0.4)',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white',
                }}>Use Recommended ({service.currency}{service.aiPrice}/hr)</button>
                <button style={{
                  flex: 1, padding: '13px', borderRadius: 13, cursor: 'pointer',
                  background: 'rgba(17,26,58,0.07)', border: '1px solid rgba(17,26,58,0.12)',
                  fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'rgba(17,26,58,0.7)',
                }}>Keep Mine</button>
              </div>
            ) : (
              <div style={{
                padding: '12px 14px', borderRadius: 13,
                background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', gap: 10,
              }} className="anim-bounce-in">
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M1 5.5l4 4.5L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: '#10B981' }}>Price Updated</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.5)', marginTop: 2 }}>Your marketplace listing has been updated.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Why this price */}
        <div style={{ padding: '0 16px 16px' }}>
          <button onClick={handleAnalyze} style={{
            width: '100%', padding: '13px', borderRadius: 14, cursor: 'pointer',
            background: thinking
              ? 'rgba(36,107,253,0.12)'
              : 'linear-gradient(135deg, rgba(36,107,253,0.2) 0%, rgba(168,85,247,0.12) 100%)',
            border: '1px solid rgba(36,107,253,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'radial-gradient(circle, #246BFD, #7C3AED)',
              flexShrink: 0,
            }} className={thinking ? 'anim-orb-think' : 'anim-orb-idle'}/>
            <span style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 600, color: thinking ? '#5BAAFF' : '#111A3A' }}>
              {thinking ? 'Analyzing local market...' : 'See Why AI Recommends This'}
            </span>
          </button>

          {analysisVisible && (
            <div style={{
              marginTop: 12, padding: '16px', borderRadius: 18,
              background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
            }} className="anim-fade-slide">
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'rgba(17,26,58,0.7)', marginBottom: 12 }}>
                Pricing Factors for {service.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {service.factors.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#246BFD', marginTop: 5, flexShrink: 0 }}/>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.7)', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 12, padding: '10px 12px', borderRadius: 10,
                background: 'rgba(36,107,253,0.08)', border: '1px solid rgba(36,107,253,0.15)',
                fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.5)', lineHeight: 1.5,
              }}>
                AI pricing is advisory only. You retain full control of your pricing. Data sourced from authorized marketplace activity in Dhaka, Bangladesh.
              </div>
            </div>
          )}
        </div>

        {/* Market insights teaser */}
        <div style={{ padding: '0 16px 24px' }}>
          <button onClick={() => navigate('marketinsights')} style={{
            width: '100%', padding: '14px 16px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
            background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(40,168,255,0.15)', border: '1px solid rgba(40,168,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📊</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: '#111A3A' }}>View Market Insights</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.4)', marginTop: 2 }}>Demand trends, popular times, local data</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.3)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <BottomNav current="dashboard" navigate={navigate}/>
    </div>
  )
}
