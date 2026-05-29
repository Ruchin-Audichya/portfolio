"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { content } from "@/lib/content";

type Brand = "aws" | "servicenow";

interface Cert {
  title: string;
  issuer: string;
  year?: string;
  description?: string;
  credentialUrl?: string | null;
  image?: string | null;
  brand?: Brand;
}

const BRAND: Record<
  Brand,
  {
    glow: string;
    ring: string;
    chip: string;
    chipText: string;
    accentText: string;
    haloFrom: string;
    haloVia: string;
  }
> = {
  aws: {
    glow: "from-amber-500/30 via-orange-500/15 to-yellow-400/5",
    ring: "border-amber-300/30",
    chip: "bg-amber-300/10 border-amber-300/30",
    chipText: "text-amber-200",
    accentText: "text-amber-200",
    haloFrom: "rgba(251, 191, 36, 0.35)",
    haloVia: "rgba(249, 115, 22, 0.18)",
  },
  servicenow: {
    glow: "from-emerald-400/30 via-teal-500/15 to-emerald-300/5",
    ring: "border-emerald-300/30",
    chip: "bg-emerald-300/10 border-emerald-300/30",
    chipText: "text-emerald-200",
    accentText: "text-emerald-200",
    haloFrom: "rgba(74, 222, 128, 0.32)",
    haloVia: "rgba(20, 184, 166, 0.18)",
  },
};

function BadgeMedallion({ cert, index }: { cert: Cert; index: number }) {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center", "end start"],
  });

  const haloOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.85, 0]);
  const springHalo = useSpring(haloOpacity, { stiffness: 100, damping: 30 });

  const tint = BRAND[cert.brand ?? "aws"];
  const verifiable = Boolean(cert.credentialUrl);

  const Wrapper: any = verifiable ? motion.a : motion.div;
  const wrapperProps = verifiable
    ? {
        href: cert.credentialUrl as string,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `Verify ${cert.title} on Credly`,
      }
    : {};

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Ambient brand halo behind the entire card */}
      <motion.div
        className={`pointer-events-none absolute -inset-3 rounded-[28px] bg-gradient-to-br ${tint.glow} blur-2xl`}
        style={{ opacity: springHalo }}
      />

      <Wrapper
        {...wrapperProps}
        className={`relative block h-full overflow-hidden rounded-3xl border ${tint.ring} bg-gradient-to-br from-white/[0.05] to-white/[0.015] backdrop-blur-md transition-all duration-300 ${
          verifiable ? "cursor-pointer hover:border-white/30 hover:bg-white/[0.05]" : ""
        }`}
      >
        {/* Top: badge stage */}
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden">
          {/* Concentric brand glow rings behind the badge */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${tint.haloFrom} 0%, ${tint.haloVia} 35%, transparent 70%)`,
            }}
          />

          {/* Decorative orbit ring */}
          {!reduceMotion && (
            <motion.div
              className={`absolute h-[78%] w-[78%] rounded-full border ${tint.ring}`}
              style={{ borderStyle: "dashed", opacity: 0.35 }}
              animate={hovered ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 18, ease: "linear", repeat: hovered ? Infinity : 0 }}
            />
          )}

          {/* Subtle inner ring */}
          <div className={`absolute h-[60%] w-[60%] rounded-full border ${tint.ring} opacity-25`} />

          {/* Verified pill */}
          {verifiable && (
            <div
              className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border ${tint.ring} ${tint.chip} ${tint.chipText} px-3 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur transition group-hover:bg-white/15`}
            >
              <ShieldCheck className="h-3 w-3" />
              Verified
            </div>
          )}

          {/* Year chip */}
          {cert.year && (
            <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/70 backdrop-blur">
              {cert.year}
            </div>
          )}

          {/* Badge image */}
          {cert.image ? (
            <motion.div
              className="relative h-[78%] w-[78%]"
              initial={false}
              animate={
                reduceMotion
                  ? { scale: 1.25, y: 0 }
                  : hovered
                  ? { scale: 1.32, y: -4 }
                  : { scale: 1.25, y: 0 }
              }
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <Image
                src={cert.image}
                alt={`${cert.title} badge`}
                fill
                sizes="(max-width: 768px) 70vw, 320px"
                className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.55)]"
                onError={(e) => {
                  // Fail gracefully if the file isn't there yet.
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </motion.div>
          ) : (
            // Placeholder mark when no badge image is available yet (e.g. CAD)
            <div
              className={`relative flex h-[40%] w-[40%] items-center justify-center rounded-2xl border ${tint.ring} bg-black/30 font-mono text-2xl font-black ${tint.accentText}`}
            >
              {cert.brand === "aws" ? "AWS" : "SN"}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="relative px-6 pb-6 pt-5 md:px-7 md:pb-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
            {cert.issuer}
          </p>
          <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
            {cert.title}
          </h3>

          {cert.description && (
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              {cert.description}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between">
            {verifiable ? (
              <span
                className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 transition-colors group-hover:text-white`}
              >
                <span className="border-b border-transparent transition-colors group-hover:border-white/40">
                  Verify on Credly
                </span>
                <ExternalLink className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                Credential on file
              </span>
            )}

            <span className={`font-mono text-[10px] uppercase tracking-wider ${tint.chipText} opacity-70`}>
              {cert.brand === "aws" ? "AWS" : "ServiceNow"}
            </span>
          </div>
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[460px] w-[860px] rounded-full bg-amber-500/[0.06] blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-emerald-500/[0.05] blur-[120px]" />
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
              Verified Credentials
            </span>
          </motion.h2>

          <motion.p
            className="text-lg text-white/45 mt-4 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Issued by AWS and ServiceNow. Tap any badge to verify it on Credly.
          </motion.p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {certs.map((cert, index) => (
            <BadgeMedallion key={cert.title} cert={cert as Cert} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
