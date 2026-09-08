"use client";
import { useState } from "react";
import Link from "next/link";
import { useAccount } from "@/components/account-provider";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/field";
export function PrivateCityDraft({ citySlug }: { citySlug: string }) {
  const account = useAccount();
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const saved = account.data?.drafts.find(draft => draft.city_slug === citySlug && draft.kind === "experience");
  return <details className="rounded-2xl border border-[var(--border)] bg-white p-5"><summary className="cursor-pointer font-semibold">My private city notes</summary><p className="mt-2 text-sm text-[var(--muted)]">Keep research notes just for yourself. These are not public reviews.</p>
    {!account.user ? <Link href="/account" className="mt-3 inline-block text-sm underline">Sign in to save notes</Link> : <form className="mt-4 grid gap-3" onSubmit={async event => { event.preventDefault(); setBusy(true); setMessage(""); try { await account.mutate({ action: "draft", citySlug, kind: "experience", content: { notes } }); setMessage("Private notes saved."); } catch (e) { setMessage(e instanceof Error ? e.message : "Unable to save."); } finally { setBusy(false); } }}>
      {saved && <Button type="button" variant="outline" size="sm" onClick={() => setNotes(saved.content.notes ?? "")}>Restore saved notes</Button>}
      <Label htmlFor="private-notes">Your notes</Label><Textarea id="private-notes" required maxLength={2000} value={notes} onChange={e => setNotes(e.target.value)} />
      <Button disabled={busy || account.loading}>{busy ? "Saving…" : "Save private notes"}</Button>{message && <p role="status" className="text-sm">{message}</p>}
    </form>}
  </details>;
}
