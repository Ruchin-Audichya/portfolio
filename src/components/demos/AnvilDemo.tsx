"use client";

import { Check, Replay } from "@/components/site/Icons";
import { DemoButton, DemoFrame } from "./DemoFrame";
import { span, useRun } from "./useRun";

const COLS = 24;
const ROWS = 7;
const CELLS = COLS * ROWS;
const PARTITION_CELLS = 3;

// The same stages the app's progress checklist shows, compressed into a few seconds.
const STAGES = [
  { label: "Resolve the official ISO", detail: () => "Signed link + SHA-256 from Microsoft", from: 0, to: 0.08 },
  { label: "Download, resumable", detail: (p: number) => `${(8.4 * p).toFixed(1)} / 8.4 GB`, from: 0.08, to: 0.3 },
  { label: "Partition the drive", detail: () => "GPT + FAT32, UEFI bootable", from: 0.3, to: 0.36 },
  { label: "Write 978 files", detail: () => "install.wim → 2 × .swm, streamed", from: 0.36, to: 0.76 },
  { label: "Read back and verify", detail: () => "SHA-256 of everything written", from: 0.76, to: 0.97 },
] as const;

export function AnvilDemo() {
  const { ref, t, running, play } = useRun(9000);

  const partition = span(t, 0.3, 0.36);
  const written = span(t, 0.36, 0.76);
  const verified = span(t, 0.76, 0.97);
  const done = t >= 1;

  return (
    <div ref={ref}>
      <DemoFrame
        title="Anvil · write a drive"
        status={done ? "Verified" : running ? `${Math.round(t * 100)}%` : "Ready"}
        action={
          <DemoButton onClick={play} disabled={running}>
            <Replay /> {done ? "Run again" : "Run"}
          </DemoButton>
        }
        note="A simulation of the real pipeline. The figures are from the verified Windows 11 run in the project README."
      >
        <div className="flex items-center justify-between">
          <p className="label">USB drive · 16 GB</p>
          <p className="label tabular-nums">
            {Math.round(written * 100)}% written · {Math.round(verified * 100)}% verified
          </p>
        </div>

        {/* Each cell is a slice of the drive: partition table, then data, then the verify pass. */}
        <div
          className="mt-3 grid gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          role="img"
          aria-label={`Drive map: ${Math.round(written * 100)} percent written, ${Math.round(verified * 100)} percent verified`}
        >
          {Array.from({ length: CELLS }, (_, i) => {
            const pos = i / CELLS;
            const isPartition = i < PARTITION_CELLS;
            let cls = "bg-ink/[0.07]";
            if (isPartition ? partition > i / PARTITION_CELLS : written > pos) cls = isPartition ? "bg-accent" : "bg-ink/45";
            if (verified > pos && (isPartition ? partition > 0 : true)) cls = "bg-ok";
            return <span key={i} className={`aspect-square rounded-[2px] transition-colors duration-200 ${cls}`} />;
          })}
        </div>

        <ol className="mt-6 divide-y divide-line border-y border-line">
          {STAGES.map((stage, i) => {
            const p = span(t, stage.from, stage.to);
            const state = p >= 1 ? "done" : p > 0 ? "active" : "waiting";
            return (
              <li key={stage.label} className="flex items-center gap-3 py-2.5">
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.625rem] transition-colors duration-300 ${
                    state === "done"
                      ? "border-ok bg-ok text-paper"
                      : state === "active"
                        ? "border-accent text-accent"
                        : "border-line-strong text-ink3"
                  }`}
                >
                  {state === "done" ? <Check className="h-2.5 w-2.5" /> : <span className="font-mono">{i + 1}</span>}
                </span>
                <span className={`text-sm transition-colors ${state === "waiting" ? "text-ink3" : "text-ink"}`}>{stage.label}</span>
                <span className="ml-auto text-right font-mono text-[0.6875rem] tabular-nums text-ink3">{stage.detail(p)}</span>
              </li>
            );
          })}
        </ol>

        <p
          className={`mt-4 flex items-center gap-2 text-sm transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}
          aria-live="polite"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-ok text-paper">
            <Check className="h-2.5 w-2.5" />
          </span>
          Bootable under UEFI with Secure Boot. Safe to unplug.
        </p>
      </DemoFrame>
    </div>
  );
}
