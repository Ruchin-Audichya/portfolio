"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { initHome } from "./initHome";

const SUN =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';

/** Wires up the server-rendered homepage: canvas scenes, copy button and the theme toggle. */
export function HomeEffects() {
  const { resolvedTheme, setTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ra");
    if (!root) return;
    return initHome(root);
  }, []);

  useEffect(() => {
    const btn = document.getElementById("theme");
    if (!btn) return;
    const onClick = () => setTheme(themeRef.current === "light" ? "dark" : "light");
    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  }, [setTheme]);

  useEffect(() => {
    const btn = document.getElementById("theme");
    if (!btn || !resolvedTheme) return;
    const dark = resolvedTheme !== "light";
    btn.innerHTML = dark ? SUN : MOON;
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }, [resolvedTheme]);

  return null;
}
