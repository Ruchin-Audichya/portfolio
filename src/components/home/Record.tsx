import Image from "next/image";
import { ArrowUpRight } from "@/components/site/Icons";
import { achievements, certifications, experience, toolbox } from "@/lib/content";
import { SectionHead } from "./SectionHead";

export function RecordSection() {
  return (
    <section id="record" className="shell py-16 md:py-24">
      <SectionHead index="02" title="Record" aside="Experience, results and verified credentials" />

      {/* Numbers first. */}
      <ul className="grid grid-cols-2 border-b border-line lg:grid-cols-4">
        {achievements.map((a, i) => (
          <li
            key={a.source}
            data-reveal
            style={{ ["--d" as string]: `${i * 70}ms` }}
            className="border-line py-8 pr-4 odd:border-r max-lg:[&:nth-child(-n+2)]:border-b lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0 max-lg:even:pl-5"
          >
            <p className="display text-[clamp(2.5rem,5vw,4rem)] tabular-nums">{a.value}</p>
            <p className="mt-2 text-sm font-medium">{a.label}</p>
            <p className="mt-1 text-xs text-ink3">{a.source}</p>
          </li>
        ))}
      </ul>

      {/* Experience and education, as ledger rows. */}
      <ol>
        {experience.map((job) => (
          <li key={job.role} data-reveal className="grid gap-x-12 gap-y-3 border-b border-line py-9 lg:grid-cols-12">
            <p className="label pt-2 lg:col-span-3">{job.period}</p>
            <div className="lg:col-span-4">
              <h3 className="font-serif text-[1.75rem] leading-tight">{job.role}</h3>
              <p className="mt-1.5 text-sm text-ink2">
                {job.org} · {job.where}
              </p>
            </div>
            <ul className="space-y-3 lg:col-span-5">
              {job.points.map((point) => (
                <li key={point} className="text-[0.9375rem] leading-relaxed text-ink2">
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {/* Certifications, each linking to its Credly record. */}
      <div className="grid gap-x-12 gap-y-6 border-b border-line py-10 lg:grid-cols-12">
        <p className="label pt-1 lg:col-span-3" data-reveal>
          Certifications
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-9">
          {certifications.map((cert, i) => (
            <li key={cert.title} data-reveal style={{ ["--d" as string]: `${i * 60}ms` }}>
              <a
                href={cert.href}
                target="_blank"
                rel="noopener"
                className="group flex items-center gap-4 rounded-2xl border border-line bg-raised p-4 transition-colors duration-300 hover:border-ink"
              >
                <Image src={cert.image} alt="" width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />
                <span className="min-w-0 flex-1">
                  <span className="label block">
                    {cert.issuer} · {cert.year}
                  </span>
                  <span className="mt-1.5 block text-[0.9375rem] font-medium leading-snug">{cert.title}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-ink3 transition-colors group-hover:text-accent">
                  Verify <ArrowUpRight className="h-3 w-3" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Toolbox */}
      <div className="grid gap-x-12 gap-y-6 py-10 lg:grid-cols-12">
        <p className="label pt-1 lg:col-span-3" data-reveal>
          Toolbox
        </p>
        <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:col-span-9">
          {toolbox.map((group, i) => (
            <div key={group.group} data-reveal style={{ ["--d" as string]: `${i * 60}ms` }}>
              <dt className="text-sm font-medium">{group.group}</dt>
              <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink2">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
