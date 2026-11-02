// POST /media-submit
// Body: { title, description?, media_type('image'|'video'|'audio'|'written'),
//         submitter_name?, submitter_email?, category?,
//         file_base64?, file_name?, file_mime?, website? }
// Ok (201): { ok: true, status: 'pending', message }
//
// `media_content` rows always start 'pending' (media_content_public only
// shows 'approved'). A file is required for image/video/audio; 'written'
// submissions can be text-only (put the piece itself in `description`).
//
// The media-submissions Storage bucket is PRIVATE with no anon/authenticated
// policies at all (see migration 001, section 9) — visitors cannot upload to
// it directly, only this function can (service role). Keep file_base64
// uploads small: this function caps the decoded file at 8MB. A visitor
// wanting to submit something larger should be directed to email it in for
// now; a resumable/direct-to-storage flow can replace this later without
// changing the public contract (title/description/etc. stay the same).

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin, resolveUser } from "../_shared/supabase.ts";
import { checkRateLimit, callerIp } from "../_shared/ratelimit.ts";
import * as v from "../_shared/validate.ts";

const MEDIA_TYPES = ["image", "video", "audio", "written"] as const;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME: Record<(typeof MEDIA_TYPES)[number], string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
  video: ["video/mp4", "video/webm"],
  audio: ["audio/mpeg", "audio/mp4", "audio/wav"],
  written: [],
};

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    if (v.isHoneypotTripped(body)) {
      return ok(req, { status: "pending", message: "Thank you! Your submission is awaiting review." }, 201);
    }

    const fields: Record<string, string> = {};
    const titleErr = v.stringLength(body.title, 1, 255);
    if (titleErr) fields.title = titleErr;
    const mediaType = body.media_type as string;
    const typeErr = v.oneOf(mediaType, MEDIA_TYPES);
    if (typeErr) fields.media_type = typeErr;
    const descErr = v.optionalString(body.description, 5000);
    if (descErr) fields.description = descErr;
    const nameErr = v.optionalString(body.submitter_name, 255);
    if (nameErr) fields.submitter_name = nameErr;
    if (body.submitter_email) {
      const emailErr = v.email(body.submitter_email);
      if (emailErr) fields.submitter_email = emailErr;
    }
    const categoryErr = v.optionalString(body.category, 100);
    if (categoryErr) fields.category = categoryErr;

    const needsFile = typeErr === null && mediaType !== "written";
    if (needsFile && !body.file_base64) {
      fields.file_base64 = "A file is required for this media type.";
    }

    let fileBytes: Uint8Array | null = null;
    if (body.file_base64) {
      if (typeof body.file_base64 !== "string") {
        fields.file_base64 = "Invalid file data.";
      } else {
        try {
          const base64 = body.file_base64.includes(",")
            ? body.file_base64.split(",").pop()!
            : body.file_base64;
          fileBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        } catch {
          fields.file_base64 = "Invalid file data.";
        }
        if (fileBytes && fileBytes.byteLength > MAX_FILE_BYTES) {
          fields.file_base64 = "File is too large (8MB max for now).";
        }
        if (fileBytes && typeErr === null) {
          const allowed = ALLOWED_MIME[mediaType as (typeof MEDIA_TYPES)[number]];
          if (allowed.length > 0 && (!body.file_mime || !allowed.includes(body.file_mime as string))) {
            fields.file_mime = `Must be one of: ${allowed.join(", ")}.`;
          }
        }
      }
    }

    if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }

    const user = await resolveUser(req);
    const rateKey = `media-submit:${user?.id ?? callerIp(req)}`;
    if (!(await checkRateLimit(db, rateKey, 5, 3600))) {
      throw new ApiError("rate_limited", "Too many submissions. Try again later.");
    }

    let filePath: string | null = null;
    if (fileBytes) {
      const safeName = (body.file_name as string | undefined)?.replace(/[^a-zA-Z0-9._-]/g, "_") ?? "upload";
      filePath = `${crypto.randomUUID()}/${safeName}`;
      const { error: uploadErr } = await db.storage
        .from("media-submissions")
        .upload(filePath, fileBytes, {
          contentType: (body.file_mime as string) ?? "application/octet-stream",
          upsert: false,
        });
      if (uploadErr) throw uploadErr;
    }

    const { error: insErr } = await db.from("media_content").insert({
      user_id: user?.id ?? null,
      title: (body.title as string).trim(),
      description: body.description ?? null,
      media_type: mediaType,
      file_path: filePath,
      submitter_name: body.submitter_name ?? null,
      submitter_email: body.submitter_email ?? null,
      category: body.category ?? "general",
    });
    if (insErr) throw insErr;

    return ok(req, { status: "pending", message: "Thank you! Your submission is awaiting review." }, 201);
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("media-submit error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
