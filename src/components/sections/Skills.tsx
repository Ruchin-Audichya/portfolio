"use client"

import { motion } from "framer-motion"
import { content } from "@/lib/content"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillsGalaxy } from "@/components/3d/SkillsGalaxyWrapper"
import { useSkillStore } from "@/lib/skill-store"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function Skills() {
  const selectedSkillId = useSkillStore((state) => state.selectedSkill);
  const setSelectedSkillId = useSkillStore((state) => state.setSelectedSkill);

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

          <div className="w-full space-y-8">
            {/* Search and Filter */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search skills (e.g. React, AWS, Python)..."
                className="pl-10 bg-white/5 border-white/10"
                onChange={(e) => useSkillStore.getState().setSearchQuery(e.target.value)}
              />
            </div>

            <SkillsGalaxy />

            {/* 2D Skill List (Synced) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {content.skills.map((category) => (
                <Card key={category.category} className="bg-black/20 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-purple-300">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {category.items.map((skill) => {
                      const isSelected = selectedSkillId === skill;
                      return (
                        <Badge
                          key={skill}
                          variant={isSelected ? "default" : "secondary"}
                          className={`cursor-pointer transition-all hover:scale-105 ${isSelected ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-white/20"}`}
                          onClick={() => setSelectedSkillId(skill)}
                        >
                          {skill}
                        </Badge>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
