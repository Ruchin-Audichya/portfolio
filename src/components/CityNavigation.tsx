"use client";

import { STOPS } from "@/data/stops";
import { motion } from "framer-motion";

interface CityNavigationProps {
    onStopClick: (id: string) => void;
}

export function CityNavigation({ onStopClick }: CityNavigationProps) {
    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-xl"
        >
            <span className="text-xs font-bold text-purple-400 mr-2 uppercase tracking-wider">Cloud City</span>

            <div className="h-4 w-px bg-white/20 mx-1" />

            <div className="flex items-center gap-1">
                {STOPS.map((stop) => (
                    <button
                        key={stop.id}
                        onClick={() => onStopClick(stop.id)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors group relative"
                        aria-label={stop.label}
                    >
                        <div className={`w-2 h-2 rounded-full ${stop.type === 'gate' ? 'bg-cyan-400' : 'bg-purple-500'} group-hover:scale-125 transition-transform`} />

                        {/* Tooltip */}
                        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] text-white bg-black/80 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {stop.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="h-4 w-px bg-white/20 mx-1" />

            <a
                href="mailto:ruchinaudichya09@gmail.com"
                className="text-xs font-medium text-white/70 hover:text-white transition-colors"
            >
                Contact
            </a>
        </motion.div>
    );
}
