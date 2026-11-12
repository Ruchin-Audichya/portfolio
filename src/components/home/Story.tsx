import { story } from "@/lib/content";
import { SectionHead } from "./SectionHead";

export function Story() {
  return (
    <section id="story" className="shell py-16 md:py-24">
      <SectionHead index="03" title="Story" aside="Why I have always been a builder" />

      <div className="grid gap-x-12 gap-y-12 pt-12 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <div className="lg:sticky lg:top-28">
            <p className="font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.15] tracking-[-0.015em]">{story.intro[0]}</p>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink2">{story.intro[1]}</p>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {story.timeline.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={{ ["--d" as string]: `${Math.min(i, 3) * 60}ms` }}
              className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-6 border-t border-line py-6 last:border-b sm:grid-cols-[7.5rem_minmax(0,1fr)]"
            >
              <p className="font-serif text-2xl italic leading-tight text-accent sm:text-[1.75rem]">{item.when}</p>
              <div>
                <h3 className="text-base font-medium">{item.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink2">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
