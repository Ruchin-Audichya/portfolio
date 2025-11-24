import { content } from "./content";

export interface SkillNode {
    id: string;
    label: string;
    category: string;
    type: "skill" | "project" | "category";
    position: [number, number, number];
    connections: string[]; // IDs of connected nodes
    color: string;
}

export interface SkillGraph {
    nodes: SkillNode[];
    edges: { source: string; target: string }[];
}

// Helper to distribute points on a sphere
const getSpherePosition = (index: number, total: number, radius: number): [number, number, number] => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
    ];
};

export const generateSkillGraph = (): SkillGraph => {
    const nodes: SkillNode[] = [];
    const edges: { source: string; target: string }[] = [];

    // 1. Create Category Nodes (Central Hubs)
    const categories = content.skills.map((cat, i) => {
        const radius = 2; // Inner core
        // Distribute categories evenly around the center
        const angle = (i / content.skills.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return {
            id: `cat-${cat.category}`,
            label: cat.category,
            category: cat.category,
            type: "category" as const,
            position: [x, 0, z] as [number, number, number],
            connections: [],
            color: getCategoryColor(i),
        };
    });
    nodes.push(...categories);

    // 2. Create Skill Nodes (Surrounding Categories)
    content.skills.forEach((cat, catIndex) => {
        const catNode = nodes.find((n) => n.id === `cat-${cat.category}`);
        if (!catNode) return;

        cat.items.forEach((skill, skillIndex) => {
            // Position skills in a cloud around their category
            // Use a slightly randomized offset from the category position
            const offsetRadius = 3 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            // Bias position towards category sector but with 3D spread
            const basePos = catNode.position;
            const x = basePos[0] * 1.5 + offsetRadius * Math.sin(phi) * Math.cos(theta);
            const y = basePos[1] + offsetRadius * Math.sin(phi) * Math.sin(theta);
            const z = basePos[2] * 1.5 + offsetRadius * Math.cos(phi);

            const skillId = `skill-${skill}`;
            nodes.push({
                id: skillId,
                label: skill,
                category: cat.category,
                type: "skill",
                position: [x, y, z],
                connections: [catNode.id],
                color: catNode.color, // Inherit color
            });

            edges.push({ source: catNode.id, target: skillId });
        });
    });

    // 3. Create Project Nodes (Outer Layer)
    content.projects.forEach((project, i) => {
        const radius = 8; // Outer shell
        const pos = getSpherePosition(i, content.projects.length, radius);

        const projectId = `proj-${project.slug}`;
        const projectNode: SkillNode = {
            id: projectId,
            label: project.title,
            category: "Project",
            type: "project",
            position: pos,
            connections: [],
            color: "#ffffff",
        };
        nodes.push(projectNode);

        // Link Projects to Skills based on tags/tech
        project.tech.forEach((tech) => {
            // Fuzzy match tech to skills
            const skillNode = nodes.find(
                (n) => n.type === "skill" && n.label.toLowerCase().includes(tech.toLowerCase())
            );
            if (skillNode) {
                edges.push({ source: projectId, target: skillNode.id });
                projectNode.connections.push(skillNode.id);
                skillNode.connections.push(projectId);
            }
        });
    });

    return { nodes, edges };
};

const getCategoryColor = (index: number) => {
    const colors = [
        "#a855f7", // Purple (Cloud)
        "#3b82f6", // Blue (AI)
        "#ec4899", // Pink (Frontend)
        "#10b981", // Emerald (Automation)
        "#f59e0b", // Amber (System)
    ];
    return colors[index % colors.length];
};
