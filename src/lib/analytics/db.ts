import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Visitor analytics storage: a Postgres database (Neon, connected through Vercel's
 * Storage tab, which injects DATABASE_URL). Without it, tracking quietly does nothing
 * and /admin explains how to connect one.
 */
const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

export const analyticsConfigured = Boolean(url);

let client: NeonQueryFunction<false, false> | null = null;
let schemaReady: Promise<void> | null = null;

export function sql() {
  if (!url) throw new Error("DATABASE_URL is not set");
  client ??= neon(url);
  return client;
}

/** Creates the tables on first use, so there is no migration step to remember. */
export function ensureSchema(): Promise<void> {
  schemaReady ??= (async () => {
    const q = sql();
    await q`CREATE TABLE IF NOT EXISTS visits (
      id          BIGSERIAL PRIMARY KEY,
      ts          TIMESTAMPTZ NOT NULL DEFAULT now(),
      kind        TEXT NOT NULL,
      name        TEXT,
      path        TEXT NOT NULL,
      visitor     TEXT NOT NULL,
      session     TEXT NOT NULL,
      ip          TEXT,
      country     TEXT,
      region      TEXT,
      city        TEXT,
      lat         REAL,
      lon         REAL,
      referrer    TEXT,
      utm_source  TEXT,
      utm_campaign TEXT,
      browser     TEXT,
      os          TEXT,
      device      TEXT,
      lang        TEXT,
      tz          TEXT,
      screen      TEXT,
      duration_ms INTEGER,
      scroll_pct  SMALLINT
    )`;
    await q`CREATE INDEX IF NOT EXISTS visits_ts ON visits (ts DESC)`;
    await q`CREATE INDEX IF NOT EXISTS visits_visitor ON visits (visitor)`;
    await q`CREATE INDEX IF NOT EXISTS visits_session ON visits (session)`;
    await q`CREATE TABLE IF NOT EXISTS ip_info (
      ip        TEXT PRIMARY KEY,
      org       TEXT,
      isp       TEXT,
      domain    TEXT,
      asn       INTEGER,
      looked_up TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  })().catch((e) => {
    schemaReady = null; // retry on the next request
    throw e;
  });
  return schemaReady;
}

/** How long raw visits (including IP addresses) are kept. Matches the privacy note. */
export const RETENTION_MONTHS = 13;
