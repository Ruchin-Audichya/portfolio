"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface MarqueeTextProps {
  text: string;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}

export function MarqueeText({
  text,
  direction = "left",
  speed = 30,
  className = "",
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Add scroll-based skew effect
  const skewX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    direction === "left" ? [5, 0, -5] : [-5, 0, 5]
  );

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden py-6 md:py-10 ${className}`}
    >
      <motion.div
        className="flex whitespace-nowrap"
        style={{ skewX }}
        animate={{
          x: direction === "left" ? [0, -1920] : [-1920, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="text-[8vw] md:text-[6vw] font-black text-white/[0.04] uppercase tracking-tight mx-4 select-none"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
