"use client";

/** Flips the theme set by the inline script in the layout and remembers the choice. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode: the choice just won't persist */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className={`group grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:rotate-180">
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />
      </svg>
    </button>
  );
}
