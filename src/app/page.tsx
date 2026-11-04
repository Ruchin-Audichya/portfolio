import { Bricolage_Grotesque, Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import { homeMarkup } from "@/components/home/markup";
import { HomeEffects } from "@/components/home/HomeEffects";
import "@/components/home/home.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display", display: "swap" });
const body = Schibsted_Grotesk({ subsets: ["latin"], variable: "--f-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap" });

// Server-rendered so crawlers and slow phones get the full content without waiting for JS.
export default function Home() {
  return (
    <>
      <div
        className={`ra ${display.variable} ${body.variable} ${mono.variable}`}
        dangerouslySetInnerHTML={{ __html: homeMarkup }}
      />
      <HomeEffects />
    </>
  );
}
