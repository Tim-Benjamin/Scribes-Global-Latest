// POST /newsletter-subscribe
// Body: { email, name?, website? }
// Ok (201): { ok: true, status: 'pending' | 'active', message }
//
// Double opt-in is wired (confirmation_token + a confirmation email) but only
// activates once RESEND_API_KEY is set. Until then, subscriptions are marked
// 'active' immediately so the feature is fully usable without email — flip
// AUTO_CONFIRM_SUBSCRIBERS=false as a secret once you want the confirmation
// step enforced.

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin } from "../_shared/supabase.ts";
import { checkRateLimit, callerIp } from "../_shared/ratelimit.ts";
import * as v from "../_shared/validate.ts";
import { sendEmail } from "../_shared/email.ts";

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    if (v.isHoneypotTripped(body)) {
      return ok(req, { status: "pending", message: "Thanks for subscribing!" }, 201);
    }

    const fields: Record<string, string> = {};
    const emailErr = v.email(body.email);
    if (emailErr) fields.email = emailErr;
    const nameErr = v.optionalString(body.name, 255);
    if (nameErr) fields.name = nameErr;
    if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }

    const normalizedEmail = (body.email as string).trim().toLowerCase();
    const rateKey = `newsletter:${callerIp(req)}`;
    if (!(await checkRateLimit(db, rateKey, 10, 3600))) {
      throw new ApiError("rate_limited", "Too many requests. Try again later.");
    }

    const { data: existing, error: findErr } = await db
      .from("newsletter_subscribers")
      .select("id, status")
      .ilike("email", normalizedEmail.replace(/[%_]/g, "\\$&"))
      .maybeSingle();
    if (findErr) throw findErr;

    const hasResend = Boolean(Deno.env.get("RESEND_API_KEY"));
    const autoConfirm = Deno.env.get("AUTO_CONFIRM_SUBSCRIBERS") !== "false";
    const willAutoConfirm = autoConfirm || !hasResend;

    if (existing) {
      if (existing.status === "active" || existing.status === "pending") {
        return ok(req, { status: existing.status, message: "You're already subscribed. Thank you!" }, 200);
      }
      // was unsubscribed — reactivate
      const nextStatus = willAutoConfirm ? "active" : "pending";
      const token = crypto.randomUUID().replace(/-/g, "");
      const { error: updErr } = await db
        .from("newsletter_subscribers")
        .update({
          status: nextStatus,
          name: body.name ?? null,
          confirmation_token: willAutoConfirm ? null : token,
          confirmation_date: willAutoConfirm ? new Date().toISOString() : null,
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;
      if (!willAutoConfirm) {
        await sendConfirmation(normalizedEmail, token);
      }
      return ok(req, { status: nextStatus, message: "Thanks for subscribing!" }, 201);
    }

    const status = willAutoConfirm ? "active" : "pending";
    const token = crypto.randomUUID().replace(/-/g, "");
    const { error: insErr } = await db.from("newsletter_subscribers").insert({
      email: normalizedEmail,
      name: body.name ?? null,
      status,
      confirmation_token: willAutoConfirm ? null : token,
      confirmation_date: willAutoConfirm ? new Date().toISOString() : null,
    });
    if (insErr) throw insErr;

    if (!willAutoConfirm) {
      await sendConfirmation(normalizedEmail, token);
    }

    return ok(req, { status, message: "Thanks for subscribing!" }, 201);
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("newsletter-subscribe error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});

async function sendConfirmation(email: string, token: string) {
  const siteUrl = Deno.env.get("PUBLIC_SITE_URL") ?? "https://scribesglobal.org";
  await sendEmail({
    to: email,
    subject: "Confirm your Scribes Global newsletter subscription",
    html: `<p>Thanks for subscribing to the Scribes Global newsletter!</p>` +
      `<p><a href="${siteUrl}/newsletter/confirm?token=${token}">Click here to confirm your subscription</a>.</p>`,
  });
}
