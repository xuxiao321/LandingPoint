"use client";
import { useState } from "react";
import Link from "next/link";
import { useAccount, guestSavedCities } from "@/components/account-provider";
import { browserDatabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { cities } from "@/lib/data";
import { SaveCityButton } from "@/components/city/save-city-button";

export function AccountPanel() {
  const account = useAccount();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function run(action: () => Promise<void>, success = "") {
    setBusy(true); setMessage("");
    try { await action(); setMessage(success); } catch (error) { setMessage(error instanceof Error ? error.message : "Please retry."); } finally { setBusy(false); }
  }
  const selected = cities.filter(city => account.savedCities.includes(city.slug));
  return <div className="grid gap-8">
    <header><p className="text-sm font-semibold text-[var(--accent)]">Your LandingPoint</p><h1 className="mt-2 text-3xl font-bold">A place for your next move</h1><p className="mt-2 text-[var(--muted)]">Keep your shortlist, preferences and private city notes together.</p></header>
    {account.loading && <p role="status">Loading your account…</p>}
    {account.error && <div role="alert"><p>{account.error}</p><Button variant="outline" onClick={() => void account.refresh()}>Retry</Button></div>}
    {!account.configured && <div className="rounded-xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-semibold">Cloud accounts are not connected yet</h2><p className="mt-1 text-sm">You can still browse and save cities on this browser. The site owner needs to configure Supabase and run the account migration before email sign-in is available.</p></div>}
    {account.configured && !account.user && !account.loading && <form className="grid max-w-md gap-3 rounded-2xl border border-[var(--border)] bg-white p-6" onSubmit={e => { e.preventDefault(); void run(async () => {
      const db = browserDatabase()!;
      const { error } = sent ? await db.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" }) : await db.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/account` } });
      if (error) throw error;
      if (!sent) setSent(true);
    }, sent ? "Signed in." : "Check your email for a sign-in code or link."); }}>
      <h2 className="text-xl font-semibold">Sign in or register</h2><p className="text-sm text-[var(--muted)]">New here? Verifying your email creates your account. No password needed.</p>
      <Label htmlFor="account-email">Email</Label><Input id="account-email" type="email" autoComplete="email" required maxLength={254} disabled={sent || busy} value={email} onChange={e => setEmail(e.target.value)} />
      {sent && <><Label htmlFor="account-code">Email code</Label><Input id="account-code" autoComplete="one-time-code" inputMode="numeric" required minLength={6} maxLength={10} value={code} onChange={e => setCode(e.target.value)} /></>}
      <Button disabled={busy}>{busy ? "Please wait…" : sent ? "Verify code" : "Email me a sign-in code"}</Button>
      {sent && <Button type="button" variant="ghost" disabled={busy} onClick={() => { setSent(false); setCode(""); }}>Change email / request another code</Button>}
    </form>}
    {account.user && <section className="rounded-2xl border border-[var(--border)] bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">{account.user.email}</h2><p className="text-sm text-[var(--muted)]">Your account is private. {account.data && `Joined ${account.data.joinedAt.slice(0, 10)}`}</p></div><Button variant="outline" disabled={busy} onClick={() => void run(async () => { const { error } = await browserDatabase()!.auth.signOut(); if (error) throw error; })}>Sign out</Button></div>
      <Button className="mt-4" variant="outline" disabled={busy || account.loading || !account.data} onClick={() => void run(async () => {
        const slugs = guestSavedCities().filter(slug => cities.some(c => c.slug === slug));
        if (!slugs.length) throw new Error("No browser-only cities to import.");
        await account.mutate({ action: "import-cities", slugs });
      }, "Browser favorites imported. Your local copy is kept.")}>Import favorites from this browser</Button>
    </section>}
    {message && <p role="status" className="rounded-lg bg-[var(--accent-soft)] p-3 text-sm">{message}</p>}
    <section><h2 className="mb-4 text-xl font-semibold">Saved cities {account.loading ? "" : `(${selected.length})`}</h2>
      {!selected.length && !account.loading && !account.error && <p className="text-[var(--muted)]">No saved cities yet. <Link href="/recommendations" className="underline">Explore cities</Link> to start your shortlist.</p>}
      <div className="grid gap-3 sm:grid-cols-2">{selected.map(city => <div key={city.slug} className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-white p-4"><div><Link className="font-semibold hover:underline" href={`/city/${city.slug}`}>{city.name}</Link><p className="text-sm text-[var(--muted)]">{city.country}</p></div><SaveCityButton citySlug={city.slug} cityName={city.name} /></div>)}</div>
    </section>
    {account.data && <section className="rounded-2xl border border-[var(--border)] bg-white p-6"><h2 className="text-xl font-semibold">Saved search preferences</h2>{account.data.preferences ? <><p className="mt-2">${account.data.preferences.budget.toLocaleString()} monthly budget · {account.data.preferences.workType}</p><p className="mt-1 text-sm text-[var(--muted)]">{account.data.preferences.lifestyles.join(" · ") || "No lifestyle priorities selected"}</p><div className="mt-4 flex gap-3"><Button asChild variant="outline"><Link href="/">Use / edit preferences</Link></Button><Button variant="ghost" disabled={busy} onClick={() => void run(() => account.mutate({ action: "delete-preferences" }), "Preferences cleared.")}>Clear preferences</Button></div></> : <p className="mt-2 text-sm">Save your preferences from the <Link href="/" className="underline">city search form</Link>.</p>}</section>}
    {account.data && <section><h2 className="mb-3 text-xl font-semibold">Private city drafts ({account.data.drafts.length})</h2><p className="mb-4 text-sm text-[var(--muted)]">Only you can see these notes. They do not affect city scores.</p><div className="grid gap-3">{account.data.drafts.map(draft => <details key={`${draft.city_slug}-${draft.kind}`} className="rounded-xl border bg-white p-4"><summary className="cursor-pointer font-medium">{cities.find(c => c.slug === draft.city_slug)?.name ?? draft.city_slug} · {draft.kind} · {draft.updated_at.slice(0, 10)}</summary><dl className="my-3 grid gap-2">{Object.entries(draft.content).map(([key, value]) => <div key={key}><dt className="text-xs text-[var(--muted)]">{key}</dt><dd className="whitespace-pre-wrap break-words text-sm">{value}</dd></div>)}</dl><button disabled={busy} className="text-sm text-red-700 underline" onClick={() => { if (window.confirm("Delete this private draft?")) void run(() => account.mutate({ action: "delete-draft", citySlug: draft.city_slug, kind: draft.kind }), "Draft deleted."); }}>Delete draft</button></details>)}</div></section>}
  </div>;
}
