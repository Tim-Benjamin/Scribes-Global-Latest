import {
  getEventDisplayStatus,
  isEventRegistrationFull,
  type EventItem,
} from "../supabase/queries/events";

/** Same availability rules as before: nothing for past/cancelled events. */
export function getEventActions(event: EventItem) {
  const status = getEventDisplayStatus(event);
  const registrationFull = isEventRegistrationFull(event);
  const eventEnded = status === "past" || status === "cancelled";
  const registrationAvailable = !eventEnded && Boolean(event.registration_enabled) && !registrationFull;
  const rsvpAvailable = !eventEnded && Boolean(event.rsvp_enabled);
  const showFull = !eventEnded && Boolean(event.registration_enabled) && registrationFull;
  const virtualLink =
    (event.event_type === "virtual" || event.event_type === "hybrid") && event.virtual_link ? event.virtual_link : null;
  return {
    registrationAvailable,
    rsvpAvailable,
    showFull,
    virtualLink,
    hasActions: registrationAvailable || rsvpAvailable,
    hasAnything: registrationAvailable || rsvpAvailable || Boolean(virtualLink),
  };
}

