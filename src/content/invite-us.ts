/**
 * Invite Us — preserved copy. Every heading, paragraph, label, option and
 * message below comes verbatim from the previous InviteUs page (headline
 * casing is now handled by type styles). Nothing here is new ministry copy;
 * the only additions are tiny UI labels, marked as such.
 */

export const INVITE_HERO = {
  kicker: "Invite Us",
  title: "Bring Scribes\nto your\nspace.",
  intro:
    "Planning a church service, conference, campus gathering or creative experience? Send us the details and tell us how you would like Scribes Global to be part of it.",
  cta: "Start your invitation",
  imageAlt: "Scribes Global ministering on stage",
};

/** The three-step process shown beside the old hero. A real sequence. */
export const INVITE_STEPS = [
  "Tell us about the event",
  "Share what you need",
  "We connect with you",
];

export const INVITE_INTRO = {
  kicker: "The Invitation",
  title: "Let's create something meaningful.",
  copy:
    "Give us enough information to understand your event, the audience and the kind of creative ministry experience you are looking for.",
};

export const INVITE_FORM_HEAD = {
  kicker: "Event Details",
  title: "Tell us everything.",
};

export const EVENT_TYPES = [
  "Church Service",
  "Conference",
  "Youth Event",
  "Campus Event",
  "Worship Experience",
  "Poetry / Creative Arts Event",
  "Outreach",
  "Corporate Event",
  "Private Event",
  "Other",
];

export const PERFORMANCE_TYPES = [
  "Spoken Word",
  "Poetry",
  "Worship",
  "Music",
  "Dance / Khoros",
  "Creative Arts",
  "Full Scribes Experience",
  "Other",
];

export const AUDIENCE_SIZES = [
  "Under 50",
  "50 – 100",
  "100 – 250",
  "250 – 500",
  "500 – 1,000",
  "1,000+",
];

export const DURATIONS = [
  "Under 15 minutes",
  "15 – 30 minutes",
  "30 – 60 minutes",
  "1 – 2 hours",
  "Full programme",
  "To be discussed",
];

export const BUDGET_RANGES = [
  "To be discussed",
  "Below GHS 1,000",
  "GHS 1,000 – 2,500",
  "GHS 2,500 – 5,000",
  "GHS 5,000 – 10,000",
  "Above GHS 10,000",
];

/** Form groups, labels and placeholders (verbatim). */
export const INVITE_FORM = {
  honeypot: "Website",
  groups: {
    contact: "Your details",
    event: "About the event",
    experience: "The experience",
  },
  labels: {
    name: "Full name *",
    email: "Email address *",
    phone: "Phone number *",
    organization: "Organization",
    eventType: "Event type *",
    eventDate: "Event date *",
    eventTime: "Event time",
    venue: "Venue *",
    audienceSize: "Audience size",
    duration: "Expected duration",
    performanceType: "Performance type",
    budgetRange: "Budget range",
    additionalDetails: "Additional details",
  },
  placeholders: {
    organization: "Church, school, ministry...",
    venue: "Venue / city / campus",
    additionalDetails:
      "Tell us about the programme, theme, expectations, audience and anything else we should know.",
  },
  /** The old <select> prompts — now used as the chip groups' helper text. */
  prompts: {
    eventType: "Select event type",
    audienceSize: "Select audience size",
    duration: "Select duration",
    performanceType: "Select experience",
    budgetRange: "Select budget",
  },
  consent:
    "By submitting this request, you are sharing the event details needed for the Scribes Global team to review your invitation.",
  submit: "Send invitation",
  submitting: "Sending invitation...",
  requiredError: "Please complete all required fields.",
  fallbackError: "Unable to send your invitation request.",
};

export const INVITE_SUCCESS = {
  label: "Invitation submitted",
  title: "Thank you for inviting us.",
  copy: "Your event details have been sent to Scribes Global for review.",
  again: "Send another invitation",
};

export const INVITE_FINAL = {
  kicker: "Faith Through Creativity",
  title: "Your stage.\nHis message.",
  copy:
    "Whatever the space, our desire remains the same — to communicate Jesus Christ through creative expression.",
};
