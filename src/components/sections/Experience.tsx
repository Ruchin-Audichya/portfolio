"use client";

import { motion } from "framer-motion";
import { content } from "@/lib/content";

const starLabels = [
  ["situation", "Situation"],
  ["task", "Task"],
  ["action", "Action"],
  ["result", "Result"]
] as const;

export function Experience() {
  return (
    <section id="experience" className="relative bg-[#0a0a0f] py-24 md:py-32">
      <div className="absolute inset-y-0 left-6 hidden w-px bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent md:block" />
      <div className="container mx-auto max-w-6xl px-6 md:px-12">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-3">
            <div className="h-px w-8 bg-white/30" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
              Experience
            </span>
            <div className="h-px w-8 bg-white/30" />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Work explained like outcomes, not buzzwords.
          </h2>
        </motion.div>

        <div className="space-y-10">
          {content.experience.map((item, index) => (
            <motion.article
              key={`${item.company}-${item.role}`}
              className="relative rounded-2xl border border-white/10 bg-[#17172a]/90 p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-10"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <div className="absolute -left-[58px] top-8 hidden h-5 w-5 rounded-full border-4 border-[#0a0a0f] bg-cyan-400 md:block" />
              <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="mb-4 inline-flex rounded-full bg-purple-500/20 px-4 py-2 font-mono text-sm font-bold text-purple-200">
                    {item.period}
                  </span>
                  <h3 className="text-2xl font-black text-white md:text-3xl">{item.role}</h3>
                  <p className="mt-2 text-lg font-bold text-cyan-300">{item.company}</p>
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-white/55 md:text-right">
                  {item.summary}
                </p>
              </div>

              <div className="rounded-2xl border-l-2 border-cyan-400 bg-cyan-950/30 p-5 md:p-7">
                <div className="grid gap-5">
                  {starLabels.map(([key, label]) => (
                    <div key={key}>
                      <h4 className="mb-2 font-mono text-sm font-black uppercase tracking-[0.14em] text-cyan-300">
                        {label}
                      </h4>
                      <p className={key === "result" ? "font-bold leading-relaxed text-emerald-300" : "leading-relaxed text-white/65"}>
                        {item.star[key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
