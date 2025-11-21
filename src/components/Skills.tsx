"use client";

import { content } from "@/lib/content";
import { motion } from "framer-motion";

export default function Skills() {
    return (
        <section className="py-32 px-6 bg-surface/30">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-4xl font-display font-bold mb-4">Technical Focus</h2>
                    <div className="h-1 w-20 bg-accent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.skills.map((skillGroup, index) => (
                        <motion.div
                            key={skillGroup.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="p-6 border border-white/5 bg-background/50 hover:border-accent/30 transition-colors group"
                        >
                            <h3 className="text-xl font-display font-semibold mb-4 text-accent-teal group-hover:text-accent transition-colors">
                                {skillGroup.category}
                            </h3>
                            <ul className="space-y-2">
                                {skillGroup.items.map((item) => (
                                    <li key={item} className="flex items-center text-muted group-hover:text-primary transition-colors">
                                        <span className="w-1.5 h-1.5 bg-accent/50 rounded-full mr-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
