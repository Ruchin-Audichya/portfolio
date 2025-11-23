"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, MessageSquare, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Initial "Starter" messages to populate the guestbook
const initialMessages = [
    {
        name: "Amit Sharma",
        role: "Cloud Architect",
        message: "Ruchin's work on the AWS Cloud Club was inspiring. A true community builder!",
        date: "Oct 2023"
    },
    {
        name: "Sarah Jenkins",
        role: "Product Manager",
        message: "The attention to detail in this portfolio is outstanding. Love the 3D elements!",
        date: "Nov 2023"
    }
];

export function Guestbook() {
    const [messages, setMessages] = useState(initialMessages);
    const [formData, setFormData] = useState({ name: "", role: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
                // Optimistically add the message to the list (temporary)
                setMessages([
                    { ...formData, date: "Just now" },
                    ...messages
                ]);
                setFormData({ name: "", role: "", message: "" });
                setTimeout(() => setStatus("idle"), 3000);
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    }

    return (
        <section id="guestbook" className="py-20 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-6 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-4 mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-display font-bold">
                        Guestbook
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Leave a mark! Share your thoughts, feedback, or just say hello.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="glass-panel border-0 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <Sparkles className="w-6 h-6 text-accent" />
                                    Sign the Guestbook
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <span className="text-muted-foreground">@</span>
                                            Role / Company (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                                            placeholder="Software Engineer @ Tech"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                            Message
                                        </label>
                                        <textarea
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 h-32 resize-none focus:border-accent focus:outline-none transition-colors"
                                            placeholder="Write something nice..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full gap-2 text-lg font-bold py-6"
                                    >
                                        {status === "loading" ? (
                                            "Signing..."
                                        ) : status === "success" ? (
                                            "Signed Successfully!"
                                        ) : (
                                            <>
                                                Sign Guestbook <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Messages List */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                    >
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="p-6 rounded-2xl bg-surface/30 border border-white/5 backdrop-blur-sm hover:border-accent/30 transition-colors">
                                    <p className="text-lg leading-relaxed mb-4 text-foreground/90">
                                        &quot;{msg.message}&quot;
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-accent">{msg.name}</h4>
                                            {msg.role && (
                                                <p className="text-sm text-muted-foreground">{msg.role}</p>
                                            )}
                                        </div>
                                        <span className="text-xs font-mono text-muted-foreground/60 bg-white/5 px-2 py-1 rounded">
                                            {msg.date}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
