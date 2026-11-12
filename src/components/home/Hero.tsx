import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "@/components/site/Icons";
import { LocalTime } from "@/components/site/LocalTime";
import { heroFacts, site } from "@/lib/content";

// The headline, word by word. Each word rises out of its own mask on load.
const HEADLINE: { text: string; href?: string; title?: string }[] = [
  { text: "I" },
  { text: "build" },
  { text: "software" },
  { text: "that’s" },
  { text: "exact:" },
  { text: "to" },
  { text: "the" },
  { text: "paisa,", href: "#yatra-sync", title: "Yatra Sync splits cab fares exact to the paisa" },
  { text: "the" },
  { text: "byte", href: "#anvil", title: "Anvil verifies every byte it writes with SHA-256" },
  { text: "and" },
  { text: "the" },
  { text: "milligram.", href: "#medifast", title: "MediFast never swaps Pan 20 for Pan 40" },
];

export function Hero() {
  return (
    <section className="shell pb-16 pt-[calc(var(--header-h)+2.5rem)] md:pb-24 md:pt-[calc(var(--header-h)+4.5rem)]">
      <div className="fade-up flex flex-wrap items-center gap-x-6 gap-y-2" style={{ ["--d" as string]: "0ms" }}>
        <p className="label flex items-center gap-2.5 text-ink2">
          <span className="live-dot" aria-hidden="true" />
          {site.availability}
        </p>
        <p className="label hidden sm:block">
          {site.location} · {site.coords}
        </p>
        <p className="label hidden md:block">
          <LocalTime />
        </p>
      </div>

      <div className="mt-10 grid gap-x-12 gap-y-12 md:mt-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1>
            <span className="fade-up block text-base text-ink2 md:text-lg" style={{ ["--d" as string]: "60ms" }}>
              Ruchin Audichya, software engineer.
            </span>
            <span className="display mt-5 block text-[clamp(2.75rem,7.4vw,6.25rem)]">
              {HEADLINE.map((word, i) => (
                <span key={i}>
                  <span className="rise">
                    <span style={{ ["--i" as string]: i }}>
                      {word.href ? (
                        <a href={word.href} title={word.title} className="exact">
                          {/* Keep the comma or full stop outside the link colour. */}
                          {word.text.replace(/[,.]$/, "")}
                        </a>
                      ) : (
                        word.text
                      )}
                      {word.href ? word.text.match(/[,.]$/)?.[0] : null}
                    </span>
                  </span>{" "}
                </span>
              ))}
            </span>
          </h1>

          <p className="fade-up mt-8 max-w-[38rem] text-lg leading-relaxed text-ink2 md:text-xl" style={{ ["--d" as string]: "900ms" }}>
            Final-year computer science student in Jaipur. I ship complete, tested products: an Android app that writes
            bootable Windows drives, a Telegram bot that asks every chemist nearby, and a cab-share app that never
            rounds anyone’s fare.
          </p>

          <div className="fade-up mt-9 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "1000ms" }}>
            <a href="#work" className="btn btn-solid">
              See the work <ArrowDown />
            </a>
            <a href={site.resume} target="_blank" rel="noopener" className="btn btn-ghost">
              Résumé <ArrowUpRight />
            </a>
            <span className="ml-1 flex items-center gap-5 text-sm">
              <a href={site.socials.github} target="_blank" rel="noopener" className="link">
                GitHub
              </a>
              <a href={site.socials.linkedin} target="_blank" rel="noopener" className="link">
                LinkedIn
              </a>
            </span>
          </div>
        </div>

        {/* Portrait in a Jaipur arch, the same shape as the A in the logo. */}
        <figure className="fade-up mx-auto w-full max-w-[17rem] lg:col-span-4 lg:mx-0 lg:ml-auto lg:max-w-[19rem]" style={{ ["--d" as string]: "500ms" }}>
          <div className="relative aspect-[5/6] bg-accent" style={{ clipPath: "url(#arch)" }}>
            <div className="absolute inset-[3px] overflow-hidden bg-raised" style={{ clipPath: "url(#arch)" }}>
              <Image
                src="/profile.jpg"
                alt="Ruchin Audichya, smiling, with headphones around his neck"
                fill
                priority
                sizes="(min-width: 1024px) 19rem, 17rem"
                className="object-cover object-[50%_22%]"
              />
            </div>
          </div>
          <figcaption className="mt-4 flex items-baseline justify-between gap-4">
            <span className="font-deva text-xl leading-none">{site.nameDeva}</span>
            <span className="label">{site.pronunciation}</span>
          </figcaption>
        </figure>
      </div>

      <dl className="mt-16 grid border-t border-line sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
        {heroFacts.map((fact, i) => (
          <div
            key={fact.label}
            data-reveal
            style={{ ["--d" as string]: `${i * 70}ms` }}
            className="border-b border-line py-5 sm:pr-8 lg:border-b-0 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
          >
            <dt className="label">{fact.label}</dt>
            <dd className="mt-3 text-[0.9375rem] font-medium leading-snug">{fact.value}</dd>
            <dd className="mt-1 text-sm text-ink3">{fact.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
