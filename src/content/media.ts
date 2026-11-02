/**
 * Media page copy — preserved verbatim from the previous Media.tsx.
 * The old markup set the big headings in literal capitals
 * ("STORIES WORTH SHARING.", "PRESS PLAY." …); the words are kept
 * exactly and the hero still renders in capitals via the type style.
 * Old section numbers ("01", "02", …) were ornament and are dropped.
 */

export const MEDIA_HERO = {
  brand: "Scribes Global",
  tagline: "Watch · Listen · Read · Experience",
  kicker: "Media",
  /** "\n" = line break in the kinetic title */
  title: "Stories\nworth\nsharing.",
  intro:
    "Poetry, worship, spoken word, testimonies, photographs and moments from the Scribes Global community.",
};

export const MEDIA_STATES = {
  loadingLabel: "Loading media",
  errorKicker: "Connection issue",
  errorTitle: "Media couldn't be loaded.",
  retry: "Try again",
  emptyKicker: "Media archive",
  emptyTitle: "New stories are coming.",
  emptyCopy: "There is currently no public media available.",
};

export const MEDIA_FEATURED = {
  kicker: "Featured",
  title: "Press play.",
  label: "Featured Film",
  fallbackTitle: "Scribes Global",
  fallbackAlt: "Featured Scribes Global video",
  cta: "Watch",
};

export const MEDIA_YOUTUBE = {
  kicker: "YouTube",
  title: "Watch the archive.",
  tag: "YouTube",
  views: "views",
  likes: "likes",
};

export const MEDIA_ARCHIVE = {
  kicker: "Archive",
  title: "Creative expressions.",
  all: "All",
  /** Filter order; only types present in the data are shown. */
  types: ["image", "video", "audio", "written"] as const,
  videoTag: "Video",
  featured: "Featured",
  views: "views",
};

export const MEDIA_SOCIAL = {
  kicker: "Community",
  title: "Follow the movement.",
  instagram: "Instagram",
  instagramFallback: (slot: number) => `Post ${slot}`,
  tiktok: "TikTok",
  tiktokLabel: (slot: number) => `Featured video ${slot}`,
};

export const MEDIA_MODAL = {
  videoTitle: "Scribes Global video",
};
