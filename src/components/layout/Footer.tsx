import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { profile } from "@/data/profile"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-lg font-bold">Ruchin Audichya</span>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={profile.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href={`mailto:${profile.email}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>

        <div className="text-sm text-muted-foreground">
          Built with Next.js & Tailwind
        </div>
      </div>
    </footer>
  )
}
