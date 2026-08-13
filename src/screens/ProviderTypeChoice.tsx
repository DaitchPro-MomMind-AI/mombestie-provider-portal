/**
 * The two provider classes never share an onboarding path -- see
 * docs/ARCHITECTURE.md §14.4/§14.8/§14.9. A healthcare provider can't just
 * pick "Family Service" to skip verification, and a babysitter can't submit
 * medical credentials by accident; the choice made here decides which table
 * (`providers` vs `healthcare_providers`) and which wizard runs.
 */
export function ProviderTypeChoice({ onChoose, onCancel }: { onChoose: (kind: 'family' | 'healthcare') => void; onCancel: () => void }) {
  return (
    <div className="min-h-screen bg-[#FFFCFA] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <p className="text-xs font-semibold text-[#EE674E] uppercase tracking-wide mb-1">Provider Registration</p>
        <h1 className="font-display text-2xl text-[#242424] mb-1">What kind of provider are you?</h1>
        <p className="text-sm text-[#6E6E73] mb-6">This decides your onboarding, verification, and requirements — pick the one that matches what you actually offer.</p>

        <div className="space-y-3">
          <button onClick={() => onChoose('family')}
            className="action-btn w-full text-left glass-card-strong rounded-2xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl coral-gradient flex items-center justify-center text-2xl flex-shrink-0">👶</div>
            <div className="flex-1">
              <p className="font-display text-lg text-[#242424]">Family Service Provider</p>
              <p className="text-sm text-[#6E6E73] mt-0.5">Babysitting, nanny services, postpartum support, housecleaning, meal prep, photography, and more.</p>
              <p className="text-xs text-[#6E6E73] mt-2">$25 one-time application fee · 10% marketplace commission · ID + background check</p>
            </div>
          </button>

          <button onClick={() => onChoose('healthcare')}
            className="action-btn w-full text-left glass-card-strong rounded-2xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6299D5,#7FB0E8)' }}>🩺</div>
            <div className="flex-1">
              <p className="font-display text-lg text-[#242424]">Healthcare Provider</p>
              <p className="text-sm text-[#6E6E73] mt-0.5">Pediatrician, pediatric urgent care, telehealth, pediatric specialist, clinic, or other licensed healthcare service.</p>
              <p className="text-xs text-[#6E6E73] mt-2">No application fee — a different verification model (identity + professional license) applies, not the $25 marketplace fee.</p>
            </div>
          </button>
        </div>

        <button onClick={onCancel} className="action-btn w-full text-sm font-semibold text-[#6E6E73] py-3 mt-5">Cancel</button>
      </div>
    </div>
  )
}
