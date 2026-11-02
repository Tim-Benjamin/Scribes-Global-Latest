// POST /add-comment
// Body: { post_id, content(1-2000), guest_name(1-80), guest_email, parent_id?, website? }
// Ok (201): { ok: true, status: 'pending', message }
//
// Comments never appear immediately — status starts 'pending' and an admin
// approves them (blog_comments_public only exposes approved rows).

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin, resolveUser } from "../_shared/supabase.ts";
import { checkRateLimit, callerIp } from "../_shared/ratelimit.ts";
import * as v from "../_shared/validate.ts";
import { getMode } from "../_shared/settings.ts";

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    // Honeypot: pretend success, insert nothing.
    if (v.isHoneypotTripped(body)) {
      return ok(req, { status: "pending", message: "Thank you! Your comment is awaiting approval." }, 201);
    }

    const mode = await getMode(db, "comments_mode");
    if (mode === "hidden") {
      throw new ApiError("feature_disabled", "Comments are currently turned off.");
    }

    const user = await resolveUser(req);
    if (!user && mode === "members_only") {
      throw new ApiError("sign_in_required", "Sign in to comment.");
    }

    const fields: Record<string, string> = {};
    const postIdErr = v.positiveInt(body.post_id);
    if (postIdErr) fields.post_id = postIdErr;
    const contentErr = v.stringLength(body.content, 1, 2000);
    if (contentErr) fields.content = contentErr;

    if (!user) {
      const nameErr = v.stringLength(body.guest_name, 1, 80);
      if (nameErr) fields.guest_name = nameErr;
      const emailErr = v.email(body.guest_email);
      if (emailErr) fields.guest_email = emailErr;
    }

    let parentId: number | null = null;
    if (body.parent_id !== undefined && body.parent_id !== null) {
      const parentErr = v.positiveInt(body.parent_id);
      if (parentErr) fields.parent_id = parentErr;
      else parentId = body.parent_id as number;
    }

    if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }

    const rateKey = `comment:${user?.id ?? callerIp(req)}`;
    if (!(await checkRateLimit(db, rateKey, 10, 300))) {
      throw new ApiError("rate_limited", "Too many comments. Try again later.");
    }

    const { data: post, error: postErr } = await db
      .from("blog_posts")
      .select("id")
      .eq("id", body.post_id)
      .eq("status", "published")
      .maybeSingle();
    if (postErr) throw postErr;
    if (!post) throw new ApiError("not_found", "Post not found.");

    if (parentId !== null) {
      const { data: parent, error: parentErr } = await db
        .from("blog_comments")
        .select("id, post_id")
        .eq("id", parentId)
        .maybeSingle();
      if (parentErr) throw parentErr;
      if (!parent || parent.post_id !== body.post_id) {
        throw new ApiError("validation_failed", "Check the highlighted fields.", {
          parent_id: "This comment isn't on the same post.",
        });
      }
    }

    const insertRow: Record<string, unknown> = {
      post_id: body.post_id,
      parent_id: parentId,
      content: (body.content as string).trim(),
    };
    if (user) {
      insertRow.user_id = user.id;
    } else {
      insertRow.guest_name = (body.guest_name as string).trim();
      insertRow.guest_email = (body.guest_email as string).trim();
    }

    const { error: insErr } = await db.from("blog_comments").insert(insertRow);
    if (insErr) throw insErr;

    return ok(req, { status: "pending", message: "Thank you! Your comment is awaiting approval." }, 201);
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("add-comment error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
