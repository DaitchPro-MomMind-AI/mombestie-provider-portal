import { useEffect, useState } from 'react'
import { getMyProviderApplication, getMyHealthcareApplication, type ProviderApplication, type HealthcareApplication } from '../services'

/**
 * Real application status, fetched live -- not the local "demo" fixture the
 * old PendingVerificationScreen showed. Works for either provider kind; the
 * status this screen shows is exactly the row an admin sees and decides on
 * (docs/ARCHITECTURE.md §14.4/§14.9) -- this portal has no ability to move
 * itself past 'submitted'.
 */
export function PendingStatusScreen({ userId, kind, onBackToLogin }: { userId: string; kind: 'family' | 'healthcare'; onBackToLogin: () => void }) {
  const [loading, setLoading] = useState(true)
  const [provider, setProvider] = useState<ProviderApplication | null>(null)
  const [healthcare, setHealthcare] = useState<HealthcareApplication | null>(null)

  const refresh = () => {
    setLoading(true)
    const fetcher = kind === 'family' ? getMyProviderApplication(userId) : getMyHealthcareApplication(userId)
    fetcher.then(app => {
      if (kind === 'family') setProvider(app as ProviderApplication)
      else setHealthcare(app as HealthcareApplication)
      setLoading(false)
    })
  }

  useEffect(refresh, [userId, kind])

  const status = kind === 'family' ? provider?.status : healthcare?.status
  const name = kind === 'family' ? (provider?.business_name || provider?.full_name) : (healthcare?.practice_name || healthcare?.legal_name)

  const STATUS_COPY: Record<string, { icon: string; label: string; color: string }> = {
    submitted: { icon: '⏳', label: 'Pending Verification', color: '#B8860B' },
    pending_verification: { icon: '⏳', label: 'Pending Verification', color: '#B8860B' },
    approved: { icon: '✅', label: 'Approved', color: '#55A67A' },
    rejected: { icon: '❌', label: 'Not Approved', color: '#D9534F' },
    suspended: { icon: '⛔', label: 'Suspended', color: '#D9534F' },
  }
  const copy = status ? STATUS_COPY[status] ?? { icon: '·', label: status, color: '#6E6E73' } : null

  return (
    <div className="h-full w-full overflow-y-auto bg-[#FFFCFA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass-card-strong rounded-3xl p-8 text-center">
        {loading ? (
          <span className="w-8 h-8 rounded-full border-2 border-[#F0E8E4] border-t-[#EE674E] inline-block spin-slow" />
        ) : !status ? (
          <>
            <p className="text-sm text-[#6E6E73]">No application found for this account.</p>
            <button onClick={onBackToLogin} className="action-btn w-full bg-[#F0E8E4] text-[#6E6E73] font-semibold py-3 rounded-2xl mt-5">Back to Sign In</button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: '#FEF3CD' }}>{copy!.icon}</div>
            <h1 className="font-display text-2xl text-[#242424] mb-1">{name}</h1>
            <p className="text-sm mb-6" style={{ color: copy!.color }}><span className="font-semibold">{copy!.label}</span></p>
            <p className="text-xs text-[#6E6E73] mb-5">
              Your profile stays inactive in {kind === 'healthcare' ? 'Find Care' : 'the marketplace'} until an admin reviews and approves it — this portal has no ability to self-verify. You'll be notified once reviewed.
            </p>
            <div className="flex gap-2">
              <button onClick={refresh} className="action-btn flex-1 bg-[#F0E8E4] text-[#6E6E73] font-semibold py-3 rounded-2xl">Refresh Status</button>
              <button onClick={onBackToLogin} className="action-btn flex-1 bg-[#FFD6C9] text-[#C94930] font-semibold py-3 rounded-2xl">Sign Out</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
