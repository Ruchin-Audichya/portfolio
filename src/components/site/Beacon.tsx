"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const ENDPOINT = "/api/t";

const rid = () => (crypto.randomUUID?.() ?? `${Date.now()}${Math.random()}`).replace(/[^a-z0-9]/gi, "").slice(0, 24);

function stored(storage: () => Storage, key: string): string {
  try {
    const s = storage();
    let v = s.getItem(key);
    if (!v) {
      v = rid();
      s.setItem(key, v);
    }
    return v;
  } catch {
    return rid();
  }
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "text/plain" }))) return;
  } catch {
    /* fall through */
  }
  fetch(ENDPOINT, { method: "POST", body, keepalive: true, headers: { "content-type": "text/plain" } }).catch(() => {});
}

/** What a click on a link means, for the "intent" stats: résumé, APK, email… */
function classify(a: HTMLAnchorElement): string | null {
  const href = a.getAttribute("href") ?? "";
  if (/resume\.pdf/i.test(href)) return "resume";
  if (/Anvil\.apk/i.test(href)) return "apk";
  if (href.startsWith("mailto:")) return "email";
  if (/linkedin\.com/i.test(href)) return "linkedin";
  if (/github\.com/i.test(href)) return "github";
  if (/^https?:\/\//i.test(href)) {
    try {
      const host = new URL(href).hostname.replace(/^www\./, "");
      if (!host.endsWith("ruchinaudichya.in")) return `out:${host}`;
    } catch {
      /* ignore */
    }
  }
  return null;
}

/**
 * First-party visit tracking for the owner's /admin dashboard: page views, how long each
 * page was read and how far it was scrolled, and clicks that signal intent. No cookies are
 * set; a random id lives in localStorage. Nothing runs on /admin.
 */
export function Beacon() {
  const pathname = usePathname();
  const page = useRef<{ path: string; start: number; scroll: number } | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const vid = stored(() => localStorage, "ra_vid");
    const sid = stored(() => sessionStorage, "ra_sid");
    const base = { vid, sid };

    const leave = () => {
      const p = page.current;
      if (!p) return;
      send({ ...base, kind: "leave", path: p.path, ms: Date.now() - p.start, scroll: p.scroll });
      page.current = null;
    };

    // A new page: close the previous one, then record this view.
    leave();
    const params = new URLSearchParams(location.search);
    page.current = { path: pathname, start: Date.now(), scroll: 0 };
    send({
      ...base,
      kind: "view",
      path: pathname,
      ref: document.referrer || null,
      utm_source: params.get("utm_source") ?? params.get("ref"),
      utm_campaign: params.get("utm_campaign"),
      lang: navigator.language,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}`,
    });

    const onScroll = () => {
      const p = page.current;
      if (!p) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      const pct = max <= 0 ? 100 : Math.round((scrollY / max) * 100);
      if (pct > p.scroll) p.scroll = Math.min(100, pct);
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") leave();
      else if (!page.current) page.current = { path: pathname, start: Date.now(), scroll: 0 };
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const name = a ? classify(a as HTMLAnchorElement) : null;
      if (name) send({ ...base, kind: "event", name, path: pathname });
    };
    const onSubmit = () => send({ ...base, kind: "event", name: "contact_form", path: pathname });

    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    addEventListener("pagehide", leave);
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("submit", onSubmit, { capture: true });
    return () => {
      removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onHide);
      removeEventListener("pagehide", leave);
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("submit", onSubmit, { capture: true });
    };
  }, [pathname]);

  return null;
}
