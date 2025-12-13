"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Send, User, MessageSquare, Sparkles, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GuestbookMessage = {
    name: string;
    role: string;
    message: string;
    date: string;
};

// Floating particle for success animation
function SuccessParticles() {
    const particles = Array.from({ length: 12 });
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        left: "50%",
                        top: "50%",
                        background: `hsl(${260 + i * 15}, 70%, 60%)`,
                    }}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((i / 12) * Math.PI * 2) * 100,
                        y: Math.sin((i / 12) * Math.PI * 2) * 100 - 50,
                    }}
                    transition={{
                        duration: 1,
                        ease: "easeOut",
                        delay: i * 0.03,
                    }}
                />
            ))}
        </div>
    );
}

// Floating lantern-style message card
function LanternMessage({ msg, index }: { msg: GuestbookMessage; index: number }) {
    const yOffset = useMotionValue(0);
    const springY = useSpring(yOffset, { stiffness: 100, damping: 20 });

    useEffect(() => {
        const interval = setInterval(() => {
            yOffset.set(Math.sin(Date.now() / 2000 + index) * 5);
        }, 50);
        return () => clearInterval(interval);
    }, [yOffset, index]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            style={{ y: springY }}
            whileHover={{ scale: 1.02, zIndex: 10 }}
            className="relative group"
        >
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-md hover:border-purple-500/40 transition-all duration-300">
                {/* Quote marks */}
                <span className="absolute top-4 left-4 text-4xl text-purple-500/20 font-serif leading-none">&ldquo;</span>
                
                <p className="text-lg leading-relaxed mb-4 text-white/90 pl-6 pr-4">
                    {msg.message}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                            {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-bold text-purple-300">{msg.name}</h4>
                            {msg.role && (
                                <p className="text-xs text-white/50">{msg.role}</p>
                            )}
                        </div>
                    </div>
                    <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded">
                        {msg.date}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export function Guestbook() {
    const [messages, setMessages] = useState<GuestbookMessage[]>([]);
    const [formData, setFormData] = useState({ name: "", role: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    // Load messages from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("guestbook-messages");
        if (stored) {
            try {
                setMessages(JSON.parse(stored));
            } catch {
                setMessages([]);
            }
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/guestbook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus("success");
                // Add message to local state and localStorage
                const newMessage: GuestbookMessage = {
                    ...formData,
                    date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
                };
                const updatedMessages = [newMessage, ...messages];
                setMessages(updatedMessages);
                localStorage.setItem("guestbook-messages", JSON.stringify(updatedMessages));
                setFormData({ name: "", role: "", message: "" });
                setTimeout(() => setStatus("idle"), 3000);
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 3000);
            }
        } catch (error) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    }

    return (
        <section id="guestbook" className="py-24 relative overflow-hidden">
            {/* Enhanced Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[150px]" />
            </div>

            {/* Floating ambient particles */}
            <div className="absolute inset-0 -z-5 pointer-events-none overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-purple-400/30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, 20, -20],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-4 mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4"
                    >
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="text-sm text-purple-300 font-medium">Community</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                        Guestbook
                    </h2>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        Leave a mark! Share your thoughts, feedback, or just say hello.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form Section - Enhanced */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Success particles overlay */}
                        <AnimatePresence>
                            {status === "success" && <SuccessParticles />}
                        </AnimatePresence>
                        
                        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl">
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-[40px] rounded-tr-3xl" />
                            
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Sign the Guestbook</h3>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2 text-white/70">
                                        <User className="w-4 h-4" />
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/[0.08] focus:outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2 text-white/70">
                                        <span>@</span>
                                        Role / Company (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/[0.08] focus:outline-none transition-all"
                                        placeholder="Software Engineer @ Tech"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2 text-white/70">
                                        <MessageSquare className="w-4 h-4" />
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 resize-none text-white placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/[0.08] focus:outline-none transition-all"
                                        placeholder="Write something nice..."
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 transition-all hover:shadow-xl hover:shadow-purple-500/30"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {status === "loading" ? (
                                            <motion.div
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                        ) : status === "success" ? (
                                            <>
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring" }}
                                                >
                                                    ✨
                                                </motion.span>
                                                Signed Successfully!
                                            </>
                                        ) : (
                                            <>
                                                Sign Guestbook <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Messages List - Enhanced with Lantern style */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar"
                    >
                        {messages.length === 0 ? (
                            <motion.div 
                                className="flex flex-col items-center justify-center py-20 text-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <motion.div 
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 border border-white/10"
                                    animate={{ y: [-5, 5, -5] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <MessageSquare className="w-10 h-10 text-purple-400/60" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-white/80 mb-2">No messages yet</h3>
                                <p className="text-white/40 max-w-xs">
                                    Be the first to sign the guestbook and leave your mark!
                                </p>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {messages.map((msg, i) => (
                                    <LanternMessage key={`${msg.name}-${i}`} msg={msg} index={i} />
                                ))}
                            </AnimatePresence>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
