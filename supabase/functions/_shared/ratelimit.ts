// Thin wrapper around the public.check_rate_limit(key, limit, window_seconds)
// Postgres function defined in migration 001. It's atomic (single upsert),
// so it's safe under concurrent requests, and it's revoked from anon/
// authenticated — only the service-role client used here can call it.

import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export async function checkRateLimit(
  db: SupabaseClient,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const { data, error } = await db.rpc("check_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    // Fail OPEN on an unexpected rate-limit infra error rather than blocking
    // every visitor because of a transient DB hiccup; the real constraints
    // (RLS, triggers, unique indexes) still protect the data either way.
    console.error("check_rate_limit error", error);
    return true;
  }
  return Boolean(data);
}

/** Best-effort caller identity for rate-limit keys: forwarded IP, else "unknown". */
export function callerIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}
