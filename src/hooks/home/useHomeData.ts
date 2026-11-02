import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getFeaturedEvents,
  getHomepageVideos,
  getInstagramPosts,
  getLatestPosts,
  getLatestYouTube,
  getSiteSettings,
  getSocialStats,
  getTikTokVideos,
} from "../../lib/supabase/queries";

/* =========================================================
   TYPES
========================================================= */

type SectionState<T> = {
  data: T;
  loading: boolean;
  error: Error | null;
};

type FeaturedEventsData = NonNullable<
  Awaited<
    ReturnType<typeof getFeaturedEvents>
  >["data"]
>;

type HomepageVideosData = NonNullable<
  Awaited<
    ReturnType<typeof getHomepageVideos>
  >["data"]
>;

type SocialStatsData = NonNullable<
  Awaited<
    ReturnType<typeof getSocialStats>
  >["data"]
>;

type InstagramPostsData = NonNullable<
  Awaited<
    ReturnType<typeof getInstagramPosts>
  >["data"]
>;

type TikTokVideosData = NonNullable<
  Awaited<
    ReturnType<typeof getTikTokVideos>
  >["data"]
>;

type YouTubeVideosData = NonNullable<
  Awaited<
    ReturnType<typeof getLatestYouTube>
  >["data"]
>;

type LatestPostsData = NonNullable<
  Awaited<
    ReturnType<typeof getLatestPosts>
  >["data"]
>;

type SiteSettingsData = Awaited<
  ReturnType<typeof getSiteSettings>
>["data"];

/* =========================================================
   HELPERS
========================================================= */

function createSectionState<T>(
  initialData: T,
): SectionState<T> {
  return {
    data: initialData,
    loading: true,
    error: null,
  };
}

function toError(
  error: { message: string } | null,
): Error | null {
  if (!error) {
    return null;
  }

  return new Error(error.message);
}

/* =========================================================
   HOOK
========================================================= */

export function useHomeData() {
  const [events, setEvents] =
    useState<SectionState<FeaturedEventsData>>(
      () => createSectionState([]),
    );

  const [videos, setVideos] =
    useState<SectionState<HomepageVideosData>>(
      () => createSectionState([]),
    );

  const [socialStats, setSocialStats] =
    useState<SectionState<SocialStatsData>>(
      () => createSectionState([]),
    );

  const [instagram, setInstagram] =
    useState<SectionState<InstagramPostsData>>(
      () => createSectionState([]),
    );

  const [tiktok, setTikTok] =
    useState<SectionState<TikTokVideosData>>(
      () => createSectionState([]),
    );

  const [youtube, setYouTube] =
    useState<SectionState<YouTubeVideosData>>(
      () => createSectionState([]),
    );

  const [posts, setPosts] =
    useState<SectionState<LatestPostsData>>(
      () => createSectionState([]),
    );

  const [settings, setSettings] =
    useState<SectionState<SiteSettingsData>>(
      () => createSectionState(null),
    );

  /* =======================================================
     EVENTS
  ======================================================= */

  const loadEvents = useCallback(async () => {
    setEvents((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    try {
      const { data, error } =
        await getFeaturedEvents();

      if (error) {
        setEvents({
          data: [],
          loading: false,
          error: toError(error),
        });

        return;
      }

      setEvents({
        data: data ?? [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setEvents({
        data: [],
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error(
                "Unable to load featured events.",
              ),
      });
    }
  }, []);

  /* =======================================================
     HOMEPAGE VIDEOS
  ======================================================= */

  const loadVideos = useCallback(async () => {
    setVideos((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    try {
      const { data, error } =
        await getHomepageVideos();

      if (error) {
        setVideos({
          data: [],
          loading: false,
          error: toError(error),
        });

        return;
      }

      setVideos({
        data: data ?? [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setVideos({
        data: [],
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error(
                "Unable to load homepage videos.",
              ),
      });
    }
  }, []);

  /* =======================================================
     SOCIAL STATS
  ======================================================= */

  const loadSocialStats =
    useCallback(async () => {
      setSocialStats((current) => ({
        ...current,
        loading: true,
        error: null,
      }));

      try {
        const { data, error } =
          await getSocialStats();

        if (error) {
          setSocialStats({
            data: [],
            loading: false,
            error: toError(error),
          });

          return;
        }

        setSocialStats({
          data: data ?? [],
          loading: false,
          error: null,
        });
      } catch (error) {
        setSocialStats({
          data: [],
          loading: false,
          error:
            error instanceof Error
              ? error
              : new Error(
                  "Unable to load social statistics.",
                ),
        });
      }
    }, []);

  /* =======================================================
     INSTAGRAM
  ======================================================= */

  const loadInstagram =
    useCallback(async () => {
      setInstagram((current) => ({
        ...current,
        loading: true,
        error: null,
      }));

      try {
        const { data, error } =
          await getInstagramPosts();

        if (error) {
          setInstagram({
            data: [],
            loading: false,
            error: toError(error),
          });

          return;
        }

        const filtered =
          (data ?? []).filter((post) => {
            return Boolean(
              post.post_url?.trim(),
            );
          });

        setInstagram({
          data: filtered,
          loading: false,
          error: null,
        });
      } catch (error) {
        setInstagram({
          data: [],
          loading: false,
          error:
            error instanceof Error
              ? error
              : new Error(
                  "Unable to load Instagram posts.",
                ),
        });
      }
    }, []);

  /* =======================================================
     TIKTOK
  ======================================================= */

  const loadTikTok = useCallback(async () => {
    setTikTok((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    try {
      const { data, error } =
        await getTikTokVideos();

      if (error) {
        setTikTok({
          data: [],
          loading: false,
          error: toError(error),
        });

        return;
      }

      const filtered =
        (data ?? []).filter((video) => {
          return Boolean(
            video.video_url?.trim(),
          );
        });

      setTikTok({
        data: filtered,
        loading: false,
        error: null,
      });
    } catch (error) {
      setTikTok({
        data: [],
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error(
                "Unable to load TikTok videos.",
              ),
      });
    }
  }, []);

  /* =======================================================
     YOUTUBE
  ======================================================= */

  const loadYouTube =
    useCallback(async () => {
      setYouTube((current) => ({
        ...current,
        loading: true,
        error: null,
      }));

      try {
        const { data, error } =
          await getLatestYouTube(6);

        if (error) {
          setYouTube({
            data: [],
            loading: false,
            error: toError(error),
          });

          return;
        }

        setYouTube({
          data: data ?? [],
          loading: false,
          error: null,
        });
      } catch (error) {
        setYouTube({
          data: [],
          loading: false,
          error:
            error instanceof Error
              ? error
              : new Error(
                  "Unable to load YouTube videos.",
                ),
        });
      }
    }, []);

  /* =======================================================
     BLOG POSTS
  ======================================================= */

  const loadPosts = useCallback(async () => {
    setPosts((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    try {
      const { data, error } =
        await getLatestPosts(3);

      if (error) {
        setPosts({
          data: [],
          loading: false,
          error: toError(error),
        });

        return;
      }

      setPosts({
        data: data ?? [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setPosts({
        data: [],
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error(
                "Unable to load latest stories.",
              ),
      });
    }
  }, []);

  /* =======================================================
     SITE SETTINGS
  ======================================================= */

  const loadSettings =
    useCallback(async () => {
      setSettings((current) => ({
        ...current,
        loading: true,
        error: null,
      }));

      try {
        const { data, error } =
          await getSiteSettings();

        if (error) {
          setSettings({
            data: null,
            loading: false,
            error: toError(error),
          });

          return;
        }

        setSettings({
          data: data ?? null,
          loading: false,
          error: null,
        });
      } catch (error) {
        setSettings({
          data: null,
          loading: false,
          error:
            error instanceof Error
              ? error
              : new Error(
                  "Unable to load site settings.",
                ),
        });
      }
    }, []);

  /* =======================================================
     LOAD EVERYTHING
  ======================================================= */

  const loadAll = useCallback(() => {
    void Promise.allSettled([
      loadEvents(),
      loadVideos(),
      loadSocialStats(),
      loadInstagram(),
      loadTikTok(),
      loadYouTube(),
      loadPosts(),
      loadSettings(),
    ]);
  }, [
    loadEvents,
    loadVideos,
    loadSocialStats,
    loadInstagram,
    loadTikTok,
    loadYouTube,
    loadPosts,
    loadSettings,
  ]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    events: {
      ...events,
      refetch: loadEvents,
    },

    videos: {
      ...videos,
      refetch: loadVideos,
    },

    socialStats: {
      ...socialStats,
      refetch: loadSocialStats,
    },

    instagram: {
      ...instagram,
      refetch: loadInstagram,
    },

    tiktok: {
      ...tiktok,
      refetch: loadTikTok,
    },

    youtube: {
      ...youtube,
      refetch: loadYouTube,
    },

    posts: {
      ...posts,
      refetch: loadPosts,
    },

    settings: {
      ...settings,
      refetch: loadSettings,
    },

    refetchAll: loadAll,
  };
}