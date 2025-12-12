export function LogoPulseGrid({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Logo concept: pulse grid">
      <defs>
        <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5ef3ff" />
          <stop offset="50%" stopColor="#7f7cff" />
          <stop offset="100%" stopColor="#ff4fd8" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="100" height="100" rx="18" fill="#0a0f1c" stroke="#182235" strokeWidth="4" />
      {Array.from({ length: 4 }).map((_, row) => (
        Array.from({ length: 4 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={25 + col * 25}
            cy={25 + row * 25}
            r={6 + Math.sin((row + col) * 0.8) * 2}
            fill="url(#pulse-grad)"
            opacity={0.75}
          />
        ))
      ))}
      <path d="M20 60 H100" stroke="#7f7cff" strokeWidth="3" strokeDasharray="6 6" opacity="0.4" />
      <path d="M60 20 V100" stroke="#5ef3ff" strokeWidth="3" strokeDasharray="6 6" opacity="0.4" />
      <circle cx="60" cy="60" r="14" fill="none" stroke="url(#pulse-grad)" strokeWidth="5" />
    </svg>
  );
}

export function LogoOrbitCity({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Logo concept: orbit city">
      <defs>
        <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6efff5" />
          <stop offset="50%" stopColor="#7ea2ff" />
          <stop offset="100%" stopColor="#ff6ee0" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="70" r="60" fill="#0c1220" stroke="#1c2840" strokeWidth="5" />
      <ellipse cx="70" cy="70" rx="55" ry="20" fill="none" stroke="url(#orbit-grad)" strokeWidth="4" />
      <ellipse cx="70" cy="70" rx="36" ry="12" fill="none" stroke="#6efff5" strokeWidth="3" opacity="0.5" />
      <rect x="55" y="32" width="12" height="26" fill="#1f2a44" stroke="#7ea2ff" strokeWidth="3" />
      <rect x="72" y="26" width="12" height="32" fill="#1f2a44" stroke="#6efff5" strokeWidth="3" />
      <rect x="89" y="34" width="10" height="24" fill="#1f2a44" stroke="#ff6ee0" strokeWidth="3" />
      <circle cx="110" cy="70" r="6" fill="#ff6ee0" stroke="#0c1220" strokeWidth="2" />
      <circle cx="30" cy="64" r="4" fill="#6efff5" />
      <circle cx="48" cy="78" r="3" fill="#7ea2ff" />
    </svg>
  );
}

export function LogoVistaLoop({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Logo concept: vista loop">
      <defs>
        <linearGradient id="loop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ff2ff" />
          <stop offset="50%" stopColor="#7f7cff" />
          <stop offset="100%" stopColor="#ff79e0" />
        </linearGradient>
      </defs>
      <rect x="14" y="14" width="112" height="112" rx="24" fill="#0b1424" stroke="#1b2b46" strokeWidth="4" />
      <path
        d="M36 88 C44 72 62 64 70 64 C82 64 100 74 104 90"
        fill="none"
        stroke="url(#loop-grad)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="52" cy="60" r="10" fill="#122037" stroke="#4ff2ff" strokeWidth="3" />
      <circle cx="92" cy="54" r="8" fill="#122037" stroke="#ff79e0" strokeWidth="3" />
      <path d="M42 40 H98" stroke="#7f7cff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M36 104 H104" stroke="#4ff2ff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}
