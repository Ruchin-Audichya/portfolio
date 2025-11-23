import { content } from "@/lib/content";
import ProjectContent from "./ProjectContent";

// SEO Metadata for each project page
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const project = content.projects.find(p => p.slug === params.slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: `${project.title} | Ruchin Audichya`,
        description: project.description,
        openGraph: {
            title: `${project.title} | Ruchin Audichya`,
            description: project.description,
            images: [project.image],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: `${project.title} | Ruchin Audichya`,
            description: project.description,
            images: [project.image],
        },
    };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
    return <ProjectContent params={params} />;
}
