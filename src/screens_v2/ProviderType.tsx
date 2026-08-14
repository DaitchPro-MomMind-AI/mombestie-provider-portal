import { useState } from 'react'
import type { Screen } from '../App'

// onContinue real -- the parent needs the actual chosen category/group to
// route Healthcare selections into the real HealthcareWizard (different
// backend table/fields entirely -- license, specialty, credentials) vs.
// every other group into the real family-service Onboarding flow.
interface Props { navigate: (s: Screen) => void; onContinue: (item: string, group: string) => void }

const CATEGORIES = [
  {
    group: 'Childcare',
    color: '#246BFD', bg: 'rgba(36,107,253,0.12)', border: 'rgba(36,107,253,0.25)',
    icon: '👶',
    items: ['Babysitter', 'Nanny', 'Newborn Care', 'Overnight Care', 'Family Assistant'],
  },
  {
    group: 'Home & Family',
    color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.22)',
    icon: '🏠',
    items: ['Cleaning', 'Meal Preparation', 'Laundry Support', 'Home Organization', 'Babyproofing'],
  },
  {
    group: 'Postpartum',
    color: '#F472B6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.22)',
    icon: '🌸',
    items: ['Postpartum Support', 'Doula', 'Postpartum Services'],
  },
  {
    group: 'Development & Learning',
    color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.22)',
    icon: '📚',
    items: ['Tutor', 'Music Teacher', 'Child Activity Provider', 'Swimming Instructor'],
  },
  {
    group: 'Memories & Events',
    color: '#A855F7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.22)',
    icon: '📷',
    items: ['Baby Photographer', 'Family Photographer', 'Event Support'],
  },
  {
    group: 'Healthcare',
    color: '#28A8FF', bg: 'rgba(40,168,255,0.1)', border: 'rgba(40,168,255,0.22)',
    icon: '⚕️',
    items: ['Pediatrician', 'Family Physician', 'Pediatric Dentist', 'Telehealth Provider', 'Clinic'],
    badge: 'Professional verification required',
  },
]

export default function ProviderType({ navigate, onContinue }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const handleSelect = (item: string, group: string) => {
    setSelected(item); setSelectedGroup(group)
  }

  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '52px 24px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => navigate('language')} style={{
            background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
            borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111A3A',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div style={{ flex: 1, display: 'flex', gap: 4 }}>
            {[1,2,3].map(s => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: '#246BFD' }}/>
            ))}
          </div>
        </div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
          How do you help families?
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.4)', margin: 0 }}>
          Choose the service type that best describes your work.
        </p>
      </div>

      {/* Categories */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }} className="scrollbar-hide">
        {CATEGORIES.map(cat => (
          <div key={cat.group} style={{ marginBottom: 14 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px 8px', marginBottom: 6,
            }}>
              <span style={{ fontSize: 16 }}>{cat.icon}</span>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: cat.color, letterSpacing: 0.3 }}>{cat.group}</span>
              {cat.badge && (
                <span style={{
                  fontFamily: 'Inter', fontSize: 9, fontWeight: 600, color: '#28A8FF',
                  background: 'rgba(40,168,255,0.12)', border: '1px solid rgba(40,168,255,0.25)',
                  padding: '2px 7px', borderRadius: 6, letterSpacing: 0.3, textTransform: 'uppercase',
                }}>Pro</span>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cat.items.map(item => {
                const isSelected = selected === item
                return (
                  <button
                    key={item}
                    onClick={() => handleSelect(item, cat.group)}
                    style={{
                      padding: '9px 16px', borderRadius: 24, cursor: 'pointer',
                      background: isSelected ? cat.bg : 'rgba(17,26,58,0.05)',
                      border: isSelected ? `1.5px solid ${cat.color}` : '1.5px solid rgba(17,26,58,0.1)',
                      fontFamily: 'Inter', fontSize: 13, fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? cat.color : 'rgba(17,26,58,0.65)',
                      transition: 'all 0.18s',
                    }}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '12px 20px 28px', flexShrink: 0, borderTop: '1px solid rgba(17,26,58,0.07)' }}>
        {selected && (
          <div style={{
            marginBottom: 12, padding: '10px 14px', borderRadius: 10,
            background: 'rgba(36,107,253,0.1)', border: '1px solid rgba(36,107,253,0.2)',
            fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.7)',
          }}>
            Selected: <strong style={{ color: '#111A3A' }}>{selected}</strong>
            <span style={{ color: 'rgba(17,26,58,0.4)' }}> in {selectedGroup}</span>
          </div>
        )}
        <button
          onClick={() => selected && selectedGroup && onContinue(selected, selectedGroup)}
          style={{
            width: '100%', padding: '15.5px', borderRadius: 14, border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
            background: selected
              ? 'linear-gradient(135deg, #246BFD 0%, #28A8FF 100%)'
              : 'rgba(17,26,58,0.1)',
            boxShadow: selected ? '0 8px 24px rgba(36,107,253,0.4)' : 'none',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 700,
            color: selected ? 'white' : 'rgba(17,26,58,0.35)',
            transition: 'all 0.2s',
          }}
        >
          {selected ? 'Continue →' : 'Select a service type'}
        </button>
      </div>
    </div>
  )
}
