import observations from "@/data/city-population.json";
export const populationByCity = observations;
export function populationLabel(fact) {
  const value = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(fact.value);
  return fact.kind === "Rounded estimate" ? `≈${value}` : value;
}
