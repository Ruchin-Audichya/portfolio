export const content = {
    profile: {
        name: "Ruchin Audichya",
        role: "Cloud/DevOps (AWS) • Full-Stack (Next.js) • Salesforce (Apex)",
        headline: "Cloud/DevOps Engineer • Full-Stack Developer • Salesforce Developer",
        subline: "PC & systems enthusiast — performance-first, proof-of-work builds",
        mission: "I build cloud-native systems, automation, and product-grade frontends — with the same obsession I bring to PCs: reliability, performance, and clean execution.",
        bio_title: "Hardware mindset. Software execution.",
        bio: [
            "I've been taking apart PCs and fixing systems since I was a kid. Not because someone told me to — because I wanted to know why the fan was loud and whether I could make it quieter. That curiosity never went away.",
            "In college, I channeled it into cloud and software. Got my hands dirty with AWS — not just watching tutorials, but actually provisioning infrastructure, breaking things, and debugging IAM policies until they worked. Passed both the AWS Cloud Practitioner and AWS AI Practitioner exams.",
            "I work across Cloud/DevOps, Full-Stack (Next.js, TypeScript), and Salesforce (Apex, Flows). I've also led the AWS Cloud Club at JECRC — organizing events, creating content, and working directly with AWS executives to grow the community.",
            "This portfolio is itself a project: a Three.js black hole with GLSL shaders, gravitational lensing, and post-processing — sitting on a Next.js app with scroll-driven motion design. Everything you see here, I built."
        ],
        avatar: "/profile.jpg",
        resume: "/resume.pdf",
        socials: {
            email: "hello@ruchinaudichya.in",
            github: "https://github.com/Ruchin-Audichya",
            linkedin: "https://www.linkedin.com/in/ruchinaudi/",
            instagram: "https://www.instagram.com/ruchin_audichya/",
            twitter: "https://x.com/itsRuchin"
        }
    },
    skills: [
        {
            category: "Cloud & AWS",
            items: ["AWS Cloud Practitioner", "AWS AI Practitioner", "S3", "EC2", "Lambda", "DynamoDB", "IAM", "CloudFront"]
        },
        {
            category: "Frontend & Motion",
            items: ["Next.js 14", "React", "TypeScript", "Three.js", "GSAP", "Framer Motion", "TailwindCSS"]
        },
        {
            category: "Backend & Data",
            items: ["Node.js", "Python", "REST APIs", "PostgreSQL", "Prisma"]
        },
        {
            category: "Salesforce",
            items: ["Apex", "Flows", "Process Builder", "SOQL", "Lightning"]
        },
        {
            category: "DevOps & Tools",
            items: ["Docker", "Git/GitHub", "Terraform", "Vercel", "n8n", "Linux"]
        },
        {
            category: "AI & Automation",
            items: ["Gemini", "Prompt Engineering", "Agentic Workflows", "Webhooks", "n8n"]
        }
    ],
    projects: [
        {
            slug: "portfolio-v1",
            title: "This Portfolio",
            category: "Web Development",
            description: "A Three.js black hole with GLSL shaders on top of a Next.js 14 app. Multi-pass rendering, gravitational lensing, chromatic aberration — and every section has scroll-driven kinetic typography.",
            tech: ["Next.js", "Three.js", "GLSL", "Framer Motion"],
            image: "/projects/portfolio.jpg",
            year: "2025",
            metrics: "95+ Lighthouse Score",
            caseStudy: {
                problem: "Most developer portfolios are templates or generic single-page sites. I wanted something that immediately proves technical depth before anyone reads a single word.",
                solution: "Built a multi-pass Three.js rendering pipeline — noise bake, accretion disk, distortion map, post-processing with chromatic aberration and gravitational lensing — all running in a React component. The portfolio sections below use Framer Motion for scroll-linked kinetic typography.",
                challenges: [
                    "Getting the GLSL shaders right for WebGL2 compatibility across browsers",
                    "Balancing visual complexity with 60fps on mobile devices",
                    "Making OrbitControls coexist with scroll-driven sections below"
                ],
                outcomes: [
                    "95+ Lighthouse performance score",
                    "Runs at 60fps on most devices, degrades gracefully on mobile",
                    "People actually stop and interact with it instead of bouncing"
                ]
            }
        },
        {
            slug: "cloud-mini-projects",
            title: "AWS Cloud Infrastructure",
            category: "Cloud Infrastructure",
            description: "Real AWS deployments: S3 hosting, Lambda APIs, EC2 clusters, IAM policies. Not sandbox exercises — actual infrastructure I configured, broke, and fixed.",
            tech: ["AWS", "Terraform", "IAM", "Lambda"],
            image: "/projects/cloud.jpg",
            year: "2024",
            metrics: "2x AWS Certified",
            caseStudy: {
                problem: "Tutorials teach you the happy path. Production teaches you what happens when your IAM policy denies access at 2am and your S3 bucket is public when it shouldn't be.",
                solution: "Built progressively complex projects: static S3 hosting → serverless Lambda + DynamoDB APIs → load-balanced EC2 with proper VPC networking. Each one taught a different failure mode.",
                challenges: [
                    "IAM least-privilege policies that are actually least-privilege",
                    "VPC and Security Group debugging when nothing connects",
                    "Cost management — learning what 'leaving an EC2 running' costs"
                ],
                outcomes: [
                    "Passed AWS Cloud Practitioner and AI Practitioner exams",
                    "Can provision secure, scalable infrastructure from scratch",
                    "Learned more from breaking things than from any course"
                ]
            }
        },
        {
            slug: "n8n-automations",
            title: "n8n Workflow Automations",
            category: "Automation",
            description: "Self-hosted n8n on a VPS. Built workflows that auto-log expenses, sync calendars, and send alerts when AWS bills spike. The best code runs while you sleep.",
            tech: ["n8n", "Webhooks", "APIs", "Self-Hosted"],
            image: "/projects/n8n.jpg",
            year: "2024",
            metrics: "10+ Hours Saved/Week",
            caseStudy: {
                problem: "I was spending hours every week on repetitive tasks — tracking expenses, updating logs, checking notifications. It was the kind of work that makes you feel busy but accomplishes nothing.",
                solution: "Self-hosted n8n, connected it to Gmail, Google Calendar, Notion, and Telegram via webhooks. Built modular workflows with proper error handling so they don't fail silently.",
                challenges: [
                    "API rate limits and auth token management across services",
                    "Error handling that catches failures instead of silently breaking",
                    "Securing a self-hosted instance with proper SSL and auth"
                ],
                outcomes: [
                    "Saved 10+ hours per week on manual tasks",
                    "Zero silent failures in 6 months of operation",
                    "Scalable system — adding a new workflow takes minutes"
                ]
            }
        },
        {
            slug: "linux-productivity",
            title: "Linux Dev Environment",
            category: "System Engineering",
            description: "Turned stock Ubuntu into a keyboard-driven, distraction-free workspace. Custom GNOME shell, tiling, and Bash scripts that go from fresh install to productive in 30 minutes.",
            tech: ["Linux", "Bash", "GNOME", "Dotfiles"],
            image: "/projects/linux.jpg",
            year: "2024",
            metrics: "30 Min Setup Time",
            caseStudy: {
                problem: "Default Linux desktops are functional but inefficient. I wanted a setup where my hands never leave the keyboard and every tool is one shortcut away.",
                solution: "Customized GNOME with tiling extensions, built Bash scripts to bootstrap the entire environment, and packaged everything as reproducible dotfiles.",
                challenges: [
                    "GNOME extension conflicts that crash the shell",
                    "Making the config portable across Ubuntu versions",
                    "Balancing aesthetics with actual productivity gains"
                ],
                outcomes: [
                    "Fresh install to fully productive in under 30 minutes",
                    "Keyboard-driven workflow reduced context-switching",
                    "Open-sourced the dotfiles for the community"
                ]
            }
        },
        {
            slug: "ai-podcast-host",
            title: "AI Podcast Host",
            category: "AI / UX Concept",
            description: "A prototype where an AI host reads your facial expressions and adjusts conversation tone in real-time. Not shipped yet — but the interaction design explores what human-AI conversation could feel like.",
            tech: ["React", "AI", "UX Design", "Gemini"],
            image: "/projects/podcast.jpg",
            year: "2025",
            metrics: "Interactive AI Concept",
            caseStudy: {
                problem: "Podcasts are one-directional. What if an AI host could sense when you're confused, bored, or excited and adapt the conversation in real-time?",
                solution: "Designed a concept interface with webcam-based expression analysis. The AI adjusts pacing, depth, and tone based on micro-expressions — making the conversation feel responsive.",
                challenges: [
                    "Designing a non-creepy UI for real-time facial analysis",
                    "Making the AI's reactions feel natural, not robotic",
                    "Balancing technical feasibility with the concept's ambition"
                ],
                outcomes: [
                    "Compelling proof-of-concept that got positive feedback",
                    "Explored novel human-AI interaction patterns",
                    "Informed my thinking about AI UX design principles"
                ]
            }
        },
        {
            slug: "system-optimization",
            title: "Personal System Engineering",
            category: "Human Systems",
            description: "I treat my daily routine like infrastructure — optimize inputs, measure outputs, iterate. Sleep, nutrition, focus blocks, and discipline tracked over months. Engineering applied to life.",
            tech: ["Framework", "Optimization", "Discipline"],
            image: "/projects/system.jpg",
            year: "Ongoing",
            metrics: "90% Daily Consistency",
            caseStudy: {
                problem: "Without a system, motivation is unreliable. Some days you ship, some days you scroll. I needed something more reliable than 'feeling motivated'.",
                solution: "Treated my routine as a software system: defined inputs (sleep, nutrition, information diet), measured outputs (focus time, code shipped, learning), and iterated weekly.",
                challenges: [
                    "Being honest about what actually works vs. what feels productive",
                    "Not over-engineering the system to the point it becomes a distraction",
                    "Maintaining consistency during exam stress and deadlines"
                ],
                outcomes: [
                    "90% consistency rate in daily habits over 6 months",
                    "Measurably improved deep work capacity",
                    "Framework I still use and refine every week"
                ]
            }
        }
    ]
};
