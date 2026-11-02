/** Shared date + availability helpers for event cards across the site. */

export interface EventDateParts {
  day: string;
  month: string;
  year: string;
  weekday: string;
  time: string | null;
}

export function eventDateParts(startDate: string, endDate?: string | null): EventDateParts {
  const start = new Date(startDate);
  const fmt = (opts: Intl.DateTimeFormatOptions, d = start) => new Intl.DateTimeFormat("en", opts).format(d);
  let day = fmt({ day: "2-digit" });
  if (endDate) {
    const end = new Date(endDate);
    if (start.toDateString() !== end.toDateString() && start.getMonth() === end.getMonth()) {
      day = `${day}–${fmt({ day: "2-digit" }, end)}`;
    }
  }
  const hasTime = !/T00:00(:00)?/.test(startDate) && startDate.includes("T");
  return {
    day,
    month: fmt({ month: "short" }),
    year: fmt({ year: "numeric" }),
    weekday: fmt({ weekday: "long" }),
    time: hasTime ? fmt({ hour: "numeric", minute: "2-digit" }) : null,
  };
}

export function formatEventRange(startDate: string, endDate?: string | null) {
  const start = new Date(startDate);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (!endDate) return new Intl.DateTimeFormat("en", opts).format(start);
  const end = new Date(endDate);
  if (start.toDateString() === end.toDateString()) return new Intl.DateTimeFormat("en", opts).format(start);
  return `${new Intl.DateTimeFormat("en", { day: "numeric", month: "short" }).format(start)} – ${new Intl.DateTimeFormat("en", opts).format(end)}`;
}

interface AvailabilityInput {
  registration_enabled?: boolean | null;
  rsvp_enabled?: boolean | null;
  registration_limit?: number | null;
  registration_count?: number | null;
}

export function availabilityLabel(event: AvailabilityInput) {
  if (!event.registration_enabled && !event.rsvp_enabled) return null;
  if (event.registration_enabled && event.registration_limit) {
    const remaining = event.registration_limit - (event.registration_count ?? 0);
    if (remaining <= 0) return "Registration full";
    if (remaining <= 5) return `${remaining} place${remaining === 1 ? "" : "s"} remaining`;
  }
  if (event.registration_enabled) return "Registration open";
  if (event.rsvp_enabled) return "RSVP available";
  return null;
}

export function formatShortDate(value: string | null | undefined) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}
