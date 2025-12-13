"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalScrollProps {
  children: React.ReactNode[];
  className?: string;
}

export function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(children.length - 1) * 100}%`]
  );

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${children.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ x }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              className="w-screen h-full flex-shrink-0 flex items-center justify-center"
            >
              {child}
            </div>
          ))}
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {children.map((_, i) => {
            const start = i / children.length;
            const end = (i + 1) / children.length;
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
      </div>
    </div>
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

  return (
    <motion.div
      className="w-2 h-2 rounded-full bg-white"
      style={{ scale, opacity }}
    />
  );
}
