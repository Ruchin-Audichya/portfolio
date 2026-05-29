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
  // Role + location queries.
  "Data-driven ML Engineer India",
  "AI ML Engineer Jaipur",
  "RAG Engineer India",
  "Knowledge Graph Engineer India",
  // Project-specific queries.
  "MediFast AI",
  "Placify AI",
  "RAG medicine search",
  "BM25 ChromaDB hybrid retrieval",
  // Credential queries.
  "AWS Certified AI Practitioner India",
  "AWS Certified Cloud Practitioner",
  "ServiceNow CSA",
  "ServiceNow CAD",
  // Hackathon recognition.
  "Cognizant Technoverse 2026 finalist",
  "Smart India Hackathon 2024",
];

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: `${SITE_NAME} Portfolio`,
  title: {
    // Putting the name first + last + descriptor maximizes direct-name match.
    default: "Ruchin Audichya — Data-driven ML Engineer | Portfolio",
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
    title: "Ruchin Audichya — Data-driven ML Engineer",
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
    title: "Ruchin Audichya — Data-driven ML Engineer",
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    other: [{ rel: "mask-icon", url: "/favicon.svg", color: "#22d3ee" }],
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
