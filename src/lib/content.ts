export const content = {
  profile: {
    name: "Ruchin Audichya",
    role: "Data-driven ML Engineer • RAG • Cloud",
    headline: "Data-driven ML Engineer • RAG • Cloud",
    subline:
      "I build ML systems, knowledge-graph pipelines, and applied AI products that ship. Currently obsessed with retrieval that actually works.",
    mission:
      "I build retrieval-heavy AI systems, backend APIs, and cloud automation that turn messy real-world data into reliable products.",
    bio_title: "From broken PCs to production AI.",
    bio: [
      "Hey — I'm Ruchin. Short version: I build retrieval-heavy AI systems that ship. Longer version starts with a PC fan I shouldn't have ignored.",
      "Around 2017 I cracked open my first rig because the fan was loud and I wanted to know why. That turned into a few years of overclocking things I shouldn't have, breaking them, fixing them, and eventually building custom PCs for friends and clients around me. Gaming taught me to care about frame budgets. Linux taught me that systems behave like systems whether they're made of silicon or software.",
      "By the time college started, the curiosity had moved up the stack — hardware to operating systems to code to data to ML. I leaned into the parts of computer science that kept the same hands-on feeling: what's actually happening here, why is it slow, can I make it faster.",
      "The work I'm proudest of lives at that intersection. MediFast AI is a RAG system over a 169K-record medicine knowledge graph with 1.3M+ edges, built to handle Indian-language symptom queries and typos most search ignores — it lifted match rate by 18 percentage points and made the Cognizant Technoverse 2026 Grand Finale, Top 24 out of 2,000+ teams nationwide. Placify AI came from wanting to clean up messy placement data closer to home, and turned into a CatBoost classifier at 84.7% accuracy with a FastAPI resume parser sitting in front of it.",
      "Outside the code, I lead the AWS Cloud Club at JECRC and have helped run cloud and Git workshops for 1,000+ students. AWS Solutions Architect, AWS AI, AWS Cloud, and ServiceNow CSA all picked up along the way.",
      "Same curiosity that started with that noisy fan, just running on different silicon now. If that's the kind of energy you want on your team, my inbox is open."
    ],
    avatar: "/profile.jpg",
    resume: "/resume.pdf",
    email: "ruchinaudichya100@gmail.com",
    phone: "+91-90249-25829",
    location: "Jaipur, Rajasthan, India",
    socials: {
      email: "ruchinaudichya100@gmail.com",
      github: "https://github.com/Ruchin-Audichya",
      linkedin: "https://www.linkedin.com/in/ruchinaudi/",
      instagram: "https://www.instagram.com/ruchin_audichya/",
      twitter: "https://x.com/itsRuchin"
    },
    contactLinks: {
      email: "mailto:ruchinaudichya100@gmail.com?subject=Hiring%20Opportunity%20for%20Ruchin",
      phone: "tel:+919024925829",
      github: "https://github.com/Ruchin-Audichya",
      linkedin: "https://www.linkedin.com/in/ruchinaudi/",
      resume: "/resume.pdf"
    },
    badges: [
      "AWS Solutions Architect",
      "AWS AI Certified",
      "AWS Cloud Certified",
      "Cognizant Technoverse Top-24"
    ]
  },
  recruiterSnapshot: {
    roleFit: ["AI / ML Engineer", "Data Engineer", "Backend / Cloud"],
    strengths: [
      "I design retrieval pipelines that hold up on real, messy data — not benchmark sets",
      "I ship the whole thing, not just the model. ETL, APIs, dashboards, deployment, the works",
      "I move fluently across the stack: Python, Node, AWS, MongoDB, PostgreSQL, ChromaDB, LangChain"
    ],
    proofPoints: [
      "MediFast AI — 169K-record knowledge graph, 1.3M+ edges, +18 pp search accuracy",
      "Placify AI — 84.7% accuracy and 94.5% ROC-AUC on 5K+ student records",
      "Data / ML Intern at SecretEye Telematics (Dec 2025 – Mar 2026)",
      "AWS Solutions Architect + AWS AI + AWS Cloud + ServiceNow CSA certified"
    ]
  },
  recognition: [],
  skills: [
    {
      category: "ML & AI",
      items: [
        "RAG",
        "LangChain",
        "Vector Databases",
        "Embeddings",
        "Knowledge Graphs",
        "NLP",
        "PyTorch",
        "Scikit-learn",
        "CatBoost",
        "Hugging Face",
        "LLMs",
        "Prompt Engineering"
      ]
    },
    {
      category: "Data Engineering & Analytics",
      items: [
        "ETL Pipelines",
        "Data Modeling",
        "Data Warehousing",
        "PostgreSQL",
        "MongoDB",
        "ChromaDB",
        "Geospatial Indexing",
        "BM25",
        "Dashboards"
      ]
    },
    {
      category: "Backend & APIs",
      items: [
        "Node.js",
        "Express.js",
        "FastAPI",
        "Flask",
        "REST APIs",
        "Auth Flows",
        "Rate Limiting"
      ]
    },
    {
      category: "Cloud & DevOps",
      items: [
        "AWS",
        "EC2",
        "S3",
        "IAM",
        "Lambda",
        "Boto3",
        "Docker",
        "Terraform",
        "CI/CD",
        "Git"
      ]
    },
    {
      category: "Frontend & Product",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js", "Framer Motion"]
    },
    {
      category: "Languages & Core CS",
      items: ["Python", "SQL", "TypeScript", "JavaScript", "Java", "C++", "DSA", "DBMS", "OS"]
    }
  ],
  certifications: [
    {
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      year: "2026",
      description:
        "Designing distributed, resilient, cost-optimized systems on AWS — compute, storage, networking, and security architecture.",
      credentialUrl: "https://www.credly.com/badges/14a84662-959b-4450-9fe0-39e914210f25/public_url",
      image: "/certificates/aws-solutions-architect-badge.png",
      brand: "aws" as const
    },
    {
      title: "AWS Certified AI Practitioner",
      issuer: "Amazon Web Services",
      year: "2026",
      description:
        "Foundational knowledge of AI, generative AI, responsible AI, and the core AWS AI services.",
      credentialUrl: "https://www.credly.com/badges/20ba1db5-c6e1-4f12-9400-8546b7102d5f/public_url",
      image: "/certificates/aws-ai-practitioner-badge.png",
      brand: "aws" as const
    },
    {
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2025",
      description:
        "AWS cloud concepts, core services, security, architecture, pricing, and support fundamentals.",
      credentialUrl: "https://www.credly.com/badges/daee29ab-3939-4d21-8ea5-86e3dbfda8b1/public_url",
      image: "/certificates/aws-cloud-practitioner-badge.png",
      brand: "aws" as const
    },
    {
      title: "ServiceNow Certified System Administrator (CSA)",
      issuer: "ServiceNow",
      year: "2026",
      description:
        "Platform administration, configuration, user management, and workflow fundamentals on ServiceNow.",
      credentialUrl: "https://www.credly.com/badges/01176bad-90e8-42ea-9813-00f869263665/public_url",
      image: "/certificates/servicenow-csa-badge.png",
      brand: "servicenow" as const
    }
  ],
  experience: [
    {
      company: "SecretEye Telematics",
      role: "Data / ML Intern — Data & Backend Systems",
      period: "Dec 2025 – Mar 2026",
      location: "Remote / India",
      summary:
        "Early-stage GPS-fleet startup. Owned data ingestion, REST API design, and a Tauri-based operational platform unifying CRM, HR, finance, and projects.",
      star: {
        situation:
          "An early-stage GPS-fleet startup needed a single operational data layer instead of scattered spreadsheets, plus visibility into social signals from Reddit, Instagram, Facebook, LinkedIn, and X for analytics.",
        task:
          "Design REST APIs across multiple operational entities, build social data ingestion pipelines, and ship a desktop platform that replaced manual workflows for the small team.",
        action:
          "Designed 20+ Express.js + MongoDB REST endpoints across 6 operational entities, built ingestion pipelines for Reddit, Instagram, Facebook, LinkedIn, and X capturing content metadata and engagement signals, and shipped a full-stack Tauri + React + TypeScript desktop app unifying CRM, HR, finance, and project management.",
        result:
          "Replaced 4 manual spreadsheet workflows with real-time dashboard aggregation, gave the team a single operational data layer, and produced reusable ingestion patterns for future analytics workflows."
      }
    },
    {
      company: "AWS Cloud Club, JECRC University",
      role: "Technical Lead — Cloud & AI Community",
      period: "Sep 2023 – Present",
      location: "Jaipur, India",
      summary:
        "Run technical content and workshops, and automate AWS lab provisioning so students can practice cloud and AI without setup friction.",
      star: {
        situation:
          "Students needed approachable, hands-on cloud learning paths — not theory — but manual AWS lab setup ate hours each session.",
        task:
          "Build automation that provisions AWS labs reliably and turn it into community-grade workshops on cloud architecture and Git.",
        action:
          "Automated AWS cloud lab provisioning with Boto3 across EC2, S3, and IAM, prepared workshop content, and ran cloud architecture and Git sessions across JECRC and partner universities.",
        result:
          "Eliminated repetitive manual setup across student environments, reached 1,000+ students with cloud and Git workshops, and built a reusable knowledge base for future cohorts."
      }
    }
  ],
  projects: [
    {
      slug: "medifast-ai",
      title: "MediFast AI",
      category: "RAG • Knowledge Graph • Healthcare",
      description:
        "RAG-powered medicine intelligence platform over a 169K-record knowledge graph with 1.3M+ relationship edges. Combines BM25 sparse retrieval and ChromaDB dense vector search to handle multilingual, typo-tolerant, and symptom-based queries.",
      tech: [
        "Node.js",
        "Python",
        "MongoDB",
        "ChromaDB",
        "LangChain",
        "BM25",
        "OpenStreetMap"
      ],
      image: "/projects/podcast.jpg",
      year: "2026",
      metrics: "Search match: 29.7% → 47.7%",
      github: "https://github.com/Ruchin-Audichya/MediFastRX-Bot",
      caseStudy: {
        problem:
          "Medicine search in India is messy: users mix brand names, generic names, typos, and Hindi/Hinglish symptom phrases. Existing flows ignore local language, cheaper substitutes, and nearby availability — and they don't carry per-user health context (allergies, conditions, family history) into ranking.",
        solution:
          "Architected a hybrid RAG pipeline combining BM25 sparse retrieval with ChromaDB dense vector search using Xenova/all-MiniLM-L6-v2 embeddings. Engineered a domain-specific medicine knowledge graph with 169K+ entity records, 681K+ side-effect entries, and 1.3M+ relationship edges. Added session-aware reranking over per-user MongoDB family health profiles, plus geospatial pharmacy discovery using MongoDB 2dsphere indexes and OpenStreetMap data.",
        challenges: [
          "Tuning hybrid BM25 + dense retrieval to handle typos, brand/generic ambiguity, and Hindi/Hinglish symptom phrasing without blowing up latency",
          "Modeling 169K+ entity records, 681K+ side-effect entries, and 1.3M+ relationship edges in a way that stays queryable",
          "Reranking dynamically by allergy and condition history at query time without leaking sessions across users",
          "Making geospatial pharmacy discovery feel useful instead of just dumping nearby points on a map"
        ],
        outcomes: [
          "Boosted medicine search match rate from 29.7% to 47.7% across multilingual, typo-tolerant, and symptom-based queries (+18 pp)",
          "Cut irrelevant pharmacy results by ~30% with radius-based ranking across 10K+ locations",
          "Qualified to Cognizant Technoverse 2026 Grand Finale — Top 24 nationwide out of 2,000+ teams",
          "Built an architecture that extends cleanly to WhatsApp and family-medicine SOS use cases"
        ]
      }
    },
    {
      slug: "placify-ai",
      title: "Placify AI",
      category: "ML Classification • ETL • Analytics",
      description:
        "End-to-end ML pipeline that ingests 5,000+ student records, predicts placement outcomes with CatBoost, surfaces KPIs through React dashboards, and parses resumes via a FastAPI microservice.",
      tech: ["Python", "FastAPI", "React", "Node.js", "PostgreSQL", "CatBoost", "AWS"],
      image: "/projects/cloud.jpg",
      year: "2026",
      metrics: "84.7% accuracy • 94.5% ROC-AUC",
      github: "https://github.com/shriya-gakkhar1/Minor-Project",
      caseStudy: {
        problem:
          "Placement data was scattered across spreadsheets, resumes, and manual coordinator updates. There was no clean way to track readiness, surface cohort KPIs, or give students personalized upskilling guidance.",
        solution:
          "Built a CatBoost classification pipeline with feature engineering on 5,000+ student records, ETL workflows feeding a PostgreSQL data warehouse, interactive React dashboards for coordinators, and a FastAPI microservice that parses resumes and runs skill-gap analysis in real time.",
        challenges: [
          "Cleaning and normalizing 5,000+ student records from inconsistent sources",
          "Beating SVM and logistic regression baselines while keeping the model interpretable enough for coordinators",
          "Designing ETL flows that hold up when new placement seasons add columns and edge cases",
          "Making the resume parser resilient to messy PDFs and freeform skill listings"
        ],
        outcomes: [
          "Achieved 84.7% accuracy and 94.5% ROC-AUC, outperforming SVM and logistic regression baselines",
          "Built a PostgreSQL warehouse with KPI and cohort analytics surfaced through React dashboards",
          "Shipped a FastAPI microservice for real-time resume parsing, skill-gap analysis, and personalized upskilling suggestions",
          "Cut manual placement-data handling significantly by replacing sheets with structured APIs"
        ]
      }
    },
    {
      slug: "portfolio-v1",
      title: "This Portfolio",
      category: "Interactive Web Engineering",
      description:
        "A custom Three.js black hole and kinetic Next.js portfolio. Multi-pass WebGL rendering, scroll-linked motion, accessible reduced-motion support, and recruiter-readable case studies on every project.",
      tech: ["Next.js", "Three.js", "GLSL", "Framer Motion", "TypeScript"],
      image: "/projects/portfolio.jpg",
      year: "2025",
      metrics: "95+ Lighthouse",
      github: "https://github.com/Ruchin-Audichya/portfolio",
      caseStudy: {
        problem:
          "Most developer portfolios are templates. I wanted the first impression to demonstrate engineering taste, performance awareness, and visual craft before a recruiter even opens a project page.",
        solution:
          "Built a multi-pass Three.js rendering pipeline with a hand-written GLSL black hole, gravitational lensing distortion, post-processing with chromatic aberration and dithering, scroll-linked Framer Motion sequences, and structured MDX-friendly case studies.",
        challenges: [
          "Balancing WebGL visual complexity with mobile battery and frame budget",
          "Keeping accessibility, SEO, and reduced-motion support intact under heavy animation",
          "Designing scroll choreography that doesn't fight the content"
        ],
        outcomes: [
          "Shipped a memorable, performance-aware portfolio with structured case studies",
          "Reduced motion path is a true alternate experience, not a stripped one",
          "Turned the site itself into a proof-of-work project recruiters can poke at"
        ]
      }
    },
    {
      slug: "aws-cloud-labs",
      title: "AWS Cloud Labs Automation",
      category: "Cloud Infrastructure",
      description:
        "Boto3-driven automation for AWS lab provisioning across EC2, S3, and IAM. Built to eliminate repetitive manual setup for AWS Cloud Club workshops.",
      tech: ["AWS", "Python", "Boto3", "IAM", "EC2", "S3", "Lambda", "Docker"],
      image: "/projects/cloud.jpg",
      year: "2025",
      metrics: "1,000+ students reached",
      caseStudy: {
        problem:
          "Cloud workshops kept losing time to manual lab setup. IAM policies, EC2 instances, and S3 buckets had to be re-created per session, which made hands-on learning fragile.",
        solution:
          "Wrote Boto3 automation that provisions and tears down AWS labs across EC2, S3, and IAM with reproducible, cost-aware defaults. Paired the scripts with workshop content used in cloud architecture and Git sessions.",
        challenges: [
          "Debugging IAM and networking issues so labs stay isolated and safe",
          "Keeping cost controls in place across many parallel student environments",
          "Turning one-off scripts into something reusable across cohorts"
        ],
        outcomes: [
          "Eliminated repetitive manual setup across student environments",
          "Reached 1,000+ students through cloud architecture and Git workshops at JECRC and partner universities",
          "Reinforced AWS Cloud + AWS AI certification learning with hands-on patterns"
        ]
      }
    },
    {
      slug: "n8n-automations",
      title: "n8n Workflow Automations",
      category: "Automation",
      description:
        "Self-hosted n8n workflows for recurring ops, alerts, and tool glue. Built to take repetitive manual work off the table and run it quietly in the background.",
      tech: ["n8n", "Webhooks", "REST APIs", "Self-Hosted"],
      image: "/projects/n8n.jpg",
      year: "2025",
      metrics: "10+ hours saved / week",
      caseStudy: {
        problem:
          "Repetitive ops — logging, alerts, moving data between tools — were eating focus without producing real progress.",
        solution:
          "Self-hosted n8n and built modular, observable workflows around webhooks, REST integrations, and Telegram-style alerts.",
        challenges: [
          "Managing API auth, rate limits, and silent failure modes",
          "Keeping each workflow simple enough to extend later",
          "Designing alerting that surfaces real issues, not noise"
        ],
        outcomes: [
          "Reduced repeated manual work by 10+ hours per week",
          "Established a reusable automation mindset that carries into bigger systems",
          "Improved personal and project ops with low-maintenance flows"
        ]
      }
    },
    {
      slug: "linux-productivity",
      title: "Linux Dev Environment",
      category: "System Engineering",
      description:
        "A reproducible, keyboard-driven Linux setup with shell scripts, tiling extensions, and dotfiles built from a hardware-first curiosity.",
      tech: ["Linux", "Bash", "GNOME", "Dotfiles"],
      image: "/projects/linux.jpg",
      year: "2024",
      metrics: "Sub-30 min fresh setup",
      caseStudy: {
        problem:
          "Fresh dev machines waste hours on setup, missing tools, inconsistent shortcuts, and environment drift.",
        solution:
          "Built a Linux workflow with shell scripts, GNOME tiling extensions, and reusable dotfiles to get productive within half an hour after a clean install.",
        challenges: [
          "Keeping configs portable across distros and versions",
          "Balancing aesthetics with actual productivity",
          "Avoiding over-customization that makes systems fragile"
        ],
        outcomes: [
          "Reduced fresh setup time to under 30 minutes",
          "Built a faster keyboard-driven workflow",
          "Turned personal system tuning into reusable engineering practice"
        ]
      }
    }
  ]
};
