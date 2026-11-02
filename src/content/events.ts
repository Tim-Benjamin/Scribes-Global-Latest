/**
 * Events (/events) and Event detail (/events/:slug) copy.
 * Preserved verbatim from the previous Events page, its
 * components (hero, featured, cards, states, CTA) and the
 * event-detail components (hero, overview, venue, gallery,
 * videos, action panel, forms, not-found, closing panel).
 * Nothing here is new ministry copy — only tiny UI labels
 * (marked "ui") were added.
 */

export const EVENTS_HERO = {
  brand: "Scribes Global",
  kicker: "Events",
  /** Previously "Gather · Worship · Create". */
  values: ["Gather", "Worship", "Create"],
  titleLines: ["Gather.", "Experience.", "Encounter."],
  intro: "Spaces where faith, creativity, worship and community come together.",
  statUpcoming: "Upcoming",
  statTotal: "Events",
  scrollCue: "Explore gatherings",
};

export const EVENTS_FEATURED = {
  kicker: "Featured Event",
  title: "Next\nexperience.",
  badge: "Featured",
  view: "View event",
  labels: {
    date: "Date",
    time: "Time",
    location: "Location",
    experience: "Experience",
  },
};

export const EVENTS_EXPLORER = {
  kicker: "Event Archive",
  title: "All\ngatherings.",
  browse: "Browse",
  event: "event",
  events: "events",
  filterLabel: "Filter events",
  filters: {
    all: "All",
    upcoming: "Upcoming",
    ongoing: "Live Now",
    past: "Past",
    cancelled: "Cancelled",
  },
  card: {
    featured: "Featured",
    time: "Time",
    location: "Location",
    registrationFull: "Registration full",
    registrationOpen: "Registration open",
    rsvpAvailable: "RSVP available",
    viewEvent: "View event",
    explore: "Explore",
  },
  filterEmpty: {
    kicker: "Nothing here yet",
    title: "No events match this view.",
    action: "Show all events",
  },
  /** ui: heading for the past-events rail. */
  pastTitle: "Past",
};

export const EVENTS_CTA = {
  kicker: "There's More to Come",
  lines: ["Come for the", "experience.", "Leave", "changed."],
  copy:
    "Keep exploring Scribes Global and stay connected for upcoming gatherings, worship experiences, creative sessions and outreach.",
};

export const EVENTS_EMPTY = {
  kicker: "No events yet",
  title: "The next\ngathering is coming.",
  copy:
    "There are currently no public events to display. When the next Scribes Global gathering is announced, it will appear here.",
  action: "Back home",
};

export const EVENTS_ERROR = {
  kicker: "Connection issue",
  title: "Events couldn't\nbe loaded.",
  fallback: "Something interrupted the events request.",
  action: "Try again",
};

export const EVENTS_LOADING_LABEL = "Loading events";

/* ---------------------------------------------------------
   EVENT DETAIL
--------------------------------------------------------- */

export const EVENT_DETAIL_HERO = {
  back: "Events",
  brand: "Scribes Global",
  scrollCue: "Scroll to explore",
};

export const EVENT_OVERVIEW = {
  kicker: "Event",
  title: "About the\ngathering.",
  emptyDescription: "More information about this event will be available soon.",
  facts: {
    date: "Date",
    start: "Start time",
    end: "End time",
    type: "Type",
    location: "Location",
    status: "Status",
  },
  registration: "Registration",
  full: "Full",
  spacesRemaining: (n: number) => `${n} spaces remaining`,
  joinVirtual: "Join virtual event",
};

export const EVENT_ACTIONS = {
  kicker: "Be There",
  title: "Save your\nplace.",
  registerCopy: "Register for this gathering and reserve your place.",
  rsvpCopy: "Let us know whether you'll be joining us.",
  register: "Register",
  full: "Registration is currently full",
  rsvp: "RSVP",
};

export const EVENT_VENUE = {
  kicker: "Venue",
  title: "Find the\ngathering.",
};

export const EVENT_GALLERY = {
  kicker: "Gallery",
  title: "Moments from\nthe experience.",
  railLabel: "Event gallery",
  close: "Close image",
  /** ui */
  prev: "Previous",
  next: "Next",
};

export const EVENT_VIDEOS = {
  kicker: "Watch",
  title: "Experience\nit again.",
  frameTitle: "Event video",
};

export const EVENT_FINAL = {
  kicker: "Scribes Global",
  title: "More than\nan event.",
  copy: "A place to encounter Christ, experience community and express faith through creativity.",
  action: "Explore all events",
};

export const EVENT_NOT_FOUND = {
  kicker: "Event unavailable",
  title: "This event\ncouldn't be found.",
  back: "All events",
  retry: "Retry",
};

export const EVENT_REGISTRATION_FORM = {
  kicker: "Registration",
  intro: "Reserve your place for this gathering.",
  honeypot: "Website",
  name: "Full name *",
  email: "Email *",
  phone: "Phone",
  chapter: "Chapter",
  chapterPlaceholder: "e.g. Scribes Legon",
  dietary: "Dietary needs",
  additional: "Additional information",
  required: "Please enter your name and email.",
  failed: "Registration failed.",
  submitting: "Registering...",
  submit: "Complete registration",
  successKicker: "Registration sent",
  successTitle: "Your place\nis requested.",
  successCopy: (title: string) => ({ before: "Your registration for ", title, after: " has been submitted." }),
  close: "Close",
};

export const EVENT_RSVP_FORM = {
  kicker: "RSVP",
  intro: "Let the team know whether you'll be there.",
  name: "Full name *",
  email: "Email *",
  phone: "Phone",
  responseLegend: "Your response",
  responses: {
    yes: "Yes, I'll be there",
    maybe: "Maybe",
    no: "No, I can't attend",
  },
  guests: "Number of guests",
  message: "Message",
  required: "Please enter your name and email.",
  failed: "RSVP failed.",
  submitting: "Sending...",
  submit: "Send RSVP",
  successKicker: "RSVP received",
  successTitle: "Thank you for\nresponding.",
  close: "Close",
};
