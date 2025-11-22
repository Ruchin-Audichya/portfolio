import { content } from "@/lib/content";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Magnetic from "@/components/Magnetic";

export async function generateStaticParams() {
    return content.projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const project = content.projects.find((p) => p.slug === params.slug);
    if (!project) return { title: "Project Not Found" };

    return {
        title: `${project.title} | Ruchin Audichya`,
        description: project.description,
    };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
    const project = content.projects.find((p) => p.slug === params.slug);

    if (!project || !project.caseStudy) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <ScrollReveal width="100%">
                <Link
                    href="/#projects"
                    className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-accent mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                </Link>

                <header className="mb-16">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest border border-accent/20">
                            {project.category}
                        </span>
                        <span className="text-muted-foreground font-mono text-sm">
                            {project.year}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
                        {project.title}
                    </h1>

                    <div className="flex flex-wrap gap-3 mb-8">
                        {project.tech.map((tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
                        {project.description}
                    </p>
                </header>

                <div className="grid gap-16 md:grid-cols-[2fr,1fr]">
                    <div className="space-y-16">
                        {/* Problem */}
                        <section>
                            <div className="flex items-center gap-3 mb-6 text-accent-teal">
                                <AlertTriangle className="w-6 h-6" />
                                <h2 className="text-2xl font-bold uppercase tracking-widest">The Problem</h2>
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {project.caseStudy.problem}
                            </p>
                        </section>

                        {/* Solution */}
                        <section>
                            <div className="flex items-center gap-3 mb-6 text-accent">
                                <Lightbulb className="w-6 h-6" />
                                <h2 className="text-2xl font-bold uppercase tracking-widest">The Solution</h2>
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {project.caseStudy.solution}
                            </p>
                        </section>

                        {/* Challenges */}
                        <section>
                            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6">Key Challenges</h2>
                            <div className="grid gap-4">
                                {project.caseStudy.challenges.map((challenge, i) => (
                                    <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <span className="text-accent font-mono font-bold">0{i + 1}</span>
                                        <p className="text-muted-foreground">{challenge}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        {/* Outcomes Card */}
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-accent/20 to-transparent border border-accent/20 sticky top-32">
                            <h3 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-accent" /> Outcomes
                            </h3>
                            <ul className="space-y-4">
                                {project.caseStudy.outcomes.map((outcome, i) => (
                                    <li key={i} className="flex gap-3 text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                        <span className="text-foreground/90">{outcome}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <div className="text-center">
                                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Result Metric</p>
                                    <p className="text-3xl font-black text-white">{project.metrics}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
