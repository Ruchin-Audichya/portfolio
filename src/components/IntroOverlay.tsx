"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface IntroOverlayProps {
    onComplete: () => void;
}

export function IntroOverlay({ onComplete }: IntroOverlayProps) {
    const [step, setStep] = useState<"greeting" | "bio" | "explore" | "loading">("greeting");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setStep("bio"), 1500);
        const t2 = setTimeout(() => setStep("explore"), 3500);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    const handleExplore = () => {
        setStep("loading");
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 20);
    };

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground"
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
        >
            <div className="max-w-2xl px-6 text-center space-y-8">
                <AnimatePresence mode="wait">
                    {step === "greeting" && (
                        <motion.h1
                            key="greeting"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-4xl md:text-6xl font-black tracking-tighter"
                        >
                            Hello...
                        </motion.h1>
                    )}

                    {(step === "bio" || step === "explore" || step === "loading") && (
                        <motion.div
                            key="bio"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                                I&apos;m <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">Ruchin Audichya</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground font-mono">
                                Cloud Architect. AI Engineer. Digital Craftsman.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {step === "explore" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="pt-8"
                        >
                            <button
                                onClick={handleExplore}
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-mono font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors rounded-sm"
                            >
                                <span>Explore My World</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === "loading" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-xs mx-auto pt-8"
                        >
                            <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2 text-muted-foreground">
                                <span>Initializing</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                                <motion.div
                                    className="h-full bg-accent"
                                    style={{ width: `${progress}%` }}
                                    transition={{ ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
