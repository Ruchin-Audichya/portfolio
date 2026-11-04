import { Archivo, Tiro_Devanagari_Hindi, IBM_Plex_Mono, Silkscreen } from "next/font/google";
import { homeMarkup } from "@/components/home/markup";
import { HomeEffects } from "@/components/home/HomeEffects";
import "@/components/home/home.css";

// Archivo's width axis drives the edge-to-edge name wordmark.
const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--f-sans", display: "swap" });
const deva = Tiro_Devanagari_Hindi({ subsets: ["devanagari", "latin"], weight: "400", variable: "--f-deva", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono", display: "swap" });
// Pixel face for the retro 88x31 badges in the Story section.
const pixel = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--f-pixel", display: "swap" });

// Server-rendered so crawlers and slow phones get the full content without waiting for JS.
export default function Home() {
  return (
    <>
      <div
        className={`ra ${sans.variable} ${deva.variable} ${mono.variable} ${pixel.variable}`}
        dangerouslySetInnerHTML={{ __html: homeMarkup }}
      />
      <HomeEffects />
    </>
  );
}
