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
}

export async function listCountries(): Promise<CountryFee[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("country_config")
    .select("country_code,country_name,currency,currency_symbol,provider_application_fee_cents")
    .order("country_name");
  if (error) {
    console.error("Failed to load countries:", error.message);
    return [];
  }
  return data ?? [];
}
