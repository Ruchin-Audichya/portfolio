"use client";

import { motion } from "framer-motion";
import { Trophy, Sparkles, Code2, Network, Zap, GraduationCap } from "lucide-react";
import { content } from "@/lib/content";

interface Achievement {
  icon: typeof Trophy;
  label: string;
  detail: string;
  accent: "amber" | "cyan" | "purple" | "emerald" | "pink" | "blue";
}

const ACCENTS: Record<Achievement["accent"], { ring: string; chip: string; text: string; dot: string }> = {
  amber:   { ring: "border-amber-300/30",   chip: "bg-amber-300/10",   text: "text-amber-200",   dot: "bg-amber-300" },
  cyan:    { ring: "border-cyan-300/30",    chip: "bg-cyan-300/10",    text: "text-cyan-200",    dot: "bg-cyan-300" },
  purple:  { ring: "border-purple-300/30",  chip: "bg-purple-300/10",  text: "text-purple-200",  dot: "bg-purple-300" },
  emerald: { ring: "border-emerald-300/30", chip: "bg-emerald-300/10", text: "text-emerald-200", dot: "bg-emerald-300" },
  pink:    { ring: "border-pink-300/30",    chip: "bg-pink-300/10",    text: "text-pink-200",    dot: "bg-pink-300" },
  blue:    { ring: "border-blue-300/30",    chip: "bg-blue-300/10",    text: "text-blue-200",    dot: "bg-blue-300" },
};

const achievements: Achievement[] = [
  {
    icon: Trophy,
    label: "Top 24 nationwide — Cognizant Technoverse 2026",
    detail: "Grand Finale qualifier out of 2,000+ teams with MediFast AI",
    accent: "amber",
  },
  {
    icon: Network,
    label: "Engineered a 169K-record medicine knowledge graph",
    detail: "1.3M+ relationship edges with hybrid BM25 + ChromaDB retrieval",
    accent: "cyan",
  },
  {
    icon: Zap,
    label: "+18 pp semantic search accuracy",
    detail: "MediFast AI medicine match: 29.7% → 47.7% across multilingual + symptom queries",
    accent: "purple",
  },
  {
    icon: Sparkles,
    label: "84.7% accuracy • 94.5% ROC-AUC",
    detail: "Placify AI placement classifier on 5,000+ student records",
    accent: "emerald",
  },
  {
    icon: GraduationCap,
    label: "SIH 2024 — Prelims Top 10 Finalist",
    detail: "Smart India Hackathon institute Top 10 with a backend + AI proposal",
    accent: "pink",
  },
  {
    icon: Code2,
    label: "250+ DSA problems • 1,000+ students reached",
    detail: "Consistent LeetCode / Codeforces practice and AWS Cloud Club workshops",
    accent: "blue",
  },
];

export function KeyAchievements() {
  return (
    <section
      id="achievements-strip"
      aria-labelledby="key-achievements-title"
      className="relative bg-[#0a0a0f] py-20 md:py-24"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.05] blur-[140px]" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-6 md:px-12">
        <motion.div
          className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-3">
              <Trophy className="h-4 w-4 text-amber-300" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-200/80">
                Key Achievements
              </span>
            </div>
            <h2
              id="key-achievements-title"
              className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-2xl"
            >
              Six things worth flexing.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/55">
            Numbers, finalist standings, and built artifacts — the stuff that
            survives a 30-second skim.
          </p>
        </motion.div>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, i) => {
            const Icon = item.icon;
            const tint = ACCENTS[item.accent];
            return (
              <motion.li
                key={item.label}
                className={`group relative overflow-hidden rounded-2xl border ${tint.ring} bg-white/[0.025] p-5 md:p-6 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/[0.045] hover:border-white/25`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                {/* hover halo */}
                <div
                  className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(420px circle at 30% 0%, rgba(255,255,255,0.06), transparent 65%)",
                  }}
                />

                <div className="flex items-start gap-4">
                  <span
                    className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${tint.ring} ${tint.chip} ${tint.text}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-base md:text-[17px] font-semibold leading-snug text-white">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                      {item.detail}
                    </p>
                  </div>
                </div>

                {/* subtle accent dot */}
                <span
                  className={`pointer-events-none absolute right-4 top-4 h-1.5 w-1.5 rounded-full ${tint.dot} opacity-50`}
                />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
