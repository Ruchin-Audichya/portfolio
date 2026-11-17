import type { Dashboard } from "@/lib/analytics/queries";
import { BarList, Card, DailyChart, Empty, VisitorLink, ago, eventLabel, fmtDate, fmtMs, place } from "./ui";

const KIND_NOTE = { network: "home / mobile network", cloud: "data centre or VPN", organisation: "" } as const;

export function DashboardView({ data }: { data: Dashboard }) {
  const { totals } = data;
  const now = Date.now();
  return (
    <div className="grid gap-6">
      {/* Headline numbers */}
      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {[
          { label: "Visitors, all time", value: totals.visitors, note: totals.since ? `since ${fmtDate(totals.since)}` : "no visits yet" },
          { label: "Today", value: totals.today, note: "unique visitors (IST)" },
          { label: "Last 7 days", value: totals.week, note: "unique visitors" },
          { label: "Page views", value: totals.views, note: `avg read ${fmtMs(totals.avgMs)}` },
        ].map((k) => (
          <div key={k.label} className="bg-raised p-5">
            <p className="label">{k.label}</p>
            <p className="display mt-3 text-4xl tabular-nums sm:text-5xl">{k.value.toLocaleString("en-IN")}</p>
            <p className="mt-2 text-xs text-ink3">{k.note}</p>
          </div>
        ))}
      </section>

      <Card label="Trend" title="Visitors per day" hint="Last 30 days, unique visitors. Hover a day for its number.">
        <DailyChart days={data.daily} />
      </Card>

      {/* The five headline stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card label="1 · Live now" title={data.live.length === 1 ? "1 person is on your site" : `${data.live.length} people are on your site`} hint="Active in the last 5 minutes.">
          {data.live.length === 0 ? (
            <Empty>Nobody right now. Refresh to check again.</Empty>
          ) : (
            <ul className="grid gap-3">
              {data.live.map((l) => (
                <li key={l.session} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-ok" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-ink">
                      <VisitorLink id={l.visitor}>{place(l.city, l.country)}</VisitorLink>
                      {l.org && l.orgKind === "organisation" && <span className="text-ink2"> · {l.org}</span>}
                    </p>
                    <p className="truncate font-mono text-xs text-ink3">
                      on {l.path} · {l.device} · {ago(l.ts, now)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card label="2 · Company radar" title="Organisations that visited" hint="From the network each visitor came from. Home broadband and mobile data are listed separately below.">
          {data.companies.length === 0 ? (
            <Empty>No company, college or office networks yet. They show up here when someone visits from one.</Empty>
          ) : (
            <ul className="grid gap-3">
              {data.companies.map((c) => (
                <li key={c.org} className="grid gap-0.5 border-b border-line pb-3 text-sm last:border-0 last:pb-0">
                  <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="font-medium text-ink">{c.org}</span>
                    <span className="font-mono text-xs text-ink3">{ago(c.lastSeen, now)}</span>
                  </p>
                  <p className="text-xs text-ink2">
                    {c.visitors} visitor{c.visitors === 1 ? "" : "s"} · {c.views} views{c.cities ? ` · ${c.cities}` : ""}
                    {c.domain ? ` · ${c.domain}` : ""}
                  </p>
                  <p className="truncate font-mono text-xs text-ink3">
                    {c.paths.slice(0, 4).join("  ")}
                    {c.lastVisitor && (
                      <>
                        {"  "}
                        <VisitorLink id={c.lastVisitor}>journey →</VisitorLink>
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card label="3 · Hot leads" title="People who took a step towards you" hint="Opened your résumé, downloaded Anvil, clicked your email or LinkedIn, or sent the contact form.">
          {data.intentCounts.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {data.intentCounts.map((c) => (
                <span key={c.name} className="rounded-full border border-line px-3 py-1 text-xs text-ink2" title={`${c.clicks} clicks by ${c.visitors} visitors`}>
                  {eventLabel(c.name)} · <span className="font-mono text-ink">{c.visitors}</span>
                </span>
              ))}
            </div>
          )}
          {data.intent.length === 0 ? (
            <Empty>No résumé opens, downloads or contact clicks yet.</Empty>
          ) : (
            <ul className="grid gap-3">
              {data.intent.slice(0, 12).map((e, i) => (
                <li key={i} className="text-sm">
                  <p className="text-ink">
                    <span className="font-medium">{eventLabel(e.name)}</span>
                    <span className="text-ink2"> · {place(e.city, e.country)}</span>
                    {e.org && e.orgKind === "organisation" && <span className="text-ink2"> · {e.org}</span>}
                  </p>
                  <p className="font-mono text-xs text-ink3">
                    {ago(e.ts, now)} · from {e.path} · {e.ip ?? "IP not kept"} · <VisitorLink id={e.visitor}>journey →</VisitorLink>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card label="4 · They came back" title="Returning visitors" hint="Same browser on two or more different days. A recruiter coming back is a good sign.">
          {data.returning.length === 0 ? (
            <Empty>Nobody has come back on a second day yet.</Empty>
          ) : (
            <ul className="grid gap-3">
              {data.returning.map((r) => (
                <li key={r.visitor} className="text-sm">
                  <p className="text-ink">
                    <VisitorLink id={r.visitor}>{place(r.city, r.country)}</VisitorLink>
                    {r.org && <span className="text-ink2"> · {r.org}</span>}
                  </p>
                  <p className="font-mono text-xs text-ink3">
                    {r.days} days · {r.views} views · first {fmtDate(r.firstSeen)} · last {ago(r.lastSeen, now)} · {r.device}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card label="5 · What they actually read" title="Pages, by real attention" hint="Views, average time on the page and how far people scrolled." className="lg:col-span-2">
          {data.pages.length === 0 ? (
            <Empty>No page views yet.</Empty>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="label pb-3 font-normal">Page</th>
                    <th className="label pb-3 text-right font-normal">Visitors</th>
                    <th className="label pb-3 text-right font-normal">Views</th>
                    <th className="label pb-3 text-right font-normal">Avg read</th>
                    <th className="label pb-3 pl-4 font-normal">Scrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pages.map((p) => (
                    <tr key={p.path} className="border-t border-line">
                      <td className="py-2.5 pr-3 font-mono text-xs text-ink">{p.path}</td>
                      <td className="py-2.5 text-right tabular-nums">{p.visitors}</td>
                      <td className="py-2.5 text-right tabular-nums text-ink2">{p.views}</td>
                      <td className="py-2.5 text-right tabular-nums text-ink2">{fmtMs(p.avgMs)}</td>
                      <td className="py-2.5 pl-4">
                        {p.avgScroll == null ? (
                          <span className="text-ink3">—</span>
                        ) : (
                          <span className="flex items-center gap-2" title={`Average scroll depth ${Math.round(p.avgScroll)}%`}>
                            <span className="h-1.5 w-20 overflow-hidden rounded-full bg-line" aria-hidden="true">
                              <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.max(2, p.avgScroll)}%` }} />
                            </span>
                            <span className="font-mono text-xs tabular-nums text-ink2">{Math.round(p.avgScroll)}%</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Supporting detail */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card label="Places" title="Where visitors are">
          {data.places.length === 0 ? (
            <Empty>No locations yet.</Empty>
          ) : (
            <BarList
              rows={data.places.map((p) => ({
                label: place(p.city, p.country),
                value: p.visitors,
                title: `${[p.city, p.region, p.country].filter(Boolean).join(", ")}: ${p.visitors} visitors, ${p.views} views`,
              }))}
            />
          )}
        </Card>
        <Card label="Sources" title="How they found you">
          {data.sources.length === 0 ? (
            <Empty>No visits yet.</Empty>
          ) : (
            <BarList rows={data.sources.map((s) => ({ label: s.source, value: s.visitors, title: `${s.source}: ${s.visitors} visitors` }))} />
          )}
        </Card>
        <Card label="Devices" title="What they used">
          {data.tech.length === 0 ? (
            <Empty>No visits yet.</Empty>
          ) : (
            <BarList
              rows={data.tech.map((t) => ({
                label: `${t.browser} · ${t.os}`,
                value: t.visitors,
                note: t.device ?? undefined,
                title: `${t.browser} on ${t.os} (${t.device}): ${t.visitors} visitors`,
              }))}
            />
          )}
        </Card>
      </div>

      {data.networks.length > 0 && (
        <Card label="Networks" title="Home, mobile and cloud networks" hint="These name the internet provider, not the person or their employer.">
          <ul className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {data.networks.map((n) => (
              <li key={n.org} className="flex justify-between gap-3">
                <span className="min-w-0 truncate text-ink">{n.org}</span>
                <span className="shrink-0 font-mono text-xs text-ink3">
                  {n.visitors} · {KIND_NOTE[n.kind]}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card label="Visitor log" title="Every visit, newest first" hint="One row per visit. Tap a place to see that visitor's whole journey across visits.">
        {data.sessions.length === 0 ? (
          <Empty>No visits yet. Open your site in another browser (not signed in here) to test.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="text-left">
                  {["When", "Who / where", "IP", "Device", "Came from", "Pages", "Read", "Did"].map((h) => (
                    <th key={h} className="label pb-3 pr-4 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.sessions.map((s) => (
                  <tr key={s.session} className="border-t border-line align-top">
                    <td className="whitespace-nowrap py-2.5 pr-4 text-ink2">{fmtDate(s.started)}</td>
                    <td className="py-2.5 pr-4">
                      <VisitorLink id={s.visitor}>{place(s.city, s.country)}</VisitorLink>
                      {s.org && <p className="text-xs text-ink3">{s.org}</p>}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-ink2">{s.ip ?? "not kept (GPC)"}</td>
                    <td className="whitespace-nowrap py-2.5 pr-4 text-xs text-ink2">
                      {s.browser} · {s.os}
                      <br />
                      {s.device}
                    </td>
                    <td className="max-w-[12rem] truncate py-2.5 pr-4 text-xs text-ink2" title={s.referrer ?? "Direct"}>
                      {s.referrer ? s.referrer.replace(/^https?:\/\/(www\.)?/, "") : "Direct"}
                    </td>
                    <td className="max-w-[16rem] py-2.5 pr-4 font-mono text-xs text-ink2">{s.paths.join(" → ")}</td>
                    <td className="whitespace-nowrap py-2.5 pr-4 font-mono text-xs text-ink2">{fmtMs(s.readMs)}</td>
                    <td className="py-2.5 text-xs text-ink2">{s.events.map(eventLabel).join(", ") || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
