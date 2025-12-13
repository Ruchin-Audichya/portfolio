"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface VariableWeightTextProps {
  text: string;
  className?: string;
}

export function VariableWeightText({ text, className = "" }: VariableWeightTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Create breathing font weight based on scroll
  const fontWeight = useTransform(scrollYProgress, [0, 0.5, 1], [200, 900, 200]);

  return (
    <div ref={containerRef} className={`py-12 overflow-hidden ${className}`}>
      <motion.h3
        className="text-[12vw] md:text-[10vw] font-display text-center text-white/10 uppercase tracking-tighter leading-none select-none"
        style={{
          fontWeight,
          fontVariationSettings: useTransform(fontWeight, (w) => `"wght" ${w}`),
        }}
      >
        {text}
      </motion.h3>
    </div>
  );
}
