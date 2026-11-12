import { ArrowUpRight } from "@/components/site/Icons";
import { site } from "@/lib/content";
import { ContactForm } from "./ContactForm";
import { SectionHead } from "./SectionHead";

export function Contact() {
  return (
    <section id="contact" className="shell py-16 md:py-24">
      <SectionHead index="04" title="Contact" aside={site.availability} />

      <div className="grid gap-x-12 gap-y-12 pt-12 lg:grid-cols-12">
        <div className="lg:col-span-6" data-reveal>
          <p className="display text-[clamp(2.25rem,5vw,4.25rem)]">
            Have a role, a project or a hard bug? <span className="italic text-accent">Write to me.</span>
          </p>
          <a
            href={`mailto:${site.email}`}
            className="link mt-8 inline-flex items-center gap-2 break-all text-lg md:text-xl"
          >
            {site.email} <ArrowUpRight />
          </a>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink2">
            <li>
              <a className="link" href={site.socials.linkedin} target="_blank" rel="noopener">
                LinkedIn
              </a>
            </li>
            <li>
              <a className="link" href={site.socials.github} target="_blank" rel="noopener">
                GitHub
              </a>
            </li>
            <li>
              <a className="link" href={site.resume} target="_blank" rel="noopener">
                Résumé (PDF)
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-5 lg:col-start-8" data-reveal style={{ ["--d" as string]: "120ms" }}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
