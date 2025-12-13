"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { content } from "@/lib/content";
import { TypewriterDelete } from "@/components/typography/TypewriterDelete";

export function CinematicAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Horizontal scroll for panels
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]);
  
  // Background parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const panels = [
    {
      id: "origin",
      title: "Origin",
      subtitle: "Where it began",
      content: "PC & systems enthusiast since childhood — the kind of curiosity that turns into real builds: troubleshooting, optimizing, and making systems feel fast and stable.",
      accent: "from-cyan-500 to-blue-600",
      year: "2017",
    },
    {
      id: "evolution",
      title: "Evolution",
      subtitle: "The grind",
      content: "In college, that mindset moved into cloud and engineering: AWS fundamentals, APIs, GitHub, automation, and cost-aware design — building things that ship and survive real usage.",
      accent: "from-purple-500 to-pink-600",
      year: "2021",
    },
    {
      id: "now",
      title: "Now",
      subtitle: "Full-stack mode",
      content: "I work across Cloud/DevOps and full-stack (Next.js/TypeScript), and I've also built on Salesforce (Apex + automation) where process and reliability matter as much as code.",
      accent: "from-pink-500 to-orange-500",
      year: "2024",
    },
  ];

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative bg-[#0a0a0f]"
      style={{ height: `${(panels.length + 1) * 100}vh` }}
    >
      {/* Sticky container for horizontal scroll effect */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: bgY }}
        >
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px]" />
        </motion.div>

        {/* Section header - fixed */}
        <div className="absolute top-8 left-8 z-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-white/60 text-sm uppercase tracking-[0.3em] font-medium">
              About Me
            </span>
          </motion.div>
        </div>

        {/* Horizontal scrolling panels */}
        <motion.div
          className="flex h-full"
          style={{ x }}
        >
          {/* Intro panel with typewriter */}
          <div className="w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-20">
            <div className="max-w-4xl">
              <motion.h2
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <TypewriterDelete
                  staticText="I'm a "
                  deleteText="regular developer..."
                  finalText="builder who ships."
                  typingSpeed={60}
                  deleteSpeed={40}
                  pauseDuration={1200}
                />
              </motion.h2>
              <motion.p
                className="text-xl md:text-2xl text-white/50 max-w-2xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 3, duration: 0.8 }}
              >
                This portfolio is my proof-of-work: an interactive 3D world + real projects, 
                designed like a product.
              </motion.p>
            </div>
          </div>

          {/* Journey panels */}
          {panels.map((panel, i) => (
            <div
              key={panel.id}
              className="w-screen h-full flex-shrink-0 flex items-center px-8 md:px-20"
            >
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text content */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Year badge */}
                  <div className="flex items-center gap-4">
                    <span className={`text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r ${panel.accent}`}>
                      {panel.year}
                    </span>
                    <div className="h-16 w-[1px] bg-white/20" />
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {panel.title}
                      </h3>
                      <p className="text-white/40 text-sm uppercase tracking-widest">
                        {panel.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                    {panel.content}
                  </p>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-2 pt-4">
                    {panels.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === i 
                            ? `w-12 bg-gradient-to-r ${panel.accent}` 
                            : "w-4 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Visual element */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative aspect-square max-w-md mx-auto"
                >
                  {i === panels.length - 1 ? (
                    // Profile image for the "Now" panel
                    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10">
                      <Image
                        src={content.profile.avatar}
                        alt={content.profile.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                    </div>
                  ) : (
                    // Abstract shape for other panels
                    <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${panel.accent} opacity-10 flex items-center justify-center`}>
                      <div className={`w-3/4 h-3/4 rounded-2xl bg-gradient-to-br ${panel.accent} opacity-30`} />
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll progress */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {[0, 1, 2, 3].map((i) => {
            const start = i / 4;
            const end = (i + 1) / 4;
            return (
              <ProgressDot
                key={i}
                progress={scrollYProgress}
                start={start}
                end={end}
              />
            );
          })}
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/30 text-sm"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>Scroll</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

function ProgressDot({
  progress,
  start,
  end,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const scale = useTransform(progress, [start, (start + end) / 2, end], [1, 1.5, 1]);
  const opacity = useTransform(progress, [start, (start + end) / 2, end], [0.3, 1, 0.3]);
  const height = useTransform(progress, [start, (start + end) / 2, end], [8, 24, 8]);

  return (
    <motion.div
      className="w-1 rounded-full bg-white"
      style={{ scale, opacity, height }}
    />
  );
}
