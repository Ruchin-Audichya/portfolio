"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { Github, Linkedin, Twitter, Mail, ArrowRight, Instagram } from "lucide-react";
import Magnetic from "./Magnetic";

export default function Contact() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) setStatus("success");
            else setStatus("error");
        } catch (err) {
            setStatus("error");
        }
    }

    return (
        <section className="min-h-screen flex items-center px-6 py-24 bg-gradient-surface relative overflow-hidden">
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

                {/* Left: Info */}
                <div className="space-y-12">
                    <div>
                        <h2 className="text-6xl md:text-8xl font-display font-bold mb-6">
                            Let&apos;s<br />Build.
                        </h2>
                        <p className="text-xl text-muted">
                            Open for select collaborations and engineering challenges.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <a href={`mailto:${content.profile.socials.email}`} className="flex items-center gap-4 text-2xl hover:text-accent transition-colors group">
                            <Mail className="w-6 h-6 text-accent" />
                            <span className="border-b border-transparent group-hover:border-accent transition-colors">
                                {content.profile.socials.email}
                            </span>
                        </a>
                    </div>

                    <div className="flex gap-6">
                        <SocialLink href={content.profile.socials.github} icon={<Github />} label="GitHub" />
                        <SocialLink href={content.profile.socials.linkedin} icon={<Linkedin />} label="LinkedIn" />
                        <SocialLink href={content.profile.socials.instagram} icon={<Instagram />} label="Instagram" />
                        <SocialLink href={content.profile.socials.twitter} icon={<Twitter />} label="Twitter" />
                    </div>
                </div>

                {/* Right: Form */}
                <div className="bg-surface/50 p-8 md:p-12 border border-white/5 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-mono uppercase tracking-widest text-muted">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                className="w-full bg-transparent border-b border-white/20 py-4 focus:border-accent focus:outline-none transition-colors text-lg"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-mono uppercase tracking-widest text-muted">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                className="w-full bg-transparent border-b border-white/20 py-4 focus:border-accent focus:outline-none transition-colors text-lg"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-mono uppercase tracking-widest text-muted">Message</label>
                            <textarea
                                name="message"
                                id="message"
                                required
                                rows={4}
                                className="w-full bg-transparent border-b border-white/20 py-4 focus:border-accent focus:outline-none transition-colors text-lg resize-none"
                                placeholder="Tell me about your project"
                            />
                        </div>

                        <Magnetic>
                            <button
                                type="submit"
                                disabled={status === "loading" || status === "success"}
                                className="group flex items-center gap-4 text-xl font-bold uppercase tracking-widest hover:text-accent transition-colors disabled:opacity-50"
                            >
                                {status === "loading" ? "Transmitting..." : status === "success" ? "Signal Received" : "Transmit Signal"}
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </Magnetic>

                        {status === "success" && (
                            <p className="text-accent-teal font-mono text-sm">Message received. I will respond shortly.</p>
                        )}
                        {status === "error" && (
                            <p className="text-accent-crimson font-mono text-sm">Transmission failed. Please try again.</p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white/5 hover:border-accent hover:text-accent transition-all"
            aria-label={label}
        >
            {icon}
        </a>
    );
}
