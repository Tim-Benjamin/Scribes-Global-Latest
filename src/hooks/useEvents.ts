import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getPublicEvents,
  type EventItem,
} from "../lib/supabase/queries/events";

/* =========================================================
   TYPES
========================================================= */

type EventsState = {
  events: EventItem[];
  loading: boolean;
  error: string | null;
};

/* =========================================================
   INITIAL STATE
========================================================= */

const INITIAL_STATE: EventsState = {
  events: [],
  loading: true,
  error: null,
};

/* =========================================================
   USE EVENTS
========================================================= */

export function useEvents() {
  const [state, setState] =
    useState<EventsState>(
      INITIAL_STATE,
    );

  const load =
    useCallback(
      async () => {
        setState(
          (current) => ({
            ...current,
            loading: true,
            error: null,
          }),
        );

        try {
          const {
            data,
            error,
          } =
            await getPublicEvents();

          if (error) {
            throw error;
          }

          setState({
            events: data ?? [],
            loading: false,
            error: null,
          });
        } catch (
          error
        ) {
          console.error(
            "[Events] Failed to load events:",
            error,
          );

          setState({
            events: [],
            loading: false,

            error:
              error instanceof
              Error
                ? error.message
                : "Unable to load events.",
          });
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    events: state.events,
    loading: state.loading,
    error: state.error,
    refetch: load,
  };
}

export default useEvents;