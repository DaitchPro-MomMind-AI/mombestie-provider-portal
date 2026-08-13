/**
 * Real Supabase-backed healthcare provider applications --
 * `healthcare_providers` table (mombestie-backend migration
 * 20260812000009), a deliberately separate table/state-machine from
 * `providers` -- see docs/ARCHITECTURE.md §14.4/§14.8. RLS lets the owner
 * insert/read/update their own draft or rejected application, and only
 * Trust & Safety / Super Admin staff can move it to approved/rejected.
 */
import { supabase } from "./supabaseClient";

export interface HealthcareApplication {
  id: string;
  legal_name: string;
  practice_name: string | null;
  phone: string | null;
  practice_address: string | null;
  specialty: string;
  credential_type: string;
  license_number: string;
  license_jurisdiction: string;
  license_status: "unverified" | "verified" | "expired" | "revoked";
  languages: string[];
  telehealth_enabled: boolean;
  in_person_enabled: boolean;
  country: string;
  service_city: string | null;
  service_postal_code: string | null;
  service_radius_mi: number;
  accepted_insurance_networks: string[];
  status: "draft" | "submitted" | "pending_verification" | "approved" | "rejected" | "suspended" | "expired";
  identity_verified: boolean;
  credential_documents_uploaded: boolean;
  background_check_consent: boolean;
  agreements_accepted: boolean;
}

export type NewHealthcareApplication = Omit<HealthcareApplication, "id" | "license_status" | "status" | "identity_verified"> & {
  user_id: string;
};

export async function getMyHealthcareApplication(userId: string): Promise<HealthcareApplication | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("healthcare_providers")
    .select(
      "id,legal_name,practice_name,phone,practice_address,specialty,credential_type,license_number,license_jurisdiction,license_status,languages,telehealth_enabled,in_person_enabled,country,service_city,service_postal_code,service_radius_mi,accepted_insurance_networks,status,identity_verified,credential_documents_uploaded,background_check_consent,agreements_accepted"
    )
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("Failed to load healthcare application:", error.message);
    return null;
  }
  return data as HealthcareApplication | null;
}

export async function submitHealthcareApplication(app: NewHealthcareApplication): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: "Backend not configured." };
  const { error } = await supabase.from("healthcare_providers").insert({ ...app, status: "submitted" });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
