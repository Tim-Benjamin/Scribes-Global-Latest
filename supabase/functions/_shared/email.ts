// Transactional email, behind one function. Every Edge Function that needs
// to notify someone calls sendEmail() — nobody imports a mail SDK directly.
//
// Until RESEND_API_KEY is set as a secret, this logs the message and returns
// { sent: false, skipped: true } instead of throwing, so every form still
// completes and saves its data — email is a nice-to-have notification layer
// on top, never a blocker for the form itself. Once you have a Resend key:
//
//   supabase secrets set RESEND_API_KEY=re_xxxxxxxx
//   supabase secrets set EMAIL_FROM="Scribes Global <notifications@scribesglobal.org>"
//
// ...and sending turns on automatically, no code changes needed.

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  sent: boolean;
  skipped?: boolean;
  error?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM") ?? "Scribes Global <onboarding@resend.dev>";

  if (!apiKey) {
    console.log("[email:skipped] RESEND_API_KEY not set — would have sent:", {
      to: input.to,
      subject: input.subject,
    });
    return { sent: false, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        reply_to: input.replyTo,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[email:failed]", res.status, body);
      return { sent: false, error: `Resend ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email:failed]", err);
    return { sent: false, error: String(err) };
  }
}

/** Where admin notification emails go. Falls back to a no-op recipient list. */
export function adminRecipients(): string[] {
  const raw = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}
