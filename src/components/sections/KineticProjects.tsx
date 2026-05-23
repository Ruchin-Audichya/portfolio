"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { content } from "@/lib/content";

// Kinetic text reveal for project titles
function KineticTitle({ children, delay = 0 }: { children: string; delay?: number }) {
  const letters = children.split("");
  
  return (
    <span className="inline-flex overflow-hidden">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}

// Project card with scroll-linked motion
function ProjectCard({
  project,
  index,
}: {
  project: typeof content.projects[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Subtle vertical parallax
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  
  // Opacity fade
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      className={`relative py-16 md:py-24 ${isEven ? "" : "md:text-right"}`}
      style={{ y: springY, opacity }}
    >
      <div className={`max-w-3xl ${isEven ? "" : "md:ml-auto"}`}>
        {/* Project number */}
        <motion.span
          className="block text-8xl md:text-[10rem] font-black text-white/[0.03] absolute top-0 leading-none select-none pointer-events-none"
          style={{
            [isEven ? "left" : "right"]: "-5%",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        {/* Title with kinetic reveal */}
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 relative">
          <KineticTitle delay={index * 0.1}>{project.title}</KineticTitle>
        </h3>

        {/* Tags */}
        <motion.div
          className={`flex flex-wrap gap-2 mb-6 ${isEven ? "" : "md:justify-end"}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {project.tech.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-white/50 border border-white/10 rounded-full"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Description with staggered lines */}
        <motion.p
          className="text-lg md:text-xl text-white/60 leading-relaxed mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {project.description}
        </motion.p>

        <motion.div
          className={`mb-8 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-200 ${isEven ? "" : "md:ml-auto"}`}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {project.metrics}
        </motion.div>

        {/* Links */}
        <motion.div
          className={`flex gap-4 ${isEven ? "" : "md:justify-end"}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href={`/projects/${project.slug}`}
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <span className="border-b border-transparent group-hover:border-cyan-300/60 transition-colors">
              Read case study
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Decorative line */}
      <motion.div
        className={`absolute bottom-0 h-[1px] bg-gradient-to-r ${
          isEven
            ? "from-white/10 via-white/5 to-transparent left-0 right-1/2"
            : "from-transparent via-white/5 to-white/10 left-1/2 right-0"
        }`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ originX: isEven ? 0 : 1 }}
      />
    </motion.div>
  );
}

export function KineticProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const projects = content.projects;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Section title parallax
  const titleY = useSpring(
    useTransform(scrollYProgress, [0, 0.3], [100, 0]),
    { stiffness: 100, damping: 30 }
  );

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative py-32 bg-[#0a0a0f]"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-6xl relative">
        {/* Section header */}
        <motion.div className="text-center mb-24" style={{ y: titleY }}>
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-8 h-[1px] bg-white/30" />
            <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-medium">
              Selected Work
            </span>
            <div className="w-8 h-[1px] bg-white/30" />
          </motion.div>

          <motion.h2
            className="text-5xl md:text-7xl font-bold text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/60">
              Featured Projects
            </span>
          </motion.h2>
        </motion.div>

        {/* Project list */}
        <div className="relative">
          {projects.map((project, index) => (
            <ProjectCard key={`project-${index}`} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
