import type { ReactNode } from "react";

/** The shared chrome around each homepage demo: a title bar, the demo, and an honest footnote. */
export function DemoFrame({
  title,
  status,
  action,
  note,
  children,
}: {
  title: string;
  status?: ReactNode;
  action?: ReactNode;
  note: string;
  children: ReactNode;
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex min-h-12 items-center justify-between gap-4 border-b border-line px-4 sm:px-5">
        <p className="label flex min-w-0 items-center gap-2.5 whitespace-nowrap text-ink2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span className="truncate">{title}</span>
        </p>
        <div className="flex shrink-0 items-center gap-3">
          {status ? <span className="label hidden sm:inline">{status}</span> : null}
          {action}
        </div>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
      <p className="border-t border-line px-4 py-3 text-xs leading-relaxed text-ink3 sm:px-5">{note}</p>
    </div>
  );
}

export function DemoButton({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line-strong px-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:text-ink"
    >
      {children}
    </button>
  );
}
