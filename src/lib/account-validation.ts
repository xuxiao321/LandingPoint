import { cities, lifestyleOptions, passportCountries, workTypes } from "@/lib/data";
import type { SavedPreferences } from "@/lib/account-types";
import { normalizePriorities } from "@/lib/priority-weights";
export function validCity(value: unknown): value is string {
  return typeof value === "string" && cities.some(city => city.slug === value);
}
export function parsePreferences(value: unknown): SavedPreferences {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid preferences.");
  const p = value as Record<string, unknown>;
  if (typeof p.budget !== "number" || !Number.isFinite(p.budget) || p.budget < 1 || p.budget > 1000000 ||
    typeof p.passport !== "string" || !passportCountries.some(c => c.name === p.passport) ||
    typeof p.workType !== "string" || !(workTypes as readonly string[]).includes(p.workType) ||
    typeof p.needsSponsorship !== "string" || !["Yes", "No", "Maybe Later"].includes(p.needsSponsorship) ||
    !Array.isArray(p.lifestyles) || p.lifestyles.length > 16 ||
    !p.lifestyles.every(v => typeof v === "string" && (lifestyleOptions as readonly string[]).includes(v))) {
    throw new Error("Choose a valid budget, passport, goal and priorities.");
  }
  return { budget: p.budget, passport: p.passport, workType: p.workType, needsSponsorship: p.needsSponsorship, lifestyles: [...new Set(p.lifestyles as string[])], priorities: normalizePriorities(p.priorities, p.lifestyles as string[]) };
}
export function parseDraft(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid draft.");
  const data = value as Record<string, unknown>;
  if (!validCity(data.citySlug) || !["experience", "local-signal"].includes(String(data.kind))) throw new Error("Invalid city or draft type.");
  if (!data.content || typeof data.content !== "object" || Array.isArray(data.content)) throw new Error("Invalid draft content.");
  const allowed = data.kind === "experience" ? ["duration", "cost", "recommend", "visaPath", "pros", "cons", "notes"] : ["resident", "years", "rentTrend", "safetyTrend", "trafficTrend", "costTrend"];
  const content: Record<string, string> = {};
  for (const [key, val] of Object.entries(data.content)) {
    if (!allowed.includes(key) || typeof val !== "string" || val.length > 2000) throw new Error("Draft fields must be at most 2,000 characters.");
    content[key] = val.trim();
  }
  if (!Object.keys(content).length) throw new Error("Draft is empty.");
  return { city_slug: data.citySlug, kind: String(data.kind), content };
}
