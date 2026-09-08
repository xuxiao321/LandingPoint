"use client";
import { useEffect, useState } from "react";
import type { CityEvent } from "@/lib/event-types";
import { Button } from "@/components/ui/button";
export function UpcomingEvents({ slug }: { slug: string }) {
  const [data, setData] = useState<{ events: CityEvent[]; note: string; fetchedAt: string; cityName: string; live: boolean; listingUrls: { ticketmaster: string; eventbrite: string } } | null>(null);
  const [category, setCategory] = useState("All");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => { const controller = new AbortController(); setError(""); setData(null);
    void fetch(`/api/cities/${slug}/events`, { signal: controller.signal }).then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.error); setData(result); }).catch(e => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Events unavailable."); });
    return () => controller.abort();
  }, [slug, retry]);
  const filtered = data?.events.filter(event => category === "All" || event.category === category) ?? [];
  return <section id="events" className="scroll-mt-24 grid gap-4"><header><p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">What’s on</p><h2 className="mt-2 text-3xl font-bold">Upcoming events</h2><p className="mt-2 text-sm text-[var(--muted)]">Business gatherings, live music and sports. Dates and times are local to the venue.</p></header>
    <div className="flex flex-wrap gap-2" aria-label="Filter events">{["All", "Business", "Sports", "Music"].map(value => <Button key={value} variant={category === value ? "accent" : "outline"} size="sm" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</Button>)}</div>
    {!data && !error && <p role="status">Loading events…</p>}{error && <p role="alert">{error}</p>}
    {data && <><p className="text-xs leading-5 text-[var(--muted)]">{data.note}</p>{!filtered.length && <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-5"><p className="font-semibold">No verified {category === "All" ? "upcoming events" : category.toLowerCase() + " events"} are listed for {data.cityName} yet.</p><p className="mt-1 text-sm leading-6 text-[var(--muted)]">That means LandingPoint has no confirmed listing to show—not that nothing is happening in the city.</p><div className="mt-4 flex flex-wrap gap-3"><a href={data.listingUrls.ticketmaster} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[var(--accent)] underline">Browse Ticketmaster ↗</a><a href={data.listingUrls.eventbrite} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[var(--accent)] underline">Browse Eventbrite ↗</a></div></div>}<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.slice(0, 12).map(event => <article key={event.id} className="rounded-2xl border border-[var(--border)] bg-white p-5"><p className="text-xs font-semibold text-[var(--accent)]">{event.category} · {event.startDate}{event.endDate && ` – ${event.endDate}`}</p><h3 className="mt-2 text-lg font-semibold">{event.name}</h3><p className="mt-2 text-sm text-[var(--muted)]">{event.venue}{event.time && ` · ${event.time.slice(0, 5)}`}</p><a href={event.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] underline">Event details ↗</a><p className="mt-2 text-xs text-[var(--muted)]">{event.source} · checked {event.checkedAt.slice(0, 10)}</p></article>)}</div></>}
    <div><Button size="sm" variant="ghost" onClick={() => setRetry(n => n + 1)}>Refresh events</Button><p className="mt-1 text-xs text-[var(--muted)]">Listings may be cached for up to 15 minutes. Availability and prices are confirmed on the event website.</p></div>
  </section>;
}
