import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getChapterBySlug,
  type ActiveChapterItem,
} from "../lib/supabase/queries/chapters";

type ChapterState = {
  chapter:
    ActiveChapterItem | null;

  loading:
    boolean;

  error:
    string | null;
};

export function useChapter(
  slug?: string,
) {
  const [
    state,
    setState,
  ] =
    useState<ChapterState>({
      chapter: null,
      loading: true,
      error: null,
    });

  const load =
    useCallback(
      async () => {
        if (!slug) {
          setState({
            chapter: null,
            loading: false,
            error:
              "No chapter was specified.",
          });

          return;
        }

        setState({
          chapter: null,
          loading: true,
          error: null,
        });

        try {
          const {
            data,
            error,
          } =
            await getChapterBySlug(
              slug,
            );

          if (error) {
            throw error;
          }

          setState({
            chapter: data,
            loading: false,
            error: null,
          });
        } catch (
          error
        ) {
          console.error(
            "[Chapter] Failed to load chapter:",
            error,
          );

          setState({
            chapter: null,
            loading: false,

            error:
              error instanceof
              Error
                ? error.message
                : "Unable to load this chapter.",
          });
        }
      },
      [slug],
    );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    ...state,
    refetch: load,
  };
}