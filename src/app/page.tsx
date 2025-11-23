"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Scene from "@/components/3d/Scene";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/sections/Projects";
import { Achievements } from "@/components/sections/Achievements";
import { Github } from "@/components/sections/Github";
import { Guestbook } from "@/components/sections/Guestbook";
import { Contact } from "@/components/sections/Contact";
import { ScrollReveal } from "@/components/ScrollReveal";
import { IntroOverlay } from "@/components/IntroOverlay";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <main className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroOverlay key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <>
            <Navbar />

            {/* 3D World Section */}
            <section id="world" className="h-screen w-full relative">
              <Scene />
              <div className="absolute inset-0 pointer-events-none">
                <Hero />
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
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
