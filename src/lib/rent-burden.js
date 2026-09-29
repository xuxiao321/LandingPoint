import snapshot from "@/data/city-rent-burden.json";
export const rentBurdenByCity = snapshot;
export function rentAffordabilityScore(share) {
  if (!Number.isFinite(share) || share < 0 || share > 100) return undefined;
  // Product scale: <=20% -> 10; >=50% -> 0. Higher is more affordable.
  return Math.round(Math.max(0, Math.min(10, (50 - share) / 3)) * 10) / 10;
}
