"use client";

import { useEffect, useState } from "react";
import { Replay } from "@/components/site/Icons";
import { DemoButton, DemoFrame } from "./DemoFrame";
import { span, useRun } from "./useRun";

type Answer = "all" | "some" | "none" | "silent";

// Fictional pharmacies, the same kind the project's own demo uses.
const PHARMACIES: { name: string; m: number; x: number; y: number; at: number; secs: number; answer: Answer; text: string }[] = [
  { name: "Saanjh Pharmacy", m: 500, x: 118, y: 168, at: 0.24, secs: 4, answer: "some", text: "2 of 3 now · Telma 40 by tomorrow" },
  { name: "Pinkcity Care Chemist", m: 350, x: 158, y: 122, at: 0.36, secs: 6, answer: "all", text: "All 3 in stock" },
  { name: "Lotus Medicals", m: 750, x: 96, y: 96, at: 0.5, secs: 8, answer: "some", text: "2 of 3 now · other brand for Pan 40" },
  { name: "Nahar Medicos", m: 1100, x: 190, y: 64, at: 0.62, secs: 11, answer: "none", text: "None of these today" },
  { name: "Gulab Medical", m: 1400, x: 206, y: 186, at: 0.76, secs: 14, answer: "all", text: "All 3 in stock" },
  { name: "Amer Road Chemist", m: 1800, x: 150, y: 228, at: 2, secs: 0, answer: "silent", text: "No reply yet" },
];

const DOT: Record<Answer, string> = {
  all: "fill-ok",
  some: "fill-warn",
  none: "fill-ink3",
  silent: "fill-ink/20",
};
const CHIP: Record<Answer, string> = {
  all: "bg-ok",
  some: "bg-warn",
  none: "bg-ink3",
  silent: "bg-ink/20",
};

const fmt = (m: number) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`);

export function MedifastDemo() {
  const { ref, t, running, play } = useRun(8000);
  const [reserved, setReserved] = useState(false);

  // A replay starts a fresh request.
  useEffect(() => {
    if (running) setReserved(false);
  }, [running]);

  const sent = span(t, 0, 0.16);
  const answered = PHARMACIES.filter((p) => t >= p.at);
  const done = t >= 1;
  const best = PHARMACIES.find((p) => p.answer === "all")!;

  return (
    <div ref={ref}>
      <DemoFrame
        title="MediFast · ask nearby"
        status={done ? `${answered.length} of ${PHARMACIES.length} answered` : running ? "Live" : "Ready"}
        action={
          <DemoButton onClick={play} disabled={running}>
            <Replay /> {done ? "Ask again" : "Ask"}
          </DemoButton>
        }
        note="An example request. The pharmacies are fictional and their answers are scripted; the real bot runs on Telegram."
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="label mr-1">Your list</span>
          {["Pan 40", "Dolo 650 × 2", "Telma 40"].map((m) => (
            <span key={m} className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[0.6875rem]">
              {m}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-6">
          {/* Radius map */}
          <svg viewBox="0 0 280 280" className="mx-auto w-full max-w-[15rem]" role="img" aria-label="Map of six pharmacies within two kilometres">
            {[44, 88, 132].map((r, i) => (
              <circle key={r} cx="140" cy="140" r={r} fill="none" className="stroke-ink/15" strokeWidth="1" strokeDasharray={i === 2 ? "4 5" : undefined} />
            ))}
            <text x="140" y="16" textAnchor="middle" className="fill-ink3 font-mono text-[9px] uppercase tracking-widest">
              2 km
            </text>
            {/* The request going out */}
            {sent > 0 && sent < 1 ? (
              <circle cx="140" cy="140" r={sent * 132} fill="none" className="stroke-accent" strokeWidth="1.5" opacity={1 - sent} />
            ) : null}
            {PHARMACIES.map((p) => {
              const on = t >= p.at;
              const isPick = reserved && p === best;
              return (
                <g key={p.name}>
                  {isPick ? <circle cx={p.x} cy={p.y} r="11" fill="none" className="stroke-ok" strokeWidth="1.5" /> : null}
                  <circle cx={p.x} cy={p.y} r={on ? 6 : 4.5} className={`transition-all duration-300 ${on ? DOT[p.answer] : "fill-ink/20"}`} />
                </g>
              );
            })}
            <circle cx="140" cy="140" r="5" className="fill-accent" />
            <circle cx="140" cy="140" r="9" fill="none" className="stroke-accent/40" strokeWidth="1" />
          </svg>

          {/* The board: one message that updates as answers arrive */}
          <div aria-live="polite">
            <p className="label">
              {t === 0 ? "Waiting to send" : sent < 1 ? "Asking 6 pharmacies within 2 km" : `Answers · ${answered.length} of ${PHARMACIES.length}`}
            </p>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {PHARMACIES.map((p) => {
                const on = t >= p.at;
                const quiet = !on && !(done && p.answer === "silent");
                return (
                  <li key={p.name} className={`flex items-start gap-3 py-2 transition-opacity duration-300 ${quiet ? "opacity-35" : "opacity-100"}`}>
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${on ? CHIP[p.answer] : "bg-ink/20"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-sm">{p.name}</span>
                        <span className="shrink-0 font-mono text-[0.6875rem] tabular-nums text-ink3">{fmt(p.m)}</span>
                      </span>
                      <span className="block text-xs text-ink3">{on ? `${p.text} · replied in ${p.secs}s` : done ? p.text : "…"}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex min-h-11 flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-4 py-2.5">
          {reserved ? (
            <>
              <p className="text-sm">
                Reserved at <span className="font-medium">{best.name}</span>, {fmt(best.m)} away. Show this code and pay at the counter.
              </p>
              <p className="font-mono text-lg tracking-[0.3em] text-accent">4729</p>
            </>
          ) : (
            <>
              <p className="text-sm text-ink2">
                {done ? `${best.name} has everything, ${fmt(best.m)} away.` : "You know where to go before you leave home."}
              </p>
              <DemoButton onClick={() => setReserved(true)} disabled={!done}>
                Reserve
              </DemoButton>
            </>
          )}
        </div>
      </DemoFrame>
    </div>
  );
}
