import { supabase } from "../client";

import type {
  Database,
} from "../database.types";

/* =========================================================
   TYPES
========================================================= */

export type EventRow =
  Database["public"]["Tables"]["events"]["Row"];

export type EventItem =
  EventRow;

export type EventDisplayStatus =
  | "upcoming"
  | "ongoing"
  | "past"
  | "cancelled";

/* =========================================================
   READS
========================================================= */

/**
 * Public events listing.
 *
 * We deliberately do not filter only `status = upcoming`
 * here because an admin may not yet have updated an event's
 * status after its date passes.
 *
 * The UI derives upcoming / ongoing / past from the actual
 * dates while still respecting `cancelled`.
 */
export async function getPublicEvents() {
  return supabase
    .from("events")
    .select("*")
    .is(
      "archived_at",
      null,
    )
    .order(
      "start_date",
      {
        ascending: true,
      },
    );
}

/* =========================================================
   FEATURED EVENTS
========================================================= */

export async function getFeaturedEvents(
  limit = 4,
) {
  return supabase
    .from("events")
    .select("*")
    .eq(
      "featured",
      true,
    )
    .is(
      "archived_at",
      null,
    )
    .order(
      "start_date",
      {
        ascending: true,
      },
    )
    .limit(limit);
}

/* =========================================================
   SINGLE EVENT
========================================================= */

export async function getEventBySlug(
  slug: string,
) {
  return supabase
    .from("events")
    .select("*")
    .eq(
      "slug",
      slug,
    )
    .is(
      "archived_at",
      null,
    )
    .maybeSingle();
}

/* =========================================================
   EVENT STATUS
========================================================= */

export function getEventDisplayStatus(
  event: EventItem,
  now = new Date(),
): EventDisplayStatus {
  if (
    event.status ===
    "cancelled"
  ) {
    return "cancelled";
  }

  const start =
    new Date(
      event.start_date,
    );

  const end =
    event.end_date
      ? new Date(
          event.end_date,
        )
      : null;

  if (
    end &&
    now >= start &&
    now <= end
  ) {
    return "ongoing";
  }

  /*
   * If there is no end date,
   * allow the event to be considered ongoing
   * for up to four hours after start.
   */
  if (!end) {
    const assumedEnd =
      new Date(
        start.getTime() +
          4 *
            60 *
            60 *
            1000,
      );

    if (
      now >= start &&
      now <= assumedEnd
    ) {
      return "ongoing";
    }
  }

  if (
    now < start
  ) {
    return "upcoming";
  }

  return "past";
}

/* =========================================================
   DATE HELPERS
========================================================= */

const ACCRA_TIMEZONE =
  "Africa/Accra";

export function formatEventDate(
  value: string,
) {
  const date =
    new Date(value);

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone:
        ACCRA_TIMEZONE,
    },
  ).format(date);
}

export function formatEventDay(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      timeZone:
        ACCRA_TIMEZONE,
    },
  ).format(
    new Date(value),
  );
}

export function formatEventMonth(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      month: "short",
      timeZone:
        ACCRA_TIMEZONE,
    },
  )
    .format(
      new Date(value),
    )
    .toUpperCase();
}

export function formatEventTime(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GH",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone:
        ACCRA_TIMEZONE,
    },
  ).format(
    new Date(value),
  );
}

/* =========================================================
   REGISTRATION
========================================================= */

export function isEventRegistrationFull(
  event: EventItem,
) {
  if (
    event.registration_limit ===
      null ||
    event.registration_limit ===
      undefined
  ) {
    return false;
  }

  return (
    (event.registration_count ??
      0) >=
    event.registration_limit
  );
}

export function getEventCapacityLeft(
  event: EventItem,
) {
  if (
    event.registration_limit ===
      null ||
    event.registration_limit ===
      undefined
  ) {
    return null;
  }

  return Math.max(
    event.registration_limit -
      (event.registration_count ??
        0),
    0,
  );
}