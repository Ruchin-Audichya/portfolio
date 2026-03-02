"use client";

import { motion } from "framer-motion";

interface LogoProps {
    className?: string;
    animated?: boolean;
    showGlow?: boolean;
}

// Main animated logo component with the custom R mark
export function Logo({ className = "w-8 h-8", animated = false, showGlow = false }: LogoProps) {
    return (
        <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="Ruchin Audichya logo"
        >
            <defs>
                {showGlow && (
                    <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                )}
                <linearGradient id="r-grad" x1="65" y1="35" x2="145" y2="150">
                    <stop offset="0%" stopColor="#fffbf9" />
                    <stop offset="30%" stopColor="#ffbc68" />
                    <stop offset="60%" stopColor="#ff5600" />
                    <stop offset="100%" stopColor="#cc00ff" />
                </linearGradient>
            </defs>

            {/* Background rounded rectangle */}
            <rect x="20" y="20" width="160" height="160" rx="32" fill="#0A0A0A" />

            {/* R Mark - Cyan accent stroke */}
            {animated ? (
                <motion.path
                    d="M65 150 L65 50 Q65 35 80 35 L110 35 Q145 35 145 70 Q145 100 110 100 L95 100 L140 150"
                    fill="none"
                    stroke="url(#r-grad)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={showGlow ? "url(#logo-glow)" : undefined}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            ) : (
                <path
                    d="M65 150 L65 50 Q65 35 80 35 L110 35 Q145 35 145 70 Q145 100 110 100 L95 100 L140 150"
                    fill="none"
                    stroke="url(#r-grad)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={showGlow ? "url(#logo-glow)" : undefined}
                />
            )}

            {/* White stem accent */}
            <path
                d="M65 85 L65 50"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.8"
            />
        </svg>
    );
}

// Monochrome version for light/dark theme contexts
export function LogoMonochrome({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="Ruchin Audichya logo"
        >
            <rect x="20" y="20" width="160" height="160" rx="32" className="fill-foreground/10" />
            <path
                d="M65 150 L65 50 Q65 35 80 35 L110 35 Q145 35 145 70 Q145 100 110 100 L95 100 L140 150"
                fill="none"
                className="stroke-foreground"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// Icon-only version (just the R, no background)
export function LogoIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 120 130"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="Ruchin Audichya"
        >
            <path
                d="M10 120 L10 20 Q10 5 25 5 L55 5 Q90 5 90 40 Q90 70 55 70 L40 70 L85 120"
                fill="none"
                stroke="#ff5600"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10 55 L10 20"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.8"
            />
        </svg>
    );
}
