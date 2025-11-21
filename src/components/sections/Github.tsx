"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, GitFork, Github as GithubIcon, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Repo {
  id: number
  name: string
  description: string
  html_url: string
  stargazers_count: number
  language: string
  updated_at: string
}

export function Github() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Fetch all repos to filter client-side for better "Top" selection
        const response = await fetch("https://api.github.com/users/Ruchin-Audichya/repos?sort=updated&per_page=100")
        if (!response.ok) throw new Error("Failed to fetch repos")
        const data: Repo[] = await response.json()

        // Sort by stars (descending) and take top 6
        const topRepos = data
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6)

        setRepos(topRepos)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [])

  if (error) return null

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
              Top Repositories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              My most starred and active contributions to the community.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-[240px] animate-pulse bg-muted border-none shadow-none" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {repos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group h-full flex flex-col glass-panel border-0 relative overflow-hidden card-hover-glow">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-xl font-bold truncate pr-4" title={repo.name}>
                          <Link href={repo.html_url} target="_blank" className="hover:text-purple-500 transition-colors flex items-center gap-2">
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
                              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-yellow-500/90">
                            <Star className="h-4 w-4 fill-current" />
                            {repo.stargazers_count}
                          </span>
                        </div>

                        <Link
                          href={repo.html_url}
                          target="_blank"
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
          )}

          <div className="flex justify-center pt-8">
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-lg hover-bounce bg-foreground text-background hover:bg-foreground/90">
              <Link href="https://github.com/Ruchin-Audichya" target="_blank">
                View All Repositories <GithubIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
