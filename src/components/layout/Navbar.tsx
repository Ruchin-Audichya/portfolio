"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ArrowUpRight } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "World", href: "#world" },
  { title: "About", href: "#about" },
  { title: "Skills", href: "#skills" },
  { title: "Projects", href: "#projects" },
  { title: "Achievements", href: "#achievements" },
  { title: "Shop", href: "/shop" },
  { title: "GitHub", href: "#github" },
  { title: "Gallery", href: "#gallery" },
  { title: "Gallery", href: "#gallery" },
  { title: "Guestbook", href: "#guestbook" },
  { title: "Contact", href: "#contact" },
  { title: "Contact", href: "#contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          RA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
          ))}
          <ModeToggle />
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl md:hidden animate-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col p-6 gap-2 h-[calc(100vh-4rem)] overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center justify-between p-4 text-lg font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-98"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.title}
                <ArrowUpRight className="h-4 w-4 opacity-50" />
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
