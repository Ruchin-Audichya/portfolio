"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Github, Mail, Phone, ShieldCheck } from "lucide-react";
import { content } from "@/lib/content";

export function RecruiterSnapshot() {
  const { recruiterSnapshot, profile } = content;

  return (
    <section id="hire" className="relative overflow-hidden bg-[#0a0a0f] py-24 md:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-6 md:px-12">
        <motion.div
          className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-3">
              <div className="h-px w-8 bg-cyan-400/60" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                Recruiter Snapshot
              </span>
            </div>
            <h2 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">
              The short version: I ship retrieval-heavy AI with backend and cloud discipline.
            </h2>
          </div>

          <Link
            href={profile.contactLinks.email}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cyan-400/70 px-6 py-3 text-sm font-bold uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400 hover:text-black"
          >
            Hire Me <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <BriefcaseBusiness className="mb-5 h-7 w-7 text-cyan-300" />
            <h3 className="mb-4 text-xl font-bold text-white">Role Fit</h3>
            <div className="flex flex-wrap gap-2">
              {recruiterSnapshot.roleFit.map((role) => (
                <span key={role} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/70">
                  {role}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur md:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <ShieldCheck className="mb-5 h-7 w-7 text-emerald-300" />
            <h3 className="mb-4 text-xl font-bold text-white">Proof Points</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {recruiterSnapshot.proofPoints.map((point) => (
                <div key={point} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-white/70">
                  {point}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1.4fr_1fr]">
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <h3 className="mb-4 text-xl font-bold text-white">What I bring</h3>
            <div className="grid gap-3">
              {recruiterSnapshot.strengths.map((strength) => (
                <p key={strength} className="border-l border-cyan-400/50 pl-4 text-white/65">
                  {strength}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.045] p-6 backdrop-blur"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <h3 className="mb-4 text-xl font-bold text-white">Quick contact</h3>
            <div className="grid gap-3">
              <Link href={profile.contactLinks.email} className="inline-flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white">
                <Mail className="h-4 w-4 text-cyan-300" /> {profile.email}
              </Link>
              <Link href={profile.contactLinks.phone} className="inline-flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white">
                <Phone className="h-4 w-4 text-cyan-300" /> {profile.phone}
              </Link>
              <Link href={profile.contactLinks.github} target="_blank" className="inline-flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white">
                <Github className="h-4 w-4 text-cyan-300" /> GitHub
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
