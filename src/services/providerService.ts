/**
 * Real Supabase-backed family-service provider applications --
 * `providers` table (mommind-backend migration
 * 20260812000005_providers_bookings_payments.sql). Same real-write pattern
 * as healthcareProviderService.ts, applied to the pre-existing onboarding
 * wizard so both provider classes are equally real, not one real and one a
 * frontend fixture.
 */
import { supabase } from "./supabaseClient";

export interface ProviderApplication {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  business_name: string | null;
  categories: string[];
  bio: string | null;
  experience_years: number | null;
  service_city: string | null;
  service_radius_mi: number;
  hourly_rate_cents: number | null;
  country: string;
  availability_days: string[];
  status: "draft" | "submitted" | "pending_verification" | "approved" | "rejected" | "suspended" | "expired";
  id_uploaded: boolean;
  background_check_consent: boolean;
  certifications: boolean;
  application_fee_paid: boolean;
  payout_connected: boolean;
}

export type NewProviderApplication = Omit<ProviderApplication, "id" | "status"> & { user_id: string };

export async function getMyProviderApplication(userId: string): Promise<ProviderApplication | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("providers")
    .select(
      "id,full_name,phone,address,business_name,categories,bio,experience_years,service_city,service_radius_mi,hourly_rate_cents,country,availability_days,status,id_uploaded,background_check_consent,certifications,application_fee_paid,payout_connected"
    )
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("Failed to load provider application:", error.message);
    return null;
  }
  return data as ProviderApplication | null;
}

export async function submitProviderApplication(app: NewProviderApplication): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: "Backend not configured." };
  const { error } = await supabase.from("providers").insert({ ...app, status: "submitted" });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
