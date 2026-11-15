import type { Metadata } from "next";
import Link from "next/link";
import { AnvilMark } from "@/components/anvil/AnvilMark";
import { ReleaseInfo } from "@/components/anvil/ReleaseInfo";
import { ArrowDown, ArrowUpRight, Check } from "@/components/site/Icons";
import { ANVIL } from "@/lib/anvil";
import { SITE_URL, breadcrumbSchema, jsonLd } from "@/lib/seo";

const TAGLINE = "Forge a bootable Windows or Linux USB from your Android phone. No PC, no root.";
const DESCRIPTION =
  "Download Anvil, the free Android app that writes bootable Windows 11/10 and Linux (Ubuntu, Mint, Fedora, Debian) USB drives from your phone. Official ISOs, signature-checked. No PC, no root.";

export const metadata: Metadata = {
  title: "Download Anvil: bootable USB from your phone",
  description: DESCRIPTION,
  alternates: { canonical: "/anvil" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/anvil`,
    title: "Anvil: bootable Windows & Linux USB from your Android phone",
    description: TAGLINE,
  },
  twitter: { card: "summary_large_image", title: "Anvil for Android", description: TAGLINE },
};

const features = [
  {
    title: "Windows 11 and 10",
    body: "The official ISO straight from Microsoft, checked against Microsoft's SHA-256. The 7 GB install.wim is split on the fly so it boots from FAT32 with Secure Boot on.",
  },
  {
    title: "Linux, verified",
    body: "Ubuntu, Linux Mint, Fedora and Debian from their official mirrors. Anvil checks the distro's GPG signature and the ISO's SHA-256 before it writes anything.",
  },
  {
    title: "No root, no PC",
    body: "Anvil talks to the pendrive over the USB Mass Storage protocol itself, so any phone with USB OTG can write a whole drive.",
  },
  {
    title: "Windows Setup, your way",
    body: "Optional local account, skip Windows 11's TPM check, no surprise BitLocker, fewer ads. Plus a drivers folder for laptops that say “No drivers were found”.",
  },
  {
    title: "Built for real phones",
    body: "Resumes after network drops, picks the fastest mirror, keeps writing with the screen off, and reads everything back to verify it.",
  },
  {
    title: "Free and open source",
    body: "MIT licensed. No accounts, no ads, no analytics. English and हिन्दी.",
  },
];

const steps = [
  { title: "Plug in a pendrive", body: "Use a USB OTG adapter (or a USB-C pendrive). 8 GB is enough for Linux, 16 GB for Windows." },
  { title: "Pick Windows or Linux", body: "Choose a version. Anvil downloads the official ISO and verifies it, or use an ISO you already have." },
  { title: "Tap Write", body: "Confirm the drive, keep it plugged in, and boot your PC from it when Anvil says it's ready." },
];

function Section({ label, children, id }: { label: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} data-reveal className="grid gap-x-12 gap-y-6 border-t border-line py-12 lg:grid-cols-12">
      <h2 className="label pt-1.5 lg:col-span-3">{label}</h2>
      <div className="lg:col-span-9">{children}</div>
    </section>
  );
}

export default function AnvilPage() {
  return (
    <article className="shell pb-12 pt-[calc(var(--header-h)+2rem)] md:pt-[calc(var(--header-h)+4rem)]">
      <script
        {...jsonLd({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "@id": `${SITE_URL}/anvil#app`,
          name: "Anvil",
          description: DESCRIPTION,
          operatingSystem: "Android 8.0+",
          applicationCategory: "UtilitiesApplication",
          downloadUrl: ANVIL.apkUrl,
          url: `${SITE_URL}/anvil`,
          softwareVersion: ANVIL.fallback.version,
          license: "https://opensource.org/licenses/MIT",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          author: { "@id": `${SITE_URL}/#person` },
        })}
      />
      <script
        {...jsonLd(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Anvil", url: `${SITE_URL}/anvil` },
          ]),
        )}
      />

      {/* Hero: the download is the point of the page, so it sits above the fold on a phone. */}
      <header className="grid items-center gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="fade-up flex items-center gap-4">
            <AnvilMark className="h-16 w-16 shrink-0 drop-shadow-[0_12px_24px_rgba(15,21,29,0.35)] sm:h-20 sm:w-20" />
            <p className="label">Android app · free · open source</p>
          </div>
          <h1 className="display mt-6 text-[clamp(3.25rem,12vw,7.5rem)]">
            <span className="rise">
              <span>Anvil</span>
            </span>
          </h1>
          <p className="fade-up mt-4 max-w-[34ch] font-serif text-[clamp(1.4rem,4.2vw,2.1rem)] italic leading-snug text-ink" style={{ ["--d" as string]: "200ms" }}>
            {TAGLINE}
          </p>

          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ ["--d" as string]: "320ms" }}>
            <a
              href={ANVIL.apkUrl}
              className="btn btn-solid h-14 justify-center px-8 text-base sm:justify-start"
            >
              Download APK <ArrowDown />
            </a>
            <a href={ANVIL.repo} target="_blank" rel="noopener" className="btn btn-ghost h-14 justify-center px-6 sm:justify-start">
              View on GitHub <ArrowUpRight />
            </a>
          </div>
          <p className="fade-up mt-3 text-sm text-ink3" style={{ ["--d" as string]: "380ms" }}>
            Open this page on the phone you&apos;ll use, then tap Download. Needs Android 8.0+ with USB OTG.
          </p>
        </div>

        <div className="fade-up panel p-6 sm:p-8 lg:col-span-5" style={{ ["--d" as string]: "420ms" }}>
          <p className="label mb-5">This download</p>
          <ReleaseInfo />
          <p className="mt-6 text-xs leading-relaxed text-ink3">
            Served from GitHub Releases, so it&apos;s always the latest build. Signing certificate SHA-256{" "}
            <code className="break-all font-mono">f9e5689d…e4b93a3e</code>.
          </p>
        </div>
      </header>

      <div className="mt-16">
        <Section label="What it does">
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f.title}>
                <h3 className="flex items-center gap-2 text-base font-medium text-ink">
                  <Check className="text-accent" /> {f.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink2">{f.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="How to use it">
          <ol className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-line-strong pt-4">
                <span className="display text-5xl text-accent">{i + 1}</span>
                <h3 className="mt-3 text-base font-medium text-ink">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink2">{s.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section label="If installing is blocked" id="install-help">
          <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink2">
            Anvil isn&apos;t on the Play Store yet, so Android double-checks it. That&apos;s expected. When you open the APK, allow{" "}
            <strong className="font-medium text-ink">Install unknown apps</strong> for your browser if asked, then:
          </p>
          <dl className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="panel p-5">
              <dt className="label">Chrome</dt>
              <dd className="mt-3 text-[0.9375rem] leading-relaxed text-ink2">
                “File might be harmful” → tap <strong className="font-medium text-ink">Download anyway</strong>.
              </dd>
            </div>
            <div className="panel p-5">
              <dt className="label">Play Protect</dt>
              <dd className="mt-3 text-[0.9375rem] leading-relaxed text-ink2">
                “Unsafe app blocked” or “Scan app” → <strong className="font-medium text-ink">More details → Install anyway</strong> (or scan, then
                install).
              </dd>
            </div>
            <div className="panel p-5">
              <dt className="label">Samsung</dt>
              <dd className="mt-3 text-[0.9375rem] leading-relaxed text-ink2">
                Nothing happens, or “Blocked by Auto Blocker” → turn off{" "}
                <strong className="font-medium text-ink">Settings → Security and privacy → Auto Blocker</strong> while installing, then turn it back on.
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-ink3">
            Updating from 0.4.0 installs over the top. Coming from v0.3.x, uninstall the old version once first.
          </p>
        </Section>

        <Section label="Links">
          <ul className="flex flex-wrap gap-3">
            {[
              { label: "Source on GitHub", href: ANVIL.repo },
              { label: "Release notes", href: ANVIL.releases },
              { label: "Privacy policy", href: ANVIL.privacy },
              { label: "Report a problem", href: ANVIL.issues },
            ].map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener" className="btn btn-ghost">
                  {l.label} <ArrowUpRight />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink3">
            How it works, and why it needs no root:{" "}
            <Link href="/projects/anvil" className="link">
              the Anvil case study
            </Link>
            . Not affiliated with Microsoft; Windows needs a valid licence to activate.
          </p>
        </Section>
      </div>
    </article>
  );
}
