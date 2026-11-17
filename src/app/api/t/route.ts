import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { analyticsConfigured, ensureSchema, sql } from "@/lib/analytics/db";
import { isBot, parseUa } from "@/lib/analytics/ua";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = new Set(["view", "leave", "event"]);
const ID = /^[a-z0-9]{8,40}$/i;

const clip = (v: unknown, n: number) => (typeof v === "string" && v.length > 0 ? v.slice(0, n) : null);
const num = (v: unknown, min: number, max: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.round(Math.min(max, Math.max(min, v))) : null;
const header = (req: NextRequest, name: string) => {
  const v = req.headers.get(name);
  if (!v) return null;
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
};

/**
 * Receives page views, read-time pings and click events from the site's beacon. Always
 * answers 204 so the visitor's page never waits on analytics or sees an error.
 */
export async function POST(req: NextRequest) {
  const done = new NextResponse(null, { status: 204 });
  try {
    if (!analyticsConfigured) return done;
    const ua = req.headers.get("user-agent");
    if (isBot(ua)) return done;
    // Your own visits while signed in to /admin don't count.
    if (verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return done;

    const text = await req.text();
    if (text.length > 4096) return done;
    const b = JSON.parse(text) as Record<string, unknown>;

    const kind = typeof b.kind === "string" && KINDS.has(b.kind) ? b.kind : null;
    const path = clip(b.path, 300);
    const visitor = typeof b.vid === "string" && ID.test(b.vid) ? b.vid : null;
    const session = typeof b.sid === "string" && ID.test(b.sid) ? b.sid : null;
    if (!kind || !path?.startsWith("/") || !visitor || !session || path.startsWith("/admin")) return done;

    // Global Privacy Control: count the visit, but keep no IP address and no cross-visit id.
    const gpc = req.headers.get("sec-gpc") === "1";
    const ip = gpc ? null : (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null);
    const { browser, os, device } = parseUa(ua ?? "");

    // Referrers from this site itself are internal navigation, not a source.
    let referrer = clip(b.ref, 400);
    if (referrer && /^https?:\/\/(www\.)?ruchinaudichya\.in/i.test(referrer)) referrer = null;

    await ensureSchema();
    await sql()`INSERT INTO visits
      (kind, name, path, visitor, session, ip, country, region, city, lat, lon, referrer, utm_source, utm_campaign,
       browser, os, device, lang, tz, screen, duration_ms, scroll_pct)
      VALUES (
        ${kind}, ${clip(b.name, 80)}, ${path}, ${gpc ? session : visitor}, ${session}, ${ip},
        ${header(req, "x-vercel-ip-country")}, ${header(req, "x-vercel-ip-country-region")}, ${header(req, "x-vercel-ip-city")},
        ${Number(req.headers.get("x-vercel-ip-latitude")) || null}, ${Number(req.headers.get("x-vercel-ip-longitude")) || null},
        ${referrer}, ${clip(b.utm_source, 80)}, ${clip(b.utm_campaign, 120)},
        ${browser}, ${os}, ${device}, ${clip(b.lang, 20)}, ${clip(b.tz, 60)}, ${clip(b.screen, 20)},
        ${num(b.ms, 0, 6 * 3600 * 1000)}, ${num(b.scroll, 0, 100)}
      )`;
  } catch {
    // Analytics must never break the site.
  }
  return done;
}
