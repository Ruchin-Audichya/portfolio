import type { Metadata, Viewport } from "next";
import { DM_Mono, Instrument_Sans, Newsreader, Tiro_Devanagari_Hindi } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ArchClip } from "@/components/site/Logo";
import { Motion } from "@/components/site/Motion";
import { site } from "@/lib/content";
import { defaultMetadata, faqSchema, jsonLd, personSchema, profilePageSchema, websiteSchema } from "@/lib/seo";
import "./globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  adjustFontFallback: false,
  variable: "--font-serif",
  display: "swap",
});
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
// Only used for the name in Devanagari, so it is not preloaded.
const deva = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-deva",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F1E8" },
    { media: "(prefers-color-scheme: dark)", color: "#11100F" },
  ],
  colorScheme: "light dark",
};

// Runs before first paint: picks the saved theme (or the system one) and marks JS as available.
const bootScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t}catch(e){d.dataset.theme='light'}d.classList.add('js')})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${deva.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <link rel="me" href={site.socials.github} />
        <link rel="me" href={site.socials.linkedin} />
        <link rel="me" href={site.socials.x} />
        <script {...jsonLd(personSchema())} />
        <script {...jsonLd(websiteSchema())} />
        <script {...jsonLd(profilePageSchema())} />
        <script {...jsonLd(faqSchema())} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-sm text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <ArchClip />
        <Header />
        <main id="main" className="relative z-10">
          {children}
        </main>
        <Footer />
        <Motion />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
