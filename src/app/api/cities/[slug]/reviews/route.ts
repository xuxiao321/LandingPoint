import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase-config";
import { validCity } from "@/lib/account-validation";
import { parseReview, reportReasons } from "@/lib/review-validation";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ slug: string }> };
function json(body: unknown, status = 200) { return Response.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
async function handle(request: Request, context: Context) {
  const { slug } = await context.params;
  if (!validCity(slug)) return json({ error: "Unknown city." }, 404);
  const config = supabaseConfig();
  if (!config) return json({ error: "Community reviews will be available when the account service is connected." }, 503);
  const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
  const db = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false }, global: { ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}), fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) } });
  if (request.method === "GET") {
    const page = Number(new URL(request.url).searchParams.get("page") ?? 0);
    if (!Number.isInteger(page) || page < 0 || page > 1000) return json({ error: "Invalid page." }, 400);
    const { data, error } = await db.from("city_reviews").select("id,user_id,display_name,residency,duration,body,created_at").eq("city_slug", slug).order("created_at", { ascending: false }).order("id").range(page * 10, page * 10 + 10);
    if (error) return json({ error: "Reviews could not be loaded. Please retry later." }, 503);
    return json({ reviews: data.slice(0, 10), hasMore: data.length > 10 });
  }
  if (!token || token.length > 8192) return json({ error: "Sign in to contribute." }, 401);
  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user) return json({ error: "Please sign in again." }, 401);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "JSON required." }, 415);
  const reader = request.body?.getReader();
  if (!reader) return json({ error: "Body required." }, 400);
  let bytes = 0, raw = ""; const decoder = new TextDecoder();
  while (true) { const { done, value } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > 12000) { await reader.cancel(); return json({ error: "Review too large." }, 413); } raw += decoder.decode(value, { stream: true }); }
  let body;
  try { body = JSON.parse(raw + decoder.decode()); } catch { return json({ error: "Invalid JSON." }, 400); }
  if (!body || typeof body !== "object") return json({ error: "Invalid request." }, 400);
  if (body.action === "delete") {
    if (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id)) return json({ error: "Invalid review ID." }, 400);
    const result = await db.from("city_reviews").delete().eq("id", body.id).eq("city_slug", slug).eq("user_id", user.id).select("id");
    if (result.error) return json({ error: "Could not delete review." }, 503);
    return result.data.length ? json({ ok: true }) : json({ error: "Review not found or not yours." }, 404);
  }
  let result;
  if (body.action === "report") {
    if (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id) || !reportReasons.includes(body.reason)) return json({ error: "Invalid report." }, 400);
    const existing = await db.from("city_reviews").select("id").eq("id", body.id).eq("city_slug", slug).maybeSingle();
    if (!existing.data) return json({ error: "Review not found." }, 404);
    result = await db.from("review_reports").insert({ review_id: body.id, user_id: user.id, reason: body.reason });
  } else if (body.action === "publish") {
    let review;
    try { review = parseReview(body); } catch (error) { return json({ error: (error as Error).message }, 400); }
    result = await db.from("city_reviews").insert({ ...review, city_slug: slug, user_id: user.id });
  } else return json({ error: "Unknown action." }, 400);
  if (result.error?.code === "23505") return json({ error: body.action === "report" ? "You already reported this review." : "You already reviewed this city. Delete your previous review before posting another." }, 409);
  if (result.error?.code === "P0001") return json({ error: "Submission limit reached. Please try again next hour." }, 429);
  if (result.error) return json({ error: "Could not save your submission. Please retry." }, 503);
  return json({ ok: true });
}
async function safeHandle(request: Request, context: Context) { try { return await handle(request, context); } catch { return json({ error: "Community service is temporarily unavailable." }, 503); } }
export const GET = safeHandle;
export const POST = safeHandle;
