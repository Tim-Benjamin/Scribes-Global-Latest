import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export type InteractionMode = "anonymous" | "members_only" | "hidden";

/** Reads one site_settings switch (likes_mode / comments_mode / prayer_mode). */
export async function getMode(db: SupabaseClient, key: string): Promise<InteractionMode> {
  const { data, error } = await db
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return "anonymous";
  return (data.value as InteractionMode) ?? "anonymous";
}
