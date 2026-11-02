/**
 * Ministries page copy — PRESERVED VERBATIM from the legacy Ministries
 * page (src/pages/Ministries/Ministries.tsx before the rebuild).
 * The legacy page had no photography; the images below are the
 * site's existing ministry photos, reused from the About page copy.
 */
import { ABOUT_IMAGES, ABOUT_MINISTRIES } from "./about";

export const MINISTRIES_HERO = {
  meta: ["Scribes Global", "Creative Ministries", "03 Expressions"],
  eyebrow: "ONE MESSAGE. MANY EXPRESSIONS.",
  title: "MINISTRIES",
  intro: "Poetry. Worship. Movement. Different languages carrying the same Gospel.",
  scroll: "Enter the ministries",
  image: ABOUT_IMAGES.vision,
  imageAlt: "Scribes Global ministries",
};

export const MINISTRIES_MANIFESTO = {
  label: "The expression",
  lines: ["Creativity is not decoration.", "It is a language.", "And every language can carry the message of Christ."] as const,
};

export type MinistryTheme = "purple" | "cyan" | "magenta";

export interface Ministry {
  id: string;
  number: string;
  name: string;
  short: string;
  discipline: string;
  description: string;
  statement: string;
  /** Legacy themes were purple / blue / magenta; blue maps to the brand cyan. */
  theme: MinistryTheme;
  image: string;
}

const [poetry, worship, khoros] = ABOUT_MINISTRIES.items;

export const MINISTRIES: Ministry[] = [
  {
    id: "poetry",
    number: "01",
    name: "Scribes Poetry",
    short: "Poetry",
    discipline: "Spoken Word / Poetry",
    description: "A community of spoken word artists and poets.",
    statement: "Words shaped with truth. Voices carrying Christ.",
    theme: "purple",
    image: poetry.image,
  },
  {
    id: "worship",
    number: "02",
    name: "Scribes Worship",
    short: "Worship",
    discipline: "Music / Worship",
    description: "A community of worship leaders and musicians.",
    statement: "Sound becomes surrender. Music becomes ministry.",
    theme: "cyan",
    image: worship.image,
  },
  {
    id: "khoros",
    number: "03",
    name: "Scribes Khoros",
    short: "Khoros",
    discipline: "Dance / Movement",
    description: "Dance and creative movement ministry.",
    statement: "Faith expressed beyond words through movement.",
    theme: "magenta",
    image: khoros.image,
  },
];

export const MINISTRY_SCENE = {
  brand: "Scribes Global",
  link: { label: "Step into this ministry", to: "/volunteer" },
};

export const MINISTRIES_INTERLUDE = ["POETRY", "WORSHIP", "KHOROS", "ONE MESSAGE", "MANY EXPRESSIONS"];

export const MINISTRIES_CALLING = {
  label: "Your expression",
  title: ["YOUR GIFT", "HAS A VOICE."] as const,
  copy:
    "Whether your language is words, sound, movement, design or another expression, there is space to grow, serve and create with purpose.",
  primary: { label: "Join the movement", to: "/volunteer" },
  secondary: { label: "Find a chapter", to: "/chapters" },
};
