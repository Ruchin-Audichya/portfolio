"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LazySection } from "@/components/LazySection";

const BlackHoleScene = dynamic(() => import("@/components/BlackHoleScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
});
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";

const KineticAbout = dynamic(() =>
  import("@/components/sections/KineticAbout").then((mod) => mod.KineticAbout)
);
const Skills = dynamic(() =>
  import("@/components/sections/Skills").then((mod) => mod.Skills)
);
const RecruiterSnapshot = dynamic(() =>
  import("@/components/sections/RecruiterSnapshot").then((mod) => mod.RecruiterSnapshot)
);
const Experience = dynamic(() =>
  import("@/components/sections/Experience").then((mod) => mod.Experience)
);
const KineticProjects = dynamic(() =>
  import("@/components/sections/KineticProjects").then((mod) => mod.KineticProjects)
);
const KineticAchievements = dynamic(() =>
  import("@/components/sections/KineticAchievements").then((mod) => mod.KineticAchievements)
);
const Github = dynamic(() =>
  import("@/components/sections/Github").then((mod) => mod.Github)
);
const Guestbook = dynamic(() =>
  import("@/components/sections/Guestbook").then((mod) => mod.Guestbook)
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((mod) => mod.Contact)
);

export default function Home() {
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

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section id="world" className="h-screen w-full relative">
        <BlackHoleScene scrollProgress={scrollProgress} />
      </section>

      {/* Smooth transition from black hole to portfolio */}
      <div className="h-24 bg-gradient-to-b from-black via-[#0a0a0f] to-[#0a0a0f]" />

      {/* Kinetic Sections - Below Black Hole */}
      <div className="relative z-10 bg-[#0a0a0f] text-white dark">
        {/* Origin / About - Floating fragments, staggered reveals */}
        <LazySection>
          <KineticAbout />
        </LazySection>

        <LazySection>
          <RecruiterSnapshot />
        </LazySection>

        <LazySection>
          <Experience />
        </LazySection>

        <LazySection>
          <Skills />
        </LazySection>

        {/* Featured Projects - Kinetic typography, scroll-linked motion */}
        <LazySection>
          <KineticProjects />
        </LazySection>

        {/* Achievements - Milestones with authority, gentle glow */}
        <LazySection>
          <KineticAchievements />
        </LazySection>

        <LazySection>
          <ScrollReveal width="100%">
            <Github />
          </ScrollReveal>
        </LazySection>

        <LazySection>
          <ScrollReveal width="100%">
            <Guestbook />
          </ScrollReveal>
        </LazySection>

        <LazySection>
          <ScrollReveal width="100%">
            <Contact />
          </ScrollReveal>
        </LazySection>

        <footer className="py-8 text-center text-sm text-white/50 border-t border-white/10">
          <p>© {new Date().getFullYear()} Ruchin Audichya. Engineered with precision.</p>
        </footer>
      </div>
    </main>
  );
}
