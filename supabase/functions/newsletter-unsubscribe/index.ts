// POST /newsletter-unsubscribe
// Body: { token }
// Ok: { ok: true, status: 'unsubscribed' }
//
// Token-only by design (every subscriber has a unique unsubscribe_token,
// generated at insert time) — accepting a bare email here would let anyone
// unsubscribe anyone else's address.

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
      .eq("unsubscribe_token", body.token)
      .maybeSingle();
    if (findErr) throw findErr;
    if (!sub) throw new ApiError("not_found", "This unsubscribe link is invalid.");

    if (sub.status !== "unsubscribed") {
      const { error: updErr } = await db
        .from("newsletter_subscribers")
        .update({ status: "unsubscribed" })
        .eq("id", sub.id);
      if (updErr) throw updErr;
    }

    return ok(req, { status: "unsubscribed" });
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("newsletter-unsubscribe error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
