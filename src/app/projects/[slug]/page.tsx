import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "@/components/site/Icons";
import { getProject, projects } from "@/lib/content";
import { SITE_URL, breadcrumbSchema, jsonLd, softwareSchema } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "Project not found" };
  const title = `${project.title} — ${project.tagline}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { type: "article", url: `${SITE_URL}/projects/${project.slug}`, title, description: project.summary },
  };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section data-reveal className="grid gap-x-12 gap-y-4 border-t border-line py-10 lg:grid-cols-12">
      <h2 className="label pt-1.5 lg:col-span-3">{label}</h2>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}

export default function ProjectPage({ params }: Props) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="shell pb-8 pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
      <script {...jsonLd(softwareSchema(project))} />
      <script
        {...jsonLd(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Work", url: `${SITE_URL}/#work` },
            { name: project.title, url: `${SITE_URL}/projects/${project.slug}` },
          ]),
        )}
      />

      <nav aria-label="Breadcrumb" className="fade-up label flex items-center gap-2">
        <Link href="/#work" className="link-quiet">
          Work
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{project.title}</span>
      </nav>

      <header className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="fade-up label" style={{ ["--d" as string]: "60ms" }}>
            {project.kind} · {project.year}
          </p>
          <h1 className="display mt-5 text-[clamp(3rem,9vw,7rem)]">
            {project.title.split(" ").map((word, i) => (
              <span key={i}>
                <span className="rise">
                  <span style={{ ["--i" as string]: i }}>{word}</span>
                </span>{" "}
              </span>
            ))}
          </h1>
          <p className="fade-up mt-4 font-serif text-[clamp(1.5rem,3vw,2.25rem)] italic leading-snug text-accent" style={{ ["--d" as string]: "350ms" }}>
            {project.tagline}
          </p>
          <p className="fade-up mt-6 max-w-2xl text-lg leading-relaxed text-ink2" style={{ ["--d" as string]: "450ms" }}>
            {project.summary}
          </p>
        </div>

        <aside className="fade-up lg:col-span-4 lg:pt-12" style={{ ["--d" as string]: "550ms" }}>
          <dl className="border-t border-line text-sm">
            <div className="border-b border-line py-3">
              <dt className="label">Built with</dt>
              <dd className="mt-2 leading-relaxed text-ink2">{project.stack.join(" · ")}</dd>
            </div>
          </dl>
          {project.links.length ? (
            <ul className="mt-5 flex flex-wrap gap-3">
              {project.links.map((link, i) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener" className={`btn h-10 ${i === 0 ? "btn-solid" : "btn-ghost"}`}>
                    {link.label} <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      </header>

      <ul className="mt-14 grid grid-cols-2 border-y border-line lg:grid-cols-4" data-reveal>
        {project.facts.map((fact) => (
          <li
            key={fact.label}
            className="border-line py-6 pr-4 odd:border-r max-lg:even:pl-5 max-lg:[&:nth-child(-n+2):not(:nth-last-child(-n+2))]:border-b lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0"
          >
            <p className="display text-[clamp(2rem,4vw,3.25rem)] tabular-nums">{fact.value}</p>
            <p className="mt-2 text-sm text-ink3">{fact.label}</p>
          </li>
        ))}
      </ul>

      {project.image ? (
        <figure className="mt-12" data-reveal>
          <div className="panel overflow-hidden">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              sizes="(min-width: 1344px) 1232px, 92vw"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 text-sm text-ink3">{project.image.caption}</figcaption>
        </figure>
      ) : null}

      <div className="mt-14">
        <Block label="The problem">
          <div className="space-y-4">
            {project.study.problem.map((p, i) => (
              <p key={p} className={i === 0 ? "font-serif text-[clamp(1.5rem,2.6vw,2rem)] leading-snug" : "max-w-2xl text-base leading-relaxed text-ink2"}>
                {p}
              </p>
            ))}
          </div>
        </Block>

        <Block label="How it works">
          <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {project.study.approach.map((step, i) => (
              <li key={step.title}>
                <p className="label text-accent">Step {i + 1}</p>
                <h3 className="mt-3 font-serif text-2xl leading-tight">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink2">{step.body}</p>
              </li>
            ))}
          </ol>
        </Block>

        <Block label="The hard parts">
          <dl>
            {project.study.hard.map((item) => (
              <div key={item.title} className="grid gap-x-8 gap-y-1 border-b border-line py-4 first:pt-0 sm:grid-cols-[14rem_minmax(0,1fr)]">
                <dt className="text-[0.9375rem] font-medium">{item.title}</dt>
                <dd className="text-[0.9375rem] leading-relaxed text-ink2">{item.body}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block label="The proof">
          <ul className="space-y-3">
            {project.study.outcome.map((line) => (
              <li key={line} className="flex gap-3 text-base leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ok" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-2xl border border-line bg-raised px-5 py-4 text-sm leading-relaxed text-ink2">
            <span className="label mb-2 block">Honest status</span>
            {project.study.honest}
          </p>
        </Block>
      </div>

      <Link
        href={`/projects/${next.slug}`}
        className="group mt-6 flex items-end justify-between gap-6 border-t border-line-strong py-10"
        data-reveal
      >
        <span>
          <span className="label">Next project</span>
          <span className="display mt-3 block text-[clamp(2.25rem,6vw,4.5rem)] transition-colors group-hover:text-accent">{next.title}</span>
        </span>
        <span className="mb-3 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:border-accent group-hover:text-accent">
          <ArrowRight />
        </span>
      </Link>
    </article>
  );
}
