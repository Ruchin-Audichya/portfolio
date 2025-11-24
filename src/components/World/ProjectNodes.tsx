import { projects } from "@/data/projects";
import { ProjectNode } from "./ProjectNode";

interface ProjectNodesProps {
    onNodeClick: (id: string) => void;
    isNight: boolean;
}

export function ProjectNodes({ onNodeClick, isNight }: ProjectNodesProps) {
    const radius = 6;
    const startAngle = Math.PI; // Start from back/side
    const angleStep = Math.PI / (projects.length + 1);

    return (
        <group>
            {projects.map((project, index) => {
                const angle = startAngle + (index + 1) * angleStep;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                return (
                    <ProjectNode
                        key={project.title}
                        id={project.title as any} // Using title as ID for now, ideally add ID to project data
                        position={[x, 1.5, z]}
                        label={project.title}
                        onClick={() => onNodeClick(project.title as any)}
                        isNight={isNight}
                    />
                );
            })}
        </group>
    );
}
