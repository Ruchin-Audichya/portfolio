import type { Metadata } from "next";
import { content } from "@/lib/content";

const siteUrl = "https://ruchinaudichya.in";
const siteName = "Ruchin Audichya";
const siteDescription =
    "Ruchin Audichya is a data-driven ML engineer in Jaipur, India. Builder of MediFast AI (RAG over a 169K-record knowledge graph with 1.3M+ edges), Placify AI (84.7% accuracy / 94.5% ROC-AUC), and AWS-backed automation.";
const ogImage = `${siteUrl}/readme-hero.png`;
const seoKeywords = [
    "Ruchin Audichya",
    "Ruchin Audichya portfolio",
    "Ruchin Audichya AI ML Engineer",
    "AI ML Engineer India",
    "Data-driven ML Engineer Jaipur",
    "RAG engineer India",
    "Knowledge Graph Engineer",
    "MediFast AI",
    "Placify AI",
    "BM25",
    "ChromaDB",
    "LangChain",
    "AWS Certified AI Practitioner",
    "AWS Certified Cloud Practitioner",
    "ServiceNow Certified System Administrator",
    "ServiceNow Certified Application Developer",
    "Backend Developer India",
    "Cloud Engineer India",
    "Python Developer",
    "FastAPI Developer",
    "Cognizant Technoverse 2026",
    "Smart India Hackathon 2024",
];

export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteUrl),
    applicationName: `${siteName} Portfolio`,
    title: {
        default: `${content.profile.name} — Data-driven ML Engineer • RAG • Cloud`,
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
        title: `${content.profile.name} — Data-driven ML Engineer • RAG • Cloud`,
        description: siteDescription,
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: `${content.profile.name} — RAG, knowledge graphs, cloud, and applied AI`,
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@itsRuchin",
        creator: "@itsRuchin",
        title: `${content.profile.name} — Data-driven ML Engineer • RAG • Cloud`,
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
        ],
        shortcut: "/favicon.svg",
        other: [
            { rel: "mask-icon", url: "/favicon.svg", color: "#22d3ee" },
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
        "Knowledge Graphs",
        "Vector Databases",
        "ChromaDB",
        "BM25",
        "LangChain",
        "ETL Pipelines",
        "Data Engineering",
        "Geospatial Indexing",
        "Backend Development",
        "Cloud Engineering",
        "AWS",
        "Boto3",
        "Docker",
        "Terraform",
        "Python",
        "PyTorch",
        "Hugging Face",
        "Next.js",
        "Node.js",
        "FastAPI",
        "Express.js",
        "REST APIs",
        "PostgreSQL",
        "MongoDB",
        "ServiceNow",
        "MediFast AI",
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
    dateModified: new Date().toISOString().slice(0, 10),
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
