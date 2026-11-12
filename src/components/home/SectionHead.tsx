/** The shared heading row for homepage sections: an index, a serif title and a quiet aside. */
export function SectionHead({ index, title, aside }: { index: string; title: string; aside?: string }) {
  return (
    <header data-reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-line-strong pb-5">
      <div className="flex items-baseline gap-5">
        <span className="label text-accent">{index}</span>
        <h2 className="display text-[clamp(2.25rem,5.2vw,4rem)]">{title}</h2>
      </div>
      {aside ? <p className="label pb-2">{aside}</p> : null}
    </header>
  );
}
