import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { RecordSection } from "@/components/home/Record";
import { Story } from "@/components/home/Story";
import { Work } from "@/components/home/Work";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <RecordSection />
      <Story />
      <Marquee />
      <Contact />
    </>
  );
}
