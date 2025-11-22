"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { content } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";
import { Timeline } from "@/components/Timeline";
import { ScrollReveal } from "@/components/ScrollReveal";

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl -z-10" />
      <div className="absolute right-10 bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <ScrollReveal width="100%">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <div className="inline-block rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent border border-accent/20">
                  About Me
                </div>
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                  {content.profile.bio_title}
                </h2>
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {content.profile.bio[0]}
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {content.profile.bio[1]}
                  </p>
                  <div className="pt-4">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors"
                    >
                      Download Resume
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2 text-primary">Mission</h3>
                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                      {content.profile.mission}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2 text-primary">Focus</h3>
                    <p className="text-muted-foreground font-medium text-sm">
                      Cloud Architecture, AI Agents, Interactive 3D Web
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
                  <span className="w-8 h-1 bg-accent rounded-full" />
                  Journey
                </h3>
                <Timeline />
              </div>
            </div>

            <div className="flex-1 flex justify-center sticky top-24">
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl ring-1 ring-white/30 hover:scale-105 transition-transform duration-500">
                <Image
                  src={content.profile.avatar}
                  alt={content.profile.name}
                  fill
                  className="object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
