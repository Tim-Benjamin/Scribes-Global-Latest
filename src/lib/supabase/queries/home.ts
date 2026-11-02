import { supabase } from "../client";

const nowIso = () => new Date().toISOString();

/* =========================================================
   QUERIES
========================================================= */

export function getFeaturedEvents() {
  return supabase
    .from("events")
    .select(`
      id,
      title,
      slug,
      start_date,
      end_date,
      location,
      event_type,
      hero_image,
      registration_enabled,
      rsvp_enabled,
      registration_limit,
      registration_count
    `)
    .eq("featured", true)
    .neq("status", "cancelled")
    .or(
      `end_date.gte.${nowIso()},and(end_date.is.null,start_date.gte.${nowIso()})`,
    )
    .order("start_date")
    .limit(4);
}

export function getHomepageVideos() {
  return supabase
    .from("homepage_videos")
    .select(`
      id,
      youtube_url,
      title,
      description,
      video_date,
      row_title,
      sort_order
    `)
    .order("row_title")
    .order("sort_order")
    .order("id");
}

export function getSocialStats() {
  return supabase
    .from("social_media_stats")
    .select(`
      platform,
      follower_count
    `);
}

export function getInstagramPosts() {
  return supabase
    .from("instagram_manual_posts")
    .select(`
      slot,
      post_url,
      caption
    `)
    .order("slot");
}

export function getTikTokVideos() {
  return supabase
    .from("tiktok_featured")
    .select(`
      slot,
      video_url
    `)
    .order("slot");
}

export function getLatestYouTube(
  limit = 6,
) {
  return supabase
    .from("youtube_videos_cache")
    .select(`
      video_id,
      title,
      thumbnail_url,
      duration,
      view_count,
      published_at
    `)
    .order("published_at", {
      ascending: false,
    })
    .limit(limit);
}

export function getLatestPosts(
  limit = 3,
) {
  return supabase
    .from("blog_posts_public")
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image,
      category,
      published_at,
      reading_time,
      author_name
    `)
    .order("published_at", {
      ascending: false,
    })
    .limit(limit);
}

export function getSiteSettings() {
  return supabase.rpc(
    "get_site_settings",
  );
}

/* =========================================================
   QUERY RESULT TYPES

   Important:
   These describe what the SELECT above actually returns,
   not the complete database table row.
========================================================= */

export type FeaturedEventItem =
  NonNullable<
    Awaited<
      ReturnType<typeof getFeaturedEvents>
    >["data"]
  >[number];

export type HomepageVideoItem =
  NonNullable<
    Awaited<
      ReturnType<typeof getHomepageVideos>
    >["data"]
  >[number];

export type SocialStatItem =
  NonNullable<
    Awaited<
      ReturnType<typeof getSocialStats>
    >["data"]
  >[number];

export type InstagramPostItem =
  NonNullable<
    Awaited<
      ReturnType<typeof getInstagramPosts>
    >["data"]
  >[number];

export type TikTokVideoItem =
  NonNullable<
    Awaited<
      ReturnType<typeof getTikTokVideos>
    >["data"]
  >[number];

export type YouTubeVideoItem =
  NonNullable<
    Awaited<
      ReturnType<typeof getLatestYouTube>
    >["data"]
  >[number];

export type LatestPostItem =
  NonNullable<
    Awaited<
      ReturnType<typeof getLatestPosts>
    >["data"]
  >[number];