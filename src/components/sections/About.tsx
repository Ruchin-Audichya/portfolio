"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { profile } from "@/data/profile"
import { Card, CardContent } from "@/components/ui/card"

export function About() {
  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-12 items-center"
        >
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              About Me
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {profile.longBio}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground">{profile.location}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Education</h3>
                  <p className="text-muted-foreground">{profile.education.university}</p>
                  <p className="text-sm text-muted-foreground">{profile.education.degree}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-muted-foreground">AWS Cloud Club JECRC</p>
                  <p className="text-sm text-muted-foreground">Social/Content Head Leader</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <p className="text-muted-foreground">Cloud, AI, Business, Content</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
               <Image 
                 src="/profile.jpeg" 
                 alt="Ruchin Audichya" 
                 fill 
                 className="object-cover" 
               />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
