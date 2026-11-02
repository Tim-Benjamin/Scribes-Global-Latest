import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getActiveChapters,
  type ActiveChapterItem,
} from "../lib/supabase/queries/chapters";

type ChaptersState = {
  data:
    ActiveChapterItem[];

  loading:
    boolean;

  error:
    string | null;
};

const INITIAL_STATE: ChaptersState =
  {
    data: [],
    loading: true,
    error: null,
  };

export function useChapters() {
  const [
    state,
    setState,
  ] =
    useState<ChaptersState>(
      INITIAL_STATE,
    );

  const load =
    useCallback(
      async () => {
        setState(
          (current) => ({
            ...current,

            loading:
              true,

            error:
              null,
          }),
        );

        try {
          const {
            data,
            error,
          } =
            await getActiveChapters();

          if (error) {
            throw error;
          }

          setState({
            data:
              data ?? [],

            loading:
              false,

            error:
              null,
          });
        } catch (
          error
        ) {
          console.error(
            "[Chapters] Failed to load chapters:",
            error,
          );

          setState({
            data: [],

            loading:
              false,

            error:
              error instanceof
              Error
                ? error.message
                : "Unable to load chapters.",
          });
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    chapters:
      state.data,

    loading:
      state.loading,

    error:
      state.error,

    refetch:
      load,
  };
}