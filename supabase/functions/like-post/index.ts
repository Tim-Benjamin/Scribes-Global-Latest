// POST /like-post
// Body: { post_id: number, device_id: string, action?: 'like' | 'unlike' | 'toggle' }
// Ok:   { ok: true, liked: boolean, likes: number }
//
// Respects site_settings.likes_mode (anonymous / members_only / hidden).
// blog_posts.likes is kept in sync by a DB trigger (sync_blog_likes), so this
// function only ever inserts/deletes blog_likes rows and re-reads the count.

import { readJsonBody, isResponse } from "../_shared/request.ts";
import { ok, fail, ApiError } from "../_shared/response.ts";
import { admin, resolveUser } from "../_shared/supabase.ts";
import { checkRateLimit } from "../_shared/ratelimit.ts";
import * as v from "../_shared/validate.ts";
import { getMode } from "../_shared/settings.ts";
import { hashDeviceId } from "../_shared/device.ts";

Deno.serve(async (req) => {
  const body = await readJsonBody(req);
  if (isResponse(body)) return body;

  try {
    const db = admin();

    const postIdErr = v.positiveInt(body.post_id);
    const action = (body.action as string | undefined) ?? "toggle";
    const actionErr = v.oneOf(action, ["like", "unlike", "toggle"] as const);
    const fields: Record<string, string> = {};
    if (postIdErr) fields.post_id = postIdErr;
    if (actionErr) fields.action = actionErr;

    const mode = await getMode(db, "likes_mode");
    if (mode === "hidden") {
      throw new ApiError("feature_disabled", "Likes are currently turned off.");
    }

    const user = await resolveUser(req);
    let deviceHash: string | null = null;
    if (!user) {
      if (mode === "members_only") {
        throw new ApiError("sign_in_required", "Sign in to like posts.");
      }
      const deviceErr = v.deviceId(body.device_id);
      if (deviceErr) fields.device_id = deviceErr;
      if (Object.keys(fields).length > 0) {
        throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
      }
      deviceHash = await hashDeviceId(body.device_id as string);
    } else if (Object.keys(fields).length > 0) {
      throw new ApiError("validation_failed", "Check the highlighted fields.", fields);
    }

    const rateKey = `like:${user?.id ?? deviceHash}`;
    if (!(await checkRateLimit(db, rateKey, 60, 60))) {
      throw new ApiError("rate_limited", "Too many requests. Try again in a moment.");
    }

    const { data: post, error: postErr } = await db
      .from("blog_posts")
      .select("id")
      .eq("id", body.post_id)
      .eq("status", "published")
      .maybeSingle();
    if (postErr) throw postErr;
    if (!post) throw new ApiError("not_found", "Post not found.");

    const match: Record<string, string | number> = user
      ? { post_id: body.post_id as number, user_id: user.id }
      : { post_id: body.post_id as number, device_hash: deviceHash as string };

    const { data: existing, error: findErr } = await db
      .from("blog_likes")
      .select("id")
      .match(match)
      .maybeSingle();
    if (findErr) throw findErr;

    let liked = Boolean(existing);
    if (!existing && (action === "like" || action === "toggle")) {
      const { error: insErr } = await db.from("blog_likes").insert(match);
      if (insErr) throw insErr;
      liked = true;
    } else if (existing && (action === "unlike" || action === "toggle")) {
      const { error: delErr } = await db.from("blog_likes").delete().eq("id", existing.id);
      if (delErr) throw delErr;
      liked = false;
    }

    const { data: refreshed, error: refreshErr } = await db
      .from("blog_posts")
      .select("likes")
      .eq("id", body.post_id)
      .single();
    if (refreshErr) throw refreshErr;

    return ok(req, { liked, likes: refreshed.likes });
  } catch (err) {
    if (err instanceof ApiError) return fail(req, err.code, err.message, err.fields);
    console.error("like-post error", err);
    return fail(req, "server_error", "Something went wrong. Please try again.");
  }
});
