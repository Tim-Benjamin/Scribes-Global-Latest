import { supabase } from "../client";

/* =========================================================
   TYPES

   blog_posts_public is a view over blog_posts that already
   filters to status = 'published' server-side, so every read
   here is safe for anonymous visitors.
========================================================= */

export type PublicBlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  gallery: unknown;
  category: string | null;
  tags: string | null;
  published_at: string | null;
  reading_time: number | null;
  author_name: string | null;
  author_photo: string | null;
  views: number | null;
  likes: number | null;
};

/* =========================================================
   READS
========================================================= */

export async function getPublicBlogPosts() {
  return supabase
    .from("blog_posts_public")
    .select(
      "id, title, slug, excerpt, featured_image, category, published_at, reading_time, author_name"
    )
    .order("published_at", { ascending: false });
}

export async function getBlogPostBySlug(slug: string) {
  return supabase.from("blog_posts_public").select("*").eq("slug", slug).maybeSingle();
}

export function formatBlogDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
