"use client";

import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex h-screen w-full flex-col items-start justify-center overflow-hidden px-4 pt-20 md:px-10 lg:px-20">
      {/* Decorative Background Blob for Light Mode */}
      <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-purple-200/50 blur-[100px] dark:bg-purple-900/20" />
      <div className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-blue-200/50 blur-[80px] dark:bg-blue-900/20" />

      <div className="z-10 flex max-w-4xl flex-col gap-6">
        <h1 className="animate-fade-in text-4xl font-bold leading-tight tracking-tighter text-neutral-900 dark:text-neutral-100 sm:text-5xl md:text-7xl lg:text-8xl">
          Ruchin Audichya
          <span className="block bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Builds systems, stories, and cities in code
          </span>
        </h1>
        <p className="animate-fade-in-up max-w-2xl text-base text-neutral-700 dark:text-neutral-300 delay-100 sm:text-lg md:text-xl font-medium">
          From dorm dropshipping to cloud-native worlds. Calm, cinematic, intentional.
        </p>

        <div className="animate-fade-in-up delay-200">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25 touch-manipulation relative z-50 min-h-[44px] min-w-[44px] pointer-events-auto"
          >
            Explore my world
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-neutral-600 dark:text-neutral-400">
        <ArrowDown className="h-6 w-6" />
      </div>
    </section>
  );
}
