"use client";

import { motion } from "framer-motion";
import { Trophy, Sparkles, Code2 } from "lucide-react";
import { content } from "@/lib/content";

const ICONS = [Trophy, Sparkles, Code2];

export function Recognition() {
  const items = content.recognition;

  return (
    <section id="recognition" className="relative py-24 md:py-32 bg-[#0a0a0f]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[140px]" />
      </div>

      <div className="container relative mx-auto max-w-5xl px-6 md:px-12">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5 inline-flex items-center gap-3">
            <div className="h-px w-8 bg-amber-300/60" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-200/80">
              Recognition
            </span>
            <div className="h-px w-8 bg-amber-300/60" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-200 to-pink-200">
              Where the work showed up.
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.article
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7 backdrop-blur-sm"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(600px circle at 50% 0%, rgba(251, 191, 36, 0.08), transparent 60%)",
                  }}
                />
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-200">
                  <Icon className="h-3.5 w-3.5" />
                  {item.year}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 mb-4">
                  {item.issuer}
                </p>
                <p className="text-sm leading-relaxed text-white/65">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
