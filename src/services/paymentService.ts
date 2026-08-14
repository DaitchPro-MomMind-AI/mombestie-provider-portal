/**
 * Client for the centralized payment eligibility engine --
 * `get_eligible_payment_methods()` (mombestie-backend migration
 * 20260813000004). This is the ONLY sanctioned way to learn which payment
 * methods to show; no screen should hardcode a provider or query
 * payment_method_configs directly (docs/ARCHITECTURE.md §15).
 *
 * Because every payment_method_configs row is seeded with enabled=false
 * until a real merchant account exists, this will honestly return []
 * everywhere today -- that's correct, not a bug. Callers must render an
 * empty/not-yet-available state, never assume a fallback provider.
 */
import { supabase } from "./supabaseClient";

export type TransactionType = "subscription" | "marketplace_booking" | "provider_registration_fee" | "website" | "provider_payout";
export type Platform = "ios" | "android" | "web";

export interface EligiblePaymentMethod {
  provider_code: string;
  display_name: string;
  category: string;
  priority: number;
  mode: "sandbox" | "live";
  refund_capable: boolean;
}

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "web";
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "web";
}

export async function getEligiblePaymentMethods(
  countryCode: string,
  currency: string,
  transactionType: TransactionType,
  amountCents?: number,
  platform: Platform = detectPlatform()
): Promise<EligiblePaymentMethod[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("get_eligible_payment_methods", {
    p_country: countryCode,
    p_currency: currency,
    p_platform: platform,
    p_transaction_type: transactionType,
    p_amount_cents: amountCents ?? null,
  });
  if (error) {
    console.error("Failed to load eligible payment methods:", error.message);
    return [];
  }
  return data ?? [];
}
