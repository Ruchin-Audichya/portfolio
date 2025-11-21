"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { profile } from "@/data/profile"
import { Card, CardContent } from "@/components/ui/card"

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl -z-10" />
      <div className="absolute right-10 bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-16 items-center"
        >
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-semibold text-purple-600 dark:text-purple-300">
                About Me
              </div>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                My Journey
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {profile.longBio}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="glass-panel border-0 hover-bounce">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 text-primary">Location</h3>
                  <p className="text-muted-foreground font-medium">{profile.location}</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-0 hover-bounce">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 text-primary">Education</h3>
                  <p className="text-muted-foreground font-medium">{profile.education.university}</p>
                  <p className="text-sm text-muted-foreground/80">{profile.education.degree}</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-0 hover-bounce">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 text-primary">Community</h3>
                  <p className="text-muted-foreground font-medium">AWS Cloud Club JECRC</p>
                  <p className="text-sm text-muted-foreground/80">Social/Content Head Leader</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-0 hover-bounce">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 text-primary">Interests</h3>
                  <p className="text-muted-foreground font-medium">Cloud, AI, Business, Content</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl ring-1 ring-white/30 hover:scale-105 transition-transform duration-500">
              <Image
                src="/profile.jpeg"
                alt="Ruchin Audichya"
                fill
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
