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
    description: "A centralized platform for managing AWS Cloud Club events, registrations, and resources. Built to streamline community engagement and content delivery.",
    tags: ["Next.js", "AWS", "Tailwind CSS", "Community"],
    github: "https://github.com/Ruchin-Audichya/aws-club-platform", // Placeholder
    link: "https://aws-club-jecrc.vercel.app" // Placeholder
  },
  {
    title: "Salesforce CRM Integration",
    description: "Implemented a custom Salesforce integration for a local business to automate lead generation and customer follow-ups, improving efficiency by 40%.",
    tags: ["Salesforce", "Apex", "Integration", "Automation"],
    github: "https://github.com/Ruchin-Audichya/salesforce-integration" // Placeholder
  },
  {
    title: "Cloud Infrastructure Automation",
    description: "Infrastructure as Code (IaC) project using Terraform to provision and manage AWS resources, ensuring scalable and reproducible environments.",
    tags: ["AWS", "Terraform", "DevOps", "IaC"],
    github: "https://github.com/Ruchin-Audichya/terraform-aws" // Placeholder
  },
  {
    title: "Tech Content Hub",
    description: "A content aggregation site for tech tutorials and articles, featuring a custom CMS and SEO optimization to reach a wider audience.",
    tags: ["React", "Node.js", "Content Strategy", "SEO"],
    github: "https://github.com/Ruchin-Audichya/tech-content-hub" // Placeholder
  }
];
