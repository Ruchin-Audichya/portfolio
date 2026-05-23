"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Menu, X } from "lucide-react";

const navLinks = [
    { href: "#hire", label: "Hire" },
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Work" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
];

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuId = useId();
    const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
    const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

    // Track scroll for navbar background
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMobileMenuOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // Focus the first link for keyboard users.
        window.setTimeout(() => firstLinkRef.current?.focus(), 0);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (!isMobileMenuOpen) toggleButtonRef.current?.focus();
    }, [isMobileMenuOpen]);

    return (
        <nav
            aria-label="Primary"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between pointer-events-none">
                {/* Left: Logo + Nav Links */}
                <div className={`pointer-events-auto backdrop-blur-xl border border-white/10 rounded-full px-3 py-2 flex items-center gap-4 shadow-lg transition-all duration-300 ${scrolled ? "bg-black/80" : "bg-black/40"
                    }`}>
                    <Link href="/" aria-label="Home" className="hover:opacity-80 transition-opacity p-1">
                        <Logo className="w-7 h-7 text-white" />
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile nav toggle */}
                    <button
                        ref={toggleButtonRef}
                        type="button"
                        className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls={menuId}
                        onClick={() => setIsMobileMenuOpen((v) => !v)}
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                    </button>
                </div>

                {/* Right: Resume Button */}
                <div className="pointer-events-auto">
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        className={`hidden md:inline-flex px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${scrolled
                                ? "bg-white text-black hover:bg-white/90"
                                : "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-xl"
                            }`}
                    >
                        Resume
                    </a>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden pointer-events-auto">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <div
                        id={menuId}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site navigation"
                        className="absolute left-4 right-4 top-20 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="p-4">
                            <div className="grid gap-1">
                                <a
                                    ref={firstLinkRef}
                                    href="#world"
                                    className="rounded-xl px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
                                </a>
                                {navLinks.map((link, i) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="rounded-xl px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-all"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ))}

                                <div className="h-px bg-white/10 my-2" />

                                <a
                                    href="/resume.pdf"
                                    target="_blank"
                                    className="rounded-xl bg-white px-4 py-3 text-base font-bold uppercase tracking-wider text-black hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-all text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Resume
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
