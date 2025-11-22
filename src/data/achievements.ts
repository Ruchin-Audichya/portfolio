export interface Achievement {
    title: string;
    issuer: string;
    date: string;
    description?: string;
    credentialUrl?: string;
    icon?: string;
}

export const achievements: Achievement[] = [
    {
        title: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services (AWS)",
        date: "2024",
        description: "Foundational understanding of AWS Cloud, services, and best practices",
        icon: "☁️"
    },
    {
        title: "AWS Cloud Club Founder & Lead",
        issuer: "JECRC University",
        date: "2023 - Present",
        description: "Founded and leading the AWS Cloud Club, organizing workshops, hackathons, and community events to promote cloud computing education",
        icon: "🎯"
    },
    {
        title: "Salesforce Certified",
        issuer: "Salesforce",
        date: "2024",
        description: "Professional certification in Salesforce platform development and administration",
        icon: "⚡"
    },
    {
        title: "Tech Community Builder",
        issuer: "Open Source & Community",
        date: "Ongoing",
        description: "Active contributor to tech communities, sharing knowledge through workshops, content creation, and peer mentoring",
        icon: "🌟"
    }
];
