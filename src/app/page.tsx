"use client";

import dynamic from "next/dynamic";
import { LazySection } from "@/components/LazySection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const BlackHoleScene = dynamic(() => import("@/components/BlackHoleScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
});

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
const Recognition = dynamic(() =>
  import("@/components/sections/Recognition").then((mod) => mod.Recognition)
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
  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section id="world" className="h-screen w-full relative">
        <BlackHoleScene />
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

        {/* Recognition - hackathon wins, finalist standings */}
        <LazySection>
          <Recognition />
        </LazySection>

        {/* Achievements - Certifications */}
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

        <Footer />
      </div>
    </main>
  );
}
