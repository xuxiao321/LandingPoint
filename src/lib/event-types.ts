export type CityEvent = { id: string; citySlug: string; name: string; category: "Business" | "Sports" | "Music"; startDate: string; endDate?: string; time?: string; venue: string; url: string; source: string; checkedAt: string };
export function isUpcoming(event: CityEvent, today: string) { return event.startDate >= today; }
export function safeEventUrl(value: string) { try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; } }
