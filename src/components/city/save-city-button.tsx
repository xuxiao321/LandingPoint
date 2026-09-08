"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/components/account-provider";
export function SaveCityButton({ citySlug, cityName }: { citySlug: string; cityName: string }) {
  const account = useAccount();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const saved = account.savedCities.includes(citySlug);
  return <div><Button type="button" variant={saved ? "accent" : "outline"} disabled={busy || account.loading || !!(account.user && !account.data)}
    aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${cityName}`}
    onClick={async () => { setBusy(true); setError(""); try { await account.toggleCity(citySlug); } catch (e) { setError(e instanceof Error ? e.message : "Could not save."); } finally { setBusy(false); } }}>
    <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} aria-hidden="true" />{busy ? "Saving…" : saved ? "Saved" : "Save city"}
  </Button><p className="mt-1 text-xs text-[var(--muted)]">{account.user ? "Account favorites" : "Saved on this browser"}</p>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}</div>;
}
