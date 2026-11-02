import { ApiError } from "./response.ts";

/**
 * A handful of DB triggers (check_event_registration, check_event_rsvp, the
 * interaction-mode guard, ...) raise a plain, already-friendly exception
 * message as the last line of defense — mostly for race conditions a
 * pre-check in the function already caught, like an event filling up between
 * the read and the insert. Surface those verbatim as 400s instead of
 * swallowing them into a generic 500.
 */
const KNOWN_TRIGGER_MESSAGES = [
  "Registration is closed for this event",
  "Registration is not enabled for this event",
  "This event has already ended",
  "This event is full",
  "Event not found",
  "RSVP is closed for this event",
  "RSVP is not enabled for this event",
  "This feature is currently disabled",
  "Sign-in is required for this feature",
];

export function rethrowFriendly(err: unknown): never {
  const message = err instanceof Error ? err.message : String(err);
  const known = KNOWN_TRIGGER_MESSAGES.find((m) => message.includes(m));
  if (known) {
    throw new ApiError("bad_request", known);
  }
  throw err;
}
