// The "arch RA" identity: an R plus an A drawn as a Rajput pointed arch (Hawa Mahal windows).
// Paths are on a 100×120 cap grid; the monogram places A 120 units right of R.

const R_PATH =
  "M0 0H64C88 0 100 14 100 34C100 52 90 62 74 66L100 120H72L50 70H26V120H0ZM26 22V48H62C70 48 74 42 74 35C74 28 70 22 62 22Z";
const A_PATH =
  "M0 120V58C0 22 30 10 50 0C70 10 100 22 100 58V120H74V84H26V120ZM26 62H74V58C74 40 62 28 50 22C38 28 26 40 26 58Z";

export const RANI = "#C8205E";

interface LogoProps {
  className?: string;
  /** Kept for compatibility with older call sites; the mark is static. */
  animated?: boolean;
  showGlow?: boolean;
}

/** Monogram on a rani-pink tile: the main logo. */
export function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Ruchin Audichya logo">
      <rect width="200" height="200" rx="36" fill={RANI} />
      <g transform="translate(34 67) scale(0.6)" fill="#F3F3EF" fillRule="evenodd">
        <path d={R_PATH} />
        <path transform="translate(120 0)" d={A_PATH} />
      </g>
    </svg>
  );
}

/** Monogram without a tile: R in the current text colour, the arch in rani pink. */
export function LogoMonochrome({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Ruchin Audichya logo">
      <path fill="currentColor" fillRule="evenodd" d={R_PATH} />
      <path fill={RANI} fillRule="evenodd" transform="translate(120 0)" d={A_PATH} />
    </svg>
  );
}

/** The arch alone, used where space is tight (favicon-sized spots). */
export function LogoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Ruchin Audichya">
      <path fill={RANI} fillRule="evenodd" d={A_PATH} />
    </svg>
  );
}
