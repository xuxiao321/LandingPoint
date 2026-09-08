// Only birthplace observations share this scoring definition. Citizenship,
// migration-background and permanent-resident measures remain context only.
export function communityScore(fact: { label: string; value: string } | undefined) {
  if (!fact || fact.label !== "Residents born abroad" || !/^\d+(\.\d+)?%$/.test(fact.value)) return undefined;
  const share = Number(fact.value.slice(0, -1));
  if (share < 0 || share > 100) return undefined;
  // Fixed product scale: 0% -> 0, 50% or more -> 10.
  return Math.round(Math.min(10, share / 5) * 10) / 10;
}
