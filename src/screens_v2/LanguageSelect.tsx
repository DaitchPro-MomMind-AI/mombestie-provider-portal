import { useState } from 'react'
import type { Screen } from '../App'

interface Props {
  navigate: (s: Screen) => void
  country: string
  countryCode: string
}

const COUNTRY_LANGUAGES: Record<string, { code: string; name: string; native: string; rtl?: boolean }[]> = {
  BD: [{ code: 'bn', name: 'Bengali', native: 'বাংলা' }, { code: 'en', name: 'English', native: 'English' }],
  US: [{ code: 'en', name: 'English', native: 'English' }, { code: 'es', name: 'Spanish', native: 'Español' }],
  GB: [{ code: 'en', name: 'English', native: 'English' }],
  AE: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  SA: [{ code: 'ar', name: 'Arabic', native: 'العربية', rtl: true }, { code: 'en', name: 'English', native: 'English' }],
  JP: [{ code: 'ja', name: 'Japanese', native: '日本語' }],
  KR: [{ code: 'ko', name: 'Korean', native: '한국어' }, { code: 'en', name: 'English', native: 'English' }],
  IN: [{ code: 'hi', name: 'Hindi', native: 'हिन्दी' }, { code: 'en', name: 'English', native: 'English' }],
  DE: [{ code: 'de', name: 'German', native: 'Deutsch' }, { code: 'en', name: 'English', native: 'English' }],
  FR: [{ code: 'fr', name: 'French', native: 'Français' }],
  ES: [{ code: 'es', name: 'Spanish', native: 'Español' }, { code: 'en', name: 'English', native: 'English' }],
  BR: [{ code: 'pt', name: 'Portuguese', native: 'Português' }],
  DEFAULT: [{ code: 'en', name: 'English', native: 'English' }],
}

const FLAG_MAP: Record<string, string> = {
  BD:'🇧🇩', US:'🇺🇸', GB:'🇬🇧', AE:'🇦🇪', SA:'🇸🇦', JP:'🇯🇵', KR:'🇰🇷',
  IN:'🇮🇳', DE:'🇩🇪', FR:'🇫🇷', ES:'🇪🇸', BR:'🇧🇷', DEFAULT:'🌍',
}

export default function LanguageSelect({ navigate, country, countryCode }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const langs = COUNTRY_LANGUAGES[countryCode] ?? COUNTRY_LANGUAGES.DEFAULT
  const flag = FLAG_MAP[countryCode] ?? '🌍'

  const handleSelect = (code: string) => {
    setSelected(code)
    setTimeout(() => navigate('providertype'), 400)
  }

  return (
    <div style={{
      height: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 100%)',
      display: 'flex', flexDirection: 'column', padding: '52px 24px 32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button onClick={() => navigate('country')} style={{
          background: 'rgba(17,26,58,0.08)', border: '1px solid rgba(17,26,58,0.12)',
          borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111A3A',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div style={{ flex: 1, display: 'flex', gap: 4 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= 2 ? '#246BFD' : 'rgba(17,26,58,0.12)' }}/>
          ))}
        </div>
      </div>

      {/* Country indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        background: 'rgba(36,107,253,0.12)', border: '1px solid rgba(36,107,253,0.22)',
        borderRadius: 12, marginBottom: 28, width: 'fit-content',
      }}>
        <span style={{ fontSize: 22 }}>{flag}</span>
        <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#111A3A' }}>{country}</span>
      </div>

      <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 26, fontWeight: 800, color: '#111A3A', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
        Choose Your Language
      </h2>
      <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: 'rgba(17,26,58,0.4)', margin: '0 0 28px', lineHeight: 1.5 }}>
        Select the language you'd like to use for your MomBestie Provider experience.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {langs.map(lang => (
          <div
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            style={{
              padding: '20px 20px', borderRadius: 16, cursor: 'pointer',
              background: selected === lang.code ? 'rgba(36,107,253,0.2)' : 'rgba(17,26,58,0.06)',
              border: selected === lang.code ? '2px solid #246BFD' : '1.5px solid rgba(17,26,58,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: lang.rtl ? 22 : 20,
                fontWeight: 700, color: '#111A3A',
                direction: lang.rtl ? 'rtl' : 'ltr',
              }}>{lang.native}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(17,26,58,0.45)', marginTop: 4 }}>
                {lang.name} {lang.rtl ? '· RTL' : ''} {lang.code !== 'en' ? `· ${lang.code.toUpperCase()}` : ''}
              </div>
            </div>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              border: selected === lang.code ? '2px solid #246BFD' : '2px solid rgba(17,26,58,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: selected === lang.code ? '#246BFD' : 'transparent',
              flexShrink: 0,
            }}>
              {selected === lang.code && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', padding: '20px 0 0' }}>
        <div style={{
          padding: '12px 14px', borderRadius: 12,
          background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.07)',
          fontFamily: 'Inter', fontSize: 12, color: 'rgba(17,26,58,0.35)', lineHeight: 1.5,
        }}>
          Only languages officially enabled for <strong style={{ color: 'rgba(17,26,58,0.55)' }}>{country}</strong> are shown. More may be added as MomBestie expands.
        </div>
      </div>
    </div>
  )
}
