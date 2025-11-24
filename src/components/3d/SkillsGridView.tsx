"use client";

import { content } from "@/lib/content";
import { skills as dataSkills } from "@/data/skills";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

export default function SkillsGridView() {
    const allSkillCategories = content.skills;
    const certs = dataSkills.certifications;

    return (
        <div className="space-y-8">
            {/* Certifications Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm"
            >
                <div className="flex items-center gap-3 mb-4">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-xl font-bold text-yellow-100">Certifications</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(certs) && certs.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 transition-all"
                        >
                            <p className="font-semibold text-yellow-100">{cert.name}</p>
                            <p className="text-sm text-yellow-200/70 mt-1">{cert.issuer}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Skills by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(allSkillCategories) && allSkillCategories.map((category, catIndex) => {
                    const colors = {
                        "Cloud & AWS": { bg: "from-blue-500/10 to-blue-600/10", border: "border-blue-500/30", text: "text-blue-100", dot: "bg-blue-500" },
                        "AI-Driven Dev": { bg: "from-purple-500/10 to-purple-600/10", border: "border-purple-500/30", text: "text-purple-100", dot: "bg-purple-500" },
                        "Frontend & Motion": { bg: "from-green-500/10 to-green-600/10", border: "border-green-500/30", text: "text-green-100", dot: "bg-green-500" },
                        "Automation": { bg: "from-orange-500/10 to-orange-600/10", border: "border-orange-500/30", text: "text-orange-100", dot: "bg-orange-500" },
                        "System & Linux": { bg: "from-teal-500/10 to-teal-600/10", border: "border-teal-500/30", text: "text-teal-100", dot: "bg-teal-500" }
                    };

                    const colorScheme = colors[category.category as keyof typeof colors] || colors["Cloud & AWS"];

                    return (
                        <motion.div
                            key={catIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: catIndex * 0.1 }}
                            className={`p-6 rounded-2xl border ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg} backdrop-blur-sm hover:scale-[1.02] transition-transform`}
                        >
                            <h3 className={`text-lg font-bold ${colorScheme.text} mb-4`}>
                                {category.category}
                            </h3>
                            <ul className="space-y-2">
                                {Array.isArray(category.items) && category.items.map((skill, skillIndex) => (
                                    <motion.li
                                        key={skillIndex}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (catIndex * 0.1) + (skillIndex * 0.05) }}
                                        className="flex items-center gap-3 group"
                                    >
                                        <span className={`w-2 h-2 rounded-full ${colorScheme.dot} group-hover:scale-125 transition-transform`} />
                                        <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                                            {skill}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    );
                })}
            </div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-8 pt-4"
            >
                <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">{certs.length}</p>
                    <p className="text-sm text-white/60">Certifications</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">
                        {allSkillCategories.reduce((acc, cat) => acc + cat.items.length, 0)}
                    </p>
                    <p className="text-sm text-white/60">Skills</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">{allSkillCategories.length}</p>
                    <p className="text-sm text-white/60">Categories</p>
                </div>
            </motion.div>
        </div>
    );
}
