export const residencies = ["Current resident", "Former resident", "Visitor"];
export const durations = ["Under 3 months", "3–12 months", "1–3 years", "3+ years"];
export const reportReasons = ["Spam", "Harassment", "Personal information", "Misleading content"];
export function parseReview(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Invalid review.");
  const p = value as Record<string, unknown>;
  if (typeof p.displayName !== "string" || p.displayName.trim().length < 2 || p.displayName.trim().length > 40 ||
    typeof p.body !== "string" || p.body.trim().length < 30 || p.body.trim().length > 2000 ||
    typeof p.residency !== "string" || !residencies.includes(p.residency) ||
    typeof p.duration !== "string" || !durations.includes(p.duration)) throw new Error("Use a name of 2–40 characters and a review of 30–2,000 characters, and select your residence details.");
  return { display_name: p.displayName.trim(), body: p.body.trim(), residency: p.residency, duration: p.duration };
}
