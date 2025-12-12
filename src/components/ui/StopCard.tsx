import React from "react";

interface StopCardProps {
  title: string;
  body: string;
  link?: string;
  onPrimary?: () => void;
}

export function StopCard({ title, body, link, onPrimary }: StopCardProps) {
  return (
    <div className="pointer-events-auto w-[220px] rounded-2xl border border-white/15 bg-gradient-to-br from-black/85 via-black/75 to-black/60 shadow-2xl backdrop-blur-md p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">Story Stop</div>
        </div>
      </div>
      <div className="text-sm font-semibold text-white mb-1">{title}</div>
      <p className="text-[12px] leading-relaxed text-white/85 mb-3">{body}</p>
      <div className="flex gap-2">
        <button
          onClick={onPrimary}
          className="flex-1 text-[12px] rounded-full bg-white text-black px-3 py-2 font-semibold hover:bg-white/90 transition"
        >
          Focus
        </button>
        {link && (
          <a
            href={link}
            className="flex-1 text-[12px] rounded-full border border-white/30 px-3 py-2 text-white text-center hover:border-white/60 transition"
          >
            Open
          </a>
        )}
      </div>
    </div>
  );
}
