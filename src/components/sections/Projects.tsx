"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowUpRight } from "lucide-react"
import { projects } from "@/data/projects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      {/* Decorative background blobs */}
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl -z-10" />
      <div className="absolute left-0 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-16"
        >
          <div className="text-center space-y-4">
            <div className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2">
              Portfolio
            </div>
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Featured Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A selection of projects demonstrating my work in Cloud, Business, and Community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full flex flex-col glass-panel border-0 relative overflow-hidden card-hover-glow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-medium bg-secondary/50 hover:bg-secondary transition-colors">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex gap-3 pt-4 border-t border-border/50">
                    {project.github && (
                      <Button asChild variant="outline" size="sm" className="flex-1 gap-2 hover-bounce rounded-full">
                        <Link href={project.github} target="_blank">
                          <Github className="h-4 w-4" /> Code
                        </Link>
                      </Button>
                    )}
                    {project.link && (
                      <Button asChild size="sm" className="flex-1 gap-2 hover-bounce rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-primary/25">
                        <Link href={project.link} target="_blank">
                          <ExternalLink className="h-4 w-4" /> Live Demo
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
