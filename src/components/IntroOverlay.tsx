"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface IntroOverlayProps {
    onComplete: () => void;
}

export function IntroOverlay({ onComplete }: IntroOverlayProps) {
    const [step, setStep] = useState<"greeting" | "explore">("greeting");

    useEffect(() => {
        // Quick greeting, then show explore button
        const t1 = setTimeout(() => setStep("explore"), 600);
        return () => clearTimeout(t1);
    }, []);

    const handleExplore = () => {
        // Instant transition - Scene is already pre-loaded
        onComplete();
    };

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f]"
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
        >
            {/* Subtle background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="max-w-2xl px-6 text-center space-y-6 relative z-10">
                <AnimatePresence mode="wait">
                    {step === "greeting" && (
                        <motion.div
                            key="greeting"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-4"
                        >
                            <Sparkles className="w-8 h-8 mx-auto text-purple-400 animate-pulse" />
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                                Hello...
                            </h1>
                        </motion.div>
                    )}

                    {(step === "explore") && (
                        <motion.div
                            key="main"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                                I&apos;m{" "}
                                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                    Ruchin Audichya
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/60 font-medium">
                                Cloud Architect • Full-Stack Developer • Digital Craftsman
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {step === "explore" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="pt-6"
                        >
                            <button
                                onClick={handleExplore}
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-wider rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                            >
                                <span>Explore My World</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
