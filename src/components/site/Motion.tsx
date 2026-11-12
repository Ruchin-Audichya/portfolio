"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * The CSS in globals.css does the actual animation.
 */
export function Motion() {
  const pathname = usePathname();

  // For anyone who opens DevTools: that was me at eleven.
  useEffect(() => {
    console.log(
      "%cHello, fellow view-source person.%c\nNext.js, Tailwind and no animation library.\nSource: https://github.com/Ruchin-Audichya/portfolio",
      "font: italic 20px Georgia, serif; color: #C8205E",
      "font: 12px monospace; color: inherit",
    );
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])"));
    const show = (el: HTMLElement) => el.setAttribute("data-in", "");

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
