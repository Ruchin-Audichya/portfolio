"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 pointer-events-none">
            <Link href="/" className="pointer-events-auto hover:opacity-80 transition-opacity">
                <Logo className="w-10 h-10 text-foreground" />
            </Link>

            <div className="pointer-events-auto">
                <ThemeToggle />
            </div>
        </nav>
    );
}
