import { useState, useMemo } from 'react'
import type { Screen } from '../App'
import FlagIcon from '../components/FlagIcon'

interface Props {
  navigate: (s: Screen) => void
  onSelect: (country: string, code: string) => void
}

const COUNTRIES = [
  { flag: '🇧🇩', name: 'Bangladesh', code: 'BD', dialCode: '+880' },
  { flag: '🇺🇸', name: 'United States', code: 'US', dialCode: '+1' },
  { flag: '🇬🇧', name: 'United Kingdom', code: 'GB', dialCode: '+44' },
  { flag: '🇨🇦', name: 'Canada', code: 'CA', dialCode: '+1' },
  { flag: '🇦🇺', name: 'Australia', code: 'AU', dialCode: '+61' },
  { flag: '🇮🇳', name: 'India', code: 'IN', dialCode: '+91' },
  { flag: '🇵🇰', name: 'Pakistan', code: 'PK', dialCode: '+92' },
  { flag: '🇦🇪', name: 'United Arab Emirates', code: 'AE', dialCode: '+971' },
  { flag: '🇸🇦', name: 'Saudi Arabia', code: 'SA', dialCode: '+966' },
  { flag: '🇶🇦', name: 'Qatar', code: 'QA', dialCode: '+974' },
  { flag: '🇯🇵', name: 'Japan', code: 'JP', dialCode: '+81' },
  { flag: '🇰🇷', name: 'South Korea', code: 'KR', dialCode: '+82' },
  { flag: '🇸🇬', name: 'Singapore', code: 'SG', dialCode: '+65' },
  { flag: '🇲🇾', name: 'Malaysia', code: 'MY', dialCode: '+60' },
  { flag: '🇮🇩', name: 'Indonesia', code: 'ID', dialCode: '+62' },
  { flag: '🇵🇭', name: 'Philippines', code: 'PH', dialCode: '+63' },
  { flag: '🇩🇪', name: 'Germany', code: 'DE', dialCode: '+49' },
  { flag: '🇫🇷', name: 'France', code: 'FR', dialCode: '+33' },
  { flag: '🇪🇸', name: 'Spain', code: 'ES', dialCode: '+34' },
  { flag: '🇮🇹', name: 'Italy', code: 'IT', dialCode: '+39' },
  { flag: '🇳🇱', name: 'Netherlands', code: 'NL', dialCode: '+31' },
  { flag: '🇧🇪', name: 'Belgium', code: 'BE', dialCode: '+32' },
  { flag: '🇸🇪', name: 'Sweden', code: 'SE', dialCode: '+46' },
  { flag: '🇳🇴', name: 'Norway', code: 'NO', dialCode: '+47' },
  { flag: '🇩🇰', name: 'Denmark', code: 'DK', dialCode: '+45' },
  { flag: '🇫🇮', name: 'Finland', code: 'FI', dialCode: '+358' },
  { flag: '🇨🇭', name: 'Switzerland', code: 'CH', dialCode: '+41' },
  { flag: '🇦🇹', name: 'Austria', code: 'AT', dialCode: '+43' },
  { flag: '🇮🇪', name: 'Ireland', code: 'IE', dialCode: '+353' },
  { flag: '🇵🇹', name: 'Portugal', code: 'PT', dialCode: '+351' },
  { flag: '🇵🇱', name: 'Poland', code: 'PL', dialCode: '+48' },
  { flag: '🇬🇷', name: 'Greece', code: 'GR', dialCode: '+30' },
  { flag: '🇹🇷', name: 'Türkiye', code: 'TR', dialCode: '+90' },
  { flag: '🇿🇦', name: 'South Africa', code: 'ZA', dialCode: '+27' },
  { flag: '🇳🇬', name: 'Nigeria', code: 'NG', dialCode: '+234' },
  { flag: '🇰🇪', name: 'Kenya', code: 'KE', dialCode: '+254' },
  { flag: '🇪🇬', name: 'Egypt', code: 'EG', dialCode: '+20' },
  { flag: '🇲🇦', name: 'Morocco', code: 'MA', dialCode: '+212' },
  { flag: '🇧🇷', name: 'Brazil', code: 'BR', dialCode: '+55' },
  { flag: '🇲🇽', name: 'Mexico', code: 'MX', dialCode: '+52' },
  { flag: '🇦🇷', name: 'Argentina', code: 'AR', dialCode: '+54' },
  { flag: '🇨🇱', name: 'Chile', code: 'CL', dialCode: '+56' },
  { flag: '🇨🇴', name: 'Colombia', code: 'CO', dialCode: '+57' },
  { flag: '🇨🇿', name: 'Czech Republic', code: 'CZ', dialCode: '+420' },
  { flag: '🇷🇴', name: 'Romania', code: 'RO', dialCode: '+40' },
  { flag: '🇭🇺', name: 'Hungary', code: 'HU', dialCode: '+36' },
  { flag: '🇺🇦', name: 'Ukraine', code: 'UA', dialCode: '+380' },
  { flag: '🇷🇺', name: 'Russia', code: 'RU', dialCode: '+7' },
  { flag: '🇮🇱', name: 'Israel', code: 'IL', dialCode: '+972' },
  { flag: '🇯🇴', name: 'Jordan', code: 'JO', dialCode: '+962' },
  { flag: '🇰🇼', name: 'Kuwait', code: 'KW', dialCode: '+965' },
  { flag: '🇧🇭', name: 'Bahrain', code: 'BH', dialCode: '+973' },
  { flag: '🇴🇲', name: 'Oman', code: 'OM', dialCode: '+968' },
  { flag: '🇱🇧', name: 'Lebanon', code: 'LB', dialCode: '+961' },
  { flag: '🇮🇶', name: 'Iraq', code: 'IQ', dialCode: '+964' },
  { flag: '🇮🇷', name: 'Iran', code: 'IR', dialCode: '+98' },
  { flag: '🇳🇵', name: 'Nepal', code: 'NP', dialCode: '+977' },
  { flag: '🇱🇰', name: 'Sri Lanka', code: 'LK', dialCode: '+94' },
  { flag: '🇲🇻', name: 'Maldives', code: 'MV', dialCode: '+960' },
  { flag: '🇧🇹', name: 'Bhutan', code: 'BT', dialCode: '+975' },
  { flag: '🇲🇲', name: 'Myanmar', code: 'MM', dialCode: '+95' },
  { flag: '🇹🇭', name: 'Thailand', code: 'TH', dialCode: '+66' },
  { flag: '🇻🇳', name: 'Vietnam', code: 'VN', dialCode: '+84' },
  { flag: '🇰🇭', name: 'Cambodia', code: 'KH', dialCode: '+855' },
  { flag: '🇱🇦', name: 'Laos', code: 'LA', dialCode: '+856' },
  { flag: '🇧🇳', name: 'Brunei', code: 'BN', dialCode: '+673' },
  { flag: '🇹🇱', name: 'Timor-Leste', code: 'TL', dialCode: '+670' },
  { flag: '🇳🇿', name: 'New Zealand', code: 'NZ', dialCode: '+64' },
  { flag: '🇵🇬', name: 'Papua New Guinea', code: 'PG', dialCode: '+675' },
  { flag: '🇫🇯', name: 'Fiji', code: 'FJ', dialCode: '+679' },
  { flag: '🇹🇿', name: 'Tanzania', code: 'TZ', dialCode: '+255' },
  { flag: '🇺🇬', name: 'Uganda', code: 'UG', dialCode: '+256' },
  { flag: '🇷🇼', name: 'Rwanda', code: 'RW', dialCode: '+250' },
  { flag: '🇪🇹', name: 'Ethiopia', code: 'ET', dialCode: '+251' },
  { flag: '🇬🇭', name: 'Ghana', code: 'GH', dialCode: '+233' },
  { flag: '🇸🇳', name: 'Senegal', code: 'SN', dialCode: '+221' },
  { flag: '🇨🇮', name: "Côte d'Ivoire", code: 'CI', dialCode: '+225' },
  { flag: '🇨🇲', name: 'Cameroon', code: 'CM', dialCode: '+237' },
  { flag: '🇹🇳', name: 'Tunisia', code: 'TN', dialCode: '+216' },
  { flag: '🇱🇾', name: 'Libya', code: 'LY', dialCode: '+218' },
  { flag: '🇩🇿', name: 'Algeria', code: 'DZ', dialCode: '+213' },
  { flag: '🇸🇩', name: 'Sudan', code: 'SD', dialCode: '+249' },
  { flag: '🇸🇴', name: 'Somalia', code: 'SO', dialCode: '+252' },
  { flag: '🇿🇲', name: 'Zambia', code: 'ZM', dialCode: '+260' },
  { flag: '🇿🇼', name: 'Zimbabwe', code: 'ZW', dialCode: '+263' },
  { flag: '🇧🇼', name: 'Botswana', code: 'BW', dialCode: '+267' },
  { flag: '🇲🇿', name: 'Mozambique', code: 'MZ', dialCode: '+258' },
  { flag: '🇲🇬', name: 'Madagascar', code: 'MG', dialCode: '+261' },
  { flag: '🇲🇺', name: 'Mauritius', code: 'MU', dialCode: '+230' },
  { flag: '🇸🇨', name: 'Seychelles', code: 'SC', dialCode: '+248' },
  { flag: '🇺🇾', name: 'Uruguay', code: 'UY', dialCode: '+598' },
  { flag: '🇵🇪', name: 'Peru', code: 'PE', dialCode: '+51' },
  { flag: '🇻🇪', name: 'Venezuela', code: 'VE', dialCode: '+58' },
  { flag: '🇪🇨', name: 'Ecuador', code: 'EC', dialCode: '+593' },
  { flag: '🇧🇴', name: 'Bolivia', code: 'BO', dialCode: '+591' },
  { flag: '🇵🇾', name: 'Paraguay', code: 'PY', dialCode: '+595' },
  { flag: '🇬🇾', name: 'Guyana', code: 'GY', dialCode: '+592' },
  { flag: '🇸🇷', name: 'Suriname', code: 'SR', dialCode: '+597' },
  { flag: '🇧🇧', name: 'Barbados', code: 'BB', dialCode: '+1' },
  { flag: '🇯🇲', name: 'Jamaica', code: 'JM', dialCode: '+1' },
  { flag: '🇹🇹', name: 'Trinidad & Tobago', code: 'TT', dialCode: '+1' },
  { flag: '🇧🇸', name: 'Bahamas', code: 'BS', dialCode: '+1' },
  { flag: '🇨🇷', name: 'Costa Rica', code: 'CR', dialCode: '+506' },
  { flag: '🇵🇦', name: 'Panama', code: 'PA', dialCode: '+507' },
  { flag: '🇬🇹', name: 'Guatemala', code: 'GT', dialCode: '+502' },
  { flag: '🇭🇳', name: 'Honduras', code: 'HN', dialCode: '+504' },
  { flag: '🇸🇻', name: 'El Salvador', code: 'SV', dialCode: '+503' },
  { flag: '🇳🇮', name: 'Nicaragua', code: 'NI', dialCode: '+505' },
  { flag: '🇩🇴', name: 'Dominican Republic', code: 'DO', dialCode: '+1' },
  { flag: '🇨🇺', name: 'Cuba', code: 'CU', dialCode: '+53' },
  { flag: '🇭🇹', name: 'Haiti', code: 'HT', dialCode: '+509' },
  { flag: '🇮🇸', name: 'Iceland', code: 'IS', dialCode: '+354' },
  { flag: '🇱🇺', name: 'Luxembourg', code: 'LU', dialCode: '+352' },
  { flag: '🇲🇹', name: 'Malta', code: 'MT', dialCode: '+356' },
  { flag: '🇨🇾', name: 'Cyprus', code: 'CY', dialCode: '+357' },
  { flag: '🇸🇰', name: 'Slovakia', code: 'SK', dialCode: '+421' },
  { flag: '🇸🇮', name: 'Slovenia', code: 'SI', dialCode: '+386' },
  { flag: '🇭🇷', name: 'Croatia', code: 'HR', dialCode: '+385' },
  { flag: '🇧🇦', name: 'Bosnia & Herzegovina', code: 'BA', dialCode: '+387' },
  { flag: '🇷🇸', name: 'Serbia', code: 'RS', dialCode: '+381' },
  { flag: '🇲🇰', name: 'North Macedonia', code: 'MK', dialCode: '+389' },
  { flag: '🇦🇱', name: 'Albania', code: 'AL', dialCode: '+355' },
  { flag: '🇽🇰', name: 'Kosovo', code: 'XK', dialCode: '+383' },
  { flag: '🇲🇪', name: 'Montenegro', code: 'ME', dialCode: '+382' },
  { flag: '🇧🇬', name: 'Bulgaria', code: 'BG', dialCode: '+359' },
  { flag: '🇲🇩', name: 'Moldova', code: 'MD', dialCode: '+373' },
  { flag: '🇧🇾', name: 'Belarus', code: 'BY', dialCode: '+375' },
  { flag: '🇱🇹', name: 'Lithuania', code: 'LT', dialCode: '+370' },
  { flag: '🇱🇻', name: 'Latvia', code: 'LV', dialCode: '+371' },
  { flag: '🇪🇪', name: 'Estonia', code: 'EE', dialCode: '+372' },
  { flag: '🇰🇿', name: 'Kazakhstan', code: 'KZ', dialCode: '+7' },
  { flag: '🇺🇿', name: 'Uzbekistan', code: 'UZ', dialCode: '+998' },
  { flag: '🇦🇿', name: 'Azerbaijan', code: 'AZ', dialCode: '+994' },
  { flag: '🇬🇪', name: 'Georgia', code: 'GE', dialCode: '+995' },
  { flag: '🇦🇲', name: 'Armenia', code: 'AM', dialCode: '+374' },
  { flag: '🇹🇲', name: 'Turkmenistan', code: 'TM', dialCode: '+993' },
  { flag: '🇰🇬', name: 'Kyrgyzstan', code: 'KG', dialCode: '+996' },
  { flag: '🇹🇯', name: 'Tajikistan', code: 'TJ', dialCode: '+992' },
  { flag: '🇦🇫', name: 'Afghanistan', code: 'AF', dialCode: '+93' },
  { flag: '🇾🇪', name: 'Yemen', code: 'YE', dialCode: '+967' },
  { flag: '🇸🇾', name: 'Syria', code: 'SY', dialCode: '+963' },
  { flag: '🇵🇸', name: 'Palestine', code: 'PS', dialCode: '+970' },
]

const SUGGESTED = ['Bangladesh', 'United States', 'United Kingdom', 'United Arab Emirates', 'India']

export default function CountrySelect({ navigate, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return COUNTRIES
    const q = query.toLowerCase()
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
  }, [query])

  const suggested = COUNTRIES.filter(c => SUGGESTED.includes(c.name))

  const handleSelect = (c: typeof COUNTRIES[0]) => {
    setSelected(c.name)
    setTimeout(() => onSelect(c.name, c.code), 350)
  }

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
    }}>
      {/* Header */}
      <div style={{ padding: '52px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => navigate('otp')} style={{
            background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
            borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111A3A',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          {/* Progress */}
          <div style={{ flex: 1, display: 'flex', gap: 4 }}>
            {[1,2,3].map(s => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s === 1 ? '#246BFD' : 'rgba(17,26,58,0.12)' }}/>
            ))}
          </div>
        </div>

        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 24, fontWeight: 800, color: '#111A3A', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
          Where do you provide services?
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.4)', margin: '0 0 18px', lineHeight: 1.5 }}>
          Your country determines your marketplace, currency, languages, payments and local business experience.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(17,26,58,0.35)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text" placeholder="Search country..." value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', padding: '13px 16px 13px 40px', borderRadius: 14,
              background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
              color: '#111A3A', fontFamily: 'Inter', fontSize: 14.5, outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 20px' }} className="scrollbar-hide">
        {!query && (
          <>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: 'rgba(17,26,58,0.3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Suggested</div>
            {suggested.map(c => <CountryRow key={c.code} c={c} selected={selected} onSelect={handleSelect}/>)}
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: 'rgba(17,26,58,0.3)', letterSpacing: 1, textTransform: 'uppercase', margin: '16px 0 8px' }}>All Countries (150+)</div>
          </>
        )}
        {filtered.map(c => <CountryRow key={c.code} c={c} selected={selected} onSelect={handleSelect}/>)}
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.25)', textAlign: 'center', marginTop: 16 }}>
          150+ countries supported · More added regularly
        </div>
      </div>
    </div>
  )
}

function CountryRow({ c, selected, onSelect }: { c: { flag: string; name: string; code: string; dialCode: string }; selected: string | null; onSelect: (c: any) => void }) {
  const isSelected = selected === c.name
  return (
    <div
      onClick={() => onSelect(c)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '13px 14px',
        borderRadius: 13, cursor: 'pointer', marginBottom: 4,
        background: isSelected ? 'rgba(36,107,253,0.2)' : 'rgba(17,26,58,0.04)',
        border: isSelected ? '1px solid rgba(36,107,253,0.45)' : '1px solid transparent',
        transition: 'all 0.18s',
      }}
    >
      <FlagIcon code={c.code} width={30} radius={4}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#111A3A' }}>{c.name}</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(17,26,58,0.35)', marginTop: 1 }}>{c.dialCode}</div>
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 500,
        color: isSelected ? '#246BFD' : 'rgba(17,26,58,0.3)',
        background: isSelected ? 'rgba(36,107,253,0.15)' : 'rgba(17,26,58,0.06)',
        padding: '3px 8px', borderRadius: 6,
      }}>{c.code}</div>
      {isSelected && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#246BFD" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </div>
  )
}
