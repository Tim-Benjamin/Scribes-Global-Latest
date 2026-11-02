/**
 * Chapters + chapter detail copy — the preserved text of the previous
 * /chapters and /chapters/:slug pages (hero, network, list, filters,
 * states, CTA panels and the join form). Nothing here is new ministry
 * copy; only tiny UI labels (close/next/previous) were added.
 */

export const CHAPTERS_HERO = {
  brand: "Scribes Global",
  kicker: "Global Chapters",
  titleTop: "One movement.",
  titleBottom: "Many places.",
  intro:
    "Discover Scribes communities creating, worshipping and carrying the gospel through creative expression.",
  countLabel: "Active Chapters",
  scrollCue: "Explore the network",
};

export const CHAPTERS_MAP = {
  kicker: "The Network",
  title: "Find your community.",
  drag: "Drag to explore",
  onMap: (n: number) => `${n} chapters on the map`,
  browse: "Browse the full list",
  viewChapter: "View chapter",
  ariaSection: "Chapter locations",
  ariaMap: "Map of Scribes Global chapter locations",
  legend: "Active chapter",
};

export const CHAPTERS_LIST = {
  kicker: "Active Chapters",
  title: "Where we gather.",
  filterLabel: "Explore",
  filterAria: "Filter chapters",
  filters: { all: "All", campus: "Campus", community: "Community" },
  campusBadge: "Campus Chapter",
  chapterBadge: "Chapter",
  meeting: "Meeting",
  noMatch: "No chapters match this filter.",
  loadingAria: "Loading chapters",
};

export const CHAPTERS_EMPTY = {
  kicker: "No active chapters",
  title: "The network is\ngrowing.",
  copy:
    "There are currently no active public chapters to display. Check back again as the Scribes Global community continues to expand.",
  cta: "Connect with Scribes",
  ctaTo: "/volunteer",
};

export const CHAPTERS_ERROR = {
  kicker: "Connection issue",
  title: "We couldn't load\nthe chapters.",
  fallback: "Something interrupted the chapter request.",
  retry: "Try again",
};

export const CHAPTERS_CTA = {
  kicker: "The Movement Continues",
  titleTop: "Don't see a",
  titleBottom: "chapter near you?",
  copy: "Connect with Scribes Global and discover how you can become part of the movement.",
  primary: "Get Involved",
  primaryTo: "/volunteer",
  secondary: "Explore chapters",
  secondaryHref: "#chapters-list",
};

/* ---------------- Chapter detail ---------------- */

export const CHAPTER_HERO = {
  back: "Chapters",
  campusBadge: "Campus Chapter",
  chapterBadge: "Scribes Chapter",
  values: ["Community", "Creativity", "Faith"],
  scroll: "Scroll",
};

export const CHAPTER_ABOUT = {
  kicker: "About",
  title: (name: string) => `This is ${name}.`,
  fallback: "More information about this chapter will be available soon.",
  facts: { location: "Location", meeting: "Meeting", campus: "Campus", status: "Status" },
  active: "Active",
  join: "Join this chapter",
};

export const CHAPTER_CONTACT = {
  kicker: "Connect",
  title: "Reach the chapter.",
  person: "Contact Person",
  email: "Email",
  phone: "Phone",
};

export const CHAPTER_LOCATION = {
  kicker: "Find us",
  title: "Visit the chapter.",
};

export const CHAPTER_GALLERY = {
  kicker: "Gallery",
  title: "Life in the chapter.",
  alt: (name: string, i: number) => `${name} gallery ${i}`,
  close: "Close image",
  prev: "Previous image",
  next: "Next image",
  rail: "Chapter gallery",
};

export const CHAPTER_CTA = {
  kicker: "Become Part of the Community",
  titleTop: "Your place",
  titleBottom: "could be here.",
  copyBefore: "Connect with",
  copyAfter: "and grow in faith, creativity and community.",
  join: (name: string) => `Join ${name}`,
  other: "Explore other chapters",
};

export const CHAPTER_NOT_FOUND = {
  kicker: "Chapter unavailable",
  title: "This chapter\ncouldn't be found.",
  back: "View all chapters",
  retry: "Try again",
};

export const JOIN_MODAL = {
  kicker: "Join the Community",
  intro: "Send your details and the chapter team can connect with you.",
  honeypot: "Website",
  firstName: "First name *",
  lastName: "Last name *",
  email: "Email *",
  phone: "Phone",
  message: "Message",
  messagePlaceholder: "Tell us a little about yourself...",
  required: "Please enter your first name, last name and email.",
  failed: "Unable to submit your request.",
  sending: "Sending...",
  send: "Send request",
  close: "Close",
  successKicker: "Request sent",
  successTitle: "We'll see you\nin the community.",
  successBefore: "Your request to join",
  successAfter: "has been submitted.",
};
