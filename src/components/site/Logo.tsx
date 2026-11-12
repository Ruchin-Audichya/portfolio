// The "arch RA" identity: an R plus an A drawn as a Rajput pointed arch (Hawa Mahal windows).
// Paths are on a 100×120 cap grid; the monogram places the A 120 units right of the R.

const R_PATH =
  "M0 0H64C88 0 100 14 100 34C100 52 90 62 74 66L100 120H72L50 70H26V120H0ZM26 22V48H62C70 48 74 42 74 35C74 28 70 22 62 22Z";
const A_PATH =
  "M0 120V58C0 22 30 10 50 0C70 10 100 22 100 58V120H74V84H26V120ZM26 62H74V58C74 40 62 28 50 22C38 28 26 40 26 58Z";

/** R in the current text colour, the arch in the accent. */
export function Logo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 120" className={className} role="img" aria-label="Ruchin Audichya">
      <path fill="currentColor" fillRule="evenodd" d={R_PATH} />
      <path className="fill-accent" fillRule="evenodd" transform="translate(120 0)" d={A_PATH} />
    </svg>
  );
}

/**
 * The outline of the arch as a reusable clip path (objectBoundingBox units).
 * Rendered once in the layout; use with `clip-path: url(#arch)`.
 */
export function ArchClip() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="arch" clipPathUnits="objectBoundingBox">
          <path d="M0 1V0.44C0 0.17 0.3 0.08 0.5 0C0.7 0.08 1 0.17 1 0.44V1Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
