import type { Metadata } from "next";
import { content } from "@/lib/content";

const siteUrl = "https://ruchinaudichya.in";

export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: `${content.profile.name} - ${content.profile.role}`,
        template: `%s | ${content.profile.name}`,
    },
    description: content.profile.bio.join(" ").slice(0, 160),
    keywords: [
        "Full Stack Developer",
        "Web Developer",
        "React",
        "Next.js",
        "TypeScript",
        "Three.js",
        "Frontend",
        "Backend",
        "Portfolio",
        content.profile.name,
    ],
    authors: [{ name: content.profile.name }],
    creator: content.profile.name,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteUrl,
        siteName: `${content.profile.name} Portfolio`,
        title: `${content.profile.name} - ${content.profile.role}`,
        description: content.profile.bio.join(" ").slice(0, 160),
        images: [
            {
                url: `${siteUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: `${content.profile.name} Portfolio`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${content.profile.name} - ${content.profile.role}`,
        description: content.profile.bio.join(" ").slice(0, 160),
        creator: "@ruchinaudichya",
        images: [`${siteUrl}/og-image.png`],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/icon.svg",
        shortcut: "/icon.svg",
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
};

export const generatePersonSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.profile.name,
    jobTitle: content.profile.role,
    url: siteUrl,
    sameAs: [
        content.profile.socials.github,
        content.profile.socials.linkedin,
        content.profile.socials.twitter,
    ],
    image: content.profile.avatar,
    email: content.profile.socials.email,
});

export const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${content.profile.name} Portfolio`,
    url: siteUrl,
    description: content.profile.bio.join(" "),
    author: {
        "@type": "Person",
        name: content.profile.name,
    },
});
