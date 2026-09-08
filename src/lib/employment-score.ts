import snapshot from "@/data/city-employment.json";
export type EmploymentObservation = { totalJobs: number; jobsPerThousand: number; geography: string; period: string; sourceUrl: string };
export const employmentByCity: Record<string, EmploymentObservation> = snapshot;
export function employmentScore(fact: EmploymentObservation | undefined) {
  if (!fact || !Number.isFinite(fact.totalJobs) || fact.totalJobs <= 0 || !Number.isFinite(fact.jobsPerThousand) || fact.jobsPerThousand < 0) return undefined;
  const clamp = (x: number) => Math.max(0, Math.min(10, x));
  // Product scale, not an official rating: density dominates city size.
  const density = clamp((fact.jobsPerThousand - 400) / 100);
  const scale = clamp(Math.log10(fact.totalJobs / 10000) * 10 / 3);
  return Math.round((density * 0.7 + scale * 0.3) * 10) / 10;
}
