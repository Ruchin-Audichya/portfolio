export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    title: "AWS Cloud Club Event Platform",
    description: "A centralized platform concept for managing community events, registrations, and resources — focused on clean UX, reliable forms, and scalable structure.",
    tags: ["Next.js", "AWS", "Tailwind CSS", "Community"],
  },
  {
    title: "Salesforce CRM Integration",
    description: "Salesforce customization + automation for lead capture and follow-ups — focused on reducing manual work and improving consistency.",
    tags: ["Salesforce", "Apex", "Integration", "Automation"],
  },
  {
    title: "Cloud Infrastructure Automation",
    description: "Infrastructure-as-Code practice projects using Terraform to provision AWS resources with reproducible, reviewable configs.",
    tags: ["AWS", "Terraform", "DevOps", "IaC"],
  },
  {
    title: "Tech Content Hub",
    description: "A content hub concept for tutorials and notes — focused on information architecture, search/SEO hygiene, and fast reading UX.",
    tags: ["React", "Node.js", "Content Strategy", "SEO"],
  }
];
