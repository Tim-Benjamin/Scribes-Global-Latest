# Scribes Global — Edge Functions deployment

Migration `001_scribes_global_schema.sql` is already live on your Supabase
project (schema, RLS, storage buckets, seed data). This batch adds every
Edge Function the public site needs — the 4 you already had live
(`like-post`, `add-comment`, `pray-for-request`, `submit-prayer-request`,
rebuilt here against the same documented contract so nothing on the
frontend has to change) plus the rest of the Phase 4 interaction set:
chapter join requests, volunteer applications, event registration/RSVP,
invitation requests, the newsletter, and media submissions.

## 1. Link the project (one-time)

```bash
cd supabase
supabase login                       # opens a browser once
supabase link --project-ref <your-project-ref>
```

Your project ref is the random string in your Supabase dashboard URL
(`https://supabase.com/dashboard/project/<project-ref>`).

## 2. Set secrets

Every function reads `SUPABASE_URL` / `SUPABASE_ANON_KEY` /
`SUPABASE_SERVICE_ROLE_KEY` automatically — the platform injects those, you
never set them yourself. You do need to set these:

```bash
# Required — without this, likes/comments/prayer all fail closed with a
# clear "DEVICE_HASH_SALT secret is not set" error rather than silently
# using a guessable fallback. Generate it once and never change it
# (changing it invalidates every existing anonymous like/prayer).
supabase secrets set DEVICE_HASH_SALT="$(openssl rand -hex 32)"

# Optional for now — leave unset and every email-sending function still
# works (it just logs "would have sent" and returns {sent:false,skipped:true}
# instead of emailing anyone). Set these once you have a Resend account:
supabase secrets set RESEND_API_KEY=re_QjPkQTTM_CTgronQaAB1eigML6nnEWX7c
supabase secrets set EMAIL_FROM="Scribes Global <notifications@scribesglobal.org>"
supabase secrets set ADMIN_NOTIFICATION_EMAIL="you@example.com,someone-else@example.com"
supabase secrets set PUBLIC_SITE_URL="https://scribesglobal.org"

# Optional — locks CORS to your real domain(s) instead of allowing every
# origin. Comma-separated, no spaces needed:
supabase secrets set ALLOWED_ORIGINS="https://scribesglobal.org,https://www.scribesglobal.org"

# Optional — only matters once RESEND_API_KEY is set. Leave unset (defaults
# to auto-confirming subscribers immediately, since there's no email yet to
# confirm with). Once you want real double opt-in enforced:
supabase secrets set AUTO_CONFIRM_SUBSCRIBERS=false
```

Check what's set any time with `supabase secrets list`.

## 3. Deploy every function

```bash
supabase functions deploy like-post
supabase functions deploy add-comment
supabase functions deploy pray-for-request
supabase functions deploy submit-prayer-request
supabase functions deploy chapter-join-request
supabase functions deploy volunteer-apply
supabase functions deploy event-register
supabase functions deploy event-rsvp
supabase functions deploy submit-invitation
supabase functions deploy newsletter-subscribe
supabase functions deploy confirm-subscription
supabase functions deploy newsletter-unsubscribe
supabase functions deploy media-submit
supabase functions deploy media-upload-notify
```

(Or deploy everything in one shot: `supabase functions deploy`.)

Each one will be reachable at:

```
https://<project-ref>.supabase.co/functions/v1/<function-name>
```

## 4. Smoke-test one end-to-end

```bash
curl -i -X POST "https://<project-ref>.supabase.co/functions/v1/newsletter-subscribe" \
  -H "content-type: application/json" \
  -d '{"email":"you@example.com","name":"Test"}'
```

You should get back `201` and `{"ok":true,"status":"active","message":"Thanks for subscribing!"}`
(status is `"active"` immediately until `RESEND_API_KEY` is set — see
`newsletter-subscribe/index.ts`). Check the row landed:

```sql
select * from newsletter_subscribers order by created_at desc limit 1;
```

Then try a deliberately bad request (`{}` body) and confirm you get `422`
with a `fields` object naming what's missing — that's the shape the
frontend's error handling expects everywhere, per
`DATA_CONTRACT_INTERACTIONS.md`.

## 5. What to verify beyond the happy path

- **Rate limiting**: hit any function 10+ times fast from the same device/IP
  and confirm you eventually get `429 rate_limited`.
- **Feature switches**: `update site_settings set value = 'hidden' where key = 'comments_mode';`
  then POST to `add-comment` and confirm `403 feature_disabled`. Set it back
  to `'anonymous'` afterward.
- **Honeypot**: POST to `add-comment` (or any form function) with
  `"website": "http://spam.example"` filled in and confirm you get a normal
  `201` success back but **no row** actually lands in the table — that's the
  anti-bot design working, not a bug.
- **RLS from the browser**: in the frontend (anon key), confirm you can
  `select` from `blog_posts_public`, `prayer_requests_public`, etc., but a
  direct `insert` into any base table from the client is rejected — all
  writes must go through these functions.

## 6. Frontend wiring

Nothing changes for the 4 functions your frontend already calls — same
URLs, same request/response shapes. For the new ones, extend
`DATA_CONTRACT_INTERACTIONS.md` (updated in this batch) with the same
`supabase.functions.invoke('<name>', { body })` pattern already used for
`like-post` etc.

## 7. What's intentionally NOT in this batch

- **Admin moderation actions** (approve/reject a comment, publish a blog
  post, mark a volunteer application reviewed, etc.) don't need Edge
  Functions — the signed-in admin dashboard can write directly to the base
  tables, because the `"admin manage"` / `"staff manage"` RLS policies from
  migration 001 already allow that for an authenticated admin/editor and
  block everyone else. Build those as ordinary authenticated Supabase calls
  from the admin UI.
- **Social media integrations** (`social_media_credentials`,
  `youtube_videos_cache`, auto-pulled Instagram/TikTok stats) — these need
  real API credentials from you first; the table/RLS groundwork is already
  in migration 001 (`social_media_credentials` has no client-facing
  policies at all, by design) and the pull logic can be its own Edge
  Function + scheduled trigger once you're ready to wire a real API key in.
- **Donations** — no payment provider has been chosen yet, so there's no
  `submit-donation` function here. The `donations` table/RLS already exist;
  tell me which processor (Paystack is common for GHS) and I'll build the
  webhook + Edge Function for it.
