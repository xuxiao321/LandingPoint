import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase-config";
import { parseDraft, parsePreferences, validCity } from "@/lib/account-validation";

export const dynamic = "force-dynamic";
function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", Vary: "Authorization" } });
}
async function handle(request: Request) {
  const config = supabaseConfig();
  if (!config) return json({ error: "Account service is not configured yet." }, 503);
  const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
  if (!token || token.length > 8192) return json({ error: "Please sign in." }, 401);
  // Verify identity with Auth. Never accept a user ID supplied by the browser.
  const db = createClient(config.url, config.key, {
    global: { headers: { Authorization: `Bearer ${token}` }, fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data: { user }, error: authError } = await db.auth.getUser(token);
  if (authError || !user) return json({ error: "Your session expired. Please sign in again." }, 401);
  if (request.method === "GET") {
    const [saved, prefs, drafts] = await Promise.all([
      db.from("account_saved_cities").select("city_slug").eq("user_id", user.id).order("created_at", { ascending: false }),
      db.from("account_preferences").select("preferences").eq("user_id", user.id).maybeSingle(),
      db.from("account_drafts").select("city_slug,kind,content,updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }),
    ]);
    if (saved.error || prefs.error || drafts.error) return json({ error: "Cannot load account data. Check the account database migration or retry." }, 503);
    let preferences = null;
    try { if (prefs.data) preferences = parsePreferences(prefs.data.preferences); } catch { /* Outdated preferences must not break the account. */ }
    return json({ email: user.email ?? "", joinedAt: user.created_at, savedCities: saved.data.map(row => row.city_slug).filter(validCity), preferences, drafts: drafts.data });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "JSON required." }, 415);
  const reader = request.body?.getReader();
  if (!reader) return json({ error: "Request body required." }, 400);
  let text = "";
  const decoder = new TextDecoder();
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16000) { await reader.cancel(); return json({ error: "Request too large." }, 413); }
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  let body;
  try { body = JSON.parse(text); } catch { return json({ error: "Invalid JSON." }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Invalid request." }, 400);
  let result;
  if (body.action === "save-city" || body.action === "remove-city") {
    if (!validCity(body.citySlug)) return json({ error: "Unknown city." }, 400);
    result = body.action === "save-city"
      ? await db.from("account_saved_cities").upsert({ user_id: user.id, city_slug: body.citySlug }, { onConflict: "user_id,city_slug", ignoreDuplicates: true })
      : await db.from("account_saved_cities").delete().eq("user_id", user.id).eq("city_slug", body.citySlug);
  } else if (body.action === "import-cities") {
    if (!Array.isArray(body.slugs) || body.slugs.length > 100 || !body.slugs.every(validCity)) return json({ error: "Invalid city list." }, 400);
    result = await db.from("account_saved_cities").upsert([...new Set<string>(body.slugs)].map(city_slug => ({ user_id: user.id, city_slug })), { onConflict: "user_id,city_slug", ignoreDuplicates: true });
  } else if (body.action === "preferences") {
    try {
      result = await db.from("account_preferences").upsert({ user_id: user.id, preferences: parsePreferences(body.preferences), updated_at: new Date().toISOString() });
    } catch (error) { return json({ error: (error as Error).message }, 400); }
  } else if (body.action === "delete-preferences") {
    result = await db.from("account_preferences").delete().eq("user_id", user.id);
  } else if (body.action === "draft") {
    try {
      result = await db.from("account_drafts").upsert({ user_id: user.id, ...parseDraft(body), updated_at: new Date().toISOString() }, { onConflict: "user_id,city_slug,kind" });
    } catch (error) { return json({ error: (error as Error).message }, 400); }
  } else if (body.action === "delete-draft") {
    if (!validCity(body.citySlug) || !["experience", "local-signal"].includes(body.kind)) return json({ error: "Invalid draft." }, 400);
    result = await db.from("account_drafts").delete().eq("user_id", user.id).eq("city_slug", body.citySlug).eq("kind", body.kind);
  } else return json({ error: "Unknown action." }, 400);
  if (result.error) return json({ error: "Your changes could not be saved. Check database setup or retry." }, 503);
  return json({ ok: true });
}
async function safeHandle(request: Request) {
  try { return await handle(request); }
  catch { return json({ error: "Account service is temporarily unavailable. Please retry." }, 503); }
}
export const GET = safeHandle;
export const POST = safeHandle;
