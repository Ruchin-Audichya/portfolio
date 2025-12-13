"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
}

export function TextReveal({ text, className = "" }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={`py-16 md:py-24 ${className}`}>
      <p className="flex flex-wrap justify-center text-3xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-6xl mx-auto px-4 text-center">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </p>
    </div>
  );
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [8, 0]);
  const blur = useTransform(progress, range, [4, 0]);

  return (
    <motion.span
      style={{ 
        opacity, 
        y,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
      }}
      className="mr-2 md:mr-3 mb-2 text-white inline-block"
    >
      {children}
    </motion.span>
  );
}
