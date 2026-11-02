/**
 * About page copy — PRESERVED VERBATIM from the legacy About page
 * (src/pages/About/About.tsx before the rebuild). Nothing here is new
 * copy. Inline emphasis from the old markup is kept with a tiny
 * markup: **bold** and _italic_ (rendered by src/pages/About/rich.tsx).
 */

export const ABOUT_IMAGES = {
  hero:
    "https://static.wixstatic.com/media/521bf8_7d622c1e53064c06ab56a08a6e19e1fa~mv2.jpg/v1/fill/w_940,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/_MG_3829.jpg",
  biblical:
    "https://static.wixstatic.com/media/521bf8_ca1f56b295d54b0aa5b5e4f0665b674d~mv2.jpg/v1/fill/w_966,h_644,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/521bf8_ca1f56b295d54b0aa5b5e4f0665b674d~mv2.jpg",
  mission:
    "https://static.wixstatic.com/media/521bf8_513d5db66b9740378bcbdb1b6fb0789c~mv2.jpg/v1/fill/w_1145,h_644,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/521bf8_513d5db66b9740378bcbdb1b6fb0789c~mv2.jpg",
  vision:
    "https://static.wixstatic.com/media/521bf8_5b5283b848854b6087436506c9b352bf~mv2.jpg/v1/fill/w_1145,h_644,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/521bf8_5b5283b848854b6087436506c9b352bf~mv2.jpg",
  chapters:
    "https://static.wixstatic.com/media/98ecda_cce9f04b679046bb80afa0f2b60dac4e~mv2.jpg/v1/fill/w_1505,h_443,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/98ecda_cce9f04b679046bb80afa0f2b60dac4e~mv2.jpg",
} as const;

export const ABOUT_HERO = {
  label: "About",
  title: "SCRIBES\nGLOBAL.",
  established: "Established 22nd May, 2017",
  /** The acronym: each entry is [initial, rest]. */
  acronym: [
    ["S", "peaking "],
    ["C", "hrist's "],
    ["R", "edemption "],
    ["I", "n "],
    ["B", "iblically-"],
    ["E", "dified "],
    ["S", "peech"],
  ] as const,
  identities: ["Restorers of Truth", "Unashamed to Speak", "Grace unto us"],
  description:
    "A non-profit, non-denominational evangelistic ministry preaching the gospel through creative arts — poetry, music, and spoken word.",
  cta: { label: "Join / Volunteer", to: "/volunteer" },
  imageAlt: "",
};

export const ABOUT_WHO = {
  kicker: "Who We Are",
  title: ["A COMMUNITY", "OF CREATIVES"] as const,
  imageAlt: "Scribes Global community",
  members: { value: 100, suffix: "+", label: "Members Worldwide" },
  founded: { value: 2017, label: "Founded" },
  paragraphs: [
    "Scribes Global is a **non-profit, non-denominational organization** set up as an evangelistic ministry to preach the gospel through creative arts — poetry, music, and spoken word.",
    "Established on **22nd May, 2017**, we have grown from a group of **8 members** to over **100 members** in different parts of the world, organising events, workshops, conferences and outreach programs.",
    "Scribes Global now has chapters in **KNUST, University of Cape Coast and University of Ghana** with a global audience to its events and fellowship meetings.",
    "As a community of creatives, our ministries are commissioned to preach Jesus Christ and inspire hope for purity and holiness. They include **Scribes Poetry, Scribes Worship and Scribes Kids**.",
  ],
  stats: [
    { value: 3, suffix: "", label: "Ministries" },
    { value: 4, suffix: "", label: "Campuses" },
    { value: 7, suffix: "+", label: "Years Active" },
  ],
};

export const ABOUT_PARTNERS = {
  label: "Partners & Community",
  copy: "Community, collaboration and partnership have remained part of the Scribes Global journey.",
};

/** Ticker lines (the ministry's own taglines). */
export const ABOUT_IDENTITY_LINES = [
  "Restorers of Truth",
  "Unashamed to Speak",
  "Grace unto us",
  "Speaking Christ's Redemption",
];

export const ABOUT_BIBLICAL = {
  kicker: "2 Kings 22–23",
  title: ["BIBLICAL", "PERSPECTIVE."] as const,
  /** Plain text for the scroll-inked paragraphs; `highlight` mirrors the old bold/italic words. */
  paragraphs: [
    {
      text: "Josiah, King of Jerusalem, sent Shaphan, a Scribe, to the high priest — who gave him the Book of the Law. Shaphan read it, saw God's impending wrath, and immediately brought the message to the king. It led to the deliverance of Jerusalem.",
      highlight: ["Shaphan,", "Scribe,", "deliverance"],
    },
    {
      text: "We believe like Shaphan, we have been called as Scribes — messengers — to bring the message of REDEMPTION through our gifts and talents in poetry, music and spoken word to the world.",
      highlight: ["messengers", "REDEMPTION"],
    },
  ],
  quote: "\"And you shall know the truth, and the truth shall make you free.\"",
  cite: "— John 8:32",
  imageAlt: "Biblical Perspective",
  identities: ["Restorers of TRUTH", "Unashamed to Speak", "Grace unto us"],
};

export const ABOUT_DIRECTION = {
  kicker: "What Drives Us",
  title: ["MISSION &", "VISION."] as const,
  mission: {
    number: "01",
    title: "Mission",
    refs: "Matthew 28:19–20 · 1 Timothy 2:4",
    imageAlt: "Mission",
    lead: "To propagate the message of **REDEMPTION** for all to be saved and be prepared for the coming of our Lord and Savior Jesus Christ through the creative arts — poetry, music, spoken word.",
    points: [
      {
        label: "LIGHT",
        copy: "In this increasingly dark world, we exist to restore light (truth) through the preaching of the Gospel, that men will be redeemed from sin, self and the systems of the world.",
      },
      {
        label: "MESSAGE",
        copy: "\"Our Lord and Saviour Jesus Christ is coming again! The church must prepare, souls must be saved!\" **THIS IS OUR MESSAGE!**",
      },
    ],
  },
  vision: {
    number: "02",
    title: "Vision",
    refs: "Isaiah 40:3 · Galatians 4:19",
    imageAlt: "Vision",
    lead: "To become a **voice (Isaiah 40:3)**, effectively evangelizing the gospel through discipleship — raising believers to become ministers of redemption, taking the world with the Christ-message through creative arts.",
    copy: "Through training and instruction, we aim to raise all believers to live the fullness of the Christ-life (Galatians 4:19) — becoming an **agency of redemption and restoration**, projecting Christ to all men, touching lives and empowering people to lead and impact in every sphere of life.",
  },
};

export interface AboutMinistry {
  title: string;
  image: string;
  description: string;
  symbol: string;
  to: string;
}

export const ABOUT_MINISTRIES = {
  kicker: "Our Creative Arms",
  title: ["OUR", "MINISTRIES."] as const,
  intro:
    "As a community of creatives, our ministries are commissioned to preach Jesus Christ — the salvation of mankind — and inspire hope for purity and holiness.",
  items: [
    {
      title: "Scribes Poetry",
      image:
        "https://static.wixstatic.com/media/521bf8_dda9d495fdf54dffaeb6b90d070166e7~mv2.jpg/v1/fill/w_966,h_644,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/521bf8_dda9d495fdf54dffaeb6b90d070166e7~mv2.jpg",
      description:
        "Established as the initial step in fulfilling our mission, spreading the gospel through poetry, spoken word and short stories. The first official meeting was held on May 22nd, 2017.",
      symbol: "POETRY",
      to: "/ministries",
    },
    {
      title: "Scribes Worship",
      // Legacy asset: ASSETS_PATH . 'images/scribes-worship.jpg' → public/images/
      image: "/images/scribes-worship.jpg",
      description:
        "Overwhelmed by the gift of salvation found in Jesus, we have a heart for authentic worship — making room for believers to intimately fellowship with God through music and song.",
      symbol: "WORSHIP",
      to: "/ministries",
    },
    {
      title: "Scribes Khoros",
      // Legacy asset: ASSETS_PATH . 'images/scribes-khoros.jpg' → public/images/
      image: "/images/scribes-khoros.jpg",
      description:
        "Movement as a form of worship and expression interpreting Scripture. We seek to raise up a generation of worshippers who will dance before the Lord with all their hearts, souls and minds.",
      symbol: "KHOROS",
      to: "/ministries",
    },
  ] satisfies AboutMinistry[],
};

export const ABOUT_CHAPTERS = {
  kicker: "By God's Grace",
  title: ["CAMPUS", "CHAPTERS."] as const,
  intro:
    "We have extended our ministry to a number of universities in Ghana. Our campus chapters harbour several young talents, serving as a platform to nurture their gifts and propagate the gospel of Christ.",
  items: [
    { name: "Scribes KNUST", school: "Kwame Nkrumah Univ. of Science & Technology", logo: "/images/logo/scribesKNUST.jpg" },
    { name: "Scribes UCC", school: "University of Cape Coast", logo: "/images/logo/scribesUCC.jpg" },
    { name: "Scribes UHAS", school: "University of Health and Social Sciences", logo: "/images/logo/scribesUHAS.jpg" },
    { name: "Scribes LEGON", school: "University of Ghana, UPSA, GIMPA & Wisconsin", logo: "/images/logo/scribesLEGON.jpg" },
  ],
  note: "We accept members from all schools, universities or campuses.",
  cta: { label: "View All Chapters", to: "/chapters" },
};

export const ABOUT_FINAL = {
  kicker: "Unashamed to Speak",
  title: ["READY TO BE A", "RESTORER OF TRUTH?"] as const,
  copy:
    "Whether you're a poet, musician, or simply someone who loves the Lord — there is a place for you in this community. Join us as we take the Christ-message to the world.",
  primary: { label: "Join / Volunteer", to: "/volunteer" },
  secondary: { label: "Invite Scribes Global", to: "/invite-us" },
};
