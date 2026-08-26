/**
 * Real Supabase-backed bookings for the signed-in provider -- `bookings`
 * table (mombestie-backend migration 20260812000005), the same table
 * apps/customer-app's Marketplace writes to and apps/admin-portal's
 * Providers/Bookings pages read. RLS: "provider can read bookings made
 * with them" / "provider can update bookings made with them".
 */
import { supabase } from "./supabaseClient";

export interface ProviderBooking {
  id: string;
  household_id: string;
  service_category: string;
  status: "draft" | "requested" | "accepted" | "declined" | "confirmed" | "in_progress" | "completed" | "paid_out" | "cancelled" | "disputed";
  scheduled_at: string;
  duration_hours: number;
  price_cents: number;
  commission_cents: number;
  currency: string;
  notes: string | null;
  created_at: string;
}

export async function listMyBookings(providerId: string): Promise<ProviderBooking[]> {
  if (!supabase || !providerId) return [];
  const { data, error } = await supabase
    .from("bookings")
    .select("id,household_id,service_category,status,scheduled_at,duration_hours,price_cents,commission_cents,currency,notes,created_at")
    .eq("provider_id", providerId)
    .order("scheduled_at", { ascending: false });
  if (error) {
    console.error("Failed to load bookings:", error.message);
    return [];
  }
  return data ?? [];
}

export async function decideBooking(id: string, status: "accepted" | "declined"): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: "Backend not configured." };
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
