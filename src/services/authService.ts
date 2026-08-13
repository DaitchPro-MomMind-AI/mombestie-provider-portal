import { supabase } from "./supabaseClient";

export interface AuthResult {
  ok: boolean;
  error?: string;
  needsEmailConfirmation?: boolean;
}

/**
 * Same real-auth pattern as mombestie-customer-app/src/services/authService.ts
 * -- no household/customer concept here, just a plain Supabase account. The
 * resulting user id is what healthcareProviderService/providerService key
 * every application row to (`healthcare_providers.user_id` /
 * `providers.user_id`), so a provider can never submit an application
 * attributed to someone else.
 */
export async function signUp(email: string, password: string, fullName: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, error: "Backend not configured (missing VITE_SUPABASE_URL/ANON_KEY)." };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { ok: false, error: error.message };
  if (!data.session) return { ok: true, needsEmailConfirmation: true };
  return { ok: true };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, error: "Backend not configured (missing VITE_SUPABASE_URL/ANON_KEY)." };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** Real Supabase password change -- used by the Settings screen. Requires
 * the current session (no re-auth step here; Supabase itself still
 * enforces the existing session's validity). */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, error: "Backend not configured." };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Real Supabase email change -- Supabase sends a confirmation link to the
 * *new* address before the change actually takes effect, same as the
 * signup confirmation flow. */
export async function updateEmail(newEmail: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, error: "Backend not configured." };
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) return { ok: false, error: error.message };
  return { ok: true, needsEmailConfirmation: true };
}
