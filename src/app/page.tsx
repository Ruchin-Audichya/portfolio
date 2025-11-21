"use client";

import { useCallback, useState } from "react";

import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Github } from "@/components/sections/Github";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import dynamic from "next/dynamic";
import { Overlay } from "@/components/Overlay";
import type { ProjectNodeId } from "@/components/World/ProjectNode";
import { ThemeToggle } from "@/components/theme-toggle";

const Scene = dynamic(() => import("@/components/World/Scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
    </div>
  ),
});

export default function Home() {
  const [activeNode, setActiveNode] = useState<ProjectNodeId | null>(null);

  const handleNodeClick = useCallback((id: ProjectNodeId) => {
    setActiveNode(id);
    // Optional: scroll related section into view to keep portfolio storytelling connected.
    const sectionIdMap: Record<ProjectNodeId, string> = {
      journey: "about",
      skills: "skills",
      projects: "projects",
      testimonials: "testimonials",
    };
    const sectionId = sectionIdMap[id];
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  const handleCloseOverlay = useCallback(() => setActiveNode(null), []);

  return (
    <>
      <ThemeToggle />
      <Hero />
      {/* 3D world inserted just after hero to act as the bridge into the rest of the story */}
      <Scene onNodeClick={handleNodeClick} />
      <About />
      <Skills />
      <Projects />
      <Github />
      <Gallery />
      <Testimonials />
      <Contact />
      <Overlay activeId={activeNode} onClose={handleCloseOverlay} />
    </>
  );
}
