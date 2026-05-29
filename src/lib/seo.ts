import { content } from "@/lib/content";

export const SITE_URL = "https://ruchinaudichya.in";
export const SITE_NAME = "Ruchin Audichya";
export const SITE_DESCRIPTION =
  "Official portfolio of Ruchin Audichya — Data-driven ML Engineer in Jaipur, India. Builder of MediFast AI (RAG over a 169K-record knowledge graph with 1.3M+ edges) and Placify AI (84.7% accuracy, 94.5% ROC-AUC). AWS and ServiceNow certified.";
export const OG_IMAGE = `${SITE_URL}/readme-hero.png`;

// Every public profile / page that says “Ruchin Audichya” somewhere.
// More entries here = stronger entity disambiguation in Google's knowledge graph.
export const SAME_AS = [
  "https://www.linkedin.com/in/ruchinaudi/",
  "https://github.com/Ruchin-Audichya",
  "https://x.com/itsRuchin",
  "https://twitter.com/itsRuchin",
  "https://www.instagram.com/ruchin_audichya/",
  "https://www.credly.com/users/ruchin-audichya",
  "https://leetcode.com/u/ruchinaudichya/",
  "https://www.hackerrank.com/profile/ruchinaudichya",
];

export const generatePersonSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Ruchin Audichya",
  alternateName: ["Ruchin", "Ruchin A.", "ruchinaudichya"],
  givenName: "Ruchin",
  familyName: "Audichya",
  jobTitle: "Data-driven ML Engineer",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: {
    "@type": "ImageObject",
    url: OG_IMAGE,
    width: 1200,
    height: 630,
  },
  email: `mailto:${content.profile.email}`,
  telephone: content.profile.phone,
  nationality: { "@type": "Country", name: "India" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "JECRC University",
    sameAs: "https://www.jecrcuniversity.edu.in/",
  },
  worksFor: {
    "@type": "Organization",
    name: "SecretEye Telematics",
  },
  knowsLanguage: ["en", "hi"],
  award: [
    "Cognizant Technoverse 2026 — Top 24 nationwide (Grand Finale Qualifier)",
    "Smart India Hackathon 2024 — Prelims Top 10 Finalist",
    "AWS Certified AI Practitioner",
    "AWS Certified Cloud Practitioner",
    "ServiceNow Certified System Administrator",
    "ServiceNow Certified Application Developer",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Machine Learning Engineer",
    occupationLocation: {
      "@type": "City",
      name: "Jaipur, India",
    },
    skills: [
      "Retrieval-Augmented Generation (RAG)",
      "Knowledge Graphs",
      "Vector Databases",
      "ChromaDB",
      "BM25",
      "LangChain",
      "PyTorch",
      "Scikit-learn",
      "CatBoost",
      "FastAPI",
      "Node.js",
      "AWS",
      "Docker",
      "PostgreSQL",
      "MongoDB",
      "Python",
      "TypeScript",
    ],
  },
  hasCredential: content.certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.title,
    credentialCategory: "Professional certification",
    recognizedBy: { "@type": "Organization", name: c.issuer },
    ...(c.credentialUrl ? { url: c.credentialUrl } : {}),
  })),
  sameAs: SAME_AS,
  knowsAbout: [
    "Ruchin Audichya",
    "MediFast AI",
    "Placify AI",
    "RAG",
    "Knowledge Graphs",
    "Machine Learning",
    "Vector Databases",
    "AWS",
    "ServiceNow",
    "JECRC University",
    "Jaipur AI Engineer",
  ],
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: `${SITE_NAME} Portfolio`,
  alternateName: ["Ruchin Audichya", "ruchinaudichya.in"],
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#person` },
  inLanguage: "en-IN",
  mainEntity: { "@id": `${SITE_URL}/#person` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const generateProfilePageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profilepage`,
  url: SITE_URL,
  name: "Ruchin Audichya — Data-driven ML Engineer",
  description: SITE_DESCRIPTION,
  inLanguage: "en-IN",
  mainEntity: { "@id": `${SITE_URL}/#person` },
  about: { "@id": `${SITE_URL}/#person` },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: OG_IMAGE,
    width: 1200,
    height: 630,
  },
  dateCreated: "2024-01-01",
  dateModified: new Date().toISOString().slice(0, 10),
  hasPart: content.projects.map((project) => ({
    "@type": "CreativeWork",
    name: project.title,
    headline: project.category,
    description: project.description,
    url: `${SITE_URL}/projects/${project.slug}`,
    dateCreated: project.year,
    creator: { "@id": `${SITE_URL}/#person` },
    keywords: project.tech.join(", "),
  })),
});

// Strong direct-name-search signal: a FAQPage of common queries about you.
// Google often expands these as rich results when someone searches the name.
export const generateFaqSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Ruchin Audichya?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ruchin Audichya is a data-driven ML engineer based in Jaipur, India. He builds retrieval-heavy AI systems and knowledge-graph pipelines, and is the creator of MediFast AI (RAG over a 169K-record medicine knowledge graph with 1.3M+ relationship edges) and Placify AI (a CatBoost classification pipeline reaching 84.7% accuracy and 94.5% ROC-AUC).",
      },
    },
    {
      "@type": "Question",
      name: "Where can I see Ruchin Audichya's portfolio?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "The official portfolio of Ruchin Audichya is at ruchinaudichya.in. It links to his GitHub, LinkedIn, project case studies, and verified Credly credentials.",
      },
    },
    {
      "@type": "Question",
      name: "What is Ruchin Audichya certified in?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ruchin Audichya holds AWS Certified AI Practitioner, AWS Certified Cloud Practitioner, ServiceNow Certified System Administrator (CSA), and ServiceNow Certified Application Developer (CAD) certifications. Verification badges are linked from the credentials section of ruchinaudichya.in.",
      },
    },
    {
      "@type": "Question",
      name: "What technologies does Ruchin Audichya specialize in?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ruchin Audichya specializes in Retrieval-Augmented Generation (RAG), knowledge graphs, vector databases (ChromaDB), BM25 hybrid retrieval, LangChain, PyTorch, CatBoost, FastAPI, Node.js, AWS, Docker, PostgreSQL, and MongoDB.",
      },
    },
    {
      "@type": "Question",
      name: "Where does Ruchin Audichya study?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ruchin Audichya is a Computer Science Engineering undergraduate at JECRC University in Jaipur, India, with an AWS Cloud Specialization. He also leads the AWS Cloud Club at JECRC University.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contact Ruchin Audichya for hiring?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ruchin Audichya can be reached at ruchinaudichya100@gmail.com or through LinkedIn at linkedin.com/in/ruchinaudi/. He is currently open to AI / ML, data engineering, and cloud roles.",
      },
    },
  ],
});

export const generateBreadcrumb = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateArticleSchema = (post: {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
}) => ({
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
  image: OG_IMAGE,
  inLanguage: "en-IN",
  keywords: post.tags.join(", "),
  url: `${SITE_URL}/blog/${post.slug}`,
});

export const generateSoftwareSchema = (project: {
  title: string;
  description: string;
  category: string;
  tech: string[];
  slug: string;
  year?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/projects/${project.slug}#software`,
  name: project.title,
  applicationCategory: project.category,
  description: project.description,
  url: `${SITE_URL}/projects/${project.slug}`,
  author: { "@id": `${SITE_URL}/#person` },
  creator: { "@id": `${SITE_URL}/#person` },
  programmingLanguage: project.tech,
  operatingSystem: "Web",
  inLanguage: "en-IN",
  ...(project.year ? { dateCreated: project.year } : {}),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
});
