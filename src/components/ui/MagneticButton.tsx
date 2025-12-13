"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  onClick?: () => void;
  href?: string;
  target?: string;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  radius = 150,
  onClick,
  href,
  target,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Glow effect transforms
  const glowOpacity = useTransform(
    [mouseX, mouseY],
    ([latestX, latestY]) => {
      const distance = Math.sqrt((latestX as number) ** 2 + (latestY as number) ** 2);
      return Math.max(0, 1 - distance / 50);
    }
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance < radius) {
        mouseX.set(distanceX * strength);
        mouseY.set(distanceY * strength);
        setIsHovered(true);
      } else {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, radius, strength]);

  const Component = href ? "a" : "button";
  const componentProps = href ? { href, target } : { onClick };

  return (
    <motion.div
      ref={buttonRef}
      style={{ x, y }}
      className="relative inline-block"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl -z-10"
        style={{ opacity: glowOpacity }}
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      <Component
        {...componentProps}
        className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
      >
        <motion.span
          className="relative z-10"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </Component>
    </motion.div>
  );
}
