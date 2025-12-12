"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 pointer-events-none">
            <div className="pointer-events-auto backdrop-blur-md bg-background/30 border border-white/10 rounded-full px-4 py-2 flex items-center gap-6 shadow-lg">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo className="w-8 h-8 text-foreground" />
                </Link>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
                    <Link href="#projects" className="hover:text-foreground transition-colors">Work</Link>
                    <Link href="#skills" className="hover:text-foreground transition-colors">Skills</Link>
                    <Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link>
                </div>
            </div>

            <div className="pointer-events-auto flex items-center gap-4">
                <a
                    href="/resume.pdf"
                    target="_blank"
                    className="hidden md:block px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white text-black rounded-full hover:bg-white/90 transition-colors"
                >
                    Resume
                </a>
            </div>
        </nav>
    );
}
