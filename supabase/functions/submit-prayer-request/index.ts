// POST /submit-prayer-request
// Body: { title(3-120), description(10-2000), category?, is_anonymous?, website? }
// Ok (201): { ok: true, status: 'pending', message }
//
// Requests only appear on the public wall (prayer_requests_public) once an
// admin approves them.

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin, resolveUser } from "../_shared/supabase.ts";
import { checkRateLimit, callerIp } from "../_shared/ratelimit.ts";
import * as v from "../_shared/validate.ts";
import { getMode } from "../_shared/settings.ts";

const CATEGORIES = ["personal", "family", "ministry", "global", "other"] as const;

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    if (v.isHoneypotTripped(body)) {
      return ok(req, {
        status: "pending",
        message: "Thank you — your request has been submitted and will appear once reviewed.",
      }, 201);
    }

    const mode = await getMode(db, "prayer_mode");
    if (mode === "hidden") {
      throw new ApiError("feature_disabled", "The prayer wall is currently turned off.");
    }

    const user = await resolveUser(req);
    if (!user && mode === "members_only") {
      throw new ApiError("sign_in_required", "Sign in to submit a prayer request.");
    }

    const fields: Record<string, string> = {};
    const titleErr = v.stringLength(body.title, 3, 120);
    if (titleErr) fields.title = titleErr;
    const descErr = v.stringLength(body.description, 10, 2000);
    if (descErr) fields.description = descErr;
    const category = (body.category as string | undefined) ?? "personal";
    const categoryErr = v.oneOf(category, CATEGORIES);
    if (categoryErr) fields.category = categoryErr;
    if (body.is_anonymous !== undefined && typeof body.is_anonymous !== "boolean") {
      fields.is_anonymous = "Must be true or false.";
    }
    if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }

    const rateKey = `submit-prayer:${user?.id ?? callerIp(req)}`;
    if (!(await checkRateLimit(db, rateKey, 5, 3600))) {
      throw new ApiError("rate_limited", "Too many requests. Try again later.");
    }

    const { error: insErr } = await db.from("prayer_requests").insert({
      user_id: user?.id ?? null,
      title: (body.title as string).trim(),
      description: (body.description as string).trim(),
      category,
      is_anonymous: Boolean(body.is_anonymous),
    });
    if (insErr) throw insErr;

    return ok(req, {
      status: "pending",
      message: "Thank you — your request has been submitted and will appear once reviewed.",
    }, 201);
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("submit-prayer-request error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
