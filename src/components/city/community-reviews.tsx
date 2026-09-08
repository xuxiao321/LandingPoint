"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "@/components/account-provider";
import { browserDatabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { durations, residencies, reportReasons } from "@/lib/review-validation";
type Review = { id: string; user_id: string; display_name: string; residency: string; duration: string; body: string; created_at: string };
export function CommunityReviews({ slug, name }: { slug: string; name: string }) {
  const account = useAccount();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [retry, setRetry] = useState(0);
  const [reportId, setReportId] = useState<string | null>(null);
  const [reason, setReason] = useState(reportReasons[0]);
  const load = useCallback(async (signal: AbortSignal) => {
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/cities/${slug}/reviews?page=${page}`, { signal, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setReviews(data.reviews); setHasMore(data.hasMore);
    } catch (e) { if (!signal.aborted) setError(e instanceof Error ? e.message : "Could not load reviews."); }
    finally { if (!signal.aborted) setLoading(false); }
  }, [slug, page]);
  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, [load, retry]);
  async function submit(body: unknown) {
    const session = (await browserDatabase()?.auth.getSession())?.data.session;
    if (!session) throw new Error("Please sign in first.");
    const response = await fetch(`/api/cities/${slug}/reviews`, { method: "POST", signal: AbortSignal.timeout(15000), headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify(body) });
    const data = await response.json(); if (!response.ok) throw new Error(data.error);
    setPage(0); setRetry(n => n + 1);
  }
  async function run(body: unknown, success: string) {
    setBusy(true); setNotice("");
    try { await submit(body); setNotice(success); setReportId(null); }
    catch (e) { setNotice(e instanceof Error ? e.message : "Unable to save."); }
    finally { setBusy(false); }
  }
  return <section id="community" className="scroll-mt-24 grid gap-5">
    <header><p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">From people who know the place</p><h2 className="mt-2 text-3xl font-bold">Life in {name}</h2><p className="mt-2 text-sm text-[var(--muted)]">Personal experiences, not official data. Residency is self-reported, not independently verified.</p></header>
    {loading && <p role="status">Loading city reviews…</p>}
    {error && <div role="alert" className="rounded-xl border bg-white p-4"><p>{error}</p><Button variant="ghost" onClick={() => setRetry(n => n + 1)}>Retry</Button></div>}
    {!loading && !error && !reviews.length && <p className="rounded-xl border border-dashed p-5 text-[var(--muted)]">No reviews on this page yet. Share an honest account of living or spending time here.</p>}
    {!loading && !error && <div className="grid gap-4 sm:grid-cols-2">{reviews.map(review => <article key={review.id} className="rounded-2xl border border-[var(--border)] bg-white p-5"><div className="flex justify-between gap-3"><h3 className="font-semibold">{review.display_name}</h3><time className="text-xs text-[var(--muted)]" dateTime={review.created_at}>{review.created_at.slice(0, 10)}</time></div><p className="mt-1 text-xs text-[var(--muted)]">{review.residency} · {review.duration} · self-reported</p><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7">{review.body}</p>
      {account.user && <div className="mt-4 flex gap-4 text-xs">{review.user_id === account.user.id && <button disabled={busy} className="underline" onClick={() => { if (window.confirm("Delete your review? This cannot be undone.")) void run({ action: "delete", id: review.id }, "Review deleted."); }}>Delete my review</button>}<button className="underline" disabled={busy} onClick={() => setReportId(review.id)}>Report</button></div>}
      {reportId === review.id && <div className="mt-3 grid gap-2"><Label htmlFor={`report-${review.id}`}>Reason</Label><Select id={`report-${review.id}`} value={reason} onChange={e => setReason(e.target.value)}>{reportReasons.map(r => <option key={r}>{r}</option>)}</Select><Button size="sm" disabled={busy} onClick={() => void run({ action: "report", id: review.id, reason }, "Report recorded for the site owner to review.")}>Send report</Button></div>}
    </article>)}</div>}
    <div className="flex gap-3">{page > 0 && <Button variant="outline" disabled={loading} onClick={() => setPage(n => n - 1)}>Previous</Button>}{hasMore && !error && <Button variant="outline" disabled={loading} onClick={() => setPage(n => n + 1)}>More reviews</Button>}</div>
    {notice && <p role="status" className="rounded-lg bg-[var(--accent-soft)] p-3 text-sm">{notice}</p>}
    {account.user ? <form className="grid gap-3 rounded-2xl border border-[var(--border)] bg-white p-5" onSubmit={e => { e.preventDefault(); const form = new FormData(e.currentTarget); void run({ action: "publish", displayName: form.get("displayName"), residency: form.get("residency"), duration: form.get("duration"), body: form.get("body") }, "Your review is published."); }}>
      <h3 className="text-xl font-semibold">Share your experience</h3><p className="text-sm text-[var(--muted)]">One public review per account per city. No private addresses, contact details, advertising or abusive content. Your email is never displayed.</p>
      <Label htmlFor="review-name">Public display name</Label><Input id="review-name" name="displayName" minLength={2} maxLength={40} required />
      <div className="grid gap-3 sm:grid-cols-2"><div><Label htmlFor="review-residency">Your connection to the city</Label><Select id="review-residency" name="residency">{residencies.map(r => <option key={r}>{r}</option>)}</Select></div><div><Label htmlFor="review-duration">Time spent here</Label><Select id="review-duration" name="duration">{durations.map(r => <option key={r}>{r}</option>)}</Select></div></div>
      <Label htmlFor="review-body">What should someone moving here know?</Label><Textarea id="review-body" name="body" required minLength={30} maxLength={2000} placeholder="What you enjoyed, what was difficult, and practical advice…" />
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" required className="mt-1" />I understand that my display name and review will be public.</label><Button disabled={busy}>{busy ? "Saving…" : "Publish review"}</Button>
    </form> : <p className="text-sm"><Link href="/account" className="font-semibold text-[var(--accent)] underline">Register or sign in</Link> to share your experience or report a review.</p>}
  </section>;
}
