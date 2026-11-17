import Link from "next/link";

const IST = "Asia/Kolkata";

export const fmtDate = (d: Date | null) =>
  d ? new Intl.DateTimeFormat("en-IN", { timeZone: IST, day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(d) : "—";

export const fmtDay = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", day: "numeric", month: "short" }).format(new Date(`${iso}T00:00:00Z`));

export function ago(d: Date | null, now = Date.now()) {
  if (!d) return "—";
  const s = Math.max(0, Math.round((now - d.getTime()) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} d ago`;
  return fmtDate(d);
}

export const fmtMs = (ms: number | null) => {
  if (ms == null) return "—";
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
};

// Plain "City, CC": flag emoji don't render on Windows, where this is often read.
export const place = (city: string | null, country: string | null) => [city, country].filter(Boolean).join(", ") || "Unknown place";

export const EVENT_LABELS: Record<string, string> = {
  resume: "Opened your résumé",
  apk: "Downloaded Anvil",
  email: "Clicked your email",
  linkedin: "Opened your LinkedIn",
  github: "Opened your GitHub",
  contact_form: "Sent the contact form",
};
export const eventLabel = (name: string) => EVENT_LABELS[name] ?? name.replace(/^out:/, "Opened ");

export function VisitorLink({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Link href={`/admin?v=${encodeURIComponent(id)}`} className="link">
      {children}
    </Link>
  );
}

export function Card({
  label,
  title,
  hint,
  children,
  className = "",
}: {
  label: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel min-w-0 p-5 sm:p-6 ${className}`}>
      <p className="label">{label}</p>
      <h2 className="mt-2 font-serif text-2xl leading-tight text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink3">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export const Empty = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-ink3">{children}</p>;

/** Ranked horizontal bars: one series, value labels in ink, hover title on each row. */
export function BarList({ rows }: { rows: { label: React.ReactNode; value: number; note?: string; title: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="grid gap-2.5">
      {rows.map((r, i) => (
        <li key={i} title={r.title} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-sm">
          <span className="min-w-0 truncate text-ink">{r.label}</span>
          <span className="font-mono text-xs tabular-nums text-ink2">
            {r.value.toLocaleString("en-IN")}
            {r.note && <span className="ml-2 text-ink3">{r.note}</span>}
          </span>
          <span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
            <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Daily unique visitors, last 30 days: one-series column chart with a native tooltip per day. */
export function DailyChart({ days }: { days: { day: string; visitors: number }[] }) {
  const W = 600;
  const H = 120;
  const pad = { top: 8, bottom: 2, left: 0, right: 0 };
  const max = Math.max(1, ...days.map((d) => d.visitors));
  const slot = (W - pad.left - pad.right) / Math.max(1, days.length);
  const bar = Math.max(2, slot - 2); // 2px surface gap between columns
  const y = (v: number) => pad.top + (H - pad.top - pad.bottom) * (1 - v / max);
  const total = days.reduce((a, d) => a + d.visitors, 0);
  return (
    <figure className="min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Unique visitors per day, last 30 days: ${total} in total, at most ${max} in a day`}>
        <line x1={0} x2={W} y1={y(0)} y2={y(0)} stroke="var(--line-strong)" strokeWidth={1} />
        <line x1={0} x2={W} y1={y(max)} y2={y(max)} stroke="var(--line)" strokeWidth={1} strokeDasharray="2 4" />
        {days.map((d, i) => {
          const x = pad.left + i * slot + 1;
          const top = y(d.visitors);
          const h = y(0) - top;
          return (
            <g key={d.day}>
              <title>{`${fmtDay(d.day)}: ${d.visitors} visitor${d.visitors === 1 ? "" : "s"}`}</title>
              <rect x={pad.left + i * slot} y={pad.top} width={slot} height={H - pad.top - pad.bottom} fill="transparent" />
              {d.visitors > 0 && <rect x={x} y={top} width={bar} height={Math.max(1, h)} rx={Math.min(3, bar / 2)} className="fill-accent" />}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 flex justify-between font-mono text-[0.6875rem] text-ink3">
        <span>{days[0] ? fmtDay(days[0].day) : ""}</span>
        <span>peak {max} a day</span>
        <span>Today</span>
      </figcaption>
    </figure>
  );
}
