import { ImageResponse } from "next/og";

// Edge runtime: the Node build of the image renderer cannot load its font on Windows.
export const runtime = "edge";
export const alt = "Ruchin Audichya — software that's exact: to the paisa, the byte and the milligram.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#F5F1E8";
const INK = "#17130E";
const RANI = "#C8205E";
const MUTED = "#6A6359";

// The arch from the logo, as a 100×120 path.
const ARCH = "M0 120V58C0 22 30 10 50 0C70 10 100 22 100 58V120H74V84H26V120ZM26 62H74V58C74 40 62 28 50 22C38 28 26 40 26 58Z";

const HEADLINE: { text: string; accent?: boolean; after?: string }[] = [
  { text: "Software" },
  { text: "that’s" },
  { text: "exact:" },
  { text: "to" },
  { text: "the" },
  { text: "paisa", accent: true, after: "," },
  { text: "the" },
  { text: "byte", accent: true },
  { text: "and" },
  { text: "the" },
  { text: "milligram", accent: true, after: "." },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="40" height="48" viewBox="0 0 100 120">
              <path d={ARCH} fill={RANI} fillRule="evenodd" />
            </svg>
            <div style={{ fontSize: 30, fontWeight: 600 }}>Ruchin Audichya</div>
          </div>
          <div style={{ fontSize: 22, color: MUTED, letterSpacing: 2 }}>SOFTWARE ENGINEER · JAIPUR</div>
        </div>

        {/* One span per word: flex children do not keep the spaces between them. */}
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, fontSize: 90, lineHeight: 1.08, letterSpacing: -3, maxWidth: 1040 }}>
          {HEADLINE.map((word, i) => (
            <span key={i} style={{ display: "flex" }}>
              <span style={{ color: word.accent ? RANI : INK }}>{word.text}</span>
              {word.after ? <span>{word.after}</span> : null}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `2px solid ${INK}`,
            paddingTop: 22,
            fontSize: 24,
            color: MUTED,
          }}
        >
          <div>Anvil · MediFast · Yatra Sync</div>
          <div>ruchinaudichya.in</div>
        </div>
      </div>
    ),
    size,
  );
}
