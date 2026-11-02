// POST /chapter-join-request
// Body: { chapter_id, first_name, last_name, email, phone?, message?, website? }
// Ok (201): { ok: true, status: 'pending', message }
//
// Notifies the chapter's admins (best-effort email; never blocks the request
// from being saved — see _shared/email.ts).

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
      return ok(req, { status: "pending", message: "Thanks! Your request to join has been received." }, 201);
    }

    const fields: Record<string, string> = {};
    const chapterIdErr = v.positiveInt(body.chapter_id);
    if (chapterIdErr) fields.chapter_id = chapterIdErr;
    const firstErr = v.stringLength(body.first_name, 1, 100);
    if (firstErr) fields.first_name = firstErr;
    const lastErr = v.stringLength(body.last_name, 1, 100);
    if (lastErr) fields.last_name = lastErr;
    const emailErr = v.email(body.email);
    if (emailErr) fields.email = emailErr;
    const phoneErr = v.optionalString(body.phone, 20);
    if (phoneErr) fields.phone = phoneErr;
    const messageErr = v.optionalString(body.message, 2000);
    if (messageErr) fields.message = messageErr;
    if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }

    const user = await resolveUser(req);
    const rateKey = `chapter-join:${user?.id ?? callerIp(req)}`;
    if (!(await checkRateLimit(db, rateKey, 5, 3600))) {
      throw new ApiError("rate_limited", "Too many requests. Try again later.");
    }

    const { data: chapter, error: chapterErr } = await db
      .from("chapters")
      .select("id, name")
      .eq("id", body.chapter_id)
      .eq("status", "active")
      .maybeSingle();
    if (chapterErr) throw chapterErr;
    if (!chapter) throw new ApiError("not_found", "Chapter not found.");

    const { error: insErr } = await db.from("chapter_join_requests").insert({
      chapter_id: body.chapter_id,
      user_id: user?.id ?? null,
      first_name: (body.first_name as string).trim(),
      last_name: (body.last_name as string).trim(),
      email: (body.email as string).trim(),
      phone: body.phone ?? null,
      message: body.message ?? null,
    });
    if (insErr) throw insErr;

    const recipients = adminRecipients();
    if (recipients.length > 0) {
      await sendEmail({
        to: recipients,
        subject: `New chapter join request — ${chapter.name}`,
        html: `<p><strong>${body.first_name} ${body.last_name}</strong> (${body.email}) wants to join <strong>${chapter.name}</strong>.</p>` +
          (body.message ? `<p>${body.message}</p>` : ""),
      });
    }

    return ok(req, { status: "pending", message: "Thanks! Your request to join has been received." }, 201);
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("chapter-join-request error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
