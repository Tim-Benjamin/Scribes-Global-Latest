import type { ActiveChapterItem } from "../../lib/supabase/queries/chapters";
import { storageUrl } from "../../lib/supabase/storage";

/** Hero picture, falling back through the legacy image columns. */
export function chapterHero(chapter: ActiveChapterItem) {
  return storageUrl("chapter-media", chapter.hero_image ?? chapter.chapter_image ?? chapter.image);
}

/** Logo, falling back through the legacy logo columns. */
export function chapterLogo(chapter: ActiveChapterItem) {
  return storageUrl("chapter-media", chapter.chapter_logo ?? chapter.logo_image ?? chapter.logo_path);
}

export function toCoord(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Leaflet popups take HTML strings — never trust row text inside them. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
