"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminConfigured, newSessionToken, passwordMatches } from "@/lib/admin-auth";

// Failed attempts per IP, per server instance: slows down guessing without a database.
const failures = new Map<string, { count: number; until: number }>();

export type LoginState = { error: string | null };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "Admin isn't set up yet: add ADMIN_PASSWORD in Vercel." };
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const f = failures.get(ip);
  if (f && f.until > Date.now()) return { error: "Too many wrong passwords. Wait a few minutes and try again." };

  const attempt = String(form.get("password") ?? "");
  if (!passwordMatches(attempt)) {
    const count = (f?.count ?? 0) + 1;
    failures.set(ip, { count, until: count >= 5 ? Date.now() + 10 * 60_000 : 0 });
    await new Promise((r) => setTimeout(r, 1200));
    return { error: "That password isn't right." };
  }
  failures.delete(ip);

  const { value, maxAge } = newSessionToken();
  cookies().set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
  redirect("/admin");
}

export async function logout() {
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin");
}
