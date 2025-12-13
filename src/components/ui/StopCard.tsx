import React from "react";

interface StopCardProps {
  title: string;
  lines?: [string, string];
  body: string;
  link?: string;
  onPrimary?: () => void;
  isNight?: boolean;
}

export function StopCard({ title, lines, body, link, onPrimary, isNight = true }: StopCardProps) {
  const shell = isNight
    ? "border-white/15 bg-gradient-to-br from-black/85 via-black/75 to-black/60 text-white shadow-2xl"
    : "border-black/10 bg-white/85 text-black shadow-xl";
  const metaText = isNight ? "text-white/70" : "text-black/60";
  const linesText = isNight ? "text-white/80" : "text-black/70";
  const bodyText = isNight ? "text-white/85" : "text-black/75";

  const isHashLink = typeof link === "string" && link.startsWith("#");
  const openLabel = isHashLink ? "Open section" : "Open";

  return (
    <div
      className={`pointer-events-auto w-[92vw] max-w-[320px] sm:w-[280px] rounded-2xl border backdrop-blur-md p-4 ${shell}`}
      role="group"
      aria-label={`Story stop: ${title}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className={`text-xs font-semibold uppercase tracking-[0.12em] ${metaText}`}>Story Stop</div>
        </div>
      </div>
      <div className="text-sm sm:text-base font-semibold mb-1 leading-snug">{title}</div>
      {lines?.length ? (
        <div className="mb-2">
          <div className={`text-sm leading-snug ${linesText}`}>{lines[0]}</div>
          <div className={`text-sm leading-snug ${linesText}`}>{lines[1]}</div>
        </div>
      ) : null}
      <p className={`text-sm leading-snug mb-3 ${bodyText}`}>{body}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrimary}
          className={
            isNight
              ? "flex-1 text-sm min-h-[44px] rounded-full bg-white text-black px-4 py-2 font-semibold hover:bg-white/90 transition"
              : "flex-1 text-sm min-h-[44px] rounded-full bg-black text-white px-4 py-2 font-semibold hover:bg-black/90 transition"
          }
          aria-label={`Focus camera on ${title}`}
        >
          Focus camera
        </button>
        {link && (
          <a
            href={link}
            className={
              isNight
                ? "flex-1 text-sm min-h-[44px] rounded-full border border-white/30 px-4 py-2 text-white text-center hover:border-white/60 transition inline-flex items-center justify-center"
                : "flex-1 text-sm min-h-[44px] rounded-full border border-black/25 px-4 py-2 text-black text-center hover:border-black/45 transition inline-flex items-center justify-center"
            }
            aria-label={`${openLabel}: ${title}`}
          >
            {openLabel}
          </a>
        )}
      </div>
    </div>
  );
}
