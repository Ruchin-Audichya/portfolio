import Link from "next/link";
import { nav, site } from "@/lib/content";
import { LocalTime } from "./LocalTime";

const socials = [
  { label: "GitHub", href: site.socials.github },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "X", href: site.socials.x },
  { label: "LeetCode", href: site.socials.leetcode },
  { label: "Instagram", href: site.socials.instagram },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="shell grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-deva text-2xl leading-none">{site.nameDeva}</p>
          <p className="label mt-3">{site.pronunciation}</p>
          <p className="mt-6 max-w-xs text-sm text-ink2">
            Designed and built in Jaipur. The source for this site is on{" "}
            <a className="link" href="https://github.com/Ruchin-Audichya/portfolio" target="_blank" rel="noopener">
              GitHub
            </a>
            .
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
          <p className="label mb-4">Site</p>
          <ul className="space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.resume} target="_blank" rel="noopener" className="link">
                Résumé (PDF)
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="label mb-4">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="me noopener" className="link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line py-5">
        <p className="label">© {new Date().getFullYear()} Ruchin Audichya</p>
        <p className="label">
          Jaipur · <LocalTime />
        </p>
      </div>
    </footer>
  );
}
