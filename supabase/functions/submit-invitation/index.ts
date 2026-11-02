// POST /submit-invitation
// Body: { name, email, phone, organization?, event_type, event_date, event_time?,
//         venue, audience_size?, duration?, performance_type?, additional_details?,
//         budget_range?, website? }
// Ok (201): { ok: true, status: 'pending', message }

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin, resolveUser } from "../_shared/supabase.ts";
import { checkRateLimit, callerIp } from "../_shared/ratelimit.ts";
import * as v from "../_shared/validate.ts";
import { sendEmail, adminRecipients } from "../_shared/email.ts";

const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    if (v.isHoneypotTripped(body)) {
      return ok(req, {
        status: "pending",
        message: "Thank you! Your invitation request has been received — we'll be in touch.",
      }, 201);
    }

    const fields: Record<string, string> = {};
    const nameErr = v.stringLength(body.name, 1, 255);
    if (nameErr) fields.name = nameErr;
    const emailErr = v.email(body.email);
    if (emailErr) fields.email = emailErr;
    const phoneErr = v.stringLength(body.phone, 1, 20);
    if (phoneErr) fields.phone = phoneErr;
    const orgErr = v.optionalString(body.organization, 255);
    if (orgErr) fields.organization = orgErr;
    const eventTypeErr = v.stringLength(body.event_type, 1, 100);
    if (eventTypeErr) fields.event_type = eventTypeErr;
    const dateErr = v.isoDate(body.event_date);
    if (dateErr) fields.event_date = dateErr;
    else if (new Date(body.event_date as string).getTime() < Date.now() - 86400000) {
      fields.event_date = "Event date should be today or in the future.";
    }
    if (body.event_time !== undefined && body.event_time !== null && body.event_time !== "") {
      if (typeof body.event_time !== "string" || !TIME_RE.test(body.event_time)) {
        fields.event_time = "Enter a valid time (HH:MM).";
      }
    }
    const venueErr = v.stringLength(body.venue, 1, 255);
    if (venueErr) fields.venue = venueErr;
    const audienceErr = v.optionalString(body.audience_size, 50);
    if (audienceErr) fields.audience_size = audienceErr;
    const durationErr = v.optionalString(body.duration, 50);
    if (durationErr) fields.duration = durationErr;
    const performanceErr = v.optionalString(body.performance_type, 2000);
    if (performanceErr) fields.performance_type = performanceErr;
    const detailsErr = v.optionalString(body.additional_details, 2000);
    if (detailsErr) fields.additional_details = detailsErr;
    const budgetErr = v.optionalString(body.budget_range, 50);
    if (budgetErr) fields.budget_range = budgetErr;
    if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }

    const user = await resolveUser(req);
    const rateKey = `submit-invitation:${user?.id ?? callerIp(req)}`;
    if (!(await checkRateLimit(db, rateKey, 5, 3600))) {
      throw new ApiError("rate_limited", "Too many requests. Try again later.");
    }

    const { error: insErr } = await db.from("booking_invitations").insert({
      user_id: user?.id ?? null,
      name: (body.name as string).trim(),
      email: (body.email as string).trim(),
      phone: (body.phone as string).trim(),
      organization: body.organization ?? null,
      event_type: (body.event_type as string).trim(),
      event_date: body.event_date,
      event_time: body.event_time || null,
      venue: (body.venue as string).trim(),
      audience_size: body.audience_size ?? null,
      duration: body.duration ?? null,
      performance_type: body.performance_type ?? null,
      additional_details: body.additional_details ?? null,
      budget_range: body.budget_range ?? null,
    });
    if (insErr) throw insErr;

    const recipients = adminRecipients();
    if (recipients.length > 0) {
      await sendEmail({
        to: recipients,
        subject: `New invitation request — ${body.event_type}`,
        html: `<p><strong>${body.name}</strong> (${body.email}) requested Scribes Global for <strong>${body.event_type}</strong> on ${body.event_date} at ${body.venue}.</p>`,
        replyTo: body.email as string,
      });
    }

    return ok(req, {
      status: "pending",
      message: "Thank you! Your invitation request has been received — we'll be in touch.",
    }, 201);
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("submit-invitation error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
