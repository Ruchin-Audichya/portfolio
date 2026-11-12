"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drives a demo timeline: `t` runs from 0 to 1 over `duration` ms.
 * Starts once when the element scrolls into view, and can be replayed.
 * With reduced motion it jumps straight to the finished state.
 */
export function useRun(duration: number) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);

  const play = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(1);
      setRunning(false);
      return;
    }
    const start = performance.now();
    setRunning(true);
    const frame = (now: number) => {
      const next = Math.min(1, (now - start) / duration);
      setT(next);
      if (next < 1) raf.current = requestAnimationFrame(frame);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(frame);
  }, [duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        play();
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [play]);

  return { ref, t, running, play };
}

/** Progress of a sub-range [from, to] of the timeline, clamped to 0..1. */
export const span = (t: number, from: number, to: number) => Math.min(1, Math.max(0, (t - from) / (to - from)));
