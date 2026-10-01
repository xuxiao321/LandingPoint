import {
  cities,
  lifestyleOptions,
  passportCountries,
  workTypes,
} from "@/lib/data";
import { normalizePriorities } from "@/lib/priority-weights";
export function validCity(value) {
  return (
    typeof value === "string" && cities.some((city) => city.slug === value)
  );
}
export function parsePreferences(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid preferences.");
  const p = value;
  if (
    typeof p.budget !== "number" ||
    !Number.isFinite(p.budget) ||
    p.budget < 1 ||
    p.budget > 1000000 ||
    typeof p.passport !== "string" ||
    !passportCountries.some((c) => c.name === p.passport) ||
    typeof p.workType !== "string" ||
    !workTypes.includes(p.workType) ||
    typeof p.needsSponsorship !== "string" ||
    !["Yes", "No", "Maybe Later"].includes(p.needsSponsorship) ||
    !Array.isArray(p.lifestyles) ||
    p.lifestyles.length > 16 ||
    !p.lifestyles.every(
      (v) => typeof v === "string" && lifestyleOptions.includes(v),
    )
  ) {
    throw new Error("Choose a valid budget, passport, goal and priorities.");
  }
  return {
    budget: p.budget,
    passport: p.passport,
    workType: p.workType,
    needsSponsorship: p.needsSponsorship,
    // Persist one canonical copy of each selection, even if an older client
    // submits duplicate values.
    lifestyles: [...new Set(p.lifestyles)],
    priorities: normalizePriorities(p.priorities, p.lifestyles),
  };
}
export function parseDraft(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid draft.");
  const data = value;
  if (
    !validCity(data.citySlug) ||
    !["experience", "local-signal"].includes(String(data.kind))
  )
    throw new Error("Invalid city or draft type.");
  if (
    !data.content ||
    typeof data.content !== "object" ||
    Array.isArray(data.content)
  )
    throw new Error("Invalid draft content.");
  const allowed =
    data.kind === "experience"
      ? ["duration", "cost", "recommend", "visaPath", "pros", "cons", "notes"]
      : [
          "resident",
          "years",
          "rentTrend",
          "safetyTrend",
          "trafficTrend",
          "costTrend",
        ];
  const content = {};
  for (const [key, val] of Object.entries(data.content)) {
    // Whitelisting prevents arbitrary JSON fields from becoming durable data.
    if (!allowed.includes(key) || typeof val !== "string" || val.length > 2000)
      throw new Error("Draft fields must be at most 2,000 characters.");
    content[key] = val.trim();
  }
  if (!Object.keys(content).length) throw new Error("Draft is empty.");
  return { city_slug: data.citySlug, kind: String(data.kind), content };
}
