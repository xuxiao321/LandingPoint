import snapshot from "@/data/city-rent-burden.json";
export type RentBurden = { share: number; geography: string; period: string; sourceUrl: string };
export const rentBurdenByCity: Record<string, RentBurden> = snapshot;
export function rentAffordabilityScore(share: number) {
  if (!Number.isFinite(share) || share < 0 || share > 100) return undefined;
  // Product scale: <=20% -> 10; >=50% -> 0. Higher is more affordable.
  return Math.round(Math.max(0, Math.min(10, (50 - share) / 3)) * 10) / 10;
}
