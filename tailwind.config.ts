import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

// Colours are CSS variables (see globals.css) so light and dark share one set of utilities.
const rgb = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: rgb("paper"),
        raised: rgb("raised"),
        ink: rgb("ink"),
        ink2: rgb("ink2"),
        ink3: rgb("ink3"),
        accent: rgb("accent"),
        ok: rgb("ok"),
        warn: rgb("warn"),
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        deva: ["var(--font-deva)", "serif"],
      },
      maxWidth: { site: "84rem" },
      transitionTimingFunction: { out: "cubic-bezier(0.16, 1, 0.3, 1)" },
    },
  },
  plugins: [typography],
};

export default config;
