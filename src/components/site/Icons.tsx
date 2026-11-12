type IconProps = { className?: string };

const base = {
  width: 14,
  height: 14,
  viewBox: "0 0 14 14",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** ↗ for links that leave the page. */
export const ArrowUpRight = ({ className = "" }: IconProps) => (
  <svg {...base} className={`arrow ${className}`}>
    <path d="M3.5 10.5l7-7M5 3.5h5.5V9" />
  </svg>
);

export const ArrowDown = ({ className = "" }: IconProps) => (
  <svg {...base} className={`arrow arrow-down ${className}`}>
    <path d="M7 2.5v9M3 7.5l4 4 4-4" />
  </svg>
);

export const ArrowRight = ({ className = "" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M2.5 7h9M7.5 3l4 4-4 4" />
  </svg>
);

export const Check = ({ className = "" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M2.5 7.5l3 3 6-7" />
  </svg>
);

export const Replay = ({ className = "" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M11.5 7a4.5 4.5 0 1 1-1.4-3.26M11.5 2v2.5H9" />
  </svg>
);
