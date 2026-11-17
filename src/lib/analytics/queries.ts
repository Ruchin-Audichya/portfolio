import { ensureSchema, RETENTION_MONTHS, sql } from "./db";

type Row = Record<string, unknown>;
const n = (v: unknown) => Number(v ?? 0);
const s = (v: unknown) => (v == null ? null : String(v));
const d = (v: unknown) => (v == null ? null : new Date(v as string));

// ---- IP → organisation ------------------------------------------------------

/** Home broadband and mobile carriers: an IP here tells you the network, not the person's employer. */
const CONSUMER =
  /jio|reliance|airtel|bharti|vodafone|\bvi\b|idea cellular|bsnl|mtnl|act fibernet|atria|hathway|you broadband|tikona|excitel|spectra|alliance broadband|den networks|gtpl|sify|tata (play|sky|tele)|comcast|verizon|at&t|t-mobile|charter|spectrum|cox comm|frontier|centurylink|lumen|\bbt\b|virgin media|sky uk|vodafone|telstra|optus|rogers|bell canada|telus|orange|deutsche telekom|telefonica|movistar|claro|starlink|broadband|cable|wireless|mobile|cellular|internet service|telecom|telekom|isp\b/i;
/** Data centres and VPNs: usually a VPN, a proxy or a bot. */
const CLOUD =
  /amazon|aws|google llc|google cloud|microsoft|azure|digitalocean|linode|akamai|ovh|hetzner|vultr|oracle|alibaba|tencent|cloudflare|fastly|m247|datacamp|choopa|leaseweb|contabo|scaleway|ionos|hostinger|nordvpn|expressvpn|proton|mullvad|private internet access|packethub|cdn77/i;

export type OrgKind = "organisation" | "network" | "cloud";
export function orgKind(org: string | null, isp: string | null): OrgKind {
  const text = `${org ?? ""} ${isp ?? ""}`;
  if (CLOUD.test(text)) return "cloud";
  if (CONSUMER.test(text)) return "network";
  return "organisation";
}

const PRIVATE = /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|fc|fd|fe80)/i;

/**
 * Looks up the organisation behind IPs seen since the last look (ipwho.is, HTTPS, no key),
 * a few at a time, and caches the answer. Runs when the dashboard opens, never while a
 * visitor is waiting.
 */
async function enrichIps(limit = 30) {
  const q = sql();
  const rows = (await q`SELECT DISTINCT v.ip FROM visits v
    WHERE v.ip IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ip_info i WHERE i.ip = v.ip)
    LIMIT ${limit}`) as Row[];
  const ips = rows.map((r) => String(r.ip));
  for (let i = 0; i < ips.length; i += 6) {
    await Promise.all(
      ips.slice(i, i + 6).map(async (ip) => {
        let org: string | null = null, isp: string | null = null, domain: string | null = null, asn: number | null = null;
        if (!PRIVATE.test(ip)) {
          try {
            const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,connection`, {
              signal: AbortSignal.timeout(4000),
              cache: "no-store",
            });
            const j = (await res.json()) as { success?: boolean; connection?: { org?: string; isp?: string; domain?: string; asn?: number } };
            if (!j.success) return; // try again next time
            org = j.connection?.org || null;
            isp = j.connection?.isp || null;
            domain = j.connection?.domain || null;
            asn = j.connection?.asn ?? null;
          } catch {
            return;
          }
        }
        await q`INSERT INTO ip_info (ip, org, isp, domain, asn) VALUES (${ip}, ${org}, ${isp}, ${domain}, ${asn})
          ON CONFLICT (ip) DO NOTHING`;
      }),
    );
  }
}

// ---- Dashboard ----------------------------------------------------------------

export type Dashboard = Awaited<ReturnType<typeof loadDashboard>>;

export async function loadDashboard() {
  await ensureSchema();
  const q = sql();
  await q`DELETE FROM visits WHERE ts < now() - make_interval(months => ${RETENTION_MONTHS})`;
  await enrichIps().catch(() => {});

  const [totalsRows, daily, live, orgs, places, returning, intent, intentCounts, pages, sources, tech, sessions] = await Promise.all([
    q`SELECT
        count(DISTINCT visitor) FILTER (WHERE kind = 'view') AS visitors,
        count(*) FILTER (WHERE kind = 'view') AS views,
        count(DISTINCT visitor) FILTER (WHERE kind = 'view'
          AND (ts AT TIME ZONE 'Asia/Kolkata')::date = (now() AT TIME ZONE 'Asia/Kolkata')::date) AS today,
        count(DISTINCT visitor) FILTER (WHERE kind = 'view' AND ts > now() - interval '7 days') AS week,
        count(DISTINCT session) AS sessions,
        avg(duration_ms) FILTER (WHERE kind = 'leave' AND duration_ms BETWEEN 1000 AND 3600000) AS avg_ms,
        min(ts) AS since
      FROM visits`,
    q`SELECT to_char(g.day, 'YYYY-MM-DD') AS day, count(DISTINCT v.visitor) AS visitors
      FROM generate_series((now() AT TIME ZONE 'Asia/Kolkata')::date - 29, (now() AT TIME ZONE 'Asia/Kolkata')::date, interval '1 day') AS g(day)
      LEFT JOIN visits v ON v.kind = 'view' AND (v.ts AT TIME ZONE 'Asia/Kolkata')::date = g.day::date
      GROUP BY g.day ORDER BY g.day`,
    q`SELECT DISTINCT ON (v.session) v.session, v.visitor, v.path, v.city, v.country, v.ip, v.device, v.ts, i.org, i.isp
      FROM visits v LEFT JOIN ip_info i ON i.ip = v.ip
      WHERE v.ts > now() - interval '5 minutes'
      ORDER BY v.session, v.ts DESC`,
    q`SELECT i.org, i.isp, i.domain,
        count(*) FILTER (WHERE v.kind = 'view') AS views,
        count(DISTINCT v.visitor) AS visitors,
        max(v.ts) AS last_seen,
        string_agg(DISTINCT v.city, ', ') AS cities,
        array_agg(DISTINCT v.path) FILTER (WHERE v.kind = 'view') AS paths,
        (array_agg(v.visitor ORDER BY v.ts DESC))[1] AS last_visitor
      FROM visits v JOIN ip_info i ON i.ip = v.ip
      WHERE i.org IS NOT NULL
      GROUP BY i.org, i.isp, i.domain
      ORDER BY max(v.ts) DESC
      LIMIT 60`,
    q`SELECT city, max(region) AS region, country, count(DISTINCT visitor) AS visitors, count(*) AS views
      FROM visits WHERE kind = 'view' AND country IS NOT NULL
      GROUP BY city, country ORDER BY visitors DESC, views DESC LIMIT 12`,
    q`SELECT v.visitor,
        count(DISTINCT (v.ts AT TIME ZONE 'Asia/Kolkata')::date) AS days,
        count(*) FILTER (WHERE v.kind = 'view') AS views,
        min(v.ts) AS first_seen, max(v.ts) AS last_seen,
        (array_agg(v.city ORDER BY v.ts DESC))[1] AS city,
        (array_agg(v.country ORDER BY v.ts DESC))[1] AS country,
        (array_agg(v.ip ORDER BY v.ts DESC))[1] AS ip,
        (array_agg(v.device ORDER BY v.ts DESC))[1] AS device
      FROM visits v GROUP BY v.visitor
      HAVING count(DISTINCT (v.ts AT TIME ZONE 'Asia/Kolkata')::date) >= 2
      ORDER BY max(v.ts) DESC LIMIT 15`,
    q`SELECT v.ts, v.name, v.path, v.visitor, v.ip, v.city, v.country, v.device, i.org, i.isp
      FROM visits v LEFT JOIN ip_info i ON i.ip = v.ip
      WHERE v.kind = 'event' AND v.name NOT LIKE 'out:%'
      ORDER BY v.ts DESC LIMIT 25`,
    q`SELECT name, count(*) AS clicks, count(DISTINCT visitor) AS visitors
      FROM visits WHERE kind = 'event' AND name NOT LIKE 'out:%' GROUP BY name ORDER BY clicks DESC`,
    q`SELECT path,
        count(*) FILTER (WHERE kind = 'view') AS views,
        count(DISTINCT visitor) FILTER (WHERE kind = 'view') AS visitors,
        avg(duration_ms) FILTER (WHERE kind = 'leave' AND duration_ms BETWEEN 1000 AND 3600000) AS avg_ms,
        avg(scroll_pct) FILTER (WHERE kind = 'leave') AS avg_scroll
      FROM visits GROUP BY path HAVING count(*) FILTER (WHERE kind = 'view') > 0
      ORDER BY views DESC LIMIT 12`,
    q`SELECT CASE
          WHEN referrer IS NULL THEN coalesce(utm_source, 'Direct / typed')
          ELSE coalesce(substring(referrer from '^https?://(?:www\\.)?([^/:]+)'), referrer)
        END AS source,
        count(DISTINCT visitor) AS visitors
      FROM visits WHERE kind = 'view'
      GROUP BY 1 ORDER BY visitors DESC LIMIT 10`,
    q`SELECT device, os, browser, count(DISTINCT visitor) AS visitors
      FROM visits WHERE kind = 'view' GROUP BY device, os, browser ORDER BY visitors DESC LIMIT 10`,
    q`SELECT v.session, v.visitor, min(v.ts) AS started, max(v.ts) AS ended,
        (array_agg(v.ip ORDER BY v.ts) FILTER (WHERE v.ip IS NOT NULL))[1] AS ip,
        (array_agg(v.city ORDER BY v.ts))[1] AS city,
        (array_agg(v.country ORDER BY v.ts))[1] AS country,
        (array_agg(v.device ORDER BY v.ts))[1] AS device,
        (array_agg(v.browser ORDER BY v.ts))[1] AS browser,
        (array_agg(v.os ORDER BY v.ts))[1] AS os,
        (array_agg(v.referrer ORDER BY v.ts) FILTER (WHERE v.referrer IS NOT NULL))[1] AS referrer,
        array_agg(v.path ORDER BY v.ts) FILTER (WHERE v.kind = 'view') AS paths,
        sum(v.duration_ms) FILTER (WHERE v.kind = 'leave') AS read_ms,
        array_agg(DISTINCT v.name) FILTER (WHERE v.kind = 'event') AS events
      FROM visits v GROUP BY v.session, v.visitor
      ORDER BY min(v.ts) DESC LIMIT 40`,
  ]);

  // Organisation per IP for the tables that don't join it in SQL.
  const ipsNeeded = new Set<string>();
  for (const r of [...(returning as Row[]), ...(sessions as Row[])]) if (r.ip) ipsNeeded.add(String(r.ip));
  const orgByIp = new Map<string, { org: string | null; isp: string | null }>();
  if (ipsNeeded.size > 0) {
    const info = (await q`SELECT ip, org, isp FROM ip_info WHERE ip = ANY(${Array.from(ipsNeeded)})`) as Row[];
    for (const r of info) orgByIp.set(String(r.ip), { org: s(r.org), isp: s(r.isp) });
  }
  const orgOf = (ip: unknown) => (ip ? orgByIp.get(String(ip)) ?? null : null);

  const t = (totalsRows as Row[])[0] ?? {};
  const orgRows = (orgs as Row[]).map((r) => ({
    org: String(r.org),
    domain: s(r.domain),
    kind: orgKind(s(r.org), s(r.isp)),
    views: n(r.views),
    visitors: n(r.visitors),
    lastSeen: d(r.last_seen)!,
    cities: s(r.cities),
    paths: (r.paths as string[] | null) ?? [],
    lastVisitor: s(r.last_visitor),
  }));

  return {
    totals: {
      visitors: n(t.visitors),
      views: n(t.views),
      today: n(t.today),
      week: n(t.week),
      sessions: n(t.sessions),
      avgMs: t.avg_ms == null ? null : n(t.avg_ms),
      since: d(t.since),
    },
    daily: (daily as Row[]).map((r) => ({ day: String(r.day).slice(0, 10), visitors: n(r.visitors) })),
    live: (live as Row[]).map((r) => ({
      session: String(r.session),
      visitor: String(r.visitor),
      path: String(r.path),
      city: s(r.city),
      country: s(r.country),
      ip: s(r.ip),
      device: s(r.device),
      ts: d(r.ts)!,
      org: s(r.org),
      orgKind: r.org ? orgKind(s(r.org), s(r.isp)) : null,
    })),
    companies: orgRows.filter((o) => o.kind === "organisation").slice(0, 20),
    networks: orgRows.filter((o) => o.kind !== "organisation").slice(0, 12),
    places: (places as Row[]).map((r) => ({ city: s(r.city), region: s(r.region), country: s(r.country), visitors: n(r.visitors), views: n(r.views) })),
    returning: (returning as Row[]).map((r) => ({
      visitor: String(r.visitor),
      days: n(r.days),
      views: n(r.views),
      firstSeen: d(r.first_seen)!,
      lastSeen: d(r.last_seen)!,
      city: s(r.city),
      country: s(r.country),
      ip: s(r.ip),
      device: s(r.device),
      org: orgOf(r.ip)?.org ?? null,
    })),
    intent: (intent as Row[]).map((r) => ({
      ts: d(r.ts)!,
      name: String(r.name),
      path: String(r.path),
      visitor: String(r.visitor),
      ip: s(r.ip),
      city: s(r.city),
      country: s(r.country),
      device: s(r.device),
      org: s(r.org),
      orgKind: r.org ? orgKind(s(r.org), s(r.isp)) : null,
    })),
    intentCounts: (intentCounts as Row[]).map((r) => ({ name: String(r.name), clicks: n(r.clicks), visitors: n(r.visitors) })),
    pages: (pages as Row[]).map((r) => ({
      path: String(r.path),
      views: n(r.views),
      visitors: n(r.visitors),
      avgMs: r.avg_ms == null ? null : n(r.avg_ms),
      avgScroll: r.avg_scroll == null ? null : n(r.avg_scroll),
    })),
    sources: (sources as Row[]).map((r) => ({ source: String(r.source), visitors: n(r.visitors) })),
    tech: (tech as Row[]).map((r) => ({ device: s(r.device), os: s(r.os), browser: s(r.browser), visitors: n(r.visitors) })),
    sessions: (sessions as Row[]).map((r) => ({
      session: String(r.session),
      visitor: String(r.visitor),
      started: d(r.started)!,
      ended: d(r.ended)!,
      ip: s(r.ip),
      city: s(r.city),
      country: s(r.country),
      device: s(r.device),
      browser: s(r.browser),
      os: s(r.os),
      referrer: s(r.referrer),
      paths: (r.paths as string[] | null) ?? [],
      readMs: r.read_ms == null ? null : n(r.read_ms),
      events: ((r.events as string[] | null) ?? []).filter(Boolean),
      org: orgOf(r.ip)?.org ?? null,
    })),
  };
}

/** Everything one visitor did, oldest first. */
export async function loadVisitor(visitor: string) {
  await ensureSchema();
  const rows = (await sql()`SELECT v.ts, v.kind, v.name, v.path, v.session, v.ip, v.city, v.region, v.country,
      v.referrer, v.browser, v.os, v.device, v.lang, v.tz, v.screen, v.duration_ms, v.scroll_pct, i.org, i.isp, i.domain
    FROM visits v LEFT JOIN ip_info i ON i.ip = v.ip
    WHERE v.visitor = ${visitor}
    ORDER BY v.ts ASC LIMIT 500`) as Row[];
  return rows.map((r) => ({
    ts: d(r.ts)!,
    kind: String(r.kind),
    name: s(r.name),
    path: String(r.path),
    session: String(r.session),
    ip: s(r.ip),
    city: s(r.city),
    region: s(r.region),
    country: s(r.country),
    referrer: s(r.referrer),
    browser: s(r.browser),
    os: s(r.os),
    device: s(r.device),
    lang: s(r.lang),
    tz: s(r.tz),
    screen: s(r.screen),
    ms: r.duration_ms == null ? null : n(r.duration_ms),
    scroll: r.scroll_pct == null ? null : n(r.scroll_pct),
    org: s(r.org),
    isp: s(r.isp),
    domain: s(r.domain),
  }));
}
