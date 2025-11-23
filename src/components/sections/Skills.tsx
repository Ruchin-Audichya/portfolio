"use client"

import { motion } from "framer-motion"
import { skills } from "@/data/skills"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillsGalaxy } from "@/components/3d/SkillsGalaxyWrapper"

export function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Certifications & Skills
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A showcase of my technical expertise and professional certifications.
            </p>
          </div>

          <div className="w-full">
            <SkillsGalaxy />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
