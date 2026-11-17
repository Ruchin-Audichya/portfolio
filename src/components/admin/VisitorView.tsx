import Link from "next/link";
import type { loadVisitor } from "@/lib/analytics/queries";
import { Card, Empty, eventLabel, fmtDate, fmtMs, place } from "./ui";

type Events = Awaited<ReturnType<typeof loadVisitor>>;

/** One visitor's whole story: who they seem to be, then every page and click, grouped by visit. */
export function VisitorView({ id, events }: { id: string; events: Events }) {
  const last = events[events.length - 1];
  const sessions = new Map<string, Events>();
  for (const e of events) sessions.set(e.session, [...(sessions.get(e.session) ?? []), e]);
  const ips = Array.from(new Set(events.map((e) => e.ip).filter(Boolean)));
  const orgs = Array.from(new Set(events.map((e) => e.org).filter(Boolean)));

  return (
    <div className="grid gap-6">
      <Link href="/admin" className="link label self-start">
        ← All visitors
      </Link>
      {!last ? (
        <Empty>No visits recorded for this visitor.</Empty>
      ) : (
        <>
          <Card label={`Visitor ${id.slice(0, 8)}`} title={place(last.city, last.country)}>
            <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
              {[
                ["Organisation / network", orgs.join(", ") || "Unknown"],
                ["IP addresses", ips.join(", ") || "Not kept (Global Privacy Control)"],
                ["Region", [last.city, last.region, last.country].filter(Boolean).join(", ") || "—"],
                ["Device", `${last.browser} on ${last.os} · ${last.device} · ${last.screen ?? "?"}`],
                ["Language / time zone", `${last.lang ?? "?"} · ${last.tz ?? "?"}`],
                ["First seen", fmtDate(events[0].ts)],
                ["Last seen", fmtDate(last.ts)],
                ["Visits", String(sessions.size)],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="label pt-1">{k}</dt>
                  <dd className="min-w-0 break-words text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {Array.from(sessions.entries()).reverse().map(([sid, evs]) => (
            <Card key={sid} label="Visit" title={fmtDate(evs[0].ts)} hint={evs[0].referrer ? `Came from ${evs[0].referrer}` : "Came directly"}>
              <ol className="grid gap-2 text-sm">
                {evs.map((e, i) => (
                  <li key={i} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
                    <span className="font-mono text-xs text-ink3">
                      {new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" }).format(e.ts)}
                    </span>
                    <span className="min-w-0 text-ink">
                      {e.kind === "view" && <>Opened <span className="font-mono text-xs">{e.path}</span></>}
                      {e.kind === "leave" && (
                        <span className="text-ink2">
                          Left <span className="font-mono text-xs">{e.path}</span> after {fmtMs(e.ms)}, scrolled {e.scroll ?? 0}%
                        </span>
                      )}
                      {e.kind === "event" && <strong className="font-medium text-accent">{eventLabel(e.name ?? "")}</strong>}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
