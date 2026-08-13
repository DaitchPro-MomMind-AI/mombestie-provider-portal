import { useEffect, useState } from 'react'
import { getEligiblePaymentMethods, type EligiblePaymentMethod, type TransactionType } from '../services/paymentService'

/**
 * Real payment method picker driven entirely by the eligibility RPC --
 * never a hardcoded button per provider (docs/ARCHITECTURE.md §15). Groups
 * the top-priority result as "Recommended" and the rest as "Other Ways to
 * Pay", matching the spec's example UI. Renders an honest empty state
 * instead of a fake "Pay (demo)" button when nothing is actually enabled
 * for this country/transaction yet -- which, until a real merchant account
 * exists, is every country today.
 */
export function PaymentMethodPicker({ countryCode, currency, transactionType, amountCents, selected, onSelect }: {
  countryCode: string; currency: string; transactionType: TransactionType; amountCents?: number
  selected: string | null; onSelect: (providerCode: string) => void
}) {
  const [methods, setMethods] = useState<EligiblePaymentMethod[] | null>(null)

  useEffect(() => {
    let cancelled = false
    getEligiblePaymentMethods(countryCode, currency, transactionType, amountCents).then(m => { if (!cancelled) setMethods(m) })
    return () => { cancelled = true }
  }, [countryCode, currency, transactionType, amountCents])

  if (methods === null) {
    return <div className="text-center py-4"><span className="w-5 h-5 rounded-full border-2 border-[#F0E8E4] border-t-[#EE674E] inline-block spin-slow" /></div>
  }

  if (methods.length === 0) {
    return (
      <div className="rounded-xl p-3.5" style={{ background: '#FFF3EE', border: '1.5px dashed #F6B6A5' }}>
        <p className="text-sm font-semibold text-[#242424]">No payment methods are available yet for {countryCode}</p>
        <p className="text-xs text-[#6E6E73] mt-1">MomMind hasn't connected a real payment processor for this country/transaction type yet. This isn't a bug — a payment method only appears once it's actually integrated, configured, and turned on by an admin.</p>
      </div>
    )
  }

  const [recommended, ...rest] = methods

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wide mb-1.5">Recommended</p>
        <PaymentMethodButton method={recommended} isSelected={selected === recommended.provider_code} onClick={() => onSelect(recommended.provider_code)} />
      </div>
      {rest.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wide mb-1.5">Other Ways to Pay</p>
          <div className="space-y-2">
            {rest.map(m => (
              <PaymentMethodButton key={m.provider_code} method={m} isSelected={selected === m.provider_code} onClick={() => onSelect(m.provider_code)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PaymentMethodButton({ method, isSelected, onClick }: { method: EligiblePaymentMethod; isSelected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="action-btn w-full flex items-center justify-between px-4 py-3 rounded-xl text-left"
      style={isSelected ? { background: '#FFD6C9', border: '2px solid #EE674E' } : { background: '#FFF8F4', border: '2px solid #F0E8E4' }}>
      <span className="text-sm font-semibold text-[#242424]">{method.display_name}</span>
      {method.mode === 'sandbox' && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FEF3CD] text-[#7A6010]">SANDBOX</span>}
    </button>
  )
}
