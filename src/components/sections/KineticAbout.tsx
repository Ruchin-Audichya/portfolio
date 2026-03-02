"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { content } from "@/lib/content";

// Floating text fragment component
function FloatingFragment({
  children,
  delay = 0,
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.span>
  );
}

// Staggered line reveal
function StaggeredLines({
  lines,
  className = "",
  lineClassName = "",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <motion.p
          key={i}
          className={lineClassName}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{
            duration: 0.6,
            delay: i * 0.15,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

// Origin story panel
function OriginPanel({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const opacity = useTransform(progress, [0, 0.15, 0.35, 0.5], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.15, 0.35, 0.5], [60, 0, 0, -60]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  const originLines = [
    "2017 — started taking PCs apart.",
    "Not for school. Because the fan was loud and I wanted to know why.",
    "Built rigs from parts. Overclocked. Broke things. Fixed them.",
    "CS:GO taught me more than any class — reflexes, systems thinking, discipline.",
    "That curiosity never went away. It just found new hardware.",
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-8"
      style={{ opacity, y: springY }}
    >
      <div className="max-w-3xl text-center">
        <motion.span
          className="text-8xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ opacity: useTransform(progress, [0.1, 0.25], [0, 0.15]) }}
        >
          2017
        </motion.span>

        <StaggeredLines
          lines={originLines}
          className="space-y-4 relative z-10"
          lineClassName="text-xl md:text-2xl text-white/70 font-light tracking-wide"
        />
      </div>
    </motion.div>
  );
}

// Evolution panel
function EvolutionPanel({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const opacity = useTransform(progress, [0.35, 0.5, 0.65, 0.8], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.35, 0.5, 0.65, 0.8], [60, 0, 0, -60]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-8"
      style={{ opacity, y: springY }}
    >
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div>
            <FloatingFragment delay={0}>
              <span className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                2021
              </span>
            </FloatingFragment>
          </div>

          <div className="space-y-4">
            <FloatingFragment delay={0.2}>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                College. Real builds.
              </h3>
            </FloatingFragment>

            <FloatingFragment delay={0.3}>
              <p className="text-lg text-white/60 leading-relaxed">
                Moved from hardware to cloud. Got my hands dirty with AWS — provisioned infra, broke IAM policies at 2am, passed both Cloud and AI Practitioner exams. Started leading the AWS Cloud Club at JECRC.
              </p>
            </FloatingFragment>
          </div>
        </div>

        <motion.div
          className="relative aspect-square max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-sm" />
          <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Now panel
function NowPanel({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const opacity = useTransform(progress, [0.7, 0.85, 1], [0, 1, 1]);
  const y = useTransform(progress, [0.7, 0.85], [60, 0]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-8"
      style={{ opacity, y: springY }}
    >
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          className="relative aspect-square max-w-md mx-auto order-2 lg:order-1"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10">
            <Image
              src={content.profile.avatar}
              alt={content.profile.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
          </div>
        </motion.div>

        <div className="space-y-8 order-1 lg:order-2">
          <div>
            <FloatingFragment delay={0}>
              <span className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
                Now
              </span>
            </FloatingFragment>
          </div>

          <div className="space-y-4">
            <FloatingFragment delay={0.2}>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Building. Shipping. Iterating.
              </h3>
            </FloatingFragment>

            <FloatingFragment delay={0.3}>
              <p className="text-lg text-white/60 leading-relaxed">
                Cloud/DevOps on AWS. Full-stack with Next.js and TypeScript. Salesforce Apex for automation. I pick the tool that fits, not the one that's trendy.
              </p>
            </FloatingFragment>

            <FloatingFragment delay={0.4}>
              <p className="text-base text-white/40 italic">
                This portfolio is itself a project — a Three.js black hole with GLSL shaders, gravitational lensing, and post-processing. Everything you see here, I built.
              </p>
            </FloatingFragment>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Progress indicator
function TimelineProgress({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const scaleY = useSpring(progress, { stiffness: 100, damping: 30 });

  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 h-48 w-px bg-white/10">
      <motion.div
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 origin-top"
        style={{ scaleY, height: "100%" }}
      />

      {/* Year markers */}
      {[
        { pos: "0%", label: "2017" },
        { pos: "50%", label: "2021" },
        { pos: "100%", label: "Now" },
      ].map((marker) => (
        <div
          key={marker.label}
          className="absolute left-4 text-xs font-mono text-white/40"
          style={{ top: marker.pos, transform: "translateY(-50%)" }}
        >
          {marker.label}
        </div>
      ))}
    </div>
  );
}

export function KineticAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative bg-[#0a0a0f]"
      style={{ height: "300vh" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px]"
            style={{
              x: useTransform(scrollYProgress, [0, 0.5], [0, -100]),
              opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]),
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px]"
            style={{
              x: useTransform(scrollYProgress, [0, 0.5, 1], [0, 50, 100]),
            }}
          />
        </div>

        {/* Section label */}
        <motion.div
          className="absolute top-8 left-8 z-20 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-12 h-[1px] bg-gradient-to-r from-white/50 to-transparent" />
          <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-medium">
            Origin
          </span>
        </motion.div>

        {/* Content panels */}
        <OriginPanel progress={scrollYProgress} />
        <EvolutionPanel progress={scrollYProgress} />
        <NowPanel progress={scrollYProgress} />

        {/* Timeline progress */}
        <TimelineProgress progress={scrollYProgress} />
      </div>
    </section>
  );
}
