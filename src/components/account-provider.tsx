"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { AccountData } from "@/lib/account-types";
import { accountRequest, browserDatabase } from "@/lib/supabase-browser";
const guestKey = "landingpoint.savedCities";
export function guestSavedCities(): string[] {
  try { const value = JSON.parse(localStorage.getItem(guestKey) ?? "[]"); return Array.isArray(value) ? value.filter(v => typeof v === "string").slice(0, 100) : []; } catch { return []; }
}
type State = { user: User | null; data: AccountData | null; loading: boolean; error: string; savedCities: string[]; configured: boolean; refresh: () => Promise<void>; mutate: (body: unknown) => Promise<void>; toggleCity: (slug: string) => Promise<void> };
const Context = createContext<State | null>(null);
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guest, setGuest] = useState<string[]>([]);
  const identity = useRef<string | null>(null);
  const revision = useRef(0);
  const refresh = useCallback(async () => {
    const current = identity.current;
    if (!current) return;
    const version = ++revision.current;
    setLoading(true); setError("");
    try { const result: AccountData = await accountRequest(); if (identity.current === current && revision.current === version) setData(result); }
    catch (error) { if (identity.current === current && revision.current === version) setError(error instanceof Error ? error.message : "Unable to load account."); }
    finally { if (identity.current === current && revision.current === version) setLoading(false); }
  }, []);
  useEffect(() => {
    setGuest(guestSavedCities());
    const sync = () => setGuest(guestSavedCities());
    window.addEventListener("storage", sync);
    const db = browserDatabase();
    if (!db) { setLoading(false); return () => window.removeEventListener("storage", sync); }
    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
      const next = session?.user ?? null;
      const changed = identity.current !== (next?.id ?? null);
      identity.current = next?.id ?? null; setUser(next);
      if (changed || !next) { revision.current++; setData(null); setError(""); }
      if (!next) setLoading(false);
      else if (changed) setTimeout(() => { void refresh(); }, 0);
    });
    function dispose() { subscription.unsubscribe(); window.removeEventListener("storage", sync); revision.current++; identity.current = null; }
    return dispose;
  }, [refresh]);
  async function mutate(body: unknown) { await accountRequest("POST", body); await refresh(); }
  async function toggleCity(slug: string) {
    if (user) {
      if (!data) throw new Error("Load your account before changing saved cities.");
      await mutate({ action: data.savedCities.includes(slug) ? "remove-city" : "save-city", citySlug: slug });
    } else {
      const current = guestSavedCities();
      const next = current.includes(slug) ? current.filter(s => s !== slug) : [...new Set([...current, slug])];
      localStorage.setItem(guestKey, JSON.stringify(next)); setGuest(next);
    }
  }
  return <Context.Provider value={{ user, data, loading, error, savedCities: user ? data?.savedCities ?? [] : guest, configured: !!browserDatabase(), refresh, mutate, toggleCity }}>{children}</Context.Provider>;
}
export function useAccount() { const account = useContext(Context); if (!account) throw new Error("AccountProvider missing"); return account; }
