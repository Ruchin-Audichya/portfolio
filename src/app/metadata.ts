import type { Metadata } from "next";
import { content } from "@/lib/content";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  OG_IMAGE,
  generatePersonSchema,
  generateWebsiteSchema,
  generateProfilePageSchema,
  generateFaqSchema,
} from "@/lib/seo";

// Re-export schema generators for backward compatibility with existing imports.
export {
  generatePersonSchema,
  generateWebsiteSchema,
  generateFaqSchema,
};
export const generatePortfolioSchema = generateProfilePageSchema;

const seoKeywords = [
  // Direct-name queries — these are the highest-value keywords for personal SEO.
  "Ruchin Audichya",
  "Ruchin",
  "Ruchin Audichya portfolio",
  "Ruchin Audichya Jaipur",
  "Ruchin Audichya JECRC",
  "Ruchin Audichya AI",
  "Ruchin Audichya GitHub",
  "Ruchin Audichya LinkedIn",
  "Ruchin Audichya resume",
  "ruchinaudichya",
  "ruchinaudichya.in",
  "Ruchin Audichya software engineer",
  "Ruchin Audichya Yatra Sync",
  "Ruchin Audichya MediFast",
  // Role + location queries.
  "Software Engineer Jaipur",
  "Graduate Engineer Trainee 2027",
  "Node.js TypeScript developer India",
  "Backend developer Jaipur",
  "AWS Solutions Architect Associate Jaipur",
  // Project-specific queries.
  "MediFast AI",
  "MediFast AI Telegram bot",
  "Yatra Sync",
  "Yatra Sync cab sharing fare split",
  "Placify AI",
  // Credential queries.
  "AWS Certified AI Practitioner India",
  "AWS Certified Cloud Practitioner",
  "AWS Certified Solutions Architect Associate",
  "ServiceNow CSA",
  // Hackathon recognition.
  "Cognizant Technoverse 2026 finalist",
  "Cognizant Technoverse 2026 Top 24",
  "Smart India Hackathon 2024",
];

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: `${SITE_NAME} Portfolio`,
  title: {
    // Putting the name first + last + descriptor maximizes direct-name match.
    default: "Ruchin Audichya — Software Engineer, AI & Cloud | Jaipur",
    template: `%s | Ruchin Audichya`,
  },
  description: SITE_DESCRIPTION,
  keywords: seoKeywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: SITE_URL,
    siteName: `${SITE_NAME} Portfolio`,
    title: "Ruchin Audichya — Software Engineer, AI & Cloud",
    description: SITE_DESCRIPTION,
    firstName: "Ruchin",
    lastName: "Audichya",
    username: "ruchinaudichya",
    gender: "male",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Ruchin Audichya — RAG, knowledge graphs, cloud, and applied AI",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@itsRuchin",
    creator: "@itsRuchin",
    title: "Ruchin Audichya — Software Engineer, AI & Cloud",
    description: SITE_DESCRIPTION,
    images: {
      url: OG_IMAGE,
      alt: "Ruchin Audichya Portfolio",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Drop your real Google Search Console verification code here once added.
    // google: "your-google-verification-code",
  },
  category: "technology",
  // Arch-RA identity. favicon.ico (16/32/48) is kept for old browsers, IE9 included.
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "mask-icon", url: "/favicon.svg", color: "#C8205E" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  other: {
    // Mastodon / Fediverse identity verification (harmless if unused).
    // "fediverse:creator": "@ruchin@mastodon.social",
  },
};

// Keep legacy named-export available for any existing imports.
export const siteUrl = SITE_URL;
export const siteName = SITE_NAME;
export const siteDescription = SITE_DESCRIPTION;
export const ogImage = OG_IMAGE;
export const _seoKeywords = seoKeywords;
