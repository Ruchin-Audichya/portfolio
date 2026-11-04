"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { initHome } from "./initHome";

/** Wires up the server-rendered homepage: wordmark, clock, pharmacy map, copy button and the theme toggle. */
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
    btn.textContent = dark ? "Light" : "Dark";
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }, [resolvedTheme]);

  return null;
}
