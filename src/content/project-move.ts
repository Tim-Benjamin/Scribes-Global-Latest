/**
 * Project MOVE — preserved copy.
 * Every string, image URL and link below is carried over verbatim from
 * the previous /project-move page. Nothing here is new ministry copy.
 */

export const MOVE_DONATION_URL = "https://donate.changoapp.com/campaign/6728c4e07586d";

export const MOVE_VIDEO = {
  embedUrl: "https://www.youtube.com/embed/r7ou9YEnv44?rel=0&modestbranding=1&color=white",
  thumbnail: "https://img.youtube.com/vi/r7ou9YEnv44/maxresdefault.jpg",
  thumbnailAlt: "Project MOVE video",
  iframeTitle: "Project MOVE — Scribes Global",
  playLabel: "Play vision film",
  playAria: "Play Project MOVE video",
  windowLabel: "PROJECT MOVE — SCRIBES GLOBAL",
} as const;

export interface MoveSlide {
  image: string;
  label: string;
}

export const MOVE_HERO_SLIDES: MoveSlide[] = [
  { image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1800&q=85", label: "Amplifying the Gospel" },
  { image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1800&q=85", label: "Ministry in Motion" },
  { image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1800&q=85", label: "Scribes in Outreach" },
  { image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1800&q=85", label: "Creative Voice, Loud Impact" },
  { image: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=1800&q=85", label: "Equipped for the Kingdom" },
];

export const MOVE_HERO = {
  badge: "Scribes Global Initiative",
  titleLead: "PROJECT",
  titleWord: "MOVE",
  /** Rendered as M·inistry, O·utreach, V·oice, E·quipment */
  acronym: ["Ministry", "Outreach", "Voice", "Equipment"],
  description: "Equipping the ministry to speak louder — for the Kingdom.",
  pills: ["Microphones", "PA System", "Outreach-Ready"],
  cta: "Give to Project MOVE",
  captionOwner: "Scribes Global",
} as const;

export interface MovePillar {
  letter: string;
  word: string;
  description: string;
}

export const MOVE_MEANING = {
  kicker: "What MOVE Means",
  titleLead: "FOUR WORDS,",
  titleAccent: "ONE MISSION.",
  pillars: [
    {
      letter: "M",
      word: "Ministry",
      description:
        "Everything we do is rooted in ministry — serving God and His people through the creative arts and spoken word.",
    },
    {
      letter: "O",
      word: "Outreach",
      description:
        "Reaching beyond our walls to campuses, communities, and everywhere the Spirit leads — carrying the gospel outward.",
    },
    {
      letter: "V",
      word: "Voice",
      description:
        "The spoken word, poetry, music — every voice sharpened and amplified to declare truth with boldness and clarity.",
    },
    {
      letter: "E",
      word: "Equipment",
      description:
        "Practical tools — PA systems, microphones, and gear — that physically equip us to be heard wherever God sends us.",
    },
  ] as MovePillar[],
};

/**
 * The announcement keeps its bold emphasis: each paragraph is a list of
 * runs, `strong: true` marks the words the old page set in bold.
 */
export type Run = { text: string; strong?: boolean };

export const MOVE_ANNOUNCEMENT = {
  kicker: "From the Family",
  titleLead: "A GENTLE",
  titleAccent: "REMINDER.",
  meta: ["PROJECT MOVE", "SCRIBES GLOBAL"],
  hello: "Hello family,",
  paragraphs: [
    [
      { text: "A gentle reminder concerning our " },
      { text: "Project Move", strong: true },
      { text: " initiative. We are trusting God to help us procure essential equipment such as " },
      { text: "microphones", strong: true },
      { text: " and a " },
      { text: "PA system", strong: true },
      { text: " to strengthen our meetings and outreach activities." },
    ],
    [
      { text: "April is soon ending and we want to remind all about our " },
      { text: "monthly giving", strong: true },
      { text: " towards our project. Give any seed to support the ministry." },
    ],
    [{ text: "Give easily through the link below:" }],
  ] as Run[][],
  linkLabel: "donate.changoapp.com",
  tags: ["#ScribesGlobal", "#ProjectMove"],
};

export const MOVE_VIDEO_SECTION = {
  kicker: "Watch the Vision",
  titleLead: "PROJECT MOVE",
  titleAccent: "— THE CALL.",
  scriptures: ["Matthew 28:19–20", "John 3:16", "The Great Commission"],
  aboutKicker: "About This Video",
  aboutTitleLead: "Preaching the Gospel",
  aboutTitleAccent: "Across the Nation",
  intro: [
    { text: "In Scribes Global, we believe our core mandate is to evangelise the gospel which affirms the great commission in " },
    { text: "Matthew 28:19–20", strong: true },
    { text: ":" },
  ] as Run[],
  quote:
    "“Go ye therefore into the world and make disciples of many nations, baptizing them in the name of the Father, Son and the Holy Spirit.”",
  quoteCite: "— Matthew 28:19–20",
  body: [
    [
      { text: "The desire of God is that all men are saved. In " },
      { text: "John 3:16", strong: true },
      { text: ", we understand that God loved us and gave His only begotten Son so that we will be saved." },
    ],
    [
      { text: "We can do this with your support. " },
      { text: "Partner with us for this project", strong: true },
      { text: " as we embark on this outreach to preach the gospel across the country." },
    ],
  ] as Run[][],
  tags: ["Matthew 28:19–20", "John 3:16", "The Great Commission"],
  cta: "Partner With Us",
};

export const MOVE_WHY = {
  image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=85",
  imageAlt: "Sound equipment ministry",
  chips: [
    { title: "Monthly Giving", note: "Every seed counts", glyph: "●" },
    { title: "Gospel-Focused", note: "Meetings & Outreach", glyph: "✦" },
  ],
  kicker: "The Vision Behind MOVE",
  titleLead: "Why Equipment",
  titleAccent: "Matters for Ministry",
  paragraphs: [
    [
      {
        text: "God has called Scribes Global to preach the gospel through creative arts — poetry, music, and spoken word. But every great voice needs the right tools to carry its message far.",
      },
    ],
    [
      { text: "Project MOVE was born from a simple, practical need: " },
      { text: "our meetings and outreach activities require proper sound equipment", strong: true },
      { text: ". When a microphone fails or a PA system isn't available, the voice goes unheard. We are trusting God to change that." },
    ],
    [
      { text: "With the right equipment, every campus outreach, fellowship meeting, and conference can be conducted with " },
      { text: "excellence", strong: true },
      { text: " — because the message of Jesus deserves to be heard clearly." },
    ],
  ] as Run[][],
  quote: "“The voice of one crying in the wilderness: Prepare the way of the Lord.”",
  quoteCite: "— Isaiah 40:3",
  fund: {
    title: "Project MOVE Fund",
    status: "Ongoing",
    note: "Monthly contributions building toward our equipment goal. Every gift — any size — moves us forward.",
  },
};

export interface MoveGiveStep {
  number: string;
  title: string;
  icon: string;
  description: string;
}

export const MOVE_GIVE = {
  kicker: "Join the Monthly Givers",
  titleLead: "HOW",
  titleAccent: "TO GIVE.",
  steps: [
    {
      number: "01",
      title: "Click the Link",
      icon: "↗",
      description: "Visit our giving page at donate.changoapp.com — quick, secure, and easy on any device.",
    },
    {
      number: "02",
      title: "Give Any Amount",
      icon: "♥",
      description:
        "There is no minimum. Every seed — whether large or small — is counted and appreciated by God and by us.",
    },
    {
      number: "03",
      title: "Give Monthly",
      icon: "↻",
      description:
        "Set up a recurring monthly gift and become a consistent partner in this specific project for the ministry.",
    },
  ] as MoveGiveStep[],
  stepLabel: "Step",
  cta: "Give to Project MOVE",
  secure: "Secure giving via Chango",
  tags: ["#ProjectMove", "#ScribesGlobal"],
};

export const MOVE_FINAL = {
  kicker: "Be Part of the Move",
  titleLines: ["EVERY SEED", "AMPLIFIES", "HIS VOICE."],
  description:
    "You may not be on stage, but your giving puts the microphone there. Partner with Scribes Global monthly and help us carry the gospel — louder, further, clearer.",
  give: "Give to Project MOVE",
  join: "Join the Family",
  joinTo: "/volunteer",
};
