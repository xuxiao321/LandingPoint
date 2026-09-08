import { getCity } from "@/lib/data";
import curated from "@/data/city-events.json";
import { isUpcoming, safeEventUrl, type CityEvent } from "@/lib/event-types";
export const dynamic = "force-dynamic";
const countries: Record<string, string> = { "United States": "US", Canada: "CA", "United Kingdom": "GB", Ireland: "IE", France: "FR", Germany: "DE", Netherlands: "NL", Singapore: "SG", Japan: "JP", "South Korea": "KR", Australia: "AU", "United Arab Emirates": "AE", Mexico: "MX", Brazil: "BR" };
type TicketEvent = { id: string; name: string; url: string; dates?: { start?: { dateTime?: string; localDate?: string; localTime?: string }; status?: { code?: string } }; classifications?: { segment?: { name?: string } }[]; _embedded?: { venues?: { name?: string; city?: { name?: string } }[] } };
type Result = { events: CityEvent[]; live: boolean; note: string; fetchedAt: string; cityName: string; listingUrls: { ticketmaster: string; eventbrite: string } };
// Bound cache cardinality to catalog slugs and coalesce concurrent requests per process.
const cache = new Map<string, { expires: number; result: Result }>();
const pending = new Map<string, Promise<Result>>();
async function fetchEvents(slug: string): Promise<Result> {
  const city = getCity(slug)!;
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const events = (curated as CityEvent[]).filter(event => event.citySlug === slug && isUpcoming(event, today) && safeEventUrl(event.url));
  const query = `${city.name} ${city.country}`;
  const listingUrls = {
    ticketmaster: `https://www.ticketmaster.com/discover?keyword=${encodeURIComponent(query)}`,
    eventbrite: `https://www.eventbrite.com/d/online/events/?q=${encodeURIComponent(query)}`,
  };
  const key = process.env.TICKETMASTER_API_KEY;
  const country = countries[city.country];
  if (!key || !country) return { events, live: false, cityName: city.name, listingUrls, fetchedAt: now.toISOString(), note: "Our live listings feed is not connected yet. Organizer-checked events appear here when available; use the external listings below for current city results." };
  try {
    const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
    url.search = new URLSearchParams({ apikey: key, city: city.name === "New York City" ? "New York" : city.name, countryCode: country, startDateTime: now.toISOString().replace(/\.\d{3}Z$/, "Z"), sort: "date,asc", size: "50", includeTBA: "no", includeTBD: "no", includeTest: "no" }).toString();
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Provider unavailable");
    const data = await response.json() as { _embedded?: { events?: TicketEvent[] } };
    for (const item of data._embedded?.events ?? []) {
      const category = item.classifications?.[0]?.segment?.name;
      const date = item.dates?.start?.localDate;
      const venue = item._embedded?.venues?.[0];
      if ((category !== "Music" && category !== "Sports") || !date || date < today || !safeEventUrl(item.url) || ["cancelled", "canceled", "postponed"].includes(item.dates?.status?.code ?? "")) continue;
      if (item.dates?.start?.dateTime && Date.parse(item.dates.start.dateTime) < now.getTime()) continue;
      events.push({ id: `tm-${item.id}`, citySlug: slug, name: item.name, category, startDate: date, time: item.dates?.start?.localTime, venue: venue?.name ?? "Venue to be confirmed", url: item.url, source: "Ticketmaster", checkedAt: now.toISOString() });
    }
    return { events: [...new Map(events.map(event => [event.id, event])).values()].sort((a, b) => a.startDate.localeCompare(b.startDate)), live: true, cityName: city.name, listingUrls, fetchedAt: now.toISOString(), note: "Music and sports: Ticketmaster city listings (limited coverage, not ranked by event size). Business: selected organizer-checked events. Confirm schedule and tickets with the organizer." };
  } catch { return { events, live: false, cityName: city.name, listingUrls, fetchedAt: now.toISOString(), note: "Live listings are temporarily unavailable. Organizer-checked events remain visible; use the external listings below for current city results." }; }
}
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCity(slug)) return Response.json({ error: "Unknown city." }, { status: 404 });
  const hit = cache.get(slug);
  let result = hit && hit.expires > Date.now() ? hit.result : undefined;
  if (!result) {
    let work = pending.get(slug);
    if (!work) { work = fetchEvents(slug); pending.set(slug, work); }
    try { result = await work; cache.set(slug, { result, expires: Date.now() + (result.live ? 15 * 60000 : 60000) }); } finally { pending.delete(slug); }
  }
  const today = new Date().toISOString().slice(0, 10);
  return Response.json({ ...result, events: result.events.filter(event => isUpcoming(event, today)) }, { headers: { "Cache-Control": "public, max-age=60" } });
}
