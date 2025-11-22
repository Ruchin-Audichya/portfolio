"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { achievements } from "@/data/achievements";

export function Achievements() {
    return (
        <section id="achievements" className="py-20 bg-gradient-surface">
            <div className="container mx-auto px-6 md:px-12 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="space-y-12"
                >
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-6xl font-display font-bold">
                            Achievements &<br />Certifications
                        </h2>
                        <p className="text-xl text-muted max-w-2xl mx-auto">
                            Milestones, credentials, and recognitions along the journey.
                        </p>
                    </div>

                    {/* Achievements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-surface/50 border border-white/5 p-8 hover:border-accent/50 transition-all duration-500 backdrop-blur-sm"
                            >
                                {/* Icon */}
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                                    {achievement.icon || <Award className="w-12 h-12 text-accent" />}
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-display font-bold group-hover:text-accent transition-colors">
                                        {achievement.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-muted">
                                        <span className="font-mono uppercase tracking-widest">
                                            {achievement.issuer}
                                        </span>
                                        <span>•</span>
                                        <span>{achievement.date}</span>
                                    </div>

                                    {achievement.description && (
                                        <p className="text-muted leading-relaxed">
                                            {achievement.description}
                                        </p>
                                    )}

                                    {achievement.credentialUrl && (
                                        <a
                                            href={achievement.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent hover:gap-3 transition-all mt-4"
                                        >
                                            View Credential
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                                {/* Hover Accent */}
                                <div className="absolute top-0 left-0 w-1 h-0 bg-accent group-hover:h-full transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
