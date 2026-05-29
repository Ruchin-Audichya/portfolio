"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { content } from "@/lib/content";

// A single line that fades in with a subtle blur — used for the staggered story.
function FadeLine({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.p>
  );
}

export function KineticAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const blobX1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const blobX2 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative bg-[#0a0a0f] py-28 md:py-36 overflow-hidden"
    >
      {/* Ambient background */}
      {!reduceMotion && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[480px] h-[480px] rounded-full bg-cyan-500/5 blur-[140px]"
            style={{ x: blobX1 }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-purple-500/5 blur-[120px]"
            style={{ x: blobX2 }}
          />
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-6 md:px-12">
        {/* Section label */}
        <motion.div
          className="mb-12 flex items-center gap-3 justify-center md:justify-start"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="h-px w-10 bg-gradient-to-r from-cyan-300/60 to-transparent" />
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-200/80">
            About
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 md:gap-14 items-start">
          {/* Avatar / portrait */}
          <motion.div
            className="relative aspect-[4/5] w-full max-w-sm mx-auto lg:mx-0"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-purple-500/15 to-pink-500/20 blur-xl opacity-60" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-white/5">
              <Image
                src={content.profile.avatar}
                alt={content.profile.name}
                fill
                priority={false}
                sizes="(max-width: 768px) 80vw, 30vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {content.profile.badges.slice(0, 3).map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/80 backdrop-blur"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Story */}
          <div className="space-y-7">
            <motion.h2
              className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.05]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {content.profile.bio_title}
            </motion.h2>

            <div className="space-y-5">
              {content.profile.bio.map((line, i) => (
                <FadeLine
                  key={i}
                  delay={0.1 + i * 0.08}
                  className="text-base md:text-lg leading-relaxed text-white/65"
                >
                  {line}
                </FadeLine>
              ))}
            </div>

            <motion.div
              className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href="#projects"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-400/10 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400 hover:text-black"
              >
                See the projects
              </a>
              <a
                href="#experience"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Experience
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
