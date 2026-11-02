// POST /confirm-subscription
// Body: { token }
// Ok: { ok: true, status: 'active' }
//
// Only meaningful once RESEND_API_KEY is set and AUTO_CONFIRM_SUBSCRIBERS is
// "false" (see newsletter-subscribe) — until then subscribers are activated
// immediately and this endpoint has nothing pending to confirm.

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin } from "../_shared/supabase.ts";
import * as v from "../_shared/validate.ts";

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    const tokenErr = v.stringLength(body.token, 8, 255);
    if (tokenErr) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", { token: tokenErr });
    }

    const { data: sub, error: findErr } = await db
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("confirmation_token", body.token)
      .maybeSingle();
    if (findErr) throw findErr;
    if (!sub) throw new ApiError("not_found", "This confirmation link is invalid or has expired.");

    if (sub.status !== "active") {
      const { error: updErr } = await db
        .from("newsletter_subscribers")
        .update({ status: "active", confirmation_date: new Date().toISOString(), confirmation_token: null })
        .eq("id", sub.id);
      if (updErr) throw updErr;
    }

    return ok(req, { status: "active" });
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("confirm-subscription error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
