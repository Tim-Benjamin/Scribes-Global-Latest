# Scribes Global: interaction endpoints

Base URL: `https://<project-ref>.supabase.co/functions/v1/<name>`
All endpoints are `POST` with a JSON body. Never insert into the tables directly from the browser.

## Reading data (no function needed)

| What | How |
|---|---|
| Feature modes | `supabase.rpc('get_site_settings')` returns `{ likes_mode, comments_mode, prayer_mode }`, each `'anonymous' \| 'members_only' \| 'hidden'` |
| Blog list / post | `from('blog_posts_public')` (includes `likes`, `author_name`, `author_photo`) |
| Approved comments | `from('blog_comments_public').eq('post_id', id).order('created_at')` (threads via `parent_id`) |
| Prayer wall | `from('prayer_requests_public')` (includes `prayer_count`) |
| Approved media | `from('media_content_public')` (images/video/audio/written submissions that passed review) |
| Active chapters | `from('chapters').eq('status', 'active')` |
| Open events | `from('events').is('archived_at', null)` |
| Active volunteer opportunities | `from('volunteer_opportunities').eq('status', 'active')` |

Never select `guest_email`, `user_id` or `device_hash`: they are not exposed and never will be.

## Device id

In `anonymous` mode, generate once and keep in `localStorage`:

```ts
const key = 'sg_device_id';
let id = localStorage.getItem(key);
if (!id) { id = crypto.randomUUID().replaceAll('-', ''); localStorage.setItem(key, id); }
```
Must match `^[A-Za-z0-9_-]{16,64}$`. The server stores only a salted hash. Remember which posts/prayers this device already liked in `localStorage` too, to render the filled state on load (the server has no "list my likes" endpoint).

## Responses

Success: `{ "ok": true, ... }`
Failure: `{ "ok": false, "error": { "code": "...", "message": "...", "fields"?: { "<field>": "<message>" } } }`

| code | HTTP | Meaning / what the UI should do |
|---|---|---|
| `validation_failed` | 422 | Show `error.fields[field]` next to each input |
| `feature_disabled` | 403 | Mode is `hidden`: remove the feature |
| `sign_in_required` | 401 | Mode is `members_only`: show a friendly "sign-in coming soon" state |
| `not_found` | 404 | Record missing or not public |
| `rate_limited` | 429 | Show `error.message`, allow retry later |
| `bad_request` / `method_not_allowed` / `server_error` | 400 / 405 / 500 | Generic retry message |

With `supabase.functions.invoke`, non-2xx responses arrive as `error` (a `FunctionsHttpError`). Read the body with `await error.context.json()`. Plain `fetch` works equally well.

Every form endpoint below also accepts an optional `website?: ''` honeypot
field — render it as a hidden input (off-screen, `tabindex=-1`,
`autocomplete=off`, `aria-hidden`) and send whatever it contains. Real
visitors leave it empty; if it's filled, the function still returns a normal
success response (so a bot gets no signal) but quietly skips the insert.

---

## `like-post`
Body: `{ post_id: number, device_id: string, action?: 'like' | 'unlike' | 'toggle' }` (default `toggle`)
Ok: `{ ok: true, liked: boolean, likes: number }`. Use `likes` as the new count.

## `add-comment`
Body: `{ post_id: number, content: string(1-2000), guest_name: string(1-80), guest_email: string, parent_id?: number, website?: '' }`
Ok (HTTP 201): `{ ok: true, status: 'pending', message: 'Thank you! Your comment is awaiting approval.' }`
- The comment does **not** appear until the admin approves it. Show `message`, do not add it to the list optimistically.
- `content` is plain text. Render it as text, never as HTML.
- Signed-in members (later) omit `guest_name` / `guest_email`.

## `pray-for-request`
Body: `{ prayer_id: number, device_id: string, action?: 'pray' | 'unpray' }` (default `pray`)
Ok: `{ ok: true, prayed: boolean, prayer_count: number }`. Praying twice from one device counts once.

## `submit-prayer-request`
Body: `{ title: string(3-120), description: string(10-2000), category?: 'personal'|'family'|'ministry'|'global'|'other', is_anonymous?: boolean, website?: '' }`
Ok (HTTP 201): `{ ok: true, status: 'pending', message: string }`. Requests appear on the wall only after admin approval.

## `chapter-join-request`
Body: `{ chapter_id: number, first_name: string, last_name: string, email: string, phone?: string, message?: string, website?: '' }`
Ok (HTTP 201): `{ ok: true, status: 'pending', message: string }`

## `volunteer-apply`
Body: `{ opportunity_id?: number, first_name: string, last_name: string, email: string, phone: string, availability: string, skills: string, motivation: string, chapter?: string, website?: '' }`
Ok (HTTP 201): `{ ok: true, status: 'pending', message: string }`
- `opportunity_id` is optional — omit it for a general "I want to volunteer somewhere" application not tied to a specific posted opportunity.

## `event-register`
Body: `{ event_id: number, name: string, email: string, phone?: string, chapter?: string, dietary_needs?: string, additional_info?: string, website?: '' }`
Ok (HTTP 201): `{ ok: true, status: 'registered', registration_count: number }`
Errors worth handling specifically:
- `bad_request` — event is closed, full, already ended, or doesn't have registration enabled. Show `error.message` as-is (it's already a friendly sentence).
- `validation_failed` with `fields.email` — this email already registered for this event.

## `event-rsvp`
Body: `{ event_id: number, name: string, email: string, phone?: string, response?: 'yes'|'no'|'maybe', guests_count?: number(1-20), message?: string }`
Ok: `{ ok: true, response: string, guests_count: number }`
- Submitting again with the same email **updates** the existing RSVP (change your mind from "maybe" to "yes", adjust guest count, etc.) rather than erroring.
- No honeypot/anti-spam field here by design — RSVPs are low-risk and the UI usually needs every submit to go through cleanly when someone changes their answer.

## `submit-invitation`
Body: `{ name: string, email: string, phone: string, organization?: string, event_type: string, event_date: 'YYYY-MM-DD', event_time?: 'HH:MM', venue: string, audience_size?: string, duration?: string, performance_type?: string, additional_details?: string, budget_range?: string, website?: '' }`
Ok (HTTP 201): `{ ok: true, status: 'pending', message: string }`

## `newsletter-subscribe`
Body: `{ email: string, name?: string, website?: '' }`
Ok (HTTP 201 new / 200 already subscribed): `{ ok: true, status: 'pending'|'active', message: string }`
- `status` will be `'active'` immediately unless the backend has a Resend key configured **and** double opt-in turned on — see `DEPLOYMENT.md`. If `status` is `'pending'`, tell the user to check their email to confirm.

## `confirm-subscription`
Body: `{ token: string }` (the `token` query param from the confirmation email link)
Ok: `{ ok: true, status: 'active' }`

## `newsletter-unsubscribe`
Body: `{ token: string }` (the `unsubscribe_token` from the footer link in any newsletter email)
Ok: `{ ok: true, status: 'unsubscribed' }`

## `media-submit`
Body: `{ title: string, description?: string, media_type: 'image'|'video'|'audio'|'written', submitter_name?: string, submitter_email?: string, category?: string, file_base64?: string, file_name?: string, file_mime?: string, website?: '' }`
Ok (HTTP 201): `{ ok: true, status: 'pending', message: string }`
- A file is required for `image`/`video`/`audio`; `written` submissions can be text-only (put the piece itself in `description`).
- `file_base64` can be a raw base64 string or a full `data:` URL (e.g. straight out of a `<input type="file">` + `FileReader.readAsDataURL`) — either works.
- Cap the file at **8MB** client-side before sending (reject larger files locally with a friendly message) — the function also enforces this server-side.
- Allowed `file_mime` by type: image → `image/jpeg, image/png, image/webp, image/avif, image/gif`; video → `video/mp4, video/webm`; audio → `audio/mpeg, audio/mp4, audio/wav`.
- Submissions are never public until an admin approves them (`media_content_public` view).

## `media-upload-notify`
Body: `{ email: string }`
Ok (HTTP 201): `{ ok: true, message: string }`
- A "notify me when uploads reopen" waitlist signup. Idempotent — safe to call again with the same email.

---

## Mode behaviour cheat-sheet

| Mode | UI | Backend |
|---|---|---|
| `anonymous` | Show feature, send `device_id` | Works for everyone |
| `members_only` | Show a disabled/"sign in" state | Rejects with `sign_in_required` until Google sign-in exists |
| `hidden` | Render nothing | Rejects with `feature_disabled` |

Read modes on app load and cache for about 60 seconds. The admin can change them at any time without a deploy.

`likes_mode` gates `like-post`; `comments_mode` gates `add-comment`;
`prayer_mode` gates both `pray-for-request` and `submit-prayer-request`. The
other functions (chapters, volunteer, events, invitations, newsletter,
media) are always open to anonymous visitors — they have no mode switch,
since none of them make sense to hide behind a members-only wall.
