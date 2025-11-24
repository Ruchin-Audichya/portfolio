"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { testimonials } from "@/data/testimonials"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-secondary/30">
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
              What People Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Feedback from peers, mentors, and community members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(testimonials) && testimonials.map((testimonial, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <Quote className="h-8 w-8 text-primary/20 mb-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
