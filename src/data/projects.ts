export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    title: "This Portfolio",
    description: "You're looking at it. A Three.js black hole simulation with multi-pass shaders, gravitational lensing, and chromatic aberration — sitting on top of a Next.js 14 app. Runs at 60fps, scores 95+ on Lighthouse, and every section has scroll-driven animation. Built from scratch, not a template.",
    tags: ["Next.js 14", "Three.js", "GLSL Shaders", "Framer Motion", "Tailwind"],
    github: "https://github.com/Ruchin-Audichya/portfolio",
  },
  {
    title: "AWS Cloud Infrastructure",
    description: "Hands-on AWS work: provisioned S3 static hosting, Lambda + DynamoDB serverless APIs, EC2 clusters with proper security groups, and IAM policies following least-privilege. Not tutorials — actual deployments I configured, broke, debugged, and got running. Led to passing both AWS Cloud Practitioner and AWS AI Practitioner exams.",
    tags: ["AWS", "S3", "Lambda", "DynamoDB", "IAM", "Terraform"],
  },
  {
    title: "Salesforce CRM Automation",
    description: "Built Apex triggers and flows to automate lead capture and follow-up sequences for a real sales pipeline. Cut manual data entry by 70%. The kind of work where you learn that 'it works on my sandbox' means nothing until it survives production Salesforce orgs with 10 years of tech debt.",
    tags: ["Salesforce", "Apex", "Flows", "Integration", "Automation"],
  },
  {
    title: "n8n Workflow Automations",
    description: "Self-hosted n8n on a VPS. Built workflows that auto-log expenses from email receipts, sync calendar events to Notion, and send Telegram alerts when my AWS bills spike. Saved ~10 hours/week of repetitive tasks. The best code is the code that runs while you sleep.",
    tags: ["n8n", "Self-Hosted", "Webhooks", "API", "Automation"],
  },
  {
    title: "Linux Development Setup",
    description: "Turned a stock Ubuntu install into a keyboard-driven, distraction-free dev environment. Custom GNOME shell, tiling extensions, Bash scripts for environment bootstrapping, and dotfiles that let me go from fresh install to fully productive in under 30 minutes. Open-sourced the config.",
    tags: ["Linux", "Ubuntu", "Bash", "GNOME", "Dotfiles"],
    github: "https://github.com/Ruchin-Audichya",
  },
  {
    title: "AI Podcast Host Concept",
    description: "A UI/UX prototype where an AI host reads your face via webcam and adjusts conversation tone in real-time. Built the frontend in React, designed the interaction model around micro-expressions. Not shipped yet — but the concept got good feedback for exploring what human-AI conversation could feel like.",
    tags: ["React", "AI/UX", "Gemini", "Concept Design"],
  },
];
