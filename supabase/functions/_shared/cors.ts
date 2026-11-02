// Shared CORS handling for every public Edge Function.
//
// These endpoints are called straight from the browser (anonymous visitors,
// no cookies/credentials involved), so a permissive, allowlist-driven CORS
// policy is appropriate. Set ALLOWED_ORIGINS as a Supabase secret to a
// comma-separated list (e.g. "https://scribesglobal.org,https://www.scribesglobal.org")
// to lock it down in production. If unset, every origin is allowed (useful
// while the frontend is still moving between preview URLs).

const configured = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin =
    configured.length === 0
      ? "*"
      : configured.includes(origin)
        ? origin
        : configured[0];

  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-headers":
      "authorization, x-client-info, apikey, content-type",
    "access-control-allow-methods": "POST, OPTIONS",
    "vary": "origin",
  };
}

export function handlePreflight(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  return null;
}
