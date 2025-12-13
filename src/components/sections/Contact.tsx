"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Coffee, Linkedin, Github } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { profile } from "@/data/profile"
import confetti from "canvas-confetti"
import { useSound } from "@/components/SoundManager"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const { playSuccess, playClick } = useSound();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    playClick();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setIsSubmitting(false);
        setIsSuccess(true);
        playSuccess();

        // Confetti Explosion
        const end = Date.now() + 1000;
        const colors = ['#FF10F0', '#00FFFF', '#ffffff'];

        (function frame() {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());

        form.reset();
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        setIsSubmitting(false);
        console.error("Contact form submission failed");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Contact form error:", error);
    }
  }

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Get in Touch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind or just want to say hi? I&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and I&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Your Name"
                      {...form.register("name")}
                      disabled={isSubmitting}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Your Email"
                      type="email"
                      {...form.register("email")}
                      disabled={isSubmitting}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Your Message"
                      className="min-h-[120px]"
                      {...form.register("message")}
                      disabled={isSubmitting}
                    />
                    {form.formState.errors.message && (
                      <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : isSuccess ? "Sent!" : "Send Message"}
                    {!isSubmitting && !isSuccess && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {profile.email}
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Location</h4>
                    <p className="text-muted-foreground">{profile.location}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Socials</h4>
                    <div className="flex gap-4 mt-2">
                      <a
                        href={profile.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-[#0077b5] transition-colors hover:scale-110 transform duration-200"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a
                        href={profile.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-black dark:hover:text-white transition-colors hover:scale-110 transform duration-200"
                        title="GitHub"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#FFDD00]/20 to-[#FFDD00]/5 border-[#FFDD00]/50 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFDD00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-[#FFDD00] rounded-full text-black">
                      <Coffee className="h-5 w-5" />
                    </div>
                    Buy me a coffee
                  </CardTitle>
                  <CardDescription>
                    Fuel my creativity! If you found my work helpful, consider supporting me.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-[#FFDD00] text-black hover:bg-[#FFDD00]/90 font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5" asChild>
                    <a href={profile.socials.buymeacoffee} target="_blank" rel="noopener noreferrer">
                      Support My Work
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
