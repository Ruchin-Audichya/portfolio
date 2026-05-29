"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { Download, Linkedin, Github, Mail, MapPin, ArrowRight, Phone, Twitter, Instagram } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { profile } from "@/data/profile"
import confetti from "canvas-confetti"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

// Magnetic input field component
function MagneticInput({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.1);
    y.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Portal ring animation
function PortalRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-purple-500/20"
          style={{
            width: `${300 + i * 150}px`,
            height: `${300 + i * 150}px`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: i % 2 === 0 ? 360 : -360,
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Portal background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        <PortalRings />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-12"
        >
          {/* Section Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4"
            >
              <Mail className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Let&apos;s Connect</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Hiring for AI/ML, backend, cloud, or automation work? Send the context and I&apos;ll respond with next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Enhanced Form Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-xl opacity-50" />
              
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-white mb-6">Start a Hiring Conversation</h3>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <MagneticInput>
                    <div className="space-y-2">
                      <Input
                        placeholder="Your Name"
                        {...form.register("name")}
                        disabled={isSubmitting}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/[0.08] rounded-xl py-6 transition-all"
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-pink-400">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                  </MagneticInput>
                  
                  <MagneticInput>
                    <div className="space-y-2">
                      <Input
                        placeholder="Your Email"
                        type="email"
                        {...form.register("email")}
                        disabled={isSubmitting}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/[0.08] rounded-xl py-6 transition-all"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-pink-400">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </MagneticInput>
                  
                  <MagneticInput>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Your Message"
                        className="min-h-[140px] bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/[0.08] rounded-xl resize-none transition-all"
                        {...form.register("message")}
                        disabled={isSubmitting}
                      />
                      {form.formState.errors.message && (
                        <p className="text-sm text-pink-400">{form.formState.errors.message.message}</p>
                      )}
                    </div>
                  </MagneticInput>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 transition-all group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : isSuccess ? (
                        <>✨ Message Sent!</>
                      ) : (
                        <>
                          Send Message 
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Info Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Info</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Email</h4>
                      <a href={`mailto:${profile.email}`} className="text-white/60 hover:text-purple-400 transition-colors">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Location</h4>
                      <p className="text-white/60">{profile.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <Phone className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Phone</h4>
                      <a href={profile.contactLinks.phone} className="text-white/60 hover:text-emerald-300 transition-colors">
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="font-semibold text-white mb-3">Socials</h4>
                    <div className="flex flex-wrap gap-3">
                      <motion.a
                        href={profile.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-[#0077b5] hover:border-[#0077b5]/50 hover:bg-[#0077b5]/10 transition-all"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Linkedin className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        href={profile.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        href={profile.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X / Twitter"
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Twitter className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        href={profile.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-[#e1306c] hover:border-[#e1306c]/50 hover:bg-[#e1306c]/10 transition-all"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Instagram className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruiter action card */}
              <motion.div
                className="relative p-8 rounded-3xl overflow-hidden group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-emerald-500/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-cyan-400 rounded-xl text-black shadow-lg shadow-cyan-400/30">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="text-xl font-bold text-white">Resume + Proof</h4>
                  </div>
                  
                  <p className="text-white/60 mb-6">
                    Download the latest resume, then jump into projects to see how the skills translate into working systems.
                  </p>
                  
                  <motion.a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-black font-bold rounded-xl shadow-lg shadow-cyan-400/25 hover:shadow-xl hover:shadow-cyan-400/30 transition-all"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download Resume
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
