"use client";

import { useEffect, useRef } from "react";
import type { ProjectNodeId } from "./World/ProjectNode";
import { X, ExternalLink, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverlayProps {
  activeId: ProjectNodeId | null;
  onClose: () => void;
}

const content: Record<ProjectNodeId, { title: string; body: string; href?: string; cta?: string }> = {
  journey: {
    title: "My Journey",
    body: "From early experiments with web interfaces to crafting thoughtful user journeys, this island represents my path into product and front-end engineering. I specialize in building scalable applications using Next.js and AWS.",
    cta: "Read more about me",
    href: "#about",
  },
  skills: {
    title: "Skills & Tech Stack",
    body: "My toolkit includes TypeScript, React, Next.js, Tailwind CSS for frontend, and AWS/Salesforce for backend and cloud infrastructure. I'm passionate about clean code and performance optimization.",
    cta: "View full skills",
    href: "#skills",
  },
  projects: {
    title: "Featured Projects",
    body: "I've worked on various projects ranging from e-commerce platforms to AI-powered applications. Check out my portfolio to see how I solve real-world problems with code.",
    cta: "View projects",
    href: "#projects",
  },
  testimonials: {
    title: "Community & Testimonials",
    body: "I believe in community building and knowledge sharing. Here's what people say about working with me.",
    cta: "Read testimonials",
    href: "#testimonials",
  },
};

export function Overlay({ activeId, onClose }: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeId) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      // Focus Trap
      if (event.key === "Tab" && overlayRef.current) {
        const focusableElements = overlayRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Focus the first element when opened
    if (overlayRef.current) {
      const focusableElements = overlayRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) firstElement.focus();
    }

    window.addEventListener("keydown", handleKey);
    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "unset";
    };
  }, [activeId, onClose]);

  if (!activeId) return null;

  const { title, body, href } = content[activeId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="overlay-title">
      <div ref={overlayRef} className="relative w-full max-w-md glass-panel rounded-3xl p-8 text-foreground shadow-2xl animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Close overlay"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
              Ruchin&apos;s world
            </p>
            <h3 id="overlay-title" className="text-2xl font-bold tracking-tight">{title}</h3>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground">{body}</p>

          <div className="pt-6 flex flex-wrap items-center gap-3">
            {href && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full hover-bounce"
              >
                {content[activeId].cta || "View details"}
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="rounded-full gap-2 hover-bounce bg-[#FFDD00] text-black border-none hover:bg-[#FFDD00]/90"
            >
              <a
                href="https://www.buymeacoffee.com/ruchinaudichya"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Coffee className="h-4 w-4" /> Buy me a coffee
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CanvasOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white mix-blend-difference">
      <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg md:text-6xl">
        EXPLORE MY WORLD
      </h1>
      <p className="mt-4 text-sm font-mono opacity-80 drop-shadow-md md:text-base">
        Drag to rotate • Scroll to explore
      </p>
      <div className="absolute bottom-8 animate-bounce">
        <p className="text-xs font-mono uppercase tracking-[0.25em]">Start Journey</p>
      </div>
    </div>
  );
}
