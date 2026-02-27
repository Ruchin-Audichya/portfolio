import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { SkipNav } from "@/components/SkipNav";
import { Fraunces, Outfit, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultMetadata, generatePersonSchema, generateWebsiteSchema, generatePortfolioSchema } from "./metadata";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll").then((mod) => mod.SmoothScroll), {
  ssr: false,
});
const SoundManager = dynamic(() => import("@/components/SoundManager").then((mod) => mod.SoundManager), {
  ssr: false,
});
const ScrollProgress = dynamic(() => import("@/components/ui/ScrollProgress").then((mod) => mod.ScrollProgress), {
  ssr: false,
});
const CustomCursor = dynamic(() => import("@/components/CustomCursor").then((mod) => mod.CustomCursor), {
  ssr: false,
});

const clash = Outfit({
  subsets: ["latin"],
  variable: "--font-clash",
  display: "swap",
});

const satoshi = Manrope({
  subsets: ["latin"],
  variable: "--font-satoshi",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  ...defaultMetadata,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = generatePersonSchema();
  const websiteSchema = generateWebsiteSchema();
  const portfolioSchema = generatePortfolioSchema();

  return (
    <html lang="en" className={`${clash.variable} ${satoshi.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://vercel.live" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ruchin A." />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-tap-highlight" content="no" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(portfolioSchema),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                  localStorage.setItem('theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-accent selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="theme" themes={["light", "dark"]}>
          <SoundManager>
            <ScrollProgress />
            <CustomCursor />
            <SkipNav />
            <SmoothScroll>
              <main id="main-content">{children}</main>
            </SmoothScroll>
            <Analytics />
            <SpeedInsights />
          </SoundManager>
        </ThemeProvider>
      </body>
    </html>
  );
}
