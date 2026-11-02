import { useCallback, useEffect, useState } from "react";
import { getBlogPostBySlug, type PublicBlogPost } from "../lib/supabase/queries/blog";

type BlogPostState = {
  post: PublicBlogPost | null;
  loading: boolean;
  error: string | null;
};

export function useBlogPost(slug?: string) {
  const [state, setState] = useState<BlogPostState>({
    post: null,
    loading: true,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!slug) {
        if (!cancelled) setState({ post: null, loading: false, error: "No post was specified." });
        return;
      }

      if (!cancelled) setState({ post: null, loading: true, error: null });

      try {
        const { data, error } = await getBlogPostBySlug(slug);
        if (cancelled) return;
        if (error) throw error;
        setState({ post: (data as PublicBlogPost | null) ?? null, loading: false, error: null });
      } catch (error) {
        if (cancelled) return;
        console.error("[BlogPost] Failed to load post:", error);
        setState({
          post: null,
          loading: false,
          error: error instanceof Error ? error.message : "Unable to load this post.",
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, reloadToken]);

  const refetch = useCallback(() => {
    setReloadToken((n) => n + 1);
  }, []);

  return { post: state.post, loading: state.loading, error: state.error, refetch };
}

export default useBlogPost;
