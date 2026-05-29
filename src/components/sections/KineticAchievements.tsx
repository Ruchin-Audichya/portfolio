"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { content } from "@/lib/content";

type Brand = "aws" | "servicenow";

interface Cert {
  title: string;
  issuer: string;
  year?: string;
  description?: string;
  credentialUrl?: string | null;
  image?: string;
  brand?: Brand;
}

const BRAND_TINT: Record<Brand, { glow: string; ring: string; chip: string; chipText: string }> = {
  aws: {
    glow: "from-amber-500/25 via-orange-500/15 to-yellow-400/10",
    ring: "border-amber-300/30",
    chip: "bg-amber-300/10 border-amber-300/30",
    chipText: "text-amber-200",
  },
  servicenow: {
    glow: "from-emerald-400/25 via-teal-500/15 to-emerald-300/10",
    ring: "border-emerald-300/30",
    chip: "bg-emerald-300/10 border-emerald-300/30",
    chipText: "text-emerald-200",
  },
};

function CredentialCard({ cert, index }: { cert: Cert; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center", "end start"],
  });

  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.9, 0]);
  const springGlow = useSpring(glow, { stiffness: 100, damping: 30 });

  const tint = BRAND_TINT[cert.brand ?? "aws"];
  const verifiable = Boolean(cert.credentialUrl);

  // The whole card is the verification trigger when a URL exists; otherwise it's a static panel.
  const Wrapper: any = verifiable ? motion.a : motion.div;
  const wrapperProps = verifiable
    ? {
        href: cert.credentialUrl as string,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `Verify ${cert.title} credential`,
      }
    : {};

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Ambient brand glow */}
      <motion.div
        className={`pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br ${tint.glow} blur-2xl`}
        style={{ opacity: springGlow }}
      />

      <Wrapper
        {...wrapperProps}
        className={`relative block overflow-hidden rounded-2xl border ${tint.ring} bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-md transition-all duration-300 ${
          verifiable ? "cursor-pointer hover:border-white/30 hover:bg-white/[0.05]" : ""
        }`}
      >
        {/* Certificate image (top portion) */}
        {cert.image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0d0d14]">
            <Image
              src={cert.image}
              alt={`${cert.title} certificate`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              onError={(e) => {
                // Hide the image gracefully if the file isn't there yet so the card still looks clean.
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {/* gradient fade into the card body */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0a0a0f]" />
            {/* verify pill */}
            {verifiable && (
              <div
                className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border ${tint.ring} ${tint.chip} ${tint.chipText} px-3 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur transition group-hover:bg-white/15`}
              >
                <ShieldCheck className="h-3 w-3" />
                Verified
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="relative p-6 md:p-7">
          <div className="mb-3 flex items-center gap-3">
            <span className={`rounded-full border ${tint.ring} ${tint.chip} ${tint.chipText} px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider`}>
              {cert.year}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              {cert.issuer}
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
            {cert.title}
          </h3>

          {cert.description && (
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {cert.description}
            </p>
          )}

          {verifiable && (
            <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 group-hover:text-white transition-colors">
              <span className="border-b border-transparent group-hover:border-white/40 transition-colors">
                Verify on Credly
              </span>
              <ExternalLink className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          )}
        </div>
      </Wrapper>
    </motion.div>
  );
}

export function KineticAchievements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const certs = content.certifications;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [60, 0]),
    { stiffness: 100, damping: 30 }
  );

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="relative py-32 bg-[#0a0a0f]"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[820px] rounded-full bg-amber-500/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-6xl relative">
        <motion.div className="text-center mb-16" style={{ y: titleY }}>
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-8 h-[1px] bg-white/30" />
            <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-medium">
              Credentials
            </span>
            <div className="w-8 h-[1px] bg-white/30" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-bold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-emerald-200">
              Certifications
            </span>
          </motion.h2>

          <motion.p
            className="text-lg text-white/45 mt-4 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Issued by AWS and ServiceNow. Tap any verifiable card to confirm on the issuer&apos;s site.
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {certs.map((cert, index) => (
            <CredentialCard key={cert.title} cert={cert as Cert} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
