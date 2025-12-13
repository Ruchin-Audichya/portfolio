"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/3d/Scene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});
import { KineticAbout } from "@/components/sections/KineticAbout";
import { Skills } from "@/components/sections/Skills";
import { KineticProjects } from "@/components/sections/KineticProjects";
import { KineticAchievements } from "@/components/sections/KineticAchievements";
import { Github } from "@/components/sections/Github";
import { Guestbook } from "@/components/sections/Guestbook";
import { Contact } from "@/components/sections/Contact";
import { ScrollReveal } from "@/components/ScrollReveal";
import { IntroOverlay } from "@/components/IntroOverlay";
import { Navbar } from "@/components/Navbar";
import { DayNightToggle } from "@/components/DayNightToggle";
import { HotTypeSection } from "@/components/typography";

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
            {/* Top controls: Day/Night toggle - positioned to avoid navbar overlap */}
            <div className="absolute z-30 right-4 top-20 md:right-6 md:top-20 pointer-events-none">
              <div className="pointer-events-auto" style={{ touchAction: 'manipulation' }}>
                <DayNightToggle />
              </div>
            </div>
            
            {/* Touch hint for mobile */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none md:hidden">
              <div className="flex items-center gap-2 rounded-full bg-black/50 backdrop-blur px-3 py-1.5 text-xs text-white/70 animate-pulse">
                <span>👆 Drag to rotate • Pinch to zoom</span>
              </div>
            </div>
            
            {/* Bottom info badge */}
            <div className="absolute left-4 bottom-20 z-10 pointer-events-none">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-lg backdrop-blur">
                <span>Ruchin Audichya</span>
                <span className="text-white/70 hidden sm:inline">AWS/DevOps • Full-Stack • Salesforce</span>
              </div>
            </div>
            
            {/* Prominent scroll button */}
            <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center pointer-events-none">
              <a
                href="#about"
                className="pointer-events-auto group flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 font-bold uppercase tracking-wider shadow-lg hover:bg-purple-500 hover:text-white transition-all duration-300 hover:shadow-purple-500/25"
                style={{ touchAction: 'manipulation' }}
              >
                <span>View Portfolio</span>
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </>
        )}
      </section>

      {/* HotType Kinetic Typography Section */}
      <HotTypeSection />

      {/* Kinetic Sections - Below 3D World */}
      <div className="relative z-10 bg-[#0a0a0f] text-white dark">
        {/* Origin / About - Floating fragments, staggered reveals */}
        <KineticAbout />

        <ScrollReveal width="100%">
          <Skills />
        </ScrollReveal>

        {/* Featured Projects - Kinetic typography, scroll-linked motion */}
        <KineticProjects />

        {/* Achievements - Milestones with authority, gentle glow */}
        <KineticAchievements />

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
