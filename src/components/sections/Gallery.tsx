"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function Gallery() {
  // Placeholder images
  const images = [
    { src: "/gallery/event1.jpg", alt: "AWS Cloud Club Event" },
    { src: "/gallery/hackathon.jpg", alt: "Hackathon Participation" },
    { src: "/gallery/talk.jpg", alt: "Tech Talk" },
    { src: "/gallery/community.jpg", alt: "Community Meetup" },
  ]

  return (
    <section id="gallery" className="py-20">
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
              Gallery
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Highlights from events, hackathons, and community gatherings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.isArray(images) && images.map((img, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0 aspect-square relative bg-muted flex items-center justify-center text-muted-foreground">
                  {/* Replace with actual Image component when images are available */}
                  <span>{img.alt}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
