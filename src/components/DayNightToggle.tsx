"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DayNightToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isNight = mounted ? resolvedTheme === "dark" : false;

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-background/80 px-2 py-1 shadow-lg backdrop-blur-md">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        aria-pressed={!isNight}
        onClick={() => setTheme("light")}
        className={cn(
          "flex items-center gap-2 rounded-full px-3",
          !isNight && "bg-white/10 text-foreground shadow"
        )}
      >
        <Sun className="h-4 w-4" />
        <span className="text-xs font-semibold">Day</span>
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        aria-pressed={isNight}
        onClick={() => setTheme("dark")}
        className={cn(
          "flex items-center gap-2 rounded-full px-3",
          isNight && "bg-primary text-primary-foreground shadow"
        )}
      >
        <Moon className="h-4 w-4" />
        <span className="text-xs font-semibold">Night</span>
      </Button>
    </div>
  );
}
