export interface StopData {
    id: string;
    label: string;
    angleDeg: number;
    type?: "gate" | "stop";
    title: string;
    line1: string;
    line2: string;
    blurb: string;
}

export const STOPS: StopData[] = [
    {
        id: "origin",
        label: "Origin",
        angleDeg: 0,
        type: "gate",
        title: "2019 — First Hustle",
        line1: "Licenses, PC fixes, dropshipping.",
        line2: "Tiny economy, first trust built.",
        blurb: "Started pre-college. Learned ops, support, and shipping fast."
    },
    {
        id: "cloud-journey",
        label: "Cloud Path",
        angleDeg: 60,
        title: "JECRC + AWS Track",
        line1: "Chose cloud to build real systems.",
        line2: "Python, APIs, GitHub, 5+ cloud badges.",
        blurb: "Scaling felt natural — labs, cost-aware design, hands-on deployments."
    },
    {
        id: "aws-club",
        label: "Club Lead",
        angleDeg: 120,
        title: "AWS Cloud Club",
        line1: "Content & graphics head.",
        line2: "Worked with AWS exec to grow the voice.",
        blurb: "Shaped events, visuals, and messaging for the campus community."
    },
    {
        id: "campaign",
        label: "Impact",
        angleDeg: 180,
        title: "50,000 Students",
        line1: "AICTE x OPPO x 1M1B campaign.",
        line2: "Stages, classrooms, online — energized a movement.",
        blurb: "Nationwide push across 20+ schools; taught and organized at scale."
    },
    {
        id: "internships",
        label: "Field",
        angleDeg: 240,
        title: "Internships + Ambassador",
        line1: "AICTE intern, JECRC ambassador, AWS clubs member.",
        line2: "Coordination, delivery, teamwork in the wild.",
        blurb: "Bridge-builder between students, partners, and tech."
    },
    {
        id: "now",
        label: "Today",
        angleDeg: 300,
        title: "Now — Automation & Systems",
        line1: "Automation, dev tools, scalable design.",
        line2: "3D mini-city as living proof.",
        blurb: "Calm, cinematic, confident — building the next set of tools."
    }
];
