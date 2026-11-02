/**
 * Project H.E.A.L — preserved copy.
 * Every heading, paragraph, label, image URL and link below is carried
 * over verbatim from the previous ProjectHeal page. Nothing invented.
 * Rich paragraphs are arrays of plain strings and { strong } runs so
 * the original emphasis survives without JSX in the content layer.
 */

export type RichRun = string | { strong: string };
export type RichText = RichRun[];

export interface HealPillar {
  letter: string;
  word: string;
  description: string;
}

export interface HealTimelineItem {
  label: string;
  year: string;
}

export interface HealProject {
  id: string;
  number: string;
  year: string;
  label: string;
  location: string;
  images: string[];
  paragraphs: RichText[];
  quote?: string;
  tags: string[];
}

export interface HealGalleryItem {
  src: string;
  alt: string;
  size: "normal" | "wide" | "tall";
}

export const HEAL_IMAGES = {
  hero:
    "https://static.wixstatic.com/media/98ecda_5109a8759c904a118b7f0ea155526479~mv2.jpg/v1/fill/w_940,h_600,al_c,q_85,enc_avif,quality_auto/98ecda_5109a8759c904a118b7f0ea155526479~mv2.jpg",
  founder:
    "https://static.wixstatic.com/media/521bf8_0506857373b34a04b48b15c7e9f50d01~mv2.jpg/v1/fill/w_600,h_800,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/521bf8_0506857373b34a04b48b15c7e9f50d01~mv2.jpg",
};

export const HEAL_HERO = {
  meta: ["Scribes Global", "Outreach Initiative", "H.E.A.L"],
  badge: "Scribes Global Initiative",
  titleTop: "PROJECT",
  titleAccent: "H.E.A.L",
  /** "Help · Educate · And · Love" — first letter + remainder. */
  meaning: [
    { letter: "H", rest: "elp" },
    { letter: "E", rest: "ducate" },
    { letter: "A", rest: "nd" },
    { letter: "L", rest: "ove" },
  ],
  description: [
    "An initiative borne by ",
    { strong: "Aseye Adonu" },
    ", a member of Scribes. The aim is to extend love to all — by helping the less privileged with gifts and resources, and empowering them through education.",
  ] as RichText,
  give: { label: "Give to H.E.A.L", to: "/give" },
  projects: { label: "See Our Projects", href: "#projects" },
  scroll: "Scroll",
};

export const HEAL_PILLARS_HEAD = {
  kicker: "What H.E.A.L Means",
  title: "Our Four Pillars.",
};

export const HEAL_PILLARS: HealPillar[] = [
  {
    letter: "H",
    word: "Help",
    description:
      "Providing practical help — food, resources, and essential materials — to those who need it most.",
  },
  {
    letter: "E",
    word: "Educate",
    description:
      "Empowering communities through education, workshops, and tools that open doors to a better future.",
  },
  {
    letter: "A",
    word: "And",
    description:
      "A bridge between compassion and action — connecting our community to those who need care most.",
  },
  {
    letter: "L",
    word: "Love",
    description:
      "Every project is rooted in genuine, unconditional love — the kind that transforms lives and reflects Christ.",
  },
];

export const HEAL_INITIATIVE = {
  kicker: "The Initiative",
  title: "Extending Love to All",
  imageAlt: "Project H.E.A.L community visit",
  imageIndex: ["H.E.A.L", "2017—2023"],
  founderName: "Aseye Adonu",
  founderRole: "Founder, H.E.A.L",
  /** First paragraph as plain text (for the scroll-inked statement). */
  statement:
    "Project H.E.A.L stands for Help, Educate, and Love — an initiative borne by Aseye Adonu, a member of Scribes Global.",
  statementStrong: ["Help, Educate, and Love", "Aseye Adonu"],
  paragraphs: [
    "The aim is to extend love to all; by helping the less privileged with the gifts and resources, and empowering them through education.",
    "Through each project under H.E.A.L, we go beyond words — we act. From visiting children's homes and autism centres to empowering the deaf and supporting street children, every initiative is driven by Christ's love in action.",
  ],
};

export const HEAL_TIMELINE: HealTimelineItem[] = [
  { label: "Nikasemɔ", year: "2017" },
  { label: "BRAVE", year: "2018" },
  { label: "Love Spectrum", year: "2021" },
  { label: "Project Care", year: "2023" },
];

export const HEAL_PROJECTS_HEAD = {
  kicker: "What We've Done",
  title: "Our Projects.",
  copy:
    "Each sub-project under H.E.A.L targets a specific community in need — bringing education, resources, and most importantly, love.",
};

export const HEAL_PROJECTS: HealProject[] = [
  {
    id: "project-care",
    number: "01",
    year: "2023",
    label: "Project Care",
    location: "Nyamedua Children's Home",
    images: [
      "https://static.wixstatic.com/media/3c82a7_0cb4093d7f5740adbfdeb0c6af537ce9~mv2.jpg/v1/fill/w_600,h_800,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202023-12-15%20at%2000_33_23_e0f1a76a.jpg",
    ],
    paragraphs: [
      [
        "As part of our ongoing Project HEAL initiative, this year, we had the privilege of visiting the ",
        { strong: "Nyamedua Children's Home in Adenta" },
        ". During our visit, we contributed essential educational materials such as books, pens, erasers, and more, aiming to support their learning endeavors.",
      ],
      ["Additionally, we provided much-needed food items to assist in meeting their nutritional needs."],
      [
        "This year's edition, termed ",
        { strong: "'Project Care,'" },
        " resonates deeply with our commitment to extend care and compassion to orphans. Our primary goal is to demonstrate heartfelt care through these contributions, furthering our mission to positively impact the lives of these children.",
      ],
    ],
    tags: ["Books & Pens", "Erasers", "Food Items", "Care & Love"],
  },
  {
    id: "love-spectrum",
    number: "02",
    year: "2021",
    label: "Love Spectrum",
    location: "HopeSetters Autism Center, Tema",
    images: [
      "https://static.wixstatic.com/media/521bf8_21fcb2f6a17d450991ab7560d54122c5~mv2.jpg/v1/fill/w_435,h_580,al_c,q_80,enc_avif,quality_auto/521bf8_21fcb2f6a17d450991ab7560d54122c5~mv2.jpg",
      "https://static.wixstatic.com/media/521bf8_0506857373b34a04b48b15c7e9f50d01~mv2.jpg/v1/fill/w_396,h_527,al_c,q_80,enc_avif,quality_auto/521bf8_0506857373b34a04b48b15c7e9f50d01~mv2.jpg",
      "https://static.wixstatic.com/media/521bf8_85b349b240614917885d2480f9fe582d~mv2.jpg/v1/fill/w_659,h_494,al_c,q_80,enc_avif,quality_auto/521bf8_85b349b240614917885d2480f9fe582d~mv2.jpg",
    ],
    paragraphs: [
      [
        "During the COVID period in 2020, we had plans of assisting people with autism but we couldn't do so due to the restrictions. We then had to reschedule it.",
      ],
      [
        "In ",
        { strong: "2021" },
        ", we visited the ",
        { strong: "HopeSetters Autism Center in Tema" },
        " and donated educational materials to the institution. We also spent the day having fun with the kids and learning more about Autism and on how best we can be of help to people living with autism.",
      ],
    ],
    tags: ["Educational Materials", "Fun Activities", "Autism Awareness", "2021"],
  },
  {
    id: "brave",
    number: "03",
    year: "2018",
    label: "BRAVE",
    location: "State School for Deaf, Ashaiman",
    images: [
      "https://static.wixstatic.com/media/98ecda_0375a4192c7e43589cc065b7e7721a21~mv2.jpg/v1/fill/w_483,h_600,al_c,q_80,enc_avif,quality_auto/IMG_3886.jpg",
      "https://static.wixstatic.com/media/98ecda_3f4106faffd04ba3bdcf6e3ac858c1f9~mv2.jpg/v1/fill/w_390,h_260,al_c,q_80,enc_avif,quality_auto/IMG_3894.jpg",
      "https://static.wixstatic.com/media/98ecda_ef55ae332d6d46d3b9c160a7e873904f~mv2.jpg/v1/fill/w_390,h_260,al_c,q_80,enc_avif,quality_auto/IMG_3888.jpg",
    ],
    paragraphs: [
      [
        "In ",
        { strong: "2018" },
        ", we took the initiative once again, this time to help students who are deaf and dumb. We believe that, regardless of their limitation, they can still make impact and so must be heard.",
      ],
      [
        "We visited the ",
        { strong: "State School for Deaf at Ashaiman" },
        " and donated educational materials, food, toiletries, etc. to the school to help in their good work.",
      ],
      [
        "A student was also ",
        { strong: "trained in poetry and was invited to perform a piece in sign language" },
        " at our annual poetry event, Script on Scrolls.",
      ],
    ],
    quote: "Regardless of their limitation, they can still make impact — and so must be heard.",
    tags: ["Educational Materials", "Food", "Toiletries", "Poetry Training", "Sign Language Performance"],
  },
  {
    id: "nikasemo",
    number: "04",
    year: "2017",
    label: "Nikasemɔ",
    location: "Street Children, Bukom — Accra",
    images: [
      "https://static.wixstatic.com/media/98ecda_3c30f35296e746c8bc01a6f3931b2ffa~mv2.jpg/v1/fill/w_474,h_316,al_c,q_80,enc_avif,quality_auto/IMG_3845.jpg",
      "https://static.wixstatic.com/media/98ecda_ca0bad468f3c4ed2a61f1d2fc1acb0d2~mv2.jpg/v1/fill/w_366,h_244,al_c,q_80,enc_avif,quality_auto/IMG_3841.jpg",
      "https://static.wixstatic.com/media/98ecda_915b43721e064fdf9910313bed620c8a~mv2.jpg/v1/fill/w_562,h_375,al_c,q_80,enc_avif,quality_auto/IMG_3819.jpg",
    ],
    paragraphs: [
      [
        "In ",
        { strong: "2017" },
        ", we partnered with ",
        { strong: "SCEF International (Street Children Empowerment Fund)" },
        " to educate and help street children in and around Bukom, a suburb of Accra Central.",
      ],
      ["In this project, we taught the kids for a month, provided them with educational materials and other important items."],
      [
        "Finally, we ",
        { strong: "trained two of the kids in poetry" },
        " and invited them to our annual event (Scripts on Scrolls) to perform.",
      ],
    ],
    quote: "We taught, equipped, and then gave them a stage — because every voice deserves to be heard.",
    tags: ["SCEF International", "Monthly Teaching", "Educational Materials", "Poetry Training", "Scripts on Scrolls"],
  },
];

export const HEAL_GALLERY_HEAD = {
  kicker: "Moments in Action",
  title: "PHOTO GALLERY.",
  hint: "Click any image to enlarge",
};

export const HEAL_GALLERY: HealGalleryItem[] = [
  {
    src: "https://static.wixstatic.com/media/521bf8_21fcb2f6a17d450991ab7560d54122c5~mv2.jpg/v1/fill/w_435,h_580,al_c,q_80,enc_avif,quality_auto/521bf8_21fcb2f6a17d450991ab7560d54122c5~mv2.jpg",
    alt: "H.E.A.L visit",
    size: "tall",
  },
  {
    src: "https://static.wixstatic.com/media/521bf8_0506857373b34a04b48b15c7e9f50d01~mv2.jpg/v1/fill/w_396,h_527,al_c,q_80,enc_avif,quality_auto/521bf8_0506857373b34a04b48b15c7e9f50d01~mv2.jpg",
    alt: "Community members",
    size: "normal",
  },
  {
    src: "https://static.wixstatic.com/media/521bf8_85b349b240614917885d2480f9fe582d~mv2.jpg/v1/fill/w_659,h_494,al_c,q_80,enc_avif,quality_auto/521bf8_85b349b240614917885d2480f9fe582d~mv2.jpg",
    alt: "Scribes members",
    size: "wide",
  },
  {
    src: "https://static.wixstatic.com/media/98ecda_0375a4192c7e43589cc065b7e7721a21~mv2.jpg/v1/fill/w_483,h_322,al_c,q_80,enc_avif,quality_auto/IMG_3886.jpg",
    alt: "BRAVE visit",
    size: "normal",
  },
  {
    src: "https://static.wixstatic.com/media/98ecda_3c30f35296e746c8bc01a6f3931b2ffa~mv2.jpg/v1/fill/w_474,h_316,al_c,q_80,enc_avif,quality_auto/IMG_3845.jpg",
    alt: "Nikasemɔ",
    size: "normal",
  },
  {
    src: "https://static.wixstatic.com/media/98ecda_3f4106faffd04ba3bdcf6e3ac858c1f9~mv2.jpg/v1/fill/w_390,h_260,al_c,q_80,enc_avif,quality_auto/IMG_3894.jpg",
    alt: "BRAVE school visit",
    size: "normal",
  },
  {
    src: "https://static.wixstatic.com/media/98ecda_ef55ae332d6d46d3b9c160a7e873904f~mv2.jpg/v1/fill/w_390,h_260,al_c,q_80,enc_avif,quality_auto/IMG_3888.jpg",
    alt: "School donation",
    size: "normal",
  },
  {
    src: "https://static.wixstatic.com/media/98ecda_ca0bad468f3c4ed2a61f1d2fc1acb0d2~mv2.jpg/v1/fill/w_366,h_244,al_c,q_80,enc_avif,quality_auto/IMG_3841.jpg",
    alt: "Street children",
    size: "normal",
  },
  {
    src: "https://static.wixstatic.com/media/98ecda_9fe2395ed97f4946b1578c9fb9b31e32~mv2.jpg/v1/fill/w_354,h_236,al_c,q_80,enc_avif,quality_auto/IMG_3850.jpg",
    alt: "Kids learning",
    size: "normal",
  },
  {
    src: "https://static.wixstatic.com/media/98ecda_94e76c6df3a44bb791f3b8c70df990f4~mv2.jpg/v1/fill/w_353,h_236,al_c,q_80,enc_avif,quality_auto/IMG_3840.jpg",
    alt: "Group activity",
    size: "normal",
  },
  {
    src: "https://static.wixstatic.com/media/98ecda_915b43721e064fdf9910313bed620c8a~mv2.jpg/v1/fill/w_562,h_375,al_c,q_80,enc_avif,quality_auto/IMG_3819.jpg",
    alt: "Poetry performance",
    size: "wide",
  },
  {
    src: "https://static.wixstatic.com/media/98ecda_7a99052261094830bc94e066aae2ea0c~mv2.jpg/v1/fill/w_478,h_318,al_c,q_80,enc_avif,quality_auto/IMG_3836.jpg",
    alt: "BRAVE group",
    size: "normal",
  },
];

export const HEAL_CTA = {
  eyebrow: "Every Gift Matters",
  titleTop: "HELP US",
  titleLines: ["HELP, EDUCATE", "& LOVE."],
  description:
    "Your support enables us to reach more children, more communities, and more lives with the love of Christ in practical, tangible ways.",
  give: { label: "Give to H.E.A.L", to: "/give" },
  volunteer: { label: "Volunteer", to: "/volunteer" },
};

export const HEAL_UI = {
  viewImage: "View image",
  view: "View",
  closePreview: "Close image preview",
  previewLabel: "Image preview",
  readChapter: "Read the chapter",
};
