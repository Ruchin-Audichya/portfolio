"use client";

import { useMemo, useState } from "react";
import { Check, Replay } from "@/components/site/Icons";
import { rupees, splitFare } from "@/lib/fare";
import { DemoButton, DemoFrame } from "./DemoFrame";

const DEFAULTS = [
  { name: "Asha", km: 14 },
  { name: "Bilal", km: 11 },
  { name: "Charu", km: 9 },
];

export function FareDemo() {
  const [riders, setRiders] = useState(DEFAULTS);
  const { shares, cab, sharedKm } = useMemo(() => splitFare(riders), [riders]);

  const total = shares.reduce((sum, s) => sum + s.share, 0);
  const saved = shares.reduce((sum, s) => sum + s.saved, 0);
  const changed = riders.some((r, i) => r.km !== DEFAULTS[i].km);

  const setKm = (index: number, km: number) => setRiders((rs) => rs.map((r, i) => (i === index ? { ...r, km } : r)));

  return (
    <DemoFrame
      title="Yatra Sync · fare split"
      status={`${sharedKm} km shared`}
      action={
        <DemoButton onClick={() => setRiders(DEFAULTS)} disabled={!changed}>
          <Replay /> Reset
        </DemoButton>
      }
      note="A simplified version of the split, running in your browser. Riders and the fare model (₹50 + ₹24 per km) are illustrative."
    >
      <p className="text-sm text-ink2">Drag a distance. The shares always add up to the cab fare, and nobody pays more than going alone.</p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="label border-b border-line text-left [&>th]:pb-2.5 [&>th]:font-normal">
              <th scope="col">Rider</th>
              <th scope="col" className="w-[46%] sm:w-[34%]">
                Distance
              </th>
              <th scope="col" className="hidden text-right sm:table-cell">
                Alone
              </th>
              <th scope="col" className="text-right">
                Shared
              </th>
              <th scope="col" className="hidden text-right sm:table-cell">
                Saved
              </th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {shares.map((s, i) => (
              <tr key={s.name} className="border-b border-line">
                <th scope="row" className="py-2.5 pr-3 text-left font-medium">
                  {s.name}
                </th>
                <td className="py-1 pr-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="range"
                      className="slider"
                      min={2}
                      max={25}
                      step={1}
                      value={s.km}
                      onChange={(e) => setKm(i, Number(e.target.value))}
                      aria-label={`${s.name}'s distance in kilometres`}
                    />
                    <span className="w-11 shrink-0 text-right font-mono text-xs text-ink2">{s.km} km</span>
                  </label>
                </td>
                <td className="hidden py-2.5 text-right font-mono text-xs text-ink3 line-through decoration-ink3/50 sm:table-cell">{rupees(s.solo)}</td>
                <td className="py-2.5 text-right font-mono text-[0.8125rem]">{rupees(s.share)}</td>
                <td className="hidden py-2.5 text-right font-mono text-xs text-ok sm:table-cell">{rupees(s.saved)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="tabular-nums">
            <tr>
              <th scope="row" colSpan={2} className="pt-3 text-left font-normal text-ink2">
                One cab, {sharedKm} km
              </th>
              <td className="hidden sm:table-cell" />
              <td className="pt-3 text-right font-mono text-[0.8125rem] font-medium">{rupees(cab)}</td>
              <td className="hidden pt-3 text-right font-mono text-xs text-ok sm:table-cell">{rupees(saved)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-3 text-xs text-ok sm:hidden">Together they save {rupees(saved)}.</p>

      <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line px-4 py-3 font-mono text-xs tabular-nums" aria-live="polite">
        <span className="grid h-4 w-4 place-items-center rounded-full bg-ok text-paper">
          <Check className="h-2 w-2" />
        </span>
        {shares.map((s) => rupees(s.share)).join(" + ")} = {rupees(total)}
        <span className="text-ink3">{total === cab ? "· exact to the paisa" : ""}</span>
      </p>
    </DemoFrame>
  );
}
