// POST /event-rsvp
// Body: { event_id, name, email, phone?, response?('yes'|'no'|'maybe'), guests_count?, message? }
// Ok:   { ok: true, response, guests_count }
//
// event_rsvps has a unique (event_id, lower(email)) index, so a second RSVP
// from the same address updates the existing row instead of failing.

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin, resolveUser } from "../_shared/supabase.ts";
import { checkRateLimit, callerIp } from "../_shared/ratelimit.ts";
import { rethrowFriendly } from "../_shared/pg-errors.ts";
import * as v from "../_shared/validate.ts";

const RESPONSES = ["yes", "no", "maybe"] as const;

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    const fields: Record<string, string> = {};
    const eventIdErr = v.positiveInt(body.event_id);
    if (eventIdErr) fields.event_id = eventIdErr;
    const nameErr = v.stringLength(body.name, 1, 255);
    if (nameErr) fields.name = nameErr;
    const emailErr = v.email(body.email);
    if (emailErr) fields.email = emailErr;
    const phoneErr = v.optionalString(body.phone, 20);
    if (phoneErr) fields.phone = phoneErr;
    const response = (body.response as string | undefined) ?? "yes";
    const responseErr = v.oneOf(response, RESPONSES);
    if (responseErr) fields.response = responseErr;
    const guestsCount = (body.guests_count as number | undefined) ?? 1;
    if (typeof guestsCount !== "number" || !Number.isInteger(guestsCount) || guestsCount < 1 || guestsCount > 20) {
      fields.guests_count = "Must be a whole number between 1 and 20.";
    }
    const messageErr = v.optionalString(body.message, 2000);
    if (messageErr) fields.message = messageErr;
    if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }

    const user = await resolveUser(req);
    const rateKey = `event-rsvp:${user?.id ?? callerIp(req)}`;
    if (!(await checkRateLimit(db, rateKey, 10, 3600))) {
      throw new ApiError("rate_limited", "Too many requests. Try again later.");
    }

    const { data: event, error: eventErr } = await db
      .from("events")
      .select("id, status, archived_at, rsvp_enabled")
      .eq("id", body.event_id)
      .maybeSingle();
    if (eventErr) throw eventErr;
    if (!event || event.archived_at) throw new ApiError("not_found", "Event not found.");
    if (event.status === "cancelled") {
      throw new ApiError("bad_request", "RSVP is closed for this event.");
    }
    if (!event.rsvp_enabled) {
      throw new ApiError("bad_request", "RSVP is not enabled for this event.");
    }

    const normalizedEmail = (body.email as string).trim();
    const row = {
      event_id: body.event_id as number,
      user_id: user?.id ?? null,
      name: (body.name as string).trim(),
      email: normalizedEmail,
      phone: body.phone ?? null,
      response,
      guests_count: guestsCount,
      message: body.message ?? null,
      responded_at: new Date().toISOString(),
    };

    // event_rsvps' uniqueness is a functional index on (event_id, lower(email)),
    // which PostgREST's upsert(onConflict:) cannot target directly — so match
    // it manually and update-or-insert instead.
    const { data: existing, error: findErr } = await db
      .from("event_rsvps")
      .select("id")
      .eq("event_id", body.event_id)
      .ilike("email", normalizedEmail.replace(/[%_]/g, "\\$&"))
      .maybeSingle();
    if (findErr) throw findErr;

    if (existing) {
      const { error: updateErr } = await db.from("event_rsvps").update(row).eq("id", existing.id);
      if (updateErr) rethrowFriendly(updateErr);
    } else {
      const { error: insertErr } = await db.from("event_rsvps").insert(row);
      if (insertErr) rethrowFriendly(insertErr);
    }

    return ok(req, { response, guests_count: guestsCount });
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("event-rsvp error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
