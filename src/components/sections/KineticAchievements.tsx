"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { content } from "@/lib/content";

interface Milestone {
  year?: string;
  title: string;
  issuer: string;
  description?: string;
  credentialUrl?: string;
}

// Milestone card with scroll-linked glow
function MilestoneCard({
  milestone,
  index,
}: {
  milestone: Milestone;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center", "end start"],
  });

  // Glow intensity based on scroll position
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.8, 0]
  );
  const springGlow = useSpring(glowOpacity, { stiffness: 100, damping: 30 });

  // Subtle y movement
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      style={{ y: springY }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-cyan-500/20 blur-2xl pointer-events-none"
        style={{ opacity: springGlow }}
      />

      <motion.div
        className="relative p-8 md:p-12 rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{
          duration: 0.7,
          delay: index * 0.15,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
          {/* Year */}
          <div className="flex-shrink-0">
            <motion.span
              className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/40 to-white/10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {milestone.year}
            </motion.span>
          </div>

          {/* Content */}
          <div className="flex-grow space-y-3">
            <motion.h3
              className="text-2xl md:text-3xl font-bold text-white tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {milestone.title}
            </motion.h3>

            <motion.p
              className="text-sm font-mono uppercase tracking-[0.2em] text-white/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {milestone.issuer}
            </motion.p>

            {milestone.description && (
              <motion.p
                className="text-lg text-white/50 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {milestone.description}
              </motion.p>
            )}

            {milestone.credentialUrl && (
              <motion.a
                href={milestone.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-purple-400/80 hover:text-purple-300 transition-colors group mt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="border-b border-transparent group-hover:border-purple-400/50 transition-colors">
                  View Credential
                </span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function KineticAchievements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const milestones: Milestone[] = content.certifications;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [60, 0]),
    { stiffness: 100, damping: 30 }
  );

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="relative py-32 bg-[#0a0a0f]"
    >
      {/* Minimal ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-purple-500/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-4xl relative">
        {/* Section header */}
        <motion.div className="text-center mb-20" style={{ y: titleY }}>
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-8 h-[1px] bg-white/30" />
            <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-medium">
              Milestones
            </span>
            <div className="w-8 h-[1px] bg-white/30" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-bold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/60">
              Certifications
            </span>
          </motion.h2>

          <motion.p
            className="text-lg text-white/40 mt-4 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Verified learning signals across AI, cloud, and enterprise platforms.
          </motion.p>
        </motion.div>

        {/* Milestones list */}
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <MilestoneCard key={milestone.title} milestone={milestone} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
