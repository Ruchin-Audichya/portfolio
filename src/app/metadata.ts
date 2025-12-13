import type { Metadata } from "next";
import { content } from "@/lib/content";

const siteUrl = "https://ruchinaudichya.in";
const siteName = "Ruchin Audichya";

export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: `${content.profile.name} - ${content.profile.role}`,
        template: `%s | ${content.profile.name}`,
    },
    description: content.profile.bio.join(" ").slice(0, 160),
    keywords: [
        "Ruchin Audichya",
        "Full Stack Developer",
        "Cloud Engineer",
        "DevOps Engineer",
        "AWS Cloud Practitioner",
        "Salesforce Developer",
        "React Developer",
        "Next.js Developer",
        "TypeScript",
        "Three.js",
        "Web Developer India",
        "Software Engineer Portfolio",
        "Frontend Developer",
        "Backend Developer",
        "Node.js",
        "PostgreSQL",
        "Terraform",
        "Linux Administrator",
        "API Development",
        "Cloud Architecture",
    ],
    authors: [{ name: content.profile.name, url: siteUrl }],
    creator: content.profile.name,
    publisher: content.profile.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: siteUrl,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteUrl,
        siteName: `${siteName} Portfolio`,
        title: `${content.profile.name} - ${content.profile.role}`,
        description: content.profile.bio.join(" ").slice(0, 160),
        images: [
            {
                url: `${siteUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: `${content.profile.name} - Full Stack Developer & Cloud Engineer`,
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@ruchinaudichya",
        creator: "@ruchinaudichya",
        title: `${content.profile.name} - ${content.profile.role}`,
        description: content.profile.bio.join(" ").slice(0, 160),
        images: {
            url: `${siteUrl}/og-image.png`,
            alt: `${content.profile.name} Portfolio`,
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
        // Add your verification codes here when available
        // google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
    },
    category: "technology",
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/logo.svg", type: "image/svg+xml" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        shortcut: "/favicon.svg",
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
        other: [
            { rel: "mask-icon", url: "/favicon.svg", color: "#00F0FF" },
        ],
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: siteName,
    },
};

export const generatePersonSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: content.profile.name,
    givenName: "Ruchin",
    familyName: "Audichya",
    jobTitle: content.profile.role,
    description: content.profile.bio.join(" "),
    url: siteUrl,
    sameAs: [
        content.profile.socials.github,
        content.profile.socials.linkedin,
        content.profile.socials.twitter,
    ].filter(Boolean),
    image: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
    },
    email: content.profile.socials.email,
    knowsAbout: [
        "Full Stack Development",
        "Cloud Engineering",
        "AWS",
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "DevOps",
        "Three.js",
    ],
});

export const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: `${content.profile.name} Portfolio`,
    url: siteUrl,
    description: content.profile.bio.join(" "),
    publisher: {
        "@id": `${siteUrl}/#person`,
    },
    inLanguage: "en-US",
    potentialAction: {
        "@type": "SearchAction",
        target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
    },
});

export const generatePortfolioSchema = () => ({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    mainEntity: {
        "@id": `${siteUrl}/#person`,
    },
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    about: {
        "@id": `${siteUrl}/#person`,
    },
});
