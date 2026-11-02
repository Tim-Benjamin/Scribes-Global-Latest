import { supabase } from "../client";
import type { Database } from "../database.types";

/* =========================================================
   TYPES
========================================================= */

export type ChapterRow =
  Database["public"]["Tables"]["chapters"]["Row"];

export type ActiveChapterItem = ChapterRow;

/* =========================================================
   READS
========================================================= */

export async function getActiveChapters() {
  return supabase
    .from("chapters")
    .select("*")
    .eq("status", "active")
    .order("name", {
      ascending: true,
    });
}

export async function getChapterById(
  id: ChapterRow["id"],
) {
  return supabase
    .from("chapters")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();
}

/* =========================================================
   SLUG
========================================================= */

export function slugifyChapterName(
  value: string,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getChapterSlug(
  chapter: Pick<
    ChapterRow,
    "name"
  >,
) {
  return slugifyChapterName(
    chapter.name,
  );
}

/**
 * Legacy chapters do not require a slug column.
 * Resolve public URLs from their generated name slug.
 */
export async function getChapterBySlug(
  slug: string,
) {
  const {
    data,
    error,
  } =
    await getActiveChapters();

  if (error) {
    return {
      data: null,
      error,
    };
  }

  const chapter =
    (data ?? []).find(
      (item) =>
        getChapterSlug(
          item,
        ) === slug,
    ) ?? null;

  return {
    data: chapter,
    error: null,
  };
}