import type { Metadata } from "next";
import { content } from "@/lib/content";

const siteUrl = "https://ruchinaudichya.in";
const siteName = "Ruchin Audichya";
const siteDescription =
    "Ruchin Audichya is an AI/ML Engineer, Cloud and Backend developer in Jaipur, India building MediFastRx, Placify AI, AWS automation and production-ready AI systems.";
const ogImage = `${siteUrl}/readme-hero.png`;
const seoKeywords = [
    "Ruchin Audichya",
    "Ruchin Audichya portfolio",
    "Ruchin Audichya AI ML Engineer",
    "AI ML Engineer India",
    "AI ML Engineer Jaipur",
    "Backend Developer India",
    "Cloud Engineer India",
    "AWS Certified AI Practitioner",
    "AWS Certified Cloud Practitioner",
    "ServiceNow Certified System Administrator",
    "ServiceNow Certified Application Developer",
    "MediFastRx",
    "Placify AI",
    "Python Developer",
    "Node.js Developer",
    "Next.js Developer",
    "Telegram AI medicine assistant",
    "RAG medicine search",
    "Fuzzy Search",
    "AI Healthcare Assistant India",
];

export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteUrl),
    applicationName: `${siteName} Portfolio`,
    title: {
        default: `${content.profile.name} - AI/ML Engineer, Cloud & Backend Developer`,
        template: `%s | ${content.profile.name}`,
    },
    description: siteDescription,
    keywords: seoKeywords,
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
        title: `${content.profile.name} - AI/ML Engineer, Cloud & Backend Developer`,
        description: siteDescription,
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: `${content.profile.name} portfolio preview for AI/ML, Cloud, and Backend engineering`,
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@itsRuchin",
        creator: "@itsRuchin",
        title: `${content.profile.name} - AI/ML Engineer, Cloud & Backend Developer`,
        description: siteDescription,
        images: {
            url: ogImage,
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
    description: siteDescription,
    url: siteUrl,
    sameAs: [
        content.profile.socials.github,
        content.profile.socials.linkedin,
        content.profile.socials.twitter,
    ].filter(Boolean),
    image: {
        "@type": "ImageObject",
        url: ogImage,
        width: 1200,
        height: 630,
    },
    email: content.profile.socials.email,
    telephone: content.profile.phone,
    address: {
        "@type": "PostalAddress",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
    },
    alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "JECRC University",
    },
    hasCredential: content.certifications.map((certification) => ({
        "@type": "EducationalOccupationalCredential",
        name: certification.title,
        credentialCategory: "Professional certification",
        recognizedBy: {
            "@type": "Organization",
            name: certification.issuer,
        },
    })),
    knowsAbout: [
        "AI Engineering",
        "Machine Learning",
        "Retrieval-Augmented Generation",
        "Fuzzy Search",
        "Natural Language Processing",
        "Backend Development",
        "Cloud Engineering",
        "AWS",
        "Docker",
        "Terraform",
        "Python",
        "PyTorch",
        "TensorFlow",
        "Hugging Face",
        "LangChain",
        "Next.js",
        "Node.js",
        "Flask",
        "REST APIs",
        "PostgreSQL",
        "MongoDB",
        "ServiceNow",
        "Salesforce",
        "MediFastRx",
        "Placify AI",
    ],
});

export const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: `${content.profile.name} Portfolio`,
    url: siteUrl,
    description: siteDescription,
    publisher: {
        "@id": `${siteUrl}/#person`,
    },
    inLanguage: "en-US",
    mainEntity: {
        "@id": `${siteUrl}/#person`,
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
    dateModified: "2026-05-25",
    about: {
        "@id": `${siteUrl}/#person`,
    },
    primaryImageOfPage: {
        "@type": "ImageObject",
        url: ogImage,
        width: 1200,
        height: 630,
    },
    hasPart: content.projects.map((project) => ({
        "@type": "CreativeWork",
        name: project.title,
        headline: project.category,
        description: project.description,
        url: `${siteUrl}/projects/${project.slug}`,
        dateCreated: project.year,
        creator: {
            "@id": `${siteUrl}/#person`,
        },
        keywords: project.tech.join(", "),
    })),
});
