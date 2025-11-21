import type { Metadata } from "next";
import { Fraunces, Outfit, Manrope } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "Ruchin Audichya | Precision in Motion",
  description: "Orchestrating digital experiences. Portfolio of Ruchin Audichya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${clash.variable} ${satoshi.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="antialiased selection:bg-accent selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
