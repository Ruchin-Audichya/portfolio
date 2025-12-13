"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useAnimationControls, Variants, TargetAndTransition } from "framer-motion";

interface SplitTextProps {
  children: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
  onComplete?: () => void;
  animation?: "fadeUp" | "slideIn" | "glitch" | "typewriter" | "wave";
  hover?: boolean;
}

const animations: Record<string, { initial: TargetAndTransition; animate: TargetAndTransition }> = {
  fadeUp: {
    initial: { opacity: 0, y: 40, rotateX: -90 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  glitch: {
    initial: { opacity: 0, x: -10, skewX: 20 },
    animate: { opacity: 1, x: 0, skewX: 0 },
  },
  typewriter: {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
  },
  wave: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
};

export function SplitText({
  children,
  className = "",
  charClassName = "",
  delay = 0,
  staggerDelay = 0.03,
  once = true,
  onComplete,
  animation = "fadeUp",
  hover = false,
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const controls = useAnimationControls();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chars = useMemo(() => children.split(""), [children]);

  useEffect(() => {
    if (hasAnimated && once) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("animate");
          setHasAnimated(true);
          if (onComplete) {
            setTimeout(onComplete, delay * 1000 + chars.length * staggerDelay * 1000 + 500);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [controls, hasAnimated, once, delay, chars.length, staggerDelay, onComplete]);

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const charVariants: Variants = {
    initial: animations[animation].initial,
    animate: {
      ...animations[animation].animate,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="initial"
      animate={controls}
      aria-label={children}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className={`inline-block ${charClassName} ${char === " " ? "w-[0.3em]" : ""}`}
          variants={charVariants}
          onMouseEnter={() => hover && setHoveredIndex(i)}
          onMouseLeave={() => hover && setHoveredIndex(null)}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
          whileHover={
            hover
              ? {
                  scale: 1.2,
                  color: "#ff00ff",
                  textShadow: "0 0 20px rgba(255, 0, 255, 0.8)",
                  transition: { duration: 0.1 },
                }
              : undefined
          }
          animate={
            hoveredIndex !== null && Math.abs(hoveredIndex - i) <= 2
              ? {
                  y: -5 * (1 - Math.abs(hoveredIndex - i) * 0.3),
                  transition: { duration: 0.1 },
                }
              : { y: 0 }
          }
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
