import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * The one admin account: a password kept in the ADMIN_PASSWORD environment variable
 * (set in Vercel, never in the repo). Logging in sets a signed, HttpOnly cookie; changing
 * the password signs everyone out.
 */
export const ADMIN_COOKIE = "ra_admin";
const SESSION_DAYS = 30;
const MIN_PASSWORD = 12;

const password = () => process.env.ADMIN_PASSWORD ?? "";

/** Admin stays locked until a long enough password is configured. */
export const adminConfigured = () => password().length >= MIN_PASSWORD;

const key = () => createHash("sha256").update(`ra-admin:${password()}:${process.env.ADMIN_SECRET ?? ""}`).digest();

const sign = (expires: number) => createHmac("sha256", key()).update(`admin:${expires}`).digest("hex");

const sameHash = (a: string, b: string) => {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
};

export function passwordMatches(attempt: string): boolean {
  return adminConfigured() && sameHash(attempt, password());
}

export function newSessionToken(): { value: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 24 * 3600;
  const expires = Date.now() + maxAge * 1000;
  return { value: `${expires}.${sign(expires)}`, maxAge };
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const [exp, mac] = token.split(".");
  const expires = Number(exp);
  if (!Number.isFinite(expires) || expires < Date.now() || !mac) return false;
  return sameHash(mac, sign(expires));
}

export function isAdmin(): boolean {
  return verifySessionToken(cookies().get(ADMIN_COOKIE)?.value);
}
