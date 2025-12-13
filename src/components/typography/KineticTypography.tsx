"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

interface KineticTypographyProps {
  className?: string;
}

// Staggered letter reveal component
function AnimatedLetters({ 
  text, 
  className = "", 
  delay = 0,
  mousePos,
}: { 
  text: string; 
  className?: string;
  delay?: number;
  mousePos: { x: number; y: number };
}) {
  const letters = useMemo(() => text.split(""), [text]);
  
  return (
    <motion.span className={`inline-flex ${className}`}>
      {letters.map((letter, i) => {
        const letterOffset = (i - letters.length / 2) * 0.5;
        
        return (
          <motion.span
            key={`${letter}-${i}`}
            initial={{ opacity: 0, y: 100, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.05,
              ease: [0.215, 0.61, 0.355, 1],
            }}
            style={{
              display: "inline-block",
              x: mousePos.x * (10 + letterOffset * 2),
              y: mousePos.y * 5,
            }}
            whileHover={{
              scale: 1.2,
              color: "#ff00ff",
              textShadow: "0 0 30px rgba(255, 0, 255, 0.8)",
              transition: { duration: 0.1 },
            }}
            className="cursor-default"
          >
            {letter}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

export function KineticTypography({ className = "" }: KineticTypographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
  });

  const opacity = useTransform(smoothProgress, [0, 0.15], [0, 1]);
  const y = useTransform(smoothProgress, [0, 0.25], [80, 0]);
  const scale = useTransform(smoothProgress, [0, 0.25], [0.95, 1]);

  // One-time boot glitch effect
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setShowGlitch(true);
      setTimeout(() => {
        setShowGlitch(false);
        setHasBooted(true);
      }, 150);
    }, 500);

    return () => clearTimeout(bootTimer);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const roles = [
    { text: "AWS Cloud", color: "from-cyan-400 to-blue-500", icon: "☁️" },
    { text: "Full-Stack", color: "from-purple-400 to-pink-500", icon: "⚡" },
    { text: "Salesforce", color: "from-orange-400 to-amber-500", icon: "🔧" },
  ];

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative min-h-screen bg-[#0a0a0f] overflow-hidden flex items-center justify-center ${className}`}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-[#0a0a0f]" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/8 blur-[120px]"
          animate={{
            x: mousePos.x * 80,
            y: mousePos.y * 80,
            scale: isHovering ? 1.3 : 1,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 30 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[120px]"
          animate={{
            x: mousePos.x * -50,
            y: mousePos.y * -50,
            scale: isHovering ? 1.2 : 1,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 30 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-pink-500/5 blur-[100px]"
          animate={{
            x: mousePos.x * -100 - 150,
            y: mousePos.y * 100 - 150,
          }}
          transition={{ type: "spring", stiffness: 20, damping: 25 }}
        />
      </div>

      {/* Main content */}
      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-10 flex flex-col items-center justify-center px-4 py-20"
      >
        {/* Kinetic headline with letter animation */}
        <div className="relative mb-16">
          <div className="relative">
            <h2 className="text-[14vw] md:text-[10vw] font-black tracking-tighter text-white leading-[0.85] text-center">
              <AnimatedLetters text="RUCHIN" mousePos={mousePos} delay={0.2} />
            </h2>

            {/* Glitch overlay - one time boot effect */}
            <AnimatePresence>
              {showGlitch && (
                <>
                  <motion.h2
                    className="absolute top-0 left-0 right-0 text-[14vw] md:text-[10vw] font-black tracking-tighter text-cyan-500 mix-blend-screen leading-[0.85] text-center pointer-events-none"
                    initial={{ x: -10, opacity: 0.8 }}
                    animate={{ x: [0, -5, 5, 0], opacity: [0.8, 1, 0.8] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    RUCHIN
                  </motion.h2>
                  <motion.h2
                    className="absolute top-0 left-0 right-0 text-[14vw] md:text-[10vw] font-black tracking-tighter text-pink-500 mix-blend-screen leading-[0.85] text-center pointer-events-none"
                    initial={{ x: 10, opacity: 0.8 }}
                    animate={{ x: [0, 5, -5, 0], opacity: [0.8, 1, 0.8] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    RUCHIN
                  </motion.h2>
                </>
              )}
            </AnimatePresence>

            {/* Subtle ambient glitch - very rare */}
            {hasBooted && (
              <motion.h2
                className="absolute top-0 left-0 right-0 text-[14vw] md:text-[10vw] font-black tracking-tighter text-cyan-500/10 mix-blend-screen leading-[0.85] text-center pointer-events-none"
                animate={{
                  x: [0, -2, 0],
                  opacity: [0, 0.2, 0],
                }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                  repeatDelay: 12,
                }}
              >
                RUCHIN
              </motion.h2>
            )}
          </div>

          {/* AUDICHYA with gradient */}
          <motion.h2
            className="text-[14vw] md:text-[10vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 leading-[0.85] text-center -mt-4 md:-mt-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            style={{
              x: mousePos.x * -20,
              y: mousePos.y * -10,
            }}
          >
            AUDICHYA
          </motion.h2>
        </div>

        {/* Animated role badges with icons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {roles.map((role, i) => (
            <motion.span
              key={role.text}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1 + i * 0.15 }}
              whileHover={{
                scale: 1.08,
                y: -4,
                boxShadow: "0 20px 40px -10px rgba(168, 85, 247, 0.3)",
              }}
              className="group px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-white border border-white/10 rounded-full backdrop-blur-sm cursor-default transition-all hover:border-purple-500/40 bg-white/[0.03]"
            >
              <span className="mr-2 group-hover:scale-110 inline-block transition-transform">{role.icon}</span>
              <span className={`bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}>
                {role.text}
              </span>
            </motion.span>
          ))}
        </motion.div>

        {/* Stats row with staggered reveal */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          {[
            { value: "2+", label: "Years Pro Dev" },
            { value: "10+", label: "Projects Shipped" },
            { value: "1x", label: "AWS Certified" },
            { value: "24/7", label: "Learning Mode" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="text-center cursor-default group"
            >
              <motion.span className="block text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-pink-300 group-hover:from-pink-400 group-hover:to-cyan-400 transition-all duration-300">
                {stat.value}
              </motion.span>
              <span className="text-white/40 text-xs md:text-sm uppercase tracking-[0.2em] mt-2 block group-hover:text-white/60 transition-colors">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              background: i % 3 === 0 ? "rgba(168, 85, 247, 0.4)" : i % 3 === 1 ? "rgba(236, 72, 153, 0.4)" : "rgba(34, 211, 238, 0.4)",
            }}
            animate={{
              y: [0, -60 - Math.random() * 40, 0],
              x: [0, (Math.random() - 0.5) * 30, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1 + Math.random() * 0.5, 0.5],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle marquee */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden py-6 pointer-events-none opacity-[0.03]">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, -1920] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-[12vw] md:text-[10vw] font-black text-white uppercase tracking-wider mx-4">
              BUILD • SHIP • ITERATE • CREATE •
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-5 h-8 rounded-full border border-white/20 flex justify-center p-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-white/60"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
