"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { content } from "@/lib/content"

const categoryColors: Record<string, string> = {
  "Cloud & AWS": "from-orange-500 to-amber-500",
  "Frontend & Motion": "from-purple-500 to-pink-500",
  "Backend & Data": "from-cyan-500 to-blue-500",
  "Salesforce": "from-blue-400 to-indigo-500",
  "DevOps & Tools": "from-emerald-500 to-teal-500",
  "AI & Automation": "from-pink-500 to-rose-500",
}

const categoryIcons: Record<string, string> = {
  "Cloud & AWS": "☁️",
  "Frontend & Motion": "⚡",
  "Backend & Data": "🗄️",
  "Salesforce": "💼",
  "DevOps & Tools": "🔧",
  "AI & Automation": "🤖",
}

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-8 h-[1px] bg-white/30" />
            <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-medium">
              What I Work With
            </span>
            <div className="w-8 h-[1px] bg-white/30" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Skills &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
              Tools
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-white/50 text-lg">
            Not just a list — these are tools I&apos;ve actually shipped with.
          </p>
        </motion.div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {content.skills.map((category, i) => {
            const gradient = categoryColors[category.category] || "from-gray-500 to-gray-600"
            const icon = categoryIcons[category.category] || "📦"
            const isActive = activeCategory === category.category

            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onClick={() => setActiveCategory(isActive ? null : category.category)}
                className="group cursor-pointer"
              >
                <motion.div
                  className={`relative p-6 md:p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden ${isActive
                    ? "bg-white/[0.08] border-white/20"
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/15"
                    }`}
                  whileHover={{ y: -4 }}
                  layout
                >
                  {/* Gradient glow on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} transition-opacity duration-500 ${isActive ? "opacity-[0.08]" : "opacity-0 group-hover:opacity-[0.04]"
                      }`}
                  />

                  {/* Header */}
                  <div className="relative flex items-center gap-3 mb-4">
                    <span className="text-2xl">{icon}</span>
                    <h3
                      className={`text-lg font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                    >
                      {category.category}
                    </h3>
                    <motion.div
                      className="ml-auto text-white/30 text-sm"
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      +
                    </motion.div>
                  </div>

                  {/* Skill chips - always visible preview */}
                  <div className="relative flex flex-wrap gap-2">
                    {category.items.slice(0, isActive ? category.items.length : 3).map((skill, j) => (
                      <motion.span
                        key={skill}
                        initial={isActive ? { opacity: 0, scale: 0.8 } : false}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: j * 0.03 }}
                        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all duration-200 ${isActive
                          ? "bg-white/10 text-white/80 border border-white/15"
                          : "bg-white/[0.04] text-white/50 border border-white/[0.06]"
                          }`}
                      >
                        {skill}
                      </motion.span>
                    ))}
                    {!isActive && category.items.length > 3 && (
                      <span className="px-3 py-1.5 text-xs font-mono text-white/30">
                        +{category.items.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isActive && category.items.length > 3 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats bar */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { value: "2x", label: "AWS Certified", color: "text-orange-400" },
            { value: "1x", label: "Salesforce Certified", color: "text-blue-400" },
            { value: "6+", label: "Projects Shipped", color: "text-purple-400" },
            { value: "24/7", label: "Building Mode", color: "text-pink-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center group cursor-default"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span
                className={`block text-4xl md:text-5xl font-black ${stat.color} group-hover:scale-110 transition-transform duration-200`}
              >
                {stat.value}
              </span>
              <span className="text-white/40 text-xs uppercase tracking-[0.15em] mt-1 block">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
