import observations from "@/data/city-population.json";

export type PopulationObservation = {
  value: number;
  period: string;
  geography: string;
  kind: string;
  sourceUrl: string;
  note: string;
  reviewedAt: string;
};

export const populationByCity: Record<string, PopulationObservation> = observations;

export function populationLabel(fact: PopulationObservation) {
  const value = new Intl.NumberFormat("en-US", {
    notation: "compact", maximumFractionDigits: 2,
  }).format(fact.value);
  return fact.kind === "Rounded estimate" ? `≈${value}` : value;
}
