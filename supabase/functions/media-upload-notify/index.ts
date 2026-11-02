// POST /media-upload-notify
// Body: { email }
// Ok (201): { ok: true, message }
//
// A waitlist: "notify me by email when media uploads reopen." Idempotent —
// subscribing twice with the same email is a no-op success either way.

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin } from "../_shared/supabase.ts";
import { checkRateLimit, callerIp } from "../_shared/ratelimit.ts";
import * as v from "../_shared/validate.ts";

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    const emailErr = v.email(body.email);
    if (emailErr) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", { email: emailErr });
    }

    const rateKey = `media-notify:${callerIp(req)}`;
    if (!(await checkRateLimit(db, rateKey, 10, 3600))) {
      throw new ApiError("rate_limited", "Too many requests. Try again later.");
    }

    // media_upload_notify's uniqueness is a functional index on lower(email),
    // which PostgREST's upsert(onConflict:) cannot target directly — check
    // first instead, so a repeat signup is just a no-op success.
    const normalizedEmail = (body.email as string).trim().toLowerCase();
    const { data: existing, error: findErr } = await db
      .from("media_upload_notify")
      .select("id")
      .ilike("email", normalizedEmail.replace(/[%_]/g, "\\$&"))
      .maybeSingle();
    if (findErr) throw findErr;

    if (!existing) {
      const { error: insErr } = await db.from("media_upload_notify").insert({ email: normalizedEmail });
      if (insErr) throw insErr;
    }

    return ok(req, { message: "You're on the list — we'll email you when uploads reopen." }, 201);
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("media-upload-notify error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
