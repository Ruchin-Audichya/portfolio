// A small, self-contained version of the Yatra Sync fare split, used by the homepage demo.
// All money is integer paise, so nothing is ever lost to floating-point rounding.

export type Rider = { name: string; km: number };
export type Share = Rider & { solo: number; share: number; saved: number };

const BASE_PAISE = 5_000; // ₹50 flag-down
const PER_KM_PAISE = 2_400; // ₹24 per km
const DETOUR = 1.15; // the shared cab drives a little further than the longest solo trip

/** Illustrative cab fare for a trip of `km` kilometres, in paise. */
export const fareFor = (km: number) => BASE_PAISE + Math.round(PER_KM_PAISE * km);

/**
 * Splits `total` paise across weights so the parts add up to `total` exactly.
 * Floors each part, then hands the leftover paise to the largest remainders.
 */
export function splitExact(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return weights.map(() => 0);
  const raw = weights.map((w) => (total * w) / sum);
  const parts = raw.map(Math.floor);
  let left = total - parts.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => ({ i, frac: r - Math.floor(r) })).sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (let k = 0; left > 0; k = (k + 1) % order.length, left--) parts[order[k].i]++;
  return parts;
}

/**
 * Splits one shared cab fare by distance, exact to the paisa,
 * and never charges anyone more than their solo fare.
 */
export function splitFare(riders: Rider[]): { shares: Share[]; cab: number; sharedKm: number } {
  const solo = riders.map((r) => fareFor(r.km));
  const longest = Math.max(...riders.map((r) => r.km));
  const sharedKm = Math.round(longest * DETOUR * 10) / 10;
  // The cab can never cost more than everyone travelling alone.
  const cab = Math.min(fareFor(sharedKm), solo.reduce((a, b) => a + b, 0));

  const share = riders.map(() => 0);
  let open = riders.map((_, i) => i);
  let remaining = cab;

  // Proportional split with a cap: anyone who would pay more than their solo fare
  // pays the solo fare instead, and the rest is split again among the others.
  while (open.length) {
    const parts = splitExact(remaining, open.map((i) => riders[i].km * 10));
    const capped = open.filter((i, k) => parts[k] > solo[i]);
    if (!capped.length) {
      open.forEach((i, k) => (share[i] = parts[k]));
      break;
    }
    for (const i of capped) {
      share[i] = solo[i];
      remaining -= solo[i];
    }
    open = open.filter((i) => !capped.includes(i));
  }

  return {
    cab,
    sharedKm,
    shares: riders.map((r, i) => ({ ...r, solo: solo[i], share: share[i], saved: solo[i] - share[i] })),
  };
}

/** 123456 paise → "₹1,234.56" */
export const rupees = (paise: number) =>
  `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
