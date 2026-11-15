/** The Anvil app icon (docs/brand/anvil-icon.svg in the anvil-usb repo), inlined so it costs no request. */
export function AnvilMark({ className = "", title = "Anvil app icon" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 108 108" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id="am-bg" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#243142" />
          <stop offset="1" stopColor="#0F151D" />
        </linearGradient>
        <linearGradient id="am-body" gradientUnits="userSpaceOnUse" x1="0" y1="46.25" x2="0" y2="79.464">
          <stop offset="0" stopColor="#B4C5DA" />
          <stop offset="0.55" stopColor="#6E8098" />
          <stop offset="1" stopColor="#3A4659" />
        </linearGradient>
        <linearGradient id="am-face" gradientUnits="userSpaceOnUse" x1="26.875" y1="0" x2="84.446" y2="0">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D3DEEA" />
        </linearGradient>
        <linearGradient id="am-base" gradientUnits="userSpaceOnUse" x1="0" y1="68.393" x2="0" y2="79.464">
          <stop offset="0" stopColor="#2E3A4B" />
          <stop offset="1" stopColor="#1A212C" />
        </linearGradient>
        <radialGradient id="am-spark" gradientUnits="userSpaceOnUse" cx="71.161" cy="36.286" r="7.75">
          <stop offset="0" stopColor="#FFF1C9" />
          <stop offset="0.5" stopColor="#FFB23F" />
          <stop offset="1" stopColor="#FF7A1A" />
        </radialGradient>
      </defs>
      <rect width="108" height="108" rx="24" fill="url(#am-bg)" />
      <path
        fill="url(#am-body)"
        d="M23.554,50.679C30.196,47.579 35.732,46.25 41.268,46.25L84.446,46.25L84.446,54.554C77.804,55.107 72.268,56.879 70.054,61.196L70.054,68.393L77.804,71.714L80.018,79.464L33.518,79.464L35.732,71.714L43.482,68.393L43.482,61.196C41.268,57.764 34.625,55.107 23.554,50.679Z"
      />
      <path
        fill="url(#am-face)"
        d="M41.268,46.25L84.446,46.25L84.446,49.571L41.932,49.571C36.839,48.907 32.411,49.35 27.429,49.793C31.857,47.579 36.286,46.25 41.268,46.25Z"
      />
      <path fill="url(#am-base)" d="M33.518,79.464L35.732,71.714L43.482,68.393L70.054,68.393L77.804,71.714L80.018,79.464Z" />
      <path fill="url(#am-spark)" d="M71.161,28.536L72.6,34.846L78.911,36.286L72.6,37.725L71.161,44.036L69.721,37.725L63.411,36.286L69.721,34.846Z" />
      <path fill="#FFB23F" d="M58.429,32.964a1.661,1.661 0 1,0 3.321,0a1.661,1.661 0 1,0 -3.321,0Z" />
      <path fill="#FF8A2A" d="M80.461,42.375a1.218,1.218 0 1,0 2.436,0a1.218,1.218 0 1,0 -2.436,0Z" />
      <path fill="#FFD27A" d="M61.861,41.268a0.996,0.996 0 1,0 1.993,0a0.996,0.996 0 1,0 -1.993,0Z" />
    </svg>
  );
}
