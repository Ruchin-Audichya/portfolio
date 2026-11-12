import { marquee } from "@/lib/content";

const ARCH = "M0 120V58C0 22 30 10 50 0C70 10 100 22 100 58V120H74V84H26V120ZM26 62H74V58C74 40 62 28 50 22C38 28 26 40 26 58Z";

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {marquee.map((line) => (
        <li key={line} className="flex items-center">
          <span className="whitespace-nowrap px-7 font-serif text-[clamp(1.75rem,4vw,3rem)] italic leading-none md:px-10">{line}</span>
          <svg viewBox="0 0 100 120" className="h-5 w-auto fill-accent md:h-6" aria-hidden="true">
            <path d={ARCH} fillRule="evenodd" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/** Two identical rows slide left by half their width, so the loop never shows a seam. */
export function Marquee() {
  return (
    <div className="marquee-wrap relative z-10 overflow-hidden border-y border-line py-7 md:py-9">
      <div className="marquee">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
