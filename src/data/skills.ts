export interface Skill {
  id: string;
  displayName: string;
  category: "core" | "cloud" | "frontend" | "backend" | "ai" | "tools";
  shortDescription: string;
  exampleUses: string[];
  colorAccent: string;
  linkedProjects: string[]; // IDs from projects.ts
}

export const skills: Skill[] = [
  {
    id: "aws",
    displayName: "AWS",
    category: "cloud",
    shortDescription: "Cloud infrastructure & serverless architectures",
    exampleUses: ["S3 Static Hosting", "Lambda & DynamoDB APIs"],
    colorAccent: "#FF9900",
    linkedProjects: ["cloud-mini-projects", "portfolio-v1"]
  },
  {
    id: "react",
    displayName: "React",
    category: "frontend",
    shortDescription: "Component-based UI library",
    exampleUses: ["Interactive Portfolios", "Dashboard UIs"],
    colorAccent: "#61DAFB",
    linkedProjects: ["portfolio-v1", "ai-podcast-host"]
  },
  {
    id: "nextjs",
    displayName: "Next.js 14",
    category: "frontend",
    shortDescription: "React framework for production",
    exampleUses: ["SSR/SSG Rendering", "API Routes"],
    colorAccent: "#000000",
    linkedProjects: ["portfolio-v1"]
  },
  {
    id: "r3f",
    displayName: "R3F",
    category: "frontend",
    shortDescription: "React Three Fiber for 3D web",
    exampleUses: ["3D Scene Management", "Canvas Integration"],
    colorAccent: "#333333",
    linkedProjects: ["portfolio-v1"]
  },
  {
    id: "cpp",
    displayName: "C++",
    category: "core",
    shortDescription: "High-performance systems programming",
    exampleUses: ["Game Engines", "System Tools"],
    colorAccent: "#00599C",
    linkedProjects: []
  },
  {
    id: "n8n",
    displayName: "n8n",
    category: "tools",
    shortDescription: "Workflow automation tool",
    exampleUses: ["Email Automation", "Data Sync Pipelines"],
    colorAccent: "#FF6584",
    linkedProjects: ["n8n-automations"]
  },
  {
    id: "gemini",
    displayName: "Gemini 3.0",
    category: "ai",
    shortDescription: "Multimodal AI model integration",
    exampleUses: ["Chatbots", "Content Analysis"],
    colorAccent: "#8E75B2",
    linkedProjects: ["ai-podcast-host"]
  },
  {
    id: "linux",
    displayName: "Linux",
    category: "tools",
    shortDescription: "Open source operating system",
    exampleUses: ["Server Management", "Dev Environment"],
    colorAccent: "#FCC624",
    linkedProjects: ["linux-productivity"]
  },
  {
    id: "python",
    displayName: "Python",
    category: "backend",
    shortDescription: "Versatile language for AI, data science, and backend",
    exampleUses: ["ML Models", "Data Analysis", "Scripting"],
    colorAccent: "#3776AB",
    linkedProjects: ["ai-podcast-host"]
  },
  {
    id: "typescript",
    displayName: "TypeScript",
    category: "frontend",
    shortDescription: "Type-safe JavaScript superset",
    exampleUses: ["Type Safety", "Better IDE Support"],
    colorAccent: "#3178C6",
    linkedProjects: ["portfolio-v1"]
  },
  {
    id: "tailwind",
    displayName: "TailwindCSS",
    category: "frontend",
    shortDescription: "Utility-first CSS framework",
    exampleUses: ["Rapid UI Development", "Consistent Design"],
    colorAccent: "#06B6D4",
    linkedProjects: ["portfolio-v1"]
  },
  {
    id: "docker",
    displayName: "Docker",
    category: "tools",
    shortDescription: "Containerization platform for deployment",
    exampleUses: ["App Containerization", "Dev Environments"],
    colorAccent: "#2496ED",
    linkedProjects: ["cloud-mini-projects"]
  },
  {
    id: "postgresql",
    displayName: "PostgreSQL",
    category: "backend",
    shortDescription: "Powerful open-source relational database",
    exampleUses: ["Data Storage", "Complex Queries"],
    colorAccent: "#4169E1",
    linkedProjects: []
  },
  {
    id: "git",
    displayName: "Git/GitHub",
    category: "tools",
    shortDescription: "Version control and collaboration",
    exampleUses: ["Code Versioning", "Team Collaboration"],
    colorAccent: "#F05032",
    linkedProjects: ["portfolio-v1", "linux-productivity"]
  },
  {
    id: "vercel",
    displayName: "Vercel",
    category: "cloud",
    shortDescription: "Deployment platform for modern web apps",
    exampleUses: ["Serverless Functions", "Edge Network"],
    colorAccent: "#000000",
    linkedProjects: ["portfolio-v1"]
  },
  {
    id: "api-design",
    displayName: "REST APIs",
    category: "backend",
    shortDescription: "RESTful API architecture and design",
    exampleUses: ["Endpoint Design", "Data Integration"],
    colorAccent: "#009688",
    linkedProjects: ["n8n-automations"]
  }
];
