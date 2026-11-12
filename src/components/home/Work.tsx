import Link from "next/link";
import type { ReactNode } from "react";
import { AnvilDemo } from "@/components/demos/AnvilDemo";
import { FareDemo } from "@/components/demos/FareDemo";
import { MedifastDemo } from "@/components/demos/MedifastDemo";
import { ArrowRight, ArrowUpRight } from "@/components/site/Icons";
import { flagship, moreWork } from "@/lib/content";
import { SectionHead } from "./SectionHead";

const DEMOS: Record<string, ReactNode> = {
  anvil: <AnvilDemo />,
  medifast: <MedifastDemo />,
  "yatra-sync": <FareDemo />,
};

export function Work() {
  return (
    <section id="work" className="shell py-16 md:py-24">
      <SectionHead index="01" title="Selected work" aside="Three products, each with a working demo" />

      {flagship.map((project, i) => (
        <article
          key={project.slug}
          id={project.anchor}
          className="grid scroll-mt-24 gap-x-12 gap-y-10 border-b border-line py-14 md:py-20 lg:grid-cols-12"
        >
          <div className="min-w-0 lg:col-span-5" data-reveal>
            <p className="label flex items-center gap-3">
              <span className="text-ink">0{i + 1}</span>
              <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
              {project.kind} · {project.year}
            </p>
            <h3 className="display mt-6 text-[clamp(2.5rem,5vw,3.75rem)]">{project.title}</h3>
            <p className="mt-3 font-serif text-2xl italic leading-snug text-accent md:text-[1.75rem]">{project.tagline}</p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink2">{project.summary}</p>

            <dl className="mt-8 border-t border-line">
              {project.proofs.map((p) => (
                <div key={p.claim} className="border-b border-line py-4">
                  <dt className="text-[0.9375rem] font-medium">{p.claim}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink2">{p.proof}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 font-mono text-xs leading-relaxed text-ink3">{project.stack.join(" · ")}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <Link href={`/projects/${project.slug}`} className="btn btn-solid h-10">
                Case study <ArrowRight />
              </Link>
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener" className="link inline-flex items-center gap-1.5">
                  {link.label} <ArrowUpRight className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7 lg:pl-4" data-reveal style={{ ["--d" as string]: "120ms" }}>
            <div className="lg:sticky lg:top-24">
              {DEMOS[project.anchor]}
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {project.facts.map((f) => (
                  <li key={f.label}>
                    <p className="font-serif text-2xl leading-none tabular-nums">{f.value}</p>
                    <p className="mt-1.5 text-xs leading-snug text-ink3">{f.label}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}

      {/* Everything else, as an index. */}
      <div className="pt-14 md:pt-20">
        <p className="label" data-reveal>
          More work
        </p>
        <ul className="mt-5 border-t border-line">
          {moreWork.map((item, i) => {
            const external = item.href.startsWith("http");
            const inner = (
              <>
                <span className="label w-16 shrink-0 pt-1.5 tabular-nums">{item.year}</span>
                <span className="min-w-0 flex-1 md:grid md:grid-cols-12 md:gap-6">
                  <span className="block md:col-span-4">
                    <span className="font-serif text-2xl leading-tight transition-colors group-hover:text-accent">{item.title}</span>
                    <span className="mt-1 block text-xs text-ink3">{item.kind}</span>
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-ink2 md:col-span-6 md:mt-1">{item.blurb}</span>
                  <span className="mt-3 flex items-center gap-1.5 text-sm md:col-span-2 md:mt-1 md:justify-end">
                    {item.cta}
                    {external ? (
                      <ArrowUpRight className="h-3 w-3 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    ) : (
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    )}
                  </span>
                </span>
              </>
            );
            const cls = "group flex gap-4 border-b border-line py-5 transition-[padding] duration-300 ease-out hover:pl-2";
            return (
              <li key={item.title} data-reveal style={{ ["--d" as string]: `${i * 50}ms` }}>
                {external ? (
                  <a href={item.href} target="_blank" rel="noopener" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={item.href} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
