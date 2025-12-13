"use client";

import { motion } from "framer-motion";
import { KineticTypography } from "./KineticTypography";
import { TextReveal } from "./TextReveal";
import { MarqueeText } from "./MarqueeText";
import { VariableWeightText } from "./VariableWeightText";

export function HotTypeSection() {
  return (
    <div className="bg-[#0a0a0f] relative overflow-hidden">
      {/* Gradient transition from 3D world */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />

      {/* Main kinetic typography hero */}
      <KineticTypography />

      {/* Scrolling marquee - tech stack */}
      <MarqueeText
        text="AWS • NEXT.JS • TYPESCRIPT • SALESFORCE • DOCKER • POSTGRES • NODE.JS •"
        direction="right"
        speed={40}
        className="border-y border-white/5"
      />

      {/* Text reveal section - resume-based narrative */}
      <TextReveal
        text="PC enthusiast turned cloud architect. I build systems that scale — from AWS infrastructure to full-stack products. Performance-first, proof-of-work mindset."
        className="bg-gradient-to-b from-[#0a0a0f] via-purple-950/5 to-[#0a0a0f]"
      />

      {/* Featured expertise grid - based on actual resume skills */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[
              {
                title: "Cloud & DevOps",
                description: "AWS Cloud Practitioner certified. S3, EC2, DynamoDB, IAM, CI/CD pipelines.",
                icon: "☁️",
                gradient: "from-cyan-500 to-blue-600",
              },
              {
                title: "Full-Stack Dev",
                description: "Next.js 14, TypeScript, React, Node.js. End-to-end product development.",
                icon: "⚡",
                gradient: "from-purple-500 to-pink-600",
              },
              {
                title: "Salesforce & Automation",
                description: "Apex development, workflow automation, n8n integrations, API design.",
                icon: "🔧",
                gradient: "from-pink-500 to-orange-500",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300"
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h4 className={`text-xl font-bold mb-3 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                  {item.title}
                </h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Variable weight breathing text */}
      <VariableWeightText text="ENGINEER" />

      {/* Call to action */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to build something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              extraordinary
            </span>
            ?
          </h3>
          <p className="text-white/50 mb-8 max-w-2xl mx-auto">
            Let&apos;s collaborate on your next project. From concept to deployment, I bring ideas to life with clean code and creative solutions.
          </p>
          <motion.a
            href="#about"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-wider rounded-full hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 shadow-lg"
          >
            <span>Explore My Work</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.a>
        </motion.div>
      </section>

      {/* Final marquee */}
      <MarqueeText
        text="CODE • CREATE • SHIP • REPEAT •"
        direction="left"
        speed={25}
      />

      {/* Bottom gradient transition to content */}
      <div className="h-20 bg-gradient-to-b from-[#0a0a0f] to-[#0a0a0f]" />
    </div>
  );
}
