/**
 * Volunteer — preserved copy. Every heading, paragraph, label and message
 * below comes verbatim from the previous Volunteer page (headline casing is
 * now handled by type styles). Opportunities themselves come from Supabase.
 */

export const VOLUNTEER_HERO = {
  kicker: "Volunteer",
  title: "Bring\nwhat you\ncarry.",
  intro:
    "Use your gifts, skills, time and creativity to serve the mission of Scribes Global.",
  cta: "Volunteer with us",
  scroll: "Discover where you can serve",
  imageAlt: "Scribes Global volunteers serving together",
};

export const VOLUNTEER_PURPOSE = {
  kicker: "Serve",
  title: "There is room for your gift.",
  copy:
    "Scribes Global is built by people who make their abilities available for ministry — from media and writing to prayer, worship, events and creative expression.",
  highlight: ["media", "writing", "prayer", "worship", "events", "creative", "expression."],
  principles: [
    {
      title: "Serve with purpose",
      copy: "Your contribution should strengthen the mission, not simply fill a role.",
    },
    {
      title: "Grow in community",
      copy: "Serving happens alongside people, not in isolation.",
    },
    {
      title: "Create with excellence",
      copy: "Bring your skills, creativity and willingness to learn.",
    },
  ],
};

export const VOLUNTEER_OPPORTUNITIES = {
  kicker: "Open Opportunities",
  title: "Find where you fit.",
  stats: {
    roles: "Open roles",
    teams: "Teams",
    needed: "People needed",
  },
  role: {
    requirements: "What helps",
    commitment: "Commitment",
    location: "Location",
    needed: "Needed",
    flexible: "Flexible",
    apply: "Apply",
  },
  error: {
    label: "Connection issue",
    title: "Opportunities couldn't be loaded.",
    retry: "Try again",
  },
  empty: {
    label: "No openings right now",
    title: "You can still raise your hand.",
    copy:
      "There are currently no public volunteer opportunities listed, but you can still send us your skills and availability.",
    cta: "General volunteer application",
  },
  /** UI label for the department filter. */
  all: "All teams",
};

export const VOLUNTEER_FINAL = {
  kicker: "Join the Family",
  title: "Don't just\nwatch the movement.\nBuild it.",
  copy:
    "Whether you already see the perfect role or simply know you want to serve, tell us what you carry.",
  cta: "Start an application",
};

export const VOLUNTEER_FORM = {
  label: "Volunteer Application",
  generalTitle: "Join the Scribes Team",
  generalCopy: "Tell us how you would like to serve.",
  labels: {
    firstName: "First name *",
    lastName: "Last name *",
    email: "Email *",
    phone: "Phone *",
    chapter: "Chapter",
    availability: "Availability *",
    skills: "Skills *",
    motivation: "Why do you want to serve? *",
  },
  placeholders: {
    chapter: "e.g. Accra / Legon Chapter",
    availability: "Tell us the days, times or hours you can realistically commit.",
    skills: "Tell us the skills, experience or abilities you can bring.",
    motivation: "Share your motivation for volunteering with Scribes Global.",
  },
  submit: "Send application",
  submitting: "Sending application...",
  requiredError: "Please complete all required fields.",
  fallbackError: "Unable to submit your application.",
  /** UI label: drop the pre-selected role and apply generally. */
  clearRole: "Apply generally instead",
};

export const VOLUNTEER_SUCCESS = {
  label: "Application submitted",
  title: "Thank you for raising your hand.",
  copy: "Your volunteer application has been submitted for review.",
  close: "Close",
};
