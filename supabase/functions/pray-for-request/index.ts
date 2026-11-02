// POST /pray-for-request
// Body: { prayer_id, device_id, action?: 'pray' | 'unpray' } (default 'pray')
// Ok:   { ok: true, prayed: boolean, prayer_count: number }
//
// Mirrors like-post, but for prayer_requests / prayer_interactions and the
// prayer_mode switch. Praying twice from one device counts once (unique
// constraint on prayer_interactions).

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin, resolveUser } from "../_shared/supabase.ts";
import { checkRateLimit } from "../_shared/ratelimit.ts";
import * as v from "../_shared/validate.ts";
import { getMode } from "../_shared/settings.ts";
import { hashDeviceId } from "../_shared/device.ts";

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    const fields: Record<string, string> = {};
    const prayerIdErr = v.positiveInt(body.prayer_id);
    if (prayerIdErr) fields.prayer_id = prayerIdErr;
    const action = (body.action as string | undefined) ?? "pray";
    const actionErr = v.oneOf(action, ["pray", "unpray"] as const);
    if (actionErr) fields.action = actionErr;

    const mode = await getMode(db, "prayer_mode");
    if (mode === "hidden") {
      throw new ApiError("feature_disabled", "The prayer wall is currently turned off.");
    }

    const user = await resolveUser(req);
    let deviceHash: string | null = null;
    if (!user) {
      if (mode === "members_only") {
        throw new ApiError("sign_in_required", "Sign in to pray for requests.");
      }
      const deviceErr = v.deviceId(body.device_id);
      if (deviceErr) fields.device_id = deviceErr;
    }
    if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }
    if (!user) deviceHash = await hashDeviceId(body.device_id as string);

    const rateKey = `pray:${user?.id ?? deviceHash}`;
    if (!(await checkRateLimit(db, rateKey, 60, 60))) {
      throw new ApiError("rate_limited", "Too many requests. Try again in a moment.");
    }

    const { data: prayer, error: prayerErr } = await db
      .from("prayer_requests")
      .select("id")
      .eq("id", body.prayer_id)
      .eq("status", "approved")
      .maybeSingle();
    if (prayerErr) throw prayerErr;
    if (!prayer) throw new ApiError("not_found", "Prayer request not found.");

    const match: Record<string, string | number> = user
      ? { prayer_id: body.prayer_id as number, user_id: user.id }
      : { prayer_id: body.prayer_id as number, device_hash: deviceHash as string };

    const { data: existing, error: findErr } = await db
      .from("prayer_interactions")
      .select("id")
      .match(match)
      .maybeSingle();
    if (findErr) throw findErr;

    let prayed = Boolean(existing);
    if (!existing && action === "pray") {
      const { error: insErr } = await db.from("prayer_interactions").insert(match);
      if (insErr) throw insErr;
      prayed = true;
    } else if (existing && action === "unpray") {
      const { error: delErr } = await db.from("prayer_interactions").delete().eq("id", existing.id);
      if (delErr) throw delErr;
      prayed = false;
    }

    const { data: refreshed, error: refreshErr } = await db
      .from("prayer_requests")
      .select("prayer_count")
      .eq("id", body.prayer_id)
      .single();
    if (refreshErr) throw refreshErr;

    return ok(req, { prayed, prayer_count: refreshed.prayer_count });
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("pray-for-request error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
