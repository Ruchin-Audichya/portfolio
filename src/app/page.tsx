"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";

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
import { CityNavigation } from "@/components/CityNavigation";
import { DayNightToggle } from "@/components/DayNightToggle";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

      {/* Main Content - Preloaded behind overlay */}
      <div className={`transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
      </div>

      {/* 3D World Section - Always rendered to preload */}
      <section id="world" className="h-screen w-full relative">
        <div className="absolute inset-0 z-20 flex items-start justify-between p-4 md:p-6 pointer-events-none">
          <div className="pointer-events-auto">
            <CityNavigation onStopClick={handleNodeClick} />
          </div>
          <div className="pointer-events-auto flex items-center gap-3 md:gap-4">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-black shadow-lg backdrop-blur transition hover:bg-white"
            >
              Resume
            </a>
            <DayNightToggle />
          </div>
        </div>
        <Scene onNodeClick={handleNodeClick} scrollProgress={scrollProgress} />
        {/* Compact floating label to avoid blocking interaction */}
        <div className="absolute left-4 bottom-4 z-10 pointer-events-none">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-lg backdrop-blur">
            <span>Ruchin Audichya</span>
            <span className="text-white/70">Cloud & Business</span>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="relative z-10 bg-background">
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

        <footer className="py-8 text-center text-sm text-muted-foreground border-t border-white/10">
          <p>© {new Date().getFullYear()} Ruchin Audichya. Engineered with precision.</p>
        </footer>
      </div>
    </main>
  );
}
