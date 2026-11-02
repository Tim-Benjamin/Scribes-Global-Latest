import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getMediaContent,
  getMediaFeaturedVideo,
  getMediaHashtags,
  getMediaInstagramPosts,
  getMediaSocialStats,
  getMediaTikTokPosts,
  getMediaYouTubeVideos,
  type InstagramPost,
  type MediaContent,
  type MediaFeaturedVideo,
  type MediaHashtag,
  type SocialStat,
  type TikTokPost,
  type YouTubeCachedVideo,
} from "../lib/supabase/queries/media";

type MediaPageState = {
  media: MediaContent[];
  featuredVideo: MediaFeaturedVideo | null;
  hashtags: MediaHashtag[];
  youtube: YouTubeCachedVideo[];
  instagram: InstagramPost[];
  tiktok: TikTokPost[];
  stats: SocialStat[];

  loading: boolean;
  error: string | null;
};

const INITIAL_STATE: MediaPageState = {
  media: [],
  featuredVideo: null,
  hashtags: [],
  youtube: [],
  instagram: [],
  tiktok: [],
  stats: [],

  loading: true,
  error: null,
};

export function useMediaPage() {
  const [state, setState] =
    useState<MediaPageState>(
      INITIAL_STATE,
    );

  const load =
    useCallback(
      async () => {
        setState(
          (current) => ({
            ...current,
            loading: true,
            error: null,
          }),
        );

        try {
          const results =
            await Promise.allSettled([
              getMediaContent(),
              getMediaFeaturedVideo(),
              getMediaHashtags(),
              getMediaYouTubeVideos(),
              getMediaInstagramPosts(),
              getMediaTikTokPosts(),
              getMediaSocialStats(),
            ]);

          const [
            mediaResult,
            featuredResult,
            hashtagResult,
            youtubeResult,
            instagramResult,
            tiktokResult,
            statsResult,
          ] = results;

          const failures: string[] = [];

          let media: MediaContent[] = [];
          let featuredVideo:
            MediaFeaturedVideo | null =
            null;
          let hashtags:
            MediaHashtag[] = [];
          let youtube:
            YouTubeCachedVideo[] = [];
          let instagram:
            InstagramPost[] = [];
          let tiktok:
            TikTokPost[] = [];
          let stats:
            SocialStat[] = [];

          /* MEDIA */

          if (
            mediaResult.status ===
            "fulfilled"
          ) {
            if (
              mediaResult.value.error
            ) {
              failures.push(
                mediaResult.value.error.message,
              );
            } else {
              media =
                mediaResult.value.data ??
                [];
            }
          } else {
            failures.push(
              "Media content failed.",
            );
          }

          /* FEATURED VIDEO */

          if (
            featuredResult.status ===
            "fulfilled"
          ) {
            if (
              featuredResult.value.error
            ) {
              failures.push(
                featuredResult.value.error.message,
              );
            } else {
              featuredVideo =
                featuredResult.value.data ??
                null;
            }
          }

          /* HASHTAGS */

          if (
            hashtagResult.status ===
            "fulfilled"
          ) {
            if (
              hashtagResult.value.error
            ) {
              failures.push(
                hashtagResult.value.error.message,
              );
            } else {
              hashtags =
                hashtagResult.value.data ??
                [];
            }
          }

          /* YOUTUBE */

          if (
            youtubeResult.status ===
            "fulfilled"
          ) {
            if (
              youtubeResult.value.error
            ) {
              failures.push(
                youtubeResult.value.error.message,
              );
            } else {
              youtube =
                youtubeResult.value.data ??
                [];
            }
          }

          /* INSTAGRAM */

          if (
            instagramResult.status ===
            "fulfilled"
          ) {
            if (
              instagramResult.value.error
            ) {
              failures.push(
                instagramResult.value.error.message,
              );
            } else {
              instagram =
                instagramResult.value.data;
            }
          }

          /* TIKTOK */

          if (
            tiktokResult.status ===
            "fulfilled"
          ) {
            if (
              tiktokResult.value.error
            ) {
              failures.push(
                tiktokResult.value.error.message,
              );
            } else {
              tiktok =
                tiktokResult.value.data;
            }
          }

          /* STATS */

          if (
            statsResult.status ===
            "fulfilled"
          ) {
            if (
              statsResult.value.error
            ) {
              failures.push(
                statsResult.value.error.message,
              );
            } else {
              stats =
                statsResult.value.data;
            }
          }

          const hasAnyData =
            media.length > 0 ||
            featuredVideo !== null ||
            hashtags.length > 0 ||
            youtube.length > 0 ||
            instagram.length > 0 ||
            tiktok.length > 0 ||
            stats.length > 0;

          setState({
            media,
            featuredVideo,
            hashtags,
            youtube,
            instagram,
            tiktok,
            stats,

            loading: false,

            error:
              !hasAnyData &&
              failures.length > 0
                ? failures[0]
                : null,
          });
        } catch (
          error
        ) {
          console.error(
            "[Media] Failed:",
            error,
          );

          setState({
            ...INITIAL_STATE,

            loading: false,

            error:
              error instanceof
              Error
                ? error.message
                : "Unable to load media.",
          });
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    ...state,
    refetch: load,
  };
}