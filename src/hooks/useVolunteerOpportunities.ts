import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getVolunteerOpportunities,
  type VolunteerOpportunity,
} from "../lib/supabase/queries/volunteer";

type VolunteerState = {
  opportunities:
    VolunteerOpportunity[];

  loading:
    boolean;

  error:
    string | null;
};

const INITIAL_STATE: VolunteerState = {
  opportunities: [],
  loading: true,
  error: null,
};

export function useVolunteerOpportunities() {
  const [
    state,
    setState,
  ] =
    useState<VolunteerState>(
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
            await getVolunteerOpportunities();

          if (error) {
            throw error;
          }

          setState({
            opportunities:
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
            "[Volunteer] Failed to load opportunities:",
            error,
          );

          setState({
            opportunities: [],

            loading:
              false,

            error:
              error instanceof
              Error
                ? error.message
                : "Unable to load volunteer opportunities.",
          });
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    opportunities:
      state.opportunities,

    loading:
      state.loading,

    error:
      state.error,

    refetch:
      load,
  };
}