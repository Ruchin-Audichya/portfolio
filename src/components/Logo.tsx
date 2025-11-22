export function Logo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground"
            />
            <path
                d="M50 25 L75 37.5 L75 62.5 L50 75 L25 62.5 L25 37.5 Z"
                fill="currentColor"
                className="text-accent"
            />
        </svg>
    );
}
