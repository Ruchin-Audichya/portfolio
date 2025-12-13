"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function DayNightToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme which accounts for system preference fallback
  const isNight = mounted ? resolvedTheme === "dark" : true;

  const handleDayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    setTheme("light");
  };

  const handleNightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    setTheme("dark");
  };

  return (
    <div 
      className="flex items-center gap-1 rounded-full border border-white/10 bg-background/80 px-1.5 py-1 shadow-lg backdrop-blur-md"
      style={{ zIndex: 9999, position: 'relative' }}
    >
      <button
        type="button"
        aria-pressed={!isNight}
        onClick={handleDayClick}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 cursor-pointer select-none transition-all duration-200",
          "hover:bg-white/10 active:scale-95",
          !isNight 
            ? "bg-amber-400/20 text-amber-200 shadow-md" 
            : "text-white/60 hover:text-white/80"
        )}
      >
        <Sun className="h-4 w-4" />
        <span className="text-xs font-semibold">Day</span>
      </button>
      <button
        type="button"
        aria-pressed={isNight}
        onClick={handleNightClick}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 cursor-pointer select-none transition-all duration-200",
          "hover:bg-white/10 active:scale-95",
          isNight 
            ? "bg-indigo-500/30 text-indigo-200 shadow-md" 
            : "text-white/60 hover:text-white/80"
        )}
      >
        <Moon className="h-4 w-4" />
        <span className="text-xs font-semibold">Night</span>
      </button>
    </div>
  );
}
