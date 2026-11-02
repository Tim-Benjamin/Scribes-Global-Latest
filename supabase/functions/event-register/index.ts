// POST /event-register
// Body: { event_id, name, email, phone?, chapter?, dietary_needs?, additional_info?, website? }
// Ok (201): { ok: true, status: 'registered', registration_count }
//
// The DB trigger check_event_registration is the final word on whether an
// event is open/full/ended (defense in depth); this function pre-checks the
// same conditions first so a full or closed event returns a clear message
// instead of a raw Postgres exception.

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin, resolveUser } from "../_shared/supabase.ts";
import { checkRateLimit, callerIp } from "../_shared/ratelimit.ts";
import { rethrowFriendly } from "../_shared/pg-errors.ts";
import * as v from "../_shared/validate.ts";

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    if (v.isHoneypotTripped(body)) {
      return ok(req, { status: "registered", registration_count: 0 }, 201);
    }

    const fields: Record<string, string> = {};
    const eventIdErr = v.positiveInt(body.event_id);
    if (eventIdErr) fields.event_id = eventIdErr;
    const nameErr = v.stringLength(body.name, 1, 255);
    if (nameErr) fields.name = nameErr;
    const emailErr = v.email(body.email);
    if (emailErr) fields.email = emailErr;
    const phoneErr = v.optionalString(body.phone, 20);
    if (phoneErr) fields.phone = phoneErr;
    const chapterErr = v.optionalString(body.chapter, 100);
    if (chapterErr) fields.chapter = chapterErr;
    const dietaryErr = v.optionalString(body.dietary_needs, 2000);
    if (dietaryErr) fields.dietary_needs = dietaryErr;
    const infoErr = v.optionalString(body.additional_info, 2000);
    if (infoErr) fields.additional_info = infoErr;
    if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }

    const user = await resolveUser(req);
    const rateKey = `event-register:${user?.id ?? callerIp(req)}`;
    if (!(await checkRateLimit(db, rateKey, 10, 3600))) {
      throw new ApiError("rate_limited", "Too many requests. Try again later.");
    }

    const { data: event, error: eventErr } = await db
      .from("events")
      .select("id, status, archived_at, registration_enabled, registration_limit, registration_count, end_date, start_date")
      .eq("id", body.event_id)
      .maybeSingle();
    if (eventErr) throw eventErr;
    if (!event || event.archived_at) throw new ApiError("not_found", "Event not found.");
    if (event.status === "past" || event.status === "cancelled") {
      throw new ApiError("bad_request", "Registration is closed for this event.");
    }
    if (!event.registration_enabled) {
      throw new ApiError("bad_request", "Registration is not enabled for this event.");
    }
    const endsAt = new Date(event.end_date ?? event.start_date);
    if (endsAt.getTime() < Date.now()) {
      throw new ApiError("bad_request", "This event has already ended.");
    }
    if (event.registration_limit !== null && event.registration_count >= event.registration_limit) {
      throw new ApiError("bad_request", "This event is full.");
    }

    const { error: insErr } = await db.from("event_registrations").insert({
      event_id: body.event_id,
      user_id: user?.id ?? null,
      name: (body.name as string).trim(),
      email: (body.email as string).trim(),
      phone: body.phone ?? null,
      chapter: body.chapter ?? null,
      dietary_needs: body.dietary_needs ?? null,
      additional_info: body.additional_info ?? null,
    });
    if (insErr) {
      if (insErr.code === "23505") {
        throw new ApiError("validation_failed", "Check the highlighted fields.", {
          email: "You're already registered for this event.",
        });
      }
      rethrowFriendly(insErr);
    }

    const { data: refreshed } = await db
      .from("events")
      .select("registration_count")
      .eq("id", body.event_id)
      .single();

    return ok(req, { status: "registered", registration_count: refreshed?.registration_count ?? null }, 201);
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("event-register error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
