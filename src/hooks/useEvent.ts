import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getEventBySlug,
  type EventItem,
} from "../lib/supabase/queries/events";

/* =========================================================
   TYPES
========================================================= */

type EventState = {
  event: EventItem | null;
  loading: boolean;
  error: string | null;
};

/* =========================================================
   USE EVENT
========================================================= */

export function useEvent(
  slug?: string,
) {
  const [state, setState] =
    useState<EventState>({
      event: null,
      loading: true,
      error: null,
    });

  const load =
    useCallback(
      async () => {
        /* -----------------------------------------------
           NO SLUG
        ----------------------------------------------- */

        if (!slug) {
          setState({
            event: null,
            loading: false,
            error:
              "No event was specified.",
          });

          return;
        }

        /* -----------------------------------------------
           BEGIN REQUEST
        ----------------------------------------------- */

        setState({
          event: null,
          loading: true,
          error: null,
        });

        try {
          const {
            data,
            error,
          } =
            await getEventBySlug(
              slug,
            );

          if (error) {
            throw error;
          }

          /* ---------------------------------------------
             SUCCESS / NOT FOUND

             data can legitimately be null because
             maybeSingle() is used.
          --------------------------------------------- */

          setState({
            event: data ?? null,
            loading: false,
            error: null,
          });
        } catch (
          error
        ) {
          console.error(
            "[EventDetail] Failed to load event:",
            error,
          );

          setState({
            event: null,
            loading: false,

            error:
              error instanceof
              Error
                ? error.message
                : "Unable to load this event.",
          });
        }
      },
      [slug],
    );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    event: state.event,
    loading: state.loading,
    error: state.error,
    refetch: load,
  };
}

export default useEvent;