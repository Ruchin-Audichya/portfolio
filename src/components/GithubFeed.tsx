"use client";

import { useEffect, useState } from "react";
import { Github, Star, GitFork } from "lucide-react";

interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language: string;
}

export default function GithubFeed() {
    const [repos, setRepos] = useState<Repo[]>([]);

    useEffect(() => {
        fetch("https://api.github.com/users/Ruchin-Audichya/repos?sort=updated&per_page=4")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setRepos(data);
                }
            })
            .catch((err) => console.error("Failed to fetch repos", err));
    }, []);

    if (repos.length === 0) return null;

    return (
        <section className="py-24 px-6 bg-background border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <Github className="w-8 h-8 text-white" />
                    <h2 className="text-3xl font-display font-bold">Latest from GitHub</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {repos.map((repo) => (
                        <a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-6 border border-white/10 bg-surface/30 hover:border-accent/50 hover:bg-surface/50 transition-all rounded-lg"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold font-mono group-hover:text-accent transition-colors">
                                    {repo.name}
                                </h3>
                                <div className="flex items-center gap-4 text-xs text-muted font-mono">
                                    {repo.language && <span>{repo.language}</span>}
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3" /> {repo.stargazers_count}
                                    </span>
                                </div>
                            </div>
                            <p className="text-muted text-sm line-clamp-2">
                                {repo.description || "No description available."}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
