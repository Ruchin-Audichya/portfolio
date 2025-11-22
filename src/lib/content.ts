export const content = {
    profile: {
        name: "Ruchin Audichya",
        role: "Cloud, AI & Frontend Engineer",
        headline: "Precision in Motion",
        subline: "Orchestrating digital experiences.",
        mission: "I build digital artifacts that feel inevitable, polished, and alive.",
        bio_title: "The Architect",
        bio: [
            "A focused, disciplined and creatively technical builder working across Cloud, AI, Automation, and Interactive Frontend experiences. I combine engineering logic with a strong sense of design and simplicity. My workflow blends structured routines, energy alignment, and precision-driven execution.",
            "I enjoy turning chaotic ideas into clear, elegant systems — from cloud-ready backends to animated, cinematic frontends. My mindset is shaped by consistency, learning, and deep attention to detail.",
            "At the core, I’m someone who keeps improving — technically, mentally, and creatively — while staying grounded, peaceful, and disciplined."
        ],
        avatar: "/profile.jpg",
        resume: "/resume.pdf", // Updated to point to the local file
        socials: {
            email: "hello@ruchinaudichya.in",
            github: "https://github.com/Ruchin-Audichya",
            linkedin: "https://linkedin.com/in/ruchinaudichya",
            instagram: "https://www.instagram.com/ruchin_audichya/",
            twitter: "https://twitter.com/ruchinaudichya"
        }
    },
    // ... rest of the content remains the same
    skills: [
        {
            category: "Cloud & AWS",
            items: ["AWS Cloud Practitioner", "S3", "EC2", "DynamoDB", "IAM", "Static Hosting"]
        },
        {
            category: "AI-Driven Dev",
            items: ["Gemini 3.0", "Antigravity IDE", "Agentic Workflows", "Prompt Engineering"]
        },
        {
            category: "Frontend & Motion",
            items: ["Next.js 14", "React", "TailwindCSS", "GSAP", "Framer Motion", "Lenis"]
        },
        {
            category: "Automation",
            items: ["n8n", "Webhooks", "API Integrations", "Scripting"]
        },
        {
            category: "System & Linux",
            items: ["Pop!_OS", "Ubuntu", "GNOME Customization", "Bash", "System Optimization"]
        }
    ],
    projects: [
        {
            slug: "portfolio-v1",
            title: "Portfolio v0.1.0",
            category: "Web Development",
            description: "First release of my personal website; now evolving into a cinematic, motion-designed experience.",
            tech: ["Next.js", "Tailwind", "Motion"],
            image: "/projects/portfolio.jpg",
            year: "2025",
            metrics: "95+ Lighthouse Score",
            caseStudy: {
                problem: "Traditional portfolios are static and boring. I needed a way to stand out in a crowded market while showcasing my technical skills in 3D and motion graphics.",
                solution: "I built an interactive 3D world using React Three Fiber, allowing users to explore my journey spatially. The UI was designed with a 'glassmorphism' aesthetic to feel premium and modern.",
                challenges: [
                    "Optimizing 3D assets for mobile devices without losing visual fidelity.",
                    "Implementing a seamless day/night cycle that reacts to user input.",
                    "Ensuring accessibility (keyboard navigation) within a 3D environment."
                ],
                outcomes: [
                    "Achieved a 95+ Lighthouse Performance score.",
                    "Created a unique, memorable user experience.",
                    "Successfully integrated complex 3D interactions with standard DOM elements."
                ]
            }
        },
        {
            slug: "linux-productivity",
            title: "Linux Productivity Setup",
            category: "System Engineering",
            description: "Turned Ubuntu into a clean, macOS-like developer OS with GNOME extensions & performance tweaks.",
            tech: ["Linux", "Bash", "GNOME"],
            image: "/projects/linux.jpg",
            year: "2024",
            metrics: "30% Faster Workflow",
            caseStudy: {
                problem: "Default Linux desktop environments can be clunky and distracting. I needed a streamlined, keyboard-centric workflow that matched the polish of macOS but with the power of Linux.",
                solution: "I customized GNOME with specific extensions (Dash to Dock, User Themes) and wrote Bash scripts to automate system maintenance and environment setup.",
                challenges: [
                    "Resolving conflicts between different GNOME extensions.",
                    "Optimizing system resource usage for heavy development tasks.",
                    "Creating a consistent visual theme across GTK apps and the shell."
                ],
                outcomes: [
                    "Reduced daily setup time by 30%.",
                    "Created a distraction-free environment that boosts focus.",
                    "Open-sourced the dotfiles for the community."
                ]
            }
        },
        {
            slug: "n8n-automations",
            title: "n8n Automations",
            category: "Automation",
            description: "Built everyday automations using triggers, APIs, and modular workflows for personal logs and notifications.",
            tech: ["n8n", "Webhooks", "JSON"],
            image: "/projects/n8n.jpg",
            year: "2024",
            metrics: "10+ Hours Saved/Week",
            caseStudy: {
                problem: "Repetitive tasks like tracking expenses, logging workouts, and managing notifications were consuming too much mental energy.",
                solution: "I deployed n8n (self-hosted) and built workflows to automate these processes. Webhooks trigger actions based on emails, calendar events, and API calls.",
                challenges: [
                    "Handling authentication and rate limits for various APIs.",
                    "Designing robust error handling for failed workflow executions.",
                    "Securing the self-hosted n8n instance."
                ],
                outcomes: [
                    "Saved over 10 hours per week on manual data entry.",
                    "Ensured 100% accuracy in personal logging.",
                    "Created a scalable system for future automations."
                ]
            }
        },
        {
            slug: "ai-podcast-host",
            title: "AI Podcast Host",
            category: "AI / UX Concept",
            description: "Designed a UI/UX concept for an AI-driven interactive podcast host with expression analysis.",
            tech: ["AI", "React", "Concept"],
            image: "/projects/podcast.jpg",
            year: "2025",
            metrics: "Interactive AI Demo",
            caseStudy: {
                problem: "Podcasts are passive. I wanted to explore how AI could make audio content interactive and responsive to the listener's emotional state.",
                solution: "I designed a concept interface where an AI host analyzes the user's facial expressions (via webcam) and adjusts the conversation tone and topic in real-time.",
                challenges: [
                    "Designing a non-intrusive UI for real-time video analysis.",
                    "Visualizing the AI's 'thought process' to build trust.",
                    "Balancing technical complexity with a clean user experience."
                ],
                outcomes: [
                    "Created a compelling proof-of-concept for AI media.",
                    "Explored new patterns in Human-AI interaction.",
                    "Received positive feedback on the innovative UX approach."
                ]
            }
        },
        {
            slug: "cloud-mini-projects",
            title: "Cloud Mini Projects",
            category: "Cloud Infrastructure",
            description: "Hands-on with AWS basics: S3 static hosting, IAM permissions, EC2 instances, and DynamoDB patterns.",
            tech: ["AWS", "Cloud", "Infrastructure"],
            image: "/projects/cloud.jpg",
            year: "2024",
            metrics: "AWS Certified",
            caseStudy: {
                problem: "Theory isn't enough. I needed practical, hands-on experience with AWS services to truly understand cloud architecture.",
                solution: "I built a series of mini-projects: a static site on S3, a serverless API with Lambda/DynamoDB, and a load-balanced EC2 cluster.",
                challenges: [
                    "Configuring correct IAM permissions (Least Privilege Principle).",
                    "Debugging networking issues (VPC, Security Groups).",
                    "Managing costs while experimenting with different services."
                ],
                outcomes: [
                    "Gained deep practical knowledge of core AWS services.",
                    "Successfully deployed secure and scalable infrastructure.",
                    "Prepared for and passed the AWS Cloud Practitioner exam."
                ]
            }
        },
        {
            slug: "system-optimization",
            title: "System Optimization",
            category: "Human Systems",
            description: "A structured approach to daily alignment, supplements, focus, and discipline.",
            tech: ["Framework", "Optimization"],
            image: "/projects/system.jpg",
            year: "Ongoing",
            metrics: "Daily Consistency",
            caseStudy: {
                problem: "Consistency is hard. Without a system, motivation fluctuates and progress stalls.",
                solution: "I treated my daily routine as a software system. I optimized inputs (sleep, nutrition, information) to maximize outputs (focus, code, creativity).",
                challenges: [
                    "Sticking to the routine during high-stress periods.",
                    "Iterating on the system without over-optimizing.",
                    "Balancing structure with spontaneity."
                ],
                outcomes: [
                    "Achieved a 90% consistency rate in daily habits.",
                    "Significantly improved focus and deep work capacity.",
                    "Built a sustainable lifestyle that supports high performance."
                ]
            }
        }
    ]
};
