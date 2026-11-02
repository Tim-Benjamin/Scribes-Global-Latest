// POST /volunteer-apply
// Body: { opportunity_id?, first_name, last_name, email, phone, availability,
//         skills, motivation, chapter?, website? }
// Ok (201): { ok: true, status: 'pending', message }

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin, resolveUser } from "../_shared/supabase.ts";
import { checkRateLimit, callerIp } from "../_shared/ratelimit.ts";
import * as v from "../_shared/validate.ts";
import { sendEmail, adminRecipients } from "../_shared/email.ts";

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    if (v.isHoneypotTripped(body)) {
      return ok(req, {
        status: "pending",
        message: "Thank you for applying! We'll be in touch soon.",
      }, 201);
    }

    const fields: Record<string, string> = {};
    let opportunityId: number | null = null;
    if (body.opportunity_id !== undefined && body.opportunity_id !== null) {
      const oppErr = v.positiveInt(body.opportunity_id);
      if (oppErr) fields.opportunity_id = oppErr;
      else opportunityId = body.opportunity_id as number;
    }
    const firstErr = v.stringLength(body.first_name, 1, 100);
    if (firstErr) fields.first_name = firstErr;
    const lastErr = v.stringLength(body.last_name, 1, 100);
    if (lastErr) fields.last_name = lastErr;
    const emailErr = v.email(body.email);
    if (emailErr) fields.email = emailErr;
    const phoneErr = v.stringLength(body.phone, 1, 20);
    if (phoneErr) fields.phone = phoneErr;
    const availabilityErr = v.stringLength(body.availability, 1, 2000);
    if (availabilityErr) fields.availability = availabilityErr;
    const skillsErr = v.stringLength(body.skills, 1, 2000);
    if (skillsErr) fields.skills = skillsErr;
    const motivationErr = v.stringLength(body.motivation, 1, 2000);
    if (motivationErr) fields.motivation = motivationErr;
    const chapterErr = v.optionalString(body.chapter, 100);
    if (chapterErr) fields.chapter = chapterErr;
    if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }

    const user = await resolveUser(req);
    const rateKey = `volunteer-apply:${user?.id ?? callerIp(req)}`;
    if (!(await checkRateLimit(db, rateKey, 5, 3600))) {
      throw new ApiError("rate_limited", "Too many requests. Try again later.");
    }

    let opportunityTitle = "a volunteer opportunity";
    if (opportunityId !== null) {
      const { data: opp, error: oppErr } = await db
        .from("volunteer_opportunities")
        .select("id, title")
        .eq("id", opportunityId)
        .eq("status", "active")
        .maybeSingle();
      if (oppErr) throw oppErr;
      if (!opp) throw new ApiError("not_found", "That volunteer opportunity is no longer available.");
      opportunityTitle = opp.title;
    }

    const { error: insErr } = await db.from("volunteer_applications").insert({
      opportunity_id: opportunityId,
      user_id: user?.id ?? null,
      first_name: (body.first_name as string).trim(),
      last_name: (body.last_name as string).trim(),
      email: (body.email as string).trim(),
      phone: (body.phone as string).trim(),
      availability: (body.availability as string).trim(),
      skills: (body.skills as string).trim(),
      motivation: (body.motivation as string).trim(),
      chapter: body.chapter ?? null,
    });
    if (insErr) throw insErr;

    const recipients = adminRecipients();
    if (recipients.length > 0) {
      await sendEmail({
        to: recipients,
        subject: `New volunteer application — ${opportunityTitle}`,
        html: `<p><strong>${body.first_name} ${body.last_name}</strong> (${body.email}) applied for <strong>${opportunityTitle}</strong>.</p>`,
      });
    }

    return ok(req, { status: "pending", message: "Thank you for applying! We'll be in touch soon." }, 201);
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("volunteer-apply error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
