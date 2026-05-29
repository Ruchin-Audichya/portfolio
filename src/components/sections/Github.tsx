"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Github as GithubIcon, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Repo {
  id: number | string
  name: string
  description: string
  html_url: string
  stargazers_count: number
  language: string
  updated_at?: string
}

// Curated picks. These are the repos worth showing off, in priority order.
// Used as a static fallback when the GitHub API rate-limits the visitor and
// also as the source of truth for "which repos belong on the homepage".
const CURATED: Repo[] = [
  {
    id: "medifast",
    name: "MediFastRX-Bot",
    description:
      "RAG-powered medicine intelligence platform — 169K-record knowledge graph, 1.3M+ edges, BM25 + ChromaDB hybrid retrieval. Cognizant Technoverse 2026 Top-24.",
    html_url: "https://github.com/Ruchin-Audichya/MediFastRX-Bot",
    stargazers_count: 0,
    language: "Python",
  },
  {
    id: "placify",
    name: "Placify-AI",
    description:
      "End-to-end ML pipeline on 5,000+ student records. CatBoost classifier at 84.7% accuracy and 94.5% ROC-AUC, plus a FastAPI resume parser.",
    html_url: "https://github.com/shriya-gakkhar1/Minor-Project",
    stargazers_count: 0,
    language: "Python",
  },
  {
    id: "portfolio",
    name: "portfolio",
    description:
      "This site. A multi-pass Three.js black hole, hand-written GLSL, scroll-linked Framer motion, and recruiter-readable case studies.",
    html_url: "https://github.com/Ruchin-Audichya/portfolio",
    stargazers_count: 0,
    language: "TypeScript",
  },
]

const LANG_COLORS: Record<string, string> = {
  Python: "bg-yellow-400",
  TypeScript: "bg-sky-400",
  JavaScript: "bg-amber-300",
  HTML: "bg-orange-400",
  CSS: "bg-violet-400",
  Shell: "bg-emerald-400",
}

export function Github() {
  const [repos, setRepos] = useState<Repo[]>(CURATED)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchRepos = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/Ruchin-Audichya/repos?sort=updated&per_page=100",
          { cache: "no-store" }
        )
        if (!response.ok) throw new Error("Failed to fetch repos")
        const data: Repo[] = await response.json()
        if (!Array.isArray(data) || cancelled) return

        // Try to enrich the curated list with live star counts and updated_at
        // when we have it; keep curated as the ordering source of truth.
        const byUrl = new Map(data.map((r) => [r.html_url, r]))
        const enriched = CURATED.map((c) => {
          const live = byUrl.get(c.html_url)
          return live
            ? {
                ...c,
                stargazers_count: live.stargazers_count ?? c.stargazers_count,
                language: live.language || c.language,
                updated_at: live.updated_at,
              }
            : c
        })

        // If we still have room in the grid, fill with the most recently updated
        // non-fork repos so visitors see live activity beyond the curated three.
        const extras = data
          .filter(
            (r) =>
              !CURATED.some((c) => c.html_url === r.html_url) &&
              r.description &&
              !(r as any).fork
          )
          .slice(0, 6 - enriched.length)

        setRepos([...enriched, ...extras])
      } catch {
        // Silent fall back to the curated list, which we already rendered.
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRepos()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="github" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-16"
        >
          <div className="text-center space-y-4">
            <div className="inline-block rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-semibold text-purple-600 dark:text-purple-300 mb-2">
              Open Source
            </div>
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              On GitHub
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A curated set of public repositories. Live counts when GitHub is
              reachable; the picks themselves are hand-chosen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {repos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full flex flex-col glass-panel border-0 relative overflow-hidden card-hover-glow">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-xl font-bold truncate pr-4" title={repo.name}>
                        <Link
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-purple-500 transition-colors flex items-center gap-2"
                        >
                          {repo.name}
                        </Link>
                      </CardTitle>
                      <GithubIcon className="h-6 w-6 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow flex flex-col justify-between gap-6">
                    <CardDescription className="text-base line-clamp-3 leading-relaxed">
                      {repo.description || "No description available"}
                    </CardDescription>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-4 text-sm font-medium">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                LANG_COLORS[repo.language] ?? "bg-purple-500"
                              }`}
                            />
                            {repo.language}
                          </span>
                        )}
                        {!loading && repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1.5 text-yellow-500/90">
                            <Star className="h-4 w-4 fill-current" />
                            {repo.stargazers_count}
                          </span>
                        )}
                      </div>

                      <Link
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${repo.name} on GitHub`}
                        className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 h-12 text-base font-semibold shadow-lg hover-bounce bg-foreground text-background hover:bg-foreground/90"
            >
              <Link
                href="https://github.com/Ruchin-Audichya"
                target="_blank"
                rel="noopener noreferrer"
              >
                View all repositories <GithubIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
