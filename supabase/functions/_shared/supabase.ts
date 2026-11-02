// Service-role Supabase client, for use INSIDE Edge Functions only.
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically into
// every Edge Function's environment by the platform — they do not need to be
// set as secrets, and they must never be sent to or read by the browser.

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

let client: SupabaseClient | null = null;

export function admin(): SupabaseClient {
  if (client) return client;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set in this function's environment");
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

/**
 * Resolves the signed-in member (if any) from an `Authorization: Bearer <jwt>`
 * header, using the caller's own token against GoTrue — never the service
 * role. Returns null for anonymous visitors (the normal case today, since
 * public sign-in isn't live yet); never throws.
 */
export async function resolveUser(req: Request): Promise<{ id: string; email: string | null } | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anonKey) return null;

  try {
    const asUser = createClient(url, anonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });
    const { data, error } = await asUser.auth.getUser();
    if (error || !data.user) return null;
    return { id: data.user.id, email: data.user.email ?? null };
  } catch {
    return null;
  }
}
