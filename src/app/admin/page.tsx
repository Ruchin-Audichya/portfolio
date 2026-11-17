import type { Metadata } from "next";
import { DashboardView } from "@/components/admin/DashboardView";
import { VisitorView } from "@/components/admin/VisitorView";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { analyticsConfigured } from "@/lib/analytics/db";
import { loadDashboard, loadVisitor } from "@/lib/analytics/queries";
import { logout } from "./actions";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Not linked anywhere, not in the sitemap, disallowed in robots.txt, and never indexed.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

function Setup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="panel mx-auto mt-10 grid max-w-xl gap-4 p-6 text-[0.9375rem] leading-relaxed text-ink2 sm:p-8">
      <p className="label">Owner setup</p>
      <h1 className="display text-4xl text-ink">{title}</h1>
      {children}
    </div>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: { v?: string } }) {
  const shell = (children: React.ReactNode) => (
    <div className="shell pb-16 pt-[calc(var(--header-h)+2rem)]">{children}</div>
  );

  if (!adminConfigured()) {
    return shell(
      <Setup title="Admin is locked">
        <p>
          Add an environment variable named <code className="font-mono text-ink">ADMIN_PASSWORD</code> (at least 12 characters) to this project in
          Vercel, then redeploy. That password is the only way into this page.
        </p>
      </Setup>,
    );
  }
  if (!isAdmin()) return shell(<LoginForm />);

  if (!analyticsConfigured) {
    return shell(
      <Setup title="Connect a database">
        <p>
          You&apos;re signed in, but there&apos;s nowhere to store visits yet. In Vercel, open this project → <strong>Storage</strong> →{" "}
          <strong>Create Database</strong> → <strong>Neon (Serverless Postgres)</strong>, connect it to this project, then redeploy. Visits are
          recorded from then on.
        </p>
        <form action={logout}>
          <button type="submit" className="btn btn-ghost h-10">
            Sign out
          </button>
        </form>
      </Setup>,
    );
  }

  const visitor = searchParams.v && /^[a-z0-9]{8,40}$/i.test(searchParams.v) ? searchParams.v : null;

  return shell(
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">Owner only · not indexed</p>
          <h1 className="display mt-3 text-[clamp(2.5rem,7vw,4.5rem)]">Visitors</h1>
          <p className="mt-2 text-sm text-ink3">Times are IST. Your own visits aren&apos;t counted while you&apos;re signed in on a device.</p>
        </div>
        <form action={logout}>
          <button type="submit" className="btn btn-ghost h-10">
            Sign out
          </button>
        </form>
      </header>
      {visitor ? <VisitorView id={visitor} events={await loadVisitor(visitor)} /> : <DashboardView data={await loadDashboard()} />}
    </>,
  );
}
