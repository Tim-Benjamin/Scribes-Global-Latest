/** Grouping + labelling helpers for the public events pages. */
import {
  getEventDisplayStatus,
  isEventRegistrationFull,
  type EventDisplayStatus,
  type EventItem,
} from "../supabase/queries/events";

export type EventGroups = Record<EventDisplayStatus, EventItem[]>;

const byStart = (a: EventItem, b: EventItem) =>
  new Date(a.start_date).getTime() - new Date(b.start_date).getTime();

export function groupEvents(events: EventItem[], now = new Date()): EventGroups {
  const groups: EventGroups = { upcoming: [], ongoing: [], past: [], cancelled: [] };
  events.forEach((event) => groups[getEventDisplayStatus(event, now)].push(event));
  groups.upcoming.sort(byStart);
  groups.past.sort((a, b) => byStart(b, a));
  return groups;
}

/**
 * Featured priority (unchanged from the previous page):
 * 1. ongoing featured  2. upcoming featured (soonest)
 * 3. nearest ongoing   4. nearest upcoming
 */
export function pickFeaturedEvent(events: EventItem[], groups: EventGroups): EventItem | null {
  const featured = events.filter((event) => Boolean(event.featured));
  const activeFeatured = featured.find((event) => getEventDisplayStatus(event) === "ongoing");
  if (activeFeatured) return activeFeatured;
  const upcomingFeatured = featured
    .filter((event) => getEventDisplayStatus(event) === "upcoming")
    .sort(byStart)[0];
  if (upcomingFeatured) return upcomingFeatured;
  return groups.ongoing[0] ?? groups.upcoming[0] ?? null;
}

/** "ongoing" → "Ongoing", "spoken_word" → "Spoken word". */
export function sentenceLabel(value: string | null | undefined) {
  if (!value) return "";
  const text = value.replace(/[_-]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Footer label the old event card showed. */
export function cardActionLabel(
  event: EventItem,
  labels: { registrationFull: string; registrationOpen: string; rsvpAvailable: string; viewEvent: string },
) {
  if (event.registration_enabled) {
    return isEventRegistrationFull(event) ? labels.registrationFull : labels.registrationOpen;
  }
  return event.rsvp_enabled ? labels.rsvpAvailable : labels.viewEvent;
}
