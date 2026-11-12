import type { Metadata } from "next";
import { certifications, projects, site, toolbox } from "@/lib/content";

export const SITE_URL = site.url;
export const SITE_NAME = site.name;
export const SITE_TITLE = "Ruchin Audichya — Software Engineer in Jaipur";

const SAME_AS = [
  site.socials.linkedin,
  site.socials.github,
  site.socials.x,
  site.socials.instagram,
  site.socials.leetcode,
  "https://www.credly.com/users/ruchin-audichya",
];

const keywords = [
  "Ruchin Audichya",
  "Ruchin Audichya portfolio",
  "Ruchin Audichya software engineer",
  "Ruchin Audichya Jaipur",
  "Ruchin Audichya JECRC",
  "Ruchin Audichya GitHub",
  "Anvil bootable USB Android",
  "MediFast Telegram bot",
  "Yatra Sync cab sharing fare split",
  "Software Engineer Jaipur",
  "Graduate Engineer Trainee 2027",
  "AWS Certified Solutions Architect Associate",
  "Cognizant Technoverse 2026 finalist",
];

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: `${SITE_NAME} — Portfolio`,
  title: { default: SITE_TITLE, template: "%s — Ruchin Audichya" },
  description: site.description,
  keywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: SITE_URL,
    siteName: `${SITE_NAME} — Portfolio`,
    title: SITE_TITLE,
    description: site.description,
    firstName: "Ruchin",
    lastName: "Audichya",
    username: "ruchinaudichya",
  },
  twitter: {
    card: "summary_large_image",
    site: "@itsRuchin",
    creator: "@itsRuchin",
    title: SITE_TITLE,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

// ---- Structured data -------------------------------------------------

export const personSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: SITE_NAME,
  alternateName: ["Ruchin", "ruchinaudichya", site.nameDeva],
  givenName: "Ruchin",
  familyName: "Audichya",
  jobTitle: "Software Engineer",
  description: site.description,
  url: SITE_URL,
  image: `${SITE_URL}/profile.jpg`,
  email: `mailto:${site.email}`,
  nationality: { "@type": "Country", name: "India" },
  address: { "@type": "PostalAddress", addressLocality: "Jaipur", addressRegion: "Rajasthan", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "JECRC University", sameAs: "https://www.jecrcuniversity.edu.in/" },
  knowsLanguage: ["en", "hi"],
  award: [
    "Cognizant Technoverse 2026 — Grand Finale, Top 24 of 2,000+ teams (MediFast AI)",
    "Smart India Hackathon 2024 — Top 10 in the prelims",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Software Engineer",
    occupationLocation: { "@type": "City", name: "Jaipur, India" },
    skills: toolbox.flatMap((g) => [...g.items]),
  },
  hasCredential: certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: `${c.issuer} ${c.title}`,
    credentialCategory: "Professional certification",
    recognizedBy: { "@type": "Organization", name: c.issuer },
    url: c.href,
  })),
  sameAs: SAME_AS,
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: `${SITE_NAME} — Portfolio`,
  alternateName: ["Ruchin Audichya", "ruchinaudichya.in"],
  url: SITE_URL,
  description: site.description,
  publisher: { "@id": `${SITE_URL}/#person` },
  inLanguage: "en-IN",
});

export const profilePageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profilepage`,
  url: SITE_URL,
  name: SITE_TITLE,
  description: site.description,
  inLanguage: "en-IN",
  mainEntity: { "@id": `${SITE_URL}/#person` },
  hasPart: projects.map((p) => ({
    "@type": "CreativeWork",
    name: p.title,
    headline: p.tagline,
    description: p.summary,
    url: `${SITE_URL}/projects/${p.slug}`,
    creator: { "@id": `${SITE_URL}/#person` },
    keywords: p.stack.join(", "),
  })),
});

const faq = [
  {
    q: "Who is Ruchin Audichya?",
    a: "Ruchin Audichya is a software engineer from Jaipur, India and a final-year B.Tech CSE student at JECRC University (class of 2027). He built Anvil, an Android app that makes bootable Windows and Linux USB drives without a PC or root, MediFast, a Telegram bot that asks nearby pharmacies for a medicine list (its first version reached the Top 24 of 2,000+ teams at Cognizant Technoverse 2026), and Yatra Sync, a shared-cab matching and fare-split app.",
  },
  {
    q: "Where can I see Ruchin Audichya's portfolio?",
    a: "The official portfolio of Ruchin Audichya is at ruchinaudichya.in. It links to his GitHub, LinkedIn, project case studies and verified Credly credentials.",
  },
  {
    q: "What is Ruchin Audichya certified in?",
    a: "Ruchin Audichya holds the AWS Certified Solutions Architect – Associate, AWS Certified AI Practitioner, AWS Certified Cloud Practitioner and ServiceNow Certified System Administrator (CSA) certifications.",
  },
  {
    q: "How can I contact Ruchin Audichya?",
    a: `Ruchin Audichya can be reached at ${site.email} or on LinkedIn at linkedin.com/in/ruchinaudi. He is looking for Software Engineer and Graduate Engineer Trainee roles. His résumé is at ruchinaudichya.in/resume.pdf.`,
  },
];

export const faqSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: item.url })),
});

export const articleSchema = (post: { title: string; description: string; date: string; slug: string; tags: string[] }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${SITE_URL}/blog/${post.slug}#article`,
  headline: post.title,
  description: post.description,
  author: { "@id": `${SITE_URL}/#person` },
  publisher: { "@id": `${SITE_URL}/#person` },
  datePublished: post.date,
  dateModified: post.date,
  mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  inLanguage: "en-IN",
  keywords: post.tags.join(", "),
});

export const softwareSchema = (p: { title: string; summary: string; kind: string; stack: string[]; slug: string }) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "@id": `${SITE_URL}/projects/${p.slug}#software`,
  name: p.title,
  description: p.summary,
  genre: p.kind,
  url: `${SITE_URL}/projects/${p.slug}`,
  author: { "@id": `${SITE_URL}/#person` },
  programmingLanguage: p.stack,
  inLanguage: "en-IN",
});

/** Renders a JSON-LD script tag's props. */
export const jsonLd = (data: unknown) => ({
  type: "application/ld+json",
  dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
});
