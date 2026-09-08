"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase-config";
let client: SupabaseClient | undefined;
export function browserDatabase() {
  const config = supabaseConfig();
  if (!config) return null;
  return client ??= createClient(config.url, config.key);
}
export async function accountRequest(method = "GET", body?: unknown) {
  const client = browserDatabase();
  const session = client ? (await client.auth.getSession()).data.session : null;
  if (!session) throw new Error("Please sign in to sync your account.");
  const response = await fetch("/api/account", {
    method, cache: "no-store", signal: AbortSignal.timeout(15000),
    headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Unable to save. Please retry.");
  return result;
}
