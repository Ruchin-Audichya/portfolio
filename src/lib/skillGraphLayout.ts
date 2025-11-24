import type { Skill } from "@/data/skills";

export interface SkillGraphNode extends Skill {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
}

export interface SkillEdge {
    source: string;
    target: string;
    relationship: string;
}

// Define relationships between skills
const skillRelationships: SkillEdge[] = [
    { source: "react", target: "nextjs", relationship: "Framework built on" },
    { source: "nextjs", target: "r3f", relationship: "Integrates with" },
    { source: "aws", target: "nextjs", relationship: "Hosts & deploys" },
    { source: "cpp", target: "linux", relationship: "Systems programming" },
    { source: "linux", target: "aws", relationship: "Server infrastructure" },
    { source: "n8n", target: "aws", relationship: "Automation platform" },
    { source: "gemini", target: "react", relationship: "AI integration" },
    { source: "gemini", target: "n8n", relationship: "Workflow enhancement" },
    { source: "python", target: "gemini", relationship: "AI model integration" },
    { source: "typescript", target: "react", relationship: "Type-safe React" },
    { source: "typescript", target: "nextjs", relationship: "Built with TypeScript" },
    { source: "tailwind", target: "react", relationship: "Styles React components" },
    { source: "docker", target: "aws", relationship: "Container deployment" },
    { source: "postgresql", target: "aws", relationship: "RDS Database" },
    { source: "git", target: "vercel", relationship: "CI/CD integration" },
    { source: "vercel", target: "nextjs", relationship: "Optimized for Next.js" },
    { source: "api-design", target: "nextjs", relationship: "API routes" },
];

// Simple force-directed layout simulation
export function computeForceDirectedLayout(
    skills: Skill[],
    iterations: number = 100
): { nodes: SkillGraphNode[]; edges: SkillEdge[] } {
    // Initialize nodes with random positions
    const nodes: SkillGraphNode[] = skills.map((skill) => ({
        ...skill,
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 4,
        vx: 0,
        vy: 0,
        vz: 0,
    }));

    const repulsionStrength = 2;
    const attractionStrength = 0.1;
    const centeringStrength = 0.05;
    const damping = 0.8;

    // Run simulation
    for (let iter = 0; iter < iterations; iter++) {
        // Reset forces
        nodes.forEach((node) => {
            node.vx = 0;
            node.vy = 0;
            node.vz = 0;
        });

        // Repulsion between all nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[j].x - nodes[i].x;
                const dy = nodes[j].y - nodes[i].y;
                const dz = nodes[j].z - nodes[i].z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;

                const force = repulsionStrength / (dist * dist);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                const fz = (dz / dist) * force;

                nodes[i].vx -= fx;
                nodes[i].vy -= fy;
                nodes[i].vz -= fz;
                nodes[j].vx += fx;
                nodes[j].vy += fy;
                nodes[j].vz += fz;
            }
        }

        // Attraction along edges
        skillRelationships.forEach((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);

            if (sourceNode && targetNode) {
                const dx = targetNode.x - sourceNode.x;
                const dy = targetNode.y - sourceNode.y;
                const dz = targetNode.z - sourceNode.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                const force = dist * attractionStrength;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                const fz = (dz / dist) * force;

                sourceNode.vx += fx;
                sourceNode.vy += fy;
                sourceNode.vz += fz;
                targetNode.vx -= fx;
                targetNode.vy -= fy;
                targetNode.vz -= fz;
            }
        });

        // Centering force
        nodes.forEach((node) => {
            node.vx -= node.x * centeringStrength;
            node.vy -= node.y * centeringStrength;
            node.vz -= node.z * centeringStrength;
        });

        // Apply velocities with damping
        nodes.forEach((node) => {
            node.x += node.vx * damping;
            node.y += node.vy * damping;
            node.z += node.vz * damping;
        });
    }

    return { nodes, edges: skillRelationships };
}
