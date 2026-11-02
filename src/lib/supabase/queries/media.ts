import { supabase } from "../client";
import type { Database } from "../database.types";

/* =========================================================
   TYPES
========================================================= */

export type MediaContent =
  Database["public"]["Tables"]["media_content"]["Row"];

export type MediaFeaturedVideo =
  Database["public"]["Tables"]["media_featured_video"]["Row"];

export type MediaHashtag =
  Database["public"]["Tables"]["media_hashtags"]["Row"];

export type YouTubeCachedVideo =
  Database["public"]["Tables"]["youtube_videos_cache"]["Row"];

export type InstagramPost =
  Database["public"]["Tables"]["instagram_manual_posts"]["Row"];

export type TikTokPost =
  Database["public"]["Tables"]["tiktok_featured"]["Row"];

export type SocialStat =
  Database["public"]["Tables"]["social_media_stats"]["Row"];

/* =========================================================
   MEDIA CONTENT
========================================================= */

export async function getMediaContent() {
  return supabase
    .from("media_content")
    .select("*")
    .eq("status", "approved")
    .order("featured", {
      ascending: false,
    })
    .order("display_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });
}

/* =========================================================
   FEATURED VIDEO
========================================================= */

export async function getMediaFeaturedVideo() {
  return supabase
    .from("media_featured_video")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();
}

/* =========================================================
   HASHTAGS
========================================================= */

export async function getMediaHashtags() {
  return supabase
    .from("media_hashtags")
    .select("*")
    .order("id", {
      ascending: true,
    });
}

/* =========================================================
   YOUTUBE
========================================================= */

export async function getMediaYouTubeVideos(
  limit = 12,
) {
  return supabase
    .from("youtube_videos_cache")
    .select("*")
    .order("published_at", {
      ascending: false,
    })
    .limit(limit);
}

/* =========================================================
   INSTAGRAM
========================================================= */

export async function getMediaInstagramPosts() {
  const {
    data,
    error,
  } =
    await supabase
      .from("instagram_manual_posts")
      .select("*")
      .order("slot", {
        ascending: true,
      });

  return {
    data:
      data?.filter(
        (post) =>
          Boolean(
            post.post_url?.trim(),
          ),
      ) ?? [],

    error,
  };
}

/* =========================================================
   TIKTOK
========================================================= */

export async function getMediaTikTokPosts() {
  const {
    data,
    error,
  } =
    await supabase
      .from("tiktok_featured")
      .select("*")
      .order("slot", {
        ascending: true,
      });

  return {
    data:
      data?.filter(
        (post) =>
          Boolean(
            post.video_url?.trim(),
          ),
      ) ?? [],

    error,
  };
}

/* =========================================================
   SOCIAL STATS
========================================================= */

export async function getMediaSocialStats() {
  const {
    data,
    error,
  } =
    await supabase
      .from("social_media_stats")
      .select("*")
      .order("follower_count", {
        ascending: false,
      });

  return {
    data:
      data?.filter(
        (stat) =>
          (stat.follower_count ??
            0) > 0,
      ) ?? [],

    error,
  };
}