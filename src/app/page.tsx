"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/3d/Scene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Achievements } from "@/components/sections/Achievements";
import { Github } from "@/components/sections/Github";
import { Guestbook } from "@/components/sections/Guestbook";
import { Contact } from "@/components/sections/Contact";
import { ScrollReveal } from "@/components/ScrollReveal";
import { IntroOverlay } from "@/components/IntroOverlay";
import { Navbar } from "@/components/Navbar";
import { DayNightToggle } from "@/components/DayNightToggle";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    let latestY = window.scrollY;

    const compute = () => {
      rafId = null;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.max(latestY / total, 0), 1) : 0;
      setScrollProgress(progress);
    };

    const onScroll = () => {
      latestY = window.scrollY;
      if (rafId == null) rafId = window.requestAnimationFrame(compute);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNodeClick = (id: string) => {
    // Map IDs to section IDs
    const sectionMap: Record<string, string> = {
      journey: "about",
      skills: "skills",
      projects: "projects",
      testimonials: "guestbook", // Assuming testimonials maps to guestbook or similar
    };

    const sectionId = sectionMap[id] || id; // Fallback to ID if not in map (for dynamic projects)
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* Intro Overlay - High Z-Index */}
      <AnimatePresence>
        {showIntro && (
          <IntroOverlay key="intro" onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <div className={`transition-opacity duration-1000 ${showIntro ? "opacity-0" : "opacity-100"}`}>
        <Navbar />
      </div>

      <section id="world" className="h-screen w-full relative">
        {/* Scene loads during intro (hidden) for faster reveal */}
        <div className={showIntro ? "opacity-0 pointer-events-none" : ""}>
          <Scene onNodeClick={handleNodeClick} scrollProgress={scrollProgress} />
        </div>
        
        {showIntro ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
        ) : (
          <>
            <div className="absolute inset-0 z-30 flex items-start justify-end p-4 pt-20 md:p-6 md:pt-6 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-3 md:gap-4" style={{ touchAction: 'manipulation' }}>
                <DayNightToggle />
              </div>
            </div>
            <div className="absolute left-4 bottom-4 z-10 pointer-events-none">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-lg backdrop-blur">
                <span>Ruchin Audichya</span>
                <span className="text-white/70">AWS/DevOps • Full-Stack • Salesforce</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Content Sections - Always Dark Theme */}
      <div className="relative z-10 bg-[#0a0a0f] text-white dark">
        <ScrollReveal width="100%">
          <About />
        </ScrollReveal>

        <ScrollReveal width="100%">
          <Skills />
        </ScrollReveal>

        <ScrollReveal width="100%">
          <Projects />
        </ScrollReveal>

        <ScrollReveal width="100%">
          <Achievements />
        </ScrollReveal>

        <ScrollReveal width="100%">
          <Github />
        </ScrollReveal>

        <ScrollReveal width="100%">
          <Guestbook />
        </ScrollReveal>

        <ScrollReveal width="100%">
          <Contact />
        </ScrollReveal>

        <footer className="py-8 text-center text-sm text-white/50 border-t border-white/10">
          <p>© {new Date().getFullYear()} Ruchin Audichya. Engineered with precision.</p>
        </footer>
      </div>
    </main>
  );
}
