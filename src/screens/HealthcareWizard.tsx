import { useState } from 'react'
import { submitHealthcareApplication, type NewHealthcareApplication } from '../services'

const CREDENTIAL_TYPES = ['MD', 'DO', 'NP', 'PA', 'Pediatric Clinic', 'Telehealth Organization', 'Other Licensed Provider']
const SPECIALTIES = ['Pediatrician', 'Pediatric Urgent Care', 'Family Physician', 'Telehealth', 'Pediatric Specialist', 'Hospital/Clinic']
const LANGUAGES = ['English', 'Spanish', 'Bengali', 'Japanese', 'French', 'Mandarin', 'Arabic', 'Other']

const STEPS = ['Identity', 'Credentials', 'Practice', 'Documents & Agreements'] as const

type FormState = {
  legalName: string; phone: string; practiceAddress: string
  credentialType: string; licenseNumber: string; licenseJurisdiction: string; specialty: string
  practiceName: string; country: string; serviceCity: string; servicePostalCode: string; serviceRadius: string
  languages: string[]; telehealthEnabled: boolean; inPersonEnabled: boolean; acceptedInsurance: string
  credentialDocumentsUploaded: boolean; backgroundCheckConsent: boolean; agreementsAccepted: boolean
}

const EMPTY: FormState = {
  legalName: '', phone: '', practiceAddress: '',
  credentialType: CREDENTIAL_TYPES[0], licenseNumber: '', licenseJurisdiction: '', specialty: SPECIALTIES[0],
  practiceName: '', country: 'US', serviceCity: '', servicePostalCode: '', serviceRadius: '25',
  languages: ['English'], telehealthEnabled: false, inPersonEnabled: true, acceptedInsurance: '',
  credentialDocumentsUploaded: false, backgroundCheckConsent: false, agreementsAccepted: false,
}

export function HealthcareWizard({ userId, onSubmitted, onCancel }: { userId: string; onSubmitted: () => void; onCancel: () => void }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormState>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const total = STEPS.length

  const update = (patch: Partial<FormState> | ((d: FormState) => Partial<FormState>)) =>
    setData(d => ({ ...d, ...(typeof patch === 'function' ? patch(d) : patch) }))
  const toggleLanguage = (l: string) => update(d => ({ languages: d.languages.includes(l) ? d.languages.filter(x => x !== l) : [...d.languages, l] }))

  const canAdvance = (() => {
    switch (step) {
      case 1: return data.legalName.trim() && data.phone.trim() && data.practiceAddress.trim()
      case 2: return data.licenseNumber.trim() && data.licenseJurisdiction.trim()
      case 3: return data.serviceCity.trim() && (data.telehealthEnabled || data.inPersonEnabled)
      case 4: return data.credentialDocumentsUploaded && data.backgroundCheckConsent && data.agreementsAccepted
      default: return true
    }
  })()

  const submit = async () => {
    setSubmitting(true)
    setError(null)
    const app: NewHealthcareApplication = {
      user_id: userId,
      legal_name: data.legalName.trim(),
      practice_name: data.practiceName.trim() || null,
      phone: data.phone.trim(),
      practice_address: data.practiceAddress.trim(),
      specialty: data.specialty,
      credential_type: data.credentialType,
      license_number: data.licenseNumber.trim(),
      license_jurisdiction: data.licenseJurisdiction.trim(),
      languages: data.languages,
      telehealth_enabled: data.telehealthEnabled,
      in_person_enabled: data.inPersonEnabled,
      country: data.country,
      service_city: data.serviceCity.trim(),
      service_postal_code: data.servicePostalCode.trim() || null,
      service_radius_mi: parseInt(data.serviceRadius, 10) || 25,
      accepted_insurance_networks: data.acceptedInsurance.split(',').map(s => s.trim()).filter(Boolean),
      credential_documents_uploaded: data.credentialDocumentsUploaded,
      background_check_consent: data.backgroundCheckConsent,
      agreements_accepted: data.agreementsAccepted,
    }
    const res = await submitHealthcareApplication(app)
    setSubmitting(false)
    if (!res.ok) { setError(res.error ?? 'Something went wrong submitting your application.'); return }
    onSubmitted()
  }

  const next = () => step < total ? setStep(step + 1) : submit()
  const back = () => step > 1 ? setStep(step - 1) : onCancel()

  return (
    <div className="min-h-screen bg-[#FFFCFA] px-4 py-8 flex items-start justify-center">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-1 mb-6">
          {STEPS.map((label, i) => {
            const s = i + 1
            return (
              <div key={label} className="flex items-center gap-1 flex-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: step > s ? '#55A67A' : step === s ? 'linear-gradient(135deg,#6299D5,#7FB0E8)' : '#F0E8E4', color: step >= s ? 'white' : '#B0A8A4' }}>
                  {step > s ? '✓' : s}
                </div>
                {s < total && <div className="h-px flex-1" style={{ background: step > s ? '#55A67A' : '#F0E8E4' }} />}
              </div>
            )
          })}
        </div>
        <p className="text-xs font-semibold text-[#6299D5] uppercase tracking-wide mb-1">Healthcare Provider · Step {step} of {total}</p>
        <h1 className="font-display text-2xl text-[#242424] mb-5">{STEPS[step - 1]}</h1>

        {error && <div className="rounded-xl px-3.5 py-2.5 mb-3 text-xs text-[#D9534F]" style={{ background: '#FAECEC', border: '1px solid #ECA0A0' }}>{error}</div>}

        <div className="glass-card-strong rounded-3xl p-6 space-y-4">
          {step === 1 && (<>
            <p className="text-xs text-[#6E6E73]">Required for identity verification — practice address is never shown on your public profile.</p>
            <input value={data.legalName} onChange={e => update({ legalName: e.target.value })} placeholder="Legal name" className="cartoon-input w-full px-4 py-3 text-sm" />
            <input value={data.phone} onChange={e => update({ phone: e.target.value })} placeholder="Phone number" className="cartoon-input w-full px-4 py-3 text-sm" />
            <input value={data.practiceAddress} onChange={e => update({ practiceAddress: e.target.value })} placeholder="Practice address" className="cartoon-input w-full px-4 py-3 text-sm" />
          </>)}

          {step === 2 && (<>
            <div>
              <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide mb-1.5">Credential type</p>
              <div className="grid grid-cols-2 gap-2">
                {CREDENTIAL_TYPES.map(c => (
                  <button key={c} onClick={() => update({ credentialType: c })} className="action-btn py-2.5 px-3 rounded-xl text-xs font-semibold text-left"
                    style={data.credentialType === c ? { background: '#EBF2FC', border: '2px solid #6299D5', color: '#3D6FA8' } : { background: '#FFF8F4', border: '2px solid #F0E8E4', color: '#6E6E73' }}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide mb-1.5">Specialty</p>
              <div className="grid grid-cols-2 gap-2">
                {SPECIALTIES.map(s => (
                  <button key={s} onClick={() => update({ specialty: s })} className="action-btn py-2.5 px-3 rounded-xl text-xs font-semibold text-left"
                    style={data.specialty === s ? { background: '#EBF2FC', border: '2px solid #6299D5', color: '#3D6FA8' } : { background: '#FFF8F4', border: '2px solid #F0E8E4', color: '#6E6E73' }}>{s}</button>
                ))}
              </div>
            </div>
            <input value={data.licenseNumber} onChange={e => update({ licenseNumber: e.target.value })} placeholder="License number" className="cartoon-input w-full px-4 py-3 text-sm" />
            <input value={data.licenseJurisdiction} onChange={e => update({ licenseJurisdiction: e.target.value })} placeholder="License jurisdiction (e.g. State of California)" className="cartoon-input w-full px-4 py-3 text-sm" />
            <p className="text-[11px] text-[#6E6E73]">License status starts as "unverified" — MomBestie staff confirm it directly with the issuing board before approval. You can never self-mark your own license verified.</p>
          </>)}

          {step === 3 && (<>
            <input value={data.practiceName} onChange={e => update({ practiceName: e.target.value })} placeholder="Practice / clinic name (optional)" className="cartoon-input w-full px-4 py-3 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input value={data.serviceCity} onChange={e => update({ serviceCity: e.target.value })} placeholder="City" className="cartoon-input px-4 py-3 text-sm" />
              <input value={data.servicePostalCode} onChange={e => update({ servicePostalCode: e.target.value })} placeholder="Postal/ZIP code" className="cartoon-input px-4 py-3 text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => update({ inPersonEnabled: !data.inPersonEnabled })} className="action-btn flex-1 py-2.5 rounded-xl text-xs font-semibold"
                style={data.inPersonEnabled ? { background: '#EBF2FC', border: '2px solid #6299D5', color: '#3D6FA8' } : { background: '#F0E8E4', border: '2px solid #E8E0DC', color: '#6E6E73' }}>
                {data.inPersonEnabled ? '✓ ' : ''}In-Person
              </button>
              <button onClick={() => update({ telehealthEnabled: !data.telehealthEnabled })} className="action-btn flex-1 py-2.5 rounded-xl text-xs font-semibold"
                style={data.telehealthEnabled ? { background: '#EBF2FC', border: '2px solid #6299D5', color: '#3D6FA8' } : { background: '#F0E8E4', border: '2px solid #E8E0DC', color: '#6E6E73' }}>
                {data.telehealthEnabled ? '✓ ' : ''}Telehealth
              </button>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide mb-1.5">Languages spoken</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(l => (
                  <button key={l} onClick={() => toggleLanguage(l)} className="action-btn px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={data.languages.includes(l) ? { background: '#EBF2FC', border: '2px solid #6299D5', color: '#3D6FA8' } : { background: '#F0E8E4', border: '2px solid #E8E0DC', color: '#6E6E73' }}>{l}</button>
                ))}
              </div>
            </div>
            <input value={data.acceptedInsurance} onChange={e => update({ acceptedInsurance: e.target.value })} placeholder="Accepted insurance networks, comma-separated (optional)" className="cartoon-input w-full px-4 py-3 text-sm" />
          </>)}

          {step === 4 && (<>
            {[
              { key: 'credentialDocumentsUploaded' as const, label: 'Professional license / credential documents' },
              { key: 'backgroundCheckConsent' as const, label: 'Consent to background & credential verification' },
              { key: 'agreementsAccepted' as const, label: 'MomBestie Healthcare Provider Agreement' },
            ].map(doc => (
              <button key={doc.key} onClick={() => update(d => ({ [doc.key]: !d[doc.key] }))} className="action-btn w-full flex items-center gap-3 p-3 rounded-xl text-left" style={{ background: '#FFF8F4', border: '1.5px solid #F0E8E4' }}>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs flex-shrink-0 ${data[doc.key] ? 'bg-[#55A67A] text-white' : 'bg-[#F0E8E4]'}`}>{data[doc.key] ? '✓' : ''}</div>
                <span className="text-sm text-[#242424]">{doc.label}</span>
              </button>
            ))}
            <div className="rounded-xl p-3 mt-2" style={{ background: '#EBF2FC', border: '1.5px dashed #6299D5' }}>
              <p className="text-xs font-semibold text-[#242424] mb-1">No application fee for healthcare providers</p>
              <p className="text-[11px] text-[#6E6E73]">Healthcare onboarding uses identity + license verification, not the $25 marketplace fee that applies to family service providers.</p>
            </div>
          </>)}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={back} className="action-btn flex-1 bg-[#F0E8E4] text-[#6E6E73] font-semibold py-3 rounded-2xl">{step === 1 ? 'Cancel' : 'Back'}</button>
          <button onClick={next} disabled={!canAdvance || submitting}
            className="action-btn flex-1 font-semibold py-3 rounded-2xl text-white disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#6299D5,#7FB0E8)' }}>
            {submitting ? 'Submitting…' : step === total ? 'Submit Application' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
