"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/content";
import { ArrowUpRight } from "./Icons";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  // Solid background once the page moves; tuck away on the way down, return on the way up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > 480 && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page and listen for Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out ${
          hidden && !open ? "-translate-y-full" : ""
        } ${scrolled && !open ? "border-b border-line bg-paper/85 backdrop-blur-md" : "border-b border-transparent"}`}
      >
        <div className="progress absolute inset-x-0 top-0 h-px bg-accent" aria-hidden="true" />
        <div className="shell flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" aria-label="Ruchin Audichya, home" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Logo className="h-[1.15rem] w-auto" />
            <span className="hidden text-sm font-medium tracking-tight sm:inline">Ruchin Audichya</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="link-quiet text-sm text-ink2 hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={site.resume} target="_blank" rel="noopener" className="btn btn-ghost hidden h-9 px-4 text-[0.8125rem] sm:inline-flex">
              Résumé <ArrowUpRight />
            </a>
            <ThemeToggle />
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full border border-line md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-4" aria-hidden="true">
                <span className={`absolute left-0 top-0 h-px w-4 bg-ink transition-transform duration-300 ${open ? "translate-y-[5.5px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-4 bg-ink transition-transform duration-300 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-paper transition-[opacity,visibility] duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="shell flex h-full flex-col justify-between pb-10 pt-[calc(var(--header-h)+2rem)]">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display flex items-baseline justify-between py-4 text-[2.5rem]"
                  tabIndex={open ? 0 : -1}
                >
                  {item.label}
                  <span className="label">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4">
            <a href={`mailto:${site.email}`} className="text-base" tabIndex={open ? 0 : -1}>
              {site.email}
            </a>
            <a href={site.resume} target="_blank" rel="noopener" className="btn btn-solid self-start" tabIndex={open ? 0 : -1}>
              Résumé <ArrowUpRight />
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
