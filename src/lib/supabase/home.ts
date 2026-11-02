import type {
  HomepageVideoItem,
} from "./queries";

import { storageUrl } from "./storage";

export interface HomepageVideoGroup {
  title: string;
  videos: HomepageVideoItem[];
}

export interface HeroVideoSettings {
  videoUrl: string | null;
  posterUrl: string | null;
}

/**
 * `get_site_settings()` returns every row of the `site_settings` table
 * collapsed into a single JSON object (`{ key: value }`). This reads the
 * two hero-video keys out of that blob and resolves them to public
 * Storage URLs via `storageUrl`, tolerating:
 *   - the settings payload being null/loading,
 *   - the keys being absent (no video configured yet — safe fallback),
 *   - a value already being an absolute URL (passed through untouched).
 */
export function getHeroVideoSettings(
  settings: unknown,
): HeroVideoSettings {
  const record =
    settings &&
    typeof settings === "object" &&
    !Array.isArray(settings)
      ? (settings as Record<string, unknown>)
      : null;

  const readKey = (key: string) => {
    const raw = record?.[key];
    return typeof raw === "string" && raw.trim()
      ? raw.trim()
      : null;
  };

  const videoPath = readKey("hero_video_url");
  const posterPath = readKey("hero_video_poster");

  return {
    videoUrl: storageUrl("general-media", videoPath),
    posterUrl: storageUrl("general-media", posterPath),
  };
}

export function groupHomepageVideos(
  videos: HomepageVideoItem[],
): HomepageVideoGroup[] {
  const groups =
    new Map<
      string,
      HomepageVideoItem[]
    >();

  for (const video of videos) {
    const title =
      video.row_title?.trim() ||
      "Featured Videos";

    const current =
      groups.get(title) ?? [];

    current.push(video);

    groups.set(
      title,
      current,
    );
  }

  return Array.from(
    groups.entries(),
  ).map(
    ([
      title,
      groupedVideos,
    ]) => ({
      title,
      videos: groupedVideos,
    }),
  );
}