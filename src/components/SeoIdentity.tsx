import Link from "next/link";
import { content } from "@/lib/content";

/**
 * Visually-hidden, fully-crawlable identity block.
 *
 * Search engines weigh the first ~150 words of the body heavily for direct-name queries.
 * The hero is mostly canvas/Framer Motion overlays, so this block guarantees the crawler
 * always sees a clean text H1 with name, role, location, and inbound links to verified
 * external profiles (rel=me-equivalent on the head, plus anchor href targets here).
 *
 * It does NOT use display:none — Google has historically deprioritized that.
 * Instead it uses the standard `sr-only` pattern: visible to screen readers and crawlers,
 * invisible to sighted users.
 */
export function SeoIdentity() {
  return (
    <section
      aria-label="About Ruchin Audichya"
      className="sr-only"
    >
      <h1>Ruchin Audichya — Data-driven ML Engineer</h1>
      <p>
        Ruchin Audichya is a data-driven Machine Learning engineer based in Jaipur,
        Rajasthan, India. He builds Retrieval-Augmented Generation (RAG) systems,
        knowledge-graph pipelines, and applied AI products. Ruchin is the creator of
        MediFast AI — a RAG-powered medicine intelligence platform over a 169,000-record
        knowledge graph with 1.3 million relationship edges that improved semantic search
        accuracy by 18 percentage points — and Placify AI, a CatBoost classification
        pipeline reaching 84.7% accuracy and 94.5% ROC-AUC on 5,000+ student records.
      </p>
      <p>
        Ruchin Audichya holds AWS Certified Solutions Architect – Associate, AWS
        Certified AI Practitioner, AWS Certified Cloud Practitioner, and ServiceNow
        Certified System Administrator (CSA) certifications. He is a Computer Science
        Engineering undergraduate at JECRC University, Jaipur, with an AWS Cloud
        Specialization, and leads the AWS Cloud Club at JECRC University. Ruchin is a
        Top-24 nationwide finalist at Cognizant Technoverse 2026 (out of 2,000+ teams)
        and a Smart India Hackathon 2024 institute Top 10 finalist.
      </p>
      <h2>Find Ruchin Audichya online</h2>
      <ul>
        <li>
          Official portfolio:{" "}
          <Link href="https://ruchinaudichya.in" rel="canonical">
            ruchinaudichya.in
          </Link>
        </li>
        <li>
          GitHub:{" "}
          <Link href={content.profile.socials.github} rel="me">
            Ruchin-Audichya
          </Link>
        </li>
        <li>
          LinkedIn:{" "}
          <Link href={content.profile.socials.linkedin} rel="me">
            ruchinaudi
          </Link>
        </li>
        <li>
          X / Twitter:{" "}
          <Link href={content.profile.socials.twitter} rel="me">
            @itsRuchin
          </Link>
        </li>
        <li>
          Instagram:{" "}
          <Link href={content.profile.socials.instagram} rel="me">
            ruchin_audichya
          </Link>
        </li>
        <li>
          Email:{" "}
          <a href={`mailto:${content.profile.email}`}>{content.profile.email}</a>
        </li>
      </ul>
    </section>
  );
}
