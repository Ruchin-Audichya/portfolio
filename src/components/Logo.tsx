export function Logo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="Ruchin Audichya logo"
        >
            <defs>
                <linearGradient id="logo-hex" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#55e7ff" />
                    <stop offset="50%" stopColor="#6a7aff" />
                    <stop offset="100%" stopColor="#ff4fd8" />
                </linearGradient>
            </defs>
            <g fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                <path
                    d="M60 6 L110 34 V86 L60 114 L10 86 V34 Z"
                    stroke="url(#logo-hex)"
                />
                <circle cx="60" cy="60" r="30" stroke="#111827" fill="#0b1628" />
                <path
                    d="M40 66 C42 56 52 52 60 56 C64 50 76 48 82 58 C88 59 92 64 92 70"
                    stroke="#9ee8ff"
                    strokeWidth="5"
                    fill="none"
                />
                <circle cx="87" cy="60" r="4.5" fill="#ff4fd8" stroke="#0b1628" strokeWidth="2" />
            </g>
        </svg>
    );
}
