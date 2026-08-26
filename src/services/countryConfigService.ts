/**
 * Real per-country provider registration fee -- country_config
 * (mombestie-backend). Replaces the previous hardcoded APPLICATION_FEE=$25
 * constant, which only ever reflected the US reference number. Per the
 * payment architecture spec: "The actual amount must be configurable
 * independently for every country."
 */
import { supabase } from "./supabaseClient";

export interface CountryFee {
  country_code: string;
  country_name: string;
  currency: string;
  currency_symbol: string;
  provider_application_fee_cents: number;
  /** Real marketplace commission rate for this country (e.g. 0.15 = 15%),
   * MBPRV-37 -- null if this country_config row hasn't set one yet. */
  commission_pct: number | null;
}

export async function listCountries(): Promise<CountryFee[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("country_config")
    .select("country_code,country_name,currency,currency_symbol,provider_application_fee_cents,commission_pct")
    .order("country_name");
  if (error) {
    console.error("Failed to load countries:", error.message);
    return [];
  }
  return data ?? [];
}
