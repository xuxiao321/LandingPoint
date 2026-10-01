"use client";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase-config";
let client;
export function browserDatabase() {
  const config = supabaseConfig();
  if (!config) return null;
  // Reuse the browser client so auth storage and refresh state are shared.
  return (client ??= createClient(config.url, config.key));
}
export async function accountRequest(method = "GET", body) {
  const client = browserDatabase();
  const session = client ? (await client.auth.getSession()).data.session : null;
  if (!session) throw new Error("Please sign in to sync your account.");
  // The route verifies this bearer token again; the browser never chooses a user ID.
  const response = await fetch("/api/account", {
    method,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "Unable to save. Please retry.");
  return result;
}
