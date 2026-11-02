import { supabase } from "./client";

export type Bucket =
  | "chapter-media"
  | "event-media"
  | "blog-media"
  | "general-media"
  | "avatars"
  | "press-kit";

/**
 * Turns a stored filename/storage path into a public URL.
 * Returns null for empty values.
 */
export function storageUrl(
  bucket: Bucket,
  path?: string | null,
): string | null {
  if (!path || !path.trim()) return null;

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return supabase.storage
    .from(bucket)
    .getPublicUrl(path).data.publicUrl;
}