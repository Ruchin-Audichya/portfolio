// Single source of truth for everything the site says.
// Every number here is taken from a project README, a public repo or the résumé.

export const site = {
  url: "https://ruchinaudichya.in",
  name: "Ruchin Audichya",
  nameDeva: "रुचिन औदीच्य",
  pronunciation: "ru·chin au·dee·chya",
  role: "Software engineer",
  location: "Jaipur, India",
  coords: "26.91° N, 75.79° E",
  email: "ruchinaudichya09@gmail.com",
  resume: "/resume.pdf",
  availability: "Open to SDE / GET roles · class of 2027",
  description:
    "Ruchin Audichya is a software engineer in Jaipur, India. He builds Anvil, an Android app that writes bootable Windows USB drives without a PC or root, MediFast, a Telegram bot that asks every nearby pharmacy at once (Top 24 of 2,000+ teams, Cognizant Technoverse 2026), and Yatra Sync, a shared-cab matching and fare-split app. AWS Certified Solutions Architect – Associate.",
  socials: {
    github: "https://github.com/Ruchin-Audichya",
    linkedin: "https://www.linkedin.com/in/ruchinaudi/",
    x: "https://x.com/itsRuchin",
    instagram: "https://www.instagram.com/ruchin_audichya/",
    leetcode: "https://leetcode.com/u/ruchinaudichya/",
  },
} as const;

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Record", href: "/#record" },
  { label: "Story", href: "/#story" },
  { label: "Notes", href: "/blog" },
  { label: "Contact", href: "/#contact" },
] as const;

export const heroFacts = [
  { label: "Now", value: "Final-year B.Tech CSE, JECRC University", note: "Class of 2027 · CGPA 8.2" },
  { label: "Last role", value: "Software Engineering Intern, SecretEye Telematics", note: "Dec 2025 – Mar 2026" },
  { label: "Certified", value: "AWS Solutions Architect – Associate", note: "+ AI Practitioner, Cloud Practitioner, ServiceNow CSA" },
  { label: "Recognition", value: "Top 24 of 2,000+ teams", note: "Cognizant Technoverse 2026" },
] as const;

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  /** Anchor id on the homepage. */
  anchor: string;
  title: string;
  year: string;
  kind: string;
  tagline: string;
  summary: string;
  proofs: { claim: string; proof: string }[];
  facts: { value: string; label: string }[];
  stack: string[];
  links: ProjectLink[];
  image?: { src: string; alt: string; width: number; height: number; caption: string };
  study: {
    problem: string[];
    approach: { title: string; body: string }[];
    hard: { title: string; body: string }[];
    outcome: string[];
    honest: string;
  };
};

export const projects: Project[] = [
  {
    slug: "anvil",
    anchor: "anvil",
    title: "Anvil",
    year: "2026",
    kind: "Android app · systems",
    tagline: "A dead laptop, a phone and a pendrive.",
    summary:
      "Anvil turns a pendrive into a bootable Windows or Linux installer using only an Android phone. No PC, no root, no hunting for ISO files.",
    proofs: [
      {
        claim: "Writes raw sectors without root",
        proof:
          "Android only gives apps file access to a USB stick. Anvil claims the drive through the USB Host API and speaks the USB Mass Storage protocol itself.",
      },
      {
        claim: "Fits a 7.6 GB file on FAT32",
        proof:
          "FAT32 stops at 4 GB per file, so install.wim is split into .swm parts as it streams from the ISO to the stick. No temporary files.",
      },
      {
        claim: "Verified, not just compiled",
        proof:
          "Every write is read back and checked with SHA-256. The resulting Windows 11 drive image boots in QEMU with Secure Boot enforced.",
      },
    ],
    facts: [
      { value: "0", label: "PCs or root access needed" },
      { value: "7.6 GB", label: "install.wim split on the fly" },
      { value: "978", label: "files, byte-identical to the ISO" },
      { value: "v0.3.1", label: "open-source beta, MIT" },
    ],
    stack: ["Kotlin", "Jetpack Compose", "Android USB Host API", "Hilt", "Gradle"],
    links: [
      { label: "GitHub", href: "https://github.com/Ruchin-Audichya/anvil-usb" },
      { label: "Download the APK", href: "https://github.com/Ruchin-Audichya/anvil-usb/releases/latest" },
    ],
    image: {
      src: "/projects/anvil-boot.png",
      alt: "Windows 11 Setup running from a drive image written by Anvil",
      width: 1280,
      height: 800,
      caption: "Windows 11 Setup, booted in QEMU from an image written by Anvil's engine, with Secure Boot enforced.",
    },
    study: {
      problem: [
        "Your laptop won't boot. The usual fix is an installer USB, and making one needs a second computer. A lot of people only have a phone.",
        "Android doesn't let apps write raw sectors to a USB stick. The tools that exist either need root or can't handle Windows ISOs at all.",
      ],
      approach: [
        {
          title: "Talk to the drive directly",
          body: "Anvil claims the pendrive through Android's USB Host API, which detaches the system's own storage driver. It then sends the drive SCSI read and write commands wrapped in Bulk-Only Transport, the same protocol a PC's driver uses. That makes the whole drive writable without root.",
        },
        {
          title: "Build the installer layout by hand",
          body: "Windows ISOs keep their real file tree in a UDF filesystem, so Anvil has its own read-only UDF reader. It writes a GPT partition table and a FAT32 filesystem in a single pass, which is what UEFI firmware needs to boot.",
        },
        {
          title: "Split the file that doesn't fit",
          body: "install.wim is over 7 GB and FAT32 stops at 4 GB per file. Anvil repackages the WIM's compressed resources into .swm parts as they stream from the ISO to the stick. Nothing is recompressed and nothing is copied to phone storage first.",
        },
        {
          title: "Fetch the real thing",
          body: "ISOs come straight from Microsoft's servers with resumable downloads, and each one is checked against the SHA-256 that Microsoft publishes.",
        },
      ],
      hard: [
        {
          title: "Testing a USB protocol without a phone",
          body: "Everything below the UI is plain Kotlin. A fake USB stick implements the device side of the protocol, so the exact bytes are unit-tested on a desktop JVM.",
        },
        {
          title: "Cheap and fake drives",
          body: "Some pendrives lie about their capacity or fail silently. Reading every write back and comparing hashes catches them before the user finds out at boot time.",
        },
        {
          title: "Error recovery",
          body: "Drives stall, reset and disconnect mid-write. Anvil follows the Bulk-Only Transport recovery steps and shows clear instructions if the drive is unplugged.",
        },
      ],
      outcome: [
        "A real 8.4 GB Windows 11 ISO, written by the same engine the app uses: 978 files, install.wim split into two parts, read-back SHA-256 passing.",
        "The image boots in QEMU under UEFI with Secure Boot enforced, and Windows Setup lists every edition.",
        "Released as an open-source beta with an installable APK.",
      ],
      honest: "Anvil is a beta. The writing engine is verified end to end, and testing across real phones and USB drives is still ongoing.",
    },
  },
  {
    slug: "medifast-ai",
    anchor: "medifast",
    title: "MediFast",
    year: "2026",
    kind: "Telegram bot · real-time",
    tagline: "Ask every chemist nearby. At once.",
    summary:
      "Send your medicine list on Telegram. Every participating pharmacy nearby taps what it has, and you watch the answers arrive before you leave home.",
    proofs: [
      {
        claim: "Asks the pharmacist, not a database",
        proof:
          "Small chemists can't keep a stock database current. MediFast sends the list to up to 12 nearby pharmacies and each one answers in a few taps.",
      },
      {
        claim: "Pan 20 never becomes Pan 40",
        proof:
          "A medicine must match on exact name, strength and form. Fuzzy search can suggest a fix for a typo, and you confirm it.",
      },
      {
        claim: "Tested end to end",
        proof: "43 automated tests, including full Telegram conversations, run in CI on every push.",
      },
    ],
    facts: [
      { value: "12", label: "nearest pharmacies asked per request" },
      { value: "43", label: "automated tests, run in CI" },
      { value: "Top 24", label: "of 2,000+ teams, Technoverse 2026" },
      { value: "169K+", label: "medicines in the first version's catalogue" },
    ],
    stack: ["TypeScript", "Node.js", "SQLite", "grammY", "Express", "React"],
    links: [
      { label: "GitHub", href: "https://github.com/Ruchin-Audichya/MediFastRX-Bot" },
      { label: "MediAtlas data layer", href: "https://github.com/Ruchin-Audichya/MediAtlas" },
    ],
    image: {
      src: "/projects/medifast-studio.png",
      alt: "MediFast Demo Studio showing a customer chat, a live map of pharmacy answers and a pharmacist chat",
      width: 2880,
      height: 1800,
      caption: "Demo Studio runs the real bot with a customer, a live map and a pharmacist side by side. The pharmacies are fictional.",
    },
    study: {
      problem: [
        "You have a prescription. The first chemist doesn't have one of the medicines. Neither does the second.",
        "Apps that list pharmacy stock don't fix this, because small chemists can't keep a stock database up to date.",
      ],
      approach: [
        {
          title: "Ask the pharmacist instead",
          body: "The customer confirms a list and shares a location. The request goes to the nearest approved, open pharmacies at the same time. Each pharmacist marks every item: have it, by tomorrow, other brand, or no.",
        },
        {
          title: "One message that updates itself",
          body: "Answers edit a single board message in the customer's chat, ranked as they arrive. The customer reserves the best shop, or splits the list across two, and gets a 4-digit pickup code.",
        },
        {
          title: "One brain",
          body: "Every rule, permission and state change lives in one domain module on SQLite. Telegram, the web app and the demo all call it, so they can't disagree.",
        },
        {
          title: "Careful by design",
          body: "Pharmacies see the list and the distance, not who you are. Prescription photos are read once and thrown away. Habit-forming medicines are never broadcast.",
        },
      ],
      hard: [
        {
          title: "Never guessing a strength",
          body: "A brand name must agree with any strength, form or release type the user typed. A mismatch returns the variants that do exist, and nothing is swapped silently.",
        },
        {
          title: "State that can't drift",
          body: "Asks, recipients and reservations are small state machines. Repeating a transition is harmless and anything else is rejected, so a double tap never double-books.",
        },
        {
          title: "Saying how sure it is",
          body: "Pharmacist answers are marked confirmed. Map results say stock unknown. Online pharmacy links say not checked. No source pretends to know more than it does.",
        },
      ],
      outcome: [
        "43 automated tests cover the domain rules and full Telegram conversations, and CI runs them on every push.",
        "The first version, MediFast AI, was a team prototype with a 169K+ medicine catalogue and Hinglish search. It reached the Cognizant Technoverse 2026 Grand Finale: Top 24 of 2,000+ teams.",
        "A one-minute local demo runs the real bot with a customer, a pharmacist and an admin side by side.",
      ],
      honest: "MediFast is a 7th-semester major project, not a pharmacy. The pharmacies in the demo are fictional, and a pilot with real ones is the next step.",
    },
  },
  {
    slug: "yatra-sync",
    anchor: "yatra-sync",
    title: "Yatra Sync",
    year: "2026",
    kind: "Web app · algorithms",
    tagline: "Share the cab. Split it to the paisa.",
    summary:
      "Yatra Sync finds people heading the same way before you book an Ola or Uber, groups you into one cab and splits the fare by distance.",
    proofs: [
      {
        claim: "Matched on a road graph",
        proof: "Shortest paths on a directed graph, then checks for departure time, detour, waiting time, luggage and seats.",
      },
      {
        claim: "Exact to the paisa",
        proof: "Fares are split in whole paise by distance and seats. The shares always add up to the cab fare, with nothing lost to rounding.",
      },
      {
        claim: "Never more than going alone",
        proof: "Each share is capped at that rider's solo fare, including the cases where sharing would cost more.",
      },
    ],
    facts: [
      { value: "138", label: "unit and integration tests" },
      { value: "9", label: "end-to-end browser tests" },
      { value: "25–200", label: "ride requests per simulation" },
      { value: "₹0.00", label: "lost to rounding" },
    ],
    stack: ["Next.js", "TypeScript", "SQLite", "Drizzle ORM", "Zod", "Vitest", "Playwright"],
    links: [{ label: "GitHub", href: "https://github.com/Ruchin-Audichya/Yatra-Sync" }],
    image: {
      src: "/projects/yatra-sync.png",
      alt: "Yatra Sync landing page",
      width: 1440,
      height: 1000,
      caption: "The Yatra Sync app, with route shortcuts for office, station and airport trips.",
    },
    study: {
      problem: [
        "Office commutes, station transfers and airport runs are expensive to take alone.",
        "Sharing a cab with strangers means guessing who is going your way, then arguing over who owes what.",
      ],
      approach: [
        {
          title: "Match before you book",
          body: "Riders post where they are going and when. The matcher runs shortest paths on a directed road graph and only suggests groups that pass every check: departure window, detour, waiting time, walking, luggage and seats.",
        },
        {
          title: "Consent, one rider at a time",
          body: "Invitations are atomic and every rider accepts the current version of the plan. Nobody is auto-confirmed, double-booked or added to a full cab.",
        },
        {
          title: "Split in whole paise",
          body: "The fare is divided by each rider's distance and seats using integer paise, so the shares add up to the cab fare exactly. If the real fare changes, every rider reviews the new shares.",
        },
        {
          title: "Measure it",
          body: "Fixed-seed simulations of 25 to 200 ride requests compare the matcher against a baseline, with controls for delays, cancellations and outages.",
        },
      ],
      hard: [
        {
          title: "Fairness has edge cases",
          body: "A proportional split can charge a short-distance rider more than their solo fare. Shares are capped at the solo fare and the difference is redistributed.",
        },
        {
          title: "Cancellations",
          body: "When someone drops out, the group gets a replacement or a new split, and everyone consents again before anything is confirmed.",
        },
        {
          title: "Reproducible demos",
          body: "Fixtures use deterministic ids and relative future times. A fixed-clock test proves that a reset gives exactly the same data.",
        },
      ],
      outcome: [
        "138 unit and integration tests (Vitest) and 9 end-to-end browser tests (Playwright).",
        "Benchmarked on simulations of 25 to 200 ride requests, with JSON and CSV exports.",
        "Runs locally with no API keys or external accounts.",
      ],
      honest: "The Jaipur routes and prices are illustrative, and bookings and payments are self-reported. No cab, payment or identity provider is connected.",
    },
  },
  {
    slug: "placify-ai",
    anchor: "placify-ai",
    title: "Placify AI",
    year: "2026",
    kind: "Machine learning · team project",
    tagline: "Placement data, out of the spreadsheets.",
    summary:
      "A placement-prediction platform for colleges: a CatBoost model over 5,000+ student records, dashboards for coordinators and a résumé parser.",
    proofs: [],
    facts: [
      { value: "84.7%", label: "accuracy" },
      { value: "94.5%", label: "ROC-AUC" },
      { value: "5,000+", label: "student records" },
      { value: "3", label: "people on the team" },
    ],
    stack: ["Python", "CatBoost", "FastAPI", "React", "PostgreSQL"],
    links: [{ label: "GitHub", href: "https://github.com/shriya-gakkhar1/Minor-Project" }],
    study: {
      problem: [
        "Placement data was scattered across spreadsheets, résumés and manual updates from coordinators.",
        "There was no clean way to see who was ready, track a cohort or tell a student what to work on next.",
      ],
      approach: [
        {
          title: "A model coordinators can trust",
          body: "A CatBoost classifier trained on 5,000+ student records predicts placement outcomes, and was compared against SVM and logistic-regression baselines.",
        },
        {
          title: "Structured data first",
          body: "ETL workflows clean and normalise the records into PostgreSQL, which feeds KPI and cohort dashboards built in React.",
        },
        {
          title: "Résumé parsing as a service",
          body: "A FastAPI service parses résumés and runs a skill-gap analysis, so the advice is specific to the student.",
        },
      ],
      hard: [
        {
          title: "Messy inputs",
          body: "Records came from inconsistent sources, and résumés arrive as untidy PDFs with free-form skill lists.",
        },
        {
          title: "Beating simple baselines honestly",
          body: "The model had to outperform SVM and logistic regression while staying explainable enough for coordinators to act on.",
        },
      ],
      outcome: [
        "84.7% accuracy and 94.5% ROC-AUC, ahead of the SVM and logistic-regression baselines.",
        "Dashboards and structured APIs in place of manual sheets.",
      ],
      honest: "Placify AI is a team project built with two classmates.",
    },
  },
  {
    slug: "aws-cloud-labs",
    anchor: "aws-cloud-labs",
    title: "AWS Cloud Labs",
    year: "2023 –",
    kind: "Cloud automation · community",
    tagline: "Workshops that start on time.",
    summary:
      "Boto3 scripts that create EC2 instances, S3 buckets and IAM roles for AWS Cloud Club labs, instead of setting each one up by hand in the console.",
    proofs: [],
    facts: [
      { value: "1,000+", label: "students reached" },
      { value: "3", label: "services automated: EC2, S3, IAM" },
    ],
    stack: ["Python", "Boto3", "AWS EC2", "S3", "IAM"],
    links: [],
    study: {
      problem: [
        "Cloud workshops kept losing time to setup. Instances, buckets and IAM roles had to be created again for every session.",
      ],
      approach: [
        {
          title: "Script the lab",
          body: "Python and Boto3 scripts create the EC2 instances, S3 buckets and IAM roles a session needs, so students start with a working environment.",
        },
        {
          title: "Teach with it",
          body: "The same scripts back the hands-on AWS and Git workshops I run as the club's Technical Lead.",
        },
      ],
      hard: [
        {
          title: "IAM is unforgiving",
          body: "Most lab failures are permission problems. Getting roles right in a script, once, beats debugging them live in front of a room.",
        },
      ],
      outcome: ["Hands-on AWS and Git workshops for 1,000+ students at campus events and hackathons."],
      honest: "These are working scripts for club sessions, not a packaged product.",
    },
  },
];

export const flagship = projects.slice(0, 3);

export const moreWork = [
  {
    year: "2026",
    title: "Placify AI",
    kind: "ML · team project",
    blurb: "CatBoost model on 5,000+ student records predicts placements at 84.7% accuracy and 94.5% ROC-AUC.",
    href: "/projects/placify-ai",
    cta: "Case study",
  },
  {
    year: "2025",
    title: "Find My Stipend",
    kind: "Search · built with Shriya Gakkhar",
    blurb: "Blends Internshala, LinkedIn and company career pages into one internship search ranked against your résumé.",
    href: "https://wms-virid-six.vercel.app",
    cta: "Live app",
  },
  {
    year: "2025",
    title: "JECRC Grievance Portal",
    kind: "Full-stack · React, Supabase",
    blurb: "A campus system to submit, route and track grievances, with student, staff, resolver and admin roles.",
    href: "https://jecrc-grievance-portal.vercel.app",
    cta: "Live app",
  },
  {
    year: "2025",
    title: "TPO Email Tool",
    kind: "Automation · Python, Streamlit",
    blurb: "Mail-merge for JECRC's placement cell: reads a Google Sheet, personalises each email and logs every send.",
    href: "https://github.com/Ruchin-Audichya/tpo-email-tool-jecrc",
    cta: "GitHub",
  },
  {
    year: "2023 –",
    title: "AWS Cloud Labs",
    kind: "Cloud · Boto3",
    blurb: "Scripts that set up EC2, S3 and IAM for Cloud Club labs, so workshops start on time.",
    href: "/projects/aws-cloud-labs",
    cta: "Case study",
  },
] as const;

export const experience = [
  {
    period: "Dec 2025 – Mar 2026",
    role: "Software Engineering Intern",
    org: "SecretEye Telematics",
    where: "Remote",
    points: [
      "Built the team's internal operations app with React and TypeScript on an Express.js and MongoDB backend. It brought CRM, HR and finance tracking into one dashboard and replaced 4 separate spreadsheets.",
      "Wrote 20+ REST APIs over 6 MongoDB collections, plus scripts that collect social-media posts into the database for market research.",
    ],
  },
  {
    period: "Sep 2023 – now",
    role: "Technical Lead",
    org: "AWS Cloud Club, JECRC University",
    where: "Jaipur",
    points: [
      "Automated student lab setup on EC2, S3 and IAM with Python and Boto3, instead of manual work in the console.",
      "Ran hands-on AWS and Git workshops for 1,000+ students at campus events and hackathons.",
    ],
  },
  {
    period: "2023 – 2027",
    role: "B.Tech, Computer Science Engineering",
    org: "JECRC University",
    where: "Jaipur",
    points: ["AWS Cloud specialisation · CGPA 8.2 / 10"],
  },
] as const;

export const certifications = [
  {
    title: "Solutions Architect – Associate",
    issuer: "AWS",
    year: "2026",
    image: "/certificates/aws-solutions-architect-badge.png",
    href: "https://www.credly.com/badges/14a84662-959b-4450-9fe0-39e914210f25/public_url",
  },
  {
    title: "AI Practitioner",
    issuer: "AWS",
    year: "2026",
    image: "/certificates/aws-ai-practitioner-badge.png",
    href: "https://www.credly.com/badges/20ba1db5-c6e1-4f12-9400-8546b7102d5f/public_url",
  },
  {
    title: "Cloud Practitioner",
    issuer: "AWS",
    year: "2025",
    image: "/certificates/aws-cloud-practitioner-badge.png",
    href: "https://www.credly.com/badges/daee29ab-3939-4d21-8ea5-86e3dbfda8b1/public_url",
  },
  {
    title: "Certified System Administrator",
    issuer: "ServiceNow",
    year: "2026",
    image: "/certificates/servicenow-csa-badge.png",
    href: "https://www.credly.com/badges/01176bad-90e8-42ea-9813-00f869263665/public_url",
  },
] as const;

export const achievements = [
  { value: "Top 24", label: "of 2,000+ teams", source: "Cognizant Technoverse 2026, Grand Finale" },
  { value: "Top 10", label: "in the prelims", source: "Smart India Hackathon 2024" },
  { value: "250+", label: "problems solved", source: "LeetCode and Codeforces" },
  { value: "1,000+", label: "students taught", source: "AWS and Git workshops" },
] as const;

export const story = {
  intro: [
    "I have been fixing computers for other people since class six. First on camera, now in code.",
    "It started with troubleshooting videos and PC gaming forums, and the habit stuck: find a real problem, work out why it happens, build the fix, then show that it works. The projects above are the same habit with better tools.",
  ],
  timeline: [
    {
      when: "2009",
      title: "Player one",
      body: "Started gaming on PC and found my people in game communities and forums. The old internet taught me how much a small, well-made thing can matter.",
    },
    {
      when: "2016",
      title: "Tech tutorials on YouTube",
      body: "Raised on Linus Tech Tips, I started a channel in class six: fixing Windows errors, testing hardware, answering the questions I kept running into. I lost it years later when my old email was hijacked. Lesson learned: turn on two-factor authentication.",
    },
    {
      when: "School",
      title: "First side business",
      body: "Sold Windows and Microsoft Office licence keys on the side. My first taste of running something with real customers.",
    },
    {
      when: "2019",
      title: "National-level badminton",
      body: "Played badminton at the national level. Same lesson as ranked matches: practise the boring parts.",
    },
    {
      when: "2023",
      title: "JECRC and the AWS Cloud Club",
      body: "Started B.Tech in computer science and became the club's Technical Lead, teaching AWS and Git to 1,000+ students. Still explaining tech to people, just without the webcam.",
    },
    {
      when: "2026",
      title: "Shipping things people can use",
      body: "Interned as a software engineer, took MediFast AI to the Cognizant Technoverse Grand Finale, then built Yatra Sync and Anvil. Anvil is the tool that kid would have wanted.",
    },
  ],
} as const;

/** Short lines for the marquee: every one is a claim a project on this site backs up. */
export const marquee = [
  "Exact to the paisa",
  "No PC, no root",
  "Pan 20 never becomes Pan 40",
  "Verified, not just compiled",
  "Tested end to end",
  "Built in Jaipur",
] as const;

export const toolbox = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Kotlin", "Java", "C++", "SQL"] },
  { group: "Backend & web", items: ["Node.js", "Express.js", "FastAPI", "Next.js", "React", "REST APIs", "Telegram Bot API"] },
  { group: "Data & AI", items: ["MongoDB", "PostgreSQL", "SQLite", "ChromaDB", "RAG", "CatBoost", "scikit-learn"] },
  { group: "Cloud & tools", items: ["AWS (EC2, S3, IAM, CloudWatch)", "Boto3", "Docker", "Git", "GitHub Actions", "Linux"] },
] as const;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
