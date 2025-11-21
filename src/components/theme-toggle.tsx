"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="fixed right-6 top-6 z-50 rounded-full bg-white/10 p-3 backdrop-blur-md border border-white/20 dark:bg-black/20 dark:border-white/10 shadow-lg"
                aria-label="Toggle theme"
            >
                <div className="h-5 w-5" />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="fixed right-6 top-6 z-50 rounded-full bg-white/10 p-3 backdrop-blur-md border border-white/20 dark:bg-black/20 dark:border-white/10 shadow-lg transition-all hover:scale-110 hover:shadow-purple-500/25 active:scale-95"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500 transition-transform rotate-0 scale-100" />
            ) : (
                <Moon className="h-5 w-5 text-purple-600 transition-transform rotate-0 scale-100" />
            )}
        </button>
    );
}
