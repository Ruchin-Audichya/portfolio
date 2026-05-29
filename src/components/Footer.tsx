"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUp,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
} from "lucide-react";
import { content } from "@/lib/content";
import { Logo } from "@/components/Logo";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Work" },
  { href: "#achievements", label: "Credentials" },
  { href: "#contact", label: "Contact" },
];

const socials = [
  {
    label: "LinkedIn",
    href: content.profile.socials.linkedin,
    Icon: Linkedin,
    hover: "hover:text-[#0a66c2] hover:border-[#0a66c2]/40",
  },
  {
    label: "GitHub",
    href: content.profile.socials.github,
    Icon: Github,
    hover: "hover:text-white hover:border-white/30",
  },
  {
    label: "X / Twitter",
    href: content.profile.socials.twitter,
    Icon: Twitter,
    hover: "hover:text-white hover:border-white/30",
  },
  {
    label: "Instagram",
    href: content.profile.socials.instagram,
    Icon: Instagram,
    hover: "hover:text-[#e1306c] hover:border-[#e1306c]/40",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#070710]">
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-purple-500/[0.06] blur-[140px]" />
        <div className="absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/[0.05] blur-[140px]" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-6 md:px-12 pt-16 pb-10">
        {/* Top: identity + CTA */}
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-8 text-white" />
              <div>
                <p className="text-base font-bold text-white leading-tight">
                  {content.profile.name}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
                  {content.profile.role}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/55">
              Building retrieval-heavy AI systems and knowledge-graph pipelines.
              If something here resonates, the inbox is open.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={content.profile.contactLinks.email}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400 hover:text-black"
              >
                <Mail className="h-3.5 w-3.5" />
                {content.profile.email}
              </Link>
              <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/60">
                <MapPin className="h-3.5 w-3.5 text-white/40" />
                {content.profile.location}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="grid grid-cols-2 gap-6"
          >
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                Sitemap
              </p>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                Resources
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href={content.profile.contactLinks.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    Resume
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#guestbook"
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    Guestbook
                  </a>
                </li>
                <li>
                  <a
                    href={content.profile.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    Source code
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Socials */}
        <motion.div
          className="mt-12 flex flex-col items-start gap-5 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
              Find me on
            </span>
            <div className="flex flex-wrap gap-2">
              {socials.map(({ label, href, Icon, hover }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 backdrop-blur transition-all ${hover}`}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <a
            href="#world"
            aria-label="Back to top"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 backdrop-blur transition hover:border-cyan-400/40 hover:text-white"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* Tagline strip */}
        <div className="mt-10 hidden md:block">
          <p
            className="select-none whitespace-nowrap text-center font-black uppercase leading-none tracking-tight"
            style={{
              fontSize: "clamp(3rem, 12vw, 11rem)",
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
            aria-hidden="true"
          >
            Ruchin&nbsp;Audichya
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>
            © {year} Ruchin Audichya. Built with Next.js, Three.js, and a steady
            scroll.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
            Open to AI / ML &middot; Data &middot; Cloud roles
          </p>
        </div>
      </div>
    </footer>
  );
}
