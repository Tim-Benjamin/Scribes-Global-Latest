import { useCallback, useEffect, useState } from "react";
import { getPublicBlogPosts } from "../lib/supabase/queries/blog";

type BlogPostSummary = Awaited<ReturnType<typeof getPublicBlogPosts>>["data"];

type BlogPostsState = {
  posts: NonNullable<BlogPostSummary>;
  loading: boolean;
  error: string | null;
};

export function useBlogPosts() {
  const [state, setState] = useState<BlogPostsState>({
    posts: [],
    loading: true,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!cancelled) setState((current) => ({ ...current, loading: true, error: null }));

      try {
        const { data, error } = await getPublicBlogPosts();
        if (cancelled) return;
        if (error) throw error;
        setState({ posts: data ?? [], loading: false, error: null });
      } catch (error) {
        if (cancelled) return;
        console.error("[Blog] Failed to load posts:", error);
        setState({
          posts: [],
          loading: false,
          error: error instanceof Error ? error.message : "Unable to load blog posts.",
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refetch = useCallback(() => {
    setReloadToken((n) => n + 1);
  }, []);

  return { posts: state.posts, loading: state.loading, error: state.error, refetch };
}

export default useBlogPosts;
