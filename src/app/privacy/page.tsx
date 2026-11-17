import type { Metadata } from "next";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site records about visits, why, and how long it keeps it.",
  alternates: { canonical: "/privacy" },
};

const items: [string, string][] = [
  ["Pages and reading", "Which pages you open, how long each stays open, how far you scroll, and whether you click the résumé, the Anvil download, email, LinkedIn or GitHub, or send the contact form."],
  ["Network and rough location", "Your IP address, the city/region/country it maps to, and the organisation or internet provider that owns it (looked up with ipwho.is)."],
  ["Device", "Browser, operating system, screen size, language and time zone."],
  ["A random visitor id", "Kept in your browser's local storage so a return visit is recognised. It's random, not linked to your name, and no cookies are set for this."],
];

export default function PrivacyPage() {
  return (
    <article className="shell max-w-3xl pb-16 pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
      <p className="label">Privacy</p>
      <h1 className="display mt-5 text-[clamp(2.75rem,8vw,5rem)]">What this site records</h1>
      <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink2">
        This is a personal portfolio. To see who reads it, it keeps a simple first-party record of visits. Nothing is sold, shared or used for
        advertising, and only {site.name} can see it.
      </p>
      <dl className="mt-10 grid gap-6 border-t border-line pt-8">
        {items.map(([k, v]) => (
          <div key={k} className="grid gap-2 sm:grid-cols-[14rem_1fr] sm:gap-8">
            <dt className="label pt-1">{k}</dt>
            <dd className="text-[0.9375rem] leading-relaxed text-ink2">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10 grid gap-4 border-t border-line pt-8 text-[0.9375rem] leading-relaxed text-ink2">
        <p>
          <strong className="font-medium text-ink">How long:</strong> visit records are deleted after 13 months.
        </p>
        <p>
          <strong className="font-medium text-ink">Opting out:</strong> if your browser sends Global Privacy Control, the visit is counted
          without your IP address or a returning-visitor id. Vercel Web Analytics, which this site also uses, is cookieless and doesn&apos;t
          store IP addresses.
        </p>
        <p>
          <strong className="font-medium text-ink">Your data:</strong> to see or delete what was recorded about your visits, email{" "}
          <span className="select-all font-mono text-ink">{site.email}</span>.
        </p>
      </div>
    </article>
  );
}
